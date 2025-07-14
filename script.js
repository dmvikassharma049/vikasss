// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    initializeNavigation();
    initializeScrollAnimations();
    initializeForms();
    initializeModals();
    initializeSkillBars();
});

// Initialize Lucide icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Change navbar background on scroll
    window.addEventListener('scroll', debounce(function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }, 10));
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.why-card, .service-card, .case-study, .testimonial, .service-detailed');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width') || skillBar.style.width;
                skillBar.style.width = width;
                skillObserver.unobserve(skillBar);
            }
        });
    });
    
    skillBars.forEach(bar => {
        bar.style.width = '0';
        skillObserver.observe(bar);
    });
}

// Form handling
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    const consultationForms = document.querySelectorAll('.consultation-form');
    consultationForms.forEach(form => {
        form.addEventListener('submit', handleConsultationForm);
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i data-lucide="loader"></i> Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('🎉 Thank you! Your message has been sent. I\'ll get back to you within 24 hours.', 'success');
        e.target.reset();
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        initializeLucideIcons();
        
        // Track event
        trackEvent('contact_form_submit', {
            service: data.services,
            has_business: !!data.business
        });
    }, 2000);
}

function handleConsultationForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i data-lucide="loader"></i> Scheduling...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('📅 Consultation scheduled! I\'ll send you a calendar invite shortly.', 'success');
        e.target.reset();
        closeModal('consultation-modal');
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        initializeLucideIcons();
        
        // Track event
        trackEvent('consultation_booked', {
            preferred_time: data.time || 'not_specified'
        });
    }, 2000);
}

// Modal functionality
function initializeModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track modal open
        trackEvent('modal_opened', { modal_id: modalId });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Track section navigation
        trackEvent('section_navigation', { section: sectionId });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Initialize icons for the notification
    initializeLucideIcons();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Additional functionality
function downloadBrochure() {
    showNotification('📥 Service brochure download will be available soon!', 'info');
    trackEvent('brochure_download_attempt');
}

function showMoreCaseStudies() {
    showNotification('📈 More detailed case studies coming soon!', 'info');
    trackEvent('case_studies_request');
}

function requestReference() {
    showNotification('📨 Reference request feature coming soon! Please contact me directly.', 'info');
    trackEvent('reference_request');
}

// Analytics and tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    
    // Add timestamp
    properties.timestamp = new Date().toISOString();
    properties.page_url = window.location.href;
    
    // Here you would integrate with your analytics service
    // Examples: Google Analytics, Mixpanel, etc.
    
    // Google Analytics 4 example:
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Facebook Pixel example:
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }
}

// Track button clicks for analytics
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('button_click', { 
            button_text: buttonText,
            button_type: e.target.classList.contains('btn-primary') ? 'primary' : 'secondary'
        });
    }
});

// Performance optimization
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

// Lazy loading for images (if any are added later)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
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
}

// Initialize lazy loading
initializeLazyLoading();

// Add smooth scrolling behavior for all internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Page visibility tracking
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        trackEvent('page_hidden');
    } else {
        trackEvent('page_visible');
    }
});

// Scroll depth tracking
let maxScrollDepth = 0;
window.addEventListener('scroll', debounce(function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
            trackEvent('scroll_depth_25');
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
            trackEvent('scroll_depth_50');
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
            trackEvent('scroll_depth_75');
        } else if (maxScrollDepth >= 100) {
            trackEvent('scroll_depth_100');
        }
    }
}, 500));

// Time on page tracking
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', { seconds: timeOnPage });
});

// Error tracking
window.addEventListener('error', function(e) {
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Console welcome message
console.log(`
🚀 Welcome to Vikas Sharma's Digital Marketing Website!
📧 Contact: yourname@example.com
📞 Phone: +91-XXXXXXXXXX
💼 Services: SEO, Google Ads, Meta Ads, Performance Marketing

Built with modern web technologies for optimal performance.
`);

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ Website initialized successfully!');
        trackEvent('page_loaded');
    });
} else {
    console.log('✅ Website initialized successfully!');
    trackEvent('page_loaded');
}
