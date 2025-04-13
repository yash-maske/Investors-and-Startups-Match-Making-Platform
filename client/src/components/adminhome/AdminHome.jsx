import { useNavigate } from 'react-router-dom';
import { Users, Rocket } from 'lucide-react';
import './adminhome.css';

export default function AdminHome() {
  const navigate = useNavigate();

  const handleInvestorsClick = () => {
    navigate('/admin/verify-investor');
  };

  const handleStartupsClick = () => {
    // Placeholder for future navigation
    navigate('/admin/verify-startup'); // Update as needed
  };

  return (
    <div className="admin-home-container">
      <div className="admin-home-background"></div>
      <div className="admin-home-content">
  

        <div className="admin-home-options">
          <div className="admin-home-card" onClick={handleInvestorsClick}>
            <Users size={48} className="admin-home-card-icon" />
            <h3 className="admin-home-card-title">Investors</h3>
            <p className="admin-home-card-description">
              Verify investor profiles and documents
            </p>
            <button className="admin-home-card-button">Go to Verification</button>
          </div>

          <div className="admin-home-card" onClick={handleStartupsClick}>
            <Rocket size={48} className="admin-home-card-icon" />
            <h3 className="admin-home-card-title">Startups</h3>
            <p className="admin-home-card-description">
              Review and manage startup applications
            </p>
            <button className="admin-home-card-button">Go to Startups</button>
          </div>
        </div>
      </div>
    </div>
  );
}