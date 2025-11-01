# 🌾 AgreTrade - Agricultural Marketplace Platform

## 📌 What is AgreTrade?

**AgreTrade** is a simple web-based marketplace that connects:
- **Farmers** 👨‍🌾 who want to sell their crops
- **Merchants** 🏢 who want to buy crops directly from farmers

---

## 🎯 Project Structure

```
AgreTradeApp/
├── AgreTradeBackend/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/AgreTrade/AgreTrade/
│   │       ├── controller/    # REST API Controllers
│   │       ├── entity/        # Database Models
│   │       ├── repository/    # Database Access
│   │       ├── service/       # Business Logic
│   │       ├── security/      # JWT Authentication
│   │       └── config/        # CORS & Security Config
│   └── pom.xml               # Maven Dependencies
│
└── frontend/                  # HTML/CSS/JavaScript
    ├── start.html            # 🔴 START HERE (Main Entry Point)
    ├── how-it-works.html     # Visual Guide
    ├── login.html            # Login Page
    ├── farmer-register.html  # Farmer Registration
    ├── merchant-register.html # Merchant Registration
    ├── farmer-dashboard.html # Farmer Dashboard
    └── merchant-dashboard.html # Merchant Dashboard
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start MySQL Database
Make sure MySQL is running on `localhost:3306` with database `agretrade_db`

### Step 2: Start Backend Server
```bash
cd AgreTradeBackend
mvn spring-boot:run
```
✅ Wait for: `Started AgreTradeApplication in X seconds`

### Step 3: Open Frontend
Open in browser:
```
file:///C:/Users/Sameer/Desktop/AgreTradeApp/frontend/start.html
```

---

## 👨‍🌾 For FARMERS - Step by Step

### First Time User (Register):
1. Open **start.html**
2. Click **"I'm a Farmer"** card
3. Click **"Register"** button
4. Fill in your details:
   - Name: Your full name
   - Email: Your email address
   - Password: Choose a secure password
   - Phone Number: Your contact number
   - Address: Your farm location
5. Click **"Register"**
6. You'll see success message → Click "Login"

### Returning User (Login):
1. Open **start.html**
2. Click **"I'm a Farmer"** card
3. Click **"Login"** button
4. Enter your **email** and **password**
5. Click **"Login"**
6. You'll be redirected to **Farmer Dashboard**

### In Your Dashboard:
#### View Your Crops:
- Click **"🌾 Crops"** button next to your name
- See all crops you've listed
- View crop details (name, price, quantity, description)

#### Add New Crop:
1. Click **"➕ Add Crop"** button (top right)
2. Fill in the form:
   - **Crop Name**: e.g., "Wheat", "Rice", "Tomatoes", "Potatoes"
   - **Price**: e.g., 25.00 (price per kg or unit)
   - **Quantity**: e.g., 5000 (total available)
   - **Description**: Optional details about quality, origin, etc.
3. Click **"Add Crop"**
4. Crop will appear in your list

#### Edit or Delete Crops:
- Click **"✏️ Edit"** to update crop details
- Click **"🗑️ Delete"** to remove a crop
- Click **"🌾 Crops"** to view all crops for a specific farmer

---

## 🏢 For MERCHANTS - Step by Step

### First Time User (Register):
1. Open **start.html**
2. Click **"I'm a Merchant"** card
3. Click **"Register"** button
4. Fill in your details:
   - Business Name: Your company name
   - Email: Your business email
   - Password: Choose a secure password
   - Phone Number: Your contact number
   - Address: Your business address
5. Click **"Register"**
6. You'll see success message → Click "Login"

### Returning User (Login):
1. Open **start.html**
2. Click **"I'm a Merchant"** card
3. Click **"Login"** button
4. Enter your **email** and **password**
5. Click **"Login"**
6. You'll be redirected to **Merchant Dashboard**

### In Your Dashboard:
#### Search for Crops:
1. Use the search box at the top
2. Type crop name: e.g., "wheat", "rice", "tomato"
3. Press **Enter** or click **Search**
4. Results will show all farmers selling that crop

#### View Results:
Each result card shows:
- 🌾 **Crop Name**: What they're selling
- 💰 **Price**: Price per kg/unit
- 📦 **Quantity**: How much is available
- 👨‍🌾 **Farmer Name**: Who is selling
- 📞 **Phone**: Direct contact number
- 📍 **Address**: Farmer's location

#### Contact Farmer:
- Click **"📞 Call"** to call directly
- Click **"💬 WhatsApp"** to message on WhatsApp
- Negotiate and finalize the deal offline

---

## 🔐 Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (generic)

### Farmers
- `POST /api/farmers/register` - Register as farmer
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/{id}` - Get farmer by ID
- `PUT /api/farmers/{id}` - Update farmer
- `DELETE /api/farmers/{id}` - Delete farmer

