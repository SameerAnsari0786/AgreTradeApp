# 🔧 Login & Registration Testing Guide

## ✅ What Was Fixed

### **Backend Changes:**
1. **CustomUserDetailsService.java** - Now accepts BOTH username and email for login
2. **Merchant.java** - Changed fields from `companyName` + `location` to single `address` field (matching Farmer)

### **Frontend Changes:**
1. **login.js** - Better error handling for 401 responses
2. **merchant-register.html** - Changed to use single `address` field instead of companyName/location
3. **merchant-register.js** - Updated to send `address` field

---

## 🧪 Testing Instructions

### **Step 1: Restart Backend**
```powershell
cd c:\Users\Sameer\Desktop\AgreTradeApp\AgreTradeBackend
mvn spring-boot:run
```

Wait for: `Started AgreTradeApplication in X.XXX seconds`

---

### **Step 2: Test Farmer Registration**

1. **Open:** `farmer-register.html`
2. **Fill in:**
   - Name: `Test Farmer`
   - Email: `farmer@test.com`
   - Password: `farmer123`
   - Phone: `9876543210`
   - Address: `123 Farm Road, Punjab`
3. **Click:** "Register as Farmer"
4. **Expected:** ✅ "Farmer registration successful! 🎉 Redirecting to login..."

---

### **Step 3: Test Farmer Login**

1. **Auto-redirects to:** `login.html?role=farmer`
2. **Fill in:**
   - Email: `farmer@test.com`
   - Password: `farmer123`
3. **Click:** "Login"
4. **Expected:** ✅ "Login successful! Redirecting..."
5. **Redirects to:** `farmer-dashboard.html`

---

### **Step 4: Test Merchant Registration**

1. **Open:** `merchant-register.html`
2. **Fill in:**
   - Name: `Test Merchant`
   - Email: `merchant@test.com`
   - Password: `merchant123`
   - Phone: `9876543211`
   - Address: `456 Market Street, Delhi`
3. **Click:** "Register as Merchant"
4. **Expected:** ✅ "Merchant registration successful! 🎉 Redirecting to login..."

---

### **Step 5: Test Merchant Login**

1. **Auto-redirects to:** `login.html?role=merchant`
2. **Fill in:**
   - Email: `merchant@test.com`
   - Password: `merchant123`
3. **Click:** "Login"
4. **Expected:** ✅ "Login successful! Redirecting..."
5. **Redirects to:** `merchant-dashboard.html`

---

## 🐛 Common Issues & Solutions

### **Issue 1: 401 Unauthorized on Login**
**Symptom:** Login returns "Error: Invalid username or password!"

**Causes:**
1. Backend not restarted after CustomUserDetailsService change
2. User not registered yet
3. Wrong email/password

**Solution:**
```powershell
# 1. Stop backend (Ctrl+C)
# 2. Restart backend
cd c:\Users\Sameer\Desktop\AgreTradeApp\AgreTradeBackend
mvn clean install
mvn spring-boot:run
```

---

### **Issue 2: 400 Bad Request on Registration**
**Symptom:** Registration returns "Error: Email already exists"

**Causes:**
1. Email already registered in database
2. Previous test data still exists

**Solution:**
- Use a different email
- OR clear database and restart

---

### **Issue 3: Network Error**
**Symptom:** "Network error. Please check your connection"

**Causes:**
1. Backend not running
2. Backend running on different port
3. CORS issue

**Solution:**
```powershell
# Check if backend is running
Invoke-RestMethod -Uri "http://localhost:8080/api/farmers" -Method GET
```

If this fails, backend is not running.

---

### **Issue 4: Redirect Not Working**
**Symptom:** Login successful but stays on login page

**Cause:** JavaScript redirect not executing

**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify localStorage has token:
   ```javascript
   localStorage.getItem('authToken')
   ```

---

## 🔍 Backend Verification Commands

