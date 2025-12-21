///////////////////////////NAVBAR///////////////////////////
const hamburger   = document.querySelector('.hamburger');
const mobileMenu  = document.querySelector('.mobile-menu');
const navbar      = document.querySelector('nav.navbar');

const toggleMenu = () => {
    hamburger.classList.toggle('hamburger-active');
    mobileMenu.classList.toggle('active');
    navbar.classList.toggle('active');
};

hamburger.addEventListener('click', toggleMenu);

const mobileLinks = document.querySelectorAll('.mobile-menu-content a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('hamburger-active');
        mobileMenu.classList.remove('active');
    });
});
///////////////////////////NAVBAR///////////////////////////