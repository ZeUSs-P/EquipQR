import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useBookings = (token, shouldFetch = true) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shouldFetch && token) {
      fetchBookings();
    }
  }, [shouldFetch, token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookings(token);
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await apiService.updateBookingStatus(bookingId, status, token);
      await fetchBookings(); // Refresh after update
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus
  };
};