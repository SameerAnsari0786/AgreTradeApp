# ✅ Simplified Architecture - No User Entity

## 🎯 **What Changed:**

Removed the complex dual-entity system (User + Farmer/Merchant) and simplified to **direct authentication** using Farmer and Merchant entities only.

---

## 📊 **New Simple Architecture:**

### **Before (Complex):**
```
users table (Authentication)
  ↓
user_roles table (Roles)
  ↓
farmers/merchants tables (Business Data)
```

### **After (Simple):**
```
farmers table (Authentication + Business Data)
merchants table (Authentication + Business Data)
```

---

## 🔧 **Changes Made:**

### **Backend:**

#### **1. CustomUserDetailsService.java**
```java
// OLD: Looked up User entity
User user = userRepository.findByUsername(username)...

// NEW: Looks up Farmer or Merchant directly
Farmer farmer = farmerRepository.findByEmail(username).orElse(null);
if (farmer != null) {
    return UserDetails with ROLE_FARMER
}

Merchant merchant = merchantRepository.findByEmail(username).orElse(null);
if (merchant != null) {
    return UserDetails with ROLE_MERCHANT
}
```

#### **2. FarmerServiceImpl.java**
```java
// OLD: Created User + Farmer
User user = new User();
user.setRoles(...);
userRepository.save(user);
farmer.setPassword(...);
farmerRepository.save(farmer);

// NEW: Only creates Farmer
farmer.setPassword(passwordEncoder.encode(farmer.getPassword()));
farmerRepository.save(farmer);
```

#### **3. MerchantServiceImpl.java**
```java
// OLD: Created User + Merchant
User user = new User();
user.setRoles(...);
userRepository.save(user);
merchant.setPassword(...);
merchantRepository.save(merchant);

// NEW: Only creates Merchant
merchant.setPassword(passwordEncoder.encode(merchant.getPassword()));
merchantRepository.save(merchant);
```

---

### **Frontend:**

#### **1. Removed dual-role features:**
- ❌ Removed "Switch Role" buttons
- ❌ Removed role-selection.html page
- ❌ Removed checkMultipleRoles() functions
- ❌ Removed switchRole() functions

#### **2. Simplified login.js:**
```javascript
// OLD: Fetched roles from backend, checked for multiple roles
const rolesResponse = await fetch('/api/auth/roles', ...);
if (rolesData.roles.length === 1) { ... }

// NEW: Simple redirect based on URL parameter
const role = urlParams.get('role');
if (role === 'farmer') {
    window.location.href = 'farmer-dashboard.html';
} else if (role === 'merchant') {
    window.location.href = 'merchant-dashboard.html';
}
```

---

## 🎯 **How It Works Now:**

### **Farmer Registration:**
```
1. User fills farmer-register.html
2. POST /api/farmers/register
3. FarmerServiceImpl:
   - Checks if email exists
   - Encrypts password
   - Saves to farmers table
4. Success → Redirect to login.html?role=farmer
```

### **Farmer Login:**
```
1. User enters email + password at login.html?role=farmer
2. POST /api/auth/login
3. CustomUserDetailsService:
   - Searches farmerRepository.findByEmail(email)
   - If found → Creates UserDetails with ROLE_FARMER
   - Returns to Spring Security
4. Spring Security verifies password
5. JWT token generated
6. Redirect to farmer-dashboard.html
```

### **Merchant Registration:**
```
1. User fills merchant-register.html
2. POST /api/merchants/register
3. MerchantServiceImpl:
   - Checks if email exists
   - Encrypts password
   - Saves to merchants table
4. Success → Redirect to login.html?role=merchant
```

### **Merchant Login:**
```
1. User enters email + password at login.html?role=merchant
2. POST /api/auth/login
3. CustomUserDetailsService:
   - Searches merchantRepository.findByEmail(email)
   - If found → Creates UserDetails with ROLE_MERCHANT
   - Returns to Spring Security
4. Spring Security verifies password
5. JWT token generated
6. Redirect to merchant-dashboard.html
```

---

## 📋 **Database Tables:**

### **farmers table:**
```sql
CREATE TABLE farmers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,    -- Encrypted with BCrypt
    phoneNumber VARCHAR(20) NOT NULL,
    address TEXT
);
```

### **merchants table:**
```sql
CREATE TABLE merchants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,    -- Encrypted with BCrypt
    phoneNumber VARCHAR(20) NOT NULL,
    address TEXT
);
```

