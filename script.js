document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE (DARK / LIGHT)
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================================================
    // MOBILE NAV MENU TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ==========================================================================
    // SCROLL INTERACTIONS (NAVBAR SCROLLED & SCROLL PROGRESS & SCROLL TO TOP)
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Scroll Progress Bar
        const scrollPct = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPct + '%';

        // Navbar Scroll Shrink
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to Top visibility
        if (scrollTop > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to Top click event
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealSections = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // ==========================================================================
    // SKILLS ANIMATION (FILLS WHEN VISIBLE)
    // ==========================================================================
    const skillsSection = document.querySelector('.skills-section');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    if (skillsSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const width = bar.style.width; // Trigger animation transition by letting width style render
                        // Note: HTML template has style="width: XX%" which will start animation once visible
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        skillsObserver.observe(skillsSection);
    }

    // ==========================================================================
    // ACTIVE NAV LINK HIGHLIGHTER
    // ==========================================================================
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const fields = [
        { id: 'name', errorId: 'name-error', validate: val => val.trim().length >= 3 ? '' : 'Name must be at least 3 characters.' },
        { id: 'email', errorId: 'email-error', validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Please enter a valid email address.' },
        { id: 'subject', errorId: 'subject-error', validate: val => val.trim().length >= 4 ? '' : 'Subject must be at least 4 characters.' },
        { id: 'message', errorId: 'message-error', validate: val => val.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorSpan = document.getElementById(field.errorId);

        // Dynamic validation on typing
        input.addEventListener('input', () => {
            const error = field.validate(input.value);
            errorSpan.textContent = error;
            if (error) {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        let isFormValid = true;

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorSpan = document.getElementById(field.errorId);
            const error = field.validate(input.value);
            
            if (error) {
                isFormValid = false;
                errorSpan.textContent = error;
                input.style.borderColor = '#ef4444';
            } else {
                errorSpan.textContent = '';
                input.style.borderColor = 'var(--border-color)';
            }
        });

        if (!isFormValid) {
            e.preventDefault();
        }
    });
});
