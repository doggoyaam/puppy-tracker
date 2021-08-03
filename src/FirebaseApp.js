import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

let firebaseApp;

if (!firebase.apps.length) {
    console.log("Initing firebase app");

    firebaseApp = firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJ_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_S_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MSEND_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
    });
} else {
    console.log("already inited firebase app");
    firebaseApp = firebase.app(); // if already initialized, use that one
}
export default firebaseApp;