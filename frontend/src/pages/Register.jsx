// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Info, ArrowLeft, User } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
];

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(AVATAR_PRESETS[0]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const signupMeta = {
        phone,
        city,
        country,
        additionalInfo,
        photo,
        language: 'en'
      };
      await mockDataService.signup(fullName, email, password, signupMeta);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={regStyles.pageWrapper}>
      <div style={regStyles.decorBlob1} />
      <div style={regStyles.decorBlob2} />

      <div style={regStyles.regCard} className="card glassmorphism">
        {/* Back Link */}
        <Link to="/login" style={regStyles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </Link>

        <div style={regStyles.brandHeader}>
          <div style={regStyles.logoBadge}>
            <Compass size={24} color="var(--primary)" />
          </div>
          <h2 style={regStyles.brandTitle}>Create Account</h2>
          <p style={regStyles.brandSubtitle}>Join GlobeTrotter to build collaborative trips</p>
        </div>

        {/* Screen 2: Profile Photo Preset Selection */}
        <div style={regStyles.avatarSection}>
          <img src={photo} alt="Avatar Selected" style={regStyles.avatarPreview} />
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ marginBottom: '6px', fontSize: '0.85rem' }}>Choose Profile Photo</label>
            <div style={regStyles.avatarGrid}>
              {AVATAR_PRESETS.map((presetUrl, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => setPhoto(presetUrl)}
                  style={{
                    ...regStyles.avatarOptionBtn,
                    backgroundImage: `url(${presetUrl})`,
                    borderColor: photo === presetUrl ? 'var(--primary-light)' : 'transparent',
                    borderWidth: photo === presetUrl ? '2px' : '0px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} style={regStyles.form}>
          {error && (
            <div style={regStyles.errorAlert}>
              <Info size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* First Name & Last Name */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Rahul"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Sharma"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email & Password */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={regStyles.inputIconWrap}>
                <Mail size={16} style={regStyles.inputIcon} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                  placeholder="rahul@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone Number & City */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={regStyles.inputIconWrap}>
                <Phone size={16} style={regStyles.inputIcon} />
                <input 
                  type="tel" 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                  placeholder="+91 99999 88888"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <div style={regStyles.inputIconWrap}>
                <MapPin size={16} style={regStyles.inputIcon} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                  placeholder="Mumbai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Country & Additional Information */}
          <div className="form-group">
            <label className="form-label">Country</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="India"
              value={country}
              onChange={e => setCountry(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Information / Bio</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: '70px', resize: 'vertical' }}
              placeholder="Tell us about your favorite travel styles, destinations, or hobbies..."
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px', height: '44px' }} 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
}

const regStyles = {
  pageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    position: 'relative',
    overflow: 'hidden',
    padding: '30px 24px',
  },
  decorBlob1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: 'var(--radius-full)',
    background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, rgba(15,118,110,0.01) 70%)',
    top: '-80px',
    left: '-80px',
    zIndex: 0,
  },
  decorBlob2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: 'var(--radius-full)',
    background: 'radial-gradient(circle, rgba(109,40,217,0.07) 0%, rgba(139,92,246,0.01) 70%)',
    bottom: '-100px',
    right: '-80px',
    zIndex: 0,
  },
  regCard: {
    width: '100%',
    maxWidth: '540px',
    padding: '32px 28px',
    zIndex: 1,
    boxShadow: 'var(--shadow-premium)',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '16px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  brandHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    border: '1px solid rgba(20, 184, 166, 0.15)',
  },
  brandTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  brandSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: '20px',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border)',
  },
  avatarPreview: {
    width: '60px',
    height: '60px',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
    border: '2px solid var(--primary-light)',
  },
  avatarGrid: {
    display: 'flex',
    gap: 8,
    marginTop: '4px',
  },
  avatarOptionBtn: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    outline: 'none',
    borderStyle: 'solid',
    transition: 'transform var(--transition-fast)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputIconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-light)',
    pointerEvents: 'none',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error)',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '14px',
    border: '1px solid rgba(239, 68, 68, 0.15)',
  }
};
