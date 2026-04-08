// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// CTA Button functionality
const getStartedBtns = document.querySelectorAll('.btn-primary, .btn-primary-large');
const exploreBtns = document.querySelectorAll('.btn-secondary, .btn-secondary-large');

getStartedBtns.forEach(btn => {
    if (btn.textContent.includes('Get Started') || btn.textContent.includes('Join Now')) {
        btn.addEventListener('click', () => {
            showModal('signup');
        });
    }
});

exploreBtns.forEach(btn => {
    if (btn.textContent.includes('Explore')) {
        btn.addEventListener('click', () => {
            document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Waitlist form submission
const waitlistForm = document.querySelector('.waitlist-form');
if (waitlistForm) {
    const input = waitlistForm.querySelector('input');
    const button = waitlistForm.querySelector('.btn');
    
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value;
        if (email && email.includes('@')) {
            alert(`Great! You've been added to the waitlist. Check your email at ${email}`);
            input.value = '';
        } else {
            alert('Please enter a valid college email');
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            button.click();
        }
    });
}

// Login button
document.querySelector('.btn-login')?.addEventListener('click', () => {
    showModal('login');
});

// Modal placeholder (you can expand this later)
function showModal(type) {
    alert(`${type === 'signup' ? 'Sign Up' : 'Log In'} functionality coming soon!`);
}

// Add active state to navbar links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#7c3aed';
        } else {
            link.style.color = '#333';
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card, .problem-card, .solution-card, .feature-card, .subscription-card, .testimonial-card, .why-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Log to console for debugging
console.log('Subsync website loaded successfully!');
