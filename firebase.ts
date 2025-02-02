import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaxBL100nipcIvFt2jvkBMGvfbdTtzgYk",
  authDomain: "to-do-list-e92b4.firebaseapp.com",
  projectId: "to-do-list-e92b4",
  storageBucket: "to-do-list-e92b4.firebasestorage.app",
  messagingSenderId: "762159741490",
  appId: "1:762159741490:web:97684f4a681158991b9a2b",
  measurementId: "G-EXCPPS3DDD"
};


const firebaseApp = initializeApp(firebaseConfig);


export { firebaseApp, getAuth, getFirestore };