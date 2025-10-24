# 📋 Assign & Return Feature - Complete Guide

## ✨ Overview

The Assign & Return feature is now **fully integrated** with Master Laptop! Admin can assign available laptops to staff and mark them as returned, automatically updating the Master Laptop inventory.

---

## 🔄 How It Works

### **Assignment Flow:**
1. Admin clicks "Assign Laptop"
2. Selects an **available laptop** from dropdown (only shows laptops without current staff)
3. Fills in staff details
4. Clicks "Assign"
5. **Master Laptop automatically updates:**
   - `currentRoutineStatus` = Staff Name
   - `employeeNo` = Employee ID
   - Laptop becomes "Assigned" (no longer available)

### **Return Flow:**
1. Admin clicks Return button (↻) on assigned laptop
2. Confirms return
3. **Master Laptop automatically updates:**
   - `lastRoutineStatus` = Previous staff name
   - `currentRoutineStatus` = NULL (cleared)
   - `lastWorkingDay` = Today's date
   - Laptop becomes "Available" for new assignment

---

## 🗄️ Database Structure

### **Assignments Table:**
```sql
CREATE TABLE assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    staff_entity VARCHAR(255),
    pc_id VARCHAR(100),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    user_name VARCHAR(255),          -- Same as current_routine_status
    remark TEXT,
    employee_id VARCHAR(100),
    email VARCHAR(255),
    assigned_at DATE,                -- Auto-set on assignment
    returned_at DATE,                -- Auto-set on return
    master_laptop_id BIGINT,         -- Foreign key to master_laptop
    status VARCHAR(50),              -- 'Assigned' or 'Returned'
    FOREIGN KEY (master_laptop_id) REFERENCES master_laptop(id)
);
```

---

## 🚀 Setup Instructions

### **Step 1: Create Database Table**

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `ims` database
3. Click SQL tab
4. Run this script:

```sql
USE ims;

CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_entity VARCHAR(255) COMMENT 'Staff department or entity',
    pc_id VARCHAR(100) COMMENT 'PC ID from master laptop',
    model VARCHAR(255) COMMENT 'Laptop model',
    serial_number VARCHAR(255) COMMENT 'Serial number',
    user_name VARCHAR(255) COMMENT 'Staff name (same as current_routine_status)',
    remark TEXT COMMENT 'Additional notes',
    employee_id VARCHAR(100) COMMENT 'Employee ID',
    email VARCHAR(255) COMMENT 'Employee email',
    assigned_at DATE COMMENT 'Date laptop was assigned',
    returned_at DATE COMMENT 'Date laptop was returned',
    master_laptop_id BIGINT COMMENT 'Foreign key to master_laptop table',
    status VARCHAR(50) DEFAULT 'Assigned' COMMENT 'Assignment status',
    
    FOREIGN KEY (master_laptop_id) REFERENCES master_laptop(id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_master_laptop_id (master_laptop_id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_pc_id (pc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### **Step 2: Restart Spring Boot Backend**

```bash
cd c:\Users\AXIBIAIDI\Desktop\Projects\ims
mvn spring-boot:run
```

### **Step 3: Test the Feature**

1. Go to **Master Laptop** page
2. Add some laptops (leave `currentRoutineStatus` empty)
3. Go to **Assign & Return** page
4. Click "Assign Laptop"
5. Select a laptop from dropdown
6. Fill in staff details
7. Click "Assign"
8. Go back to **Master Laptop** - laptop now shows as assigned!

---

## 📊 Features

### **1. Assign Laptop**
- **Dropdown shows only available laptops**
- Auto-fills PC ID, Model, Serial Number
- Validates all required fields
- Updates Master Laptop instantly

### **2. Return Laptop**
- Click ↻ button on assigned laptop
- Confirms before returning
- Clears current staff from Master Laptop
- Sets last working day
- Moves staff name to "Last ROUTINE STATUS"

### **3. Real-Time Sync**
- Assignment creates → Master Laptop updates
- Return processes → Master Laptop clears
- Both pages stay synchronized

### **4. Smart Filtering**
- Only shows available laptops in assignment dropdown
- Search works across all fields
- Statistics update in real-time

---

## 🎯 API Endpoints

### **Backend Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | Get all assignments |
| GET | `/api/assignments/active` | Get active assignments only |
| GET | `/api/assignments/{id}` | Get assignment by ID |
| POST | `/api/assignments` | Create new assignment |
| PUT | `/api/assignments/{id}` | Update assignment |
| PUT | `/api/assignments/{id}/return` | Mark laptop as returned |
| DELETE | `/api/assignments/{id}` | Delete assignment |

---

## 📝 Field Mapping

### **Assignment → Master Laptop:**

| Assignment Field | Master Laptop Field | When |
|-----------------|---------------------|------|
| `userName` | `currentRoutineStatus` | On Assign |
| `employeeId` | `employeeNo` | On Assign |
| `userName` | `lastRoutineStatus` | On Return |
| NULL | `currentRoutineStatus` | On Return |
| Today's date | `lastWorkingDay` | On Return |

---

## 🔍 How to Use

### **Assign a Laptop:**

1. **Click "Assign Laptop"** button
2. **Select laptop** from dropdown
   - Shows: PC-001 - Dell Latitude 5420 (SN123456789)
   - Only available laptops appear
3. **Fill staff details:**
   - Staff Entity: IT Department
   - Employee ID: EMP001
   - User Name: John Doe
   - Email: john@company.com
4. **Add remark** (optional)
5. **Click "Assign Laptop"**
6. ✅ Done! Laptop assigned and Master Laptop updated

### **Return a Laptop:**

1. **Find assigned laptop** in table
2. **Click ↻ (Return) button**
3. **Confirm** the return
4. ✅ Done! Laptop returned and available again

---

## 📈 Statistics

The page shows real-time statistics:
- **Total Assignments** - All assignment records
- **Active Assignments** - Currently assigned laptops
- **Returned** - Laptops that have been returned

---

## 🔄 Synchronization Examples

### **Example 1: New Assignment**

**Before:**
```
Master Laptop (PC-001):
- currentRoutineStatus: NULL
- employeeNo: NULL
```

**After Assignment:**
```
Master Laptop (PC-001):
- currentRoutineStatus: "John Doe"
- employeeNo: "EMP001"

