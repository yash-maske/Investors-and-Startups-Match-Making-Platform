import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './discover.css';

export default function Discover() {
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    sector: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const sectors = [
    'AgriTech',
    'Automotive',
    'Capital Markets',
    'Computer & Network Security',
    'Computer Software',
    'Consumer Goods',
    'Consumer Services',
    'E-learning',
    'Education',
    'Education Management',
    'Financial Services',
    'Finance',
    'Food & Beverages',
    'Health, Wellness & Fitness',
    'Healthcare',
    'Hospital & Health Care',
    'Information Technology & Services',
    'Insurance',
    'Music',
    'OTT',
    'Social Network',
    'Software Startup',
    'Technology',
    'Venture Capital & Private Equity',
    'Other',
  ];

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      sector: filters.sector || '',
      description: filters.description || '',
      amount: filters.maxAmount || '',
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/reco/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      navigate('/application/discover-results/', { state: { startups: data } });
    } catch (error) {
      console.error('Error fetching startups:', error);
      navigate('/application/discover-results/', {
        state: { startups: [], error: 'Failed to fetch startups' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      minAmount: '',
      maxAmount: '',
      sector: '',
      description: '',
    });
  };

  return (
    <div className="discover-container">
      <h2 className="discover-title">Discover Startups With AI</h2>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading model...</p>
        </div>
      ) : (
        <form className="discover-filter-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="maxAmount">Funding Amount (₹)</label>
            <input
              type="number"
              id="maxAmount"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleInputChange}
              placeholder="Max (₹)"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sector">Sector</label>
            <select
              id="sector"
              name="sector"
              value={filters.sector}
              onChange={handleInputChange}
            >
              <option value="">Select Sector</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={filters.description}
              onChange={handleInputChange}
              placeholder="Enter description to filter startups (e.g., AI-powered solutions, blockchain technology)"
              rows="4"
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="discover-submit-btn"
              disabled={isLoading}
            >
              AI Match
            </button>
            <button
              type="button"
              className="discover-reset-btn"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}