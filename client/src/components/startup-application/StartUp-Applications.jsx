import './startup-application.css';
import { useEffect, useState } from 'react';

export default function MyApplication() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPitchedInvestors = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/startups/pitchedInvestors', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch investors');
        }

        setInvestors(data.pitchedInvestors || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPitchedInvestors();
  }, []);

  // Function to handle redirect for scheduling a meeting
  const handleScheduleMeet = (investor) => {
    // Default URL or dynamic (e.g., from investor.meetingUrl if available)
    const meetingUrl = investor.meetingUrl || 'http://localhost:8000/create-pitch-event/';
    window.open(meetingUrl, '_blank'); // Opens in a new tab
  };

  // Classify investors based on status
  const approvedInvestors = investors.filter((investor) => investor.status === 'approved');
  const rejectedInvestors = investors.filter((investor) => investor.status === 'rejected');
  const pendingInvestors = investors.filter((investor) => investor.status === 'pending');

  return (
    <div className="startup-applications">
      <h1>Pitched Investors</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h2>Pending Request ({pendingInvestors.length})</h2>
            {pendingInvestors.length > 0 ? (
              <ul>
                {pendingInvestors.map((investor) => (
                  <li key={investor._id} data-status="pending">
                    {investor.email || 'Anonymous Investor'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending investors.</p>
            )}
          </section>

          <section>
            <h2>Approved Request ({approvedInvestors.length})</h2>
            {approvedInvestors.length > 0 ? (
              <ul>
                {approvedInvestors.map((investor) => (
                  <li key={investor._id} data-status="approved">
                    <span>{investor.email || 'Anonymous Investor'}</span>
                    <button
                      className="schedule-btn"
                      onClick={() => handleScheduleMeet(investor)}
                      aria-label={`Schedule a meeting with ${investor.email || 'this investor'}`}
                    >
                      Schedule a Meet
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No approved investors.</p>
            )}
          </section>

          <section>
            <h2>Rejected Request ({rejectedInvestors.length})</h2>
            {rejectedInvestors.length > 0 ? (
              <ul>
                {rejectedInvestors.map((investor) => (
                  <li key={investor._id} data-status="rejected">
                    {investor.email || 'Anonymous Investor'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No rejected investors.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}