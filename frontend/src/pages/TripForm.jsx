// TripForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  FileText, 
  Tag, 
  DollarSign, 
  MapPin,
  AlertCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

const PRESET_COVERS = [
  { name: "Taj Mahal", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" },
  { name: "Goa Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { name: "Paris Cafe", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800" },
  { name: "Tokyo Neon", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800" },
  { name: "Rome Colosseum", url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800" },
  { name: "Bali Beach", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800" }
];

export default function TripForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(25000); // default in INR
  const [selectedCityId, setSelectedCityId] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(PRESET_COVERS[0].url);
  const [isPublic, setIsPublic] = useState(false);
  
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingStops, setExistingStops] = useState([]);

  // Fetch cities and prefill selected destination from search query
  useEffect(() => {
    async function loadCities() {
      try {
        const allCities = await mockDataService.getCities();
        setCities(allCities);
        
        // Check if destination was passed as query param (e.g. from Dashboard click)
        const destParam = searchParams.get('destination');
        if (destParam) {
          setSelectedCityId(destParam);
          const city = allCities.find(c => c.id === destParam);
          if (city) {
            setCoverPhoto(city.image);
            // Default name
            setName(`Adventure to ${city.name}`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCities();
  }, [searchParams]);

  // Load existing trip data if editing
  useEffect(() => {
    if (isEdit) {
      async function loadTrip() {
        try {
          const trip = await mockDataService.getTripById(id);
          if (trip) {
            setName(trip.name);
            setStartDate(trip.startDate);
            setEndDate(trip.endDate);
            setDescription(trip.description || '');
            setBudgetLimit(trip.budgetLimit || 25000);
            setCoverPhoto(trip.coverPhoto);
            setIsPublic(trip.isPublic || false);
            setExistingStops(trip.stops || []);
            
            if (trip.stops && trip.stops.length > 0) {
              setSelectedCityId(trip.stops[0].cityId);
            }
          } else {
            setError('Trip not found.');
          }
        } catch (err) {
          setError('Error loading trip data.');
        }
      }
      loadTrip();
    }
  }, [id, isEdit]);

  const handleSelectCity = (city) => {
    setSelectedCityId(city.id);
    setCoverPhoto(city.image);
    if (!name || name.startsWith("Adventure to")) {
      setName(`Adventure to ${city.name}`);
    }
  };

  const selectedCity = cities.find(c => c.id === selectedCityId);
  const currencyInfo = selectedCity ? currencyService.getCurrencyInfoByCountry(selectedCity.country) : null;
  const isForeign = currencyInfo && currencyInfo.code !== "INR";
  const conversionDetails = currencyInfo ? currencyService.getStaticConversionDetails(budgetLimit, selectedCity.country) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCityId) {
      setError("Please select a destination from the list.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End Date cannot be before Start Date.");
      return;
    }

    setLoading(true);

    try {
      // Build stops. If it's a new trip, create a default stop at the selected city
      let stopsData = [...existingStops];
      if (!isEdit && stopsData.length === 0) {
        stopsData = [{
          id: "s_" + Date.now(),
          cityId: selectedCityId,
          arrivalDate: startDate,
          departureDate: endDate,
          accommodationCost: selectedCity.costIndex === 3 ? 3000 : selectedCity.costIndex === 2 ? 1800 : 800,
          transportCost: selectedCity.country === "India" ? 1500 : 35000,
          orderIndex: 0,
          activities: []
        }];
      }

      const tripData = {
        name,
        startDate,
        endDate,
        description,
        budgetLimit: Number(budgetLimit),
        coverPhoto,
        isPublic,
        stops: stopsData
      };

      if (isEdit) {
        tripData.id = id;
      }

      const saved = await mockDataService.saveTrip(tripData);
      if (!isEdit) {
        // Automatically proceed to itinerary building
        navigate(`/itinerary/build/${saved.id}`);
      } else {
        navigate('/trips');
      }
    } catch (err) {
      setError(err.message || 'Failed to save travel plan.');
    } finally {
      setLoading(false);
    }
  };

  // Divide cities into India and Foreign
  const indianCities = cities.filter(c => c.country === "India");
  const foreignCities = cities.filter(c => c.country !== "India");

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '24px 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{isEdit ? 'Modify Travel Plan' : 'Plan a New Journey'}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Choose a destination, configure budget bounds, and set up your travel dates.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {error && (
          <div style={formStyles.errorAlert}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Destination Selection Cards Grid */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="var(--primary)" />
            <span>Select Destination City *</span>
          </h3>

          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Popular Indian Destinations</span>
          <div style={formStyles.destinationScrollWrap}>
            {indianCities.map(city => (
              <div 
                key={city.id} 
                onClick={() => handleSelectCity(city)}
                style={{
                  ...formStyles.destCard,
                  borderColor: selectedCityId === city.id ? 'var(--primary-light)' : 'var(--border)',
                  backgroundColor: selectedCityId === city.id ? 'rgba(20, 184, 166, 0.03)' : 'var(--bg-card)'
                }}
              >
                <img src={city.image} alt={city.name} style={formStyles.destCardImg} />
                <div style={formStyles.destCardBody}>
                  <strong>{city.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{city.country}</span>
                </div>
              </div>
            ))}
          </div>

          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginTop: '16px' }}>Inspiring Foreign Destinations</span>
          <div style={formStyles.destinationScrollWrap}>
            {foreignCities.map(city => (
              <div 
                key={city.id} 
                onClick={() => handleSelectCity(city)}
                style={{
                  ...formStyles.destCard,
                  borderColor: selectedCityId === city.id ? 'var(--primary-light)' : 'var(--border)',
                  backgroundColor: selectedCityId === city.id ? 'rgba(20, 184, 166, 0.03)' : 'var(--bg-card)'
                }}
              >
                <img src={city.image} alt={city.name} style={formStyles.destCardImg} />
                <div style={formStyles.destCardBody}>
                  <strong>{city.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{city.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Trip Name */}
          <div className="form-group">
            <label className="form-label">Trip Title / Name *</label>
            <div style={formStyles.inputIconWrap}>
              <Tag size={16} style={formStyles.inputIcon} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="e.g. My Himalayan Adventure, Paris & Rome Escapade"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <div style={formStyles.inputIconWrap}>
                <Calendar size={16} style={formStyles.inputIcon} />
                <input 
                  type="date" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <div style={formStyles.inputIconWrap}>
                <Calendar size={16} style={formStyles.inputIcon} />
                <input 
                  type="date" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Trip Description</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: '80px', resize: 'vertical' }}
              placeholder="Provide context or details about the vacation goal..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Budget Input & Conversion Panel */}
          <div className="form-group" style={formStyles.budgetArea}>
            <label className="form-label">
              {isForeign ? 'Trip Budget in INR (₹) *' : 'Trip Budget (₹) *'}
            </label>
            <div style={formStyles.inputIconWrap}>
              <span style={formStyles.inrSymbol}>₹</span>
              <input 
                type="number" 
                className="form-input" 
                style={{ paddingLeft: '36px' }}
                placeholder="25000"
                value={budgetLimit}
                onChange={e => setBudgetLimit(e.target.value)}
                required
              />
            </div>

            {/* Currency conversion results */}
            {isForeign && conversionDetails && (
              <div style={formStyles.conversionBox}>
                <div style={formStyles.conversionHeader}>
                  <TrendingUp size={16} color="var(--primary)" />
                  <strong>Foreign Currency Estimation</strong>
                </div>
                <div style={formStyles.conversionBody}>
                  <div style={formStyles.conversionItem}>
                    <span>Approx. Local Budget:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary-hover)' }}>{conversionDetails.local}</strong>
                  </div>
                  <div style={formStyles.conversionItem}>
                    <span>Exchange Rate:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{conversionDetails.rateText}</span>
                  </div>
                  <p style={formStyles.disclaimer}>* {conversionDetails.note}</p>
                </div>
              </div>
            )}
          </div>

          {/* Public Sharing Option */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input 
              type="checkbox" 
              id="isPublic"
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
            />
            <label htmlFor="isPublic" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Publish to community tab once created
            </label>
          </div>
        </div>

        <div style={formStyles.actionsRow}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={18} />
            <span>{loading ? 'Creating plan...' : isEdit ? 'Save Settings' : 'Create & Build Itinerary'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

const formStyles = {
  destinationScrollWrap: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    padding: '8px 0',
    marginTop: '6px',
    scrollbarWidth: 'thin',
  },
  destCard: {
    minWidth: '130px',
    maxWidth: '130px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  destCardImg: {
    width: '100%',
    height: '80px',
    objectFit: 'cover',
  },
  destCardBody: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  inputIconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-light)',
  },
  inrSymbol: {
    position: 'absolute',
    left: '16px',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  budgetArea: {
    backgroundColor: 'var(--bg-main)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed var(--border)',
  },
  conversionBox: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  conversionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px',
    fontSize: '0.85rem',
  },
  conversionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  conversionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    borderTop: '1px solid var(--border)',
    paddingTop: '20px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error)',
    fontSize: '0.85rem',
    fontWeight: 600,
    border: '1px solid rgba(239, 68, 68, 0.15)',
  }
};
