import * as firebaseApp from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpoctqCQrIqBDQVKYDBaF53SsgUJ9-j5c",
  authDomain: "gen-lang-client-0676964438.firebaseapp.com",
  projectId: "gen-lang-client-0676964438",
  storageBucket: "gen-lang-client-0676964438.firebasestorage.app",
  messagingSenderId: "845701480303",
  appId: "1:845701480303:web:e05544ce8ee2b44e0a329a",
  measurementId: "G-GVQGYVL16N"
};

const app = firebaseApp.initializeApp(firebaseConfig);
export const db = getFirestore(app);