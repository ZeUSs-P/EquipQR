import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

const timeSlots = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  '09:00 PM', '10:00 PM'
];

export const TurfBookingForm = ({ turf, token, onBack, onSuccess }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const typeEmojis = {
    badminton: '🏸',
    tennis: '🎾',
    cricket: '🏏',
    football: '⚽',
    volleyball: '🏐'
  };

  // Get tomorrow's date as minimum
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error('Please fill all fields');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);

    try {
      // Check availability first
      const availability = await apiService.checkTurfAvailability(
        turf._id,
        date,
        startTime,
        endTime,
        token
      );

      if (!availability.available) {
        toast.error(availability.message);
        setLoading(false);
        return;
      }

      // Book the turf
      await apiService.bookTurf(turf._id, date, startTime, endTime, token);
      toast.success('Booking successful! ✅');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="turf-booking-form-container">
      <div className="turf-booking-header">
        <button onClick={onBack} className="btn-back-turf">
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h2>{typeEmojis[turf.type]} {turf.name}</h2>
          <p>Book your time slot</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="turf-booking-form">
        <div className="form-group">
          <label>
            <Calendar size={20} />
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getTomorrowDate()}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>
            <Clock size={20} />
            Start Time
          </label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select start time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <Clock size={20} />
            End Time
          </label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select end time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-submit-booking"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>

      {turf.bookings.length > 0 && (
        <div className="existing-bookings">
          <h3>Existing Bookings</h3>
          <div className="bookings-list">
            {turf.bookings.map((booking, idx) => (
              <div key={idx} className="booking-item">
                <span>{booking.date}</span>
                <span>{booking.startTime} - {booking.endTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};