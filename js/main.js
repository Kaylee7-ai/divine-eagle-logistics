/**
 * Divine Eagle Logistics LTD - Main JavaScript
 * 100% complete, no external dependencies except Font Awesome & Google Fonts
 */
(function () {
    'use strict';

    // Lets the CSS hide .reveal elements only when JavaScript is running
    document.documentElement.classList.add('js');

    /* ---------- Helpers ---------- */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function isValidPhone(value) {
        return /^[+()\-\s\d]{7,20}$/.test(value) && (value.match(/\d/g) || []).length >= 7;
    }

    document.addEventListener('DOMContentLoaded', function () {

        /* ---------- Mobile Navigation ---------- */
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        function closeMenu() {
            if (!navMenu || !hamburger) return;
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                const isOpen = navMenu.classList.toggle('active');
                hamburger.classList.toggle('active', isOpen);
                hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            // Close menu when a link is clicked
            navMenu.querySelectorAll('.nav-link').forEach(function (link) {
                link.addEventListener('click', closeMenu);
            });

            // Close menu on Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMenu();
                    hamburger.focus();
                }
            });

            // Close menu when clicking outside of it
            document.addEventListener('click', function (e) {
                if (
                    navMenu.classList.contains('active') &&
                    !navMenu.contains(e.target) &&
                    !hamburger.contains(e.target)
                ) {
                    closeMenu();
                }
            });

            // Reset menu state when resizing up to desktop
            window.addEventListener('resize', function () {
                if (window.innerWidth > 992) closeMenu();
            });
        }

        /* ---------- Scroll Handlers (header, nav highlight, back to top) ---------- */
        const header = document.getElementById('header');
        const backToTop = document.getElementById('back-to-top');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function highlightNav() {
            const scrollY = window.pageYOffset;
            let currentId = null;

            sections.forEach(function (section) {
                const sectionTop = section.offsetTop - 120;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollY > sectionTop && scrollY <= sectionBottom) {
                    currentId = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                const href = link.getAttribute('href');
                link.classList.toggle('active', currentId !== null && href === '#' + currentId);
            });
        }

        function onScroll() {
            const y = window.pageYOffset;

            if (header) header.classList.toggle('scrolled', y > 50);
            if (backToTop) backToTop.classList.toggle('visible', y > 400);

            highlightNav();
        }

        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        onScroll();

        if (backToTop) {
            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        /* ---------- Tracking Form (Demo) ---------- */
        const trackForm = document.getElementById('track-form');
        const trackResult = document.getElementById('track-result');

        if (trackForm && trackResult) {
            trackForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const input = document.getElementById('tracking-number');
                if (!input) return;
                const trackingNumber = (input.value || '').trim();

                if (!trackingNumber) {
                    input.focus();
                    return;
                }

                trackResult.classList.remove('hidden');
                trackResult.innerHTML =
                    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
                    '<i class="fas fa-info-circle" style="color:#0066cc;font-size:1.4rem;"></i>' +
                    '<strong>Tracking Number: ' + escapeHtml(trackingNumber) + '</strong>' +
                    '</div>' +
                    '<p style="color:#666;margin-bottom:8px;">This is a demonstration tracking result.</p>' +
                    '<p style="color:#666;">For live shipment updates, please contact our team on ' +
                    'WhatsApp or request a quote below.</p>';
            });
        }

        /* ---------- FAQ Accordion ---------- */
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function (item) {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.setAttribute('aria-expanded', 'false');

            question.addEventListener('click', function () {
                const willOpen = !item.classList.contains('active');

                // Close all others so only one is open at a time
                faqItems.forEach(function (other) {
                    other.classList.remove('active');
                    const q = other.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                });

                if (willOpen) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });

        /* ---------- Quote / Contact Forms ---------- */
        // Optional: paste a form-handler URL here (e.g. Formspree) to receive
        // submissions by email. While empty, the form runs in demo mode.
        const FORM_ENDPOINT = '';

        function setFieldError(field, message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');

            let msg = field.parentNode.querySelector('.error-message');
            if (!msg) {
                msg = document.createElement('span');
                msg.className = 'error-message';
                msg.setAttribute('role', 'alert');
                field.parentNode.appendChild(msg);
            }
            msg.textContent = message;
        }

        function clearFieldError(field) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            const msg = field.parentNode.querySelector('.error-message');
            if (msg) msg.remove();
        }

        function validateField(field) {
            const value = (field.value || '').trim();
            const type = (field.getAttribute('type') || '').toLowerCase();

            if (field.hasAttribute('required') && !value) {
                setFieldError(field, 'This field is required.');
                return false;
            }
            if (value && type === 'email' && !isValidEmail(value)) {
                setFieldError(field, 'Enter a valid email address.');
                return false;
            }
            if (value && type === 'tel' && !isValidPhone(value)) {
                setFieldError(field, 'Enter a valid phone number.');
                return false;
            }
            clearFieldError(field);
            return true;
        }

        function showFormMessage(form, type, text) {
            let box = form.querySelector('.form-message');
            if (!box) {
                box = document.createElement('div');
                box.className = 'form-message';
                box.setAttribute('role', 'status');
                box.setAttribute('aria-live', 'polite');
                form.appendChild(box);
            }
            box.className = 'form-message ' + type;
            box.textContent = text;
            box.classList.remove('hidden');
        }

        function setLoading(button, isLoading) {
            if (!button) return;
            const text = button.querySelector('.btn-text');
            const loading = button.querySelector('.btn-loading');
            button.disabled = isLoading;
            if (text) text.classList.toggle('hidden', isLoading);
            if (loading) loading.classList.toggle('hidden', !isLoading);
        }

        document.querySelectorAll('#quote-form, #contact-form').forEach(function (form) {
            const fields = form.querySelectorAll('input, select, textarea');
            const submitBtn = form.querySelector('button[type="submit"]');

            fields.forEach(function (field) {
                field.addEventListener('blur', function () { validateField(field); });
                field.addEventListener('input', function () {
                    if (field.classList.contains('error')) validateField(field);
                });
            });

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                let firstInvalid = null;
                fields.forEach(function (field) {
                    if (field.type === 'hidden' || field.type === 'submit') return;
                    if (!validateField(field) && !firstInvalid) firstInvalid = field;
                });

                if (firstInvalid) {
                    firstInvalid.focus();
                    showFormMessage(form, 'error', 'Please fix the highlighted fields and try again.');
                    return;
                }

                setLoading(submitBtn, true);

                const done = function (ok) {
                    setLoading(submitBtn, false);
                    if (ok) {
                        form.reset();
                        showFormMessage(form, 'success',
                            'Thank you! Your request has been received. Our team will contact you shortly.');
                    } else {
                        showFormMessage(form, 'error',
                            'Something went wrong. Please try again or contact us on WhatsApp.');
                    }
                };

                if (FORM_ENDPOINT) {
                    fetch(FORM_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: new FormData(form)
                    }).then(function (res) {
                        done(res.ok);
                    }).catch(function () {
                        done(false);
                    });
                } else {
                    // Demo mode: simulate a short network delay
                    window.setTimeout(function () { done(true); }, 900);
                }
            });
        });

        /* ---------- Animated Counters ---------- */
        const counters = document.querySelectorAll('[data-count]');

        function animateCounter(el) {
            const target = parseFloat(el.getAttribute('data-count'));
            if (isNaN(target)) return;

            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const startTime = performance.now();

            function frame(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased).toLocaleString() + suffix;
                if (progress < 1) window.requestAnimationFrame(frame);
            }
            window.requestAnimationFrame(frame);
        }

        /* ---------- Reveal on Scroll + Counter Trigger ---------- */
        const revealEls = document.querySelectorAll('.reveal');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if ('IntersectionObserver' in window && !reduceMotion) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('visible');
                    if (entry.target.hasAttribute('data-count')) animateCounter(entry.target);
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.15 });

            revealEls.forEach(function (el) { observer.observe(el); });
            counters.forEach(function (el) {
                if (!el.classList.contains('reveal')) observer.observe(el);
            });
        } else {
            // No observer support or reduced motion: show everything immediately
            revealEls.forEach(function (el) { el.classList.add('visible'); });
            counters.forEach(function (el) {
                el.textContent = (parseFloat(el.getAttribute('data-count')) || 0)
                    .toLocaleString() + (el.getAttribute('data-suffix') || '');
            });
        }

        /* ---------- Footer Year ---------- */
        document.querySelectorAll('#year, .current-year').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    });
})();
