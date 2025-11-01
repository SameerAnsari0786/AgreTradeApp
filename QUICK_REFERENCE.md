# 🌾 AgreTrade - Quick Reference Card

## 🎯 **START HERE**: Open `start.html` in your browser

---

## 👨‍🌾 **I AM A FARMER** (I want to SELL crops)

### What do I do?
1. **Register** → Fill name, email, password, phone, address
2. **Login** → Use your email and password
3. **Add Crops** → Click "Add Crop" button
   - Enter: Crop name, price, quantity, description
   - Example: Wheat, ₹25/kg, 5000 kg
4. **Wait** → Merchants will search and contact you

### Where is my stuff?
- **Dashboard**: Shows your profile and statistics
- **"🌾 Crops" button**: Click to see all your listed crops
- **"Add Crop" button**: Click to add a new crop for sale

---

## 🏢 **I AM A MERCHANT** (I want to BUY crops)

### What do I do?
1. **Register** → Fill business name, email, password, phone, address
2. **Login** → Use your email and password
3. **Search** → Type crop name in search box (e.g., "wheat")
4. **View Results** → See all farmers selling that crop
5. **Contact** → Call or WhatsApp the farmer directly

### What will I see?
- Crop name (e.g., Wheat)
- Price (e.g., ₹25/kg)
- Quantity (e.g., 5000 kg)
- Farmer's name
- Farmer's phone number
- Farmer's address

---

## 🔑 **IMPORTANT POINTS**

### Before You Start:
✅ **Backend MUST be running**: `cd AgreTradeBackend; mvn spring-boot:run`
✅ **MySQL MUST be running**: Database `agretrade_db` on localhost:3306

### Login Tips:
✅ Use your **EMAIL** (not username) to login
✅ Password is case-sensitive
✅ Token expires after 24 hours (just login again)

### Common Mistakes:
❌ Trying to login without registering first
❌ Using username instead of email
❌ Forgetting to start the backend
❌ Searching for crop that doesn't exist (no results)

---

## 🚀 **QUICK COMMANDS**

### Start Backend:
```bash
cd AgreTradeBackend
mvn spring-boot:run
```
Wait for: "Started AgreTradeApplication"

### Open Frontend:
- Option 1: Double-click `start.html`
- Option 2: Open in browser: `file:///C:/Users/Sameer/Desktop/AgreTradeApp/frontend/start.html`

### Check MySQL:
```bash
mysql -u root -p
SHOW DATABASES;
USE agretrade_db;
SHOW TABLES;
```

---

## 📂 **FILE MAP**

| File | Purpose |
|------|---------|
| `start.html` | 🔴 **START HERE** - Main entry point |
| `how-it-works.html` | Visual guide with examples |
| `login.html` | Login page for both farmers & merchants |
| `farmer-register.html` | Farmer registration form |
| `merchant-register.html` | Merchant registration form |
| `farmer-dashboard.html` | Farmer's control panel (add/view crops) |
| `merchant-dashboard.html` | Merchant's search panel (find crops) |
| `home.html` | Detailed home page (optional) |

---

## 💡 **TYPICAL USER FLOWS**

### New Farmer Flow:
```
start.html → "I'm a Farmer" → Register → Success → Login → Dashboard → Add Crop → Done!
```

### Returning Farmer Flow:
```
start.html → "I'm a Farmer" → Login → Dashboard → View Crops / Add More Crops
```

### New Merchant Flow:
```
start.html → "I'm a Merchant" → Register → Success → Login → Dashboard → Search Crops → Contact Farmer
```

### Returning Merchant Flow:
```
start.html → "I'm a Merchant" → Login → Dashboard → Search Any Crop
```

---

## 🎯 **ONE-SENTENCE SUMMARY**

**Farmers** list crops with prices → **Merchants** search and find farmers → Direct contact → Deal done offline!

---

## 🐛 **QUICK TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| Can't login | Check: Email (not username), correct password, backend running |
| Crops not showing | Farmer: Add crops first. Merchant: Search for crop name |
| 401 Error | Login again (token expired) |
| CORS Error | Restart backend |
| Blank page | Check browser console (F12) |
| Backend won't start | Check MySQL is running, check application.properties |

---

## 📱 **BUTTONS EXPLAINED**

### Farmer Dashboard:
- **🌾 Crops**: View all your crops in a modal
- **➕ Add Crop**: Open form to add new crop
- **✏️ Edit**: Update crop details
- **🗑️ Delete**: Remove crop from listing
- **🚪 Logout**: Exit dashboard

### Merchant Dashboard:
- **🔍 Search Box**: Type crop name and press Enter
- **📞 Call**: Open phone dialer
- **💬 WhatsApp**: Open WhatsApp chat
- **🚪 Logout**: Exit dashboard

---

## 🎨 **COLOR CODES**

- **Purple** = General/Platform
- **Green** = Farmer-related
- **Orange** = Merchant-related
- **Red** = Error/Warning
- **Blue** = Info/Action

---

## ⚡ **POWER USER TIPS**

1. **For Farmers**: Add multiple crops to increase visibility
2. **For Merchants**: Search with partial names (e.g., "tom" finds "tomatoes")
3. **Refresh Dashboard**: Click browser refresh to see updates
4. **Direct URLs**: Bookmark your dashboard for quick access
5. **Multiple Accounts**: Use different emails for testing

---

## 🔐 **SECURITY REMINDER**

- Passwords are encrypted (BCrypt)
- JWT tokens expire after 24 hours
- Never share your password
- Use strong passwords (8+ characters)

---

## 📞 **NEED HELP?**

1. Open browser console (F12) to see errors
2. Check backend terminal for logs
3. Read `HOW_TO_USE.md` for detailed guide
4. Read `README.md` for technical details
5. Open `how-it-works.html` for visual guide

---

**That's it! Simple as that. 🚀**

**Remember: start.html → Register/Login → Use Dashboard → Connect & Trade!**
