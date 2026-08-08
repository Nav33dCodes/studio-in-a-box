import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="app-container">
      <Dashboard theme={theme} toggleTheme={toggleTheme} />
      <ChatWidget />
    </div>
  );
}

export default App;
