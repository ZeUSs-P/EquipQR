import React from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminBookingCard = ({ booking, onStatusUpdate }) => {
  const handleStatusUpdate = async (status) => {
    try {
      await onStatusUpdate(booking._id, status);
      toast.success(`Booking ${status} successfully!`);
    } catch (err) {
      toast.error('Error updating booking');
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <div className="booking-user">
          <h3>{booking.user.name}</h3>
          <p className="booking-email">{booking.user.email}</p>
        </div>
        <div className="booking-meta">
          <span className={`status-badge ${booking.status}`}>
            {booking.status}
          </span>
          <p className="booking-date">
            {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="booking-items">
        {booking.items.map((item, idx) => (
          <div key={idx} className="booking-item-row">
            <span className="booking-item-name">{item.item.name}</span>
            <span className="booking-item-qty">Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="booking-actions">
        {booking.status === 'pending' && (
          <>
            <button
              onClick={() => handleStatusUpdate('approved')}
              className="btn-approve"
            >
              <CheckCircle size={18} />
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="btn-reject"
            >
              <XCircle size={18} />
              Reject
            </button>
          </>
        )}
        {booking.status === 'approved' && (
          <button
            onClick={() => handleStatusUpdate('returned')}
            className="btn-return"
          >
            <RotateCcw size={18} />
            Mark as Returned
          </button>
        )}
      </div>

      {booking.qrCode && (
        <div className="qr-code-section">
          <p className="qr-label">QR Code:</p>
          <img src={booking.qrCode} alt="QR Code" className="qr-code-image" />
        </div>
      )}
    </div>
  );
};