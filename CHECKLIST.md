# ✅ Project Startup Checklist

## Pre-Flight Checklist

### 1. Prerequisites Installed?
- [ ] Python 3.8 or higher (`python3 --version`)
- [ ] Node.js 14.x or higher (`node --version`)
- [ ] npm (`npm --version`)

### 2. Project Files Present?
- [ ] Backend/main.py exists
- [ ] Backend/requirements.txt exists
- [ ] Frontend/package.json exists
- [ ] Frontend/src/App.js exists
- [ ] All component files in Frontend/src/components/

---

## Backend Setup (Terminal 1)

### First Time Setup:
- [ ] Navigate to Backend folder: `cd Backend`
- [ ] Create virtual environment: `python3 -m venv venv`
- [ ] Activate venv: `source venv/bin/activate`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Start server: `python main.py`
- [ ] Verify at http://localhost:8000

### Expected Output:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Subsequent Runs:
- [ ] `cd Backend`
- [ ] `source venv/bin/activate`
- [ ] `python main.py`

---

## Frontend Setup (Terminal 2)

### First Time Setup:
- [ ] Navigate to Frontend folder: `cd Frontend`
- [ ] Install dependencies: `npm install`
- [ ] Start development server: `npm start`
- [ ] Browser opens automatically to http://localhost:3000

### Expected Output:
```
Compiled successfully!

You can now view csv-dataset-explorer in the browser.

  Local:            http://localhost:3000
```

### Subsequent Runs:
- [ ] `cd Frontend`
- [ ] `npm start`

---

## Testing the Application

### 1. Initial Load:
- [ ] Frontend opens at http://localhost:3000
- [ ] See "Interactive CSV Dataset Explorer" header
- [ ] See upload section
- [ ] See instructions

### 2. Upload Sample Data:
- [ ] Click "Choose CSV file"
- [ ] Select `sample_data.csv` from project root
- [ ] Click "Upload & Analyze"
- [ ] See success message

### 3. Verify Features:
- [ ] Dataset info shows 20 rows, 6 columns
- [ ] Column types are detected correctly
- [ ] Statistics are displayed
- [ ] Charts are rendered (histograms and bar charts)
- [ ] No errors in browser console

### 4. Test Filtering:
- [ ] Select a numeric column (e.g., "age")
- [ ] Set min/max range
- [ ] Click "Apply Filter"
- [ ] See updated charts and row count
- [ ] Click "Reset All"
- [ ] Data returns to original state

### 5. Test Categorical Filter:
- [ ] Select a categorical column (e.g., "department")
- [ ] Check some categories
- [ ] Click "Apply Filter"
- [ ] See filtered results
- [ ] Click "Reset All"

---

## Common Issues & Solutions

### Backend Issues:

**Issue:** Port 8000 already in use
```bash
# Solution:
lsof -ti:8000 | xargs kill -9
```

**Issue:** Module not found
```bash
# Solution:
source venv/bin/activate
pip install -r requirements.txt
```

**Issue:** Permission denied on start.sh
```bash
# Solution:
chmod +x start.sh
```

### Frontend Issues:

**Issue:** Port 3000 already in use
- Solution: Press 'y' when asked to use another port

**Issue:** Dependencies not installed
```bash
# Solution:
rm -rf node_modules
npm install
```

**Issue:** CORS error in console
- Solution: Make sure backend is running on port 8000

---

## API Endpoints Verification

Once backend is running, verify endpoints:

- [ ] GET http://localhost:8000 → {"status": "ok"}
- [ ] GET http://localhost:8000/docs → Swagger UI
- [ ] POST http://localhost:8000/upload → Accepts CSV file
- [ ] POST http://localhost:8000/filter → Accepts filter params
- [ ] DELETE http://localhost:8000/reset → Resets data

---

## Success Criteria

Your setup is successful when:

✅ Backend server running without errors  
✅ Frontend loads without errors  
✅ Sample CSV uploads successfully  
✅ Charts display correctly  
✅ Filters work and update data  
✅ Reset functionality works  
✅ No console errors  

---

## Quick Commands Reference

### Backend:
```bash
cd Backend
source venv/bin/activate
python main.py
```

### Frontend:
```bash
cd Frontend
npm start
```

### Both (using script):
```bash
./start.sh
```

### Stop servers:
Press `Ctrl+C` in each terminal

---

## Need Help?

1. ✅ Check this checklist
2. ✅ Read QUICKSTART.md
3. ✅ Review README.md
4. ✅ Check Backend/README.md
5. ✅ Check Frontend/README.md
6. ✅ Look at terminal error messages
7. ✅ Check browser console (F12)

---

**Last Updated:** Project Creation Date  
**Status:** Ready for deployment ✅
