// ItineraryBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Plus, 
  Trash2, 
  DollarSign, 
  Search, 
  Filter, 
  Clock, 
  Activity, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { currencyService } from '../services/currencyService';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeStopId, setActiveStopId] = useState(null);

  // Stop Form State
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [stopArrival, setStopArrival] = useState('');
  const [stopDeparture, setStopDeparture] = useState('');
  const [stopAccommodation, setStopAccommodation] = useState(1500); // INR
  const [stopTransport, setStopTransport] = useState(2000); // INR
  const [stopError, setStopError] = useState('');

  // Activity Browse State
  const [cityActivities, setCityActivities] = useState([]);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('All');
  
  // Custom Activity State
  const [customActivityName, setCustomActivityName] = useState('');
  const [customActivityCost, setCustomActivityCost] = useState(1000); // INR
  const [customActivityTime, setCustomActivityTime] = useState('10:00');
  const [customActivityDate, setCustomActivityDate] = useState('');
  const [customActivityCategory, setCustomActivityCategory] = useState('Sightseeing');
  const [customActivityDuration, setCustomActivityDuration] = useState(2);
  const [showCustomActivityForm, setShowCustomActivityForm] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const tripData = await mockDataService.getTripById(tripId);
        if (!tripData) {
          navigate('/trips');
          return;
        }
        setTrip(tripData);
        setStops(tripData.stops || []);
        if (tripData.stops && tripData.stops.length > 0) {
          setActiveStopId(tripData.stops[0].id);
        }

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

  // Load activities when active stop changes
  useEffect(() => {
    if (!activeStopId) return;
    const activeStop = stops.find(s => s.id === activeStopId);
    if (activeStop) {
      mockDataService.getActivitiesByCityId(activeStop.cityId).then(acts => {
        setCityActivities(acts);
      });
      // Reset activity search filters
      setActivitySearchQuery('');
      setActivityCategoryFilter('All');
      setShowCustomActivityForm(false);
      setCustomActivityName('');
      setCustomActivityCost(1000);
      setCustomActivityTime('10:00');
      setCustomActivityDate(activeStop.arrivalDate);
    }
  }, [activeStopId, stops]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Add a city section/stop
  const handleAddStop = (e) => {
    e.preventDefault();
    setStopError('');

    if (!selectedCityId) {
      setStopError("Please select a city.");
      return;
    }
    if (new Date(stopDeparture) < new Date(stopArrival)) {
      setStopError("Departure date cannot be before arrival date.");
      return;
    }
    if (new Date(stopArrival) < new Date(trip.startDate) || new Date(stopDeparture) > new Date(trip.endDate)) {
      setStopError(`Stops must fit within trip duration: ${trip.startDate} to ${trip.endDate}`);
      return;
    }

    const city = cities.find(c => c.id === selectedCityId);
    const newStop = {
      id: "s_" + Date.now(),
      cityId: selectedCityId,
      arrivalDate: stopArrival,
      departureDate: stopDeparture,
      accommodationCost: Number(stopAccommodation),
      transportCost: Number(stopTransport),
      orderIndex: stops.length,
      activities: []
    };

    const updatedStops = [...stops, newStop].sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate));
    const reindexed = updatedStops.map((s, idx) => ({ ...s, orderIndex: idx }));
    
    setStops(reindexed);
    setActiveStopId(newStop.id);
    setShowAddStopModal(false);
    showToast(`Added stop at ${city.name}!`);

    // Reset Form
    setSelectedCityId('');
    setStopArrival('');
    setStopDeparture('');
    setStopAccommodation(1500);
    setStopTransport(2000);
  };

  const handleRemoveStop = (id) => {
    const city = cities.find(c => c.id === stops.find(s => s.id === id)?.cityId);
    const filtered = stops.filter(s => s.id !== id);
    const reindexed = filtered.map((s, idx) => ({ ...s, orderIndex: idx }));
    setStops(reindexed);
    if (activeStopId === id) {
      setActiveStopId(reindexed.length > 0 ? reindexed[0].id : null);
    }
    showToast(`Removed stop at ${city?.name || 'city'}.`);
  };

  const handleStopCostChange = (stopId, field, value) => {
    const updated = stops.map(s => {
      if (s.id === stopId) {
        return { ...s, [field]: Number(value) };
      }
      return s;
    });
    setStops(updated);
  };

  // Add Recommended Activity
  const handleAddStandardActivity = (act) => {
    if (!activeStopId) return;
    const activeStop = stops.find(s => s.id === activeStopId);
    
    const newAct = {
      id: "sa_" + Date.now(),
      name: act.name,
      cost: act.cost, // in INR
      category: act.category,
      duration: act.duration,
      date: activeStop.arrivalDate, // default to arrival date
      time: "10:00"
    };

    const updatedStops = stops.map(s => {
      if (s.id === activeStopId) {
        return { ...s, activities: [...s.activities, newAct] };
      }
      return s;
    });

    setStops(updatedStops);
    showToast(`Scheduled ${act.name}!`);
  };

  // Add Custom Activity
  const handleAddCustomActivity = (e) => {
    e.preventDefault();
    if (!activeStopId || !customActivityName) return;

    const newAct = {
      id: "sa_" + Date.now(),
      name: customActivityName,
      cost: Number(customActivityCost),
      category: customActivityCategory,
      duration: Number(customActivityDuration),
      date: customActivityDate,
      time: customActivityTime
    };

    const updatedStops = stops.map(s => {
      if (s.id === activeStopId) {
        return { ...s, activities: [...s.activities, newAct] };
      }
      return s;
    });

    setStops(updatedStops);
    showToast(`Scheduled custom activity ${customActivityName}!`);
    
    setCustomActivityName('');
    setCustomActivityCost(1000);
    setShowCustomActivityForm(false);
  };

  // Remove Activity
  const handleRemoveActivity = (stopId, actId) => {
    const updatedStops = stops.map(s => {
      if (s.id === stopId) {
        return { ...s, activities: s.activities.filter(a => a.id !== actId) };
      }
      return s;
    });
    setStops(updatedStops);
    showToast("Activity removed.");
  };

  const handleSaveItinerary = async () => {
    setSaving(true);
    try {
      const updatedTrip = { ...trip, stops };
      await mockDataService.saveTrip(updatedTrip);
      showToast("Itinerary saved successfully!");
      setTimeout(() => navigate(`/itinerary/view/${tripId}`), 1000);
    } catch (err) {
      console.error(err);
      showToast("Failed to save itinerary.");
    } finally {
      setSaving(false);
    }
  };

  // Budget calculations
  const calculateTotalAllocated = () => {
    let total = 0;
    stops.forEach(s => {
      // accommodation cost * nights
      const nights = Math.max(1, Math.ceil(Math.abs(new Date(s.departureDate) - new Date(s.arrivalDate)) / (1000 * 60 * 60 * 24)));
      total += (s.accommodationCost || 0) * nights;
      total += (s.transportCost || 0);
      s.activities.forEach(a => {
        total += (a.cost || 0);
      });
    });
    return total;
  };

  const totalAllocated = calculateTotalAllocated();
  const isOverBudget = trip && totalAllocated > trip.budgetLimit;

  // Filter activities catalog
  const activeStop = stops.find(s => s.id === activeStopId);
  const activeCity = activeStop ? cities.find(c => c.id === activeStop.cityId) : null;
  const activeCityCurrency = activeCity ? currencyService.getCurrencyInfoByCountry(activeCity.country) : null;
  const isCityForeign = activeCityCurrency && activeCityCurrency.code !== "INR";

  const filteredActivities = cityActivities.filter(act => {
    const matchesSearch = act.name.toLowerCase().includes(activitySearchQuery.toLowerCase()) || 
      act.description.toLowerCase().includes(activitySearchQuery.toLowerCase());
    const matchesCategory = activityCategoryFilter === 'All' || act.category === activityCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Organize Stop activities by day number
  const getStopDays = (stop) => {
    if (!stop) return [];
    const days = [];
    const start = new Date(stop.arrivalDate);
    const end = new Date(stop.departureDate);
    const diff = Math.abs(end - start);
    const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dayActs = stop.activities.filter(a => a.date === dateStr);
      days.push({
        dayIndex: i + 1,
        date: dateStr,
        activities: dayActs
      });
    }
    return days;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <div className="skeleton" style={{ height: '50px', width: '200px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      {/* Toast */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={buildStyles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/trips')} className="btn btn-secondary btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Build Itinerary — {trip.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {trip.startDate} to {trip.endDate} • Limit: {currencyService.format(trip.budgetLimit, "India")}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setShowAddStopModal(true)} className="btn btn-secondary">
            <Plus size={16} />
            <span>Add another section</span>
          </button>
          <button onClick={handleSaveItinerary} className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save & View Itinerary'}
          </button>
        </div>
      </div>

      {/* Real-time Budget Tracker */}
      <div className={`card ${isOverBudget ? 'overbudget' : ''}`} style={buildStyles.budgetProgressCard}>
        <div style={buildStyles.budgetTexts}>
          <span style={{ fontWeight: 700 }}>Itinerary Allocated Budget:</span>
          <span>
            <strong style={{ color: isOverBudget ? 'var(--error)' : 'var(--primary)' }}>
              {currencyService.format(totalAllocated, "India")}
            </strong>
            {' '}/ {currencyService.format(trip.budgetLimit, "India")}
          </span>
        </div>
        <div style={buildStyles.progressBarWrap}>
          <div 
            style={{
              ...buildStyles.progressBar,
              width: `${Math.min(100, (totalAllocated / trip.budgetLimit) * 100)}%`,
              backgroundColor: isOverBudget ? 'var(--error)' : 'var(--primary)'
            }}
          />
        </div>
        {isOverBudget && (
          <div style={buildStyles.overbudgetAlert}>
            <AlertTriangle size={14} />
            <span>Budget Alert: You are over budget by {currencyService.format(totalAllocated - trip.budgetLimit, "India")}! Consider reducing lodging or activities.</span>
          </div>
        )}
      </div>

      {/* Main Layout Builder */}
      <div style={buildStyles.layoutGrid}>
        {/* Left Column: Itinerary Sections List */}
        <div style={buildStyles.timelineColumn}>
          {stops.length === 0 ? (
            <div className="card flex-center" style={{ padding: '60px 20px', textAlign: 'center', flexDirection: 'column' }}>
              <MapPin size={36} color="var(--text-light)" style={{ marginBottom: '12px' }} />
              <h4>No Itinerary Sections Added</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Begin by adding a destination city section.</p>
              <button onClick={() => setShowAddStopModal(true)} className="btn btn-primary btn-sm">Add Section</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stops.map((stop, idx) => {
                const city = cities.find(c => c.id === stop.cityId);
                const isActive = stop.id === activeStopId;
                const days = getStopDays(stop);
                const currency = city ? currencyService.getCurrencyInfoByCountry(city.country) : null;
                const isCityForeign = currency && currency.code !== "INR";

                return (
                  <div 
                    key={stop.id} 
                    className="card"
                    onClick={() => setActiveStopId(stop.id)}
                    style={{
                      ...buildStyles.stopSectionCard,
                      borderColor: isActive ? 'var(--primary-light)' : 'var(--border)'
                    }}
                  >
                    <div style={buildStyles.stopHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={buildStyles.stopNumberBadge}>{idx + 1}</div>
                        <div>
                          <h4 style={{ margin: 0 }}>Section {idx + 1}: {city?.name || 'Loading...'}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {stop.arrivalDate} to {stop.departureDate} ({city?.country})
                          </span>
                        </div>
                      </div>
                      <button 
                        style={buildStyles.deleteStopBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStop(stop.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Section Budget Details */}
                    <div style={buildStyles.costsSectionRow}>
                      <div>
                        <label style={buildStyles.inlineLabel}>Lodging / Night</label>
                        <div style={buildStyles.costInputBox}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginRight: 4 }}>
                            {currency?.symbol || '₹'}
                          </span>
                          <input 
                            type="number" 
                            className="form-input" 
                            style={{ padding: '4px 6px', fontSize: '0.85rem', width: '70px', height: '28px' }} 
                            value={isCityForeign ? currencyService.convertFromINR(stop.accommodationCost, city?.country) : stop.accommodationCost}
                            onChange={e => {
                              const val = Number(e.target.value);
                              const valInINR = isCityForeign ? Math.round(val / currency.rate) : val;
                              handleStopCostChange(stop.id, 'accommodationCost', valInINR);
                            }}
                          />
                        </div>
                        {isCityForeign && (
                          <span style={buildStyles.inrEqLabel}>
                            ₹{Math.round(stop.accommodationCost || 0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <label style={buildStyles.inlineLabel}>Transport Cost</label>
                        <div style={buildStyles.costInputBox}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginRight: 4 }}>
                            {currency?.symbol || '₹'}
                          </span>
                          <input 
                            type="number" 
                            className="form-input" 
                            style={{ padding: '4px 6px', fontSize: '0.85rem', width: '70px', height: '28px' }} 
                            value={isCityForeign ? currencyService.convertFromINR(stop.transportCost, city?.country) : stop.transportCost}
                            onChange={e => {
                              const val = Number(e.target.value);
                              const valInINR = isCityForeign ? Math.round(val / currency.rate) : val;
                              handleStopCostChange(stop.id, 'transportCost', valInINR);
                            }}
                          />
                        </div>
                        {isCityForeign && (
                          <span style={buildStyles.inrEqLabel}>
                            ₹{Math.round(stop.transportCost || 0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Day-wise activity listing */}
                    <div style={buildStyles.daysTimeline}>
                      {days.map(day => (
                        <div key={day.date} style={buildStyles.dayTimelineSection}>
                          <div style={buildStyles.dayHeaderLine}>
                            <span>Day {day.dayIndex} ({day.date})</span>
                          </div>
                          
                          {day.activities.length === 0 ? (
                            <p style={buildStyles.emptyActsText}>No activities scheduled.</p>
                          ) : (
                            <div style={buildStyles.actsList}>
                              {day.activities.map(act => (
                                <div key={act.id} style={buildStyles.actItemCard}>
                                  <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{act.name}</span>
                                    <span style={buildStyles.actTime}>
                                      <Clock size={10} />
                                      <span>{act.time} ({act.duration}h)</span>
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <strong style={{ fontSize: '0.85rem' }}>
                                      {city ? currencyService.format(act.cost, city.country) : `₹${act.cost}`}
                                    </strong>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveActivity(stop.id, act.id);
                                      }}
                                      style={buildStyles.removeActBtn}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recommended Sights Catalog */}
        <div style={buildStyles.searchColumn}>
          {activeStop ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={buildStyles.tabHeader}>
                <h3>Activities in {activeCity?.name}</h3>
                <span className="badge badge-info">{cityActivities.length} recommended</span>
              </div>

              {/* Filtering */}
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={buildStyles.searchRow}>
                  <Search size={16} style={buildStyles.inputInnerIcon} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
                    placeholder="Search recommended sights..."
                    value={activitySearchQuery}
                    onChange={e => setActivitySearchQuery(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={buildStyles.inlineLabel}>Filter Category</label>
                  <select 
                    className="form-input" 
                    style={{ fontSize: '0.85rem', padding: '6px 12px', height: '38px' }}
                    value={activityCategoryFilter}
                    onChange={e => setActivityCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              {/* List */}
              <div style={buildStyles.activitiesCatalogGrid}>
                {filteredActivities.map(act => {
                  const displayCost = activeCity ? currencyService.format(act.cost, activeCity.country) : `₹${act.cost}`;
                  return (
                    <div key={act.id} className="card" style={buildStyles.catalogCard}>
                      <img src={act.image} alt={act.name} style={buildStyles.catalogImage} />
                      <div style={buildStyles.catalogBody}>
                        <h4 style={buildStyles.catalogName}>{act.name}</h4>
                        <p style={buildStyles.catalogDesc}>{act.description}</p>
                        <div style={buildStyles.catalogMeta}>
                          <span style={buildStyles.catalogMetaItem}>
                            <Clock size={12} />
                            <span>{act.duration}h</span>
                          </span>
                          <strong style={{ color: 'var(--primary)' }}>{displayCost}</strong>
                        </div>
                        <button 
                          onClick={() => handleAddStandardActivity(act)}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', marginTop: '8px' }}
                        >
                          Add to Itinerary
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Activities */}
              <div className="card" style={{ padding: '16px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%' }}
                  onClick={() => setShowCustomActivityForm(!showCustomActivityForm)}
                >
                  {showCustomActivityForm ? "Cancel Custom Activity" : "+ Create Custom Activity"}
                </button>

                {showCustomActivityForm && (
                  <form onSubmit={handleAddCustomActivity} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={buildStyles.inlineLabel}>Activity Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                        value={customActivityName}
                        onChange={e => setCustomActivityName(e.target.value)}
                        placeholder="e.g. Scooter rental, Shopping"
                      />
                    </div>
                    <div className="form-row">
                      <div>
                        <label style={buildStyles.inlineLabel}>
                          Cost ({activeCityCurrency?.symbol || '₹'}) *
                        </label>
                        <input 
                          type="number" 
                          required 
                          className="form-input" 
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                          value={isCityForeign ? currencyService.convertFromINR(customActivityCost, activeCity?.country) : customActivityCost}
                          onChange={e => {
                            const val = Number(e.target.value);
                            const valInINR = isCityForeign ? Math.round(val / activeCityCurrency.rate) : val;
                            setCustomActivityCost(valInINR);
                          }}
                        />
                      </div>
                      <div>
                        <label style={buildStyles.inlineLabel}>Duration (h) *</label>
                        <input 
                          type="number" 
                          required 
                          className="form-input" 
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                          value={customActivityDuration}
                          onChange={e => setCustomActivityDuration(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div>
                        <label style={buildStyles.inlineLabel}>Date *</label>
                        <input 
                          type="date" 
                          required 
                          className="form-input" 
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                          value={customActivityDate}
                          onChange={e => setCustomActivityDate(e.target.value)}
                          min={activeStop.arrivalDate}
                          max={activeStop.departureDate}
                        />
                      </div>
                      <div>
                        <label style={buildStyles.inlineLabel}>Time *</label>
                        <input 
                          type="time" 
                          required 
                          className="form-input" 
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                          value={customActivityTime}
                          onChange={e => setCustomActivityTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '4px' }}>Add Custom Activity</button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="card flex-center" style={{ padding: '80px 20px', textAlign: 'center', flexDirection: 'column', color: 'var(--text-light)' }}>
              <Activity size={32} style={{ marginBottom: '12px' }} />
              <h4>Select a City Section</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click one of your planned sections on the left to browse and schedule activities.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div style={buildStyles.modalOverlay}>
          <form onSubmit={handleAddStop} className="card" style={buildStyles.modalCard}>
            <div style={buildStyles.modalHeader}>
              <MapPin size={22} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Add Another Section</h3>
            </div>
            
            {stopError && (
              <div style={buildStyles.errorAlert}>
                <AlertTriangle size={16} />
                <span>{stopError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Destination City</label>
              <select 
                className="form-input" 
                value={selectedCityId}
                onChange={e => {
                  setSelectedCityId(e.target.value);
                  const city = cities.find(c => c.id === e.target.value);
                  if (city) {
                    setStopAccommodation(city.costIndex === 3 ? 3000 : city.costIndex === 2 ? 1800 : 800);
                  }
                }}
                required
              >
                <option value="">Select a city...</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Arrival Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={stopArrival} 
                  onChange={e => setStopArrival(e.target.value)}
                  min={trip.startDate}
                  max={trip.endDate}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Departure Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={stopDeparture} 
                  onChange={e => setStopDeparture(e.target.value)}
                  min={stopArrival || trip.startDate}
                  max={trip.endDate}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Lodging in INR (₹ / night)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={stopAccommodation}
                  onChange={e => setStopAccommodation(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Transport in INR (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={stopTransport}
                  onChange={e => setStopTransport(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: '8px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowAddStopModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">Add Itinerary Section</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const buildStyles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: 16
  },
  budgetProgressCard: {
    padding: '16px',
    marginBottom: '24px',
  },
  budgetTexts: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    marginBottom: '8px'
  },
  progressBarWrap: {
    height: '10px',
    backgroundColor: 'var(--border)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
  },
  overbudgetAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--error)',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginTop: '10px',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '7fr 5fr',
    gap: '24px',
  },
  timelineColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  searchColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  stopSectionCard: {
    borderLeftWidth: '5px',
    cursor: 'pointer',
    padding: '18px',
  },
  stopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
    marginBottom: '12px',
  },
  stopNumberBadge: {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--text-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  deleteStopBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--error)',
    cursor: 'pointer',
  },
  costsSectionRow: {
    display: 'flex',
    gap: '16px',
    backgroundColor: 'var(--bg-main)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '16px',
  },
  inlineLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: '4px',
  },
  costInputBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0 4px',
  },
  inrEqLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-light)',
    display: 'block',
    marginTop: '2px',
  },
  daysTimeline: {
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  dayTimelineSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  dayHeaderLine: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--primary)',
    borderBottom: '1px dashed var(--border)',
    paddingBottom: '2px',
  },
  emptyActsText: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    fontStyle: 'italic',
  },
  actsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  actItemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-main)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.8rem',
  },
  actTime: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.7rem',
    color: 'var(--text-light)',
    marginTop: '2px',
  },
  removeActBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--error)',
    cursor: 'pointer',
    padding: '2px',
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputInnerIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-light)',
  },
  activitiesCatalogGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  catalogCard: {
    display: 'flex',
    padding: 0,
    overflow: 'hidden',
  },
  catalogImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
  },
  catalogBody: {
    padding: '10px 14px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  catalogName: {
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  catalogDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.3,
  },
  catalogMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-light)',
    marginTop: '4px',
  },
  catalogMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
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
    width: '100%',
    maxWidth: '440px',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: '16px',
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
    marginBottom: '12px',
  }
};
