# 🚀 Quick Start Guide - 5 Minutes to Data Visualization

Get the complete Data Visualization Explorer running in minutes!

## ⚙️ System Requirements

| Component | Requirement |
|-----------|-------------|
| **Python** | 3.8 or higher |
| **Node.js** | 14.x or higher |
| **npm** | 6.x or higher |
| **RAM** | 2GB minimum |
| **Disk** | 500MB free space |

## 📥 Installation (First Time Only)

### Terminal 1: Backend Setup

```bash
# Navigate to Backend
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Terminal 2: Frontend Setup

```bash
# Navigate to Frontend
cd Frontend

# Install dependencies
npm install
```

## 🎬 Running the Application

### Terminal 1: Start Backend

```bash
cd Backend
# Activate venv (if not already active)
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 [CTRL+C to quit]
```

✅ Backend ready at http://localhost:8000

### Terminal 2: Start Frontend

```bash
cd Frontend
npm start
```

**Browser opens automatically to:**
```
http://localhost:3000
```

✅ Application is running!

## 📊 First Steps

1. **Open Browser**: Go to http://localhost:3000
2. **Upload Data**: Click "Choose File" and select any of these formats:
   - ✅ CSV files
   - ✅ JSON files
   - ✅ Excel (.xlsx)
   - ✅ Tab-separated (.tsv)
   - ✅ Text files (.txt)

3. **Analyze**: Click "Upload & Analyze"
4. **Explore**: View statistics and visualizations
5. **Filter**: Apply filters to explore data subsets

## 📁 Sample Files to Try

Create `test.csv`:
```csv
name,age,salary,date
Alice,25,45000,2023-01-15
Bob,32,55000,2023-02-20
Carol,28,50000,2023-01-25
David,35,60000,2023-03-10
Eve,29,52000,2023-02-14
```

## 🎨 Features to Explore

### Data Types Automatically Detected
- 📊 **Numeric**: Shows distributions
- 📈 **Categorical**: Shows bar charts
- 📅 **Temporal**: Shows line charts
- 📝 **Text**: Shows word clouds

### Interactive Controls
- 🎛️ **Sliders**: Numeric range filtering
- ☑️ **Checkboxes**: Category selection
- 🔍 **Search**: Text search
- 🌙 **Dark Mode**: Toggle in header

### Real-time Updates
- All charts update instantly
- Filter multiple columns
- See row counts change
- Statistics update live

## 🐛 Quick Troubleshooting

### "Backend connection refused"
```bash
# Check if port 8000 is available
# Or try starting backend again
cd Backend
source venv/bin/activate
python main.py
```

### "Module not found" error
```bash
# Reinstall dependencies
cd Frontend
npm install
# or
cd Backend
pip install -r requirements.txt
```

### "npm command not found"
- Install Node.js from nodejs.org
- Restart terminal
- Try `npm start` again

### Port already in use
```bash
# Change port in Frontend package.json or use:
PORT=3001 npm start
```

## 🎓 Use Cases

### For Educators
- 📚 Interactive data exploration in class
- 🔍 Real-world analytics examples
- 🎯 Student projects and assignments

### For Data Analysis
- 🔬 Research data exploration
- 📊 Business intelligence dashboards
- 🎯 Quick data profiling

### For Developers
- 🏗️ Full-stack application example
- 🔄 REST API integration
- ⚛️ Modern React patterns

## 📊 Supported Data Formats

| Format | Usage | Max Size |
|--------|-------|----------|
| CSV | Tabular data | 500MB |
| JSON | Structured data | 500MB |
| XLSX | Excel files | 500MB |
| TSV | Tab-separated | 500MB |
| TXT | Text analysis | 500MB |

## 🚀 Next Steps

### Deploy to Production
1. See main [README.md](README.md)
2. Choose hosting platform
3. Configure environment variables

### Customize the App
1. Edit [Frontend components](Frontend/src/components/)
2. Modify [Backend statistics](Backend/main.py)
3. Add new visualization types

### Learn the Architecture
1. Read [Backend README](Backend/README.md)
2. Read [Frontend README](Frontend/README.md)
3. Review API documentation

## 💡 Pro Tips

### Data Exploration Best Practices
1. Start with CSV for simplicity
2. Check data types in info panel
3. Look for outliers in histograms
4. Apply filters progressively
5. Use dark mode for long sessions

### Performance Tips
- Start with small files (< 10MB)
- Close other browser tabs
- Restart if app becomes sluggish
- Use Chrome for best performance

### Handling Large Files
- Split data into chunks
- Pre-filter before uploading
- Use more powerful machine
- Contact support for issues

## ✅ Verification Checklist

After starting, verify:

- [ ] Backend shows "Uvicorn running" message
- [ ] Frontend opens in browser automatically
- [ ] Can see upload box in browser
- [ ] Can select and upload a test file
- [ ] Charts appear after upload
- [ ] Filters work and update visualizations
- [ ] Dark mode toggle works
- [ ] No red errors in browser console

## 📞 Getting Help

**Check Documentation:**
- [Main README](README.md) - Full project overview
- [Backend README](Backend/README.md) - API documentation
- [Frontend README](Frontend/README.md) - Component guide

**Verify Installation:**
```bash
# Check Python version
python --version

# Check Node version
node --version

# Check npm version
npm --version
```

**Common Issues:**
- Ensure all requirements installed
- Check internet connection
- Verify ports 3000 and 8000 available
- Try restarting both servers

## 🎉 You're Ready!

Everything is set up. Now:

1. Open http://localhost:3000
2. Upload your data
3. Start exploring!

**Happy visualizing!** 📊✨

---

**Questions?** Check the full [README.md](README.md)
