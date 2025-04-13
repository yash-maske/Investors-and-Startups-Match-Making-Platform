import { useState } from 'react';
import './CreateEvent.css';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : '',
    };

    try {
      const response = await fetch('http://localhost:8000/create-pitch-event/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // For session cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Failed to create pitch event');
      }

      setSuccess('Pitch event submitted successfully! Redirecting to Google authentication...');
      console.log('POST successful. Expecting redirect to:', 'http://localhost:8000/google/auth/');

      // For testing: Manually redirect to simulate Django’s 302
      // In production, remove this; the browser follows the redirect automatically
      setTimeout(() => {
        window.location.href = 'http://localhost:8000/google/auth/';
      }, 1500);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2 className="create-event-title">Create Pitch Event</h2>
      {error && <div className="create-event-error">{error}</div>}
      {success && <div className="create-event-success">{success}</div>}
      {loading && <div className="create-event-loading">Submitting...</div>}

      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="required">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="description" className="required">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your pitch event"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date" className="required">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="create-event-submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Submitting...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </div>
  );
}