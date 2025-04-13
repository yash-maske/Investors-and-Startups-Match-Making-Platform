import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'investor', // Default userType
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send entire formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.Logined_User));
        setSuccessMessage(data.message);

        // Navigate after a brief delay to show success message
        setTimeout(() => {
          navigate('/application/startups');
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content">
        <div className="login-form-wrapper">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Log in to connect with startups and investors</p>
          {successMessage && (
            <p className="login-success" aria-live="polite">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="login-error" aria-live="polite">
              {errorMessage}
            </p>
          )}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="login-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="login-input password-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && togglePasswordVisibility()}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <div className="login-user-type">
              <p className="login-user-type-label">I am a:</p>
              <div className="login-radio-group">
                <label className="login-radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="investor"
                    className="login-radio"
                    checked={formData.userType === 'investor'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span className="login-radio-text">Investor</span>
                </label>
                <label className="login-radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="startup"
                    className="login-radio"
                    checked={formData.userType === 'startup'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span className="login-radio-text">Startup</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          <p className="login-footer">
            Don’t have an account?{' '}
            <a href="/register" className="login-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}