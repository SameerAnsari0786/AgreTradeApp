// API Configuration
const API_BASE_URL = 'http://localhost:8080';

// Get DOM elements
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');
const rolesContainer = document.getElementById('rolesContainer');
const userNameSpan = document.getElementById('userName');

// Show alert message
function showAlert(message, type) {
    alertMessage.className = `alert ${type}`;
    alertText.textContent = message;
}

// Close alert message
function closeAlert() {
    alertMessage.classList.add('hidden');
}

// Get stored user data
function getUserData() {
    const email = localStorage.getItem('username');
    const token = localStorage.getItem('authToken');
    const roles = localStorage.getItem('userRoles');
    
    return { email, token, roles: roles ? JSON.parse(roles) : [] };
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('currentRole');
    window.location.href = 'login.html';
}

// Navigate to dashboard based on role
function selectRole(role) {
    localStorage.setItem('currentRole', role);
    
    if (role === 'ROLE_FARMER') {
        window.location.href = 'farmer-dashboard.html';
    } else if (role === 'ROLE_MERCHANT') {
        window.location.href = 'merchant-dashboard.html';
    }
}

// Load and display available roles
async function loadRoles() {
    const { email, token, roles } = getUserData();
    
    if (!email || !token) {
        showAlert('Please login first', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Display user name (extract from email)
    const userName = email.split('@')[0];
    userNameSpan.textContent = userName.charAt(0).toUpperCase() + userName.slice(1);
    
    // If only one role, redirect directly
    if (roles.length === 1) {
        selectRole(roles[0]);
        return;
    }
    
    // Display available roles
    rolesContainer.innerHTML = '';
    
    roles.forEach(role => {
        const roleDiv = document.createElement('div');
        roleDiv.className = `role-option ${role === 'ROLE_FARMER' ? 'farmer' : 'merchant'}`;
        roleDiv.onclick = () => selectRole(role);
        
        if (role === 'ROLE_FARMER') {
            roleDiv.innerHTML = `
                <div class="role-icon">🧑‍🌾</div>
                <div class="role-info">
                    <h3>Continue as Farmer</h3>
                    <p>Manage your crops, view inventory, and connect with merchants</p>
                </div>
                <div class="role-arrow">→</div>
            `;
        } else if (role === 'ROLE_MERCHANT') {
            roleDiv.innerHTML = `
                <div class="role-icon">🏢</div>
                <div class="role-info">
                    <h3>Continue as Merchant</h3>
                    <p>Search for crops, connect with farmers, and manage purchases</p>
                </div>
                <div class="role-arrow">→</div>
            `;
        }
        
        rolesContainer.appendChild(roleDiv);
    });
    
    // Add option to register for additional role
    if (!roles.includes('ROLE_FARMER')) {
        const farmerRegOption = document.createElement('div');
        farmerRegOption.className = 'role-option farmer';
        farmerRegOption.style.opacity = '0.7';
        farmerRegOption.onclick = () => {
            window.location.href = 'farmer-register.html?additional=true';
        };
        farmerRegOption.innerHTML = `
            <div class="role-icon">➕</div>
            <div class="role-info">
                <h3>Register as Farmer Too</h3>
                <p>Add farmer capabilities to your account</p>
            </div>
            <div class="role-arrow">→</div>
        `;
        rolesContainer.appendChild(farmerRegOption);
    }
    
    if (!roles.includes('ROLE_MERCHANT')) {
        const merchantRegOption = document.createElement('div');
        merchantRegOption.className = 'role-option merchant';
        merchantRegOption.style.opacity = '0.7';
        merchantRegOption.onclick = () => {
            window.location.href = 'merchant-register.html?additional=true';
        };
        merchantRegOption.innerHTML = `
            <div class="role-icon">➕</div>
            <div class="role-info">
                <h3>Register as Merchant Too</h3>
                <p>Add merchant capabilities to your account</p>
            </div>
            <div class="role-arrow">→</div>
        `;
        rolesContainer.appendChild(merchantRegOption);
    }
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    loadRoles();
});
