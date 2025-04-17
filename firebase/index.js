// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC72KGZCyIey7nw3-Ld1_zWUgCqfmflSME",
  authDomain: "pillmate-fd180.firebaseapp.com",
  projectId: "pillmate-fd180",
  storageBucket: "pillmate-fd180.firebasestorage.app",
  messagingSenderId: "84925124192",
  appId: "1:84925124192:web:5891161c099004ebacfd05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

