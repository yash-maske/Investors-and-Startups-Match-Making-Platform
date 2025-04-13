import { useLocation, useNavigate } from 'react-router-dom';
import './result.css';
import { Bookmark, MapPin, Users, Info } from 'lucide-react';

export default function DiscoverResults() {
  const { state } = useLocation();
  const { startups = [], error } = state || {};
  const navigate = useNavigate();

  return (
    <div className="discover-results-container">
      <h1 className="discover-results-title">Matching Startups</h1>
      <button
        className="discover-back-btn"
        onClick={() => navigate('/application/discover-startups')}
      >
        Back to Discover
      </button>

      {error ? (
        <p className="discover-results-error">{error}</p>
      ) : startups.length === 0 ? (
        <p className="discover-results-empty">
          No startups match your filters. Try adjusting them.
        </p>
      ) : (
        <div className="discover-results-grid">
          {startups.map((startup, index) => (
            <div key={index} className="discover-results-card">
              <div className="discover-results-card-inner">
                {/* Front Side */}
                <div className="discover-results-card-front">
                  <h2 className="discover-results-card-title">{startup.company}</h2>
                  <p className="discover-results-card-sector">
                    <Info size={16} className="discover-icon" /> {startup.sector}
                  </p>
                  <p className="discover-results-card-founded">
                    <Users size={16} className="discover-icon" /> Founded:{' '}
                    {startup.founded_year}
                  </p>
                  <p className="discover-results-card-headquarters">
                    <MapPin size={16} className="discover-icon" /> HQ:{' '}
                    {startup.headquarters}
                  </p>
                  <div className="discover-results-card-amount">
                    <span className="rupee-icon">₹</span> Investment Required: ₹
                    {Number(startup.amount_of_investment_required).toLocaleString(
                      'en-IN'
                    )}
                  </div>
                  <div className="discover-results-card-actions">
                    <button className="discover-invest-btn">
                      <span className="rupee-icon">₹</span> Interested
                    </button>
                    <button className="discover-bookmark-btn">
                      <Bookmark size={16} /> Bookmark
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="discover-results-card-back">
                  <h3 className="discover-results-card-description-title">
                    Description
                  </h3>
                  <p className="discover-results-card-description">
                    {startup.description}
                  </p>
                  <p className="discover-results-card-founder">
                    <Users size={16} className="discover-icon" />{' '}
                    <strong>Founder(s):</strong> {startup.founder}
                  </p>
                  <div className="discover-results-card-actions">
                    <button className="discover-invest-btn">
                      <span className="rupee-icon">₹</span> Interested
                    </button>
                    <button className="discover-bookmark-btn">
                      <Bookmark size={16} /> Bookmark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}