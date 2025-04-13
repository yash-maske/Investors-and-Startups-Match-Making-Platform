import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './startup-profile.css';

export default function StartupProfileInput() {
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    founded: '',
    headquarters: '',
    sector: '',
    description: '',
    founder: '',
    investors: '',
    amount: '',
    certificateOfIncorporation: null,
    panCardphoto: null,
    aadharCardUrl: null,
    investorAgreementphoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false); // Track if approval is pending
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess('');
    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    setSuccess('');
    setError('');
  };

  const checkApprovalStatus = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/startups/isStartupApproved', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Startup profile submitted successfully. You are approved!');
        setIsPendingApproval(false);
        setTimeout(() => navigate('/statrtups/allinvestors'), 1500);
        return true;
      } else {
        setSuccess('Startup profile submitted successfully. Awaiting approval...');
        setIsPendingApproval(true);
        return false;
      }
    } catch (err) {
      setIsPendingApproval(false);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('Error checking approval status. Please try again.');
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        if (key === 'panCardphoto') {
          data.append('panCard', formData[key]);
        } else if (key === 'aadharCardUrl') {
          data.append('aadharCard', formData[key]);
        } else if (key === 'investorAgreementphoto') {
          data.append('investorAgreement', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/startups/addStartup', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData({
          email: '',
          company: '',
          founded: '',
          headquarters: '',
          sector: '',
          description: '',
          founder: '',
          investors: '',
          amount: '',
          certificateOfIncorporation: null,
          panCardphoto: null,
          aadharCardUrl: null,
          investorAgreementphoto: null,
        });
        await checkApprovalStatus(token);
      } else {
        setError(result.message || 'Failed to create startup profile.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Poll for approval status if pending
  useEffect(() => {
    let interval;
    if (isPendingApproval) {
      interval = setInterval(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Session expired. Please log in again.');
          setIsPendingApproval(false);
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        const isApproved = await checkApprovalStatus(token);
        if (isApproved) {
          clearInterval(interval);
        }
      }, 30000); // Check every 30 seconds
    }
    return () => clearInterval(interval);
  }, [isPendingApproval, navigate]);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue.');
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [navigate]);

  // Full-page loading symbol when approval is pending
  if (isPendingApproval) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="pulse-loader"></div>
          <h2 className="loading-title">Awaiting Approval</h2>
          <p className="loading-message">
            Your startup profile is under review. Please wait while we verify your details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="startup-profile-container">
      <h2 className="startup-profile-title">Create Startup Profile</h2>
      {error && <div className="startup-profile-error">{error}</div>}
      {success && <div className="startup-profile-success">{success}</div>}
      {loading && <div className="startup-profile-loading">Submitting...</div>}

      <form className="startup-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="required">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company" className="required">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="founded" className="required">
            Founded Year
          </label>
          <input
            type="number"
            id="founded"
            name="founded"
            value={formData.founded}
            onChange={handleChange}
            placeholder="Enter founding year"
            min="1800"
            max="2025"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="headquarters" className="required">
            Headquarters
          </label>
          <input
            type="text"
            id="headquarters"
            name="headquarters"
            value={formData.headquarters}
            onChange={handleChange}
            placeholder="Enter headquarters location"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sector" className="required">
            Sector
          </label>
          <select
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Sector</option>
            <option value="AgriTech">AgriTech</option>
            <option value="Automotive">Automotive</option>
            <option value="Capital Markets">Capital Markets</option>
            <option value="Computer & Network Security">Computer & Network Security</option>
            <option value="Computer Software">Computer Software</option>
            <option value="Consumer Goods">Consumer Goods</option>
            <option value="Consumer Services">Consumer Services</option>
            <option value="E-learning">E-learning</option>
            <option value="Education">Education</option>
            <option value="Education Management">Education Management</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Finance">Finance</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Health, Wellness & Fitness">Health, Wellness & Fitness</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Hospital & Health Care">Hospital & Health Care</option>
            <option value="Information Technology & Services">Information Technology & Services</option>
            <option value="Insurance">Insurance</option>
            <option value="Music">Music</option>
            <option value="OTT">OTT</option>
            <option value="Social Network">Social Network</option>
            <option value="Software Startup">Software Startup</option>
            <option value="Technology">Technology</option>
            <option value="Venture Capital & Private Equity">Venture Capital & Private Equity</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label htmlFor="description" className="required">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your startup"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="founder" className="required">
            Founder
          </label>
          <input
            type="text"
            id="founder"
            name="founder"
            value={formData.founder}
            onChange={handleChange}
            placeholder="Enter founder name"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="investors" className="required">
            Investors
          </label>
          <input
            type="text"
            id="investors"
            name="investors"
            value={formData.investors}
            onChange={handleChange}
            placeholder="Enter investor names"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount" className="required">
            Funding Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter funding amount"
            min="0"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="certificateOfIncorporation">
            Certificate of Incorporation
          </label>
          <input
            type="file"
            id="certificateOfIncorporation"
            name="certificateOfIncorporation"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
            disabled={loading}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="panCardphoto" className="required">
            PAN Card Photo
          </label>
          <input
            type="file"
            id="panCardphoto"
            name="panCardphoto"
            onChange={handleFileChange}
            accept="image/*"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="aadharCardUrl" className="required">
            Aadhar Card Photo
          </label>
          <input
            type="file"
            id="aadharCardUrl"
            name="aadharCardUrl"
            onChange={handleFileChange}
            accept="image/*"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="investorAgreementphoto" className="required">
            Investor Agreement Photo
          </label>
          <input
            type="file"
            id="investorAgreementphoto"
            name="investorAgreementphoto"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="startup-submit-btn full-width"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Submitting...
            </>
          ) : (
            'Proceed'
          )}
        </button>
      </form>
    </div>
  );
}