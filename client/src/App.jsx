import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Browse from './pages/Browse.jsx';
import PublicBrowse from './pages/PublicBrowse.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import CreateItem from './pages/CreateItem.jsx';
import BorrowRequests from './pages/BorrowRequests.jsx';
import InspectionReports from './pages/InspectionReports.jsx';
import Messages from './pages/Messages.jsx';
import Profile from './pages/Profile.jsx';
import Navigation from './components/Navigation.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Loading...</div>;
  }

  return (
    <Router>
      {token && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={token ? <Home /> : <Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/public-browse" element={<PublicBrowse />} />

        {/* Protected Routes - Require Authentication */}
        <Route path="/browse" element={token ? <Browse /> : <Navigate to="/login" />} />
        <Route path="/item/:id" element={token ? <ItemDetail /> : <Navigate to="/login" />} />
        <Route path="/create-item" element={token ? <CreateItem /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/borrow-requests" element={token ? <BorrowRequests /> : <Navigate to="/login" />} />
        <Route path="/messages" element={token ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/inspections" element={token ? <InspectionReports /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
