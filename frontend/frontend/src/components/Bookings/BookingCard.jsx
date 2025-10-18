import React from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';

export const BookingCard = ({ booking }) => {
  return (
    <div className="booking-card">
      <div className="booking-header">
        <div>
          <span className={`status-badge ${booking.status}`}>
            {booking.status}
          </span>
        </div>
        <div className="booking-meta">
          <div className="booking-date">
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="booking-items">
        {booking.items.map((item, idx) => (
          <div key={idx} className="booking-item-row">
            <span className="booking-item-name">{item.item?.name}</span>
            <span className="booking-item-qty">Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      {booking.qrCode && (
        <QRCodeDisplay qrCode={booking.qrCode} status={booking.status} />
      )}
    </div>
  );
};