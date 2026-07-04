// ===========================================
// Terra Kitchen Reservation System
// ===========================================

class ReservationManager {

    constructor() {

        this.form = document.getElementById("reservation-form");

        this.rzpKey = "rzp_test_YOUR_KEY_HERE";

    }

    init() {

        const dateInput = document.getElementById("res-date");

        const today = new Date().toISOString().split("T")[0];

        dateInput.min = today;

        this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    }

    validateForm() {

        const name = document.getElementById("res-name");
        const email = document.getElementById("res-email");
        const phone = document.getElementById("res-phone");
        const date = document.getElementById("res-date");
        const time = document.getElementById("res-time");
        const guests = document.getElementById("res-guests");

        let valid = true;

        this.form.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("error");
        });

        if (name.value.trim().length < 3) {

            this.showError(name, "Minimum 3 characters");

            valid = false;

        }

        if (!validateEmail(email.value)) {

            this.showError(email, "Invalid Email");

            valid = false;

        }

        if (!validatePhone(phone.value)) {

            this.showError(phone, "Phone must be 10 digits");

            valid = false;

        }

        if (!validateDate(date.value)) {

            this.showError(date, "Invalid Date");

            valid = false;

        }

        if (!time.value) {

            this.showError(time, "Select Time");

            valid = false;

        }

        const guestCount = Number(guests.value);

        if (guestCount < 1 || guestCount > 20) {

            this.showError(guests, "Guests must be 1-20");

            valid = false;

        }

        return valid;

    }

    showError(field, message) {

        const group = field.parentElement;

        group.classList.add("error");

        const span = group.querySelector(".error-message");

        if (span) span.textContent = message;

    }

    async handleSubmit(e) {

        e.preventDefault();

        if (!this.validateForm()) {

            showNotification("Please correct the form.", "error");

            return;

        }

        const button = document.getElementById("res-submit-btn");

        button.disabled = true;

        button.innerHTML = "Booking...";

        try {

            const data = {

                name: document.getElementById("res-name").value,

                email: document.getElementById("res-email").value,

                phone: document.getElementById("res-phone").value,

                date: document.getElementById("res-date").value,

                time: document.getElementById("res-time").value,

                guests: Number(document.getElementById("res-guests").value),

                specialRequests:
                    document.getElementById("res-requests").value

            };

            const response = await apiCall("/reservations", {

                method: "POST",

                body: JSON.stringify(data)

            });

            if (!response.success) {

                throw new Error(response.message);

            }

            const reservation = response.data.reservation;

            const order = response.data.razorpayOrder;

            // ====================================
            // NO RAZORPAY CONFIGURED
            // ====================================

            if (!order) {

                showNotification(
                    "Reservation Booked Successfully!",
                    "success"
                );

                this.form.reset();

                button.disabled = false;

                button.innerHTML = "Book & Pay ₹500 Deposit";

                return;

            }

            // ====================================
            // OPEN RAZORPAY
            // ====================================

            this.openRazorpay(order, reservation);

        }

        catch (err) {

            console.error(err);

            showNotification(err.message, "error");

            button.disabled = false;

            button.innerHTML = "Book & Pay ₹500 Deposit";

        }

    }

    openRazorpay(order, reservation) {

        const options = {

            key: this.rzpKey,

            amount: order.amount,

            currency: order.currency,

            order_id: order.orderId,

            name: "Terra Kitchen",

            description: "Restaurant Reservation",

            prefill: {

                name: reservation.name,

                email: reservation.email,

                contact: reservation.phone

            },

            handler: (response) => {

                this.handlePaymentSuccess(response);

            },

            modal: {

                ondismiss: () => {

                    document.getElementById("res-submit-btn").disabled = false;

                }

            }

        };

        const rzp = new Razorpay(options);

        rzp.open();

    }

    async handlePaymentSuccess(payment) {

        try {

            const verify = await apiCall("/reservations/verify-payment", {

                method: "POST",

                body: JSON.stringify({

                    razorpayOrderId: payment.razorpay_order_id,

                    razorpayPaymentId: payment.razorpay_payment_id,

                    razorpaySignature: payment.razorpay_signature

                })

            });

            if (verify.success) {

                showNotification("Reservation Confirmed!", "success");

                this.form.reset();

            }

        }

        catch (err) {

            showNotification(err.message, "error");

        }

        document.getElementById("res-submit-btn").disabled = false;

    }

}

const reservationManager = new ReservationManager();