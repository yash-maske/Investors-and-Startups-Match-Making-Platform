import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Shield, Menu, X, User, LogOut, LayoutDashboard, Users, CheckCircle } from 'lucide-react';
import './adminnavbar.css';

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    // Clear token or session (adjust based on your auth system)
    localStorage.removeItem('token');
    setIsLogoutModalOpen(false);
    navigate('/login'); // Redirect to login page
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <nav className="admin-navbar">
        {/* Logo/Brand */}
        <div className="admin-navbar-logo">
          <Shield size={28} className="admin-navbar-logo-icon" />
          <h2>AdminHub</h2>
        </div>

        <div className="admin-navbar-container">
          {/* Desktop Navigation Links */}
          <ul className={`admin-navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a href="/admin/dashboard" className="admin-navbar-link">
                <LayoutDashboard size={18} /> Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/verify-investor" className="admin-navbar-link">
                <CheckCircle size={18} /> Investor Verification
              </a>
            </li>
            <li>
              <a href="/admin/verify-startup" className="admin-navbar-link">
                <Users size={18} /> Startup Verification
              </a>
            </li>
            <li>
              <a href="/admin/profile" className="admin-navbar-link">
                <User size={18} /> Profile
              </a>
            </li>
            <li>
              <button className="admin-navbar-link logout" onClick={handleLogoutClick}>
                <LogOut size={18} /> Log Out
              </button>
            </li>
          </ul>

          {/* Hamburger Menu for Mobile */}
          <div className="admin-navbar-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="admin-logout-modal-overlay">
          <div className="admin-logout-modal">
            <h3 className="admin-logout-modal-title">Are You Sure?</h3>
            <p className="admin-logout-modal-message">
              You are about to log out of AdminHub. Do you want to proceed?
            </p>
            <div className="admin-logout-modal-buttons">
              <button className="admin-logout-modal-button cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="admin-logout-modal-button confirm" onClick={confirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}