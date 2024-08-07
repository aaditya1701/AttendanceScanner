import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDYkMtLxcGQeL2r_KMSxudDf9YvYZfB-Pg",
    authDomain: "bad-talks.firebaseapp.com",
    projectId: "bad-talks",
    storageBucket: "bad-talks.appspot.com",
    messagingSenderId: "676174438926",
    appId: "1:676174438926:web:f827c1123612bcbb97125f",
    measurementId: "G-BLWVQXQW4B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

