// CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Info } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';

export default function CalendarView() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date("2026-08-22")); // Center around August 2026 to match seed dates
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await mockDataService.getTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Helper to format date string to check against trip ranges
  const makeDateStr = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Get all trips active on a specific date
  const getTripsForDate = (dateStr) => {
    const checkDate = new Date(dateStr + "T00:00:00");
    return trips.filter(t => {
      const start = new Date(t.startDate + "T00:00:00");
      const end = new Date(t.endDate + "T00:00:00");
      return checkDate >= start && checkDate <= end;
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '450px' }} />
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Generate calendar grid array
  const cells = [];
  // Fill leading empty cells
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, dateStr: null });
  }
  // Fill day cells
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: makeDateStr(year, month, d) });
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Trip Calendar View</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Inspect scheduled stops and vacation time blocks mapped across dates. Click on any event card to view the itinerary.
          </p>
        </div>
      </div>

      <div className="card" style={styles.calendarCard}>
        {/* Calendar Nav */}
        <div style={styles.calendarHeader}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarIcon size={20} color="var(--primary)" />
            <span>{monthName} {year}</span>
          </h3>
          <div style={styles.navBtns}>
            <button onClick={prevMonth} style={styles.iconBtn}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} style={styles.iconBtn}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div style={styles.daysHeaderGrid}>
          {daysOfWeek.map(d => (
            <div key={d} style={styles.dayOfWeekCell}>{d}</div>
          ))}
        </div>

        {/* Calendar cells grid */}
        <div style={styles.cellsGrid}>
          {cells.map((cell, idx) => {
            const isToday = cell.dateStr === "2026-08-22"; // mock focus date
            const dayTrips = cell.dateStr ? getTripsForDate(cell.dateStr) : [];
            
            return (
              <div 
                key={idx} 
                style={{
                  ...styles.calendarCell,
                  backgroundColor: cell.day ? 'var(--bg-card)' : 'transparent',
                  borderColor: isToday ? 'var(--primary-light)' : 'var(--border)',
                  borderWidth: isToday ? '2px' : '1px'
                }}
              >
                {cell.day && (
                  <div style={styles.cellHeader}>
                    <span 
                      style={{
                        ...styles.cellDayNum,
                        backgroundColor: isToday ? 'var(--primary)' : 'transparent',
                        color: isToday ? 'var(--text-white)' : 'var(--text-main)',
                      }}
                    >
                      {cell.day}
                    </span>
                    {isToday && <span style={styles.todayLabel}>Today</span>}
                  </div>
                )}
                
                <div style={styles.cellBody}>
                  {dayTrips.map(trip => (
                    <div 
                      key={trip.id} 
                      onClick={() => navigate(`/itinerary/view/${trip.id}`)}
                      style={styles.tripEventBadge}
                      title={`${trip.name}: ${trip.startDate} to ${trip.endDate}`}
                    >
                      <span style={styles.tripBadgeText}>{trip.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  calendarCard: {
    padding: '24px',
    boxShadow: 'var(--shadow-premium)',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  navBtns: {
    display: 'flex',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  dayOfWeekCell: {
    padding: '4px 0',
  },
  cellsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridAutoRows: '100px',
    gap: '6px',
    backgroundColor: 'var(--bg-main)',
    padding: '6px',
    borderRadius: 'var(--radius-md)',
  },
  calendarCell: {
    borderStyle: 'solid',
    borderRadius: 'var(--radius-sm)',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cellHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  cellDayNum: {
    width: '22px',
    height: '22px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  todayLabel: {
    fontSize: '0.65rem',
    color: 'var(--primary-light)',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  cellBody: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    scrollbarWidth: 'none',
  },
  tripEventBadge: {
    backgroundColor: 'var(--primary)',
    color: 'var(--text-white)',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '3px 6px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderLeft: '3px solid var(--primary-light)',
    transition: 'opacity var(--transition-fast)',
    ':hover': {
      opacity: 0.85,
    }
  },
  tripBadgeText: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }
};
