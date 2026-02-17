# 📅 Nepali Calendar 2082–2092 PWA

Complete Nepali Calendar with Finance Management, Insurance, Vehicle, Subscriptions & More

## 🌟 Features

### 📅 Calendar System
- **Multiple Views**: Year, Month, Week, and Day views - **All Fully Functional**
- **Hamro Patro Theme**: Authentic Nepali calendar styling
- **Holiday Management**: Import/export holidays, automatic detection
- **Saturday & Holiday Highlighting**: Red cell marking as per Hamro Patro
- **Nepali Day Names**: आइत, सोम, मंगल, बुध, बिहि, शुक्र, शनि
- **Event Indicators**: Color-coded dots for income, expenses, notes, bills
- **Date Conversion**: BS ↔ AD date conversion
- **Responsive Design**: Mobile-friendly interface
- **Weekly Summaries**: Complete weekly financial and event summaries
- **Daily Summaries**: Detailed daily breakdown with all data types

### 💰 Finance Management
- **Income & Expense Tracking**: Complete financial overview
- **Budget Management**: Set and track monthly budgets
- **Recurring Transactions**: Automated recurring entries
- **Financial Reports**: Visual charts and summaries
- **Currency Support**: Multiple currencies with exchange rates
- **Tax Calculator**: Nepal tax calculation system

### 🏢 Life Management
- **Goals & Targets**: Set and track personal goals
- **Insurance Management**: Policy tracking and reminders
- **Vehicle Management**: Maintenance and expense tracking
- **Subscription Tracking**: Monitor all subscriptions
- **Shopping Lists**: Organized shopping management
- **Notes & Reminders**: Comprehensive note-taking system with priority levels

### 🎯 Advanced Features
- **PWA Support**: Install as mobile app
- **Offline Mode**: Works without internet
- **Data Export**: Export data in multiple formats (CSV, Excel, JSON)
- **Data Import**: Import from CSV, Excel, JSON
- **Backup & Restore**: Complete data backup system
- **Dark Mode**: Eye-friendly dark theme
- **Duplicate Detection**: Find and remove duplicates across all modules
- **Debug Commands**: Built-in debugging tools for troubleshooting

## 🚀 Quick Start

### Windows
1. Double-click `start-server.bat`
2. Open browser to: http://localhost:8000

### Mac/Linux
1. Run: `./start-server.sh`
2. Open browser to: http://localhost:8000

### Manual Start
```bash
# Navigate to project folder
cd path/to/nepali-calendar-pwa

# Run Python server
python -m http.server 8000

# Open browser
http://localhost:8000
```

## 📱 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local server)
- Optional: Node.js (for development)

### Local Development
```bash
# Clone or download the project
git clone <repository-url>
cd nepali-calendar-pwa

# Start local server
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000

# Open browser
http://localhost:8000
```

### PWA Installation
1. Open the app in Chrome/Edge browser
2. Click the install icon (📱) in address bar
3. Install as desktop/mobile app
4. Access from home screen like native app

## 📖 User Guide

### Calendar Views
- **Year View**: Overview of all 12 months with event indicators and monthly summaries
- **Month View**: Detailed monthly calendar with daily events, holidays, and notes
- **Week View**: 7-day week view with detailed events and weekly summaries
- **Day View**: Single day detailed view with complete event breakdown

### Adding Events
1. Navigate to desired date
2. Click on calendar cell or use FAB button
3. Select event type (Income, Expense, Note, Bill)
4. Fill in details and save

### Managing Holidays
1. Go to Settings → Holiday Management
2. Add individual holidays or import from file
3. Export holidays for backup
4. Remove duplicates if needed

### Financial Management
1. **Income**: Add salary, business income, investments
2. **Expenses**: Track daily expenses and categorize
3. **Budget**: Set monthly limits and track spending
4. **Reports**: View financial summaries and charts

### Data Management
1. **Export**: Download data as CSV, Excel, or JSON
2. **Import**: Upload data from external files
3. **Backup**: Create complete data backups
4. **Restore**: Restore from backup files

### Debugging & Troubleshooting
The application includes built-in debugging tools:
- **debugCheckAllFeatures()**: Comprehensive feature verification
- **debugHealthCheck()**: Quick system health check
- **debugTestImportExport()**: Test import/export functions
- **debugTestCoreFunctions()**: Test core date functions
- **debugTestDatabase()**: Test database connections
- **debugTestUI()**: Test UI rendering
- **debugTestEventListeners()**: Test event listeners
- **debugRunAllTests()**: Run all tests

