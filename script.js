// ============================================
// NAVBAR FUNCTIONALITY
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
// Dropdown functionality removed - using direct navigation links instead

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// activateNavLink is now called inside the throttled scroll listener

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');

        // If we're on home.html and clicking a section link, redirect to index.html
        if (window.location.pathname.includes('index.html') && targetId && targetId.startsWith('#')) {
            e.preventDefault();
            window.location.href = 'home-v2.html' + targetId;
            return;
        }

        // If link already points to home-v2.html, let it navigate normally
        if (targetId && targetId.includes('home-v2.html')) {
            return;
        }

        // Otherwise, handle smooth scroll for same-page navigation
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// STATISTICS COUNTER ANIMATION
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + suffix;
        }
    };

    updateCounter();
}

function checkStatsVisibility() {
    const statsSection = document.querySelector('.statistics');
    if (!statsSection || hasAnimated) return;

    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        statNumbers.forEach(stat => {
            animateCounter(stat);
        });
        hasAnimated = true;
    }
}

// Throttled scroll handler
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        requestAnimationFrame(() => {
            activateNavLink();
            checkStatsVisibility();
            scrollTimeout = false;
        });
        scrollTimeout = true;
    }
});

// Initial check
activateNavLink();
checkStatsVisibility();

// ============================================
// GALLERY FILTER FUNCTIONALITY
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxStyle = document.querySelector('.lightbox-style');
const lightboxArtist = document.querySelector('.lightbox-artist');
const lightboxSize = document.querySelector('.lightbox-size');
const lightboxClose = document.querySelector('.lightbox-close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');

        lightboxImage.src = img.src;
        lightboxStyle.textContent = overlay.querySelector('.gallery-style').textContent;
        lightboxArtist.textContent = overlay.querySelector('.gallery-artist').textContent;
        lightboxSize.textContent = overlay.querySelector('.gallery-size').textContent;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// REVIEWS CAROUSEL
// ============================================
const reviewCards = document.querySelectorAll('.review-card');
const reviewPrev = document.querySelector('.review-prev');
const reviewNext = document.querySelector('.review-next');
let currentReview = 0;

function showReview(index) {
    reviewCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
            card.classList.add('active');
        }
    });
}

reviewNext.addEventListener('click', () => {
    currentReview = (currentReview + 1) % reviewCards.length;
    showReview(currentReview);
});

reviewPrev.addEventListener('click', () => {
    currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;
    showReview(currentReview);
});

// Auto-rotate reviews
setInterval(() => {
    currentReview = (currentReview + 1) % reviewCards.length;
    showReview(currentReview);
}, 5000);

// ============================================
// FAQ ACCORDION
// ============================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// BOOKING FORM HANDLING WITH VALIDATION
// ============================================
const bookingForm = document.getElementById('bookingForm');

// Create error message container
function createErrorMessage(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--highlight)';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.display = 'block';

    // Remove existing error if any
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    input.parentElement.appendChild(errorDiv);
    input.style.borderColor = 'var(--highlight)';
}

// Remove error message
function removeErrorMessage(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = 'var(--secondary)';
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Real-time validation
const formInputs = document.querySelectorAll('.booking-form input, .booking-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function () {
        if (this.hasAttribute('required') && !this.value.trim()) {
            createErrorMessage(this, 'This field is required');
        } else if (this.type === 'email' && this.value && !validateEmail(this.value)) {
            createErrorMessage(this, 'Please enter a valid email address');
        } else if (this.type === 'tel' && this.value && !validatePhone(this.value)) {
            createErrorMessage(this, 'Please enter a valid phone number');
        } else {
            removeErrorMessage(this);
        }
    });

    input.addEventListener('input', function () {
        if (this.style.borderColor === 'var(--highlight)') {
            removeErrorMessage(this);
        }
    });
});

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredFields = bookingForm.querySelectorAll('[required]');

    // Validate all required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            createErrorMessage(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !validateEmail(field.value)) {
            createErrorMessage(field, 'Please enter a valid email address');
            isValid = false;
        } else if (field.type === 'tel' && !validatePhone(field.value)) {
            createErrorMessage(field, 'Please enter a valid phone number');
            isValid = false;
        } else {
            removeErrorMessage(field);
        }
    });

    if (!isValid) {
        // Scroll to first error
        const firstError = bookingForm.querySelector('.error-message');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.cssText = 'background: var(--secondary); color: var(--text); padding: 20px; margin-top: 20px; text-align: center; clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);';
    successMessage.textContent = 'Thank you! We\'ll contact you within 24 hours to confirm your appointment.';
    successMessage.style.display = 'block';

    // Remove existing success message if any
    const existingSuccess = bookingForm.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    bookingForm.appendChild(successMessage);

    // Reset form after 3 seconds
    setTimeout(() => {
        bookingForm.reset();
        successMessage.remove();
    }, 5000);

    // Here you would typically send the data to a server via AJAX
    console.log('Booking request:', data);
});

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        // Here you would typically send the email to a server
        console.log('Newsletter subscription:', email);

        alert('Thank you for subscribing!');
        newsletterForm.reset();
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateElements = document.querySelectorAll('.artist-card, .style-card, .service-card, .process-step, .faq-item');

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// INK DROP ANIMATION ON BUTTON HOVER
// ============================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function () {
        // Create ink drop effect
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.width = '10px';
        drop.style.height = '10px';
        drop.style.background = 'rgba(255, 36, 0, 0.6)';
        drop.style.borderRadius = '50%';
        drop.style.top = '50%';
        drop.style.left = '50%';
        drop.style.transform = 'translate(-50%, -50%)';
        drop.style.pointerEvents = 'none';
        drop.style.animation = 'inkDrop 0.6s ease-out';

        this.style.position = 'relative';
        this.appendChild(drop);

        setTimeout(() => {
            drop.remove();
        }, 600);
    });
});

