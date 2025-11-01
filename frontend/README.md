# AgreTrade Frontend

## 📁 Project Structure

```
frontend/
├── index.html              # Landing page with navigation
├── farmer-register.html    # Farmer registration page
├── farmer-dashboard.html   # Farmer dashboard (view/edit/delete)
├── merchant-register.html  # Merchant registration page
├── merchant-dashboard.html # Merchant dashboard (search farmers)
├── login.html              # User login page
├── register.html           # User registration page
├── css/
│   ├── farmer-register.css   # Styles for farmer registration
│   ├── farmer-dashboard.css  # Styles for farmer dashboard
│   ├── merchant-register.css # Styles for merchant registration
│   ├── merchant-dashboard.css # Styles for merchant dashboard
│   ├── login.css            # Styles for login page
│   └── register.css         # Styles for registration page
└── js/
    ├── farmer-register.js   # Logic for farmer registration
    ├── farmer-dashboard.js  # Logic for farmer dashboard
    ├── merchant-register.js # Logic for merchant registration
    ├── merchant-dashboard.js # Logic for merchant dashboard
    ├── login.js            # Logic for login
    └── register.js         # Logic for user registration
```

## 🚀 How to Use

### Step 1: Start the Backend Server
1. Navigate to the backend directory: `AgreTradeBackend`
2. Make sure MySQL is running on `localhost:3306`
3. Database name should be: `agretrade_db`
4. Run the Spring Boot application:
   ```bash
   cd AgreTradeBackend
   mvnw spring-boot:run
   ```
5. Backend will run on: `http://localhost:8080`

### Step 2: Open Frontend Pages
1. Open `index.html` in your browser (landing page)
2. Click "Register Account" to create a user account
3. Login using your credentials
4. After login, you can:
   - Add new products → `farmer-register.html`
   - View all products → `farmer-dashboard.html`
   - Edit/Delete products from the dashboard

## 📝 Features

### 1. Landing Page (`index.html`)
- ✅ Beautiful hero section
- ✅ Feature highlights
- ✅ Quick navigation to all pages

### 2. Farmer Registration Page (`farmer-register.html`)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation (client-side)
- ✅ JWT authentication required
- ✅ Real-time input validation
- ✅ Loading states and error handling
- ✅ Success/Error alerts
- ✅ Auto-redirect after successful registration

**Form Fields:**
- **Required:** name, email, password, phoneNumber
- **Optional:** address, cropName, price, quantity

### 3. Farmer Dashboard (`farmer-dashboard.html`)
- ✅ **View all farmers** in a beautiful table
- ✅ **Statistics cards** showing:
  - Total Farmers
  - Crop Types
  - Total Quantity
  - Average Price
- ✅ **Search functionality** (by name, crop, location, etc.)
- ✅ **Sort options** (by name, crop, price, quantity)
- ✅ **Edit modal** - Update farmer details inline
- ✅ **Delete confirmation** - Prevent accidental deletions
- ✅ **Responsive table** - Works on all devices
- ✅ **Modern UI** using CSS Grid and Flexbox
- ✅ **Real-time updates** after edit/delete operations
- ✅ **Loading states** and error handling
- ✅ **Logout functionality**

### 4. Merchant Registration Page (`merchant-register.html`)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation (client-side)
- ✅ JWT authentication required
- ✅ Real-time input validation
- ✅ Loading states and error handling
- ✅ Success/Error alerts
- ✅ Auto-redirect after successful registration

**Form Fields:**
- **Required:** name, email, password, phoneNumber
- **Optional:** companyName, location

### 5. Merchant Dashboard (`merchant-dashboard.html`)
- ✅ **Search farmers by crop name** using `/api/farmers/search`
- ✅ **Search input box** with real-time search
- ✅ **Quick search buttons** for common crops (Wheat, Rice, Corn, etc.)
- ✅ **Beautiful farmer cards** displaying:
  - Farmer name and ID
  - Crop name (highlighted)
  - Price per unit
  - Quantity available
  - Location/Address
  - **Contact information** (Email and Phone - clickable)
- ✅ **Contact modal** with full farmer details
- ✅ **Clean, modern layout** using CSS Grid
- ✅ **Responsive design** for all screen sizes
- ✅ **Loading states** during search
- ✅ **No results handling** with helpful messages
- ✅ **Welcome screen** for first-time users

### Security
- JWT token stored in localStorage
- Token required for farmer registration API
- Auto-redirect to login if not authenticated

## 🔧 API Integration

The frontend connects to these backend endpoints:

### Authentication APIs
1. **POST** `/api/auth/register` - User registration
2. **POST** `/api/auth/login` - User login (returns JWT token)

### Farmer APIs (All require JWT authentication)
3. **POST** `/api/farmers/register` - Register new farmer
4. **GET** `/api/farmers` - Get all farmers
5. **GET** `/api/farmers/{id}` - Get specific farmer
6. **PUT** `/api/farmers/{id}` - Update farmer details
7. **DELETE** `/api/farmers/{id}` - Delete farmer
8. **GET** `/api/farmers/search?cropName=` - Search farmers by crop

### Merchant APIs (All require JWT authentication)
9. **POST** `/api/merchants/register` - Register new merchant
10. **GET** `/api/merchants` - Get all merchants
11. **GET** `/api/merchants/{id}` - Get specific merchant

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations
- Form validation indicators
- Loading spinners
- Alert messages with auto-dismiss
- Fully responsive layout

## 🔐 Authentication Flow

1. User registers → `register.html`
2. User logs in → `login.html` → Receives JWT token
3. Token stored in localStorage
4. User can register as farmer → `farmer-register.html` (token required)

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet: 480px - 768px
- Mobile: < 480px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📌 Notes

- Make sure CORS is enabled on the backend (already configured)
- Backend must be running on `http://localhost:8080`
- JWT token expires after 24 hours (configured in backend)
