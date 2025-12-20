import { registerUser } from './authenticationService.js';

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }


    const user = {
        firstName,
        lastName,
        phone,
        city,
        email,
        password
    };

    try {
        registerUser(user);
        window.location.href = "signin.html";
    } catch (error) {
        alert(error.message);
    }
    console.log(user);
});

