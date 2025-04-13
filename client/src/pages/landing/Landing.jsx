import { Link } from 'react-router-dom';
import { Rocket, Users, Video } from 'lucide-react';
import './landing.css';



function Landing() {

  return (
    <div className="landing-bg-white">
      <div className="landing-hero-container">
        {/* Background animation layer */}
        <div className="landing-hero-background"></div>
        <div className="landing-hero-content">
          <div className="landing-text-center">
            <h1 className="landing-title">
              Connect Startups with the Right Investors
            </h1>
            <p className="landing-subtitle">
              PitchConnect helps founders showcase their ideas and investors discover promising opportunities through AI-powered matching and virtual pitch events.
            </p>
            <div className="landing-cta-container">
              <Link to="/register" className="landing-cta-button">
                Get started
              </Link>
              <Link to="/login" className="landing-signin-link">
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-features-section">
        <div className="landing-features-container">
          <div className="landing-features-header">
            <h2 className="landing-features-subtitle">Platform Features</h2>
            <p className="landing-features-title">
              Everything you need to connect
            </p>
          </div>
          <div className="landing-features-grid">
            <dl className="landing-features-list">
              <div className="landing-feature-item">
                <dt className="landing-feature-title">
                  <Rocket className="landing-icon" />
                  Startup Profiles
                </dt>
                <dd className="landing-feature-description">
                  <p>Showcase your startup with comprehensive profiles including pitch decks, traction metrics, and funding needs.</p>
                </dd>
              </div>
              <div className="landing-feature-item">
                <dt className="landing-feature-title">
                  <Users className="landing-icon" />
                  Investor Dashboard
                </dt>
                <dd className="landing-feature-description">
                  <p>Filter and discover startups based on industry, stage, and investment criteria that match your interests.</p>
                </dd>
              </div>
              <div className="landing-feature-item">
                <dt className="landing-feature-title">
                  <Video className="landing-icon" />
                  Virtual Pitch Events
                </dt>
                <dd className="landing-feature-description">
                  <p>Connect directly with potential investors or startups through live Q&A sessions and virtual pitch events.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;