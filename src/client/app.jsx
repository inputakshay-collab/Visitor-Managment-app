import React, { useState, useEffect } from 'react';
import VisitorDashboard from './components/VisitorDashboard.jsx';
import RoomBookingDashboard from './components/RoomBookingDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import './app.css';
import ThemeToggle from './components/ThemeToggle.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user information
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/now/table/sys_user?sysparm_query=user_name=' + window.g_user.userName + '&sysparm_limit=1', {
        headers: {
          'Accept': 'application/json',
          'X-UserToken': window.g_ck
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          setCurrentUser(data.result[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: '🏠', gradient: 'linear-gradient(135deg, #ff7b00 0%, #ff9a44 100%)' },
    { id: 'visitors', label: 'Visitor Hub', icon: '👥', gradient: 'linear-gradient(135deg, #ff944d 0%, #ffb56b 100%)' },
    { id: 'rooms', label: 'Room Booking', icon: '🏢', gradient: 'linear-gradient(135deg, #ff7b00 0%, #ffd280 100%)' },
    { id: 'admin', label: 'Control Center', icon: '⚙️', gradient: 'linear-gradient(135deg, #ffb56b 0%, #ff7b00 100%)' }
  ];

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>🚀 Initializing Visitor Management System...</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Preparing your premium experience
        </p>
      </div>
    );
  }

  // Use fixed name instead of extracting from user data
  const userName = "Akshay Thappar";
  const userInitial = "A";

  return (
    <div className="visitor-app">
      {/* Compact Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🏢 Visitor & Meeting Room Concierge</h1>
            <p>✨ Welcome back, {userName}! Ready to manage your facility with style?</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />
            <div className="user-info">
              <div className="user-profile">
                <span className="user-name">{userName}</span>
                <div className="user-avatar">
                  {userInitial}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Navigation */}
      <nav className="app-navigation">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 
                  `linear-gradient(135deg, rgba(255, 123, 0, 0.10) 0%, rgba(255, 154, 68, 0.10) 100%)` : 
                  'transparent'
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="app-content">
        <div className="content-wrapper">
          {activeTab === 'dashboard' && <VisitorDashboard currentUser={currentUser} />}
          {activeTab === 'visitors' && <VisitorDashboard currentUser={currentUser} />}
          {activeTab === 'rooms' && <RoomBookingDashboard currentUser={currentUser} />}
          {activeTab === 'admin' && <AdminDashboard currentUser={currentUser} />}
        </div>
      </main>
    </div>
  );
}