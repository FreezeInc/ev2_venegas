import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyABEDlWnaTW5IZXxlxaLgYm00hRr1sctcs",
  authDomain: "ev2venegas.firebaseapp.com",
  projectId: "ev2venegas",
  storageBucket: "ev2venegas.firebasestorage.app",
  messagingSenderId: "382505210238",
  appId: "1:382505210238:web:c02eb57efa36795a6f232f",
  measurementId: "G-RPR1YDWW5F"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
console.log("🔌 Firestore inicializado:", db); 