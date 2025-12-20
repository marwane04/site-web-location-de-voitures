import { logoutUser } from './authenticationService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUserId = sessionStorage.getItem("loggedInUser");

    const loginBtns = document.querySelectorAll('.login');
    const signupBtns = document.querySelectorAll('.signup');
    const logoutBtns = document.querySelectorAll('.logout');

    if (loggedInUserId) {
        // User is logged in
        loginBtns.forEach(btn => btn.style.display = 'none');
        signupBtns.forEach(btn => btn.style.display = 'none');
        logoutBtns.forEach(btn => btn.style.display = 'inline-block');
    } else {
        // User is not logged in
        loginBtns.forEach(btn => btn.style.display = 'inline-block');
        signupBtns.forEach(btn => btn.style.display = 'inline-block');
        logoutBtns.forEach(btn => btn.style.display = 'none');
    }

    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
            window.location.href = 'signin.html';
        });
    });
});

