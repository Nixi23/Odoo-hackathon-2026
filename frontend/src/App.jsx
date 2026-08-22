// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import TripForm from './pages/TripForm';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import BudgetBreakdown from './pages/BudgetBreakdown';
import ProfileSettings from './pages/ProfileSettings';
import AdminDashboard from './pages/AdminDashboard';
import PublicItinerary from './pages/PublicItinerary';
import Community from './pages/Community';
import CalendarView from './pages/CalendarView';
import PreplannedTrips from './pages/PreplannedTrips';
import PreviousTrips from './pages/PreviousTrips';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Shared Itinerary View (Unauthenticated) */}
        <Route path="/share/:tripId" element={<PublicItinerary />} />

        {/* Authentication Router */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes wrapped in layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/trips" element={<Layout><MyTrips /></Layout>} />
        <Route path="/trips/create" element={<Layout><TripForm /></Layout>} />
        <Route path="/trips/edit/:id" element={<Layout><TripForm /></Layout>} />
        <Route path="/itinerary/build/:tripId" element={<Layout><ItineraryBuilder /></Layout>} />
        <Route path="/itinerary/view/:tripId" element={<Layout><ItineraryView /></Layout>} />
        <Route path="/cities" element={<Layout><CitySearch /></Layout>} />
        <Route path="/budget/:tripId" element={<Layout><BudgetBreakdown /></Layout>} />
        <Route path="/profile" element={<Layout><ProfileSettings /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarView /></Layout>} />
        <Route path="/preplanned" element={<Layout><PreplannedTrips /></Layout>} />
        <Route path="/previous" element={<Layout><PreviousTrips /></Layout>} />

        {/* Wildcard Fallback */}
        <Route path="*" element={<Layout><Dashboard /></Layout>} />
      </Routes>
    </Router>
  );
}

