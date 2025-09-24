import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLtde8OBZRyq_gE_Wyi2RwqBycYYgXHLU",
  authDomain: "aptos-globe-pay.firebaseapp.com",
  projectId: "aptos-globe-pay",
  storageBucket: "aptos-globe-pay.firebasestorage.app",
  messagingSenderId: "343152671948",
  appId: "1:343152671948:web:2f9589c39c2243fcecd669",
  measurementId: "G-EHGM4HCPX0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Firestore and get a reference to the service
export const firestore = getFirestore(app);

// Debug logging
console.log("🔥 Firebase initialized with config:", {
  projectId: firebaseConfig.projectId,
  hasDatabase: !!database,
  hasFirestore: !!firestore,
  firestoreURL: `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`,
});

export default app;
