// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAw_qrLTa1W6O0Aj_eNwfuluefq8ea4ZgM",
    authDomain: "caffeine-corner-4d5ce.firebaseapp.com",
    projectId: "caffeine-corner-4d5ce",
    storageBucket: "caffeine-corner-4d5ce.appspot.com",
    messagingSenderId: "57929980488",
    appId: "1:57929980488:web:e040465a8d65354918d67d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

// Registration function
document.getElementById('reg').addEventListener('click', (event) => {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showToast('Account created successfully!', 'success');

            // Clear input fields
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        })
        .catch((error) => {
            const errorMessage = error.message;
            showToast('Registration failed: ' + errorMessage, 'error');
            console.error('Error:', error.code, errorMessage);
        });
});

// Login function
const loginButton = document.getElementById('log');
const loadingOverlay = document.getElementById('loadingOverlay');

loginButton.addEventListener('click', () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    loadingOverlay.style.display = 'flex';

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            setTimeout(() => {
                showToast('Logged in successfully!', 'success');
                window.location.href = "index.html"; 
            }, 1000);
        })
        .catch((error) => {
            const errorMessage = error.message;
            showToast('Login failed: ' + errorMessage, 'error');
            console.error('Error:', error.code, errorMessage);

            loadingOverlay.style.display = 'none';
        });
});

// Optional: Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user);
    
    } else {
        console.log('No user is logged in.');
    }
});

//notification message
function showToast(message, type) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.innerText = message;

    toast.className = "toast";
    if (type === 'success') {
        toast.classList.add('show', 'toast-success');
    } else if (type === 'error') {
        toast.classList.add('show', 'toast-error');
    }

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}


