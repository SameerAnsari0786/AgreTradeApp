# 🔄 Dual Role System - Complete Guide

## 🎯 New Feature: One Person, Multiple Roles!

Now users can be **BOTH Farmer AND Merchant** with the same email account!

---

## ✨ How It Works

### **Scenario: John wants to sell AND buy crops**

1. **Register as Farmer First:**
   - Go to `farmer-register.html`
   - Fill form with email: `john@example.com`
   - Creates User + Farmer profile
   - User gets `ROLE_FARMER`

2. **Add Merchant Role:**
   - Login to farmer dashboard
   - See option to "Register as Merchant Too"
   - OR go directly to `merchant-register.html`
   - Use **SAME EMAIL**: `john@example.com`
   - Creates Merchant profile
   - User gets `ROLE_MERCHANT` added (now has BOTH roles)

3. **Login and Choose Role:**
   - Login with email: `john@example.com`
   - System detects multiple roles
   - Shows role selection screen
   - Choose: "Continue as Farmer" OR "Continue as Merchant"

4. **Switch Roles Anytime:**
   - In Farmer Dashboard → Click "🔄 Switch to Merchant"
   - In Merchant Dashboard → Click "🔄 Switch to Farmer"
   - Seamless switching without logging out!

---

## 🔧 Technical Implementation

### **Backend Changes:**

#### **1. FarmerServiceImpl.java**
```java
// OLD: Rejected if email exists
if (userRepository.existsByEmail(farmer.getEmail())) {
    throw new RuntimeException("User with this email already exists");
}

// NEW: Adds FARMER role to existing user
User user = userRepository.findByEmail(farmer.getEmail()).orElse(null);
if (user == null) {
    // Create new user
} else {
    // Add FARMER role to existing user
}
user.getRoles().add(farmerRole);
```

#### **2. MerchantServiceImpl.java**
```java
// Same logic - adds MERCHANT role to existing user
User user = userRepository.findByEmail(merchant.getEmail()).orElse(null);
if (user == null) {
    // Create new user
} else {
    // Add MERCHANT role to existing user
}
user.getRoles().add(merchantRole);
```

#### **3. AuthController.java - New Endpoint**
```java
@GetMapping("/roles")
public ResponseEntity<?> getUserRoles(@RequestHeader("Authorization") String authHeader) {
    // Returns all roles for logged-in user
    // Example: ["ROLE_FARMER", "ROLE_MERCHANT"]
}
```

---

### **Frontend Changes:**

#### **1. role-selection.html** (NEW PAGE)
- Shows available roles after login
- "Continue as Farmer" button
- "Continue as Merchant" button
- Option to add additional role

#### **2. login.js**
```javascript
// After successful login:
1. Fetch user roles from /api/auth/roles
2. Store roles in localStorage
3. If single role → Direct redirect to dashboard
4. If multiple roles → Redirect to role-selection.html
```

#### **3. farmer-dashboard.html + merchant-dashboard.html**
- Added "🔄 Switch Role" button (shown only if user has both roles)
- Button switches between dashboards

#### **4. farmer-dashboard.js + merchant-dashboard.js**
```javascript
// Check if user has multiple roles
function checkMultipleRoles() {
    const roles = JSON.parse(localStorage.getItem('userRoles'));
    if (roles.includes('ROLE_MERCHANT')) {
        // Show "Switch to Merchant" button
    }
}

// Switch role function
function switchRole() {
    localStorage.setItem('currentRole', 'ROLE_MERCHANT');
    window.location.href = 'merchant-dashboard.html';
}
```

---

## 📊 Database Structure

### **Example: John has both roles**

**users table:**
```sql
id | username        | email           | password
1  | john@example.com | john@example.com | $2a$10$...
```

**user_roles table:**
```sql
user_id | role_id
1       | 2       (ROLE_FARMER)
1       | 3       (ROLE_MERCHANT)
```

**farmers table:**
```sql
id | name | email           | phoneNumber | address
1  | John | john@example.com | 9876543210  | Punjab
```

**merchants table:**
```sql
id | name | email           | phoneNumber | address
1  | John | john@example.com | 9876543211  | Delhi
```

---

## 🎬 User Journey Examples

### **Journey 1: Farmer adds Merchant role**

