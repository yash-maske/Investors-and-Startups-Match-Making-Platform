import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Calendar, User, FileText, Star } from 'lucide-react';
import './stmeet.css';

// Main component
export default function PitchEvents() {
  const [pitchEvents, setPitchEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch pitch events
  useEffect(() => {
    const fetchPitchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await fetch('http://localhost:5000/api/startups/getAllPitchEvents/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: Failed to fetch meetings`);
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.pitchEvents)) {
          throw new Error(data.message || 'Invalid response format');
        }

        setPitchEvents(data.pitchEvents);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Unable to connect to the server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPitchEvents();
  }, []);

  return (
    <div className="pitch-events-container">
      <h1 className="pitch-events-title">Upcoming Meetings with Investors</h1>

      {loading && <div className="pitch-events-loading">Loading meetings...</div>}
      {error && <div className="pitch-events-error">{error}</div>}

      {!loading && !error && pitchEvents.length === 0 && (
        <div className="pitch-events-empty">No upcoming meetings available.</div>
      )}

      {!loading && !error && pitchEvents.length > 0 && (
        <div className="pitch-events-grid">
          {pitchEvents.map((event) => (
            <PitchEventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component for individual pitch event card
function PitchEventCard({ event }) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(event.date));

  // Update countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(event.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [event.date]);

  // Handle Join Meet button click
  const handleJoinMeet = useCallback(() => {
    if (event.video_url && !timeRemaining.isPast) {
      window.open(event.video_url, '_blank', 'noopener,noreferrer');
    }
  }, [event.video_url, timeRemaining.isPast]);

  // Format date safely
  const eventDate = new Date(event.date);
  const formattedDate = isNaN(eventDate.getTime())
    ? 'Invalid Date'
    : eventDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

  return (
    <div className="pitch-event-card">
      <div className="pitch-event-header">
        <h2 className="pitch-event-title">
          <Star size={18} className="pitch-event-icon" />
          {event.title || 'Untitled Meeting'}
        </h2>
        <span className="pitch-event-status">
          {timeRemaining.isPast ? 'Ended' : 'Upcoming'}
        </span>
      </div>
      <p className="pitch-event-description">
        <FileText size={18} className="pitch-event-icon" />
        {event.description || 'No description available'}
      </p>
      <p className="pitch-event-date">
        <Calendar size={18} className="pitch-event-icon" />
        <span>Date:</span> {formattedDate}
      </p>
      <p className="pitch-event-emails">
        <User size={18} className="pitch-event-icon" />
        <span>Investor:</span> {event.investor_mail || 'N/A'}
      </p>
      <div className="pitch-event-countdown">
        {timeRemaining.isPast ? (
          <div className="countdown-ended">Meeting Ended</div>
        ) : (
          <div className="countdown-timer">
            <div className="countdown-unit">
              <span>{timeRemaining.days || 0}</span>
              <span>Days</span>
            </div>
            <div className="countdown-unit">
              <span>{timeRemaining.hours || 0}</span>
              <span>Hours</span>
            </div>
            <div className="countdown-unit">
              <span>{timeRemaining.minutes || 0}</span>
              <span>Minutes</span>
            </div>
            <div className="countdown-unit">
              <span>{timeRemaining.seconds || 0}</span>
              <span>Seconds</span>
            </div>
          </div>
        )}
      </div>
      <button
        className="pitch-event-join-btn"
        onClick={handleJoinMeet}
        disabled={!event.video_url || timeRemaining.isPast}
        aria-label={`Join meeting for ${event.title || 'meeting'}`}
      >
        Join Meeting
      </button>
    </div>
  );
}

// PropTypes validation for PitchEventCard
PitchEventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    id: PropTypes.number,
    date: PropTypes.string.isRequired,
    description: PropTypes.string,
    title: PropTypes.string,
    video_url: PropTypes.string,
    investor_mail: PropTypes.string,
    startup_mail: PropTypes.string,
  }).isRequired,
};

// Calculate time remaining until event date
function calculateTimeRemaining(eventDate) {
  const now = new Date();
  const eventTime = new Date(eventDate);

  if (isNaN(eventTime.getTime())) {
    return { isPast: true };
  }

  const diffMs = eventTime - now;
  if (diffMs <= 0) {
    return { isPast: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}