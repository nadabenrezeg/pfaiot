import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC72KGZCyIey7nw3-Ld1_zWUgCqfmflSME",
  authDomain: "pillmate-fd180.firebaseapp.com",
  projectId: "pillmate-fd180",
  storageBucket: "pillmate-fd180.firebasestorage.app",
  messagingSenderId: "84925124192",
  appId: "1:84925124192:web:5891161c099004ebacfd05"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }; // Exportez les objets pour les utiliser dans d'autres fichiers