### Merchants
- `POST /api/merchants/register` - Register as merchant
- `GET /api/merchants` - Get all merchants
- `GET /api/merchants/{id}` - Get merchant by ID

### Crops
- `POST /api/crops/farmer/{farmerId}` - Add crop for farmer
- `GET /api/crops/farmer/{farmerId}` - Get all crops of a farmer
- `GET /api/crops` - Get all crops
- `GET /api/crops/search?cropName={name}` - Search crops by name
- `PUT /api/crops/{cropId}` - Update crop
- `DELETE /api/crops/{cropId}` - Delete crop

### Admin (Protected)
- `GET /api/admin/farmers` - View all farmers
- `GET /api/admin/merchants` - View all merchants
- `DELETE /api/admin/deleteFarmer/{id}` - Delete farmer
- `DELETE /api/admin/deleteMerchant/{id}` - Delete merchant

---

## 💾 Database Schema

### Users Table
- `id` (PK)
- `username`
- `email` (unique)
- `password` (encrypted)

### Farmers Table
- `id` (PK)
- `name`
- `email` (unique)
- `password` (encrypted)
- `phoneNumber`
- `address`

### Merchants Table
- `id` (PK)
- `name`
- `email` (unique)
- `password` (encrypted)
- `phoneNumber`
- `address`

### Crops Table
- `id` (PK)
- `cropName`
- `price`
- `quantity`
- `description`
- `farmer_id` (FK → Farmers)

### Relationships
- One Farmer → Many Crops (One-to-Many)
- One Crop → One Farmer (Many-to-One)

---

## 🛠️ Technologies Used

### Backend
- **Java 21**
- **Spring Boot 3.5.7**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **MySQL 8.0.40**
- **Maven** (Build Tool)

### Frontend
- **HTML5**
- **CSS3** (with animations)
- **Vanilla JavaScript** (ES6+)
- **Fetch API** (for HTTP requests)

---

## ⚙️ Configuration

