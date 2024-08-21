// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiPsLDV3fzQDhygykgSFgRkMsEK7bbBZk",
  authDomain: "jamvaly-app.firebaseapp.com",
  projectId: "jamvaly-app",
  storageBucket: "jamvaly-app.appspot.com",
  messagingSenderId: "561052623985",
  appId: "1:561052623985:web:57a9e47f7601d530c367d0",
  measurementId: "G-48JTDHCQGS",
  databaseURL: "https://jamvaly-app-default-rtdb.firebaseio.com" // Add this line
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { db, ref, push, auth, app };