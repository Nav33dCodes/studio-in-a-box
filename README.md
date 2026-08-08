# 🎬 Studio-in-a-Box

Welcome to the **Studio-in-a-Box** Command Center! This project is an enterprise-grade dashboard that visualizes massive amounts of movie box office data and features an autonomous AI Director Assistant.

---

## 🌟 What does this project do?
1. **Live Data Dashboard:** Displays interactive, professional charts for Box Office Returns and Budgets.
2. **Enterprise Data Grid:** Allows you to sort, filter, and analyze thousands of movies instantly.
3. **AI Director Agent:** A conversational AI that can autonomously write its own SQL queries to fetch data for you!

---

## 🏗️ Tech Stack
This project uses a highly scalable Microservices architecture:
- **Frontend:** React (Vite), Recharts, TanStack Table, CSS Grid.
- **Backend:** C# ASP.NET Core with SignalR WebSockets for live telemetry.
- **AI Agent:** Node.js powered by Groq (Llama-3) and Model Context Protocol (MCP).
- **Database:** ClickHouse Cloud (for lightning-fast analytics).

---

## 🚀 How to Run the Project

You need to open three separate terminals to run the three microservices. Follow these steps in order:

### Terminal 1: The AI Agent
*This handles the AI Chat functionality.*
1. `cd cinema/agent`
2. *(Make sure your `.env` file contains your secure `GROQ_API_KEY`)*
3. `npm start`
*(Leave this running)*

### Terminal 2: The Backend API
*This connects to the Database and streams Live Data.*
1. `cd cinema/backend`
2. *(Make sure your `appsettings.json` contains your secure ClickHouse database passwords)*
3. `dotnet run`
*(Leave this running)*

### Terminal 3: The Frontend Dashboard
*This runs the beautiful user interface.*
1. `cd cinema/frontend`
2. `npm run dev`
3. Finally, open your browser and go to: `http://localhost:5173`

---

## 🏆 Hackathon Build
This project was built specifically for the Hackathon to demonstrate peak enterprise scalability. 

By integrating **Recharts** (for interactive SVG graphics), **TanStack Table** (for sortable enterprise data grids), and **SignalR WebSockets** (for live telemetry streaming), we have proven that this architecture can securely scale to millions of rows of data for real-world studio operations. We are incredibly proud of this build and hope you enjoy the demo!
