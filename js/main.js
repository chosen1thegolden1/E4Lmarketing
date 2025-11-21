// ===================================
// STATE MANAGEMENT
// ===================================
let currentTheme = null; // 'learning' or 'services'
let isTransitioning = false;

// ===================================
// DOM ELEMENTS
// ===================================
const loadingScreen = document.getElementById('loading-screen');
const splitScreen = document.getElementById('split-screen');
const learningHalf = document.querySelector('.learning-half');
const servicesHalf = document.querySelector('.services-half');
const mainHeader = document.getElementById('main-header');
const learningSection = document.getElementById('learning-section');
const servicesSection = document.getElementById('services-section');
const themeToggle = document.getElementById('theme-toggle');
const footerThemeToggle = document.getElementById('footer-theme-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const mainFooter = document.querySelector('.main-footer');

// ===================================
// LOADING SCREEN
// ===================================
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500); // Show loading screen for 1.5 seconds
});

// ===================================
// SPLIT SCREEN INTERACTION
// ===================================
function initializeSplitScreen() {
    learningHalf.addEventListener('click', () => {
        if (!isTransitioning) {
            selectTheme('learning');
        }
    });

    servicesHalf.addEventListener('click', () => {
        if (!isTransitioning) {
            selectTheme('services');
        }
    });
}

function selectTheme(theme) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentTheme = theme;

    // Add transitioning class
    splitScreen.classList.add('transitioning');

    // Trigger takeover animation
    if (theme === 'learning') {
        splitScreen.classList.add('learning-takeover');
    } else {
        splitScreen.classList.add('services-takeover');
    }

    // Wait for animation to complete
    setTimeout(() => {
        // Hide split screen
        splitScreen.classList.remove('active');
        splitScreen.style.display = 'none';

        // Show header
        mainHeader.classList.add('visible');
        mainHeader.classList.add(`${theme}-theme`);

        // Show appropriate section
        if (theme === 'learning') {
            learningSection.classList.add('active');
            updateThemeToggleText('Switch to Services');
            updateFooterToggleText('Services');
            mainFooter.classList.add('learning-theme');
        } else {
            servicesSection.classList.add('active');
            updateThemeToggleText('Switch to Learning');
            updateFooterToggleText('Learning');
            mainFooter.classList.remove('learning-theme');
        }

        // Enable scrolling
        document.body.style.overflow = 'auto';

        // Update navigation links
        updateNavigationLinks(theme);

        // Trigger scroll animations
        setTimeout(() => {
            initializeScrollAnimations();
            isTransitioning = false;
        }, 100);
    }, 800);
}

// ===================================
// THEME SWITCHING
// ===================================
function switchTheme() {
    if (isTransitioning) return;

    isTransitioning = true;
    const newTheme = currentTheme === 'learning' ? 'services' : 'learning';

    // Fade out current section
    if (currentTheme === 'learning') {
        learningSection.classList.remove('active');
    } else {
        servicesSection.classList.remove('active');
    }

    // Update header theme
    mainHeader.classList.remove(`${currentTheme}-theme`);
    mainHeader.classList.add(`${newTheme}-theme`);

    // Wait for fade out
    setTimeout(() => {
        currentTheme = newTheme;

        // Fade in new section
        if (newTheme === 'learning') {
            learningSection.classList.add('active');
            updateThemeToggleText('Switch to Services');
            updateFooterToggleText('Services');
            mainFooter.classList.add('learning-theme');
        } else {
            servicesSection.classList.add('active');
            updateThemeToggleText('Switch to Learning');
            updateFooterToggleText('Learning');
            mainFooter.classList.remove('learning-theme');
        }

        // Update navigation
        updateNavigationLinks(newTheme);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-initialize scroll animations
        setTimeout(() => {
            initializeScrollAnimations();
            isTransitioning = false;
        }, 300);
    }, 500);
}

function updateThemeToggleText(text) {
    const toggleText = themeToggle.querySelector('.toggle-text');
    if (toggleText) {
        toggleText.textContent = text;
    } else {
        themeToggle.innerHTML = `<span class="toggle-text">${text}</span>`;
    }
}

function updateFooterToggleText(targetTheme) {
    const toggleTarget = footerThemeToggle.querySelector('.toggle-target');
    if (toggleTarget) {
        toggleTarget.textContent = targetTheme;
    } else {
        footerThemeToggle.innerHTML = `Switch to <span class="toggle-target">${targetTheme}</span>`;
    }
}

