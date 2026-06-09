import { useState } from 'react';
import API_BASE_URL from '../config';
import { Shield, Key, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid username or password.');
      } else {
        // Trigger login callback
        onLoginSuccess(data.token, data.agent);
      }
    } catch (err) {
      console.error('Agent login error:', err);
      setError('Failed to connect to authentication server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="panel auth-card">
        <div className="auth-header">
          <div 
            className="success-icon-container" 
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              color: 'var(--accent-primary)',
              width: '56px',
              height: '56px'
            }}
          >
            <Shield size={28} />
          </div>
          <h2>Agent <span className="gradient-text">Portal</span></h2>
          <p className="auth-subtitle">Log in to view and manage borrower loan applications.</p>
        </div>

        {error && (
          <div className="error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. agent1"
              className="input-control"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-control"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '12px' }} 
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <Key size={18} />
                <span>Log In as Agent</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>Demo credentials: <strong>agent1</strong> / <strong>Password123</strong></p>
        </div>
      </div>
    </div>
  );
}
