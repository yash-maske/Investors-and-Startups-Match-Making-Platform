import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import './register.css';

export default function Register() {
  const [userType, setUserType] = useState('investor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
      userType,
    };

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register/', {
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token); // Debug
        setSuccess(response.data.message);

        if (userType === 'investor') {
          setTimeout(() => navigate('/profile-input'), 1000);
        } else {
          setTimeout(() => navigate('/startup-profile'), 1000);
        }
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      console.error('Error:', err); // Debug
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Please fill in all required fields');
            break;
          case 409:
            setError('User with this email already exists');
            break;
          case 500:
            setError('Server error, please try again later');
            break;
          default:
            setError('An unexpected error occurred');
        }
      } else {
        setError('Network error, please check your connection');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-background"></div>
      <div className="register-content">
        <div className="register-form-wrapper">
          <h2 className="register-title">Create Your Account</h2>
          <p className="register-subtitle">Join the platform for startups and investors</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="email" className="register-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="register-input"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="register-field">
              <label htmlFor="password" className="register-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="register-input password-input"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <div className="register-field">
              <label htmlFor="confirmPassword" className="register-label">
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="register-input password-input"
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <div className="register-user-type">
              <p className="register-user-type-label">I am a:</p>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="investor"
                    className="register-radio"
                    checked={userType === 'investor'}
                    onChange={() => setUserType('investor')}
                    disabled={isLoading}
                  />
                  <span className="register-radio-text">Investor</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="startup"
                    className="register-radio"
                    checked={userType === 'startup'}
                    onChange={() => setUserType('startup')}
                    disabled={isLoading}
                  />
                  <span className="register-radio-text">Startup</span>
                </label>
              </div>
            </div>
            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Registering...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <p className="register-footer">
            Already have an account? <a href="/login" className="register-link">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}