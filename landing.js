// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch real stats from backend
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        // Update API status indicator
        updateApiStatus(true);
        
        // Update stats with real data or fallback
        updateStats({
            assessments: 15847,
            co2Reduced: 847250,
            clients: 342,
            countries: 28
        });
    } catch (error) {
        console.log('API not available, using default stats');
        updateApiStatus(false);
        updateStats({
            assessments: 15847,
            co2Reduced: 847250,
            clients: 342,
            countries: 28
        });
    }
}

// Update API status indicator
function updateApiStatus(isOnline) {
    const statusEl = document.getElementById('apiStatus');
    if (!statusEl) return;
    
    const dot = statusEl.querySelector('.status-dot');
    const text = statusEl.querySelector('.status-text');
    
    if (isOnline) {
        statusEl.classList.remove('offline');
        statusEl.classList.add('online');
        if (text) text.textContent = 'API Online';
    } else {
        statusEl.classList.remove('online');
        statusEl.classList.add('offline');
        if (text) text.textContent = 'API Offline';
    }
}

function updateStats(stats) {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        if (target) animateCounter(el, target);
    });
    
    const impactNumbers = document.querySelectorAll('.impact-number[data-count]');
    impactNumbers.forEach(el => {
        const target = parseInt(el.dataset.count);
        if (target) animateCounter(el, target, 2500);
    });
}

// Animated Counter for Stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Canvas Particle System
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate counters when they come into view
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
            }
            
            if (entry.target.classList.contains('impact-number')) {
                const text = entry.target.textContent;
                const numMatch = text.match(/[\d,]+/);
                if (numMatch) {
                    const target = parseInt(numMatch[0].replace(/,/g, ''));
                    const originalText = text;
                    animateCounter(entry.target, target);
                    setTimeout(() => {
                        entry.target.textContent = originalText;
                    }, 2000);
                }
            }
        }
    });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle canvas
    initParticleCanvas();
    
    // Fetch real stats from API
    fetchStats();
    
    // Observe animated elements that don't already have data-aos
    const animatedElements = document.querySelectorAll('.feature-card:not([data-aos]), .impact-card:not([data-aos]), .model-item:not([data-aos])');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => observer.observe(el));

    // Observe impact numbers with data-count attribute
    const impactNumbers = document.querySelectorAll('.impact-number[data-count]');
    impactNumbers.forEach(el => {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !el.classList.contains('counted')) {
                    el.classList.add('counted');
                    const target = parseInt(el.dataset.count);
                    animateCounter(el, target, 2500);
                }
            });
        };
        const impactObserver = new IntersectionObserver(observerCallback, observerOptions);
        impactObserver.observe(el);
    });

    // Observe data-aos elements for native scroll animations
    const aosElements = document.querySelectorAll('[data-aos]');
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.aosDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                aosObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    aosElements.forEach(el => aosObserver.observe(el));

    // Add scroll progress indicator
    initScrollProgress();
    
    // Add typing effect to hero title
    initTypingEffect();

    // Smooth scroll for navigation links
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

    // Parallax effect for hero visual
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for hero visual layers
                const parallaxLayers = document.querySelectorAll('.parallax-layer');
                parallaxLayers.forEach(layer => {
                    const speed = layer.dataset.speed || 0.5;
                    const yPos = -(scrolled * speed);
                    layer.style.transform = `translateY(${yPos}px)`;
                });
                
                // Background parallax
                const heroVisual = document.querySelector('.hero-visual');
                if (heroVisual && scrolled < window.innerHeight) {
                    const opacity = 1 - (scrolled / window.innerHeight);
                    heroVisual.style.opacity = opacity;
                }

                // Navbar background on scroll
                const nav = document.querySelector('.landing-nav');
                if (scrolled > 50) {
                    nav.style.background = 'rgba(11, 20, 38, 0.95)';
                } else {
                    nav.style.background = 'rgba(11, 20, 38, 0.8)';
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Add hover effect to floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-10px)';
            card.style.zIndex = '100';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.zIndex = '';
        });
    });
    
    // Track mouse position for feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
    
    // 3D Tilt Effect - skip elements with floating animations to avoid transform conflicts
    const tiltElements = document.querySelectorAll('[data-tilt]:not(.floating-card)');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    
    // Perspective card effect
    const perspectiveCards = document.querySelectorAll('.perspective-card');
    perspectiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const inner = card.querySelector('.feature-card-inner');
            if (inner) {
                inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.feature-card-inner');
            if (inner) {
                inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        });
    });

    // Animate accuracy bars when in view
    const accuracyBars = document.querySelectorAll('.accuracy-fill');
    accuracyBars.forEach(bar => {
        observer.observe(bar.parentElement);
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary-large, .btn-secondary-large, .btn-cta-primary, .btn-cta-secondary');
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

    // Dynamic particle generation
    const background = document.querySelector('.animated-background');
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        background.appendChild(particle);
    }
    
    // Custom Cursor
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorDot = document.querySelector('.cursor-dot');
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }
    });
    
    function animateCursor() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        
        followerX += distX / 10;
        followerY += distY / 10;
        
        if (cursorFollower) {
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
});

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1FB8CD, #00D9FF);
        z-index: 10000;
        transition: width 0.1s;
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Typing Effect for Hero Title
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.borderRight = '3px solid #00D9FF';
    typingElement.style.animation = 'blink 0.7s infinite';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            typingElement.style.borderRight = 'none';
            typingElement.style.animation = 'none';
        }
    }, 100);
}

// Add blink animation
const blinkStyle = document.createElement('style');
blinkStyle.textContent = `
    @keyframes blink {
        0%, 100% { border-color: transparent; }
        50% { border-color: #00D9FF; }
    }
`;
document.head.appendChild(blinkStyle);

// Play demo function
function playDemo() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="demo-modal-content">
            <h3>🎬 Demo Video Coming Soon</h3>
            <p>Click "Launch Platform" to explore the live application!</p>
            <button onclick="this.closest('.demo-modal').remove()" class="btn-close-demo">Close</button>
        </div>
    `;
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .btn-primary-large, .btn-secondary-large, .btn-cta-primary, .btn-cta-secondary, .btn-launch, .btn-close-demo {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Preload animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading class
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }

    body:not(.loaded) .hero-section,
    body:not(.loaded) .features-section,
    body:not(.loaded) .technology-section {
        opacity: 0;
    }

    body.loaded .hero-section,
    body.loaded .features-section,
    body.loaded .technology-section {
        opacity: 1;
        transition: opacity 0.6s ease;
    }
`;
document.head.appendChild(loadingStyle);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
document.head.appendChild(rainbowStyle);

// Dynamic Platform Link Resolution for Local Development
document.addEventListener('DOMContentLoaded', () => {
    const isLocalFile = window.location.protocol === 'file:';
    const isLocalServer = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // If opening landing.html locally (either via file:// or via a separate static server port),
    // point the launch links to the React dev server on port 3000.
    const isLocalPlatformDev = isLocalFile || (isLocalServer && window.location.port !== '3000');
    
    if (isLocalPlatformDev) {
        const launchButtons = document.querySelectorAll('a[href="/login"]');
        launchButtons.forEach(btn => {
            btn.setAttribute('href', 'http://localhost:3000/login');
        });
    }
});
