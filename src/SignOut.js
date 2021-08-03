import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebaseApp from './FirebaseApp';
const auth = firebaseApp.auth();

function SignOut() {
    // console.log(auth.user);
    if (auth.user) {
        return (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )

    }
    else {
        return null
    }
}

export default SignOut;