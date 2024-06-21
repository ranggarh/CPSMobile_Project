import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/database';
import "firebase/compat/storage";
import "firebase/compat/firestore";
// import "firebase/compat/database";
// import "firebase/compat/storage";

firebase.initializeApp({
    apiKey: "AIzaSyCRqT00xi0eVqoLSEykhbDsA5WRnj23PWM",
    authDomain: "cpsmobile-a526d.firebaseapp.com",
    projectId: "cpsmobile-a526d",
    storageBucket: "cpsmobile-a526d.appspot.com",
    messagingSenderId: "212219934287",
    appId: "1:212219934287:web:70acd2d1504e53a7639c3a"
});

const FIREBASE = firebase;

export default FIREBASE;