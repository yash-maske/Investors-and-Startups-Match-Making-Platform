import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import { User, LogOut, Menu, X, Rocket } from 'lucide-react';

export default function NavbarStartup() {
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
                href="/startup/profile"
                className={`navbar-link ${isActive('/startup/profile') ? 'active' : ''}`}
              >
                <User size={18} /> My Profile
              </a>
            </li>
            <li>
              <a
                href="/statrtups/allinvestors"
                className={`navbar-link ${isActive('/statrtups/allinvestors') ? 'active' : ''}`}
              >
                Funding Opportunities
              </a>
            </li>
            <li>
              <a
                href="/statrtups/applications"
                className={`navbar-link ${isActive('/statrtups/applications') ? 'active' : ''}`}
              >
                My Applications
              </a>
            </li>
            <li>
              <a
                href="/statrtups/stmeet"
                className={`navbar-link ${isActive('/statrtups/stmeet') ? 'active' : ''}`}
              >
                My Meetings
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