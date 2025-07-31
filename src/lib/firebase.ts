import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZONUrbNOPbn5CQFj4SFP93sRofnEXZ_Y",
  authDomain: "flex-tracker-ae34b.firebaseapp.com",
  projectId: "flex-tracker-ae34b",
  storageBucket: "flex-tracker-ae34b.firebasestorage.app",
  messagingSenderId: "278793813144",
  appId: "1:278793813144:web:9c2c6ca95a7e03c00224ed",
  measurementId: "G-S3RXNJVXMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;