Assignment Record:
- userName: "John Doe"
- employeeId: "EMP001"
- status: "Assigned"
- assignedAt: "2024-10-24"
```

### **Example 2: Laptop Return**

**Before:**
```
Master Laptop (PC-001):
- currentRoutineStatus: "John Doe"
- lastRoutineStatus: NULL
- lastWorkingDay: NULL
```

**After Return:**
```
Master Laptop (PC-001):
- currentRoutineStatus: NULL
- lastRoutineStatus: "John Doe"
- lastWorkingDay: "2024-10-24"

Assignment Record:
- status: "Returned"
- returnedAt: "2024-10-24"
```

---

## ✅ Testing Checklist

- [ ] Database table created successfully
- [ ] Backend starts without errors
- [ ] Can access Assign & Return page
- [ ] Dropdown shows available laptops
- [ ] Can assign laptop to staff
- [ ] Master Laptop updates after assignment
- [ ] Laptop disappears from available dropdown
- [ ] Can return assigned laptop
- [ ] Master Laptop clears after return
- [ ] Laptop reappears in available dropdown
- [ ] Statistics update correctly
- [ ] Search works properly
- [ ] Edit assignment works
- [ ] Error messages display correctly

---

## 🐛 Troubleshooting

### **Issue: No laptops in dropdown**

**Cause:** All laptops are assigned  
**Solution:** 
1. Go to Master Laptop
2. Clear `currentRoutineStatus` for some laptops
3. Or add new laptops

### **Issue: Assignment fails**

**Possible causes:**
- Missing required fields
- Backend not running
- Database table not created

**Solutions:**
1. Check all required fields are filled
2. Verify Spring Boot is running
3. Run database migration script

### **Issue: Master Laptop not updating**

**Cause:** Foreign key not set correctly  
**Solution:**
- Check `masterLaptopId` is saved in assignment
- Verify laptop exists in master_laptop table

---

## 🎉 Benefits

1. **Automatic Sync** - No manual updates needed
2. **Data Integrity** - Foreign key ensures consistency
3. **Audit Trail** - Track all assignments and returns
4. **Real-Time** - Changes reflect immediately
5. **User-Friendly** - Simple dropdown selection
6. **Error Prevention** - Can't assign already-assigned laptops

---

## 📚 Technical Details

### **Backend Services:**

**AssignmentService.java:**
- `createAssignment()` - Creates assignment + updates Master Laptop
- `returnLaptop()` - Marks returned + clears Master Laptop
- Uses `@Transactional` for data consistency

**Frontend Components:**

**AssignReturn.jsx:**
- Fetches available laptops from `/api/laptops`
- Filters by `currentRoutineStatus` (empty = available)
- Auto-fills laptop details on selection
- Calls `/api/assignments` endpoints

---

## 🔐 Security

- Requires authentication (configured in SecurityConfig)
- Only authenticated users can access
- Can be restricted to ADMIN role if needed

---

## 📊 Database Relationships

```
master_laptop (1) ←→ (many) assignments
- One laptop can have multiple assignment records (history)
- Current assignment: status = 'Assigned'
- Past assignments: status = 'Returned'
```

---

## 🎯 Quick Start

1. **Run SQL script** → Create assignments table
2. **Restart backend** → Load new entities
3. **Add laptops** → In Master Laptop page
4. **Assign laptops** → In Assign & Return page
5. **Return laptops** → Click ↻ button
6. **Check Master Laptop** → See updates!

Your Assign & Return feature is now fully functional and synchronized with Master Laptop! 🎉
