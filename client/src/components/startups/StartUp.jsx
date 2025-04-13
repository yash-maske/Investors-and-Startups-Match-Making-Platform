import { useState, useEffect } from 'react';
import './startup.css';
import { Bookmark, MapPin, Users, Info } from 'lucide-react';

export default function StartUp() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/investors/allStartups/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add Authorization header if your API requires a token
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch startups');
        }

        const data = await response.json();
        if (data.success) {
          setStartups(data.startups);
        } else {
          setError(data.message || 'No startups found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  return (
    <div className="startup-container">
      <h1 className="startup-title">Featured Startups</h1>

      {loading && <div className="startup-loading">Loading startups...</div>}
      {error && <div className="startup-error">{error}</div>}

      {!loading && !error && startups.length === 0 && (
        <div className="startup-empty">No approved startups available.</div>
      )}

      <div className="startup-grid">
        {startups.map((startup, index) => (
          <div key={index} className="startup-card">
            <div className="startup-card-inner">
              {/* Front Side */}
              <div className="startup-card-front">
                <h2 className="startup-card-title">{startup.company}</h2>
                <p className="startup-card-sector">
                  <Info size={16} className="startup-icon" /> {startup.sector}
                </p>
                <p className="startup-card-founded">
                  <Users size={16} className="startup-icon" /> Founded: {startup.founded}
                </p>
                <p className="startup-card-headquarters">
                  <MapPin size={16} className="startup-icon" /> HQ: {startup.headquarters}
                </p>
                <div className="startup-card-amount">
                  <span className="rupee-icon">₹</span> Funding: ₹{startup.amount.toLocaleString('en-IN')}
                </div>
                <div className="startup-card-actions">
                  <button className="startup-invest-btn">
                    <span className="rupee-icon">₹</span> Interested
                  </button>
                  <button className="startup-bookmark-btn">
                    <Bookmark size={16} /> Bookmark
                  </button>
                </div>
              </div>
              {/* Back Side */}
              <div className="startup-card-back">
                <h3 className="startup-card-description-title">Description</h3>
                <p className="startup-card-description">{startup.description}</p>
                <p className="startup-card-founder">
                  <Users size={16} className="startup-icon" /> <strong>Founder(s):</strong>{' '}
                  {startup.founder}
                </p>
                <p className="startup-card-investors">
                  <span className="rupee-icon">₹</span> <strong>Investors:</strong>{' '}
                  {startup.investors || 'N/A'}
                </p>
                <div className="startup-card-actions">
                  <button className="startup-invest-btn">
                    <span className="rupee-icon">₹</span> Interested
                  </button>
                  <button className="startup-bookmark-btn">
                    <Bookmark size={16} /> Bookmark
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}