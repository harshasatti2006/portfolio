/* ============================================================
   HARSHA VARDHAN — PORTFOLIO SCRIPTS
   script.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────────────────────────────────
    // 1. CUSTOM CURSOR
    // ──────────────────────────────────────────────────────────
    const dot     = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outX = 0, outY = 0;

    const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice() && dot && outline) {
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        });
        // Smooth outline follow
        const followCursor = () => {
            outX += (mouseX - outX) * 0.12;
            outY += (mouseY - outY) * 0.12;
            outline.style.left = outX + 'px';
            outline.style.top  = outY + 'px';
            requestAnimationFrame(followCursor);
        };
        followCursor();

        // Enlarge on hover
        document.querySelectorAll('a, button, .cert-view-btn, .proj-card, .skill-category').forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.style.transform = 'translate(-50%,-50%) scale(2)';
                outline.style.transform = 'translate(-50%,-50%) scale(1.5)';
                outline.style.opacity = '.4';
            });
            el.addEventListener('mouseleave', () => {
                dot.style.transform = 'translate(-50%,-50%) scale(1)';
                outline.style.transform = 'translate(-50%,-50%) scale(1)';
                outline.style.opacity = '1';
            });
        });
    } else {
        if (dot)     dot.style.display = 'none';
        if (outline) outline.style.display = 'none';
    }

    // ──────────────────────────────────────────────────────────
    // 2. THEME TOGGLE
    // ──────────────────────────────────────────────────────────
    const themeBtn  = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body      = document.body;

    const applyTheme = (mode) => {
        if (mode === 'light') {
            body.classList.replace('dark-mode', 'light-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        }
        localStorage.setItem('portfolio-theme', mode);
    };

    // Load saved or system preference
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) {
        applyTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        applyTheme('light');
    }

    themeBtn?.addEventListener('click', () => {
        const isLight = body.classList.contains('light-mode');
        applyTheme(isLight ? 'dark' : 'light');
    });

    // ──────────────────────────────────────────────────────────
    // 3. HAMBURGER / MOBILE MENU
    // ──────────────────────────────────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger?.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu?.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileMenu?.setAttribute('aria-hidden', !isOpen);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            mobileMenu?.classList.remove('open');
            hamburger?.setAttribute('aria-expanded', 'false');
            mobileMenu?.setAttribute('aria-hidden', 'true');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
        if (mobileMenu?.classList.contains('open')
            && !mobileMenu.contains(e.target)
            && !hamburger?.contains(e.target)) {
            hamburger?.classList.remove('open');
            mobileMenu.classList.remove('open');
        }
    });

    // ──────────────────────────────────────────────────────────
    // 4. NAVBAR SCROLL EFFECTS + PROGRESS BAR + BACK TO TOP
    // ──────────────────────────────────────────────────────────
    const navbar       = document.getElementById('navbar');
    const progressBar  = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY   = window.scrollY;
        const docH      = document.documentElement.scrollHeight - window.innerHeight;
        const pct       = Math.round((scrollY / docH) * 100);

        // Progress bar
        if (progressBar) progressBar.style.width = pct + '%';
        // Navbar shrink
        navbar?.classList.toggle('scrolled', scrollY > 60);
        // Back to top
        backToTopBtn?.classList.toggle('show', scrollY > 500);
    }, { passive: true });

    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ──────────────────────────────────────────────────────────
    // 5. ACTIVE NAV LINK ON SCROLL
    // ──────────────────────────────────────────────────────────
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // ──────────────────────────────────────────────────────────
    // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ──────────────────────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => revealObserver.observe(el));

    // ──────────────────────────────────────────────────────────
    // 7. SKILL BAR ANIMATION
    // ──────────────────────────────────────────────────────────
    const skillFills = document.querySelectorAll('.skill-fill');
    let skillsAnimated = false;

    const skillObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            skillFills.forEach(bar => {
                const target = bar.getAttribute('data-w') || '0';
                // Small delay so transition fires after paint
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = target + '%'; }, 80);
                });
            });
            skillObserver.disconnect();
        }
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) skillObserver.observe(skillsSection);

    // ──────────────────────────────────────────────────────────
    // 8. TYPEWRITER EFFECT
    // ──────────────────────────────────────────────────────────
    const dynamicText = document.getElementById('dynamic-text');
    const phrases = [
        'Full Stack Web Apps',
        'Scalable Backends',
        'Responsive UIs',
        'Clean, Elegant Code',
        'Real-World Solutions',
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    const typeWrite = () => {
        if (!dynamicText) return;
        const current = phrases[phraseIdx];
        dynamicText.textContent = isDeleting
            ? current.slice(0, charIdx--)
            : current.slice(0, charIdx++);

        let delay = isDeleting ? 55 : 90;

        if (!isDeleting && charIdx > current.length) {
            isDeleting = true; delay = 1600; // pause before deleting
        } else if (isDeleting && charIdx < 0) {
            isDeleting = false;
            phraseIdx  = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(typeWrite, delay);
    };
    // Start typing immediately
    typeWrite();

    // ──────────────────────────────────────────────────────────
    // 9. COUNTER ANIMATION (STAT CARDS)
    // ──────────────────────────────────────────────────────────
    const statNums = document.querySelectorAll('.stat-num');
    let countersStarted = false;

    // Dynamically calculate project and certificate counts from elements
    const projectCardsCount = document.querySelectorAll('.proj-card').length;
    const certCardsCount = document.querySelectorAll('.cert-card').length;

    // Find and update the target counts dynamically
    statNums.forEach(el => {
        const label = el.nextElementSibling?.textContent.trim();
        if (label === 'Projects') {
            el.setAttribute('data-target', projectCardsCount);
        } else if (label === 'Certs') {
            el.setAttribute('data-target', certCardsCount);
        }
    });

    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;
        statNums.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (target === 0) {
                el.textContent = '0';
                return;
            }
            let current = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 40);
        });
    };

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const counterObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { startCounters(); counterObs.disconnect(); }
        }, { threshold: 0.3 });
        counterObs.observe(heroSection);
    } else {
        startCounters();
    }

    // ──────────────────────────────────────────────────────────
    // 10. PARTICLE CANVAS BACKGROUND
    // ──────────────────────────────────────────────────────────
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 60;

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const isDark = () => document.body.classList.contains('dark-mode');

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * canvas.width;
                this.y  = Math.random() * canvas.height;
                this.r  = Math.random() * 1.8 + 0.4;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.alpha = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = isDark()
                    ? `rgba(99,102,241,${this.alpha})`
                    : `rgba(99,102,241,${this.alpha * 0.5})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        // Draw connections
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const alpha = (1 - dist / 120) * 0.15;
                        ctx.strokeStyle = isDark()
                            ? `rgba(99,102,241,${alpha})`
                            : `rgba(99,102,241,${alpha * 0.4})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ──────────────────────────────────────────────────────────
    // 11. CONTACT FORM VALIDATION
    // ──────────────────────────────────────────────────────────
    const contactForm   = document.getElementById('contact-form');
    const formSuccess   = document.getElementById('form-success');

    if (contactForm) {
        const rules = [
            { id: 'name',    errId: 'name-error',    check: v => v.trim().length >= 2 ? '' : 'Please enter your name (min. 2 chars).' },
            { id: 'email',   errId: 'email-error',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.' },
            { id: 'subject', errId: 'subject-error', check: v => v.trim().length >= 4 ? '' : 'Subject must be at least 4 characters.' },
            { id: 'message', errId: 'message-error', check: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
        ];

        const showError = (inputEl, errEl, msg) => {
            errEl.textContent = msg;
            inputEl.closest('.input-wrap').style.borderColor = msg ? '#ef4444' : '';
        };

        rules.forEach(({ id, errId, check }) => {
            const input = document.getElementById(id);
            const errEl = document.getElementById(errId);
            if (!input || !errEl) return;
            input.addEventListener('input', () => showError(input, errEl, check(input.value)));
        });

        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;
            rules.forEach(({ id, errId, check }) => {
                const input = document.getElementById(id);
                const errEl = document.getElementById(errId);
                if (!input || !errEl) return;
                const msg = check(input.value);
                showError(input, errEl, msg);
                if (msg) valid = false;
            });

            if (valid) {
                const name    = document.getElementById('name').value.trim();
                const email   = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();

                const submitBtn = document.getElementById('submit-btn');
                const originalBtnText = submitBtn.innerHTML;

                // Check access key
                const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
                const accessKey = accessKeyInput ? accessKeyInput.value : '';

                if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';

                    fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            access_key: accessKey,
                            name: name,
                            email: email,
                            subject: subject,
                            message: message
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            formSuccess.querySelector('span').textContent = "Message sent successfully! I'll get back to you soon.";
                            formSuccess.style.background = "rgba(34,197,94,0.08)";
                            formSuccess.style.borderColor = "rgba(34,197,94,0.2)";
                            formSuccess.style.color = "#22c55e";
                            formSuccess.classList.add('show');
                            contactForm.reset();
                        } else {
                            throw new Error(data.message || 'Something went wrong.');
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        formSuccess.querySelector('span').textContent = "Online delivery failed. Opening email client instead...";
                        formSuccess.style.background = "rgba(239,68,68,0.08)";
                        formSuccess.style.borderColor = "rgba(239,68,68,0.2)";
                        formSuccess.style.color = "#ef4444";
                        formSuccess.classList.add('show');

                        // Fallback to mailto
                        const bodyContent = `From: ${name} (${email})\n\n${message}`;
                        const mailto = `mailto:harshasatti9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
                        window.location.href = mailto;
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        setTimeout(() => formSuccess?.classList.remove('show'), 6000);
                    });
                } else {
                    // Fallback to mailto immediately
                    const bodyContent = `From: ${name} (${email})\n\n${message}`;
                    const mailto = `mailto:harshasatti9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
                    window.location.href = mailto;

                    formSuccess.querySelector('span').textContent = "Opening email app... (To send directly from web, paste Web3Forms key in index.html)";
                    formSuccess.style.background = "rgba(99,102,241,0.08)";
                    formSuccess.style.borderColor = "rgba(99,102,241,0.2)";
                    formSuccess.style.color = "var(--clr-accent)";
                    formSuccess.classList.add('show');
                    contactForm.reset();
                    setTimeout(() => formSuccess?.classList.remove('show'), 6000);
                }
            }
        });
    }

});
