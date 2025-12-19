document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links from both desktop and mobile menus
    const desktopLinks = document.querySelectorAll('.container_nav .navbar .links a');
    const mobileLinks = document.querySelectorAll('.mobile-menu-content a');
    const allNavLinks = [...desktopLinks, ...mobileLinks];
    
    // Remove the signup link from mobile links array since it shouldn't have underline
    const mobileNavLinks = [...mobileLinks].filter(link => 
        !link.classList.contains('signup') && 
        !link.parentElement.classList.contains('mobile-btns')
    );
    
    // Function to set active link
    function setActiveLink(clickedLink) {

        // First, remove 'active' class from all navigation links
        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add 'active' class to the clicked link
        clickedLink.classList.add('active');
        
        // If a mobile link is clicked, also activate the corresponding desktop link
        if (clickedLink.closest('.mobile-menu-content')) {
            document.querySelector(".navbar").classList.toggle("active")
            const href = clickedLink.getAttribute('href');
            const correspondingDesktopLink = document.querySelector(`.container_nav .navbar .links a[href="${href}"]`);
            if (correspondingDesktopLink) {
                correspondingDesktopLink.classList.add('active');
            }
        }
        
        // If a desktop link is clicked, also activate the corresponding mobile link
        if (clickedLink.closest('.navbar .links')) {
            const href = clickedLink.getAttribute('href');
            const correspondingMobileLink = document.querySelector(`.mobile-menu-content a[href="${href}"]`);
            if (correspondingMobileLink) {
                correspondingMobileLink.classList.add('active');
            }
        }
    }
    
    // Add click event listeners to desktop navigation links
    desktopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle if it's a hash link (navigation within the page)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Set active link
                    setActiveLink(this);
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL hash without page jump
                    history.pushState(null, null, `#${targetId}`);
                }
            } else {
                // For external links, just set active class
                setActiveLink(this);
            }
        });
    });
    
    // Add click event listeners to mobile navigation links (excluding signup)
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle if it's a hash link (navigation within the page)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Set active link
                    setActiveLink(this);
                    
                    // Close mobile menu if it's open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL hash without page jump
                    history.pushState(null, null, `#${targetId}`);
                }
            } else {
                // For external links, just set active class
                setActiveLink(this);
            }
        });
    });
    
    // Handle initial page load with hash in URL
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            const targetLink = document.querySelector(`.container_nav .navbar .links a[href="${hash}"], .mobile-menu-content a[href="${hash}"]`);
            
            if (targetLink) {
                setActiveLink(targetLink);
            }
        } else {
            // Set first link as active by default if no hash
            if (desktopLinks.length > 0) {
                setActiveLink(desktopLinks[0]);
            }
        }
    }
    
    // Handle hash changes when using browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            const targetLink = document.querySelector(`.container_nav .navbar .links a[href="${hash}"], .mobile-menu-content a[href="${hash}"]`);
            
            if (targetLink) {
                setActiveLink(targetLink);
            }
        }
    });
    
    // Initialize active state on page load
    handleInitialHash();
    
    // Optional: Add scroll spy to update active link based on scroll position
    function updateActiveLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const correspondingLink = document.querySelector(`.container_nav .navbar .links a[href="#${sectionId}"], .mobile-menu-content a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    setActiveLink(correspondingLink);
                }
            }
        });
    }
    
    // Throttle scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveLinkOnScroll, 100);
    });
});