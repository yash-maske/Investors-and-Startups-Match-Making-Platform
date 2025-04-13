import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profileinput.css';

export default function ProfileInput() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    mobileNumber: '',
    panNumber: '',
    aadharNumber: '',
    address: '',
    country: '',
    pincode: '',
    aadharCardPhoto: null,
    panCardPhoto: null,
    minInvestment: '',
    maxInvestment: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false); // Track if approval is pending
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const checkApprovalStatus = async (token) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/investors/isInvestorApproved',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('KYC submitted successfully. You are approved!');
        setIsPendingApproval(false);
        setTimeout(() => navigate('/application/startups'), 1500);
        return true;
      } else {
        setSuccessMessage('KYC submitted successfully. Awaiting approval...');
        setIsPendingApproval(true);
        return false;
      }
    } catch (err) {
      setIsPendingApproval(false);
      if (err.response?.status === 401) {
        setErrorMessage('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMessage('Error checking approval status. Please try again.');
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in to continue.');
      setIsLoading(false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const data = new FormData();
    data.append('email', formData.email);
    data.append('fullName', formData.fullName);
    data.append('mobileNumber', formData.mobileNumber);
    data.append('panNumber', formData.panNumber);
    data.append('aadharNumber', formData.aadharNumber);
    data.append('address', formData.address);
    data.append('country', formData.country);
    data.append('pincode', formData.pincode);
    data.append('minInvestment', formData.minInvestment);
    data.append('maxInvestment', formData.maxInvestment);
    if (formData.aadharCardPhoto) {
      data.append('aadharCardPhoto', formData.aadharCardPhoto);
    }
    if (formData.panCardPhoto) {
      data.append('panCardPhoto', formData.panCardPhoto);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/investors/kyc/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setFormData({
          email: '',
          fullName: '',
          mobileNumber: '',
          panNumber: '',
          aadharNumber: '',
          address: '',
          country: '',
          pincode: '',
          aadharCardPhoto: null,
          panCardPhoto: null,
          minInvestment: '',
          maxInvestment: '',
        });
        await checkApprovalStatus(token);
      } else {
        setErrorMessage(response.data.message || 'Failed to submit KYC');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMessage('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMessage(err.response?.data?.message || 'Error connecting to server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for approval status if pending
  useEffect(() => {
    let interval;
    if (isPendingApproval) {
      interval = setInterval(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('Session expired. Please log in again.');
          setIsPendingApproval(false);
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        const isApproved = await checkApprovalStatus(token);
        if (isApproved) {
          clearInterval(interval);
        }
      }, 30000); // Check every 30 seconds
    }
    return () => clearInterval(interval);
  }, [isPendingApproval, navigate]);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in to continue.');
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [navigate]);

  // Full-page loading symbol when approval is pending
  if (isPendingApproval) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="pulse-loader"></div>
          <h2 className="loading-title">Awaiting Approval</h2>
          <p className="loading-message">
            Your KYC is under review. Please wait while we verify your details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-input-container">
      <h2 className="profile-input-title">Investor Profile</h2>
      {successMessage && (
        <p className="profile-success" aria-live="polite">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="profile-error" aria-live="polite">
          {errorMessage}
        </p>
      )}
      <form className="profile-input-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="panNumber">PAN Number</label>
          <input
            type="text"
            id="panNumber"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="Enter your PAN number"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="aadharNumber">Aadhar Number</label>
          <input
            type="text"
            id="aadharNumber"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
            placeholder="Enter your Aadhar number"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter your pincode"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="aadharCardPhoto">Aadhar Card Photo</label>
          <input
            type="file"
            id="aadharCardPhoto"
            name="aadharCardPhoto"
            onChange={handleFileChange}
            accept="image/*"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="panCardPhoto">PAN Card Photo</label>
          <input
            type="file"
            id="panCardPhoto"
            name="panCardPhoto"
            onChange={handleFileChange}
            accept="image/*"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="minInvestment">Minimum Investment (₹)</label>
          <input
            type="number"
            id="minInvestment"
            name="minInvestment"
            value={formData.minInvestment}
            onChange={handleChange}
            placeholder="Enter minimum investment amount"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxInvestment">Maximum Investment (₹)</label>
          <input
            type="number"
            id="maxInvestment"
            name="maxInvestment"
            value={formData.maxInvestment}
            onChange={handleChange}
            placeholder="Enter maximum investment amount"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="profile-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span> Submitting...
            </>
          ) : (
            'Proceed'
          )}
        </button>
      </form>
    </div>
  );
}