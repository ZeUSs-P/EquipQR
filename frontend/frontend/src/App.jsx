import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { ItemsList } from './components/Items/ItemsList';
import { Cart } from './components/Cart/Cart';
import { BookingsList } from './components/Bookings/BookingsList';
import { AdminPanel } from './components/Admin/AdminPanel';
import { QRScanner } from './components/Admin/QRScanner';
import './App.css';

function App() {
  const { user, token, loading, login, register, logout } = useAuth();
  const [view, setView] = useState('login');
  const [cart, setCart] = useState([]);
  

  useEffect(() => {
    if (token && user && view === 'login') {
      setView('items');
    }
  }, [token, user]);

  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].item._id !== item._id) {
      if (!window.confirm('You already have another item in your cart. Replace it?')) {
        return;
      }
      setCart([{ item, quantity: 1 }]);
    } else if (cart.length === 0) {
      setCart([{ item, quantity: 1 }]);
    } else {
      alert('This item is already in your cart.');
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.item._id !== itemId));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!token) {
    return (
      <>
        <Toaster position="top-center" />
        {view === 'login' ? (
          <Login
            onLogin={login}
            onSwitchToRegister={() => setView('register')}
          />
        ) : (
          <Register
            onRegister={register}
            onSwitchToLogin={() => setView('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className="app-container">
      <Toaster position="top-center" />
      <Header user={user} onLogout={() => {
        logout();
        setView('login');
        setCart([]);
      }} />
      <Navigation
        activeView={view}
        onViewChange={setView}
        isAdmin={user?.isAdmin}
      />

      <main className="main-content">
        {view === 'items' && (
          <ItemsList
            cart={cart}
            onAddToCart={addToCart}
            onViewCart={() => setView('cart')}
          />
        )}

        {view === 'cart' && (
          <Cart
            cart={cart}
            onRemove={removeFromCart}
            onBack={() => setView('items')}
            token={token}
            onBookingCreated={() => {
              setCart([]);
              setView('bookings');
            }}
          />
        )}

        {view === 'bookings' && (
          <BookingsList userId={user._id} token={token} />
        )}

        {view === 'admin' && user?.isAdmin && (
          <AdminPanel
            token={token}
            onScanQR={() => setView('scan')}
          />
        )}

        {view === 'scan' && (
          <QRScanner
            token={token}
            onBack={() => setView('admin')}
          />
        )}
      </main>
    </div>
  );
}

export default App;