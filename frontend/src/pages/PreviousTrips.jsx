// PreviousTrips.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Award } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function PreviousTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await mockDataService.getPreviousTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDaysCount = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e - s);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '24px' }} />
        <div className="grid-cols-3">
          <div className="skeleton" style={{ height: '240px' }} />
          <div className="skeleton" style={{ height: '240px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </button>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Completed Travel Diaries</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Browse your past travel records, reviews, and expense details.
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="card flex-center" style={{ padding: '60px 20px', textAlign: 'center', flexDirection: 'column' }}>
          <Award size={36} color="var(--text-light)" style={{ marginBottom: '12px' }} />
          <h4>No Completed Trips Found</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trips with end dates in the past will show up here.</p>
        </div>
      ) : (
        <div className="grid-cols-3" style={{ gap: '24px' }}>
          {trips.map(trip => {
            const days = getDaysCount(trip.startDate, trip.endDate);
            return (
              <div key={trip.id} className="card card-hover" style={styles.card}>
                <img src={trip.coverPhoto} alt={trip.name} style={styles.coverImg} />
                <div style={styles.body}>
                  <h4 style={styles.title}>{trip.name}</h4>
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}>
                      <Calendar size={12} />
                      <span>{trip.startDate} to {trip.endDate} ({days} days)</span>
                    </span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}>
                      <MapPin size={12} />
                      <span>{trip.stops.length} Stops</span>
                    </span>
                  </div>
                  <div style={styles.footer}>
                    <span style={styles.cost}>{currencyService.format(trip.budgetLimit, "India")}</span>
                    <button 
                      onClick={() => navigate(`/itinerary/view/${trip.id}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      View Itinerary
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
