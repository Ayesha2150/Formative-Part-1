// =======================
// General Website JS
// =======================

// 1. Highlight active navigation link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// 2. Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =======================
// 3. SEARCH FUNCTIONALITY FOR ADOPT PAGE
// =======================
function implementSearch() {
  const adoptGallery = document.querySelector('.adopt-gallery');
  if (adoptGallery && !document.getElementById('petSearch')) {
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
      max-width: 600px;
      margin: 30px auto;
      padding: 0 20px;
      text-align: center;
    `;
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.id = 'petSearch';
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Search pets by name, breed, or description...';
    searchInput.style.cssText = `
      width: 100%;
      padding: 15px 20px;
      border: 2px solid var(--medium-gray);
      border-radius: 25px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: var(--shadow);
    `;
    
    // Create results counter
    const resultsCounter = document.createElement('div');
    resultsCounter.id = 'resultsCounter';
    resultsCounter.style.cssText = `
      margin: 15px 0;
      color: var(--dark-gray);
      font-weight: 600;
    `;
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(resultsCounter);
    adoptGallery.parentNode.insertBefore(searchContainer, adoptGallery);
    
    // Search functionality
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const petCards = document.querySelectorAll('.pet-card');
      let visibleCount = 0;
      
      petCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const isVisible = cardText.includes(searchTerm);
        
        if (isVisible) {
          card.style.display = 'block';
          visibleCount++;
          // Add highlight animation
          card.style.animation = 'highlight 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Update results counter
      resultsCounter.textContent = searchTerm ? 
        `Found ${visibleCount} pet${visibleCount !== 1 ? 's' : ''} matching "${searchTerm}"` : 
        `Showing all ${petCards.length} available pets`;
      
      // Remove animation after it completes
      setTimeout(() => {
        petCards.forEach(card => card.style.animation = '');
      }, 500);
    });
    
    // Initialize results counter
    const initialCount = document.querySelectorAll('.pet-card').length;
    resultsCounter.textContent = `Showing all ${initialCount} available pets`;
  }
}

// =======================
// 4. IMAGE MODAL - FIXED VERSION
// =======================
document.addEventListener('DOMContentLoaded', function() {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <img id="modalImage" src="" alt="">
      <div class="modal-nav">
        <button class="modal-arrow" id="prevBtn">&#10094;</button>
        <button class="modal-arrow" id="nextBtn">&#10095;</button>
      </div>
      <div class="modal-caption" id="modalCaption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = modal.querySelector('.modal-close');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentImages = [];
  let currentIndex = 0;

  // Make all images clickable
  const allImages = document.querySelectorAll('.pet-card img, .gallery-grid img, .education-content img, .highlight img');
  
  allImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      // Get all images in the current section
      const container = this.closest('.adopt-gallery, .gallery-grid, .education-content, .highlights');
      let images = [];
      
      if (container) {
        images = Array.from(container.querySelectorAll('img'));
      } else {
        images = [this];
      }
      
      // Filter only loaded images
      currentImages = images.filter(img => img.complete && img.naturalHeight !== 0);
      currentIndex = currentImages.indexOf(this);
      
      if (currentIndex !== -1) {
        openModal();
      }
    });
  });

  function openModal() {
    const img = currentImages[currentIndex];
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    
    // Get caption from image alt or card title
    let captionText = img.alt || 'Image';
    const card = img.closest('.pet-card, .highlight');
    if (card) {
      const title = card.querySelector('h3, h4')?.textContent;
      if (title) captionText = title;
    }
    
    modalCaption.textContent = captionText;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show/hide arrows based on number of images
    if (currentImages.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    openModal();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    openModal();
  }

  // Event listeners
  modalClose.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Close modal when clicking outside image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});

// =======================
// 5. ENHANCED FORM VALIDATION
// =======================
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Enhanced validation
    const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
        // Add error message
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'This field is required';
          errorMsg.style.cssText = 'color: red; font-size: 0.9rem; margin-top: 5px;';
          input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
      } else {
        input.style.borderColor = '';
        // Remove error message
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      }
      
      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          input.style.borderColor = 'red';
          if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter a valid email address';
            errorMsg.style.cssText = 'color: red; font-size: 0.9rem; margin-top: 5px;';
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
          }
        }
      }
      
      // Phone validation
      if (input.type === 'tel' && input.value) {
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (!phoneRegex.test(input.value)) {
          isValid = false;
          input.style.borderColor = 'red';
          if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter a valid phone number';
            errorMsg.style.cssText = 'color: red; font-size: 0.9rem; margin-top: 5px;';
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
          }
        }
      }
    });
    
    if (isValid) {
      // AJAX simulation
      const formData = new FormData(this);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
      
      console.log('Form submitted:', formDataObj);
      
      // Simulate AJAX call
      setTimeout(() => {
        // Show success message for general forms
        if (!this.id) {
          alert('Thank you! Your form has been submitted successfully.');
        }
        this.reset();
      }, 500);
    }
  });
});

// =======================
// 6. ENQUIRY FORM HANDLING
// =======================
document.addEventListener('DOMContentLoaded', function() {
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const responseDiv = document.getElementById('enquiryResponse');
      if (responseDiv) {
        responseDiv.innerHTML = `
          <h3 style="color: #155724; margin-bottom: 15px;">Thank You for Your Enquiry!</h3>
          <p style="margin-bottom: 10px;">We've received your message and we're excited to help you!</p>
          <p style="margin-bottom: 10px;">Our team will review your enquiry and get back to you within 24 hours with all the information you need.</p>
          <p style="font-weight: bold; color: #1e3a8a;">We appreciate you reaching out to make a difference for animals in need!</p>
        `;
        responseDiv.style.display = 'block';
        responseDiv.style.backgroundColor = '#d4edda';
        responseDiv.style.color = '#155724';
        responseDiv.style.border = '2px solid #c3e6cb';
      }
      
      this.reset();
    });
  }
});

// =======================
// 7. CONTACT FORM HANDLING
// =======================
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'red';
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (isValid) {
        const responseDiv = document.getElementById('contactResponse');
        if (responseDiv) {
          responseDiv.innerHTML = `
            <h3 style="color: #155724; margin-bottom: 15px;">Message Sent Successfully!</h3>
            <p style="margin-bottom: 10px;">Thank you for contacting SPCA Cape of Good Hope.</p>
            <p style="margin-bottom: 10px;">We have received your message and will get back to you within 24 hours.</p>
            <p style="font-weight: bold; color: #1e3a8a;">Your support means the world to the animals we care for!</p>
          `;
          responseDiv.style.display = 'block';
          responseDiv.style.backgroundColor = '#d4edda';
          responseDiv.style.color = '#155724';
          responseDiv.style.border = '2px solid #c3e6cb';
        }
        
        // Simulate email sending
        console.log('Contact form data:', {
          name: document.getElementById('name')?.value,
          email: document.getElementById('email')?.value,
          phone: document.getElementById('phone')?.value,
          messageType: document.getElementById('messageType')?.value,
          subject: document.getElementById('subject')?.value,
          message: document.getElementById('message')?.value
        });
        
        this.reset();
      }
    });
  }
});

// =======================
// 8. INITIALIZE SEARCH ON ADOPT PAGE
// =======================
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('adopt.html')) {
    implementSearch();
  }
});

// =======================
// 9. ANIMATIONS
// =======================
const highlightAnimation = `
@keyframes highlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
  100% { transform: scale(1); }
}
`;

// Add animation to style
const styleSheet = document.createElement('style');
styleSheet.textContent = highlightAnimation;
document.head.appendChild(styleSheet);