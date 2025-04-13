import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import './verify.css';

export default function Verify() {
  const [investors, setInvestors] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/admin/adminInvestorList');
        if (response.data.success) {
          setInvestors(response.data.investors);
        } else {
          setError('Failed to fetch investors: ' + response.data.message);
        }
      } catch (err) {
        setError('Unable to connect to server. Please try again later.');
        console.error('Error fetching investors:', err);
      }
    };

    fetchInvestors();
  }, []);

  const handleVerification = async (investorId, action) => {
    try {
      if (action === 'approved') {
        const response = await axios.get(`http://127.0.0.1:5000/api/admin/approve/investor/${investorId}/`);
        if (response.data.success) {
          setInvestors(
            investors.map((investor) =>
              investor._id === investorId
                ? { ...investor, status: response.data.newInvestorData.status }
                : investor
            )
          );
        } else {
          setError('Failed to approve investor: ' + response.data.message);
        }
      } else if (action === 'rejected') {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/admin/reject/investor/${investorId}/`
        );
        if (response.data.success) {
          setInvestors(investors.filter((investor) => investor._id !== investorId));
        } else {
          setError('Failed to reject investor: ' + response.data.message);
        }
      }
    } catch (err) {
      setError(`Failed to ${action === 'approved' ? 'approve' : 'reject'} investor: ${err.message}`);
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
    <div className="inv-verify-container">
      <div className="inv-verify-background"></div>
      <div className="inv-verify-content">
        <h1 className="inv-verify-title">Investor Verification</h1>
        <p className="inv-verify-subtitle">Review and verify investor profiles</p>

        {error && <div className="inv-verify-error">{error}</div>}

        {!error && investors.length === 0 && (
          <p className="inv-verify-empty">No investors pending verification.</p>
        )}

        <div className="inv-verify-investors">
          {investors.map((investor) => (
            <div key={investor._id} className="inv-verify-investor-card">
              <div className="inv-verify-investor-header">
                <h3 className="inv-verify-investor-name">{investor.fullName}</h3>
                <span
                  className={`inv-verify-investor-status ${
                    investor.status === 'approved'
                      ? 'inv-verify-status-approved'
                      : investor.status === 'rejected'
                      ? 'inv-verify-status-rejected'
                      : 'inv-verify-status-pending'
                  }`}
                >
                  {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
                </span>
              </div>

              <div className="inv-verify-investor-details">
                <p><strong>Email:</strong> {investor.email || 'N/A'}</p>
                <p><strong>Mobile:</strong> {investor.mobileNumber}</p>
                <p><strong>PAN:</strong> {investor.panNumber}</p>
                <p><strong>Aadhaar:</strong> {investor.aadharNumber}</p>
                <p>
                  <strong>Address:</strong> {investor.address}, {investor.pincode}, {investor.country}
                </p>
                <p>
                  <strong>Investment Range:</strong> ₹{investor.minInvestment.toLocaleString()} - ₹
                  {investor.maxInvestment.toLocaleString()}
                </p>
                <p>
                  <strong>Registered:</strong>{' '}
                  {new Date(investor.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="inv-verify-investor-documents">
                <button
                  className="inv-verify-document-button"
                  onClick={() => openDocumentModal(investor.aadharCardPhoto)}
                >
                  <Eye size={18} /> View Aadhaar
                </button>
                <button
                  className="inv-verify-document-button"
                  onClick={() => openDocumentModal(investor.panCardPhoto)}
                >
                  <Eye size={18} /> View PAN
                </button>
              </div>

              {investor.status === 'pending' && (
                <div className="inv-verify-investor-actions">
                  <button
                    className="inv-verify-action-button inv-verify-approve"
                    onClick={() => handleVerification(investor._id, 'approved')}
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    className="inv-verify-action-button inv-verify-reject"
                    onClick={() => handleVerification(investor._id, 'rejected')}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="inv-verify-document-modal-overlay" onClick={closeModal}>
            <div className="inv-verify-document-modal" onClick={(e) => e.stopPropagation()}>
              <button className="inv-verify-modal-close" onClick={closeModal}>
                <XCircle size={24} />
              </button>
              {imageError ? (
                <p className="inv-verify-modal-error">Failed to load image. Please check the URL.</p>
              ) : (
                <img
                  src={modalImage}
                  alt="Document"
                  className="inv-verify-modal-image"
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