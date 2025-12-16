// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbT-rDKMEMf1ou8XbyO1-DypjKRP4nBbk",
  authDomain: "loyalcars12.firebaseapp.com",
  projectId: "loyalcars12",
  storageBucket: "loyalcars12.appspot.com",
  messagingSenderId: "821523965996",
  appId: "1:821523965996:web:86581611d2f8b820cc8989",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