### Backend Configuration (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/agretrade_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your_secret_key
jwt.expiration=86400000
```

### CORS Configuration
- Allows all origins (`*`)
- Allows all methods (GET, POST, PUT, DELETE)
- Allows all headers
- **Note:** In production, restrict to specific origins

---

## 🔒 Security Features

1. **JWT Authentication**: 24-hour token expiration
2. **BCrypt Password Hashing**: Secure password storage
3. **Role-Based Access**: ROLE_FARMER, ROLE_MERCHANT, ROLE_ADMIN
4. **Method-Level Security**: @PreAuthorize annotations
5. **CORS Protection**: Configurable cross-origin policies

---

## 🐛 Common Issues & Solutions

### 1. Backend won't start
**Problem:** MySQL connection refused
**Solution:** 
- Check if MySQL is running
- Verify database name: `agretrade_db`
- Check username/password in `application.properties`

### 2. Can't login
**Problem:** 401 Unauthorized
**Solution:**
- Use **EMAIL** (not username) to login
- Check if you registered successfully
- Verify password is correct

### 3. Crops not showing
**Problem:** Empty dashboard
**Solution:**
- Make sure you added crops (for farmers)
- Type exact crop name in search (for merchants)
- Refresh the page
- Check browser console (F12) for errors

### 4. CORS errors
**Problem:** CORS policy blocked
**Solution:**
- Check if backend has `CorsConfig.java`
- Restart backend server
- Clear browser cache

### 5. Token expired
**Problem:** 401 after 24 hours
**Solution:**
- Login again to get new token
- Tokens expire after 24 hours for security

---

## 📝 Example User Flows

### Example 1: Farmer Rajesh Sells Wheat
1. Rajesh opens **start.html**
2. Clicks **"I'm a Farmer"** → **"Register"**
3. Fills in details and registers
4. Logs in with his email and password
5. In dashboard, clicks **"Add Crop"**
6. Enters:
   - Crop Name: Wheat
   - Price: ₹25.00
   - Quantity: 5000
   - Description: "Premium quality wheat from Punjab"
7. Clicks **"Add Crop"**
8. Now merchants can find his wheat!

### Example 2: Merchant Sharma Buys Wheat
1. Sharma opens **start.html**
2. Clicks **"I'm a Merchant"** → **"Register"**
3. Fills in business details and registers
4. Logs in with email and password
5. In dashboard, types **"wheat"** in search box
6. Sees Rajesh's listing:
   - Wheat - ₹25/kg
   - 5000 kg available
   - Farmer: Rajesh
   - Phone: 9876543210
7. Calls Rajesh directly to negotiate and buy

---

## 📱 User Interface Overview

### start.html (Landing Page)
- Two cards: Farmer vs Merchant
- Clear "Login" and "Register" buttons for each
- Visual guide on how the platform works

### how-it-works.html (Visual Guide)
- Step-by-step farmer flow
- Step-by-step merchant flow
- Real-life examples
- Key points to remember

### Farmer Dashboard
- View your profile information
- See statistics (total crops, etc.)
- Add new crops
- View/Edit/Delete your crops
- Search through your listings

### Merchant Dashboard
- Search for any crop by name
- View all available farmers selling that crop
- See farmer contact information
- Direct call/WhatsApp integration
- Compare prices from multiple farmers

---

## 🎨 Design Features

### Animations
- Smooth hover effects on cards
- Bounce animation on logo
- Slide-in transitions
- Loading spinners

### Responsive Design
- Works on desktop, tablet, and mobile
- Grid layouts adjust to screen size
- Touch-friendly buttons

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Farmer**: Green (#27ae60)
- **Merchant**: Orange (#e67e22)
- **Success**: Green (#27ae60)
- **Error**: Red (#e74c3c)

---

## 🔮 Future Enhancements

Potential features to add:
- [ ] Online payment integration
- [ ] Order tracking system
- [ ] Rating and review system
- [ ] Image upload for crops
- [ ] Real-time chat between farmers and merchants
- [ ] Mobile app (React Native/Flutter)
- [ ] Email notifications
- [ ] SMS integration
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 📞 Support & Troubleshooting

### Browser Console
Press **F12** to open browser console and check for:
- Network errors (failed API calls)
- JavaScript errors
- CORS issues

### Backend Logs
Check terminal where backend is running for:
- Database connection errors
- Authentication failures
- API request logs

### Testing Credentials
Create a test account to verify:
- Registration works
- Login works
- Dashboard loads
- CRUD operations work

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Developer Notes

### Project Started: October 2025
### Last Updated: October 30, 2025

### Key Files to Understand:
1. **Backend Entry**: `AgreTradeApplication.java`
2. **Security Config**: `SecurityConfig.java`
3. **Crop Controller**: `CropController.java`
4. **Farmer Service**: `FarmerServiceImpl.java`
5. **Frontend Entry**: `start.html`
6. **Farmer Dashboard**: `farmer-dashboard.js`
7. **Merchant Dashboard**: `merchant-dashboard.js`

---

**Happy Trading! 🌾🚀**
