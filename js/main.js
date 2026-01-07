// ====================
// MAIN APPLICATION JS
// ====================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mirpur Hostel Finder loaded');
    
    // Initialize all components
    initMobileMenu();
    initWishlistButtons();
    initImageLazyLoading();
    initToastNotifications();
    initUserMenu();
    initGallery();
    
    // Update wishlist count
    updateWishlistCount();
});

// ====================
// MOBILE MENU TOGGLE
// ====================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        // Toggle active class on menu
        navMenu.classList.toggle('active');
        
        // Animate hamburger to X
        this.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ====================
// WISHLIST FUNCTIONALITY
// ====================
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const hostelId = this.closest('.hostel-card')?.dataset.id || 'unknown';
            
            // Toggle heart icon
            if (icon.classList.contains('far')) {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
                showToast('Added to wishlist', 'success');
                saveToWishlist(hostelId, true);
            } else {
                // Remove from wishlist
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
                showToast('Removed from wishlist', 'info');
                saveToWishlist(hostelId, false);
            }
        });
    });
}

function saveToWishlist(hostelId, add) {
    // Get existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (add) {
        // Add if not already in list
        if (!wishlist.includes(hostelId)) {
            wishlist.push(hostelId);
        }
    } else {
        // Remove from list
        wishlist = wishlist.filter(id => id !== hostelId);
    }
    
    // Save back to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount(wishlist.length);
}

function updateWishlistCount(count) {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (!wishlistCount) return;
    
    if (count === undefined) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        count = wishlist.length;
    }
    
    wishlistCount.textContent = count;
    wishlistCount.style.display = count > 0 ? 'flex' : 'none';
}

// ====================
// IMAGE GALLERY
// ====================
function initGallery() {
    const galleryThumbs = document.querySelectorAll('.gallery-thumb img');
    const galleryMain = document.querySelector('.gallery-main img');
    
    if (!galleryMain || galleryThumbs.length === 0) return;
    
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainSrc = galleryMain.src;
            const thumbSrc = this.src;
            
            // Swap images
            galleryMain.src = thumbSrc;
            this.src = mainSrc;
            
            // Add active class
            galleryThumbs.forEach(t => t.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });
}

// ====================
// LAZY LOADING IMAGES
// ====================
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ====================
// TOAST NOTIFICATIONS
// ====================
function initToastNotifications() {
    // Remove existing toasts on page load
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        hideToast(toast);
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        hideToast(toast);
    });
    
    // Close on click
    toast.addEventListener('click', (e) => {
        if (e.target === toast) {
            clearTimeout(autoRemove);
            hideToast(toast);
        }
    });
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// ====================
// USER MENU
// ====================
function initUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.textContent = user.name.charAt(0).toUpperCase();
        }
    }
}

// ====================
// FORM VALIDATION UTILS
// ====================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

function showFormError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Add error class
    formGroup.classList.add('error');
    
    // Create or update error message
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger mt-1';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.focus();
}

function clearFormErrors(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// ====================
// LOADING STATES
// ====================
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || 'Submit';
    }
}

// ====================
// LOCAL STORAGE HELPERS
// ====================
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return null;
        }
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    },
    
    clear: function() {
        localStorage.clear();
    }
};

// ====================
// URL PARAMETER HELPERS
// ====================
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

function updateUrlParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        url.searchParams.set(key, params[key]);
    });
    window.history.pushState({}, '', url);
}

// ====================
// DEBOUNCE FUNCTION
// ====================
function debounce(func, wait) {
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

// ====================
// FORMAT CURRENCY
// ====================
function formatCurrency(amount) {
    return '₨ ' + amount.toLocaleString('en-PK');
}

// ====================
// DATE FORMATTING
// ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ====================
// COPY TO CLIPBOARD
// ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy', 'error');
    });
}

// ====================
// SHARE FUNCTIONALITY
// ====================
function initShareButtons() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const title = document.title;
            const url = window.location.href;
            const text = `Check out this hostel on Mirpur Hostel Finder: ${title}`;
            
            if (navigator.share) {
                // Web Share API
                navigator.share({
                    title: title,
                    text: text,
                    url: url
                });
            } else {
                // Fallback: Copy to clipboard
                copyToClipboard(url);
            }
        });
    });
}

// ====================
// PASSWORD VISIBILITY TOGGLE
// ====================
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// ====================
// SCROLL TO TOP
// ====================
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
}

// ====================
// THEME TOGGLE (Light/Dark)
// ====================
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`);
    });
}

// ====================
// INITIALIZE ALL COMPONENTS
// ====================
function initAllComponents() {
    initMobileMenu();
    initWishlistButtons();
    initImageLazyLoading();
    initToastNotifications();
    initUserMenu();
    initGallery();
    initShareButtons();
    initPasswordToggle();
    initScrollToTop();
    initThemeToggle();
    updateWishlistCount();
}

// ====================
// GLOBAL EXPORTS
// ====================
window.MirpurHostel = {
    // Core functions
    Storage,
    showToast,
    validateEmail,
    validatePhone,
    setLoading,
    
    // Utility functions
    formatCurrency,
    formatDate,
    copyToClipboard,
    getUrlParams,
    updateUrlParams,
    
    // Component initializers
    initAllComponents,
    initMobileMenu,
    initWishlistButtons,
    initImageLazyLoading,
    initToastNotifications,
    initUserMenu,
    initGallery
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAllComponents);

// ====================
// ADDITIONAL STYLES FOR DYNAMIC ELEMENTS
// ====================
const dynamicStyles = `
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .scroll-to-top.visible {
        display: flex;
    }
    
    .scroll-to-top:hover {
        background: var(--primary-dark);
        transform: translateY(-3px);
    }
    
    .password-toggle {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--gray-medium);
        cursor: pointer;
        padding: 5px;
    }
    
    .password-toggle:hover {
        color: var(--primary-color);
    }
    
    .theme-toggle {
        background: none;
        border: none;
        color: var(--dark-color);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 5px;
    }
    
    [data-theme="dark"] {
        --light-color: #1a1a1a;
        --dark-color: #f9fafb;
        --white: #2d2d2d;
        --gray-light: #404040;
        --gray-medium: #666666;
        --gray-dark: #999999;
    }
`;

// Inject dynamic styles
const styleElement = document.createElement('style');
styleElement.textContent = dynamicStyles;
document.head.appendChild(styleElement);