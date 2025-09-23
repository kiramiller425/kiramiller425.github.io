document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            const section = document.querySelector(sectionId);
            const navHeight = document.querySelector('nav').offsetHeight;
            
            window.scrollTo({
                top: section.offsetTop - navHeight,
                behavior: 'smooth'
            });
        });
    });

    // Add active class to nav items based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = document.querySelector('nav').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.style.color = '';
            if (item.getAttribute('href').includes(current)) {
                item.style.color = 'var(--primary-pink)';
            }
        });
    });

    // Create a copyright message and add it to the footer:
    const footerElement = document.createElement('footer');
    const copyrightElement = document.createElement('p');
    const rightNow = new Date();
    const currentYear = rightNow.getFullYear();
    copyrightElement.innerHTML = `\u00A9 ${currentYear} Kira Miller. All rights reserved.`;
    footerElement.appendChild(copyrightElement);
    document.body.appendChild(footerElement);
});
