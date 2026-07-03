// Terra Kitchen - Reservation System

class ReservationManager {
  constructor() {
    this.form = document.getElementById('reservation-form');
    this.rzpKey = 'rzp_test_YOUR_KEY_HERE'; // Will be set from server
  }

  init() {
    // Set minimum date to today
    const dateInput = document.getElementById('res-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateForm() {
    const name = document.getElementById('res-name');
    const email = document.getElementById('res-email');
    const phone = document.getElementById('res-phone');
    const date = document.getElementById('res-date');
    const time = document.getElementById('res-time');
    const guests = document.getElementById('res-guests');

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

    // Validate phone
    if (!validatePhone(phone.value)) {
      this.showError(phone, 'Phone must be 10 digits');
      isValid = false;
    }

    // Validate date
    if (!validateDate(date.value)) {
      this.showError(date, 'Date cannot be in the past');
      isValid = false;
    }

    // Validate time
    if (!time.value) {
      this.showError(time, 'Time is required');
      isValid = false;
    }

    // Validate guests
    const guestCount = parseInt(guests.value);
    if (guestCount < 1 || guestCount > 20) {
      this.showError(guests, 'Guests must be between 1 and 20');
      isValid = false;
    }

    return isValid;
  }

  showError(field, message) {
    const group = field.parentElement;
    group.classList.add('error');
    const errorSpan = group.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    const submitBtn = document.getElementById('res-submit-btn');
    submitBtn.disabled = true;

    try {
      const formData = {
        name: document.getElementById('res-name').value,
        email: document.getElementById('res-email').value,
        phone: document.getElementById('res-phone').value,
        date: document.getElementById('res-date').value,
        time: document.getElementById('res-time').value,
        guests: parseInt(document.getElementById('res-guests').value),
        specialRequests: document.getElementById('res-requests').value
      };

      const response = await apiCall('/reservations', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.success) {
        // Initiate Razorpay payment
        this.initiateRazorpayPayment(response.data);
      } else {
        showNotification(response.message || 'Reservation failed', 'error');
        submitBtn.disabled = false;
      }
    } catch (error) {
      showNotification(error.message || 'Failed to create reservation', 'error');
      submitBtn.disabled = false;
    }
  }

  initiateRazorpayPayment(reservationData) {
    const options = {
      key: this.rzpKey,
      amount: reservationData.razorpayOrder.amount,
      currency: 'INR',
      name: 'Terra Kitchen',
      description: `Reservation for ${reservationData.reservation.guests} guests`,
      order_id: reservationData.razorpayOrder.orderId,
      handler: (response) => this.handlePaymentSuccess(response, reservationData.reservation),
      prefill: {
        name: reservationData.reservation.name,
        email: reservationData.reservation.email,
        contact: reservationData.reservation.phone
      },
      theme: {
        color: '#8B4513'
      },
      modal: {
        ondismiss: () => {
          document.getElementById('res-submit-btn').disabled = false;
          showNotification('Payment cancelled', 'error');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  async handlePaymentSuccess(paymentResponse, reservation) {
    try {
      const verifyResponse = await apiCall('/reservations/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature
        })
      });

      if (verifyResponse.success) {
        // Show success message
        this.form.style.display = 'none';
        const successDiv = document.getElementById('reservation-success');
        successDiv.classList.remove('hidden');
        document.getElementById('res-id').textContent = verifyResponse.data._id;
        showNotification('Reservation confirmed!', 'success');
      } else {
        showNotification('Payment verification failed', 'error');
        document.getElementById('res-submit-btn').disabled = false;
      }
    } catch (error) {
      showNotification('Failed to verify payment', 'error');
      document.getElementById('res-submit-btn').disabled = false;
    }
  }
}

const reservationManager = new ReservationManager();
