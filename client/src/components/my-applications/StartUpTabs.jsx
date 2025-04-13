import { useState, useEffect } from 'react';
import './stratuptabs.css';
import {  Users, Info } from 'lucide-react';

export default function StartupTabs() {
  const [activeTab, setActiveTab] = useState('pitched');
  const [pitchedStartups, setPitchedStartups] = useState([]);
  const [approvedStartups, setApprovedStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch startups based on active tab
  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view startups.');
          setLoading(false);
          return;
        }

        const url =
          activeTab === 'pitched'
            ? 'http://localhost:5000/api/investors/getAllStartupsWhoPitched/'
            : 'http://localhost:5000/api/investors/getAllStartupsWhoPitchedAndApproved/';

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token from localStorage
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized: Invalid or expired token.');
          } else {
            throw new Error('Failed to fetch startups');
          }
        }

        const data = await response.json();
        if (data.success) {
          if (activeTab === 'pitched') {
            setPitchedStartups(data.startups);
          } else {
            setApprovedStartups(data.startups);
          }
        } else {
          setError(data.message || 'No startups found.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to fetch startups. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [activeTab]);

  // Handle Approve button click
  const handleApprove = async (startupEmail) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to approve startups.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/investors/approvePitchedStartup/${startupEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPitchedStartups((prev) =>
          prev.filter((startup) => startup.email !== startupEmail)
        );
        const approvedStartup = pitchedStartups.find(
          (startup) => startup.email === startupEmail
        );
        if (approvedStartup) {
          setApprovedStartups((prev) => [
            ...prev,
            { ...approvedStartup, status: 'approved' },
          ]);
        }
      } else {
        setError(data.message || 'Failed to approve startup.');
      }
    } catch (err) {
      console.error('Approve error:', err);
      setError('Unable to approve startup. Please try again later.');
    }
  };

  // Handle Reject button click
  const handleReject = async (startupEmail) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to reject startups.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/investors/rejectPitchedStartup/${startupEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPitchedStartups((prev) =>
          prev.filter((startup) => startup.email !== startupEmail)
        );
      } else {
        setError(data.message || 'Failed to reject startup.');
      }
    } catch (err) {
      console.error('Reject error:', err);
      setError('Unable to reject startup. Please try again later.');
    }
  };

  return (
    <div className="startup-tabs-container">
      <h1 className="startup-tabs-title">Startup Pitches</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'pitched' ? 'active' : ''}`}
          onClick={() => setActiveTab('pitched')}
        >
          Pitched Startups
        </button>
        <button
          className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Startups
        </button>
      </div>

      {/* Feedback States */}
      {loading && <div className="startup-loading">Loading startups...</div>}
      {error && <div className="startup-error">{error}</div>}

      {/* Startup Cards */}
      <div className="startup-grid">
        {(activeTab === 'pitched' ? pitchedStartups : approvedStartups).length === 0 &&
          !loading && (
            <div className="startup-empty">No startups available.</div>
          )}

        {(activeTab === 'pitched' ? pitchedStartups : approvedStartups).map((startup) => (
          <div key={startup.email} className="startup-card">
            <h2 className="startup-card-title">Startup</h2>
            <p className="startup-card-email">
              <Info size={16} className="startup-icon" /> <strong>Email:</strong>{' '}
              {startup.email}
            </p>
            <p className="startup-card-status">
              <Users size={16} className="startup-icon" /> <strong>Status:</strong>{' '}
              {startup.status || 'Pending'}
            </p>
            {activeTab === 'pitched' && startup.status !== 'approved' && (
              <div className="startup-card-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(startup.email)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(startup.email)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}