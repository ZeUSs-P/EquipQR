import React from 'react';
import { Package, User, LogOut } from 'lucide-react';

export const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="brand-icon">
            <Package size={28} />
          </div>
          <h1 className="brand-title">EquipQR</h1>
        </div>

        
        
        <div className="header-actions">
          <div className="user-info">
            <User size={20} />
            <span>{user?.name}</span>
            {user?.isAdmin && <span className="admin-badge">Admin</span>}
          </div>
          <button onClick={onLogout} className="btn-logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};