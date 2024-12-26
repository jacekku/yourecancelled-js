// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6WOQujKGvX_xds3reZMLwdnjM3OJnaSA",
    authDomain: "you-re-cancelled-1029f.firebaseapp.com",
    projectId: "you-re-cancelled-1029f",
    storageBucket: "you-re-cancelled-1029f.firebasestorage.app",
    messagingSenderId: "1074100017135",
    appId: "1:1074100017135:web:0cd1a19fe179954217481a",
    measurementId: "G-28WV89YC81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Add Firebase products that you want to 



import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';

const auth = getAuth();
function createUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
}

function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            localStorage.setItem('user', user.accessToken)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

/**
 * 
 * @param {Event} event 
 */
export function signInButton({ target }) {
    const div = target.parentElement
    const emailValue = div.querySelector("input[name='email']").value
    const passwordValue = div.querySelector("input[name='password']").value
    return signIn(emailValue, passwordValue)
}

export function getUserToken() {
    return auth.currentUser
}