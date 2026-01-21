# Interactive CSV Dataset Explorer - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Open Two Terminal Windows

You'll need two terminals - one for backend, one for frontend.

---

### Step 2: Start the Backend

**Terminal 1:**
```bash
# Navigate to Backend folder
cd Backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend is ready at: http://localhost:8000

---

### Step 3: Start the Frontend

**Terminal 2:**
```bash
# Navigate to Frontend folder
cd Frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

Your browser will automatically open to: http://localhost:3000

✅ Application is ready to use!

---

## 📝 First Time Setup Summary

**Backend (Terminal 1):**
```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Frontend (Terminal 2):**
```bash
cd Frontend
npm install
npm start
```

---

## 🔄 Subsequent Runs

After the first setup, you only need:

**Backend:**
```bash
cd Backend
source venv/bin/activate
python main.py
```

**Frontend:**
```bash
cd Frontend
npm start
```

---

## 🧪 Testing the Application

1. Open http://localhost:3000 in your browser
2. Click "Choose CSV file"
3. Select the included `sample_data.csv` file
4. Click "Upload & Analyze"
5. Explore the visualizations and try the filters!

---

## ⚠️ Troubleshooting

### Backend Issues

**"python3: command not found"**
- Install Python from https://www.python.org/downloads/

**"Port 8000 already in use"**
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**"npm: command not found"**
- Install Node.js from https://nodejs.org/

**"Port 3000 already in use"**
- The terminal will ask if you want to use a different port
- Type 'y' and press Enter

---

## 🛑 Stopping the Application

Press `Ctrl+C` in each terminal window to stop the servers.

---

## 📚 Need More Help?

- Backend details: See `Backend/README.md`
- Frontend details: See `Frontend/README.md`
- Full documentation: See main `README.md`

---

## ✨ Using the Startup Script (Optional)

For convenience, you can use the included startup script:

```bash
chmod +x start.sh
./start.sh
```

This will start both servers automatically!
