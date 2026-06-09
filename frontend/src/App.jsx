import { useState } from 'react';
import Header from './components/Header';
import ApplyPage from './pages/ApplyPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('vitto_agent_token'));
  const [view, setView] = useState(() => (localStorage.getItem('vitto_agent_token') ? 'dashboard' : 'apply'));

  const handleLoginSuccess = (newToken, newAgent) => {
    localStorage.setItem('vitto_agent_token', newToken);
    localStorage.setItem('vitto_agent_info', JSON.stringify(newAgent));
    setToken(newToken);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('vitto_agent_token');
    localStorage.removeItem('vitto_agent_info');
    setToken(null);
    setView('apply');
  };

  // Safe router check to prevent unauthorized view of dashboard
  const activeView = view === 'dashboard' && !token ? 'login' : view;

  return (
    <div className="app-container">
      <Header 
        currentView={activeView} 
        setView={setView} 
        isAuthenticated={!!token} 
        onLogout={handleLogout} 
      />
      
      <main className="content-area">
        {activeView === 'apply' && <ApplyPage />}
        {activeView === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {activeView === 'dashboard' && <DashboardPage token={token} />}
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '24px', 
        color: 'var(--text-muted)', 
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border-light)',
        marginTop: 'auto',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>© 2026 Vitto Inc. All rights reserved. Confidential Assessment.</span>
          <span style={{ display: 'flex', gap: '16px' }}>
            <span>Node.js</span>
            <span>React</span>
            <span>PostgreSQL</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
