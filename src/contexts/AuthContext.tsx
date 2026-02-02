// Auth Context - Provides authentication state throughout the app
// Easily replaceable: just swap the authService import

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, SavedTrip } from '@/types/auth';
import { Itinerary, TripFormData } from '@/types/travel';

// Import localStorage services (swap these for Firebase/Supabase)
import localAuthService from '@/services/localStorage/authService';
import localTripStorageService from '@/services/localStorage/tripStorageService';

// Use these services (easy to swap)
const authService = localAuthService;
const tripStorageService = localTripStorageService;

interface AuthContextType extends AuthState {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveTrip: (itinerary: Itinerary, formData: TripFormData) => Promise<SavedTrip>;
  getMyTrips: () => Promise<SavedTrip[]>;
  deleteTrip: (tripId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Subscribe to auth changes
    const unsubscribe = authService.onAuthChange((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signIn(email);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTrip = useCallback(async (itinerary: Itinerary, formData: TripFormData): Promise<SavedTrip> => {
    if (!user) throw new Error('Must be logged in to save trips');
    
    return tripStorageService.saveTrip({
      userId: user.id,
      destination: itinerary.destination,
      totalDays: itinerary.totalDays,
      travelType: itinerary.travelType,
      budgetLevel: formData.budgetLevel,
      itinerary,
      formData,
    });
  }, [user]);

  const getMyTrips = useCallback(async (): Promise<SavedTrip[]> => {
    if (!user) return [];
    return tripStorageService.getTrips(user.id);
  }, [user]);

  const deleteTrip = useCallback(async (tripId: string) => {
    await tripStorageService.deleteTrip(tripId);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    saveTrip,
    getMyTrips,
    deleteTrip,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
