import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsiP1hn6vfF9fwbGuJydUbtPbFXwNb_RM",
  authDomain: "yatragenie-8aa6e.firebaseapp.com",
  projectId: "yatragenie-8aa6e",
  storageBucket: "yatragenie-8aa6e.firebasestorage.app",
  messagingSenderId: "1099411971962",
  appId: "1:1099411971962:web:cda3626ef819e9276300c3",
};

const app = initializeApp(firebaseConfig);

// 🔐 Authentication
export const auth = getAuth(app);

// 💾 Firestore Database
export const db = getFirestore(app);

export default app;
