// Terra Kitchen - Contact Form

class ContactManager {
  constructor() {
    this.form = document.getElementById('contact-form');
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateForm() {
    const name = document.getElementById('con-name');
    const email = document.getElementById('con-email');
    const phone = document.getElementById('con-phone');
    const message = document.getElementById('con-message');

    let isValid = true;

    // Clear previous errors
    this.form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });

    // Validate name
    if (name.value.length < 3) {
      this.showError(name, 'Name must be at least 3 characters');
      isValid = false;
    }

    // Validate email
    if (!validateEmail(email.value)) {
      this.showError(email, 'Please enter a valid email');
      isValid = false;
    }

    // Validate phone (if provided)
    if (phone.value && !validatePhone(phone.value)) {
      this.showError(phone, 'Phone must be 10 digits');
      isValid = false;
    }

    // Validate message
    if (message.value.length < 10) {
      this.showError(message, 'Message must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  }

  showError(field, errorMessage) {
    const group = field.parentElement;
    group.classList.add('error');
    const errorSpan = group.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    const submitBtn = document.getElementById('con-submit-btn');
    submitBtn.disabled = true;
    const spinner = submitBtn.querySelector('.spinner');
    spinner.classList.remove('hidden');

    try {
      const formData = {
        name: document.getElementById('con-name').value,
        email: document.getElementById('con-email').value,
        phone: document.getElementById('con-phone').value,
        message: document.getElementById('con-message').value
      };

      const response = await apiCall('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.success) {
        this.form.style.display = 'none';
        const successDiv = document.getElementById('contact-success');
        successDiv.classList.remove('hidden');
        showNotification('Message sent successfully!', 'success');
      } else {
        showNotification(response.message || 'Failed to send message', 'error');
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to send message', 'error');
      submitBtn.disabled = false;
      spinner.classList.add('hidden');
    }
  }
}

const contactManager = new ContactManager();
