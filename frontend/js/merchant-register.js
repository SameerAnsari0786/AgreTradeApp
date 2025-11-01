// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const REGISTER_ENDPOINT = '/api/merchants/register';

// Get DOM elements
const form = document.getElementById('merchantRegistrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');

// Show alert message
function showAlert(message, type) {
    alertMessage.className = `alert ${type}`;
    alertText.textContent = message;
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

// Close alert message
function closeAlert() {
    alertMessage.classList.add('hidden');
}

// Toggle button loading state
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Get JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Validate form data
function validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!formData.password || formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }

    return errors;
}

// Collect form data
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        address: document.getElementById('address').value.trim() || null
    };
}

// Register merchant
async function registerMerchant(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            showAlert('Merchant registration successful! 🎉 Redirecting to login...', 'success');
            form.reset();
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html?role=merchant';
            }, 2000);
        } else {
            // Handle error response
            const errorText = await response.text();
            let errorMessage = 'Registration failed. Please try again.';
            
            try {
                const data = JSON.parse(errorText);
                errorMessage = data.message || data.error || errorText;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            
            showAlert(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check your connection and try again.', 'error');
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Close any existing alerts
    closeAlert();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
        showAlert(validationErrors.join('. '), 'error');
        return;
    }
    
    // Show loading state
    setLoading(true);
    
    // Register merchant
    await registerMerchant(formData);
    
    // Hide loading state
    setLoading(false);
});

// Add input event listeners for real-time validation
document.getElementById('email').addEventListener('blur', (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.target.value && !emailRegex.test(e.target.value)) {
        e.target.style.borderColor = '#e74c3c';
    } else {
        e.target.style.borderColor = '';
    }
});

document.getElementById('password').addEventListener('input', (e) => {
    if (e.target.value.length > 0 && e.target.value.length < 6) {
        e.target.style.borderColor = '#e74c3c';
    } else {
        e.target.style.borderColor = '';
    }
});

// Format phone number on input
document.getElementById('phoneNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    // No authentication check needed for registration
    console.log('Merchant registration page loaded');
});