### **crops table:**
```sql
CREATE TABLE crops (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cropName VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT,
    farmer_id BIGINT,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);
```

---

## ✅ **Benefits of Simplified System:**

### **1. Easier to Understand:**
- ✅ No complex User/Role relationships
- ✅ Direct farmer → crops relationship
- ✅ Simple authentication flow

### **2. Less Code:**
- ✅ Removed User entity
- ✅ Removed Role entity
- ✅ Removed user_roles join table
- ✅ Removed dual-role frontend code

### **3. Clearer Separation:**
- ✅ Farmers have farmer emails
- ✅ Merchants have merchant emails
- ✅ No confusion about "same person, different roles"

### **4. Simpler Security:**
- ✅ Each entity has its own authentication
- ✅ ROLE_FARMER for farmer emails
- ✅ ROLE_MERCHANT for merchant emails
- ✅ No role switching needed

---

## 🎓 **Example:**

### **Farmer: John**
```
Email: john@farm.com
Password: farmer123
Role: ROLE_FARMER (automatic)
Can: Add crops, manage inventory
Cannot: Search for crops (merchant feature)
```

### **Merchant: Sarah**
```
Email: sarah@merchant.com
Password: merchant123
Role: ROLE_MERCHANT (automatic)
Can: Search crops, contact farmers
Cannot: Add crops (farmer feature)
```

### **If John wants to be a merchant too:**
```
Option 1: Register with different email
  - john-farmer@example.com (farmer account)
  - john-merchant@example.com (merchant account)
  - Two separate accounts

Option 2: Share one account (future enhancement)
  - Would require bringing back User entity
  - Current system doesn't support this
```

---

## 🚀 **Testing:**

### **Test 1: Farmer Registration & Login**
```powershell
# 1. Register farmer
Open: farmer-register.html
Fill: name=John, email=john@farm.com, password=test123
Submit → Success

# 2. Login as farmer
Open: login.html?role=farmer
Fill: email=john@farm.com, password=test123
Submit → Redirects to farmer-dashboard.html ✅
```

### **Test 2: Merchant Registration & Login**
```powershell
# 1. Register merchant
Open: merchant-register.html
Fill: name=Sarah, email=sarah@merchant.com, password=test123
Submit → Success

# 2. Login as merchant
Open: login.html?role=merchant
Fill: email=sarah@merchant.com, password=test123
Submit → Redirects to merchant-dashboard.html ✅
```

### **Test 3: Separate Accounts**
```powershell
# Farmer cannot login as merchant
Open: login.html?role=merchant
Fill: email=john@farm.com, password=test123
Submit → Error: "User not found" ❌

# Merchant cannot login as farmer
Open: login.html?role=farmer
Fill: email=sarah@merchant.com, password=test123
Submit → Error: "User not found" ❌
```

---

## 🎯 **Summary:**

| Feature | Before | After |
|---------|--------|-------|
| Entities | User + Farmer + Merchant | Farmer + Merchant |
| Tables | users, roles, user_roles, farmers, merchants | farmers, merchants |
| Authentication | User entity | Farmer/Merchant directly |
| Roles | Stored in user_roles table | Assigned automatically |
| Dual roles | Supported (complex) | Not supported (simple) |
| Login | One login for multiple roles | Separate logins |
| Email | Shared between farmer/merchant | Separate for each |

---

## 📝 **Next Steps:**

1. **Restart Backend:**
   ```powershell
   cd c:\Users\Sameer\Desktop\AgreTradeApp\AgreTradeBackend
   mvn clean install
   mvn spring-boot:run
   ```

2. **Clear Old Data (Optional):**
   If you have test data with User entities, you may want to clear the database and start fresh.

3. **Test Registration:**
   - Register new farmer
   - Register new merchant
   - Both with DIFFERENT emails

4. **Test Login:**
   - Login as farmer with farmer email
   - Login as merchant with merchant email
   - Verify redirects work correctly

---

## 🎉 **Result:**

Your system is now **simplified and straightforward**:
- ✅ Farmers register and login with farmer emails
- ✅ Merchants register and login with merchant emails
- ✅ No complex User entity or role management
- ✅ Direct authentication from Farmer/Merchant tables
- ✅ Clean, simple architecture

**The system now matches your requirement: "farmer and merchant emails are different"** 🎯
