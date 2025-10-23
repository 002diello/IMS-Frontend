# Master Laptop - Backend & Database Update Guide

## 📋 Overview

This guide covers the complete update of the Master Laptop feature with new staff tracking fields.

---

## 🗄️ Database Changes

### New Fields Added:
1. **last_routine_status** (VARCHAR 255) - Last staff name who had the laptop
2. **current_routine_status** (VARCHAR 255) - Current staff name using the laptop  
3. **employee_no** (VARCHAR 100) - Employee number

### Removed Field:
- **routine_status** - Replaced by current_routine_status

### SQL Migration Script

**Location:** `c:\Users\AXIBIAIDI\Desktop\Projects\ims\database_laptop_update.sql`

**Run this in your MariaDB:**

```sql
USE ims;

-- Add new columns
ALTER TABLE master_laptop
ADD COLUMN last_routine_status VARCHAR(255) COMMENT 'Last staff name who had the laptop',
ADD COLUMN current_routine_status VARCHAR(255) COMMENT 'Current staff name using the laptop',
ADD COLUMN employee_no VARCHAR(100) COMMENT 'Employee number';

-- Drop old column
ALTER TABLE master_laptop
DROP COLUMN IF EXISTS routine_status;

-- Verify changes
DESCRIBE master_laptop;
```

---

## ☕ Backend Changes

### 1. Entity Updated: `MasterLaptop.java`

**Location:** `c:\Users\AXIBIAIDI\Desktop\Projects\ims\src\main\java\com\ims\system\entity\MasterLaptop.java`

**New Fields:**
```java
// Staff assignment tracking
private String lastRoutineStatus;      // Last staff name who had the laptop
private String currentRoutineStatus;   // Current staff name using the laptop
private String staffCompany;
private String employeeNo;

// Staff dates
private LocalDate joinDate;
private LocalDate lastWorkingDay;
```

### 2. Service Updated: `MasterLaptopService.java`

**Location:** `c:\Users\AXIBIAIDI\Desktop\Projects\ims\src\main\java\com\ims\system\service\MasterLaptopService.java`

**Updated `updateLaptop()` method to include:**
- `setLastRoutineStatus()`
- `setCurrentRoutineStatus()`
- `setEmployeeNo()`

### 3. Controller: `MasterLaptopController.java`

**No changes needed** - Already handles all fields automatically via `@RequestBody`

**Endpoints:**
- `GET /api/laptops` - Get all laptops
- `GET /api/laptops/{id}` - Get laptop by ID
- `POST /api/laptops` - Create new laptop
- `PUT /api/laptops/{id}` - Update laptop
- `DELETE /api/laptops/{id}` - Delete laptop

---

## 🎨 Frontend Changes

### Updated Fields in Form:

**All 15 Fields:**
1. Invoice Number *
2. CSI Agreement *
3. Start Date *
4. End Date *
5. Laptop Entity *
6. Model *
7. Serial Number *
8. PC ID *
9. **Last ROUTINE STATUS (Staff Name)** ✨ NEW
10. **Current ROUTINE STATUS (Staff Name)** ✨ NEW
11. Staff Company
12. **Employee No** ✨ NEW
13. Join Date
14. Last Working Day
15. Remark

### Table View Columns (in order):

1. **PC ID** - Laptop identifier
2. **Model** - Laptop model
3. **End Date** - Contract end date
4. **Serial Number** - Device serial
5. **Current Staff** - Currently assigned staff (green badge)
6. **Staff Company** - Company name
7. **Last Working Day** - Staff's last day
8. **Actions** - Edit/Delete buttons

---

## 🚀 Deployment Steps

### Step 1: Update Database

```bash
# Login to MariaDB
mysql -u root -p

# Run the migration script
source c:/Users/AXIBIAIDI/Desktop/Projects/ims/database_laptop_update.sql

# Or copy-paste the SQL commands directly
```

### Step 2: Rebuild Spring Boot Backend

```bash
cd c:\Users\AXIBIAIDI\Desktop\Projects\ims

# Clean and rebuild
mvn clean install

# Or just restart the application
mvn spring-boot:run
```

### Step 3: Verify Backend

Test the API endpoints:

