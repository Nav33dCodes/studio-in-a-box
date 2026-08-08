import Groq from 'groq-sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize MCP
let mcpClient;
let mcpTools = [];
// Map safe function names back to real MCP names (Groq/OpenAI has strict naming rules)
const toolNameMap = new Map();

async function setupMcp() {
    console.log("Starting ClickHouse MCP Server subprocess...");
    
    // Launch the official ClickHouse MCP server
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@clickhouse/mcp-server"],
        env: {
            ...process.env,
            CLICKHOUSE_URL: process.env.CLICKHOUSE_URL,
            CLICKHOUSE_USERNAME: process.env.CLICKHOUSE_USERNAME,
            CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD
        }
    });

    mcpClient = new Client({ name: "studio-in-a-box", version: "1.0.0" }, { capabilities: {} });
    await mcpClient.connect(transport);
    console.log("Connected to ClickHouse MCP Server!");

    // Fetch and map tools for Groq (OpenAI format)
    const toolsResponse = await mcpClient.listTools();
    mcpTools = toolsResponse.tools.map(t => {
        // Function names only allow letters, numbers, and underscores
        const safeName = t.name.replace(/[^a-zA-Z0-9_]/g, '_');
        toolNameMap.set(safeName, t.name);
        
        const params = { ...t.inputSchema };
        delete params.$schema;

        return {
            type: "function",
            function: {
                name: safeName,
                description: t.description,
                parameters: params
            }
        };
    });
    console.log(`Loaded ${mcpTools.length} tools from ClickHouse MCP.`);
}

setupMcp().catch(console.error);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log(`\nUser prompt: "${message}"`);

        // Create Chat Messages Array
        let messages = [
            { 
                role: "system", 
                content: "You are the Studio-in-a-Box AI Director. You help users plan blockbuster movies by querying historical ClickHouse data. Always use the tools provided to query ClickHouse to gather facts and budget averages before giving your final answer." 
            },
            { 
                role: "user", 
                content: message 
            }
        ];

        console.log("Sending to Groq...");
        
        let response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            tools: mcpTools,
            tool_choice: "auto"
        });
        
        let responseMessage = response.choices[0].message;
        messages.push(responseMessage);
        
        let toolCallCount = 0;
        const maxToolCalls = 5; // prevent infinite loops

        // Handle tool calls autonomously
        while (responseMessage.tool_calls && toolCallCount < maxToolCalls) {
            
            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const realMcpName = toolNameMap.get(functionName) || functionName;
                const functionArgs = JSON.parse(toolCall.function.arguments);
                
                console.log(`🤖 Groq decided to use tool: [${realMcpName}]`);
                console.log(`   Arguments: ${JSON.stringify(functionArgs)}`);

                // Execute the tool against ClickHouse MCP Server
                const result = await mcpClient.callTool({
                    name: realMcpName,
                    arguments: functionArgs
                });
                
                // Extract the result text
                const textResult = result.content[0]?.text || JSON.stringify(result);
                console.log(`   Tool returned: ${textResult.substring(0, 150)}...`);

                // Give the result back to Groq
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: textResult
                });
            }

            // Ask Groq again with the tool results included
            response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                tools: mcpTools,
                tool_choice: "auto"
            });
            
            responseMessage = response.choices[0].message;
            messages.push(responseMessage);
            toolCallCount++;
        }

        console.log("Groq final response sent.");
        res.json({ response: responseMessage.content });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 Groq Agent Service running on http://localhost:${PORT}`);
    console.log(`Test with: curl -X POST http://localhost:3001/api/chat -H "Content-Type: application/json" -d '{"message":"What is the average budget of a high VFX movie?"}'\n`);
});
