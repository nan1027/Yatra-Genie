// LocalStorage Trip Storage Service
// This is a demo implementation - replace with Firebase/Supabase
// The interface remains the same, only the implementation changes

import { SavedTrip, TripStorageService } from '@/types/auth';

const TRIPS_KEY = 'india_travel_trips';

// Generate a simple unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Get all trips from storage
const getAllTrips = (): SavedTrip[] => {
  try {
    const data = localStorage.getItem(TRIPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save all trips to storage
const saveAllTrips = (trips: SavedTrip[]) => {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
};

// LocalStorage implementation of TripStorageService
export const localTripStorageService: TripStorageService = {
  /**
   * Save a new trip
   * In production: Replace with Firestore addDoc or Supabase insert
   */
  saveTrip: async (tripData): Promise<SavedTrip> => {
    const trips = getAllTrips();
    
    const newTrip: SavedTrip = {
      ...tripData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    trips.push(newTrip);
    saveAllTrips(trips);
    
    return newTrip;
  },

  /**
   * Get all trips for a user
   * In production: Replace with Firestore query or Supabase select
   */
  getTrips: async (userId: string): Promise<SavedTrip[]> => {
    const trips = getAllTrips();
    return trips
      .filter(trip => trip.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Get a single trip by ID
   * In production: Replace with Firestore getDoc or Supabase select
   */
  getTrip: async (tripId: string): Promise<SavedTrip | null> => {
    const trips = getAllTrips();
    return trips.find(trip => trip.id === tripId) || null;
  },

  /**
   * Delete a trip
   * In production: Replace with Firestore deleteDoc or Supabase delete
   */
  deleteTrip: async (tripId: string): Promise<void> => {
    const trips = getAllTrips();
    const filtered = trips.filter(trip => trip.id !== tripId);
    saveAllTrips(filtered);
  },
};

export default localTripStorageService;
