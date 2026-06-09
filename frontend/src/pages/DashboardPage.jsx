import { useCallback, useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import StatsBar from '../components/StatsBar';
import { StatusBadge, LanguageBadge } from '../components/StatusBadge';
import { Search, RotateCw, Check, X, User, AlertTriangle } from 'lucide-react';

// ─── Confirm Dialog Component ────────────────────────────────────────────────
function ConfirmDialog({ isOpen, onConfirm, onCancel, action, applicantName }) {
  if (!isOpen) return null;

  const isApprove = action === 'approved';
  const actionColor = isApprove ? 'var(--color-approved)' : 'var(--color-rejected)';
  const actionBg   = isApprove ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        {/* Warning icon */}
        <div
          className="success-icon-container"
          style={{ backgroundColor: actionBg, color: actionColor, margin: '0 auto 20px' }}
        >
          <AlertTriangle size={32} />
        </div>

        <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>
          {isApprove ? 'Approve Application?' : 'Reject Application?'}
        </h3>

        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
          You are about to{' '}
          <strong style={{ color: actionColor }}>
            {isApprove ? 'approve' : 'reject'}
          </strong>{' '}
          the loan application submitted by{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{applicantName}</strong>.
          <br />
          <span style={{ display: 'block', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            This action cannot be undone.
          </span>
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: isApprove ? 'var(--color-approved)' : 'var(--color-rejected)',
              color: '#fff',
              border: 'none'
            }}
            onClick={onConfirm}
          >
            {isApprove ? <Check size={16} /> : <X size={16} />}
            <span>{isApprove ? 'Yes, Approve' : 'Yes, Reject'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage({ token }) {
  const [applications, setApplications]   = useState([]);
  const [summary, setSummary]             = useState(null);

  const [statusFilter, setStatusFilter]   = useState('');
  const [searchQuery, setSearchQuery]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [appsLoading, setAppsLoading]     = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError]                 = useState('');

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({
    open: false,
    appId: null,
    appName: '',
    action: null     // 'approved' | 'rejected'
  });

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ── Fetchers ────────────────────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setAppsLoading(true);
    setError('');
    try {
      const params = [];
      if (statusFilter)    params.push(`status=${statusFilter}`);
      if (debouncedSearch) params.push(`search=${encodeURIComponent(debouncedSearch)}`);
      const url = `${API_BASE_URL}/applications${params.length ? '?' + params.join('&') : ''}`;

      const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to retrieve applications.');
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setAppsLoading(false);
    }
  }, [debouncedSearch, statusFilter, token]);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/summary`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setSummary(data.summary);
    } catch {/* silent */} finally {
      setSummaryLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  // ── Confirm-gate: open dialog before patching status ────────────────────────
  const requestStatusChange = (app, newStatus) => {
    setConfirmState({ open: true, appId: app.id, appName: app.name, action: newStatus });
  };

  const handleConfirm = async () => {
    const { appId, action } = confirmState;
    setConfirmState({ open: false, appId: null, appName: '', action: null });
    setActionLoadingId(appId);
    setError('');
    try {
      const res  = await fetch(`${API_BASE_URL}/applications/${appId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status.');

      // Optimistic local update — no full reload needed
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
      fetchSummary();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelConfirm = () =>
    setConfirmState({ open: false, appId: null, appName: '', action: null });

  // ── Formatters ──────────────────────────────────────────────────────────────
  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const truncate = (str, max = 60) =>
    str && str.length > max ? str.slice(0, max) + '…' : str;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-page">

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.open}
        action={confirmState.action}
        applicantName={confirmState.appName}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />

      {/* Page heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Operations <span className="gradient-text">Dashboard</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitor and process incoming loan applications.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => { fetchApplications(); fetchSummary(); }}
          disabled={appsLoading || summaryLoading}
        >
          <RotateCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Widgets */}
      <StatsBar summary={summary} loading={summaryLoading} />

      {error && (
        <div className="error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="dashboard-controls">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by applicant name or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control search-input"
            id="dashboard-search"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter" style={{ whiteSpace: 'nowrap' }}>Filter:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-control"
            style={{ width: '170px' }}
          >
            <option value="">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-responsive">
        {appsLoading && applications.length === 0 ? (
          <div className="text-center no-data">
            <span className="spinner" style={{ margin: '0 auto 16px', display: 'block', borderTopColor: 'var(--accent-primary)' }} />
            <p>Loading applications…</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center no-data">
            <User size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No Applications Found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              No loan applications match your current filters.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Language</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500' }}>{app.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{app.mobile}</td>
                  <td style={{ fontWeight: '600' }}>{formatCurrency(app.amount)}</td>
                  <td
                    title={app.purpose}
                    style={{ maxWidth: '200px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                  >
                    {truncate(app.purpose)}
                  </td>
                  <td><LanguageBadge language={app.language} /></td>
                  <td><StatusBadge status={app.status} /></td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {formatDate(app.created_at)}
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            id={`approve-${app.id}`}
                            className="btn btn-approve"
                            onClick={() => requestStatusChange(app, 'approved')}
                            disabled={actionLoadingId === app.id}
                            title="Approve this application"
                          >
                            {actionLoadingId === app.id
                              ? <span className="spinner" style={{ width: '12px', height: '12px' }} />
                              : <Check size={14} />}
                            <span>Approve</span>
                          </button>
                          <button
                            id={`reject-${app.id}`}
                            className="btn btn-reject"
                            onClick={() => requestStatusChange(app, 'rejected')}
                            disabled={actionLoadingId === app.id}
                            title="Reject this application"
                          >
                            {actionLoadingId === app.id
                              ? <span className="spinner" style={{ width: '12px', height: '12px' }} />
                              : <X size={14} />}
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span style={{
                          fontSize: '0.8rem',
                          color: app.status === 'approved' ? 'var(--color-approved)' : 'var(--color-rejected)',
                          fontWeight: '500',
                          paddingLeft: '4px'
                        }}>
                          {app.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Record count footer */}
      {applications.length > 0 && (
        <p style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
          {statusFilter ? ` · ${statusFilter}` : ''}
          {debouncedSearch ? ` · "${debouncedSearch}"` : ''}
        </p>
      )}
    </div>
  );
}
