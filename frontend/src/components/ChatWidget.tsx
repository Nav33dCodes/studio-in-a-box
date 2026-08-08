import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello. I am the Director Agent. How can I help you analyze the production data today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to the Agent endpoint.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 16 }}>
        <h2 className="widget-title" style={{ margin: 0, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ph ph-terminal-window"></i>
          AI Director Assistant
        </h2>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble ai" style={{ opacity: 0.6 }}>
            <i className="ph ph-dots-three" style={{ fontSize: 20, animation: 'pulse 1.5s infinite' }}></i>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input 
          className="chat-input"
          placeholder="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button 
          className="chat-send-btn"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <i className="ph ph-arrow-up"></i>
        </button>
      </div>
    </div>
  );
}