```bash
# Get all laptops
curl http://localhost:8080/api/laptops

# Create a laptop (example)
curl -X POST http://localhost:8080/api/laptops \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV001",
    "model": "Dell Latitude 5420",
    "pcId": "PC001",
    "currentRoutineStatus": "John Doe",
    "employeeNo": "EMP001"
  }'
```

### Step 4: Frontend Already Updated

The React frontend at `c:\Users\AXIBIAIDI\Desktop\Projects\my-app` is already updated with:
- ✅ New form fields
- ✅ Updated table columns
- ✅ Proper field mapping

---

## 📊 Complete Field Mapping

| Frontend Field | Backend Field | Database Column | Type |
|---------------|---------------|-----------------|------|
| invoiceNumber | invoiceNumber | invoice_number | String |
| csiAgreement | csiAgreement | csi_agreement | String |
| startDate | startDate | start_date | LocalDate |
| endDate | endDate | end_date | LocalDate |
| laptopEntity | laptopEntity | laptop_entity | String |
| model | model | model | String |
| serialNumber | serialNumber | serial_number | String |
| pcId | pcId | pc_id | String |
| **lastRoutineStatus** ✨ | **lastRoutineStatus** | **last_routine_status** | String |
| **currentRoutineStatus** ✨ | **currentRoutineStatus** | **current_routine_status** | String |
| staffCompany | staffCompany | staff_company | String |
| **employeeNo** ✨ | **employeeNo** | **employee_no** | String |
| joinDate | joinDate | join_date | LocalDate |
| lastWorkingDay | lastWorkingDay | last_working_day | LocalDate |
| remark | remark | remark | String |

---

## ✅ Testing Checklist

### Database:
- [ ] Run SQL migration script
- [ ] Verify new columns exist: `DESCRIBE master_laptop;`
- [ ] Check old `routine_status` column is removed

### Backend:
- [ ] Rebuild Spring Boot application
- [ ] Test GET `/api/laptops` - Should return all laptops
- [ ] Test POST `/api/laptops` - Create with new fields
- [ ] Test PUT `/api/laptops/{id}` - Update with new fields
- [ ] Test DELETE `/api/laptops/{id}` - Delete laptop
- [ ] Verify no compilation errors

### Frontend:
- [ ] Form shows all 15 fields
- [ ] Table shows 8 columns (PC ID, Model, End Date, Serial, Current Staff, Staff Company, Last Working Day, Actions)
- [ ] Can add new laptop with all fields
- [ ] Can edit existing laptop
- [ ] Can delete laptop
- [ ] Search works across all fields
- [ ] Statistics cards update correctly

---

## 🔧 Troubleshooting

### Issue: Database column not found

**Solution:**
```sql
-- Check if columns exist
SHOW COLUMNS FROM master_laptop;

-- Manually add if missing
ALTER TABLE master_laptop ADD COLUMN current_routine_status VARCHAR(255);
```

### Issue: Backend compilation errors

**Solution:**
```bash
# Clean Maven cache
mvn clean

# Rebuild
mvn install -DskipTests

# If still failing, check Lombok is installed
```

### Issue: Frontend not showing new fields

**Solution:**
- Clear browser cache (Ctrl + Shift + Delete)
- Restart React dev server
- Check browser console for errors

---

## 📝 Summary

### What Changed:

**Database:**
- ✅ Added 3 new columns
- ✅ Removed 1 old column

**Backend:**
- ✅ Updated `MasterLaptop` entity
- ✅ Updated `MasterLaptopService`
- ✅ Controller already compatible

**Frontend:**
- ✅ Added 3 new form fields
- ✅ Updated table columns
- ✅ Better UI/UX

### Benefits:

1. **Better Staff Tracking** - Know who currently has each laptop
2. **History Tracking** - See who previously had the laptop
3. **Employee Linking** - Track by employee number
4. **Cleaner UI** - More relevant columns in table view
5. **Complete Data** - All 15 fields available in form

---

## 🎉 You're Done!

Your Master Laptop feature is now fully updated with comprehensive staff tracking capabilities!

**Next Steps:**
1. Run the SQL migration
2. Restart Spring Boot
3. Test the application
4. Start managing laptops with the new fields!
