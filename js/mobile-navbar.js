    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    const toggleMenu = () => {
        hamburger.classList.toggle('hamburger-active');
        mobileMenu.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    const mobileLinks = document.querySelectorAll('.mobile-menu-content a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('hamburger-active');
            mobileMenu.classList.remove('active');
        });
    });