import React from 'react';
import { Shield, FileText, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header({ currentView, setView, isAuthenticated, onLogout }) {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="brand" onClick={() => setView('apply')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">V</div>
          <span>vitto</span>
        </div>
        <nav className="nav-links">
          <button 
            className={`btn ${currentView === 'apply' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('apply')}
          >
            <FileText size={18} />
            <span>Apply for Loan</span>
          </button>
          
          {isAuthenticated ? (
            <>
              <button 
                className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('dashboard')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button className="btn btn-secondary" onClick={onLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button 
              className={`btn ${currentView === 'login' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setView('login')}
            >
              <Shield size={18} />
              <span>Agent Portal</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
