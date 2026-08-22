// BudgetBreakdown.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Info,
  Tag,
  ChevronRight
} from 'lucide-react';
import { mockDataService } from '../services/mockDataService';

export default function BudgetBreakdown() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const tripData = await mockDataService.getTripById(tripId);
        if (!tripData) {
          navigate('/trips');
          return;
        }
        setTrip(tripData);

        const analysis = await mockDataService.getBudgetBreakdown(tripId);
        setBudgetData(analysis);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripId, navigate]);

  if (loading) {
    return (
      <div className="container">
        <div className="skeleton" style={{ height: '60px', width: '200px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  const { totalCost, budgetLimit, averageCostPerDay, breakdown, dailyExpenses, overbudgetDays } = budgetData;
  const isOverLimit = totalCost > budgetLimit;
  const remainingBudget = budgetLimit - totalCost;
  
  // SVG Donut calculation constants
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  // Pre-calculate segments for the SVG donut chart
  const donutSegments = breakdown.map(item => {
    const percent = totalCost > 0 ? item.value / totalCost : 0;
    const strokeDashoffset = circumference - (percent * circumference);
    const strokeDasharray = `${circumference} ${circumference}`;
    const rotation = (accumulatedPercent * 360).toFixed(1);
    accumulatedPercent += percent;

    return {
      ...item,
      percent: Math.round(percent * 100),
      strokeDashoffset,
      strokeDasharray,
      rotation
    };
  });

  // Daily Max Spent calculation for bar chart height normalization
  const maxSpentInDay = Math.max(...dailyExpenses.map(d => d.spent), 100);

  return (
    <div className="container">
      {/* Header Row */}
      <div style={budgetStyles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(`/itinerary/view/${tripId}`)} className="btn btn-secondary btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={budgetStyles.pageTitle}>Budget & Cost Breakdown</h2>
            <p style={budgetStyles.pageSubtitle}>Financial analysis of: {trip.name}</p>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        <div className="card" style={budgetStyles.kpiCard}>
          <span style={budgetStyles.kpiLabel}>Total Cost Estimated</span>
          <h3 style={{ ...budgetStyles.kpiValue, color: isOverLimit ? 'var(--error)' : 'var(--primary)' }}>
            ${totalCost.toLocaleString()}
          </h3>
          <span style={budgetStyles.kpiSub}>All stops & activities</span>
        </div>

        <div className="card" style={budgetStyles.kpiCard}>
          <span style={budgetStyles.kpiLabel}>Budget Limit Set</span>
          <h3 style={budgetStyles.kpiValue}>${budgetLimit.toLocaleString()}</h3>
          <span style={budgetStyles.kpiSub}>Configured in settings</span>
        </div>

        <div className="card" style={budgetStyles.kpiCard}>
          <span style={budgetStyles.kpiLabel}>{remainingBudget >= 0 ? 'Remaining Balance' : 'Budget Overdraft'}</span>
          <h3 style={{ 
            ...budgetStyles.kpiValue, 
            color: remainingBudget >= 0 ? 'var(--success)' : 'var(--error)' 
          }}>
            {remainingBudget >= 0 ? `$${remainingBudget.toLocaleString()}` : `-$${Math.abs(remainingBudget).toLocaleString()}`}
          </h3>
          <span style={budgetStyles.kpiSub}>{remainingBudget >= 0 ? 'Within safe limit' : 'Action recommended'}</span>
        </div>

        <div className="card" style={budgetStyles.kpiCard}>
          <span style={budgetStyles.kpiLabel}>Average Spent / Day</span>
          <h3 style={budgetStyles.kpiValue}>${averageCostPerDay.toLocaleString()}</h3>
          <span style={budgetStyles.kpiSub}>Based on trip duration</span>
        </div>
      </div>

      {/* Main Budget Visual Charts Grid */}
      <div className="grid-cols-2">
        {/* Left Side: Expense Categories Donut & Legends */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={budgetStyles.cardTitle}>Cost by Expense Category</h3>
          
          {totalCost === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
              <Info size={32} style={{ marginBottom: '8px' }} />
              <p>No expenses logged. Add stops and activities in the builder to generate charts.</p>
            </div>
          ) : (
            <div style={budgetStyles.donutContainer}>
              {/* Custom SVG Donut Chart */}
              <div style={budgetStyles.svgWrapper}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={budgetStyles.svgDonut}>
                  <circle 
                    cx="80" 
                    cy="80" 
                    r={radius} 
                    fill="transparent" 
                    stroke="var(--bg-main)" 
                    strokeWidth={strokeWidth} 
                  />
                  {donutSegments.map((segment, index) => {
                    if (segment.value === 0) return null;
                    return (
                      <circle 
                        key={segment.name}
                        cx="80" 
                        cy="80" 
                        r={radius} 
                        fill="transparent" 
                        stroke={segment.color} 
                        strokeWidth={strokeWidth}
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        style={{
                          transform: `rotate(${segment.rotation}deg)`,
                          transformOrigin: '80px 80px',
                          transition: 'stroke-dashoffset 0.5s ease'
                        }}
                      />
                    );
                  })}
                </svg>
                {/* Donut Center text */}
                <div style={budgetStyles.donutCenter}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>100%</strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Expense</span>
                </div>
              </div>

              {/* Legends & Detail list */}
              <div style={budgetStyles.legendsList}>
                {donutSegments.map(item => (
                  <div key={item.name} style={budgetStyles.legendItem}>
                    <div style={budgetStyles.legendLeft}>
                      <div style={{ ...budgetStyles.legendColorDot, backgroundColor: item.color }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={budgetStyles.legendName}>{item.name}</span>
                        <span style={budgetStyles.legendPercent}>{item.percent}% of total</span>
                      </div>
                    </div>
                    <strong style={budgetStyles.legendValue}>${item.value.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Daily Expense Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={budgetStyles.cardTitle}>Daily Expense Trends</h3>
          
          <div style={budgetStyles.barChartContainer}>
            {/* Visual Bar Chart */}
            <div style={budgetStyles.barChartGrid}>
              {dailyExpenses.map(day => {
                const heightPercent = Math.max(10, (day.spent / maxSpentInDay) * 100);
                const isDayOverLimit = day.spent > (budgetLimit / dailyExpenses.length);
                return (
                  <div key={day.date} style={budgetStyles.barWrapper} title={`Spent on ${day.date}: $${day.spent}`}>
                    <div style={budgetStyles.barTrack}>
                      <div 
                        style={{
                          ...budgetStyles.barFill,
                          height: `${heightPercent}%`,
                          backgroundColor: isDayOverLimit ? 'var(--error)' : 'var(--primary)'
                        }} 
                      />
                    </div>
                    {/* Day label (e.g. Jul 10) */}
                    <span style={budgetStyles.barLabel}>
                      {day.date.split('-')[1]}/{day.date.split('-')[2]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Threshold Legend Line */}
            <div style={budgetStyles.barChartLegend}>
              <div style={budgetStyles.barLegendItem}>
                <div style={{ ...budgetStyles.legendColorDot, backgroundColor: 'var(--primary)' }} />
                <span>Normal Day</span>
              </div>
              <div style={budgetStyles.barLegendItem}>
                <div style={{ ...budgetStyles.legendColorDot, backgroundColor: 'var(--error)' }} />
                <span>Threshold Exceeded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts for Overbudget Days */}
      <div className="card" style={{ marginTop: '28px', border: isOverLimit ? '1px solid var(--error)' : '1px solid var(--border)' }}>
        <div style={budgetStyles.alertHeader}>
          <AlertTriangle size={20} color={isOverLimit ? 'var(--error)' : 'var(--warning)'} />
          <h3 style={{ margin: 0 }}>Budget Limits and Overdraft Warnings</h3>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          {overbudgetDays.length === 0 ? (
            <div style={budgetStyles.noAlertsBox}>
              <Info size={16} color="var(--success)" />
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>
                All days are within the estimated target spending threshold! Great job keeping costs down.
              </span>
            </div>
          ) : (
            <div style={budgetStyles.alertsList}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                The following specific days exceed the average daily target of <strong>${Math.round(budgetLimit / dailyExpenses.length)}</strong>:
              </p>
              {overbudgetDays.map(item => (
                <div key={item.date} style={budgetStyles.alertItem}>
                  <div style={budgetStyles.alertItemLeft}>
                    <Calendar size={14} style={{ color: 'var(--error)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.date}</span>
                  </div>
                  <div style={budgetStyles.alertItemRight}>
                    <span style={budgetStyles.alertSpentSpan}>Spent: <strong>${item.spent}</strong></span>
                    <span style={budgetStyles.alertAllowedSpan}>Allowed Avg: ${item.allowed}</span>
                    <span className="badge badge-error" style={{ fontSize: '0.7rem' }}>
                      +${item.spent - item.allowed} Over
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const budgetStyles = {
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
  kpiCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  kpiLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    marginTop: '4px',
    marginBottom: '2px',
  },
  kpiSub: {
    fontSize: '0.75rem',
    color: 'var(--text-light)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    marginBottom: '8px',
  },
  donutContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 20,
    flexWrap: 'wrap',
    padding: '10px 0',
  },
  svgWrapper: {
    position: 'relative',
    width: '160px',
    height: '160px',
  },
  svgDonut: {
    transform: 'rotate(-90deg)',
  },
  donutCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flex: 1,
    minWidth: '220px',
  },
  legendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--bg-main)',
    paddingBottom: '6px',
  },
  legendLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  legendColorDot: {
    width: '10px',
    height: '10px',
    borderRadius: 'var(--radius-full)',
  },
  legendName: {
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  legendPercent: {
    fontSize: '0.7rem',
    color: 'var(--text-light)',
  },
  legendValue: {
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  barChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '220px',
    justifyContent: 'space-between',
  },
  barChartGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '160px',
    borderBottom: '2px solid var(--border)',
    paddingBottom: '8px',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '30px',
    gap: 8,
  },
  barTrack: {
    height: '120px',
    width: '12px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 'var(--radius-full)',
    transition: 'height 0.4s ease',
  },
  barLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-light)',
    fontWeight: 600,
  },
  barChartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginTop: '16px',
  },
  barLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
  },
  noAlertsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px',
    backgroundColor: 'var(--success-bg)',
    borderRadius: 'var(--radius-md)',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  alertItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: 8,
  },
  alertItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  alertItemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: '0.8rem',
  },
  alertSpentSpan: {
    color: 'var(--text-main)',
  },
  alertAllowedSpan: {
    color: 'var(--text-muted)',
  }
};
