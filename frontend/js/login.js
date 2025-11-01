// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const LOGIN_ENDPOINT = '/api/auth/login';

// Get DOM elements
const form = document.getElementById('loginForm');
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

// Handle login
async function loginUser(username, password) {
    try {
        // Get role from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        
        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        // Handle different response types
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (response.ok) {
            // Store token and username in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            
            showAlert('Login successful! Redirecting...', 'success');
            
            // Check URL parameter for role
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role');
            
            // Redirect after 1 second based on role
            setTimeout(() => {
                if (role === 'farmer') {
                    window.location.href = 'farmer-dashboard.html';
                } else if (role === 'merchant') {
                    window.location.href = 'merchant-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            // Handle error response (could be string or object)
            const errorMessage = typeof data === 'string' ? data : (data.message || 'Invalid username or password');
            showAlert(errorMessage, 'error');
            console.error('Login failed:', data);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please check your connection and ensure backend is running.', 'error');
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    closeAlert();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    setLoading(true);
    await loginUser(username, password);
    setLoading(false);
});
