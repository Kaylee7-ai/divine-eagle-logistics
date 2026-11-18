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

        /* ---------- WhatsApp Shipment Enquiries ---------- */
        const trackForm = document.getElementById('track-form');
        const trackResult = document.getElementById('track-result');
        const WHATSAPP_NUMBER = '233244850253';

        function openWhatsAppMessage(message) {
            const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
            window.open(url, '_blank', 'noopener,noreferrer');
        }

        if (trackForm && trackResult) {
            const input = document.getElementById('tracking-number');
            const trackingError = document.getElementById('tracking-error');

            trackForm.addEventListener('submit', function (e) {
                e.preventDefault();
                if (!input) return;

                const trackingNumber = (input.value || '').trim();
                if (!trackingNumber) {
                    input.classList.add('error');
                    input.setAttribute('aria-invalid', 'true');
                    if (trackingError) {
                        trackingError.textContent = 'Please enter your tracking number.';
                        trackingError.classList.remove('hidden');
                    }
                    trackResult.classList.add('hidden');
                    input.focus();
                    return;
                }

                input.classList.remove('error');
                input.removeAttribute('aria-invalid');
                if (trackingError) {
                    trackingError.textContent = '';
                    trackingError.classList.add('hidden');
                }

                const message = 'Hello Divine Eagle Logistics, I would like an update on my shipment.\n\nTracking number: ' +
                    trackingNumber + '\n\nPlease share the latest shipment status.';
                openWhatsAppMessage(message);
                trackResult.classList.remove('hidden');
                trackResult.textContent = 'WhatsApp has opened with your request. Please press Send to complete it.';
            });

            if (input && trackingError) {
                input.addEventListener('input', function () {
                    if (input.value.trim()) {
                        input.classList.remove('error');
                        input.removeAttribute('aria-invalid');
                        trackingError.textContent = '';
                        trackingError.classList.add('hidden');
                    }
                });
            }
        }

        /* ---------- Quote Request via WhatsApp ---------- */
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

        document.querySelectorAll('#quote-form').forEach(function (form) {
            const fields = form.querySelectorAll('input, select, textarea');
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
                    return;
                }

                const values = new FormData(form);
                const lines = [
                    'Hello Divine Eagle Logistics, I would like to request a shipping quote.',
                    '',
                    'Name: ' + (values.get('name') || ''),
                    'Company: ' + (values.get('company') || 'Not provided'),
                    'Contact phone: ' + (values.get('phone') || ''),
                    'Phone: ' + (values.get('phone') || ''),
                    'Origin: ' + (values.get('origin') || 'Not provided'),
                    'Destination: ' + (values.get('destination') || 'Not provided'),
                    'Service: ' + (values.get('service') || 'Not specified'),
                    'Cargo details / estimated weight or volume: ' + (values.get('details') || 'Not provided')
                ];
                openWhatsAppMessage(lines.join('\n'));

                let notice = form.querySelector('.form-message');
                if (!notice) {
                    notice = document.createElement('p');
                    notice.className = 'form-message success';
                    notice.setAttribute('role', 'status');
                    notice.setAttribute('aria-live', 'polite');
                    form.appendChild(notice);
                }
                notice.textContent = 'WhatsApp has opened with your request. Please press Send to complete it.';
                notice.classList.remove('hidden');
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

        /* ---------- Counter Trigger ---------- */
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                });
            }, { threshold: 0.15 });
            counters.forEach(function (el) { counterObserver.observe(el); });
        } else {
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
