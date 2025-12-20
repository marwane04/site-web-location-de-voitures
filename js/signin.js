import {loginUser} from './authenticationService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const user = loginUser(email, password);
            window.location.href = 'index.html';
        } catch (error) {
            alert(error.message);
        }
    });

});

