import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

// AUTO-GENERATE 1-HOUR SLOTS (10 AM -> 8 PM)
const oneHourSlots = [];
for (let hour = 10; hour < 20; hour++) {
  const start = new Date();
  start.setHours(hour, 0, 0);

  const end = new Date();
  end.setHours(hour + 1, 0, 0);

  const format = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  oneHourSlots.push({
    startTime: format(start),
    endTime: format(end),
    label: `${format(start)} - ${format(end)}`
  });
}

export const TurfBookingForm = ({ turf, token, onBack, onSuccess }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const typeEmojis = {
    badminton: "🏸",
    tennis: "🎾",
    cricket: "🏏",
    football: "⚽",
    volleyball: "🏐",
  };

  // Min allowed date = tomorrow
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // 🔍 CHECK ONLY (no booking)
  const handleCheckAvailability = async () => {
    if (!date || !startTime || !endTime) {
      toast.error("Please select date and slot");
      return;
    }

    try {
      setChecking(true);

      const availability = await apiService.checkTurfAvailability(
        turf._id,
        date,
        startTime,
        endTime,
        token
      );

      if (availability.available) {
        toast.success("Slot is AVAILABLE! ✅");
      } else {
        toast.error("Slot is already booked ❌");
      }

    } catch (err) {
      toast.error("Error checking slot");
    } finally {
      setChecking(false);
    }
  };

  // BOOK slot
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error("Please select date and slot");
      return;
    }

    setLoading(true);

    try {
      const availability = await apiService.checkTurfAvailability(
        turf._id,
        date,
        startTime,
        endTime,
        token
      );

      if (!availability.available) {
        toast.error("Selected slot is already booked ❌");
        setLoading(false);
        return;
      }

      await apiService.bookTurf(
        turf._id,
        date,
        startTime,
        endTime,
        token
      );

      toast.success("Booking successful! ✅");
      onSuccess();

    } catch (err) {
      toast.error(err.message || "Booking failed");
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

        {/* DATE */}
        <div className="form-group">
          <label>
            <Calendar size={20} /> Select Date
          </label>

          <input
            type="date"
            className="form-input"
            min={getTomorrowDate()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>


        {/* 1-HOUR SLOTS */}
        <div className="form-group">
          <label>
            <Clock size={20} /> Select 1-Hour Slot
          </label>

          <div className="slot-grid">
            {oneHourSlots.map((slot, idx) => (
              <button
                key={idx}
                type="button"
                className={`slot-btn ${
                  startTime === slot.startTime ? "active" : ""
                }`}
                style={{
                  padding: "10px",          // smaller buttons
                  fontSize: "12px",        // smaller text
                }}
                onClick={() => {
                  setStartTime(slot.startTime);
                  setEndTime(slot.endTime);
                }}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>


        {/* SIDE-BY-SIDE BUTTONS */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem"
        }}>
          
          {/* CHECK AVAILABILITY */}
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={checking}
            className="btn-submit-booking"
            style={{
              background: "#667eea",
              flex: 1,
            }}
          >
            {checking ? "Checking..." : "Check Availability"}
          </button>

          {/* BOOK SLOT */}
          <button
            type="submit"
            disabled={loading}
            className="btn-submit-booking"
            style={{ flex: 1 }}
          >
            {loading ? "Booking..." : "Book Slot"}
          </button>

        </div>

      </form>
    </div>
  );
};
