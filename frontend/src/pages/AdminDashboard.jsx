// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  TrendingUp, 
  BarChart, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  Search, 
  Info,
  UserCheck,
  Ban,
  Clock,
  PieChart as PieIcon
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Alex Globetrotter', email: 'alex@globetrotter.com', role: 'User', status: 'Active', tripsCount: 2 },
    { id: 'u2', name: 'Sarah Miller', email: 'sarah@miller.com', role: 'User', status: 'Active', tripsCount: 4 },
    { id: 'u3', name: 'Marcus Chen', email: 'marcus@chen.org', role: 'User', status: 'Suspended', tripsCount: 1 },
    { id: 'u4', name: 'Emma Watson', email: 'emma@watson.co.uk', role: 'Admin', status: 'Active', tripsCount: 0 }
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const adminStats = await mockDataService.getAdminStats();
        setStats(adminStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleUserStatus = (userId) => {
    const updated = usersList.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User account status set to ${newStatus}.`);
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsersList(updated);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '60px', width: '200px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  const { 
    totalUsers, 
    totalTripsCreated, 
    activeTripsCount, 
    completedTripsCount, 
    popularDestinations, 
    recentActivity, 
    userGrowth, 
    tripCategoryBreakdown 
  } = stats;

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // SVG parameters for Line Chart (Growth)
  const lineW = 360;
  const lineH = 160;
  const linePadding = 24;
  const maxGrowth = Math.max(...userGrowth.map(u => u.count), 1);
  const linePoints = userGrowth.map((pt, idx) => {
    const x = linePadding + (idx * (lineW - (2 * linePadding)) / (userGrowth.length - 1));
    const y = lineH - linePadding - (pt.count * (lineH - (2 * linePadding)) / maxGrowth);
    return { x, y, ...pt };
  });
  const linePathD = linePoints.reduce((path, pt, idx) => {
    return path + `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y} `;
  }, '');

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={adminStyles.headerRow}>
        <div>
          <h2 style={adminStyles.pageTitle}>GlobeTrotter Control Center</h2>
          <p style={adminStyles.pageSubtitle}>Monitor registration spikes, trip building growth, and manage active platform accounts.</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px', gap: '20px' }}>
        <div className="card" style={adminStyles.kpiCard}>
          <div style={adminStyles.kpiHeader}>
            <Users size={16} color="var(--primary)" />
            <span style={adminStyles.kpiLabel}>Total Users</span>
          </div>
          <h3 style={adminStyles.kpiValue}>{totalUsers}</h3>
          <span style={adminStyles.kpiSub}>Active global profiles</span>
        </div>

        <div className="card" style={adminStyles.kpiCard}>
          <div style={adminStyles.kpiHeader}>
            <TrendingUp size={16} color="var(--secondary)" />
            <span style={adminStyles.kpiLabel}>Trips Generated</span>
          </div>
          <h3 style={adminStyles.kpiValue}>{totalTripsCreated}</h3>
          <span style={adminStyles.kpiSub}>Saved in local database</span>
        </div>

        <div className="card" style={adminStyles.kpiCard}>
          <div style={adminStyles.kpiHeader}>
            <Globe size={16} color="var(--success)" />
            <span style={adminStyles.kpiLabel}>Active Plans</span>
          </div>
          <h3 style={adminStyles.kpiValue}>{activeTripsCount}</h3>
          <span style={adminStyles.kpiSub}>Ongoing / Upcoming guides</span>
        </div>

        <div className="card" style={adminStyles.kpiCard}>
          <div style={adminStyles.kpiHeader}>
            <ShieldAlert size={16} color="var(--info)" />
            <span style={adminStyles.kpiLabel}>Completed Guides</span>
          </div>
          <h3 style={{ ...adminStyles.kpiValue, color: 'var(--success)' }}>{completedTripsCount}</h3>
          <span style={adminStyles.kpiSub}>Historical trip records</span>
        </div>
      </div>

      {/* Charts Panel */}
      <div className="grid-cols-3" style={{ gap: '20px', marginBottom: '24px' }}>
        {/* 1. Line Chart: User Registrations */}
        <div className="card" style={adminStyles.chartCard}>
          <h4 style={adminStyles.cardTitle}>User Registrations Growth</h4>
          <div style={adminStyles.chartWrapper}>
            <svg width="100%" height={lineH} viewBox={`0 0 ${lineW} ${lineH}`} style={{ overflow: 'visible' }}>
              <line x1={linePadding} y1={linePadding} x2={lineW - linePadding} y2={linePadding} stroke="var(--border)" strokeDasharray="3 3" />
              <line x1={linePadding} y1={lineH / 2} x2={lineW - linePadding} y2={lineH / 2} stroke="var(--border)" strokeDasharray="3 3" />
              <line x1={linePadding} y1={lineH - linePadding} x2={lineW - linePadding} y2={lineH - linePadding} stroke="var(--border)" />

              <path d={linePathD} fill="none" stroke="var(--primary)" strokeWidth="3" />

              {linePoints.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2" />
                  <text x={pt.x} y={lineH - 4} textAnchor="middle" style={{ fontSize: '8px', fill: 'var(--text-light)', fontWeight: 600 }}>
                    {pt.month}
                  </text>
                  <text x={pt.x} y={pt.y - 8} textAnchor="middle" style={{ fontSize: '8px', fill: 'var(--text-main)', fontWeight: 700 }}>
                    {pt.count}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 2. Bar Chart: Destination Popularity */}
        <div className="card" style={adminStyles.chartCard}>
          <h4 style={adminStyles.cardTitle}>Popular Planned Destinations</h4>
          <div style={adminStyles.barList}>
            {popularDestinations.map(city => {
              const maxCount = Math.max(...popularDestinations.map(c => c.count), 1);
              const fillPercent = (city.count / maxCount) * 100;
              return (
                <div key={city.name} style={adminStyles.barRow}>
                  <span style={adminStyles.barName}>{city.name}</span>
                  <div style={adminStyles.barTrack}>
                    <div style={{ ...adminStyles.barFill, width: `${fillPercent}%` }} />
                  </div>
                  <strong style={adminStyles.barVal}>{city.count} stops</strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Pie Chart: Trip Categories */}
        <div className="card" style={adminStyles.chartCard}>
          <h4 style={adminStyles.cardTitle}>Trip Category Distribution</h4>
          <div style={adminStyles.pieContainer}>
            {/* SVG Pie Chart */}
            <svg width="120" height="120" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
              {/* Adventure Slice: 35% -> stroke-dasharray="35 100" */}
              <circle r="16" cx="16" cy="16" fill="transparent" stroke="var(--secondary)" strokeWidth="32" strokeDasharray="35 100" />
              {/* Leisure Slice: 45% -> stroke-dasharray="45 100" stroke-dashoffset="-35" */}
              <circle r="16" cx="16" cy="16" fill="transparent" stroke="var(--primary)" strokeWidth="32" strokeDasharray="45 100" strokeDashoffset="-35" />
              {/* Spiritual Slice: 20% -> stroke-dasharray="20 100" stroke-dashoffset="-80" */}
              <circle r="16" cx="16" cy="16" fill="transparent" stroke="var(--warning)" strokeWidth="32" strokeDasharray="20 100" strokeDashoffset="-80" />
              {/* Inner Circle for Donut effect */}
              <circle r="10" cx="16" cy="16" fill="var(--bg-card)" />
            </svg>

            {/* Legend */}
            <div style={adminStyles.pieLegend}>
              {tripCategoryBreakdown.map(cat => (
                <div key={cat.name} style={adminStyles.legendItem}>
                  <div style={{ ...adminStyles.legendColor, backgroundColor: cat.name === 'Adventure' ? 'var(--secondary)' : cat.name === 'Leisure' ? 'var(--primary)' : 'var(--warning)' }} />
                  <span>{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout: User Management & Recent Log */}
      <div className="grid-cols-3" style={{ gap: '20px' }}>
        {/* User Management (Takes 2 columns) */}
        <div className="card" style={{ gridColumn: 'span 2', padding: '20px' }}>
          <div style={adminStyles.userHeaderRow}>
            <h3 style={{ margin: 0 }}>System User Control</h3>
            <div style={adminStyles.userSearchWrap}>
              <Search size={14} style={styles.searchIcon} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '32px', height: '32px', fontSize: '0.8rem' }}
                placeholder="Search profiles..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={adminStyles.tableContainer}>
            <table style={adminStyles.table}>
              <thead>
                <tr style={adminStyles.trHeader}>
                  <th style={adminStyles.th}>Name</th>
                  <th style={adminStyles.th}>Email</th>
                  <th style={adminStyles.th}>Role</th>
                  <th style={adminStyles.th}>Status</th>
                  <th style={adminStyles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={adminStyles.trRow}>
                    <td style={{ ...adminStyles.td, fontWeight: 600 }}>{user.name}</td>
                    <td style={adminStyles.td}>{user.email}</td>
                    <td style={adminStyles.td}>{user.role}</td>
                    <td style={adminStyles.td}>
                      <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.75rem' }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={adminStyles.td}>
                      {user.role !== 'Admin' && (
                        <button 
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`btn ${user.status === 'Active' ? 'btn-danger' : 'btn-primary'} btn-sm`}
                          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                        >
                          {user.status === 'Active' ? <Ban size={10} /> : <UserCheck size={10} />}
                          <span>{user.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity Logs (Takes 1 column) */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            Live System Activity
          </h3>
          <div style={adminStyles.logList}>
            {recentActivity.map(act => (
              <div key={act.id} style={adminStyles.logItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <strong>{act.user}</strong>
                  <span style={{ color: 'var(--text-light)' }}>{act.time}</span>
                </div>
                <p style={adminStyles.logText}>{act.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const adminStyles = {
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
  kpiCard: {
    padding: '16px 20px',
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: '6px',
  },
  kpiLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    margin: 0,
  },
  kpiSub: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginTop: '2px',
    display: 'block',
  },
  chartCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px',
    margin: '0 0 16px',
  },
  chartWrapper: {
    width: '100%',
    padding: '10px 0',
  },
  barList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  barName: {
    width: '70px',
    fontSize: '0.8rem',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    flex: 1,
    height: '10px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    borderRadius: 'var(--radius-full)',
  },
  barVal: {
    width: '50px',
    fontSize: '0.75rem',
    textAlign: 'right',
  },
  pieContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  pieLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  legendColor: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  userHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    marginBottom: '12px',
  },
  userSearchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  trHeader: {
    borderBottom: '2px solid var(--border)',
  },
  th: {
    padding: '8px 12px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
  },
  trRow: {
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '10px 12px',
    fontSize: '0.8rem',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  logItem: {
    padding: '10px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  logText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '3px',
    lineHeight: 1.3,
  }
};

const styles = {
  searchIcon: {
    position: 'absolute',
    left: '10px',
    color: 'var(--text-light)',
  }
};
