import React from 'react';

export const QRCodeDisplay = ({ qrCode, status }) => {
  const getLabel = () => {
    if (status === 'approved') return 'QR Code for pickup:';
    if (status === 'pending') return 'QR Code (Pending Approval):';
    return 'QR Code:';
  };

  return (
    <div className="qr-code-section">
      <p className="qr-label">{getLabel()}</p>
      <img src={qrCode} alt="QR Code" className="qr-code-image" />
    </div>
  );
};