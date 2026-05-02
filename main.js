// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll('.fade-in-up');
animatedElements.forEach(el => observer.observe(el));

// Form Submission handling
const rideForm = document.getElementById('rideForm');
if (rideForm) {
  rideForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = rideForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending...';
    btn.disabled = true;

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      rideForm
    )
      .then(() => {
        btn.textContent = 'Request Sent!';
        btn.style.background = '#4CAF50';
        btn.style.color = 'white';
        
        setTimeout(() => {
          rideForm.reset();
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }, (error) => {
        console.error('FAILED...', error);
        btn.textContent = 'Error! Try Again.';
        btn.style.background = '#f44336';
        btn.style.color = 'white';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      });
  });
}
