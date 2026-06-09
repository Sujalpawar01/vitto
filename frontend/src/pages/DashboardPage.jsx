import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import StatsBar from '../components/StatsBar';
import { StatusBadge, LanguageBadge } from '../components/StatusBadge';
import { Search, RotateCw, Check, X, User } from 'lucide-react';

export default function DashboardPage({ token }) {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [appsLoading, setAppsLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  // Debounce search query to prevent excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch applications list
  const fetchApplications = async () => {
    setAppsLoading(true);
    setError('');
    try {
      let url = `${API_BASE_URL}/applications`;
      const params = [];
      if (statusFilter) params.push(`status=${statusFilter}`);
      if (debouncedSearch) params.push(`search=${encodeURIComponent(debouncedSearch)}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve applications.');
      }

      setApplications(data.applications || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
      setError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setAppsLoading(false);
    }
  };

  // Fetch dashboard summary counts
  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Fetch summary error:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchApplications();
  }, [statusFilter, debouncedSearch]);

  // Fetch summary on load or after status updates
  useEffect(() => {
    fetchSummary();
  }, []);

  const handleRefresh = () => {
    fetchApplications();
    fetchSummary();
  };

  // Handle application status transition
  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoadingId(id);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update application status.');
      }

      // Update local state for the specific application to avoid full refresh
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );

      // Re-trigger summary stats update
      fetchSummary();
    } catch (err) {
      console.error('Update status error:', err);
      setError(err.message || 'Failed to update status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Formatter for Currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Formatter for Dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Operations <span className="gradient-text">Dashboard</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitor and process incoming loan applications.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleRefresh} disabled={appsLoading || summaryLoading}>
          <RotateCw size={16} className={appsLoading || summaryLoading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Widgets */}
      <StatsBar summary={summary} loading={summaryLoading} />

      {error && (
        <div className="error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters Controls */}
      <div className="dashboard-controls">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by applicant name or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter" style={{ whiteSpace: 'nowrap' }}>Status Filter:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-control"
            style={{ width: '160px' }}
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
            <span className="spinner" style={{ margin: '0 auto 16px', borderTopColor: 'var(--accent-primary)' }}></span>
            <p>Loading applications data...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center no-data">
            <User size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No Applications Found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              We couldn't find any loan applications matching the selected filters.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Language</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th style={{ width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500' }}>{app.name}</td>
                  <td>{app.mobile}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(app.amount)}</td>
                  <td>
                    <LanguageBadge language={app.language} />
                  </td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {formatDate(app.created_at)}
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            className="btn btn-approve"
                            onClick={() => handleUpdateStatus(app.id, 'approved')}
                            disabled={actionLoadingId === app.id}
                          >
                            {actionLoadingId === app.id ? <span className="spinner" style={{ width: '12px', height: '12px' }}></span> : <Check size={14} />}
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                            disabled={actionLoadingId === app.id}
                          >
                            {actionLoadingId === app.id ? <span className="spinner" style={{ width: '12px', height: '12px' }}></span> : <X size={14} />}
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '8px' }}>
                          Processed
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
    </div>
  );
}
