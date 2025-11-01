// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
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

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Animated counter for statistics (if added later)
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Add hover effect to cards
document.querySelectorAll('.user-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
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

// Dynamic greeting based on time of day
function setGreeting() {
    const hour = new Date().getHours();
    const tagline = document.querySelector('.tagline');
    
    if (tagline) {
        let greeting = 'Connecting Farmers & Merchants for Better Trade';
        
        if (hour < 12) {
            greeting = '🌅 Good Morning! ' + greeting;
        } else if (hour < 18) {
            greeting = '☀️ Good Afternoon! ' + greeting;
        } else {
            greeting = '🌙 Good Evening! ' + greeting;
        }
        
        // Uncomment below to enable time-based greeting
        // tagline.textContent = greeting;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // setGreeting();
    
    // Add fade-in animation to elements
    const animateElements = document.querySelectorAll('.user-card, .feature-item, .step');
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add loading state handler
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Handle navigation based on user role (from URL parameters)
function handleRoleNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    
    if (role === 'farmer') {
        // Highlight farmer section
        document.querySelector('.farmer-card')?.classList.add('highlighted');
    } else if (role === 'merchant') {
        // Highlight merchant section
        document.querySelector('.merchant-card')?.classList.add('highlighted');
    }
}

// Check if user is already logged in
function checkUserSession() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
        // User is logged in, show dashboard link
        const hero = document.querySelector('.hero-content');
        if (hero) {
            const dashboardBtn = document.createElement('button');
            dashboardBtn.className = 'btn btn-primary';
            dashboardBtn.textContent = 'Go to Dashboard';
            dashboardBtn.onclick = () => {
                if (userRole === 'farmer') {
                    location.href = 'farmer-dashboard.html';
                } else if (userRole === 'merchant') {
                    location.href = 'merchant-dashboard.html';
                }
            };
            
            // Add dashboard button (optional feature)
            // hero.appendChild(dashboardBtn);
        }
    }
}

// Initialize
handleRoleNavigation();
checkUserSession();

// Add scroll-to-top button functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.transform = 'scale(1)';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.transform = 'scale(0.8)';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Add typing effect to tagline (optional feature)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect
// const tagline = document.querySelector('.tagline');
// if (tagline) {
//     const originalText = tagline.textContent;
//     typeWriter(tagline, originalText, 50);
// }

// Performance optimization: Lazy load images if any are added
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('🌾 AgreTrade Home Page Loaded Successfully!');
