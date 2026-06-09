import { useState } from 'react';
import API_BASE_URL from '../config';
import { Send, Check, AlertCircle, Copy, CheckCheck } from 'lucide-react';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    amount: '',
    purpose: '',
    language: 'English'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successRef, setSuccessRef] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCopyRef = async () => {
    if (!successRef) return;
    try {
      await navigator.clipboard.writeText(successRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select text in the box
    }
  };

  const validateForm = () => {
    const clientErrors = [];
    
    if (!formData.name.trim()) {
      clientErrors.push('Applicant name is required.');
    }
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      clientErrors.push('Mobile number is required.');
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      clientErrors.push('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
    }

    const numAmount = Number(formData.amount);
    if (!formData.amount) {
      clientErrors.push('Loan amount is required.');
    } else if (isNaN(numAmount) || numAmount <= 0) {
      clientErrors.push('Loan amount must be a positive number greater than ₹0.');
    }

    if (!formData.purpose.trim()) {
      clientErrors.push('Loan purpose is required.');
    }

    return clientErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessRef(null);

    const clientErrors = validateForm();
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          amount: Number(formData.amount),
          purpose: formData.purpose.trim(),
          language: formData.language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else {
          setErrors([data.message || 'An error occurred while submitting your application.']);
        }
      } else {
        // Successful submission
        setSuccessRef(data.application.id);
        // Reset form
        setFormData({
          name: '',
          mobile: '',
          amount: '',
          purpose: '',
          language: 'English'
        });
      }
    } catch (err) {
      console.error('Submit application error:', err);
      setErrors(['Unable to connect to the server. Please check your network and try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '12px 0' }}>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '2rem' }}>Apply for a <span className="gradient-text">Loan</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Submit your details below to request a loan. All fields are required.
          </p>
        </div>

        {errors.length > 0 && (
          <div className="error-alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <AlertCircle size={18} />
              <span>Please correct the following:</span>
            </div>
            <ul>
              {errors.map((err, idx) => (
                <li key={idx} style={{ marginTop: '4px' }}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="input-control"
              disabled={loading}
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number (10 digits)</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="input-control"
              disabled={loading}
              maxLength={10}
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Loan Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter loan amount in Rupees"
              className="input-control"
              disabled={loading}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Communication Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input-control"
              disabled={loading}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose of Loan</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Explain the purpose of this loan application..."
              className="input-control"
              disabled={loading}
              maxLength={1000}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Loan Application</span>
              </>
            )}
          </button>
        </form>
      </div>

      {successRef && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon-container">
              <Check />
            </div>
            <h2 className="modal-title">Application Submitted! 🎉</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your loan application has been received and is under review by our operations team.
            </p>

            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Your unique application reference number:
            </div>

            {/* Reference box with copy-to-clipboard */}
            <div style={{ position: 'relative' }}>
              <div className="ref-box" style={{ paddingRight: '48px' }}>{successRef}</div>
              <button
                onClick={handleCopyRef}
                title="Copy reference number"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: copied ? 'var(--color-approved)' : 'var(--text-muted)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease'
                }}
              >
                {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {copied && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-approved)', marginTop: '-8px', marginBottom: '8px' }}>
                ✓ Reference number copied!
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => {
                  setSuccessRef(null);
                  setCopied(false);
                }}
              >
                Submit Another
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setSuccessRef(null);
                  setCopied(false);
                }}
              >
                <Check size={16} />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
