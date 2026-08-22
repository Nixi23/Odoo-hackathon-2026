// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Key, Mail, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await mockDataService.login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginStyles.pageWrapper}>
      {/* Decorative blobs */}
      <div style={loginStyles.decorBlob1} />
      <div style={loginStyles.decorBlob2} />

      <div style={loginStyles.loginCard} className="card glassmorphism">
        <div style={loginStyles.brandHeader}>
          <div style={loginStyles.logoBadge}>
            <Compass size={32} color="var(--primary)" />
          </div>
          <h2 style={loginStyles.brandTitle}>GlobeTrotter</h2>
          <p style={loginStyles.brandSubtitle}>Empowering Intelligent Travel Planning</p>
        </div>

        {/* Screen 1 Profile Image Placeholder */}
        <div style={loginStyles.profilePlaceholderWrap}>
          <div style={loginStyles.profileCircle}>
            <User size={36} color="var(--text-light)" />
          </div>
          <span style={loginStyles.profileLabel}>Sign In to Account</span>
        </div>

        <form onSubmit={handleLogin} style={loginStyles.form}>
          {error && (
            <div style={loginStyles.errorAlert}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Username (Email Address) */}
          <div className="form-group">
            <label className="form-label">Username / Email Address</label>
            <div style={loginStyles.inputIconWrap}>
              <Mail size={18} style={loginStyles.inputIcon} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '42px' }}
                placeholder="email@globetrotter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={loginStyles.inputIconWrap}>
              <Key size={18} style={loginStyles.inputIcon} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-input" 
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                style={loginStyles.eyeButton} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px', height: '46px' }} 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={loginStyles.dividerWrap}>
          <div style={loginStyles.horizontalLine} />
          <span style={loginStyles.dividerText}>new user?</span>
          <div style={loginStyles.horizontalLine} />
        </div>

        <div style={loginStyles.footerText}>
          <span>Don't have an account?</span>{' '}
          <Link to="/register" style={loginStyles.registerLink}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

const loginStyles = {
  pageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  decorBlob1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: 'var(--radius-full)',
    background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(15,118,110,0.01) 70%)',
    top: '-100px',
    left: '-100px',
    zIndex: 0,
  },
  decorBlob2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: 'var(--radius-full)',
    background: 'radial-gradient(circle, rgba(109,40,217,0.08) 0%, rgba(139,92,246,0.01) 70%)',
    bottom: '-150px',
    right: '-100px',
    zIndex: 0,
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '36px 28px',
    zIndex: 1,
    boxShadow: 'var(--shadow-premium)',
  },
  brandHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '20px',
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    border: '1px solid rgba(20, 184, 166, 0.15)',
  },
  brandTitle: {
    fontSize: '1.85rem',
    fontWeight: 800,
    letterSpacing: '-1.0px',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '3px',
  },
  profilePlaceholderWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
    gap: 8,
  },
  profileCircle: {
    width: '74px',
    height: '74px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-main)',
    border: '2px dashed var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-main)',
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
    left: '14px',
    color: 'var(--text-light)',
    pointerEvents: 'none',
  },
  eyeButton: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: 'var(--text-light)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error)',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '16px',
    border: '1px solid rgba(239, 68, 68, 0.15)',
  },
  dividerWrap: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
  horizontalLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--border)',
  },
  dividerText: {
    padding: '0 10px',
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  registerLink: {
    color: 'var(--primary)',
    fontWeight: 700,
    textDecoration: 'underline',
  }
};
