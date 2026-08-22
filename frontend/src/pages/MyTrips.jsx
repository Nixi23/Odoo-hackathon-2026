// MyTrips.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Copy, 
  Search, 
  Globe, 
  Lock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTripId, setDeleteTripId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const allTrips = await mockDataService.getTrips();
      setTrips(allTrips);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTripId) return;
    try {
      await mockDataService.deleteTrip(deleteTripId);
      setTrips(trips.filter(t => t.id !== deleteTripId));
      showToast("Trip deleted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTripId(null);
    }
  };

  const handleClone = async (id) => {
    try {
      await mockDataService.cloneTrip(id);
      showToast("Itinerary duplicated successfully!");
      loadTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getDaysCount = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e - s);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  // Filter local lists
  const filteredTrips = trips.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group Trips by date range (Ongoing, Upcoming, Completed) relative to today (2026-08-22)
  const today = new Date("2026-08-22T00:00:00");
  
  const ongoingTrips = filteredTrips.filter(t => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    return start <= today && end >= today;
  });

  const upcomingTrips = filteredTrips.filter(t => {
    const start = new Date(t.startDate);
    return start > today;
  });

  const completedTrips = filteredTrips.filter(t => {
    const end = new Date(t.endDate);
    return end < today;
  });

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div style={tripStyles.headerRow}>
          <div className="skeleton" style={{ height: '40px', width: '200px' }} />
          <div className="skeleton" style={{ height: '40px', width: '120px' }} />
        </div>
        <div className="skeleton" style={{ height: '50px', width: '100%', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '300px' }} />
      </div>
    );
  }

  const renderTripRow = (trip) => {
    const days = getDaysCount(trip.startDate, trip.endDate);
    return (
      <div key={trip.id} className="card card-hover" style={tripStyles.tripListItem}>
        <img src={trip.coverPhoto} alt={trip.name} style={tripStyles.tripCover} />
        <div style={tripStyles.tripInfo}>
          <div style={tripStyles.tripTitleRow}>
            <h4 style={tripStyles.tripName}>{trip.name}</h4>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className={`badge ${trip.isPublic ? 'badge-success' : 'badge-info'}`}>
                {trip.isPublic ? 'Public' : 'Private'}
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}>
                {days} Days
              </span>
            </div>
          </div>
          <p style={tripStyles.tripDates}>
            <Calendar size={12} />
            <span>{trip.startDate} to {trip.endDate}</span>
          </p>
          <p style={tripStyles.tripDesc}>{trip.description || "No description provided."}</p>
          <div style={tripStyles.tripDetailsRow}>
            <span style={tripStyles.tripMetaItem}>
              <MapPin size={12} />
              <strong>{trip.stops.length} Sections / Stops</strong>
            </span>
            <span style={tripStyles.tripMetaItem}>
              <DollarSign size={12} />
              <span>Budget Limit: <strong>{currencyService.format(trip.budgetLimit, "India")}</strong></span>
            </span>
          </div>
        </div>
        <div style={tripStyles.tripActionCol}>
          <button 
            onClick={() => navigate(`/itinerary/view/${trip.id}`)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            <Eye size={14} />
            <span>View Itinerary</span>
          </button>
          <div style={{ display: 'flex', gap: 6, width: '100%' }}>
            <button 
              onClick={() => navigate(`/trips/edit/${trip.id}`)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              title="Edit details"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={() => handleClone(trip.id)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              title="Clone / Duplicate"
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={() => setDeleteTripId(trip.id)}
              className="btn btn-danger btn-sm"
              style={{ flex: 1 }}
              title="Delete plan"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={tripStyles.headerRow}>
        <div>
          <h2 style={tripStyles.pageTitle}>My Travel Dashboard</h2>
          <p style={tripStyles.pageSubtitle}>Track ongoing, upcoming and historical multi-city travel guides.</p>
        </div>
        <Link to="/trips/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Create / Plan Trip</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="card" style={tripStyles.filterCard}>
        <div style={tripStyles.searchWrapper}>
          <Search size={18} style={tripStyles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search planned trips by title or keywords..." 
            className="form-input" 
            style={{ paddingLeft: '40px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={tripStyles.tripsDashboard}>
        {/* 1. Ongoing Trips */}
        <div style={tripStyles.sectionArea}>
          <h3 style={tripStyles.sectionHeading}>Ongoing Journeys</h3>
          {ongoingTrips.length === 0 ? (
            <p style={tripStyles.emptyText}>No journeys ongoing today.</p>
          ) : (
            <div style={tripStyles.listLayout}>{ongoingTrips.map(renderTripRow)}</div>
          )}
        </div>

        {/* 2. Upcoming Trips */}
        <div style={tripStyles.sectionArea}>
          <h3 style={tripStyles.sectionHeading}>Upcoming Adventures</h3>
          {upcomingTrips.length === 0 ? (
            <p style={tripStyles.emptyText}>No upcoming vacations planned yet.</p>
          ) : (
            <div style={tripStyles.listLayout}>{upcomingTrips.map(renderTripRow)}</div>
          )}
        </div>

        {/* 3. Completed Trips */}
        <div style={tripStyles.sectionArea}>
          <h3 style={tripStyles.sectionHeading}>Completed Expeditions</h3>
          {completedTrips.length === 0 ? (
            <p style={tripStyles.emptyText}>No historical itineraries found.</p>
          ) : (
            <div style={tripStyles.listLayout}>{completedTrips.map(renderTripRow)}</div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTripId && (
        <div style={tripStyles.modalOverlay}>
          <div className="card" style={tripStyles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '12px' }}>
              <AlertTriangle size={24} color="var(--error)" />
              <h3 style={{ margin: 0 }}>Delete Travel Plan?</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to permanently delete this itinerary? This action is irreversible and will cascade to all scheduled stop activities.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setDeleteTripId(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={handleDelete}
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tripStyles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
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
  filterCard: {
    padding: '16px',
    marginBottom: '28px',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-light)',
  },
  tripsDashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  sectionArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeading: {
    fontSize: '1.15rem',
    fontWeight: 700,
    borderBottom: '2px solid var(--border)',
    paddingBottom: '6px',
    color: 'var(--text-main)',
  },
  emptyText: {
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    fontStyle: 'italic',
    padding: '12px 20px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  listLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tripListItem: {
    display: 'flex',
    gap: '20px',
    padding: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tripCover: {
    width: '120px',
    height: '100px',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
  },
  tripInfo: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  tripTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tripName: {
    fontSize: '1.05rem',
    fontWeight: 700,
  },
  tripDates: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  tripDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    margin: '4px 0',
  },
  tripDetailsRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.8rem',
    color: 'var(--text-light)',
    marginTop: '2px',
  },
  tripMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  tripActionCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '160px',
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
    maxWidth: '440px',
    padding: '24px',
  }
};
