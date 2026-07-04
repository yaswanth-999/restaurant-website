// ===============================
// Terra Kitchen Utility Functions
// ===============================

// Automatically detect API URL
const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : `${window.location.origin}/api`;

// ===============================
// Generic API Function
// ===============================
async function apiCall(endpoint, options = {}) {

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);

    const headers = {
        "Content-Type": "application/json"
    };

    const token = localStorage.getItem("adminToken");

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {

            let message = "Something went wrong";

            try {
                const error = await response.json();
                message = error.message || message;
            } catch {
                message = response.statusText;
            }

            throw new Error(message);
        }

        return await response.json();

    } catch (error) {

        clearTimeout(timeout);

        if (error.name === "AbortError") {
            throw new Error("Request timed out.");
        }

        throw error;
    }
}

// ===============================
// Price Formatter
// ===============================
function formatPrice(price) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(price);

}

// ===============================
// Notification
// ===============================
function showNotification(message, type = "success") {

    console.log(`[${type.toUpperCase()}]`, message);

    const notification = document.createElement("div");

    notification.className = `notification ${type}`;

    notification.textContent = message;

    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "12px 18px";
    notification.style.borderRadius = "8px";
    notification.style.background =
        type === "success"
            ? "#4CAF50"
            : "#E53935";

    notification.style.color = "#fff";
    notification.style.zIndex = "9999";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);

}

// ===============================
// Scroll Reveal
// ===============================
function setupScrollReveal() {

    const elements = document.querySelectorAll(
        ".menu-item, .about-content, .reservation-container"
    );

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    });

    elements.forEach(el => {

        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "0.5s ease";

        observer.observe(el);

    });

}

// ===============================
// Email Validation
// ===============================
function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

// ===============================
// Phone Validation
// ===============================
function validatePhone(phone) {

    return /^[0-9]{10}$/.test(phone);

}

// ===============================
// Date Validation
// ===============================
function validateDate(date) {

    return new Date(date) > new Date();

}