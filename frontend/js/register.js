// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const REGISTER_ENDPOINT = '/api/auth/register';

// Get DOM elements
const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');

// Show alert message
function showAlert(message, type) {
    alertMessage.className = `alert ${type}`;
    alertText.textContent = message;
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

// Handle registration
async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Registration successful! Redirecting to login...', 'success');
            form.reset();
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(data.message || data || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check your connection.', 'error');
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    closeAlert();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    setLoading(true);
    await registerUser(username, email, password);
    setLoading(false);
});
