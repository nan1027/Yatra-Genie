import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Itinerary, TripFormData } from '@/types/travel';
import { SavedTrip, User } from '@/types/auth';
import localAuthService from '@/services/localStorage/authService';
import localTripStorageService from '@/services/localStorage/tripStorageService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  saveTrip: (itinerary: Itinerary, formData: TripFormData, favoritePlaceIds?: string[]) => Promise<void>;
  getMyTrips: () => Promise<SavedTrip[]>;
  deleteTrip: (tripId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = localAuthService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    const unsubscribe = localAuthService.onAuthChange((nextUser) => {
      setUser(nextUser);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string) => {
    const nextUser = await localAuthService.signIn(email);
    setUser(nextUser);
  };

  const signOut = async () => {
    await localAuthService.signOut();
    setUser(null);
  };

  const login = async (email: string, _password: string) => {
    await signIn(email);
  };

  const signup = async (email: string, _password: string) => {
    await signIn(email);
  };

  const googleLogin = async () => {
    await signIn('traveler.demo@yatragenie.local');
  };

  const saveTrip = async (itinerary: Itinerary, formData: TripFormData, favoritePlaceIds: string[] = []) => {
    if (!user) {
      throw new Error('Not authenticated');
    }

    await localTripStorageService.saveTrip({
      userId: user.id,
      destination: itinerary.destination,
      totalDays: itinerary.totalDays,
      travelType: itinerary.travelType,
      budgetLevel: formData.budgetLevel,
      itinerary,
      formData,
      favoritePlaceIds,
    });
  };

  const getMyTrips = async () => {
    if (!user) return [];
    return localTripStorageService.getTrips(user.id);
  };

  const deleteTrip = async (tripId: string) => {
    await localTripStorageService.deleteTrip(tripId);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      loading: isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
      login,
      signup,
      googleLogin,
      logout: signOut,
      saveTrip,
      getMyTrips,
      deleteTrip,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
