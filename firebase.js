// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAymmVZ6KxiF7xDsISsGboncFaUp5vJcOA",
  authDomain: "ecotrack360-c011a.firebaseapp.com",
  projectId: "ecotrack360-c011a",
  storageBucket: "ecotrack360-c011a.firebasestorage.app",
  messagingSenderId: "825094354548",
  appId: "1:825094354548:web:8dbf5b85b44b1084a84321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };