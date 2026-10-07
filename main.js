import contact from './contact.json';

document.querySelectorAll('[data-contact-phone]').forEach((element) => {
  element.textContent = contact.phone;
  if (element instanceof HTMLAnchorElement) {
    element.href = `tel:${contact.phone.replace(/\D/g, '')}`;
  }
});

document.querySelectorAll('[data-contact-email]').forEach((element) => {
  element.textContent = contact.email;
  if (element instanceof HTMLAnchorElement) {
    element.href = `mailto:${contact.email}`;
  }
});

document.querySelectorAll('[data-contact-instagram]').forEach((link) => {
  link.href = contact.instagram.url;
  link.querySelectorAll('[data-contact-instagram-handle]').forEach((handle) => {
    handle.textContent = contact.instagram.handle;
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const scrollObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in');
animatedElements.forEach(el => scrollObserver.observe(el));

// Form Submission handling
const rideForm = document.getElementById('rideForm');
if (rideForm) {
  rideForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = rideForm.querySelector('button[type="submit"]');
    if (!btn) return;
    
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(rideForm);
    const data = Object.fromEntries(formData.entries());
    
    // Add custom FormSubmit fields for better email formatting
    data['_subject'] = `New Booking Request from ${data.name}`;
    data['_template'] = 'table';
    data['_captcha'] = 'false'; // Disable captcha for AJAX submissions

    try {
      const recipient = contact.bookingRecipient || contact.email;
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
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
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
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
