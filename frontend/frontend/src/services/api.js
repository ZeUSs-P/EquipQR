

export const apiService = {
  // Items
  getItems: async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/items`);
    return res.json();
  },

 

  // Bookings
  getBookings: async (token) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  getBookingById: async (bookingId, token) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  createBooking: async (items, token) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });
    return res.json();
  },

  updateBookingStatus: async (bookingId, status, token) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Auth
  login: async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (name, email, password) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  getUserProfile: async (token) => {
    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};