
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

// Scroll Animation System using Intersection Observer
function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - show all elements
        const animatedElements = document.querySelectorAll('[class*="scroll-animate"], [class*="scroll-stagger"], [class*="scroll-slide"]');
        animatedElements.forEach(el => el.classList.add('animate-in'));
        return;
    }

    // Configuration for the intersection observer
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom of viewport
        threshold: [0, 0.1, 0.3] // Multiple thresholds for different trigger points
    };

    // Create intersection observer
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            
            // Check if element is intersecting and has crossed our threshold
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                // Add animation class
                element.classList.add('animate-in');
                
                // Stop observing this element once animated (optional - removes for performance)
                scrollObserver.unobserve(element);
                
                // Dispatch custom event for any additional functionality
                element.dispatchEvent(new CustomEvent('scrollAnimateIn', {
                    detail: { element, entry }
                }));
            }
        });
    }, observerOptions);

    // Find all elements with scroll animation classes
    const scrollAnimateElements = document.querySelectorAll(`
        .scroll-animate,
        .scroll-animate-scale,
        .scroll-animate-fade,
        .scroll-stagger,
        .scroll-slide-left,
        .scroll-slide-right
    `);

    // Start observing each element
    scrollAnimateElements.forEach(element => {
        // Ensure element starts hidden (in case CSS didn't load properly)
        if (!element.classList.contains('animate-in')) {
            scrollObserver.observe(element);
        }
    });

    // Store observer reference for potential cleanup
    window.WildeScrollObserver = scrollObserver;
}

// Enhanced scroll animations with performance optimization
const initAdvancedScrollAnimations = debounce(() => {
    // Only initialize if elements exist
    const hasScrollAnimations = document.querySelector('[class*="scroll-animate"], [class*="scroll-stagger"], [class*="scroll-slide"]');
    if (hasScrollAnimations) {
        initScrollAnimations();
    }
}, 100);

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', initAdvancedScrollAnimations);

// Re-initialize if new content is added dynamically (useful for future features)
window.reinitScrollAnimations = function() {
    if (window.WildeScrollObserver) {
        window.WildeScrollObserver.disconnect();
    }
    initScrollAnimations();
};

// Side Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const sideMenuToggle = document.getElementById('side-menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const sideMenuClose = document.getElementById('side-menu-close');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');

    function openSideMenu() {
        sideMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeSideMenu() {
        sideMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (sideMenuToggle) {
        sideMenuToggle.addEventListener('click', openSideMenu);
    }

    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', closeSideMenu);
    }

    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', closeSideMenu);
    }

    // Close side menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }
    });

    // Expose side menu functions globally
    window.SideMenu = {
        open: openSideMenu,
        close: closeSideMenu
    };

    // Initialize contact form
    initializeContactForm();
});

// Contact Form Functionality
function initializeContactForm() {
  const fileInput = document.getElementById('file-upload');
  const uploadDisplay = document.querySelector('.file-upload-display');
  const uploadText = document.querySelector('.upload-text');
  const contactForm = document.getElementById('contact-form');

  if (!fileInput || !uploadDisplay || !uploadText) return;

  // File upload handling
  fileInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      if (files.length === 1) {
        uploadText.textContent = fileNames[0];
      } else {
        uploadText.textContent = `${files.length} files selected`;
      }
      uploadDisplay.style.borderColor = 'var(--color-primary)';
      uploadDisplay.style.background = 'rgba(163, 177, 138, 0.1)';
    } else {
      uploadText.textContent = 'Choose files or drag & drop';
      uploadDisplay.style.borderColor = '#d0d0d0';
      uploadDisplay.style.background = '#fafafa';
    }
  });

  // Drag and drop functionality
  uploadDisplay.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadDisplay.style.borderColor = 'var(--color-primary)';
    uploadDisplay.style.background = 'rgba(163, 177, 138, 0.1)';
  });

  uploadDisplay.addEventListener('dragleave', function(e) {
    e.preventDefault();
    if (!fileInput.files.length) {
      uploadDisplay.style.borderColor = '#d0d0d0';
      uploadDisplay.style.background = '#fafafa';
    }
  });

  uploadDisplay.addEventListener('drop', function(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    fileInput.files = files;
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  });

  // Form submission handling
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const projectDetails = formData.get('project-details');
      
      // Basic validation
      if (!name || !email || !projectDetails) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Here you would typically send the data to your server
      // For now, we'll just show a success message
      alert('Thank you for your quote request! We\'ll get back to you within 24 hours.');
      
      // Reset form
      contactForm.reset();
      uploadText.textContent = 'Choose files or drag & drop';
      uploadDisplay.style.borderColor = '#d0d0d0';
      uploadDisplay.style.background = '#fafafa';
    });
  }
}
