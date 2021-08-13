import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import firebaseApp from './FirebaseApp';
// no sign in provider exists for new user. Need to create when user first visits
import firebase from 'firebase/app';

const auth = firebaseApp.auth();


function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )

}
export default SignIn;