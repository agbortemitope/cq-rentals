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

const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in');
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

    const formData = new FormData(rideForm);
    const data = Object.fromEntries(formData.entries());
    
    // Add custom FormSubmit fields
    data['_subject'] = `New Booking Request from ${data.name}`;
    data['_template'] = 'table';

    const submitToBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (response.ok) return await response.json();
        throw new Error('Backend failed');
      } catch (err) {
        // Fallback to FormSubmit
        const response = await fetch('https://formsubmit.co/ajax/Crownqualityrentals@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok || result.success === 'false' || result.success === false) {
          throw new Error(result.message || `Server error: ${response.status}`);
        }
        return result;
      }
    };

    submitToBackend()
      .then(result => {
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
      })
      .catch((error) => {
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
