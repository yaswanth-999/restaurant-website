// ===============================
// Terra Kitchen Utility Functions
// ===============================

// Automatically detect API URL
const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : `${window.location.origin}/api`;


// Generic API Function
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
            } catch (err) {
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