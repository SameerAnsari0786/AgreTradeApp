// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const CROPS_SEARCH_ENDPOINT = '/api/crops/search';

// DOM Elements
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const noResults = document.getElementById('noResults');
const noResultsMessage = document.getElementById('noResultsMessage');
const welcomeMessage = document.getElementById('welcomeMessage');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const userName = document.getElementById('userName');
const cropSearchInput = document.getElementById('cropSearchInput');

// Initialize dashboard on page load
window.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadAllFarmersStatistics();
});

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (!token) {
        showAlert('Please login to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    if (username) {
        userName.textContent = username;
    }
    
    return true;
}



// Get authentication token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Show alert message
function showAlert(message, type) {
    alertMessage.className = `alert ${type}`;
    alertText.textContent = message;
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

// Close alert message
function closeAlert() {
    alertMessage.classList.add('hidden');
}

// Show/hide loading spinner
function setLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        noResults.classList.add('hidden');
        welcomeMessage.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Helper functions for loading
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function hideWelcomeMessage() {
    welcomeMessage.classList.add('hidden');
}

// Handle search keypress (Enter key)
function handleSearchKeypress(event) {
    if (event.key === 'Enter') {
        searchFarmers();
    }
}

// Search farmers by crop name
async function searchFarmers() {
    const cropName = cropSearchInput.value.trim();
    
    if (!cropName) {
        showAlert('Please enter a crop name to search', 'error');
        cropSearchInput.focus();
        return;
    }
    
    const token = getAuthToken();
    
    if (!token) {
        return;
    }
    
    setLoading(true);
    closeAlert();
    
    try {
        const response = await fetch(
            `${API_BASE_URL}${CROPS_SEARCH_ENDPOINT}?cropName=${encodeURIComponent(cropName)}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.ok) {
            const result = await response.json();
            // Backend returns {success: true, count: X, data: [...]}
            const crops = result.data || result;
            displayResults(crops, cropName);
        } else if (response.status === 401) {
            showAlert('Session expired. Please login again.', 'error');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            const errorData = await response.text();
            showAlert('Failed to search farmers: ' + errorData, 'error');
            displayNoResults(cropName);
        }
    } catch (error) {
        console.error('Error searching farmers:', error);
        showAlert('Network error. Please check your connection.', 'error');
        displayNoResults(cropName);
    } finally {
        setLoading(false);
    }
}

// Display search results
function displayResults(crops, searchTerm) {
    welcomeMessage.classList.add('hidden');
    
    if (!crops || crops.length === 0) {
        displayNoResults(searchTerm);
        return;
    }
    
    noResults.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    resultsTitle.textContent = `Search Results for "${searchTerm}"`;
    resultsCount.textContent = `${crops.length} result${crops.length !== 1 ? 's' : ''} found`;
    
    resultsGrid.innerHTML = '';
    
    crops.forEach(crop => {
        const card = createCropCard(crop);
        resultsGrid.appendChild(card);
    });
}

// Create crop card element (with farmer info)
function createCropCard(crop) {
    const card = document.createElement('div');
    card.className = 'farmer-card';
    
    // Crop object has farmer nested inside it
    const farmer = crop.farmer || {};
    
    // Prepare farmer and crop data for cart
    const farmerData = {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phoneNumber
    };
    
    const cropData = {
        cropName: crop.cropName,
        price: crop.price,
        quantity: crop.quantity
    };
    
    card.innerHTML = `
        <div class="farmer-header">
            <div class="farmer-icon">🌾</div>
            <div class="farmer-info">
                <h4>${crop.cropName || 'N/A'}</h4>
                <span class="farmer-id">By: ${farmer.name || 'Unknown Farmer'}</span>
            </div>
        </div>
        
        <div class="farmer-details">
            <div class="detail-row">
                <span class="detail-label">Price:</span>
                <span class="detail-value price-highlight">₹${crop.price ? crop.price.toFixed(2) : '0.00'} / unit</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${crop.quantity || 0} units</span>
            </div>
            ${crop.description ? `
            <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${crop.description}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Farmer:</span>
                <span class="detail-value">👨‍🌾 ${farmer.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">📍 ${farmer.address || 'Not specified'}</span>
            </div>
        </div>
        
        <div class="contact-info">
            <div class="contact-row">
                <span class="contact-icon">📧</span>
                <a href="mailto:${farmer.email}" class="contact-link">${farmer.email || 'N/A'}</a>
            </div>
            <div class="contact-row">
                <span class="contact-icon">📱</span>
                <a href="tel:${farmer.phoneNumber}" class="contact-link">${farmer.phoneNumber || 'N/A'}</a>
            </div>
        </div>
        
        <div class="action-buttons" style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="btn-add-cart" onclick='addToCart(${JSON.stringify(farmerData)}, ${JSON.stringify(cropData)})' style="flex: 1;">
                🛒 Add to Cart
            </button>
            <button class="btn-contact" onclick="window.open('tel:${farmer.phoneNumber}', '_self')" style="flex: 1;">
                📞 Call
            </button>
            <button class="btn-contact" onclick="window.open('https://wa.me/${farmer.phoneNumber?.replace(/\D/g, '')}', '_blank')" style="flex: 1; background: #25D366;">
                💬 WhatsApp
            </button>
        </div>
    `;
    
    return card;
}

// Legacy function for backward compatibility
function createFarmerCard(farmer) {
    return createCropCard({
        cropName: farmer.cropName,
        price: farmer.price,
        quantity: farmer.quantity,
        description: null,
        farmer: farmer
    });
}

// Display no results message
function displayNoResults(searchTerm) {
    welcomeMessage.classList.add('hidden');
    resultsSection.classList.add('hidden');
    noResults.classList.remove('hidden');
    
    noResultsMessage.textContent = `No crops found for "${searchTerm}". Try searching for a different crop name (e.g., Wheat, Rice, Tomatoes).`;
}

// Quick search function
function quickSearch(cropName) {
    cropSearchInput.value = cropName;
    searchFarmers();
}

// Clear search
function clearSearch() {
    cropSearchInput.value = '';
    cropSearchInput.focus();
    
    // Hide results and show welcome message
    resultsSection.classList.add('hidden');
    noResults.classList.add('hidden');
    welcomeMessage.classList.remove('hidden');
    
    closeAlert();
}

// Open contact modal with farmer details
function openContactModal(farmer) {
    document.getElementById('contactName').textContent = farmer.name || 'N/A';
    document.getElementById('contactEmail').textContent = farmer.email || 'N/A';
    document.getElementById('contactEmail').href = `mailto:${farmer.email}`;
    document.getElementById('contactPhone').textContent = farmer.phoneNumber || 'N/A';
    document.getElementById('contactPhone').href = `tel:${farmer.phoneNumber}`;
    document.getElementById('contactAddress').textContent = farmer.address || 'Not specified';
    document.getElementById('contactCrop').textContent = farmer.cropName || 'N/A';
    document.getElementById('contactPrice').textContent = farmer.price ? `₹${farmer.price.toFixed(2)} / unit` : '₹0.00';
    document.getElementById('contactQuantity').textContent = farmer.quantity ? `${farmer.quantity} units` : '0 units';
    
    // Set WhatsApp link
    const phoneNumber = farmer.phoneNumber ? farmer.phoneNumber.replace(/\D/g, '') : '';
    const whatsappMessage = encodeURIComponent(`Hello ${farmer.name}, I'm interested in your ${farmer.cropName || 'crops'}. I found your listing on AgreTrade.`);
    const whatsappLink = document.getElementById('whatsappLink');
    
    if (phoneNumber) {
        whatsappLink.href = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        whatsappLink.style.display = 'inline-flex';
    } else {
        whatsappLink.style.display = 'none';
    }
    
    document.getElementById('contactModal').classList.remove('hidden');
}

// Close contact modal
function closeContactModal() {
    document.getElementById('contactModal').classList.add('hidden');
}

// Load all farmers statistics
async function loadAllFarmersStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const farmers = await response.json();
            updateStatistics(farmers);
        }
    } catch (error) {
        console.error('Error loading farmers statistics:', error);
    }
}

// Update statistics cards
function updateStatistics(farmers) {
    const totalFarmers = farmers.length;
    
    // Count all crops from all farmers
    let allCrops = [];
    let totalQuantity = 0;
    let totalPrice = 0;
    let cropCount = 0;
    
    farmers.forEach(farmer => {
        if (farmer.crops && farmer.crops.length > 0) {
            farmer.crops.forEach(crop => {
                allCrops.push(crop.cropName);
                totalQuantity += crop.quantity || 0;
                totalPrice += crop.price || 0;
                cropCount++;
            });
        }
    });
    
    const uniqueCrops = new Set(allCrops).size;
    const avgPrice = cropCount > 0 ? totalPrice / cropCount : 0;
    
    document.getElementById('totalFarmers').textContent = totalFarmers;
    document.getElementById('totalCrops').textContent = uniqueCrops;
    document.getElementById('totalQuantity').textContent = totalQuantity.toFixed(0);
    document.getElementById('avgPrice').textContent = '₹' + avgPrice.toFixed(2);
}

// Global variable to store all farmers data
let allFarmersData = [];

// Show all farmers in table format
async function showAllFarmers() {
    const tableContainer = document.getElementById('allFarmersTable');
    const tableBody = document.getElementById('allFarmersTableBody');
    
    // Show loading
    showLoading();
    hideWelcomeMessage();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });

        hideLoading();

        if (response.ok) {
            const farmers = await response.json();
            allFarmersData = []; // Clear previous data
            
            // Flatten the data to show each crop as a separate row
            farmers.forEach(farmer => {
                if (farmer.crops && farmer.crops.length > 0) {
                    farmer.crops.forEach(crop => {
                        allFarmersData.push({
                            farmerId: farmer.id,
                            farmerName: farmer.name,
                            email: farmer.email,
                            phoneNumber: farmer.phoneNumber,
                            address: farmer.address,
                            cropName: crop.cropName,
                            price: crop.price,
                            quantity: crop.quantity
                        });
                    });
                } else {
                    // Include farmers without crops
                    allFarmersData.push({
                        farmerId: farmer.id,
                        farmerName: farmer.name,
                        email: farmer.email,
                        phoneNumber: farmer.phoneNumber,
                        address: farmer.address,
                        cropName: 'No crops listed',
                        price: 0,
                        quantity: 0
                    });
                }
            });

            if (allFarmersData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No farmers found</td></tr>';
            } else {
                renderFarmersTable(allFarmersData);
                tableContainer.classList.remove('hidden');
                
                // Enable sort dropdown
                document.getElementById('sortFarmersList').disabled = false;
                
                // Scroll to table
                tableContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            showAlert('Failed to load farmers list', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error loading farmers:', error);
        showAlert('Error loading farmers list. Please try again.', 'error');
    }
}

// Render farmers table
function renderFarmersTable(data) {
    const tableBody = document.getElementById('allFarmersTableBody');
    tableBody.innerHTML = '';
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        const farmerData = {
            id: item.farmerId,
            name: item.farmerName,
            email: item.email,
            phone: item.phoneNumber
        };
        const cropData = {
            cropName: item.cropName,
            price: item.price,
            quantity: item.quantity
        };
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.farmerName || 'N/A'}</strong></td>
            <td>🌾 ${item.cropName || 'N/A'}</td>
            <td><strong style="color: #27ae60;">₹${(item.price || 0).toFixed(2)}</strong></td>
            <td>${(item.quantity || 0).toFixed(0)} units</td>
            <td>${item.phoneNumber || 'N/A'}</td>
            <td>${item.address || 'N/A'}</td>
            <td style="display: flex; gap: 8px;">
                <button class="table-btn btn-add-cart" onclick='addToCart(${JSON.stringify(farmerData)}, ${JSON.stringify(cropData)})' style="background: #ff9800;">
                    🛒 Add
                </button>
                <button class="table-btn btn-contact" onclick='contactFarmerFromTable(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    📞 Contact
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Sort farmers list
function sortFarmersList() {
    const sortBy = document.getElementById('sortFarmersList').value;
    
    if (!sortBy || allFarmersData.length === 0) {
        return;
    }
    
    let sortedData = [...allFarmersData];
    
    switch (sortBy) {
        case 'name':
            sortedData.sort((a, b) => (a.farmerName || '').localeCompare(b.farmerName || ''));
            break;
        case 'name-desc':
            sortedData.sort((a, b) => (b.farmerName || '').localeCompare(a.farmerName || ''));
            break;
        case 'crop':
            sortedData.sort((a, b) => (a.cropName || '').localeCompare(b.cropName || ''));
            break;
        case 'crop-desc':
            sortedData.sort((a, b) => (b.cropName || '').localeCompare(a.cropName || ''));
            break;
        case 'price-asc':
            sortedData.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-desc':
            sortedData.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
    }
    
    renderFarmersTable(sortedData);
    showAlert('List sorted successfully!', 'success');
}

// Contact farmer from table
function contactFarmerFromTable(item) {
    const farmer = {
        name: item.farmerName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        address: item.address,
        cropName: item.cropName,
        price: item.price,
        quantity: item.quantity
    };
    openContactModal(farmer);
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('merchantCart'); // Clear cart on logout
    showAlert('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// ==================== CART FUNCTIONALITY ====================

// Initialize cart on page load
function initializeCart() {
    loadCart();
    updateCartCount();
}

// Load cart from localStorage
function loadCart() {
    const cart = getCartItems();
    return cart;
}

// Get cart items from localStorage
function getCartItems() {
    const cartData = localStorage.getItem('merchantCart');
    return cartData ? JSON.parse(cartData) : [];
}

// Save cart items to localStorage
function saveCart(cartItems) {
    localStorage.setItem('merchantCart', JSON.stringify(cartItems));
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const cart = getCartItems();
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Add item to cart
function addToCart(farmer, crop) {
    const cart = getCartItems();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.farmerId === farmer.id && item.cropName === crop.cropName
    );
    
    if (existingItemIndex !== -1) {
        showAlert('This crop is already in your cart!', 'error');
        return;
    }
    
    // Create cart item
    const cartItem = {
        id: Date.now(), // Unique ID for cart item
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmerEmail: farmer.email,
        farmerPhone: farmer.phone,
        cropName: crop.cropName,
        cropPrice: crop.price,
        cropQuantity: crop.quantity,
        addedAt: new Date().toISOString()
    };
    
    // Add to cart
    cart.push(cartItem);
    saveCart(cart);
    
    showAlert(`${crop.cropName} from ${farmer.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    const cart = getCartItems();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(updatedCart);
    
    // Refresh cart modal if open
    const cartModal = document.getElementById('cartModal');
    if (!cartModal.classList.contains('hidden')) {
        renderCartItems();
    }
    
    showAlert('Item removed from cart', 'success');
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        localStorage.removeItem('merchantCart');
        updateCartCount();
        renderCartItems();
        showAlert('Cart cleared successfully', 'success');
    }
}

// Open cart modal
function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('hidden');
    renderCartItems();
}

// Close cart modal
function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('hidden');
}

// Render cart items in modal
function renderCartItems() {
    const cart = getCartItems();
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartTableBody = document.getElementById('cartTableBody');
    
    if (cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartItems.classList.add('hidden');
        return;
    }
    
    cartEmpty.classList.add('hidden');
    cartItems.classList.remove('hidden');
    
    // Render cart items
    cartTableBody.innerHTML = cart.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.cropName}</strong></td>
            <td>${item.farmerName}</td>
            <td>₹${item.cropPrice}</td>
            <td>${item.cropQuantity} units</td>
            <td>${item.farmerPhone}</td>
            <td>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">
                    🗑️ Remove
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize cart when page loads
window.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});
