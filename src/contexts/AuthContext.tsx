import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { Itinerary, TripFormData } from "@/types/travel";

interface SavedTrip {
  id: string;
  userId: string;
  itinerary: Itinerary;
  formData: TripFormData;
  createdAt: Timestamp;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  saveTrip: (itinerary: Itinerary, formData: TripFormData) => Promise<void>;
  getMyTrips: () => Promise<SavedTrip[]>;
  deleteTrip: (tripId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🔑 Email login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🆕 Email signup
  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // 🔵 Google login
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
  };

  // 💾 Save trip to Firestore
  const saveTrip = async (itinerary: Itinerary, formData: TripFormData) => {
    if (!user) throw new Error("Not authenticated");

    await addDoc(collection(db, "trips"), {
      userId: user.uid,
      itinerary,
      formData,
      createdAt: Timestamp.now(),
    });
  };

  // 📂 Get user trips
  const getMyTrips = async (): Promise<SavedTrip[]> => {
    if (!user) return [];

    const q = query(collection(db, "trips"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SavedTrip, "id">),
    }));
  };

  // 🗑️ Delete trip
  const deleteTrip = async (tripId: string) => {
    await deleteDoc(doc(db, "trips", tripId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        googleLogin,
        logout,
        saveTrip,
        getMyTrips,
        deleteTrip,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
