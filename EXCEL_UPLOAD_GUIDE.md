# 📊 Excel Upload Feature - Master Laptop

## ✨ New Features Added

Your Master Laptop page now has **Excel bulk import** functionality!

### 🎯 What You Can Do:

1. **Download Template** - Get a pre-formatted Excel file
2. **Upload Excel** - Import multiple laptops at once
3. **Auto-Import** - Data automatically saves to database

---

## 🚀 How to Use

### **Step 1: Download Template**

1. Go to **Master Laptop** page
2. Click **"Download Template"** button (green)
3. Excel file `laptop_import_template.xlsx` will download
4. Open it in Excel/Google Sheets

### **Step 2: Fill in Your Data**

The template has these columns (in exact order):

| Column Name | Example | Required |
|-------------|---------|----------|
| Invoice No | INV-001 | ✅ |
| CSI Agreement | CSI-AGR-001 | ✅ |
| Start Date | 2024-01-01 | ✅ |
| End Date | 2025-12-31 | ✅ |
| Laptop Entity | Company Laptop | ✅ |
| Model | Dell Latitude 5420 | ✅ |
| Serial No | SN123456789 | ✅ |
| PC ID | PC-001 | ✅ |
| Last ROUTINE STATUS | (empty or staff name) | ❌ |
| Current ROUTINE STATUS | John Doe | ❌ |
| Staff Company | ABC Corporation | ❌ |
| Employee No | EMP001 | ❌ |
| Join Date | 2024-01-15 | ❌ |
| Last Working Day | (empty or date) | ❌ |
| Remark | Sample laptop entry | ❌ |

**Tips:**
- ✅ Keep column names exactly as shown
- ✅ Use date format: YYYY-MM-DD (e.g., 2024-01-15)
- ✅ Leave cells empty if no data
- ✅ Delete the sample row before adding your data

### **Step 3: Upload Excel File**

1. Click **"Upload Excel"** button (purple)
2. Select your filled Excel file
3. Wait for upload to complete
4. You'll see progress: "Reading file..." → "Processing X rows..." → "Uploading X/Y..."
5. Success message shows: "Import complete! Success: X, Failed: Y"
6. Table automatically refreshes with new data

---

## 📋 Excel Template Format

```
Invoice No | CSI Agreement | Start Date | End Date | Laptop Entity | Model | Serial No | PC ID | ...
INV-001    | CSI-AGR-001  | 2024-01-01 | 2025-12-31 | Company Laptop | Dell Latitude 5420 | SN123456789 | PC-001 | ...
INV-002    | CSI-AGR-002  | 2024-02-01 | 2025-12-31 | Company Laptop | HP EliteBook 840   | SN987654321 | PC-002 | ...
```

---

## 🎨 UI Features

### **Three Action Buttons:**

1. **Download Template** (Green)
   - Icon: Download
   - Downloads Excel template
   - Pre-formatted with correct columns

2. **Upload Excel** (Purple)
   - Icon: Upload
   - Opens file picker
   - Accepts .xlsx and .xls files

3. **Add New Laptop** (Blue)
   - Icon: Plus
   - Opens manual entry form
   - For single laptop entry

### **Upload Progress Indicator:**

Shows real-time progress:
- 🔵 "Reading file..."
- 🔵 "Processing 10 rows..."
- 🔵 "Uploading 5/10..."
- ✅ "Import complete!"

---

## ⚙️ How It Works

### **Backend Process:**

1. **Read Excel** - Uses `xlsx` library to parse file
2. **Map Columns** - Converts Excel columns to database fields
3. **Validate Data** - Checks for required fields
4. **Upload One by One** - Sends each row to `/api/laptops` endpoint
5. **Track Progress** - Shows success/fail count
6. **Refresh List** - Reloads table with new data

### **Column Mapping:**

The system accepts both formats:
- Excel format: "Invoice No", "CSI Agreement", etc.
- Database format: "invoiceNumber", "csiAgreement", etc.

```javascript
invoiceNumber: row['Invoice No'] || row['invoiceNumber']
```

---

## 🔍 Troubleshooting

### **Issue: Upload fails**

**Possible causes:**
1. ❌ Wrong column names
2. ❌ Invalid date format
3. ❌ Backend not running
4. ❌ Not logged in

**Solutions:**
1. ✅ Use downloaded template
2. ✅ Use YYYY-MM-DD for dates
3. ✅ Check Spring Boot is running
4. ✅ Login first

### **Issue: Some rows fail to import**

**Check:**
- Missing required fields
- Invalid data format
- Duplicate PC ID or Serial Number
- Check browser console for errors

### **Issue: Template download doesn't work**

**Solution:**
- Check browser allows downloads
- Try different browser
- Check Downloads folder

---

## 📊 Example Excel Data

```excel
Invoice No    | CSI Agreement  | Start Date  | End Date    | Model              | Serial No   | PC ID
INV-2024-001 | CSI-2024-001  | 2024-01-01  | 2025-12-31  | Dell Latitude 5420 | SN12345678  | PC-001
INV-2024-002 | CSI-2024-002  | 2024-01-15  | 2025-12-31  | HP EliteBook 840   | SN87654321  | PC-002
INV-2024-003 | CSI-2024-003  | 2024-02-01  | 2025-12-31  | Lenovo ThinkPad    | SN11223344  | PC-003
```

---

## ✅ Testing Checklist

- [ ] Download template works
- [ ] Template has correct columns
- [ ] Can fill in Excel data
- [ ] Upload button appears
- [ ] Can select Excel file
- [ ] Progress indicator shows
- [ ] Data imports to database
- [ ] Table refreshes automatically
- [ ] Success message appears
- [ ] Failed imports are reported

---

## 🎉 Benefits

1. **Fast Bulk Import** - Add 100+ laptops in seconds
2. **No Manual Entry** - Copy from existing spreadsheets
3. **Error Tracking** - Know which rows failed
4. **Progress Feedback** - See upload status in real-time
5. **Template Provided** - No guessing column names

---

## 📝 Notes

- Maximum file size: Depends on browser (usually ~10MB)
- Recommended: Import in batches of 100-500 rows
- Each row is uploaded individually (allows partial success)
- Failed rows are logged in browser console
- Template includes 1 sample row (delete before importing)

---

## 🔧 Technical Details

**Libraries Used:**
- `xlsx` - Excel file parsing
- React hooks - State management
- Axios - API calls

**API Endpoint:**
- `POST /api/laptops` - Creates each laptop

**File Format:**
- Accepts: `.xlsx`, `.xls`
- Encoding: UTF-8
- Date format: YYYY-MM-DD

---

## 🎯 Quick Start

1. Click **"Download Template"**
2. Fill in your laptop data
3. Click **"Upload Excel"**
4. Select your file
5. Wait for completion
6. Done! 🎉

Your laptops are now in the database!
