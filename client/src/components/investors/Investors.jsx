import { useState, useEffect } from 'react';
import './investor.css';
import { Bookmark, MapPin, Users, Info, Send } from 'lucide-react'; // Added Send icon

export default function InvestorList() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pitchedInvestors, setPitchedInvestors] = useState(new Set());

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/startups/allInvestors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch investors');
        }

        const data = await response.json();
        if (data.success) {
          setInvestors(data.investors);
        } else {
          setError(data.message || 'No investors found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  const handlePitch = async (investorId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to pitch.');
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/api/startups/pitch/${investorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setPitchedInvestors((prev) => new Set(prev).add(investorId));
      } else {
        setError(data.message || 'Failed to pitch startup.');
      }
    } catch (err) {
      console.error('Pitch error:', err);
      setError('Unable to pitch. Please try again later.');
    }
  };

  return (
    <div className="investor-container">
      <h1 className="investor-title">Featured Investors</h1>

      {loading && <div className="investor-loading">Loading investors...</div>}
      {error && <div className="investor-error">{error}</div>}

      {!loading && !error && investors.length === 0 && (
        <div className="investor-empty">No approved investors available.</div>
      )}

      <div className="investor-grid">
        {investors.map((investor) => {
          const isPitched = pitchedInvestors.has(investor._id);
          return (
            <div key={investor._id} className="investor-card">
              <div className="investor-card-inner">
                {/* Front Side */}
                <div className="investor-card-front">
                  <h2 className="investor-card-title">{investor.fullName}</h2>
                  <p className="investor-card-location">
                    <MapPin size={16} className="investor-icon" /> {investor.address},{' '}
                    {investor.country}
                  </p>
                  <p className="investor-card-min-investment">
                    Min Investment: ₹{investor.minInvestment.toLocaleString('en-IN')}
                  </p>
                  <p className="investor-card-max-investment">
                    Max Investment: ₹{investor.maxInvestment.toLocaleString('en-IN')}
                  </p>
                  <div className="investor-card-actions">
                    <button
                      className={`investor-contact-btn ${isPitched ? 'pitched' : ''}`}
                      onClick={() => handlePitch(investor._id)}
                      disabled={isPitched}
                    >
                      <Send size={16} className="investor-icon" /> {isPitched ? 'Pitched' : 'Pitch'}
                    </button>
                    <button className="investor-bookmark-btn">
                      <Bookmark size={16} /> Bookmark
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="investor-card-back">
                  <h3 className="investor-card-details-title">Details</h3>
                  <p className="investor-card-email">
                    <Info size={16} className="investor-icon" /> <strong>Email:</strong>{' '}
                    {investor.email}
                  </p>
                  <p className="investor-card-mobile">
                    <Users size={16} className="investor-icon" /> <strong>Mobile:</strong>{' '}
                    {investor.mobileNumber}
                  </p>
                  <p className="investor-card-pincode">
                    <MapPin size={16} className="investor-icon" /> <strong>Pincode:</strong>{' '}
                    {investor.pincode}
                  </p>
                  <div className="investor-card-actions">
                    <button
                      className={`investor-contact-btn ${isPitched ? 'pitched' : ''}`}
                      onClick={() => handlePitch(investor._id)}
                      disabled={isPitched}
                    >
                      <Send size={16} className="investor-icon" /> {isPitched ? 'Pitched' : 'Pitch'}
                    </button>
                    <button className="investor-bookmark-btn">
                      <Bookmark size={16} /> Bookmark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}