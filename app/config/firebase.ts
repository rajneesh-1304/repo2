import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUje9qx1Zr1zU5JWeu4MI6Z0G3RxGeIoo",
  authDomain: "authproject-1bfef.firebaseapp.com",
  projectId: "authproject-1bfef",
  storageBucket: "authproject-1bfef.firebasestorage.app",
  messagingSenderId: "503497356171",
  appId: "1:503497356171:web:5065f1aa4b4555150db58e",
  measurementId: "G-5404LX24MP"
};

const app = initializeApp(firebaseConfig);

// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;