```
1. Register as Farmer (john@example.com)
   ↓
2. Login → Farmer Dashboard
   ↓
3. Add crops (sell as farmer)
   ↓
4. Click "Register as Merchant Too" (or go to merchant-register.html)
   ↓
5. Fill merchant registration with SAME EMAIL
   ↓
6. Merchant profile created, ROLE_MERCHANT added
   ↓
7. Logout and login again
   ↓
8. See role selection: Farmer or Merchant
   ↓
9. Choose Merchant → Search and buy crops
   ↓
10. Switch to Farmer → Manage your own crops
```

---

### **Journey 2: Using Switch Button**

```
1. Login as john@example.com
   ↓
2. Choose "Continue as Farmer"
   ↓
3. Farmer Dashboard → Add crops
   ↓
4. Click "🔄 Switch to Merchant" button
   ↓
5. Merchant Dashboard → Search crops
   ↓
6. Find wheat from another farmer
   ↓
7. Contact that farmer via WhatsApp
   ↓
8. Click "🔄 Switch to Farmer" button
   ↓
9. Back to Farmer Dashboard → Manage inventory
```

---

## 🎯 Use Cases

### **Use Case 1: Farmer who also buys**
- **Problem:** Farmer grows wheat but needs rice for personal use
- **Solution:** 
  - Register as farmer (sell wheat)
  - Add merchant role (buy rice)
  - Switch roles as needed

### **Use Case 2: Merchant who also farms**
- **Problem:** Merchant buys crops but also has small farm
- **Solution:**
  - Register as merchant (buy crops)
  - Add farmer role (sell own crops)
  - Dual income streams!

### **Use Case 3: Middleman/Trader**
- **Problem:** Person buys from farmers and sells to other merchants
- **Solution:**
  - Use merchant role to search and buy
  - Use farmer role to list purchased items for resale
  - Complete trading platform!

---

## 🔐 Security & Permissions

### **Role-Based Access Control:**

**ROLE_FARMER can access:**
- ✅ `/api/farmers/**` - Farmer operations
- ✅ `/api/crops/**` - Crop management
- ❌ `/api/merchants/**` - Merchant-specific operations

**ROLE_MERCHANT can access:**
- ✅ `/api/merchants/**` - Merchant operations
- ✅ `/api/crops/search` - Search crops
- ❌ `/api/farmers/register` - Farmer registration (already a farmer)

**User with BOTH roles can:**
- ✅ Access ALL endpoints
- ✅ Switch between dashboards
- ✅ Manage both profiles independently

---

## 📝 LocalStorage Data

After login with dual roles:

```javascript
localStorage.getItem('authToken')
// "eyJhbGciOiJIUzI1NiJ9..."

localStorage.getItem('username')
// "john@example.com"

localStorage.getItem('userRoles')
// '["ROLE_FARMER", "ROLE_MERCHANT"]'

localStorage.getItem('currentRole')
// "ROLE_FARMER" or "ROLE_MERCHANT" (currently active)
```

---

## 🎨 UI/UX Features

### **1. Role Selection Screen**
- Beautiful gradient cards
- Clear role descriptions
- Smooth animations
- Options to add missing roles

### **2. Dashboard Role Switcher**
- Button only shown if user has multiple roles
- Icon: 🔄 (circular arrow)
- Text: "Switch to Merchant" or "Switch to Farmer"
- Instant switching (no logout required)

### **3. Smart Redirects**
- Single role → Direct dashboard access
- Multiple roles → Role selection first
- Remembers last chosen role (optional enhancement)

---

## 🚀 Testing the Dual Role System

### **Test 1: Register Both Roles**

```powershell
# 1. Open farmer registration
start farmer-register.html

# 2. Register farmer
Name: Test Farmer
Email: dual@test.com
Password: test123
Phone: 9876543210
Address: Punjab

# 3. Open merchant registration  
start merchant-register.html

# 4. Register merchant with SAME EMAIL
Name: Test Merchant
Email: dual@test.com
Password: test123
Phone: 9876543211
Address: Delhi

# 5. Login
start login.html
Email: dual@test.com
Password: test123

# 6. Should see role selection screen!
```

---

### **Test 2: Switch Between Roles**

```
1. Login → Choose "Continue as Farmer"
2. Farmer Dashboard loaded
3. Check: "🔄 Switch to Merchant" button visible?
4. Click button
5. Merchant Dashboard loaded
6. Check: "🔄 Switch to Farmer" button visible?
7. Click button
8. Back to Farmer Dashboard
✅ SUCCESS!
```

