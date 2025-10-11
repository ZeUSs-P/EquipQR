import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { BookingCard } from './BookingCard';
import { EmptyState } from '../Common/EmptyState';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { apiService } from '../../services/api';

export const BookingsList = ({ userId, token }) => {
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

  const userBookings = bookings.filter(b => b.user._id === userId);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="page-title">My Bookings</h2>

      {userBookings.length === 0 ? (
        <EmptyState icon={Calendar} message="No bookings yet" />
      ) : (
        <div className="booking-list">
          {userBookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};