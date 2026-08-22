// PreplannedTrips.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Info, Calendar, MapPin } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function PreplannedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await mockDataService.getPreplannedTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleClone = async (id) => {
    try {
      const cloned = await mockDataService.clonePreplannedTrip(id);
      showToast("Trip cloned to your active travel dashboard!");
      setTimeout(() => navigate(`/itinerary/view/${cloned.id}`), 1000);
    } catch (err) {
      showToast("Error cloning package.");
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '24px' }} />
        <div className="grid-cols-3">
          <div className="skeleton" style={{ height: '240px' }} />
          <div className="skeleton" style={{ height: '240px' }} />
          <div className="skeleton" style={{ height: '240px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </button>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Preplanned Trip Packages</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Select and clone custom pre-designed travel route templates curated by our expert guides.
        </p>
      </div>

      <div className="grid-cols-3" style={{ gap: '24px' }}>
        {trips.map(trip => (
          <div key={trip.id} className="card card-hover" style={styles.card}>
            <img src={trip.coverPhoto} alt={trip.name} style={styles.coverImg} />
            <div style={styles.body}>
              <h4 style={styles.title}>{trip.name}</h4>
              <div style={styles.metaRow}>
                <span style={styles.metaItem}>
                  <Calendar size={12} />
                  <span>{trip.durationDays} Days</span>
                </span>
                <span style={styles.metaItem}>
                  <MapPin size={12} />
                  <span>{trip.stopsCount} Stops</span>
                </span>
              </div>
              <p style={styles.desc}>{trip.description}</p>
              <div style={styles.footer}>
                <span style={styles.cost}>{currencyService.format(trip.budget, "India")}</span>
                <button 
                  onClick={() => handleClone(trip.id)}
                  className="btn btn-primary btn-sm"
                >
                  Clone Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: 700,
    margin: 0,
  },
  metaRow: {
    display: 'flex',
    gap: 16,
    fontSize: '0.8rem',
    color: 'var(--text-light)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  desc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    flex: 1,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
  },
  cost: {
    fontWeight: 800,
    color: 'var(--primary-hover)',
    fontSize: '0.95rem',
  }
};
