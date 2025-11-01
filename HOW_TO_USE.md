# 🌾 AgreTrade App - Simple User Guide

## 📖 What is AgreTrade?

**AgreTrade** is a marketplace platform that connects:
- **Farmers** 👨‍🌾 - People who grow crops and want to sell them
- **Merchants** 🏢 - People who want to buy crops from farmers

## 🎯 How It Works

### **For FARMERS** (Sellers)
1. **Register** → Create your farmer account
2. **Login** → Access your dashboard
3. **Add Crops** → List what you're selling (wheat, rice, tomatoes, etc.)
4. **Set Prices** → Decide how much you want per kg/unit
5. **Wait for Merchants** → Merchants can see your crops and contact you

### **For MERCHANTS** (Buyers)
1. **Register** → Create your merchant account
2. **Login** → Access your dashboard
3. **Search Crops** → Find what you want to buy (search by crop name)
4. **View Details** → See price, quantity, farmer contact info
5. **Contact Farmer** → Call or WhatsApp the farmer directly to buy

---

## 🚀 Quick Start Guide

### Step 1: Start the Backend Server
```bash
cd AgreTradeBackend
mvn spring-boot:run
```
✅ Wait until you see "Started AgreTradeApplication"

### Step 2: Open the Frontend
Open in browser:
```
file:///C:/Users/Sameer/Desktop/AgreTradeApp/frontend/index.html
```

---

## 👨‍🌾 **I AM A FARMER** - What Do I Do?

### First Time (Registration):
1. Click **"I'm a Farmer"** button on home page
2. Click **"Register"** 
3. Fill in your details:
   - Name
   - Email
   - Password
   - Phone number
   - Address
4. Click **"Register"**
5. You'll see success message

### Next Time (Login):
1. Click **"I'm a Farmer"** button
2. Click **"Login"**
3. Enter your email and password
4. Click **"Login"**

### In Your Dashboard:
- **View Your Profile** - See your registered information
- **Add New Crop** - Click "Add Crop" button
  - Enter crop name (e.g., "Wheat", "Rice", "Tomatoes")
  - Enter price per unit (e.g., 50.00)
  - Enter quantity available (e.g., 1000)
  - Enter description (optional)
  - Click "Save"
- **View Your Crops** - Click "🌾 Crops" button to see all your listed crops
- **Edit/Delete** - Manage your crops as needed

---

## 🏢 **I AM A MERCHANT** - What Do I Do?

### First Time (Registration):
1. Click **"I'm a Merchant"** button on home page
2. Click **"Register"**
3. Fill in your details:
   - Business Name
   - Email
   - Password
   - Phone number
   - Address
4. Click **"Register"**
5. You'll see success message

### Next Time (Login):
1. Click **"I'm a Merchant"** button
2. Click **"Login"**
3. Enter your email and password
4. Click **"Login"**

### In Your Dashboard:
- **Search for Crops** - Use the search box
  - Type crop name (e.g., "wheat", "rice")
  - Press Enter or click search
- **View Results** - See all farmers selling that crop
  - Crop name
  - Price
  - Quantity available
  - Farmer's name
  - Farmer's phone number
  - Farmer's address
- **Contact Farmer** - Click on farmer's phone to call or WhatsApp
- **Compare Prices** - See multiple farmers' prices and choose the best deal

---

## 🔑 Key Features

### For Farmers:
✅ Multiple crops per farmer (add as many as you want)
✅ Set your own prices
✅ Update crop details anytime
✅ Delete sold-out crops
✅ Merchants can find you easily

### For Merchants:
✅ Search any crop by name
✅ See all available farmers
✅ Compare prices instantly
✅ Direct contact via phone/WhatsApp
✅ View farmer location (address)

---

## 📱 User Flow Example

### Example 1: Farmer "Rajesh" wants to sell wheat
1. Rajesh registers as Farmer
2. Logs in to dashboard
3. Clicks "Add Crop"
4. Enters:
   - Crop Name: "Wheat"
   - Price: ₹25.00 per kg
   - Quantity: 5000 kg
   - Description: "Premium quality wheat from Punjab"
5. Saves the crop
6. Now any merchant searching for "wheat" will see Rajesh's listing

### Example 2: Merchant "Sharma Trading" wants to buy wheat
1. Sharma Trading registers as Merchant
2. Logs in to dashboard
3. Types "wheat" in search box
4. Sees Rajesh's listing:
   - Wheat - ₹25/kg
   - 5000 kg available
   - Rajesh - Phone: 9876543210
5. Calls Rajesh directly to negotiate and buy

---

## ⚠️ Important Notes

1. **Backend MUST be running** - Always start the Spring Boot server first
2. **Email for login** - Use your email address, not username
3. **One role per account** - Register either as Farmer OR Merchant (not both)
4. **Direct contact** - App shows contact info, actual buying happens offline
5. **No online payment** - This is a connecting platform only

---

## 🐛 Common Issues & Solutions

### Issue 1: Can't login
- ✅ Check if backend is running
- ✅ Use your EMAIL (not username) to login
- ✅ Make sure password is correct

### Issue 2: Crops not showing
- ✅ Refresh the page
- ✅ Check if you added crops
- ✅ For merchants: make sure you searched for a crop name

### Issue 3: CORS error
- ✅ Backend should have CorsConfig.java
- ✅ Restart backend server

### Issue 4: 401 Unauthorized
- ✅ Login again
- ✅ Check if token expired (login again after 24 hours)

---

## 📞 Support

For issues or questions:
- Check the browser console (F12) for error messages
- Check backend terminal for error logs
- Make sure MySQL database is running

---

## 🎨 Simple UI Concept

```
HOME PAGE (index.html)
    ↓
Choose: [Farmer] or [Merchant]
    ↓
    ├─→ FARMER PATH
    │   ├─→ Register (if new)
    │   │   └─→ Success → Login
    │   └─→ Login (if have account)
    │       └─→ Farmer Dashboard
    │           ├─→ View my crops
    │           ├─→ Add new crop
    │           ├─→ Edit crop
    │           └─→ Delete crop
    │
    └─→ MERCHANT PATH
        ├─→ Register (if new)
        │   └─→ Success → Login
        └─→ Login (if have account)
            └─→ Merchant Dashboard
                ├─→ Search crops
                ├─→ View farmer details
                └─→ Contact farmer
```

---

**That's it! Simple and straightforward. 🚀**
