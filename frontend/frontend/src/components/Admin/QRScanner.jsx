import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ScanModal } from './ScanModal';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

export const QRScanner = ({ token, onBack }) => {
  const [scannedBooking, setScannedBooking] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async (result) => {
    if (!result || !isScanning) return;

    let bookingId;
    try {
      const text = result[0]?.rawValue || result?.text || result;
      console.log('Scanned text:', text);

      const parsed = JSON.parse(text);
      bookingId = parsed.bookingId;
    } catch (err) {
      console.error('QR Parse Error:', err);
      toast.error('Invalid QR code format');
      return;
    }

    if (!bookingId) {
      toast.error('Invalid QR code - no booking ID found');
      return;
    }

    setIsScanning(false);

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setScannedBooking(data);
        setShowModal(true);
        toast.success('Booking scanned successfully!');
      } else {
        toast.error(data.message || 'Booking not found');
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Error fetching booking details');
      setIsScanning(true);
    }
  };

  const handleApprove = async () => {
    if (!scannedBooking) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${scannedBooking._id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'approved' }),
        }
      );

      if (res.ok) {
        toast.success('Booking approved successfully!');
        closeModal();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error approving booking');
      }
    } catch (err) {
      console.error('Approve Error:', err);
      toast.error('Error approving booking');
    }
  };

  const handleReject = async () => {
    if (!scannedBooking) return;

    if (!window.confirm('Are you sure you want to reject this booking? Stock will be restored.')) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${scannedBooking._id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'rejected' }),
        }
      );

      if (res.ok) {
        toast.success('Booking rejected. Stock restored.');
        closeModal();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error rejecting booking');
      }
    } catch (err) {
      console.error('Reject Error:', err);
      toast.error('Error rejecting booking');
    }
  };

  const handleReturn = async () => {
    if (!scannedBooking) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${scannedBooking._id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'returned' }),
        }
      );

      if (res.ok) {
        toast.success('Booking marked as returned! Stock restored.');
        closeModal();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Error updating booking');
      }
    } catch (err) {
      console.error('Update Error:', err);
      toast.error('Error updating booking');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setScannedBooking(null);
    setIsScanning(true);
  };

  return (
    <div className="scanner-container">
      <h2 className="page-title">📷 Scan Booking QR Code</h2>

      <div className="scanner-wrapper-fullscreen">
        <Scanner
          onScan={handleScan}
          onError={(err) => {
            console.error('Scanner Error:', err);
            toast.error('Scanner error - check camera permissions');
          }}
          constraints={{ facingMode: 'environment' }}
          styles={{
            container: {
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden'
            }
          }}
        />
        <div className="scanner-instructions">
          📱 Position the QR code within the frame to scan
        </div>
      </div>

      {showModal && scannedBooking && (
        <ScanModal
          booking={scannedBooking}
          onClose={closeModal}
          onApprove={handleApprove}
          onReject={handleReject}
          onReturn={handleReturn}
        />
      )}

      <button
        onClick={onBack}
        className="btn-back"
        style={{ marginTop: '2rem', width: '100%' }}
      >
        ← Back to Admin Panel
      </button>
    </div>
  );
};