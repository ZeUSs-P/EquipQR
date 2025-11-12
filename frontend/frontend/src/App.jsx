import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { SportsHome } from './components/Items/SportsHome';
import { SportItemsList } from './components/Items/SportItemsList';
import { Cart } from './components/Cart/Cart';
import { BookingsList } from './components/Bookings/BookingsList';
import { AdminPanel } from './components/Admin/AdminPanel';
import { QRScanner } from './components/Admin/QRScanner';
import './App.css';

function App() {
  const { user, token, loading, login, register, logout } = useAuth();
  const [view, setView] = useState('login');
  const [cart, setCart] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);


    // 🟢 Auto-login for one-time admin QR access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quickToken = params.get('oneTimeAdmin');
    if (!quickToken) return;

    // Clean the URL (remove the token query)
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // Try validating the token
    (async () => {
      try {
        localStorage.setItem('token', quickToken);
        const res = await fetch('https://equip-qr-beryl.vercel.app/api/users/profile', {
          headers: { Authorization: `Bearer ${quickToken}` },
        });

        if (!res.ok) {
          localStorage.removeItem('token');
          return;
        }

        const userData = await res.json();
        if (userData.isAdmin) {
          localStorage.setItem('user', JSON.stringify(userData));
          window.location.reload(); // reload app as admin
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('One-time admin login failed:', err);
        localStorage.removeItem('token');
      }
    })();
  }, []);


  useEffect(() => {
    if (token && user && view === 'login') {
      setView('sports-home');
    }
  }, [token, user, view]);

  // Handle sport selection
  const handleSelectSport = (sport) => {
    setSelectedSport(sport);
    setView('sport-items');
  };

  // Handle back from sport items
  const handleBackFromSportItems = () => {
    setSelectedSport(null);
    setView('sports-home');
    setCart([]);
  };

  // Add/Remove from cart with sport lock
  const addToCart = (item, action = 'add') => {
    if (action === 'remove') {
      setCart(cart.filter(c => c.item._id !== item._id));
      return;
    }

    if (cart.length > 0 && cart[0].item.sport !== item.sport) {
      alert(`You already have items from ${cart[0].item.sport}. You can only book from one sport at a time.`);
      return;
    }

    if (cart.some(c => c.item._id === item._id)) {
      alert('This item is already in your cart.');
      return;
    }

    setCart([...cart, { item, quantity: 1 }]);
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
      <Header
        user={user}
        onLogout={() => {
          logout();
          setView('login');
          setCart([]);
          setSelectedSport(null);
        }}
      />
      <Navigation
        activeView={view}
        onViewChange={setView}
        isAdmin={user?.isAdmin}
      />

      <main className="main-content">
        {/* Equipment Booking Views */}
        {view === 'sports-home' && (
          <SportsHome onSelectSport={handleSelectSport} />
        )}

        {view === 'sport-items' && selectedSport && (
          <SportItemsList
            sport={selectedSport}
            cart={cart}
            onAddToCart={addToCart}
            onBack={handleBackFromSportItems}
            onViewCart={() => setView('cart')}
          />
        )}

        {view === 'cart' && (
          <Cart
            cart={cart}
            onRemove={removeFromCart}
            onBack={() => setView('sport-items')}
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

        {/* Admin Views */}
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
