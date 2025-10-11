import React from 'react';

export const Navigation = ({ activeView, onViewChange, isAdmin }) => {
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <button
          onClick={() => onViewChange('items')}
          className={`nav-button ${activeView === 'items' ? 'active' : ''}`}
        >
          Browse Items
        </button>
        <button
          onClick={() => onViewChange('bookings')}
          className={`nav-button ${activeView === 'bookings' ? 'active' : ''}`}
        >
          My Bookings
        </button>
        {isAdmin && (
          <button
            onClick={() => onViewChange('admin')}
            className={`nav-button ${activeView === 'admin' ? 'active' : ''}`}
          >
            Admin Panel
          </button>
        )}
      </div>
    </nav>
  );
};