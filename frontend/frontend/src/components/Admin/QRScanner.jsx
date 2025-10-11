import React, { useState, useRef, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ScanModal } from './ScanModal';
import toast from 'react-hot-toast';

export const QRScanner = ({ token, onBack }) => {
  const [scannedBooking, setScannedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Keep track of last scanned QR to prevent duplicate scans
  const lastScannedRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  const handleScan = async (result) => {
    // Prevent scanning while processing or if no result
    if (!result || isProcessing) return;

    let bookingId;
    let scannedText;
    
    try {
      scannedText = result[0]?.rawValue || result?.text || result;
      console.log('Scanned text:', scannedText);

      // Prevent rapid duplicate scans (within 1 second only)
      // This prevents accidental double-scans but allows re-scanning after modal closes
      if (lastScannedRef.current === scannedText) {
        console.log('Rapid duplicate scan prevented (wait 1 second)');
        return;
      }

      const parsed = JSON.parse(scannedText);
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

    // Mark as processing and store last scanned QR
    setIsProcessing(true);
    lastScannedRef.current = scannedText;

    // Clear the last scanned reference after only 1 second
    // This allows the same QR to be scanned again for returns
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    scanTimeoutRef.current = setTimeout(() => {
      lastScannedRef.current = null;
    }, 1000);

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        // Handle both response formats (nested or direct)
        const bookingData = data.booking || data;
        setScannedBooking(bookingData);
        setShowModal(true);
        toast.success('Booking scanned successfully!');
      } else {
        toast.error(data.message || 'Booking not found');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Error fetching booking details');
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!scannedBooking) return;

    try {
      const bookingId = scannedBooking._id || scannedBooking.id;
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
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
        toast.success('✅ Booking approved successfully!');
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
      const bookingId = scannedBooking._id || scannedBooking.id;
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
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
        toast.success('❌ Booking rejected. Stock restored.');
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
      const bookingId = scannedBooking._id || scannedBooking.id;
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
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
        toast.success('📦 Booking marked as returned! Stock restored.');
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
    setIsProcessing(false);
    // Reset immediately so next QR can be scanned
    lastScannedRef.current = null;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

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
          {isProcessing ? (
            <span>⏳ Processing scan...</span>
          ) : (
            <span>📱 Position the QR code within the frame to scan</span>
          )}
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