Access these tools via browser console: `debugHealthCheck()`

## 🎨 Theme & Customization

### Hamro Patro Theme
- Red/coral primary colors matching Hamro Patro
- Holiday cells marked in red
- Saturday cells highlighted in red
- Nepali day names and styling

### Dark Mode
- Toggle dark/light theme
- Automatic system theme detection
- Custom color schemes

### Customization Options
- Currency settings
- Date format preferences
- Language preferences
- Notification settings

## 🔧 Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: IndexedDB (browser storage)
- **PWA**: Service Worker, Web App Manifest
- **Calendar**: Custom Nepali calendar implementation
- **Charts**: Chart.js for financial visualizations

### File Structure
```
nepali-calendar-pwa/
├── index.html          # Main HTML file
├── style.css           # Complete styling
├── app.js              # Main JavaScript application
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── README.md          # Documentation
├── help.md            # Help documentation
├── start-server.bat   # Windows startup script
├── start-server.sh    # Mac/Linux startup script
└── assets/            # Images and icons
```

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📊 Data Storage

### Local Storage
- **IndexedDB**: All user data stored locally
- **No server required**: Complete offline functionality
- **Data persistence**: Remains after browser close
- **Export capability**: Backup data anytime

### Data Types
- **Calendar Events**: Income, expenses, notes, bills
- **Holidays**: Nepali holidays and custom events
- **Financial Data**: Budgets, recurring transactions
- **Personal Data**: Goals, insurance, vehicles, subscriptions
- **Settings**: User preferences and configurations

## 🔒 Privacy & Security

### Data Privacy
- **Local Storage**: All data stored on user's device
- **No data transmission**: No data sent to external servers
- **Offline First**: Works completely offline
- **User Control**: Full control over data export/deletion

### Security Features
- **HTTPS Ready**: Secure when deployed on HTTPS
- **No Tracking**: No analytics or tracking
- **Open Source**: Transparent codebase
- **Self-Hosted**: Can be hosted on personal servers

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- **GitHub Pages**: Free hosting for public repos
- **Netlify**: Easy deployment with continuous integration
- **Vercel**: Modern hosting with automatic HTTPS
- **Firebase Hosting**: Google's hosting solution
- **Surge.sh**: Simple static site hosting

### Server Setup
```bash
# Build for production (if needed)
# No build step required - static files

# Deploy to server
cp -r * /var/www/html/
# or use any static hosting service
```

### Domain Configuration
- Upload files to web server
- Configure domain DNS
- Enable HTTPS (recommended)
- Set up PWA manifest

## 🤝 Contributing

### Development Setup
```bash
# Fork the repository
git clone <your-fork>
cd nepali-calendar-pwa

# Make changes
# Test thoroughly

# Submit pull request
git push origin main
```

### Code Guidelines
- Use ES6+ JavaScript features
- Follow existing code structure
- Add comments for complex logic
- Test on multiple browsers
- Maintain responsive design

## 🐛 Troubleshooting

### Common Issues
1. **Server not starting**: Check Python installation
2. **Data not saving**: Enable browser storage permissions
3. **PWA not installing**: Use HTTPS or localhost
4. **Calendar not updating**: Clear browser cache
5. **Import errors**: Check file format and encoding
6. **View switching errors**: Check browser console for JavaScript errors

### Debug Mode
Access built-in debugging tools:
1. Open browser console (F12)
2. Run `debugHealthCheck()` for quick system check
3. Run `debugCheckAllFeatures()` for comprehensive testing
4. Check console output for specific error messages

### Support
- Check [help.md](help.md) for detailed assistance
- Report issues on GitHub repository
- Check browser console for errors
- Ensure browser compatibility

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Hamro Patro**: For calendar design inspiration
- **Nepali Calendar Community**: For date conversion algorithms
- **Open Source Contributors**: For valuable feedback and contributions

## 📞 Contact

For support, suggestions, or contributions:
- Create an issue on GitHub
- Check the help documentation
- Review the FAQ section

---

**Version**: 2.1  
**Last Updated**: January 2026  
**Compatible**: BS 2082-2092 | AD 2025-2036  
**Status**: ✅ Fully Operational - All Views Working