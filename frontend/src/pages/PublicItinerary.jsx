// PublicItinerary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  Globe, 
  ChevronRight, 
  Check,
  Share2,
  Info
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';

export default function PublicItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadTrip() {
      try {
        const tripData = await mockDataService.getTripById(tripId);
        if (tripData && tripData.isPublic) {
          setTrip(tripData);
        } else {
          setTrip(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast("Shareable link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCloneTrip = async () => {
    setCloning(true);
    try {
      const user = await mockDataService.getCurrentUser();
      if (!user) {
        // Not logged in, redirect to login
        showToast("Please sign in to copy this itinerary to your account.");
        setTimeout(() => navigate(`/login?redirect=/share/${tripId}`), 1500);
        return;
      }
      
      const cloned = await mockDataService.cloneTrip(tripId);
      showToast(`Successfully copied to your itineraries!`);
      setTimeout(() => navigate(`/itinerary/view/${cloned.id}`), 1200);
    } catch (err) {
      console.error(err);
      showToast("Error duplicating itinerary.");
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <div className="skeleton" style={{ width: '400px', height: '300px' }} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', padding: '24px' }}>
        <div className="card flex-center" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px 24px', flexDirection: 'column' }}>
          <Globe size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <h3>Itinerary Not Available</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', marginBottom: '24px' }}>
            This travel itinerary is private, has been deleted, or the shared link is invalid. Ask the trip owner to enable public sharing in their settings.
          </p>
          <Link to="/login" className="btn btn-primary">Go to GlobeTrotter</Link>
        </div>
      </div>
    );
  }

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const totalDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Group trip stops
  const stops = trip.stops || [];

  return (
    <div style={publicStyles.pageBg}>
      {/* Toast */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Top Navbar Header */}
      <header style={publicStyles.header}>
        <div style={publicStyles.logoContainer}>
          <Compass size={24} color="var(--primary)" />
          <span style={publicStyles.logoText}>GlobeTrotter Shared</span>
        </div>
        <button 
          onClick={handleCloneTrip} 
          className="btn btn-primary"
          disabled={cloning}
        >
          <Copy size={16} />
          <span>{cloning ? "Copying..." : "Copy to My Trips"}</span>
        </button>
      </header>

      {/* Main Body */}
      <main style={publicStyles.main}>
        {/* Banner */}
        <div style={{ ...publicStyles.banner, backgroundImage: `url(${trip.coverPhoto})` }}>
          <div style={publicStyles.bannerOverlay}>
            <span style={publicStyles.sharedBadge}>
              <Globe size={12} />
              <span>Shared Travel Plan</span>
            </span>
            <h1 style={publicStyles.tripName}>{trip.name}</h1>
            <p style={publicStyles.tripDates}>
              <Calendar size={14} />
              <span>{trip.startDate} to {trip.endDate} • {totalDays} Days • {stops.length} Cities</span>
            </p>
          </div>
        </div>

        {/* Layout Column */}
        <div style={publicStyles.contentLayout}>
          {/* Timeline content */}
          <div style={publicStyles.leftCol}>
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '8px' }}>About This Journey</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {trip.description || "An inspiring adventure created and shared by a GlobeTrotter user."}
              </p>
            </div>

            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Route & Day Timeline</span>
              <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{stops.length} Stops</span>
            </h3>

            {stops.length === 0 ? (
              <div className="card flex-center" style={{ padding: '40px', color: 'var(--text-light)' }}>
                <Info size={28} />
                <p style={{ marginTop: '8px' }}>No stops added to this plan yet.</p>
              </div>
            ) : (
              <div style={publicStyles.timeline}>
                {stops.map((stop, idx) => {
                  const nights = Math.max(1, Math.ceil(Math.abs(new Date(stop.departureDate) - new Date(stop.arrivalDate)) / (1000 * 60 * 60 * 24)));
                  const cityLabel = stop.cityId === 'c1' ? 'Paris' : stop.cityId === 'c2' ? 'Tokyo' : stop.cityId === 'c3' ? 'Rome' : stop.cityId === 'c4' ? 'Bali' : 'City';
                  return (
                    <div key={stop.id} style={publicStyles.timelineItem}>
                      <div style={publicStyles.timelineMarker}>
                        <div style={publicStyles.markerCircle}>{idx + 1}</div>
                        {idx < stops.length - 1 && <div style={publicStyles.markerLine} />}
                      </div>

                      <div className="card" style={publicStyles.timelineCard}>
                        <div style={publicStyles.cardHeader}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{cityLabel} stop</h4>
                            <span style={publicStyles.cardDates}>
                              <Calendar size={12} />
                              <span>{stop.arrivalDate} to {stop.departureDate} ({nights} nights)</span>
                            </span>
                          </div>
                          <span className="badge badge-success">
                            {stop.activities.length} Events
                          </span>
                        </div>

                        {/* Activities */}
                        {stop.activities.length > 0 && (
                          <div style={publicStyles.activitiesList}>
                            {stop.activities.map(act => (
                              <div key={act.id} style={publicStyles.actItem}>
                                <div style={publicStyles.actTime}>
                                  <Clock size={12} color="var(--text-light)" />
                                  <span>{act.time}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <span style={publicStyles.actName}>{act.name}</span>
                                  <span className="badge badge-info" style={{ fontSize: '0.65rem', marginLeft: '8px', textTransform: 'capitalize' }}>
                                    {act.category}
                                  </span>
                                </div>
                                <span style={publicStyles.actDuration}>{act.duration}h</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar controls */}
          <div style={publicStyles.rightCol}>
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Love this Itinerary?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                You can copy this exact multi-city schedule, stops, and actions into your own account and customize it freely.
              </p>
              
              <button 
                onClick={handleCloneTrip} 
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={cloning}
              >
                <Copy size={16} />
                <span>{cloning ? "Copying itinerary..." : "Copy to My Account"}</span>
              </button>

              <div style={publicStyles.divider} />

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Share with friends</h4>
              
              <div style={publicStyles.shareButtonsRow}>
                <button onClick={handleCopyLink} className="btn btn-secondary btn-icon" title="Copy Link" style={{ flex: 1 }}>
                  {copiedLink ? <Check size={18} color="var(--success)" /> : <Share2 size={18} />}
                </button>
                <button onClick={() => showToast("Simulated Facebook sharing")} className="btn btn-secondary btn-icon" title="Share on Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1877f2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </button>
                <button onClick={() => showToast("Simulated Twitter sharing")} className="btn btn-secondary btn-icon" title="Share on Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1da1f2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </button>
                <button onClick={() => showToast("Simulated LinkedIn sharing")} className="btn btn-secondary btn-icon" title="Share on LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const publicStyles = {
  pageBg: {
    backgroundColor: 'var(--bg-main)',
    minHeight: '100vh',
    width: '100vw',
  },
  header: {
    height: '70px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 900,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px 60px',
    width: '100%',
  },
  banner: {
    height: '220px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-md)',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    color: 'var(--text-white)',
  },
  sharedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(20, 184, 166, 0.9)',
    color: 'var(--text-white)',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: '8px',
  },
  tripName: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--text-white)',
    margin: 0,
  },
  tripDates: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    marginTop: '4px',
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: '7fr 4fr',
    gap: 28,
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    gap: 20,
  },
  timelineMarker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40px',
  },
  markerCircle: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-sidebar)',
    color: 'var(--text-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  markerLine: {
    width: '3px',
    flex: 1,
    backgroundColor: 'var(--border)',
    margin: '4px 0',
  },
  timelineCard: {
    flex: 1,
    marginBottom: '20px',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
    marginBottom: '12px',
  },
  cardDates: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  actItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    gap: 12,
  },
  actTime: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    minWidth: '60px',
  },
  actName: {
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  actDuration: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '16px 0',
  },
  shareButtonsRow: {
    display: 'flex',
    gap: 10,
  }
};
