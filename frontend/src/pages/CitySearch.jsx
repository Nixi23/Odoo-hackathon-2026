// CitySearch.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign, 
  Plus, 
  Check, 
  ChevronRight,
  Info 
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';

export default function CitySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('city') || '');
  const [region, setRegion] = useState('All');

  // Modal selector for Add to Trip
  const [selectedCityForAdd, setSelectedCityForAdd] = useState(null);
  const [addToTripId, setAddToTripId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const allTrips = await mockDataService.getTrips();
        setTrips(allTrips);
        
        const allCities = await mockDataService.getCities();
        setCities(allCities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { city: query } : {});
  };

  const handleOpenAddModal = (city) => {
    setSelectedCityForAdd(city);
    setAddToTripId(trips.length > 0 ? trips[0].id : '');
    setArrivalDate('');
    setDepartureDate('');
    setAddError('');
    setAddSuccess(false);
  };

  const handleAddCityToTrip = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!addToTripId) {
      setAddError("Please select a trip plan.");
      return;
    }
    if (new Date(departureDate) < new Date(arrivalDate)) {
      setAddError("Departure date cannot be before arrival date.");
      return;
    }

    try {
      const trip = trips.find(t => t.id === addToTripId);
      
      // Validate dates fit inside trip
      if (new Date(arrivalDate) < new Date(trip.startDate) || new Date(departureDate) > new Date(trip.endDate)) {
        setAddError(`Dates must fit within trip duration: ${trip.startDate} to ${trip.endDate}`);
        return;
      }

      // Add stop
      const newStop = {
        id: "s_" + Date.now(),
        cityId: selectedCityForAdd.id,
        arrivalDate,
        departureDate,
        accommodationCost: selectedCityForAdd.costIndex === 3 ? 160 : selectedCityForAdd.costIndex === 2 ? 100 : 50,
        transportCost: 100,
        orderIndex: trip.stops.length,
        activities: []
      };

      const updatedStops = [...trip.stops, newStop].sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate));
      const reindexed = updatedStops.map((s, idx) => ({ ...s, orderIndex: idx }));

      await mockDataService.saveStops(trip.id, reindexed);
      
      setAddSuccess(true);
      setTimeout(() => {
        setSelectedCityForAdd(null);
        navigate(`/itinerary/build/${trip.id}`);
      }, 1200);
    } catch (err) {
      setAddError(err.message || "Failed to add stop.");
    }
  };

  // Filter local lists
  const filteredCities = cities.filter(city => {
    const matchesQuery = query === '' || 
      city.name.toLowerCase().includes(query.toLowerCase()) || 
      city.country.toLowerCase().includes(query.toLowerCase());
    const matchesRegion = region === 'All' || city.region === region;
    return matchesQuery && matchesRegion;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="skeleton" style={{ height: '50px', width: '200px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '350px' }} />
      </div>
    );
  }

  const regionsList = ['All', 'Europe', 'Asia', 'North America', 'Africa', 'Oceania'];

  return (
    <div className="container">
      {/* Header */}
      <div style={cityStyles.headerRow}>
        <div>
          <h2 style={cityStyles.pageTitle}>Explore Travel Destinations</h2>
          <p style={cityStyles.pageSubtitle}>Discover popular cities, check cost indexes and schedule stops into your trips.</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card" style={cityStyles.filterCard}>
        <form onSubmit={handleSearchSubmit} style={cityStyles.searchForm}>
          <div style={cityStyles.inputIconWrap}>
            <Search size={18} style={cityStyles.inputIcon} />
            <input 
              type="text" 
              placeholder="Search by city or country (e.g. Paris, Japan)..." 
              className="form-input" 
              style={{ paddingLeft: '40px' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div style={cityStyles.regionFilterRow}>
          <span style={cityStyles.filterLabel}>
            <Filter size={14} />
            <span>Filter Region:</span>
          </span>
          <div style={cityStyles.tabsGroup}>
            {regionsList.map(r => (
              <button 
                key={r}
                onClick={() => setRegion(r)}
                style={{
                  ...cityStyles.tabBtn,
                  backgroundColor: region === r ? 'var(--primary)' : 'transparent',
                  color: region === r ? 'var(--text-white)' : 'var(--text-muted)',
                  borderColor: region === r ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities Catalog Grid */}
      {filteredCities.length === 0 ? (
        <div className="card flex-center" style={cityStyles.emptyStateCard}>
          <Info size={40} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
          <h3>No Destinations Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>We couldn't find any cities matching your query. Try another search!</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredCities.map(city => (
            <div key={city.id} className="card card-hover" style={cityStyles.cityCard}>
              <div style={cityStyles.cardImageWrap}>
                <img src={city.image} alt={city.name} style={cityStyles.cardImage} />
                <span style={cityStyles.regionBadge}>{city.region}</span>
              </div>
              <div style={cityStyles.cardBody}>
                <div style={cityStyles.cityTitleRow}>
                  <h3 style={cityStyles.cityName}>{city.name}</h3>
                  <span style={cityStyles.costValue}>
                    {"$".repeat(city.costIndex)}
                  </span>
                </div>
                <span style={cityStyles.countryName}>{city.country}</span>
                <p style={cityStyles.cityDesc}>{city.description}</p>
                
                {/* Popularity Stars */}
                <div style={cityStyles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < city.popularity ? 'var(--warning)' : 'none'} 
                      color={i < city.popularity ? 'var(--warning)' : 'var(--text-light)'}
                    />
                  ))}
                  <span style={cityStyles.starsText}>Popularity ({city.popularity}/5)</span>
                </div>

                <button 
                  onClick={() => handleOpenAddModal(city)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  <Plus size={16} />
                  <span>Add to Trip Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Stop Modal Selector */}
      {selectedCityForAdd && (
        <div style={cityStyles.modalOverlay}>
          <div className="card" style={cityStyles.modalCard}>
            <div style={cityStyles.modalHeader}>
              <MapPin size={22} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Schedule Stop: {selectedCityForAdd.name}</h3>
            </div>

            {addSuccess ? (
              <div style={cityStyles.successBox} className="badge badge-success">
                <Check size={18} />
                <span>Successfully added stop! Redirecting to Builder...</span>
              </div>
            ) : (
              <form onSubmit={handleAddCityToTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {addError && (
                  <div style={cityStyles.errorAlert}>
                    <Info size={16} />
                    <span>{addError}</span>
                  </div>
                )}

                {trips.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      You need a planned trip before adding destination stops.
                    </p>
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm" 
                      onClick={() => navigate('/trips/create')}
                    >
                      Create a Trip First
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Select Trip Itinerary</label>
                      <select 
                        className="form-input" 
                        value={addToTripId}
                        onChange={e => setAddToTripId(e.target.value)}
                        required
                      >
                        {trips.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.startDate} to {t.endDate})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Arrival Date</label>
                        <input 
                          type="date" 
                          className="form-input"
                          value={arrivalDate}
                          onChange={e => setArrivalDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Departure Date</label>
                        <input 
                          type="date" 
                          className="form-input"
                          value={departureDate}
                          onChange={e => setDepartureDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={cityStyles.modalActions}>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setSelectedCityForAdd(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Confirm Stop
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const cityStyles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    padding: '24px 0 0',
  },
  pageTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
  },
  pageSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  filterCard: {
    padding: '20px',
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  searchForm: {
    display: 'flex',
    gap: 12,
  },
  inputIconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-light)',
  },
  regionFilterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
  },
  tabsGroup: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  tabBtn: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    padding: '4px 14px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'none',
    transition: 'var(--transition-fast)',
    ':hover': {
      borderColor: 'var(--primary-light)',
    }
  },
  emptyStateCard: {
    padding: '60px 40px',
    flexDirection: 'column',
    textAlign: 'center',
  },
  cityCard: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardImageWrap: {
    height: '160px',
    position: 'relative',
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  regionBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    color: 'var(--text-white)',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 'var(--radius-sm)',
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cityTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  costValue: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: 'var(--primary-light)',
  },
  countryName: {
    fontSize: '0.8rem',
    color: 'var(--text-light)',
    marginBottom: '10px',
    fontWeight: 500,
  },
  cityDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '16px',
    flex: 1,
  },
  starsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  starsText: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginLeft: '6px',
    fontWeight: 500,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalCard: {
    maxWidth: '480px',
    width: '100%',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: '18px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: '12px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px',
    fontSize: '0.85rem',
    width: '100%',
  }
};
