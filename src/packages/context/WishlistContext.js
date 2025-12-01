import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [likedCars, setLikedCars] = useState(new Set());
  const [likedServices, setLikedServices] = useState(new Set());
  const [likedDiscover, setLikedDiscover] = useState(new Set());

  const toggleCarLike = (carId) => {
    setLikedCars(prev => {
      const newSet = new Set(prev);
      if (newSet.has(carId)) {
        newSet.delete(carId);
      } else {
        newSet.add(carId);
      }
      return newSet;
    });
  };

  const toggleServiceLike = (serviceId) => {
    setLikedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const toggleDiscoverLike = (discoverId) => {
    setLikedDiscover(prev => {
      const newSet = new Set(prev);
      if (newSet.has(discoverId)) {
        newSet.delete(discoverId);
      } else {
        newSet.add(discoverId);
      }
      return newSet;
    });
  };

  const value = {
    likedCars,
    likedServices,
    likedDiscover,
    toggleCarLike,
    toggleServiceLike,
    toggleDiscoverLike,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

