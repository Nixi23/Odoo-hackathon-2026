// ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Globe, 
  Trash2, 
  Save, 
  AlertOctagon, 
  Heart, 
  Info,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
];

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [photo, setPhoto] = useState(AVATAR_PRESETS[0]);
  const [savedCities, setSavedCities] = useState([]);
  
  const [preplannedList, setPreplannedList] = useState([]);
  const [previousList, setPreviousList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await mockDataService.getCurrentUser();
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setLanguage(user.language || 'en');
          setPhoto(user.photo);

          // Resolve city structures for saved destinations
          const allCities = await mockDataService.getCities();
          const savedList = allCities.filter(c => user.savedDestinations?.includes(c.id));
          setSavedCities(savedList);
        }

        // Load preplanned and previous trips lists for sidebars (slice to 3 initially)
        const preplanned = await mockDataService.getPreplannedTrips();
        setPreplannedList(preplanned.slice(0, 3));

        const previous = await mockDataService.getPreviousTrips();
        setPreviousList(previous.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await mockDataService.updateProfile({ name, email, language, photo });
      showToast("Profile settings saved successfully!");
    } catch (err) {
      showToast("Error saving profile details.");
    } finally {
      setSaving(false);
    }
  };

  const handleUnsaveCity = async (cityId) => {
    try {
      const user = await mockDataService.getCurrentUser();
      const updatedSaved = user.savedDestinations.filter(id => id !== cityId);
      await mockDataService.updateProfile({ savedDestinations: updatedSaved });
      setSavedCities(savedCities.filter(c => c.id !== cityId));
      showToast("Removed from saved list.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      showToast("Confirmation keyword does not match.");
      return;
    }
    try {
      await mockDataService.deleteAccount();
      navigate('/login');
    } catch (err) {
      showToast("Error deleting account.");
    }
  };

  const handleClonePreplanned = async (id) => {
    try {
      const cloned = await mockDataService.clonePreplannedTrip(id);
      showToast("Preplanned package cloned to your dashboard!");
      navigate(`/itinerary/view/${cloned.id}`);
    } catch (err) {
      showToast("Failed to clone preplanned package.");
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '350px' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      {/* Toast */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={profileStyles.headerRow}>
        <div>
          <h2 style={profileStyles.pageTitle}>User Profile Page</h2>
          <p style={profileStyles.pageSubtitle}>Edit details, examine saved destinations, preplanned packages and past itineraries.</p>
        </div>
      </div>

      <div style={profileStyles.layoutGrid}>
        {/* Left Side Column: Forms & Settings */}
        <div style={profileStyles.leftColumn}>
          <form onSubmit={handleSaveProfile} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
            <h3 style={profileStyles.sectionTitle}>Account Details</h3>

            {/* Avatar Select */}
            <div style={profileStyles.avatarSection}>
              <img src={photo} alt="Avatar" style={profileStyles.profilePreviewImg} />
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ marginBottom: '6px', fontSize: '0.85rem' }}>Select Avatar Picture</label>
                <div style={profileStyles.avatarGrid}>
                  {AVATAR_PRESETS.map((presetUrl, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(presetUrl)}
                      style={{
                        ...profileStyles.avatarOptionBtn,
                        backgroundImage: `url(${presetUrl})`,
                        borderColor: photo === presetUrl ? 'var(--primary-light)' : 'transparent',
                        borderWidth: photo === presetUrl ? '2px' : '0px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={profileStyles.inputIconWrap}>
                <User size={16} style={profileStyles.inputIcon} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={profileStyles.inputIconWrap}>
                <Mail size={16} style={profileStyles.inputIcon} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Language Preference</label>
              <div style={profileStyles.inputIconWrap}>
                <Globe size={16} style={profileStyles.inputIcon} />
                <select 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '42px' }} disabled={saving}>
              <Save size={16} />
              <span>{saving ? "Saving settings..." : "Save Profile Details"}</span>
            </button>
          </form>

          {/* Saved Destinations list */}
          <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
            <h3 style={profileStyles.sectionTitle}>
              <Heart size={16} color="var(--error)" style={{ marginRight: 6 }} />
              <span>Saved Catalog ({savedCities.length})</span>
            </h3>
            {savedCities.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                No cities favorited yet. Save destinations in the Explore tab.
              </p>
            ) : (
              <div style={profileStyles.savedList}>
                {savedCities.map(city => (
                  <div key={city.id} style={profileStyles.savedItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={city.image} alt={city.name} style={profileStyles.savedThumb} />
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{city.name}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>{city.country}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUnsaveCity(city.id)}
                      style={profileStyles.unsaveBtn}
                      title="Unsave"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card" style={profileStyles.dangerCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '8px' }}>
              <AlertOctagon size={20} color="var(--error)" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--error)' }}>Danger Zone</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Permanently delete your account and all associated travel records. This cannot be undone.
            </p>
            <button 
              type="button" 
              className="btn btn-danger btn-sm" 
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Right Side Column: Preplanned and Previous Trips sections */}
        <div style={profileStyles.rightColumn}>
          {/* Preplanned Trips Section (Exactly 3 initially) */}
          <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={profileStyles.sectionHeader}>
              <h3 style={profileStyles.sectionTitle}>Preplanned Trip Packages</h3>
              <Link to="/preplanned" style={profileStyles.sectionLink}>
                <span>View More</span>
                <ChevronRight size={14} />
              </Link>
            </div>
            <div style={profileStyles.tripCardsStack}>
              {preplannedList.map(trip => (
                <div key={trip.id} style={profileStyles.tripCard}>
                  <img src={trip.coverPhoto} alt={trip.name} style={profileStyles.tripCardImg} />
                  <div style={profileStyles.tripCardInfo}>
                    <h4 style={profileStyles.tripCardName}>{trip.name}</h4>
                    <span style={profileStyles.tripCardMeta}>
                      {trip.durationDays} Days • {trip.stopsCount} Stops
                    </span>
                    <p style={profileStyles.tripCardDesc}>{trip.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span style={profileStyles.tripCardCost}>{currencyService.format(trip.budget, "India")}</span>
                      <button 
                        onClick={() => handleClonePreplanned(trip.id)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Clone Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Trips Section (Exactly 3 initially) */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={profileStyles.sectionHeader}>
              <h3 style={profileStyles.sectionTitle}>Previous Travel Diaries</h3>
              <Link to="/previous" style={profileStyles.sectionLink}>
                <span>View More</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {previousList.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic', padding: '16px 0' }}>
                No completed trips in history yet. Your completed vacations will appear here.
              </p>
            ) : (
              <div style={profileStyles.tripCardsStack}>
                {previousList.map(trip => (
                  <div key={trip.id} style={profileStyles.tripCard}>
                    <img src={trip.coverPhoto} alt={trip.name} style={profileStyles.tripCardImg} />
                    <div style={profileStyles.tripCardInfo}>
                      <h4 style={profileStyles.tripCardName}>{trip.name}</h4>
                      <span style={profileStyles.tripCardMeta}>
                        <Calendar size={10} style={{ marginRight: 4 }} />
                        {trip.startDate} to {trip.endDate}
                      </span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <span style={profileStyles.tripCardCost}>{currencyService.format(trip.budgetLimit, "India")}</span>
                        <button 
                          onClick={() => navigate(`/itinerary/view/${trip.id}`)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={profileStyles.modalOverlay}>
          <div className="card" style={profileStyles.modalCard}>
            <h3 style={{ color: 'var(--error)', marginBottom: '10px' }}>Delete Account Permanently?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              All your custom itineraries, routes, and statistics will be wiped out. Please type <strong>delete</strong> below to confirm.
            </p>
            <input 
              type="text" 
              placeholder="delete" 
              className="form-input" 
              style={{ marginBottom: '16px' }}
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const profileStyles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '28px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    marginBottom: '10px',
  },
  profilePreviewImg: {
    width: '60px',
    height: '60px',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
    border: '2px solid var(--primary-light)',
  },
  avatarGrid: {
    display: 'flex',
    gap: 6,
    marginTop: '4px',
  },
  avatarOptionBtn: {
    width: '30px',
    height: '30px',
    borderRadius: 'var(--radius-full)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    outline: 'none',
    borderStyle: 'solid',
    transition: 'transform var(--transition-fast)',
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
  },
  savedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: '12px',
  },
  savedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  savedThumb: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-sm)',
    objectFit: 'cover',
  },
  unsaveBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--error)',
    cursor: 'pointer',
    padding: '6px',
  },
  dangerCard: {
    padding: '20px',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    backgroundColor: 'rgba(239, 68, 68, 0.01)',
    marginTop: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionLink: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--primary)',
    textDecoration: 'none',
  },
  tripCardsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  tripCard: {
    display: 'flex',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-main)',
  },
  tripCardImg: {
    width: '90px',
    height: '110px',
    objectFit: 'cover',
  },
  tripCardInfo: {
    padding: '10px 14px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 2,
  },
  tripCardName: {
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  tripCardMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    display: 'flex',
    alignItems: 'center',
  },
  tripCardDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tripCardCost: {
    fontWeight: 800,
    color: 'var(--primary-hover)',
    fontSize: '0.85rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalCard: {
    maxWidth: '400px',
    padding: '24px',
  }
};
