import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import './verify.css';

export default function Verify() {
  const [startups, setStartups] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
       
        const response = await axios.get('http://127.0.0.1:5000/api/admin/adminStartupList', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          console.log('Fetched startups:', response.data.startups);
          setStartups(response.data.startups);
        } else {
          setError('Failed to fetch startups: ' + response.data.message);
        }
      } catch (err) {
        setError('Unable to connect to server. Please try again later.');
        console.error('Error fetching startups:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const handleVerification = async (startupId, action) => {
    try {
      const token = localStorage.getItem('token');

      if (action === 'approved') {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/admin/approve/startup/${startupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setStartups(
            startups.map((startup) =>
              startup._id === startupId
                ? { ...startup, status: response.data.newStartupData.status }
                : startup
            )
          );
        } else {
          setError('Failed to approve startup: ' + response.data.message);
        }
      } else if (action === 'rejected') {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/admin/reject/startup/${startupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setStartups(startups.filter((startup) => startup._id !== startupId));
        } else {
          setError('Failed to reject startup: ' + response.data.message);
        }
      }
    } catch (err) {
      setError(`Failed to ${action === 'approved' ? 'approve' : 'reject'} startup: ${err.message}`);
    }
  };

  const openDocumentModal = (imageUrl) => {
    setModalImage(imageUrl);
    setImageError(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="vfy-container">
      <div className="vfy-background"></div>
      <div className="vfy-content">
        <h1 className="vfy-title">Startup Verification</h1>
        <p className="vfy-subtitle">Review and verify startup profiles</p>

        {error && <div className="vfy-error">{error}</div>}
        {isLoading && <p className="vfy-loading">Loading startups...</p>}
        {!error && !isLoading && startups.length === 0 && (
          <p className="vfy-empty">No startups pending verification.</p>
        )}

        <div className="vfy-startups">
          {startups.map((startup) => (
            <div key={startup._id} className="vfy-startup-card">
              <div className="vfy-startup-header">
                <h3 className="vfy-startup-name">{startup.company}</h3>
                <span
                  className={`vfy-startup-status ${
                    startup.status === 'approved'
                      ? 'vfy-status-approved'
                      : startup.status === 'rejected'
                      ? 'vfy-status-rejected'
                      : 'vfy-status-pending'
                  }`}
                >
                  {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
                </span>
              </div>

              <div className="vfy-startup-details">
                <p><strong>Founded:</strong> {startup.founded}</p>
                <p><strong>Headquarters:</strong> {startup.headquarters}</p>
                <p><strong>Sector:</strong> {startup.sector}</p>
                <p><strong>Description:</strong> {startup.description}</p>
                <p><strong>Founder:</strong> {startup.founder}</p>
                <p><strong>Investors:</strong> {startup.investors}</p>
                <p><strong>Funding Amount:</strong> ₹{startup.amount.toLocaleString()}</p>
                <p><strong>Registered:</strong> {new Date(startup.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="vfy-startup-documents">
                <button
                  className="vfy-document-button"
                  onClick={() => openDocumentModal(startup.certificateOfIncorporation)}
                >
                  <Eye size={18} /> View Incorporation
                </button>
                <button
                  className="vfy-document-button"
                  onClick={() => openDocumentModal(startup.panCard)}
                >
                  <Eye size={18} /> View PAN
                </button>
                <button
                  className="vfy-document-button"
                  onClick={() => openDocumentModal(startup.aadharCard)}
                >
                  <Eye size={18} /> View Aadhaar
                </button>
                <button
                  className="vfy-document-button"
                  onClick={() => openDocumentModal(startup.investorAgreement)}
                >
                  <Eye size={18} /> View Agreement
                </button>
              </div>

              {startup.status === 'pending' && (
                <div className="vfy-startup-actions">
                  <button
                    className="vfy-action-button vfy-approve"
                    onClick={() => handleVerification(startup._id, 'approved')}
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    className="vfy-action-button vfy-reject"
                    onClick={() => handleVerification(startup._id, 'rejected')}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="vfy-document-modal-overlay" onClick={closeModal}>
            <div className="vfy-document-modal" onClick={(e) => e.stopPropagation()}>
              <button className="vfy-modal-close" onClick={closeModal}>
                <XCircle size={24} />
              </button>
              {imageError ? (
                <p className="vfy-modal-error">Failed to load image. Please check the URL.</p>
              ) : (
                <img
                  src={modalImage}
                  alt="Document"
                  className="vfy-modal-image"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}