---

### **Test 3: Add Second Role Later**

```
1. Login as farmer-only user
2. Farmer Dashboard
3. "Switch Role" button NOT visible (correct!)
4. Click "Register as Merchant Too" option
5. Fill merchant registration
6. Logout
7. Login again
8. Role selection screen appears!
✅ ROLE ADDED!
```

---

## 🔄 API Flow Diagram

```
Registration Flow (Adding Second Role):
────────────────────────────────────

POST /api/merchants/register
{
  "name": "John",
  "email": "john@example.com",  ← Email already exists!
  "password": "test123",
  "phoneNumber": "9876543210",
  "address": "Delhi"
}
    ↓
MerchantServiceImpl.registerMerchant()
    ↓
Check: merchantRepository.existsByEmail() → FALSE ✅
    ↓
Check: userRepository.findByEmail() → FOUND! ✅
    ↓
Get existing User object
    ↓
Add ROLE_MERCHANT to user.roles
    ↓
Save User (UPDATE, not INSERT)
    ↓
Save Merchant (INSERT)
    ↓
User now has: [ROLE_FARMER, ROLE_MERCHANT]


Login Flow (Multi-Role User):
──────────────────────────────

POST /api/auth/login
{
  "username": "john@example.com",
  "password": "test123"
}
    ↓
Authentication successful
    ↓
Generate JWT token
    ↓
Return token + username
    ↓
Frontend: GET /api/auth/roles
    Authorization: Bearer {token}
    ↓
AuthController.getUserRoles()
    ↓
Extract username from JWT
    ↓
Find User by username
    ↓
Get user.roles → ["ROLE_FARMER", "ROLE_MERCHANT"]
    ↓
Return roles to frontend
    ↓
Frontend: roles.length > 1?
    YES → Show role-selection.html
    NO → Direct redirect to dashboard
```

---

## 🎉 Benefits of Dual Role System

### **For Users:**
- ✅ Single login for multiple roles
- ✅ No need for multiple accounts
- ✅ Seamless role switching
- ✅ Better user experience

### **For Platform:**
- ✅ Unified user management
- ✅ Better data consistency
- ✅ Reduced duplicate accounts
- ✅ Enhanced features (buy from yourself scenario prevented automatically)

### **For Business:**
- ✅ More flexible platform
- ✅ Supports real-world use cases
- ✅ Competitive advantage
- ✅ User retention

---

## 📚 Summary

| Feature | Before | After |
|---------|--------|-------|
| Roles per email | ONE | MULTIPLE |
| Account switching | Logout/Login | Button click |
| Role selection | Auto-detect | User chooses |
| Registration | Reject duplicate email | Add role to existing user |
| Dashboard access | Single role only | All assigned roles |

---

## 🎓 Next Steps

1. **Restart Backend:**
   ```powershell
   cd c:\Users\Sameer\Desktop\AgreTradeApp\AgreTradeBackend
   mvn spring-boot:run
   ```

2. **Test Registration:**
   - Register farmer with email `test@test.com`
   - Register merchant with **SAME EMAIL** `test@test.com`
   - Should succeed! ✅

3. **Test Login:**
   - Login with `test@test.com`
   - Should see role selection screen
   - Choose role
   - Should see switch button in dashboard

4. **Test Switching:**
   - Click "Switch to Merchant/Farmer"
   - Should switch dashboards instantly
   - No logout required!

---

## 🎯 Real-World Example

**Rajesh - A Smart Farmer:**

1. **Morning (as Farmer):**
   - Login → Choose Farmer
   - Add 5000 kg Wheat for ₹25/kg
   - Add 3000 kg Rice for ₹40/kg
   - Total inventory managed

2. **Afternoon (as Merchant):**
   - Click "Switch to Merchant"
   - Search for "Corn" (he needs it)
   - Find Suresh selling corn at ₹30/kg
   - Call Suresh via WhatsApp
   - Purchase 2000 kg corn

3. **Evening (back to Farmer):**
   - Click "Switch to Farmer"
   - Update wheat inventory (sold 1000 kg)
   - Check messages from merchants
   - Plan next day's sales

**Result:** Rajesh uses ONE account for buying AND selling! 🎉

---

**This is a complete dual-role system that mimics real-world agricultural trading!** 🌾🏢
