// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const FARMERS_ENDPOINT = '/api/farmers';
const CROPS_ENDPOINT = '/api/crops';

// Global variables
let farmersData = [];
let cropsData = [];
let currentDeleteId = null;
let currentFarmerId = null; // Store logged-in farmer's ID

// DOM Elements
const farmersTableBody = document.getElementById('farmersTableBody');
const loadingSpinner = document.getElementById('loadingSpinner');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');
const noDataMessage = document.getElementById('noDataMessage');
const farmersTable = document.getElementById('farmersTable');
const userName = document.getElementById('userName');

// Initialize dashboard on page load
window.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadCurrentFarmer();
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
        farmersTable.style.display = 'none';
        noDataMessage.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Load current farmer's details
async function loadCurrentFarmer() {
    const token = getAuthToken();
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        return;
    }
    
    setLoading(true);
    closeAlert();
    
    try {
        // Get all farmers to find the current one by email/username
        const response = await fetch(`${API_BASE_URL}${FARMERS_ENDPOINT}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            farmersData = await response.json();
            
            // Find current farmer by email (username is email)
            const currentFarmer = farmersData.find(f => f.email === username);
            
            if (currentFarmer) {
                currentFarmerId = currentFarmer.id;
                userName.textContent = currentFarmer.name;
                
                // Display only current farmer's data
                displayFarmers([currentFarmer]);
                updateStatistics([currentFarmer]);
            } else {
                showAlert('Farmer profile not found. Please register as a farmer first.', 'error');
            }
        } else if (response.status === 401) {
            showAlert('Session expired. Please login again.', 'error');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            const errorData = await response.text();
            showAlert('Failed to load farmer data: ' + errorData, 'error');
        }
    } catch (error) {
        console.error('Error loading farmer:', error);
        showAlert('Network error. Please check your connection.', 'error');
    } finally {
        setLoading(false);
    }
}

// Load all farmers (for admin view)
async function loadFarmers() {
    loadCurrentFarmer(); // For now, just reload current farmer
}

// Display farmers in table
function displayFarmers(farmers) {
    farmersTableBody.innerHTML = '';
    
    if (!farmers || farmers.length === 0) {
        farmersTable.style.display = 'none';
        noDataMessage.classList.remove('hidden');
        return;
    }
    
    farmersTable.style.display = 'table';
    noDataMessage.classList.add('hidden');
    
    farmers.forEach(farmer => {
        const row = createTableRow(farmer);
        farmersTableBody.appendChild(row);
    });
}

// Create table row for a farmer
function createTableRow(farmer) {
    const row = document.createElement('tr');
    
    // Get crops for this farmer
    const farmerCrops = farmer.crops || [];
    const cropNames = farmerCrops.length > 0 
        ? farmerCrops.map(c => c.cropName).join(', ') 
        : 'No crops added';
    const totalQuantity = farmerCrops.reduce((sum, c) => sum + (c.quantity || 0), 0);
    const avgPrice = farmerCrops.length > 0
        ? farmerCrops.reduce((sum, c) => sum + (c.price || 0), 0) / farmerCrops.length
        : 0;
    
    row.innerHTML = `
        <td>${farmer.id || 'N/A'}</td>
        <td>${farmer.name || 'N/A'}</td>
        <td>${farmer.email || 'N/A'}</td>
        <td>${farmer.phoneNumber || 'N/A'}</td>
        <td>${farmer.address || 'N/A'}</td>
        <td><span class="crop-badge">${cropNames}</span></td>
        <td>₹${avgPrice.toFixed(2)}</td>
        <td>${totalQuantity}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-view" onclick="viewAndManageCrops(${farmer.id}, '${farmer.name}')" title="View & Manage Crops">🌾 Manage Crops</button>
            </div>
        </td>
    `;
    
    return row;
}

// Update statistics cards
function updateStatistics(farmers) {
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
    
    document.getElementById('totalCrops').textContent = uniqueCrops;
    document.getElementById('totalQuantity').textContent = totalQuantity.toFixed(0);
    document.getElementById('avgPrice').textContent = '₹' + avgPrice.toFixed(2);
}

// View and manage farmer crops in a modal
function viewAndManageCrops(farmerId, farmerName) {
    const farmer = farmersData.find(f => f.id === farmerId);
    if (!farmer) return;
    
    const crops = farmer.crops || [];
    
    let cropsHTML = '';
    if (crops.length === 0) {
        cropsHTML = '<p class="no-crops">No crops added yet. <button class="btn-primary" onclick="openAddCropModal(); this.closest(\'.modal-overlay\').remove();">Add Your First Crop</button></p>';
    } else {
        cropsHTML = '<div class="crops-grid">';
        crops.forEach(crop => {
            cropsHTML += `
                <div class="crop-card">
                    <h4>🌾 ${crop.cropName}</h4>
                    <p><strong>Price:</strong> <span style="color: #27ae60;">₹${crop.price.toFixed(2)}</span></p>
                    <p><strong>Quantity:</strong> ${crop.quantity} units</p>
                    ${crop.description ? `<p><strong>Description:</strong> ${crop.description}</p>` : ''}
                    <div class="crop-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                        <button class="btn-edit" onclick="openEditCropModal(${crop.id}, '${crop.cropName.replace(/'/g, "\\'")}', ${crop.price}, ${crop.quantity}, '${(crop.description || '').replace(/'/g, "\\'")}'); event.stopPropagation();" style="flex: 1;">
                            ✏️ Edit
                        </button>
                        <button class="btn-delete" onclick="deleteCrop(${crop.id}, '${crop.cropName.replace(/'/g, "\\'")}'); event.stopPropagation();" style="flex: 1;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        });
        cropsHTML += '</div>';
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h3>🌾 Manage Crops for ${farmerName}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${cropsHTML}
            </div>
            <div class="modal-footer" style="padding: 1rem; border-top: 1px solid #e0e0e0; text-align: right;">
                <button class="btn-primary" onclick="openAddCropModal(); this.closest('.modal-overlay').remove();">
                    ➕ Add New Crop
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Open Add Crop Modal
function openAddCropModal() {
    document.getElementById('addCropModal').classList.remove('hidden');
}