### **Check if backend is running:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/farmers" -Method GET
```

### **Test login endpoint directly:**
```powershell
$body = @{
    username = "farmer@test.com"
    password = "farmer123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $body
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "farmer@test.com",
  "message": "Login successful!"
}
```

---

## 📋 Database State After Tests

After successful tests, you should have:

### **users table:**
| id | username          | email             | password (encrypted) |
|----|-------------------|-------------------|---------------------|
| 1  | farmer@test.com   | farmer@test.com   | $2a$10$...        |
| 2  | merchant@test.com | merchant@test.com | $2a$10$...        |

### **user_roles table:**
| user_id | role_id |
|---------|---------|
| 1       | 2       | (ROLE_FARMER)
| 2       | 3       | (ROLE_MERCHANT)

### **farmers table:**
| id | name        | email           | phoneNumber | address                    |
|----|-------------|-----------------|-------------|---------------------------|
| 1  | Test Farmer | farmer@test.com | 9876543210  | 123 Farm Road, Punjab     |

### **merchants table:**
| id | name          | email             | phoneNumber | address                      |
|----|---------------|-------------------|-------------|------------------------------|
| 1  | Test Merchant | merchant@test.com | 9876543211  | 456 Market Street, Delhi     |

---

## 🎯 Full User Flow Test

### **Complete Farmer Journey:**
1. ✅ Register as farmer → Creates User + Farmer records
2. ✅ Login with email → CustomUserDetailsService finds user by email
3. ✅ JWT token generated → Stored in localStorage
4. ✅ Redirected to farmer-dashboard.html
5. ✅ Dashboard loads farmer data by email
6. ✅ Add crop → Crop linked to farmer ID
7. ✅ View crops → All farmer's crops displayed

### **Complete Merchant Journey:**
1. ✅ Register as merchant → Creates User + Merchant records
2. ✅ Login with email → CustomUserDetailsService finds user by email
3. ✅ JWT token generated → Stored in localStorage
4. ✅ Redirected to merchant-dashboard.html
5. ✅ Search for crops → View crops with farmer details
6. ✅ Contact farmer → Call/WhatsApp buttons work

---

## 🚀 Quick Start Commands

```powershell
# Terminal 1: Start Backend
cd c:\Users\Sameer\Desktop\AgreTradeApp\AgreTradeBackend
mvn spring-boot:run

# Terminal 2: Open Frontend
cd c:\Users\Sameer\Desktop\AgreTradeApp\frontend
start start.html
```

---

## ✨ Summary of Architecture

```
Registration Flow:
  User fills form → POST /api/farmers/register or /api/merchants/register
    → FarmerServiceImpl/MerchantServiceImpl.register()
      → Creates User entity (for authentication)
        - username = email
        - password = encrypted
        - roles = [ROLE_FARMER] or [ROLE_MERCHANT]
      → Creates Farmer/Merchant entity (for business data)
        - name, email, phone, address
    → Both saved to database
    → Redirect to login

Login Flow:
  User enters email + password → POST /api/auth/login
    → AuthController.loginUser()
      → AuthenticationManager.authenticate()
        → CustomUserDetailsService.loadUserByUsername()
          → Tries findByUsername(email)
          → Falls back to findByEmail(email) ← THIS IS THE FIX!
          → Returns User with roles
        → Password verified (BCrypt)
      → JwtUtil.generateToken(username)
      → Returns JWT token
    → Frontend stores token in localStorage
    → Redirect to dashboard
```

---

## 🎉 All Systems Go!

If all tests pass, your login and registration system is fully functional! 🚀

**Key Features Working:**
- ✅ Farmer registration with User entity creation
- ✅ Merchant registration with User entity creation
- ✅ Login with email (username OR email accepted)
- ✅ JWT token generation and storage
- ✅ Role-based authentication (ROLE_FARMER, ROLE_MERCHANT)
- ✅ Proper error handling
- ✅ Redirect to appropriate dashboards
- ✅ Dual-entity architecture (User for auth, Farmer/Merchant for business)
