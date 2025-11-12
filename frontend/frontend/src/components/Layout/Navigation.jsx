import React from 'react';

export const Navigation = ({ activeView, onViewChange, isAdmin }) => {
  const isSportsView = ['sports-home', 'sport-items', 'cart', 'bookings'].includes(activeView);

  return (
    <nav className="nav-bar">
      <div className="nav-content">
        {/* Sports / Equipment Section */}
        <button
          onClick={() => onViewChange('sports-home')}
          className={`nav-button ${isSportsView ? 'active' : ''}`}
        >
          🏏 Browse Equipment
        </button>

        {/* Equipment Bookings */}
        <button
          onClick={() => onViewChange('bookings')}
          className={`nav-button ${activeView === 'bookings' ? 'active' : ''}`}
        >
          📋 My Bookings
        </button>

        {/* Admin Panel */}
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
