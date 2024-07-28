// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDR9k-J1zMV8B9EjMKfrB6tBpYqJbrhC8o",
    authDomain: "badtalks-3ecf3.firebaseapp.com",
    projectId: "badtalks-3ecf3",
    storageBucket: "badtalks-3ecf3.appspot.com",
    messagingSenderId: "104082686480",
    appId: "1:104082686480:web:e25703b49e8a0c53654095"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
