
/**
 * Wilde By Design - Interactive Scripts (wilde-2-scripts.js)
 * Custom JavaScript for enhanced user interactions
 */

// Touch/Device Detection - Run immediately (before DOM ready)
(function() {
    const html = document.documentElement;
    const modPrefix = ' mod-';
    
    // Add JavaScript support class
    html.className += modPrefix + 'js';
    
    // Detect touch capabilities
    if ('ontouchstart' in window || 
        (window.DocumentTouch && document instanceof window.DocumentTouch) ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0) {
        html.className += modPrefix + 'touch';
        
        // Store touch capability for later use
        window.WildeDevice = window.WildeDevice || {};
        window.WildeDevice.isTouch = true;
    } else {
        window.WildeDevice = window.WildeDevice || {};
        window.WildeDevice.isTouch = false;
    }
    
    // Detect device type based on screen size and touch
    function detectDeviceType() {
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;
        
        // Remove existing device classes
        html.classList.remove('mod-mobile', 'mod-tablet', 'mod-desktop');
        
        if (width <= 479) {
            html.classList.add('mod-mobile');
            window.WildeDevice.type = 'mobile';
        } else if (width <= 991) {
            html.classList.add('mod-tablet');
            window.WildeDevice.type = 'tablet';
        } else {
            html.classList.add('mod-desktop');
            window.WildeDevice.type = 'desktop';
        }
        
        // Add orientation classes
        html.classList.remove('mod-portrait', 'mod-landscape');
        if (height > width) {
            html.classList.add('mod-portrait');
            window.WildeDevice.orientation = 'portrait';
        } else {
            html.classList.add('mod-landscape');
            window.WildeDevice.orientation = 'landscape';
        }
    }
    
    // Initial device detection
    detectDeviceType();
    
    // Update on resize/orientation change
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(detectDeviceType, 100);
    });
    
    // Listen for orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(detectDeviceType, 100);
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    
    // Alert bar close functionality
    const alertCloseBtn = document.querySelector('.alert-bar-close-link');
    const alertBar = document.querySelector('.topbar-wrap');
    
    if (alertCloseBtn && alertBar) {
        alertCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alertBar.style.display = 'none';
        });
    }
    
    // Dropdown menu accessibility improvements
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.parentElement;
        const dropdownList = dropdown.querySelector('.dropdown-list');
        
        if (dropdownList) {
            // Keyboard navigation
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(dropdown, dropdownList, toggle);
                } else if (e.key === 'Escape') {
                    closeDropdown(dropdown, dropdownList, toggle);
                }
            });
            
            // Click to toggle
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDropdown(dropdown, dropdownList, toggle);
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    closeDropdown(dropdown, dropdownList, toggle);
                }
            });
        }
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Image lazy loading fallback for older browsers
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Form validation helper (if forms are added later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Shopping cart quantity update (placeholder for future functionality)
    function updateCartQuantity(quantity) {
        const cartQuantityElement = document.querySelector('.navbar-cart-quantity');
        if (cartQuantityElement) {
            cartQuantityElement.textContent = quantity;
        }
    }
    
    // Device-specific functionality
    function initTouchInteractions() {
        if (window.WildeDevice?.isTouch) {
            // Add touch-specific event listeners
            document.addEventListener('touchstart', function() {
                // Enable :active states on touch devices
                document.body.classList.add('touch-active');
            });
            
            // Improve dropdown behavior on touch devices
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('touchstart', function(e) {
                    // Prevent hover states from sticking on touch devices
                    e.stopPropagation();
                });
            });
        }
    }
    
    // Initialize touch interactions
    initTouchInteractions();
    
    // Expose utility functions globally if needed
    window.WildeUtils = {
        validateEmail,
        updateCartQuantity,
        // Device detection utilities
        isTouch: () => window.WildeDevice?.isTouch || false,
        isMobile: () => window.WildeDevice?.type === 'mobile',
        isTablet: () => window.WildeDevice?.type === 'tablet',
        isDesktop: () => window.WildeDevice?.type === 'desktop',
        getOrientation: () => window.WildeDevice?.orientation || 'landscape',
        getDeviceType: () => window.WildeDevice?.type || 'desktop'
    };
});

// Dropdown helper functions
function toggleDropdown(dropdown, dropdownList, toggle) {
    const isOpen = dropdownList.style.display === 'block';
    
    if (isOpen) {
        closeDropdown(dropdown, dropdownList, toggle);
    } else {
        openDropdown(dropdown, dropdownList, toggle);
    }
}

function openDropdown(dropdown, dropdownList, toggle) {
    dropdownList.style.display = 'block';
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('dropdown-open');
    
    // Focus first link in dropdown
    const firstLink = dropdownList.querySelector('a');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
    }
}

function closeDropdown(dropdown, dropdownList, toggle) {
    dropdownList.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('dropdown-open');
}

// Performance optimization: Debounce scroll events
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

// Scroll-based animations (optional enhancement)
const handleScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (scrolled > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
}, 10);

window.addEventListener('scroll', handleScroll);
