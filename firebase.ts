// firebase.ts - Working solution for React Native
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFTrzoc2XDIwh_4Eg-6qt-Ss7fiRrzQgU",
  authDomain: "navigation-app-8c039.firebaseapp.com",
  projectId: "navigation-app-8c039",
  storageBucket: "navigation-app-8c039.firebasestorage.app",
  messagingSenderId: "800314790733",
  appId: "1:800314790733:web:2649a93bdfc9c7d1541d04",
  measurementId: "G-XPRZ1FDR1B"
};

// Initialize Firebase App (prevent multiple initializations)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase App initialized");
} else {
  app = getApp();
  console.log("✅ Using existing Firebase App");
}

// Initialize Auth - Simplified approach
const auth: Auth = getAuth(app);
console.log("✅ Firebase Auth initialized");

// Initialize Firestore
const db: Firestore = getFirestore(app);
console.log("✅ Firestore initialized");

export { auth, db, app };
export type { Auth, Firestore, FirebaseApp };