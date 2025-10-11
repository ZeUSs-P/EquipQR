import React, { useState, useEffect } from 'react';
import { AdminBookingCard } from './AdminBookingCard';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { apiService } from '../../services/api';

export const AdminPanel = ({ token, onScanQR }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await apiService.getBookings(token);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    await apiService.updateBookingStatus(bookingId, status, token);
    fetchBookings(); // Refresh list
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="page-title">Admin Panel - All Bookings</h2>

      <button onClick={onScanQR} className="btn-scan">
        📷 Scan QR
      </button>

      <div className="booking-list">
        {bookings.map(booking => (
          <AdminBookingCard
            key={booking._id}
            booking={booking}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
};