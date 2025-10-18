import React from 'react';

export const Navigation = ({ activeView, onViewChange, isAdmin }) => {
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <button
          onClick={() => onViewChange('sports-home')}
          className={`nav-button ${activeView === 'sports-home' || activeView === 'sport-items' ? 'active' : ''}`}
        >
          🏏 Browse Sports
        </button>
        <button
          onClick={() => onViewChange('bookings')}
          className={`nav-button ${activeView === 'bookings' ? 'active' : ''}`}
        >
          📋 My Bookings
        </button>
        {isAdmin && (
          <button
            onClick={() => onViewChange('admin')}
            className={`nav-button ${activeView === 'admin' || activeView === 'scan' ? 'active' : ''}`}
          >
            ⚙️ Admin Panel
          </button>
        )}
      </div>
    </nav>
  );
};