// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4ZOaSkduTmMNmMQ-B1UtCDJtSK7JU9hA",
  authDomain: "fiestas-a5462.firebaseapp.com",
  databaseURL: "https://fiestas-a5462-default-rtdb.firebaseio.com",
  projectId: "fiestas-a5462",
  storageBucket: "fiestas-a5462.firebasestorage.app",
  messagingSenderId: "772543336072",
  appId: "1:772543336072:web:b88c7f08a89f1dd3dcd93d",
  measurementId: "G-317ZHZ47NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