// Close Add Crop Modal
function closeAddCropModal() {
    document.getElementById('addCropModal').classList.add('hidden');
    document.getElementById('addCropForm').reset();
}

// Handle Add Crop Form Submission
document.getElementById('addCropForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = getAuthToken();
    
    if (!token) {
        showAlert('Please login again', 'error');
        return;
    }
    
    if (!currentFarmerId) {
        showAlert('Farmer profile not found. Please ensure you are registered as a farmer.', 'error');
        return;
    }
    
    const cropData = {
        cropName: document.getElementById('cropName').value.trim(),
        price: parseFloat(document.getElementById('cropPrice').value),
        quantity: parseFloat(document.getElementById('cropQuantity').value),
        description: document.getElementById('cropDescription').value.trim() || null
    };
    
    // Validation
    if (!cropData.cropName || cropData.price <= 0 || cropData.quantity <= 0) {
        showAlert('Please fill all required fields with valid values', 'error');
        return;
    }
    
    const addCropBtnText = document.getElementById('addCropBtnText');
    const addCropBtnLoader = document.getElementById('addCropBtnLoader');
    
    addCropBtnText.classList.add('hidden');
    addCropBtnLoader.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}${CROPS_ENDPOINT}/farmer/${currentFarmerId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cropData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('✅ Crop added successfully! 🌾', 'success');
            closeAddCropModal();
            loadCurrentFarmer(); // Reload to show the new crop
        } else {
            const errorData = await response.text();
            showAlert('❌ Failed to add crop: ' + errorData, 'error');
        }
    } catch (error) {
        console.error('Error adding crop:', error);
        showAlert('❌ Network error. Please try again.', 'error');
    } finally {
        addCropBtnText.classList.remove('hidden');
        addCropBtnLoader.classList.add('hidden');
    }
});

// Global variable for crop editing
let currentEditCropId = null;

// Open edit crop modal
function openEditCropModal(cropId, cropName, price, quantity, description) {
    currentEditCropId = cropId;
    
    // Close any existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create edit crop modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>✏️ Edit Crop</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); currentEditCropId = null;">&times;</button>
            </div>
            <form id="editCropFormDynamic" class="modal-form">
                <div class="form-group">
                    <label for="editCropName">Crop Name *</label>
                    <input type="text" id="editCropName" value="${cropName}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editCropPrice">Price (₹/unit) *</label>
                        <input type="number" id="editCropPrice" step="0.01" min="0" value="${price}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCropQuantity">Quantity *</label>
                        <input type="number" id="editCropQuantity" step="0.01" min="0" value="${quantity}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editCropDescription">Description (Optional)</label>
                    <textarea id="editCropDescription" rows="3">${description || ''}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove(); currentEditCropId = null;">Cancel</button>
                    <button type="submit" class="btn-primary">
                        <span id="editCropBtnText">Save Changes</span>
                        <span id="editCropBtnLoader" class="loader hidden"></span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add submit handler
    document.getElementById('editCropFormDynamic').addEventListener('submit', updateCrop);
}

// Update crop
async function updateCrop(e) {
    e.preventDefault();
    
    if (!currentEditCropId) return;
    
    const token = getAuthToken();
    const editCropBtnText = document.getElementById('editCropBtnText');
    const editCropBtnLoader = document.getElementById('editCropBtnLoader');
    
    const updatedCrop = {
        cropName: document.getElementById('editCropName').value.trim(),
        price: parseFloat(document.getElementById('editCropPrice').value),
        quantity: parseFloat(document.getElementById('editCropQuantity').value),
        description: document.getElementById('editCropDescription').value.trim() || null
    };
    
    editCropBtnText.classList.add('hidden');
    editCropBtnLoader.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}${CROPS_ENDPOINT}/${currentEditCropId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCrop)
        });
        
        if (response.ok) {
            showAlert('✅ Crop updated successfully! 🌾', 'success');
            document.querySelector('.modal-overlay').remove();
            currentEditCropId = null;
            loadCurrentFarmer();
        } else {
            const errorData = await response.text();
            showAlert('❌ Failed to update crop: ' + errorData, 'error');
        }
    } catch (error) {
        console.error('Error updating crop:', error);
        showAlert('❌ Network error. Please try again.', 'error');
    } finally {
        editCropBtnText.classList.remove('hidden');
        editCropBtnLoader.classList.add('hidden');
    }
}

// Delete crop
async function deleteCrop(cropId, cropName) {
    if (!confirm(`Are you sure you want to delete "${cropName}"? This action cannot be undone.`)) {
        return;
    }
    
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}${CROPS_ENDPOINT}/${cropId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showAlert('✅ Crop deleted successfully!', 'success');
            // Close modal and reload
            const modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
            loadCurrentFarmer();
        } else {
            const errorData = await response.text();
            showAlert('❌ Failed to delete crop: ' + errorData, 'error');
        }
    } catch (error) {
        console.error('Error deleting crop:', error);
        showAlert('❌ Network error. Please try again.', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    showAlert('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}
