// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNgoBwTq7yiJ1m1Fx-b40ZOkBvrlqn3Kc",
    authDomain: "task-management-10.firebaseapp.com",
    projectId: "task-management-10",
    storageBucket: "task-management-10.appspot.com",
    messagingSenderId: "969716189182",
    appId: "1:969716189182:web:d3ccfb0df600f8dbc922af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;