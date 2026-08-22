// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Compass, 
  Search, 
  Filter, 
  Info, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTrips, setActiveTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'cost'
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const user = await mockDataService.getCurrentUser();
        setCurrentUser(user);
        
        const allTrips = await mockDataService.getTrips();
        // Separate active (ongoing/upcoming) and completed/previous trips
        const today = new Date();
        const active = allTrips.filter(t => new Date(t.endDate) >= today);
        const completed = allTrips.filter(t => new Date(t.endDate) < today);
        
        setActiveTrips(active.slice(0, 3));
        setPreviousTrips(completed.slice(0, 3));
        
        const allCities = await mockDataService.getCities();
        setCities(allCities);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getDaysCount = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e - s);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/cities?city=${searchQuery}`);
    }
  };

  // Filter and sort cities
  const filteredCities = cities
    .filter(c => {
      const matchesQuery = searchQuery === '' || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
      return matchesQuery && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      } else {
        return a.costIndex - b.costIndex;
      }
    });

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '240px', width: '100%', marginBottom: '32px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '60px', width: '300px', marginBottom: '24px' }} />
        <div className="grid-cols-3" style={{ marginBottom: '32px' }}>
          <div className="skeleton" style={{ height: '200px' }} />
          <div className="skeleton" style={{ height: '200px' }} />
          <div className="skeleton" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  const regionTabs = ['All', 'India', 'Europe', 'Asia', 'North America'];

  return (
    <div className="container" style={dashStyles.container}>
      {/* 1. Large Travel Banner / Hero Section */}
      <div style={dashStyles.heroBanner}>
        <div style={dashStyles.heroOverlay} />
        <div style={dashStyles.heroContent}>
          <span style={dashStyles.heroTag}>PLAN YOUR NEXT ESCAPE</span>
          <h2 style={dashStyles.heroTitle}>Explore the World, Your Way</h2>
          <p style={dashStyles.heroSubtitle}>
            Bonjour, {currentUser?.name || 'Explorer'}! Search destinations, build day-wise custom itineraries, and manage budgets in local currencies.
          </p>
          <div style={dashStyles.heroActions}>
            <Link to="/trips/create" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <Plus size={18} />
              <span>Create / Plan a Trip</span>
            </Link>
            <a href="#explore-destinations" className="btn btn-secondary" style={{ padding: '12px 28px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-white)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <span>Explore Destinations</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filters Section */}
      <div className="card" style={dashStyles.filterCard}>
        <form onSubmit={handleSearchSubmit} style={dashStyles.searchForm}>
          <div style={dashStyles.searchBox}>
            <Search size={20} style={dashStyles.searchIcon} />
            <input 
              type="text" 
              placeholder="Where do you want to go? (e.g. Goa, Paris, Tokyo)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={dashStyles.searchInput}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', height: '48px' }}>Search</button>
        </form>

        <div style={dashStyles.controlsRow}>
          <div style={dashStyles.regionSelector}>
            <span style={dashStyles.controlLabel}>Region:</span>
            <div style={dashStyles.tabsGroup}>
              {regionTabs.map(r => (
                <button 
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  style={{
                    ...dashStyles.tabBtn,
                    backgroundColor: selectedRegion === r ? 'var(--primary)' : 'transparent',
                    color: selectedRegion === r ? 'var(--text-white)' : 'var(--text-muted)',
                    borderColor: selectedRegion === r ? 'var(--primary)' : 'var(--border)'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={dashStyles.sortSelector}>
            <span style={dashStyles.controlLabel}>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={dashStyles.sortSelectInput}
            >
              <option value="popularity">Popularity (High → Low)</option>
              <option value="cost">Budget Index (Low → High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Top Regional / Popular Destinations */}
      <div id="explore-destinations" style={{ marginTop: '40px' }}>
        <div style={dashStyles.sectionHeader}>
          <div>
            <h3>Popular Travel Destinations</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Check recommended sights, approximate budgets, and add to your plans.</p>
          </div>
          <Link to="/cities" style={dashStyles.sectionLink}>
            <span>View All Cities</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid-cols-3" style={{ gap: '24px' }}>
          {filteredCities.slice(0, 6).map(city => (
            <div key={city.id} className="card card-hover" style={dashStyles.cityCard}>
              <div style={dashStyles.cityImageWrap}>
                <img src={city.image} alt={city.name} style={dashStyles.cityImage} />
                <span style={dashStyles.cityRegionBadge}>{city.region}</span>
              </div>
              <div style={dashStyles.cityInfo}>
                <div style={dashStyles.cityHeaderRow}>
                  <h4 style={dashStyles.cityName}>{city.name}</h4>
                  <span style={dashStyles.cityCostIndex}>
                    {city.country === "India" ? "₹".repeat(city.costIndex) : "$".repeat(city.costIndex)}
                  </span>
                </div>
                <span style={dashStyles.cityCountry}>{city.country}</span>
                <p style={dashStyles.cityDesc}>{city.description}</p>
                <div style={dashStyles.cityFooter}>
                  <button 
                    onClick={() => navigate(`/cities?city=${city.name}`)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, borderColor: 'var(--border)' }}
                  >
                    Explore Attractions
                  </button>
                  <button 
                    onClick={() => navigate(`/trips/create?destination=${city.id}`)}
                    className="btn btn-primary btn-sm"
                  >
                    Plan Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Previous / Completed Trips Section */}
      <div style={{ marginTop: '48px', marginBottom: '40px' }}>
        <div style={dashStyles.sectionHeader}>
          <div>
            <h3>Your Previous Escapades</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>Revisit your past travel diaries and cloned completed guides.</p>
          </div>
        </div>

        {previousTrips.length === 0 ? (
          <div className="card flex-center" style={dashStyles.emptyStateCard}>
            <Info size={36} color="var(--text-light)" style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No completed trips recorded yet.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Trips with end dates in the past will automatically show up here.</p>
          </div>
        ) : (
          <div className="grid-cols-3" style={{ gap: '24px' }}>
            {previousTrips.map(trip => {
              const days = getDaysCount(trip.startDate, trip.endDate);
              return (
                <div key={trip.id} className="card card-hover" style={dashStyles.prevTripCard}>
                  <div style={{ ...dashStyles.prevTripCover, backgroundImage: `url(${trip.coverPhoto})` }}>
                    <div style={dashStyles.prevTripOverlay}>
                      <span style={dashStyles.prevTripBadge}>COMPLETED</span>
                    </div>
                  </div>
                  <div style={dashStyles.prevTripBody}>
                    <h4 style={dashStyles.prevTripName}>{trip.name}</h4>
                    <p style={dashStyles.prevTripDates}>
                      <Calendar size={12} />
                      <span>{trip.startDate} to {trip.endDate} ({days} days)</span>
                    </p>
                    <div style={dashStyles.prevTripMeta}>
                      <span><strong>{trip.stops.length}</strong> stops</span>
                      <span>Budget: <strong>{currencyService.format(trip.budgetLimit, "India")}</strong></span>
                    </div>
                    <button 
                      onClick={() => navigate(`/itinerary/view/${trip.id}`)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', marginTop: '12px' }}
                    >
                      Revisit Itinerary
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Create / Plan a Trip Call to Action (CTA) */}
      <div style={dashStyles.ctaSection}>
        <div style={dashStyles.ctaContent}>
          <h3>Ready to design your own custom map route?</h3>
          <p>Choose destinations, allocate budgets, schedule attractions, and share with your travel buddies.</p>
        </div>
        <Link to="/trips/create" className="btn btn-accent" style={{ padding: '14px 32px' }}>
          Get Started Now
        </Link>
      </div>
    </div>
  );
}

const dashStyles = {
  container: {
    padding: '24px 0',
  },
  heroBanner: {
    backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'var(--radius-lg)',
    height: '320px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '40px',
    color: 'var(--text-white)',
    boxShadow: 'var(--shadow-lg)',
    marginBottom: '28px',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '700px',
  },
  heroTag: {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '1px',
    color: 'var(--primary-light)',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-white)',
    lineHeight: '1.2',
    marginBottom: '10px',
  },
  heroSubtitle: {
    fontSize: '1rem',
    color: '#cbd5e1',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  heroActions: {
    display: 'flex',
    gap: 12,
  },
  filterCard: {
    padding: '24px',
    marginTop: '-40px',
    position: 'relative',
    zIndex: 3,
    boxShadow: 'var(--shadow-premium)',
  },
  searchForm: {
    display: 'flex',
    gap: 12,
    marginBottom: '16px',
  },
  searchBox: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    paddingLeft: '48px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: '16px',
    borderTop: '1px solid var(--border)',
  },
  regionSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
  },
  tabsGroup: {
    display: 'flex',
    gap: 8,
  },
  tabBtn: {
    padding: '6px 14px',
    fontSize: '0.85rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'var(--transition-fast)',
  },
  sortSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sortSelectInput: {
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    padding: '0 10px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    backgroundColor: 'var(--bg-card)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '20px',
  },
  sectionLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--primary)',
  },
  cityCard: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cityImageWrap: {
    height: '160px',
    position: 'relative',
  },
  cityImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cityRegionBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    color: 'var(--text-white)',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  cityInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cityHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  cityCostIndex: {
    fontWeight: 700,
    color: 'var(--primary-light)',
    fontSize: '0.9rem',
  },
  cityCountry: {
    fontSize: '0.8rem',
    color: 'var(--text-light)',
    marginBottom: '8px',
    display: 'block',
  },
  cityDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    marginBottom: '16px',
    flex: 1,
  },
  cityFooter: {
    display: 'flex',
    gap: 10,
  },
  prevTripCard: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  prevTripCover: {
    height: '120px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  prevTripOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px',
  },
  prevTripBadge: {
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    color: 'var(--text-white)',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
    letterSpacing: '0.5px',
  },
  prevTripBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  prevTripName: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  prevTripDates: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  prevTripMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-light)',
  },
  emptyStateCard: {
    padding: '40px',
    textAlign: 'center',
    flexDirection: 'column',
  },
  ctaSection: {
    background: 'linear-gradient(135deg, var(--bg-sidebar), #1e293b)',
    borderRadius: 'var(--radius-lg)',
    padding: '36px 40px',
    color: 'var(--text-white)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
    boxShadow: 'var(--shadow-lg)',
  },
  ctaContent: {
    maxWidth: '550px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }
};
