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
  rideForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = rideForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = {
      name: rideForm.name.value,
      phone: rideForm.phone.value,
      service: rideForm.service.value,
      date: rideForm.date.value,
      details: rideForm.details.value,
    };

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      btn.textContent = 'Error! Try Again.';
      btn.style.background = '#f44336';
      btn.style.color = 'white';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }
  });
}