// Add ink drop keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes inkDrop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PARALLAX SCROLLING EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// NEON GLOW ANIMATION
// ============================================
const neonElements = document.querySelectorAll('.logo, .hero-heading, .section-heading');

neonElements.forEach(element => {
    setInterval(() => {
        const intensity = Math.random() * 0.3 + 0.5;
        element.style.textShadow = `0 0 ${10 * intensity}px rgba(255, 36, 0, ${intensity})`;
    }, 2000);
});

// ============================================
// LOAD MORE GALLERY ITEMS
// ============================================
const loadMoreBtn = document.querySelector('.btn-load-more');
let galleryPage = 1;
const itemsPerPage = 12;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more items
        // In a real application, you would fetch from an API
        console.log('Loading more gallery items...');

        // For demo purposes, just show a message
        loadMoreBtn.textContent = 'All Items Loaded';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.opacity = '0.5';
    });
}

// ============================================
// FORM INPUT FOCUS EFFECTS
// ============================================
const bookingFormInputs = document.querySelectorAll('.booking-form input, .booking-form textarea, .booking-form select');

bookingFormInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ============================================
// INSTAGRAM ITEM CLICK HANDLER
// ============================================
const instagramItems = document.querySelectorAll('.instagram-item');

instagramItems.forEach(item => {
    item.addEventListener('click', () => {
        // In a real application, this would open the Instagram post
        window.open('https://instagram.com/inkandartstudio', '_blank');
    });
});

// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const themeIcon = document.getElementById('themeIcon');
    const themeIconMobile = document.getElementById('themeIconMobile');
    const htmlElement = document.documentElement;

    // Default to LIGHT theme
    const htmlTheme = htmlElement.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = htmlTheme || savedTheme || 'light';

    // Always set the theme attribute to ensure consistency
    htmlElement.setAttribute('data-theme', currentTheme);
    if (!savedTheme) {
        localStorage.setItem('theme', currentTheme);
    }

    // Update both icons if they exist
    if (themeIcon) {
        updateThemeIcon(currentTheme, themeIcon);
    }
    if (themeIconMobile) {
        updateThemeIcon(currentTheme, themeIconMobile);
    }

    // Initialize desktop theme toggle
    if (themeToggle && !themeToggle.dataset.listenerAttached) {
        themeToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(htmlElement, themeIcon, themeIconMobile);
        });
        themeToggle.dataset.listenerAttached = 'true';
    }

    // Initialize mobile theme toggle
    if (themeToggleMobile && !themeToggleMobile.dataset.listenerAttached) {
        themeToggleMobile.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme(htmlElement, themeIcon, themeIconMobile);
        });
        themeToggleMobile.dataset.listenerAttached = 'true';
    }
}

function toggleTheme(htmlElement, themeIcon, themeIconMobile) {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (themeIcon) {
        updateThemeIcon(newTheme, themeIcon);
    }
    if (themeIconMobile) {
        updateThemeIcon(newTheme, themeIconMobile);
    }
}

function updateThemeIcon(theme, themeIcon) {
    if (!themeIcon) return;

    // Light mode = show moon icon to switch to dark
    // Dark mode = show sun icon to switch to light
    if (theme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle first (most important)
    try {
        initThemeToggle();
    } catch (error) {
        console.error('Error initializing theme toggle:', error);
    }

    // Set initial active nav link
    try {
        if (typeof activateNavLink === 'function') {
            activateNavLink();
        }
    } catch (error) {
        console.error('Error activating nav link:', error);
    }

    // Initialize first review as active (only if reviewCards exists)
    try {
        if (typeof reviewCards !== 'undefined' && reviewCards && reviewCards.length > 0) {
            if (typeof showReview === 'function') {
                showReview(0);
            }
        }
    } catch (error) {
        console.error('Error initializing reviews:', error);
    }

    // Add loading animation
    try {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    } catch (error) {
        console.error('Error with loading animation:', error);
    }
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    try {
        initThemeToggle();
    } catch (error) {
        console.error('Error initializing theme toggle (immediate):', error);
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    activateNavLink();
    checkStatsVisibility();
}, 100));

