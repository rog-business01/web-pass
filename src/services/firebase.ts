// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOV8c9cJ7-qp_lNzFXpjb1uTPAlXoUf_Y",
  authDomain: "my-password-manger.firebaseapp.com",
  projectId: "my-password-manger",
  storageBucket: "my-password-manger.firebasestorage.app",
  messagingSenderId: "52879420888",
  appId: "1:52879420888:web:918ed17bb379da9e1d56ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User };