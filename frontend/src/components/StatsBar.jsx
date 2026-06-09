import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function StatsBar({ summary, loading }) {
  if (loading) {
    return (
      <div className="stats-container">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.6 }}>
            <div className="stat-icon-wrapper"><Clock size={24} /></div>
            <div className="stat-info">
              <span className="stat-label">Loading...</span>
              <span className="stat-value">...</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { totalApplications = 0, totalAmount = 0, statusCounts = {} } = summary || {};
  const { pending = 0, approved = 0, rejected = 0 } = statusCounts;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="stats-container">
      <div className="stat-card panel-interactive">
        <div className="stat-icon-wrapper" style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
          <FileText size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Applications</span>
          <span className="stat-value">{totalApplications}</span>
        </div>
      </div>

      <div className="stat-card panel-interactive">
        <div className="stat-icon-wrapper" style={{ color: 'var(--accent-secondary)', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>₹</span>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Amount</span>
          <span className="stat-value">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="stat-card panel-interactive">
        <div className="stat-icon-wrapper" style={{ color: 'var(--color-pending)', backgroundColor: 'var(--color-pending-bg)' }}>
          <Clock size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pending}</span>
        </div>
      </div>

      <div className="stat-card panel-interactive">
        <div className="stat-icon-wrapper" style={{ color: 'var(--color-approved)', backgroundColor: 'var(--color-approved-bg)' }}>
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Approved</span>
          <span className="stat-value">{approved}</span>
        </div>
      </div>

      <div className="stat-card panel-interactive">
        <div className="stat-icon-wrapper" style={{ color: 'var(--color-rejected)', backgroundColor: 'var(--color-rejected-bg)' }}>
          <XCircle size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Rejected</span>
          <span className="stat-value">{rejected}</span>
        </div>
      </div>
    </div>
  );
}
