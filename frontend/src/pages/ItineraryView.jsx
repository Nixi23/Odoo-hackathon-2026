// ItineraryView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Share2, 
  List, 
  Calendar as CalendarIcon, 
  Edit3, 
  ArrowLeft, 
  TrendingUp, 
  Globe, 
  Lock, 
  Copy, 
  Check, 
  Info,
  Map
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [isPublic, setIsPublic] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const tripData = await mockDataService.getTripById(tripId);
        if (!tripData) {
          navigate('/trips');
          return;
        }
        setTrip(tripData);
        setIsPublic(tripData.isPublic || false);
        
        const allCities = await mockDataService.getCities();
        setCities(allCities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripId, navigate]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleShareToggle = async () => {
    try {
      const updated = { ...trip, isPublic: !isPublic };
      await mockDataService.saveTrip(updated);
      setIsPublic(!isPublic);
      showToast(!isPublic ? "Trip is now public!" : "Trip is now private.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/share/${trip.id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    showToast("Shareable link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate day list from trip start & end dates
  const generateDaysList = () => {
    if (!trip) return [];
    const days = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diff = Math.abs(end - start);
    const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      
      const activeStops = trip.stops.filter(s => {
        const arrival = new Date(s.arrivalDate);
        const departure = new Date(s.departureDate);
        return d >= arrival && d <= departure;
      });

      const dayActivities = [];
      activeStops.forEach(stop => {
        const matchingActs = stop.activities.filter(a => a.date === dateStr);
        matchingActs.forEach(act => {
          dayActivities.push({
            ...act,
            stopId: stop.id,
            cityId: stop.cityId
          });
        });
      });

      dayActivities.sort((a, b) => a.time.localeCompare(b.time));

      days.push({
        dayNumber: i + 1,
        date: dateStr,
        formattedDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        stops: activeStops,
        activities: dayActivities
      });
    }
    return days;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="skeleton" style={{ height: '60px', width: '200px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  const daysList = generateDaysList();
  const totalDays = daysList.length;

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
      <div style={viewStyles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/trips')} className="btn btn-secondary btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={viewStyles.pageTitle}>{trip.name}</h2>
            <p style={viewStyles.pageSubtitle}>
              {trip.startDate} to {trip.endDate} • {totalDays} Days • {trip.stops.length} Sections
            </p>
          </div>
        </div>

        <div style={viewStyles.headerActionGroup}>
          <Link to={`/budget/${trip.id}`} className="btn btn-secondary" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
            <TrendingUp size={16} />
            <span>Budget Analysis</span>
          </Link>
          <Link to={`/itinerary/build/${trip.id}`} className="btn btn-secondary">
            <Edit3 size={16} />
            <span>Modify Plan</span>
          </Link>
        </div>
      </div>

      {/* Main Cover Banner */}
      <div style={{ ...viewStyles.coverBanner, backgroundImage: `url(${trip.coverPhoto})` }}>
        <div style={viewStyles.coverOverlay}>
          <h1 style={viewStyles.coverTitle}>{trip.name}</h1>
          <p style={viewStyles.coverDesc}>{trip.description || "No description provided."}</p>
        </div>
      </div>

      {/* Controls & Sharing */}
      <div className="card" style={viewStyles.controlCard}>
        {/* Toggle Mode */}
        <div style={viewStyles.toggleContainer}>
          <button 
            onClick={() => setViewMode('list')}
            style={{
              ...viewStyles.toggleBtn,
              backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'list' ? 'var(--text-white)' : 'var(--text-muted)'
            }}
          >
            <List size={16} />
            <span>List Timeline</span>
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            style={{
              ...viewStyles.toggleBtn,
              backgroundColor: viewMode === 'calendar' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'calendar' ? 'var(--text-white)' : 'var(--text-muted)'
            }}
          >
            <CalendarIcon size={16} />
            <span>Calendar View</span>
          </button>
        </div>

        {/* Sharing */}
        <div style={viewStyles.shareControls}>
          <button 
            onClick={handleShareToggle}
            className="btn btn-secondary btn-sm"
            style={{ 
              backgroundColor: isPublic ? 'var(--success-bg)' : 'transparent',
              borderColor: isPublic ? 'var(--success)' : 'var(--border)',
              color: isPublic ? 'var(--success)' : 'var(--text-muted)'
            }}
          >
            {isPublic ? <Globe size={14} /> : <Lock size={14} />}
            <span>{isPublic ? "Shared Publicly" : "Make Public"}</span>
          </button>

          {isPublic && (
            <button onClick={handleCopyLink} className="btn btn-primary btn-sm">
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? "Link Copied" : "Copy Shared URL"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'list' ? (
        <div style={viewStyles.timelineContainer}>
          {daysList.map((day, idx) => (
            <div key={day.date} style={viewStyles.dayTimelineItem}>
              {/* Day Marker */}
              <div style={viewStyles.timelineMarker}>
                <div style={viewStyles.markerCircle}>Day {day.dayNumber}</div>
                {idx < daysList.length - 1 && <div style={viewStyles.markerLine} />}
              </div>

              {/* Card */}
              <div className="card" style={viewStyles.dayCard}>
                <div style={viewStyles.dayHeaderRow}>
                  <div>
                    <h3 style={viewStyles.dayTitle}>{day.formattedDate}</h3>
                    {day.stops.length > 0 && (
                      <div style={viewStyles.dayStopsRow}>
                        <MapPin size={12} color="var(--primary)" />
                        <span>
                          Currently in:{' '}
                          <strong>
                            {day.stops.map(s => {
                              const city = cities.find(c => c.id === s.cityId);
                              return city ? `${city.name} (${city.country})` : 'Destination';
                            }).join(', ')}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>
                  <span style={viewStyles.activityCountBadge}>
                    {day.activities.length} scheduled
                  </span>
                </div>

                {/* Section stop cost details if first day of a stop */}
                {day.stops.map(stop => {
                  const isFirstDay = stop.arrivalDate === day.date;
                  if (!isFirstDay) return null;
                  const city = cities.find(c => c.id === stop.cityId);
                  if (!city) return null;

                  return (
                    <div key={stop.id} style={viewStyles.stopCostsBox}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        SECTION START EXPENSES ({city.name}):
                      </span>
                      <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={viewStyles.costMetaLabel}>
                          Accommodation: <strong>{currencyService.format(stop.accommodationCost, city.country)}</strong>/night
                        </span>
                        <span style={viewStyles.costMetaLabel}>
                          Transport here: <strong>{currencyService.format(stop.transportCost, city.country)}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Day Activities List */}
                {day.activities.length === 0 ? (
                  <p style={viewStyles.noActivitiesText}>Leisure Day. Relax, shop, or explore the city at your own pace!</p>
                ) : (
                  <div style={viewStyles.dayActivitiesList}>
                    {day.activities.map(act => {
                      const city = cities.find(c => c.id === act.cityId);
                      const displayCost = city ? currencyService.format(act.cost, city.country) : `₹${act.cost}`;
                      
                      return (
                        <div key={act.id} style={viewStyles.activityListItem}>
                          <div style={viewStyles.activityTimeCell}>
                            <Clock size={14} color="var(--text-light)" />
                            <span>{act.time}</span>
                          </div>
                          <div style={viewStyles.activityDetailsCell}>
                            <h4 style={viewStyles.activityName}>{act.name}</h4>
                            <span className="badge badge-info" style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
                              {act.category}
                            </span>
                          </div>
                          <div style={viewStyles.activityMetaCell}>
                            <span style={viewStyles.activityDuration}>
                              Duration: {act.duration}h
                            </span>
                            <span style={viewStyles.activityCost}>
                              {displayCost}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid Calendar View Mode */
        <div className="card" style={viewStyles.calendarCard}>
          <div style={viewStyles.calendarGrid}>
            {daysList.map(day => {
              const activeStop = day.stops[0];
              const city = activeStop ? cities.find(c => c.id === activeStop.cityId) : null;
              
              return (
                <div key={day.date} style={viewStyles.calendarCell}>
                  <div style={viewStyles.calendarCellHeader}>
                    <strong style={viewStyles.calendarCellDay}>Day {day.dayNumber}</strong>
                    <span style={viewStyles.calendarCellDate}>{day.date.split('-')[2]}</span>
                  </div>
                  <div style={viewStyles.calendarCellBody}>
                    {city && (
                      <div style={viewStyles.calendarStopBadge}>
                        <MapPin size={10} />
                        <span>{city.name}</span>
                      </div>
                    )}
                    {day.activities.map(act => (
                      <div key={act.id} style={viewStyles.calendarActItem} title={`${act.time} - ${act.name}`}>
                        <strong>{act.time}</strong> {act.name}
                      </div>
                    ))}
                    {day.activities.length === 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic', textAlign: 'center', marginTop: '10px' }}>Leisure Day</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const viewStyles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: 16
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
  headerActionGroup: {
    display: 'flex',
    gap: 12,
  },
  coverBanner: {
    height: '240px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-md)',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px',
    color: 'var(--text-white)',
  },
  coverTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--text-white)',
    marginBottom: '6px',
  },
  coverDesc: {
    fontSize: '0.9rem',
    color: '#e2e8f0',
    maxWidth: '700px',
    lineHeight: 1.4,
  },
  controlCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 18px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: 16,
  },
  toggleContainer: {
    display: 'flex',
    backgroundColor: 'var(--bg-main)',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
    gap: 4
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    border: 'none',
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    backgroundColor: 'transparent',
  },
  shareControls: {
    display: 'flex',
    gap: 10,
  },
  timelineContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingLeft: '12px',
  },
  dayTimelineItem: {
    display: 'flex',
    gap: '24px',
  },
  timelineMarker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  markerCircle: {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--primary)',
    color: 'var(--text-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.8rem',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'center',
    padding: '6px',
  },
  markerLine: {
    flex: 1,
    width: '2px',
    backgroundColor: 'var(--border)',
    marginTop: '8px',
  },
  dayCard: {
    flex: 1,
    padding: '20px',
  },
  dayHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  dayTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
  },
  dayStopsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  activityCountBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
    color: 'var(--primary-light)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
  },
  stopCostsBox: {
    backgroundColor: 'var(--bg-main)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '16px',
  },
  costMetaLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  noActivitiesText: {
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    fontStyle: 'italic',
  },
  dayActivitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  activityListItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-md)',
    gap: 16,
  },
  activityTimeCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    minWidth: '70px',
  },
  activityDetailsCell: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  activityName: {
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  activityMetaCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  activityDuration: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
  },
  activityCost: {
    fontWeight: 700,
    color: 'var(--primary)',
    fontSize: '0.9rem',
  },
  calendarCard: {
    padding: '20px',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  calendarCell: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    backgroundColor: 'var(--bg-main)',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
  },
  calendarCellHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '6px',
    marginBottom: '8px',
  },
  calendarCellDay: {
    fontSize: '0.85rem',
    color: 'var(--primary)',
  },
  calendarCellDate: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
  },
  calendarCellBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  calendarStopBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm)',
    alignSelf: 'flex-start',
  },
  calendarActItem: {
    fontSize: '0.75rem',
    backgroundColor: 'var(--bg-card)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    borderLeft: '2px solid var(--secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
};
