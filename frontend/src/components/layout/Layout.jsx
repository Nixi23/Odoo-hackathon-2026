// Layout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  Briefcase, 
  BarChart, 
  ChevronDown,
  Calendar,
  Users
} from 'lucide-react';
import { mockDataService } from '../../services/mockDataService';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to GlobeTrotter! Start planning your next trip.", time: "Just now", read: false },
    { id: 2, text: "Budget Alert: 'Summer Dream Holiday' is 8% over limit on Day 3.", time: "2 hours ago", read: false },
    { id: 3, text: "Trending: Flight deals to Tokyo, Japan are 15% off today.", time: "1 day ago", read: true }
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    mockDataService.getCurrentUser().then(user => {
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(user);
      }
    });
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await mockDataService.logout();
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfile = () => setProfileDropdownOpen(!profileDropdownOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/trips') return 'My Trips';
    if (path.startsWith('/trips/create')) return 'Create Trip';
    if (path.startsWith('/trips/edit')) return 'Edit Trip';
    if (path.startsWith('/itinerary/build')) return 'Itinerary Builder';
    if (path.startsWith('/itinerary/view')) return 'Trip Itinerary';
    if (path === '/cities') return 'Explore Cities';
    if (path.startsWith('/activities')) return 'Browse Activities';
    if (path.startsWith('/budget')) return 'Trip Budget';
    if (path === '/profile') return 'Profile Settings';
    if (path === '/admin') return 'Admin Dashboard';
    if (path === '/community') return 'Community Feed';
    if (path === '/calendar') return 'Trip Calendar';
    if (path === '/preplanned') return 'Preplanned Trips';
    if (path === '/previous') return 'Completed Trips';
    return 'GlobeTrotter';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Compass },
    { name: 'My Trips', path: '/trips', icon: Briefcase },
    { name: 'Explore Cities', path: '/cities', icon: Search },
    { name: 'Trip Calendar', path: '/calendar', icon: Calendar },
    { name: 'Community Tab', path: '/community', icon: Users },
    { name: 'Profile Settings', path: '/profile', icon: Settings },
    { name: 'Admin Analytics', path: '/admin', icon: BarChart },
  ];

  if (!currentUser) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <div className="skeleton" style={{ width: '100%', height: '100vh' }}></div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="layout-container">
      {/* Sidebar - Desktop & Drawer Mobile */}
      <aside className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={layoutStyles.logoContainer}>
            <Map size={26} color="var(--primary-light)" />
            <span style={layoutStyles.logoText}>GlobeTrotter</span>
          </div>
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav style={layoutStyles.navMenu}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={() => setSidebarOpen(false)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? 'var(--primary-light)' : 'var(--text-light)',
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card inside Sidebar */}
        <div style={layoutStyles.sidebarUserCard}>
          <img 
            src={currentUser.photo} 
            alt={currentUser.name} 
            style={layoutStyles.userAvatar} 
          />
          <div style={layoutStyles.userInfo}>
            <span style={layoutStyles.userName}>{currentUser.name}</span>
            <span style={layoutStyles.userEmail}>{currentUser.email}</span>
          </div>
          <button 
            style={layoutStyles.logoutBtn} 
            onClick={handleLogout} 
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="sidebar-backdrop"
        />
      )}

      {/* Main Body Wrap */}
      <div className="main-content-wrapper">
        {/* Top Navbar */}
        <header className="header-container">
          <div style={layoutStyles.headerLeft}>
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 style={layoutStyles.headerTitle}>{getPageTitle()}</h1>
          </div>

          <div style={layoutStyles.headerRight}>
            {/* Notification Menu */}
            <div style={layoutStyles.popoverWrapper}>
              <button style={layoutStyles.headerIconButton} onClick={toggleNotifications}>
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span style={layoutStyles.notificationBadge}>{unreadNotifications}</span>
                )}
              </button>
              
              {notificationsOpen && (
                <div style={layoutStyles.notificationsDropdown} className="card">
                  <div style={layoutStyles.dropdownHeader}>
                    <h4>Notifications</h4>
                    <button 
                      style={layoutStyles.clearBtn} 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    >
                      Mark read
                    </button>
                  </div>
                  <div style={layoutStyles.dropdownList}>
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        style={{
                          ...layoutStyles.notificationItem,
                          backgroundColor: n.read ? 'transparent' : 'rgba(20, 184, 166, 0.05)'
                        }}
                      >
                        <p style={layoutStyles.notificationText}>{n.text}</p>
                        <span style={layoutStyles.notificationTime}>{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={layoutStyles.popoverWrapper}>
              <button style={layoutStyles.profileTrigger} onClick={toggleProfile}>
                <img 
                  src={currentUser.photo} 
                  alt={currentUser.name} 
                  style={layoutStyles.navbarAvatar} 
                />
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>
              
              {profileDropdownOpen && (
                <div style={layoutStyles.profileDropdown} className="card">
                  <div style={layoutStyles.profileDropdownUser}>
                    <strong>{currentUser.name}</strong>
                    <span style={layoutStyles.userEmail}>{currentUser.email}</span>
                  </div>
                  <div style={layoutStyles.divider} />
                  <Link 
                    to="/profile" 
                    onClick={() => setProfileDropdownOpen(false)}
                    style={layoutStyles.dropdownLink}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{ ...layoutStyles.dropdownLink, width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={layoutStyles.mainBody}>
          {children}
        </main>
      </div>
    </div>
  );
}

const layoutStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: 'var(--bg-main)',
  },
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-sidebar)',
    color: 'var(--text-white)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    zIndex: 1000,
    transition: 'left var(--transition-normal)',
  },
  sidebarHeader: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1e293b',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: 'var(--text-white)',
    letterSpacing: '-0.5px',
  },
  closeMobileBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-light)',
    cursor: 'pointer',
    display: 'none', // Controlled via media queries in standard CSS, we handle responsiveness programmatically
  },
  navMenu: {
    flex: 1,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 24px',
    fontWeight: 500,
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'var(--transition-fast)',
  },
  sidebarUserCard: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderTop: '1px solid #1e293b',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
    border: '2px solid var(--primary-light)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-white)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-light)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    transition: 'var(--transition-fast)',
    ':hover': {
      color: 'var(--error)',
      backgroundColor: '#1e293b',
    }
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
  },
  mainContentWrapper: {
    flex: 1,
    marginLeft: 'var(--sidebar-width)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0, // Prevents layout blowouts inside nested flexboxes
    transition: 'margin var(--transition-normal)',
  },
  header: {
    height: 'var(--navbar-height)',
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
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  mobileMenuToggle: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
    display: 'none',
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  popoverWrapper: {
    position: 'relative',
  },
  headerIconButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    transition: 'var(--transition-fast)',
    ':hover': {
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-main)',
    }
  },
  notificationBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: 'var(--error)',
    color: 'var(--text-white)',
    fontSize: '10px',
    fontWeight: 700,
    width: '16px',
    height: '16px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--bg-card)',
  },
  notificationsDropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    width: '320px',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1001,
    padding: '16px',
    boxShadow: 'var(--shadow-premium)',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  dropdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  notificationItem: {
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    borderBottom: '1px solid var(--border)',
  },
  notificationText: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  notificationTime: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginTop: '4px',
    display: 'block',
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
  },
  navbarAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
  },
  profileDropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    width: '200px',
    zIndex: 1001,
    padding: '12px',
    boxShadow: 'var(--shadow-premium)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  profileDropdownUser: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '8px 0',
  },
  dropdownLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-main)',
    }
  },
  mainBody: {
    flex: 1,
    padding: '0',
    overflowY: 'auto',
  }
};
