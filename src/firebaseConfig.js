import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, serverTimestamp, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC72KGZCyIey7nw3-Ld1_zWUgCqfmflSME",
  authDomain: "pillmate-fd180.firebaseapp.com",
  projectId: "pillmate-fd180",
  storageBucket: "pillmate-fd180.appspot.com", // Corrigé: ".app" ➜ ".com"
  messagingSenderId: "84925124192",
  appId: "1:84925124192:web:5891161c099004ebacfd05",
  databaseURL: "https://pillmate-fd180-default-rtdb.firebaseio.com/"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
const firestore = getFirestore(app); 
// Exports
export { app, auth, db, firestore, onValue, ref, serverTimestamp, set, storage };

