import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import { User, LogOut, Menu, X, Rocket } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Rocket size={24} className="navbar-logo-icon" />
          <h2>StartupMatch</h2>
        </div>

        <div className="navbar-container">
          <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a
                href="/application/startups"
                className={`navbar-link ${isActive('/application/startups') ? 'active' : ''}`}
              >
                All Startups
              </a>
            </li>
            <li>
              <a
                href="/application/discover-startups"
                className={`navbar-link ${isActive('/application/discover-startups') ? 'active' : ''}`}
              >
                Discover
              </a>
            </li>
            <li>
              <a
                href="/application/myinvestment"
                className={`navbar-link ${isActive('/application/myinvestment') ? 'active' : ''}`}
              >
                My Investments
              </a>
            </li>
            <li>
              <a
                href="/application/inmeet"
                className={`navbar-link ${isActive('/application/inmeet') ? 'active' : ''}`}
              >
                <User size={18} /> My Meetings
              </a>
            </li>
            <li>
              <a
                href="#logout"
                className="navbar-link"
                onClick={handleLogoutClick}
              >
                <LogOut size={18} /> Log Out
              </a>
            </li>
          </ul>

          <div className="navbar-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>
      </nav>

      {isLogoutModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3 className="logout-modal-title">Are You Sure?</h3>
            <p className="logout-modal-message">
              You are about to log out of StartupHub. Do you want to proceed?
            </p>
            <div className="logout-modal-buttons">
              <button className="logout-modal-button cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="logout-modal-button confirm" onClick={confirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}