function updateNavigationLinks(theme) {
    const sectionNavLinks = document.getElementById('section-nav-links');

    if (theme === 'learning') {
        sectionNavLinks.innerHTML = `
            <li><a href="#courses">Courses</a></li>
            <li><a href="#books">Books</a></li>
            <li><a href="#resources">Resources</a></li>
        `;
    } else {
        sectionNavLinks.innerHTML = `
            <li><a href="#our-services">Services</a></li>
            <li><a href="#case-studies">Case Studies</a></li>
            <li><a href="#process">Process</a></li>
        `;
    }
}

// Theme toggle event listeners
if (themeToggle) {
    themeToggle.addEventListener('click', switchTheme);
}

if (footerThemeToggle) {
    footerThemeToggle.addEventListener('click', switchTheme);
}

// ===================================
// MOBILE MENU
// ===================================
function initializeMobileMenu() {
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initializeScrollAnimations() {
    const cards = document.querySelectorAll('.card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
}

// ===================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip empty hrefs or just '#'
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = mainHeader.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// FORM HANDLING
// ===================================
function initializeFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                showFormMessage(formError, 'Please fill in all required fields.');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage(formError, 'Please enter a valid email address.');
                return;
            }

            // Simulate form submission
            // In production, this would send data to a server
            setTimeout(() => {
                showFormMessage(formSuccess, 'Thank you! We\'ll get back to you soon.');
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }, 500);
        });
    }
}

function showFormMessage(element, message) {
    // Hide all messages first
    document.getElementById('form-success').style.display = 'none';
    document.getElementById('form-error').style.display = 'none';

    // Show the specific message
    element.textContent = message;
    element.style.display = 'block';

    // Auto-hide error messages after 5 seconds
    if (element.classList.contains('error')) {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================
function initializeKeyboardNavigation() {
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Tab trapping in mobile menu when open
    if (navMenu) {
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// ===================================
// STICKY HEADER
// ===================================
function initializeStickyHeader() {
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        if (!mainHeader.classList.contains('visible')) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Optional: Add background opacity based on scroll
        if (scrollTop > 50) {
            mainHeader.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.1)';
        } else {
            mainHeader.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });
}

// ===================================
// PRELOAD ANIMATIONS
// ===================================
function preloadAnimations() {
    // Ensure cards start with opacity 0 for animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
    });
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
function initializeAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID to sections
    if (learningSection) {
        learningSection.id = learningSection.id || 'main-content';
    }
    if (servicesSection) {
        servicesSection.id = servicesSection.id || 'main-content';
    }

    // Add ARIA labels for better screen reader support
    if (splitScreen) {
        learningHalf.setAttribute('role', 'button');
        learningHalf.setAttribute('aria-label', 'Select Learning section to explore courses, books, and resources');
        learningHalf.setAttribute('tabindex', '0');

        servicesHalf.setAttribute('role', 'button');
        servicesHalf.setAttribute('aria-label', 'Select Services section to explore done-for-you marketing services');
        servicesHalf.setAttribute('tabindex', '0');

        // Allow Enter/Space to activate split screen selections
        learningHalf.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectTheme('learning');
            }
        });

        servicesHalf.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectTheme('services');
            }
        });
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
function optimizeImages() {
    // Lazy load images if implemented
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ===================================
// BUTTON INTERACTIONS
// ===================================
function initializeButtonInteractions() {
    // Add ripple effect to buttons (optional enhancement)
    const buttons = document.querySelectorAll('.cta-button, .card-button, .submit-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===================================
// ANALYTICS & TRACKING (Placeholder)
// ===================================
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    // In production, integrate with Google Analytics, Mixpanel, etc.
    console.log('Event:', category, action, label);
}

// Track split screen selections
function trackSplitScreenSelection(theme) {
    trackEvent('Navigation', 'Split Screen Selection', theme);
}

// Track theme switches
function trackThemeSwitch(fromTheme, toTheme) {
    trackEvent('Navigation', 'Theme Switch', `${fromTheme} to ${toTheme}`);
}

// ===================================
// INITIALIZE ALL FUNCTIONALITY
// ===================================
function initialize() {
    // Prevent scrolling until theme is selected
    document.body.style.overflow = 'hidden';

    // Initialize all features
    preloadAnimations();
    initializeSplitScreen();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeKeyboardNavigation();
    initializeStickyHeader();
    initializeAccessibility();
    optimizeImages();

    // Log initialization
    console.log('Eat 4 Life Marketing website initialized');
}

// ===================================
// RUN ON DOM READY
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// ===================================
// HANDLE PAGE VISIBILITY
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// ===================================
// HANDLE RESIZE
// ===================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized');
        // Re-calculate any layout dependencies if needed
    }, 250);
});

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, send to error tracking service
});

// ===================================
// EXPORT FOR TESTING (Optional)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectTheme,
        switchTheme,
        isValidEmail,
        trackEvent
    };
}
