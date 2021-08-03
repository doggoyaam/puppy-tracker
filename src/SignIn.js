import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebaseApp from './FirebaseApp';
const auth = firebaseApp.auth();


function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebaseApp.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )

}
export default SignIn;