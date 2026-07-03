// Terra Kitchen - Utility Functions
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://terra-kitchen-api.onrender.com/api';

// API Helper
async function apiCall(endpoint, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('adminToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }

  return response.json();
}

// Form Validation
function validateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
}

function validateDate(dateString) {
  const date = new Date(dateString);
  return date > new Date();
}

// Error Handler
function handleFormError(form, error) {
  console.error('[ERROR]', error);
  const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
  
  // Show error notification
  showNotification(errorMsg, 'error');
}

// Notification System
function showNotification(message, type = 'success') {
  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    background: ${type === 'success' ? '#4caf50' : '#f44336'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}

// Format Price in INR
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
}

// Format Date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Scroll Reveal Animation
function setupScrollReveal() {
  const elements = document.querySelectorAll('.menu-item, .form-group, .about-content');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
}

// Debounce Function
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
