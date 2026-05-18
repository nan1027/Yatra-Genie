// Auth types - easily replaceable with Firebase/Auth0/Supabase
// This abstraction allows switching auth providers without changing components

export interface User {
  id: string;
  email: string;
  createdAt: string;
  displayName?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SavedTrip {
  id: string;
  userId: string;
  destination: string;
  totalDays: number;
  travelType: string;
  budgetLevel: string;
  createdAt: string;
  itinerary: import('./travel').Itinerary;
  formData: import('./travel').TripFormData;
  favoritePlaceIds?: string[];
}

// Auth service interface - implement this for different providers
export interface AuthService {
  signIn: (email: string) => Promise<User>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthChange: (callback: (user: User | null) => void) => () => void;
}

// Storage service interface - implement for Firebase/Supabase
export interface TripStorageService {
  saveTrip: (trip: Omit<SavedTrip, 'id' | 'createdAt'>) => Promise<SavedTrip>;
  getTrips: (userId: string) => Promise<SavedTrip[]>;
  getTrip: (tripId: string) => Promise<SavedTrip | null>;
  updateTrip: (tripId: string, updates: Partial<Omit<SavedTrip, 'id' | 'createdAt' | 'userId'>>) => Promise<SavedTrip | null>;
  deleteTrip: (tripId: string) => Promise<void>;
}
