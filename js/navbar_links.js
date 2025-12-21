document.addEventListener('DOMContentLoaded', function() {
    const allLinks = document.querySelectorAll('.container_nav .navbar .links a, .mobile-menu-content a');

    // Set active link and sync desktop/mobile
    function setActive(link) {
        allLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const href = link.getAttribute('href');
        const matching = document.querySelectorAll(`.container_nav .navbar .links a[href="${href}"], .mobile-menu-content a[href="${href}"]`);
        matching.forEach(l => l.classList.add('active'));
    }

    // Handle link click
    allLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) {
                    setActive(link);
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, href);
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu) mobileMenu.classList.remove('active');
                }
            } else {
                setActive(link);
            }
        });
    });

    // Initialize active link based on URL
    const currentURL = window.location.pathname + window.location.hash;
    const initLink = Array.from(allLinks).find(link => {
        const url = new URL(link.href, window.location.origin);
        return url.pathname + url.hash === currentURL;
    });
    if (initLink) setActive(initLink);

    if (!document.querySelector('.container_nav .navbar .links a.active')) {
        const defaultLink = document.querySelector('.container_nav .navbar .links a[href="#top-cars"], .mobile-menu-content a[href="#top-cars"]');
        if (defaultLink) setActive(defaultLink);
    }

    // Scroll spy
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;
            sections.forEach(sec => {
                if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.clientHeight) {
                    const link = document.querySelector(`.container_nav .navbar .links a[href="#${sec.id}"], .mobile-menu-content a[href="#${sec.id}"]`);
                    if (link) setActive(link);
                }
            });
        }, 100);
    });

    // Handle hash changes (back/forward)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash) {
            const link = document.querySelector(`.container_nav .navbar .links a[href="${hash}"], .mobile-menu-content a[href="${hash}"]`);
            if (link) setActive(link);
        }
    });
});
