// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX92HO6pfyGQ7hz1HhBLnc5bj4qgFEnu4",
  authDomain: "skyrocketassignment.firebaseapp.com",
  projectId: "skyrocketassignment",
  storageBucket: "skyrocketassignment.firebasestorage.app",
  messagingSenderId: "273670660295",
  appId: "1:273670660295:web:29fbe6bf75d7efe2eedee2",
  measurementId: "G-TC1BGV0SGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics;
if (typeof window !== 'undefined') {
  // Only initialize analytics on the client side
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, auth, analytics };