import React, { createContext, useContext, useState } from 'react';

const BookingsContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
};

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: booking.id || `BK-${Date.now()}`,
      date: booking.date || booking.pickupDate || new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (bookingId, updates) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    );
  };

  const removeBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const clearBookings = () => {
    setBookings([]);
  };

  const value = {
    bookings,
    addBooking,
    updateBooking,
    removeBooking,
    clearBookings,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};

