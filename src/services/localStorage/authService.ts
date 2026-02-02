// LocalStorage Auth Service
// This is a demo implementation - replace with Firebase/Auth0/Supabase
// The interface remains the same, only the implementation changes

import { User, AuthService } from '@/types/auth';

const STORAGE_KEY = 'india_travel_auth';
const USERS_KEY = 'india_travel_users';

// Generate a simple unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Event system for auth state changes
type AuthCallback = (user: User | null) => void;
const authCallbacks: Set<AuthCallback> = new Set();

const notifyAuthChange = (user: User | null) => {
  authCallbacks.forEach(callback => callback(user));
};

// Get all users from storage
const getUsers = (): Record<string, User> => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Save users to storage
const saveUsers = (users: Record<string, User>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// LocalStorage implementation of AuthService
export const localAuthService: AuthService = {
  /**
   * Sign in with email (no password for demo)
   * In production: Replace with Firebase signInWithEmailLink or similar
   */
  signIn: async (email: string): Promise<User> => {
    const normalizedEmail = email.toLowerCase().trim();
    const users = getUsers();
    
    // Check if user exists
    let user = Object.values(users).find(u => u.email === normalizedEmail);
    
    if (!user) {
      // Create new user
      user = {
        id: generateId(),
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
      };
      users[user.id] = user;
      saveUsers(users);
    }
    
    // Save current session
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    notifyAuthChange(user);
    
    return user;
  },

  /**
   * Sign out current user
   * In production: Replace with Firebase signOut
   */
  signOut: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
    notifyAuthChange(null);
  },

  /**
   * Get current authenticated user
   * In production: Replace with Firebase currentUser
   */
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Subscribe to auth state changes
   * In production: Replace with Firebase onAuthStateChanged
   */
  onAuthChange: (callback: AuthCallback): (() => void) => {
    authCallbacks.add(callback);
    // Return unsubscribe function
    return () => authCallbacks.delete(callback);
  },
};

export default localAuthService;
