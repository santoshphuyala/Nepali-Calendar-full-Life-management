# 📚 Nepali Calendar Help & Documentation

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Calendar Navigation](#calendar-navigation)
3. [Event Management](#event-management)
4. [Financial Management](#financial-management)
5. [Holiday Management](#holiday-management)
6. [Data Management](#data-management)
7. [Settings & Customization](#settings--customization)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## 🚀 Getting Started

### First Time Setup
1. **Open the Application**: Launch the app in your browser
2. **Allow Storage**: Grant browser storage permissions when prompted
3. **Set Current Date**: The app automatically detects today's date
4. **Explore Views**: Try Year, Month, Week, and Day views
5. **Add Your First Event**: Click on any date to add income, expense, or note

### Basic Navigation
- **Calendar Views**: Switch between Year/Month/Week/Day using view buttons
- **Navigation Tabs**: Access different modules (Calendar, Tracker, Budget, etc.)
- **FAB Button**: Floating action button for quick event addition
- **Settings**: Configure app preferences in Settings tab

---

## 📅 Calendar Navigation

### Year View
- **Overview**: See all 12 months at a glance
- **Event Indicators**: Color-coded dots show event types
- **Holiday Count**: 🎉 shows number of holidays per month
- **Navigation**: Click any month to jump to that month
- **Current Month**: Highlighted with special border

### Month View
- **Daily View**: Detailed view of each day
- **Event Dots**: Small colored circles indicate events
  - 🟢 Green: Income
  - 🔴 Red: Expenses  
  - 🟠 Coral: Notes
  - 🟡 Yellow: Bills
- **Holiday Cells**: Red background for holidays
- **Saturday Cells**: Light red background for Saturdays
- **Today**: Blue circle around today's date

### Week View
- **7-Day Overview**: Current week with detailed events
- **Event Details**: Full event information displayed
- **Navigation**: Use controls to change weeks

### Day View
- **Detailed View**: All events for a single day
- **Event Categories**: Organized by type (Income, Expenses, Notes, Bills)
- **Quick Actions**: Add/edit/delete events directly

### Date Navigation
- **Month Selector**: Use dropdown to jump to specific months
- **Year Selector**: Navigate between years
- **Today Button**: Quick return to current date
- **Arrow Buttons**: Previous/Next month navigation

---

## 📝 Event Management

### Adding Events

#### Quick Add (FAB Button)
1. Click the floating + button
2. Select event type (Income, Expense, Note, Bill)
3. Fill in required fields
4. Click Save

#### Calendar Cell Add
1. Click on any calendar date
2. Choose event type from drawer
3. Complete the form
4. Save the event

#### Event Types
- **💰 Income**: Salary, business income, investments, gifts
- **💸 Expense**: Daily expenses, bills, purchases
- **📝 Notes**: Reminders, appointments, events, tasks
- **💳 Bills**: Recurring bills, utilities, subscriptions

### Event Details

#### Income/Expense Fields
- **Amount**: Numeric value (e.g., 5000)
- **Category**: Type of income/expense
- **Description**: Optional details
- **Date**: Automatically set from calendar

#### Note Fields
- **Title**: Brief description
- **Content**: Detailed note content
- **Priority**: High, Medium, Low
- **Category**: Personal, Work, etc.
- **Reminder**: Set reminder time
- **Repeat**: Yearly recurring option

#### Bill Fields
- **Name**: Bill description
- **Amount**: Bill amount
- **Due Date**: When bill is due
- **Category**: Utility, subscription, etc.

### Editing Events
1. Click on existing event in any view
2. Edit the information
3. Save changes

### Deleting Events
1. Click on event to open details
2. Click Delete button
3. Confirm deletion

---

## 💰 Financial Management

### Income Tracking
- **Add Income**: Record all sources of income
- **Categories**: Salary, Business, Investment, Other
- **Recurring Income**: Set up automatic recurring entries
- **Income Reports**: View monthly/yearly income summaries

### Expense Tracking
- **Daily Expenses**: Record all spending
- **Categories**: Food, Transport, Entertainment, etc.
- **Expense Analysis**: Track spending patterns
- **Budget Comparison**: Compare expenses against budget

### Budget Management
1. **Set Monthly Budget**: Go to Budget tab
2. **Add Categories**: Create budget categories
3. **Set Limits**: Define spending limits per category
4. **Track Progress**: Monitor budget usage
5. **Budget Alerts**: Visual indicators when approaching limits

### Financial Reports
- **Monthly Summary**: Income vs. expense overview
- **Category Breakdown**: Spending by category
- **Trend Analysis**: Financial patterns over time
- **Charts**: Visual representations of financial data

### Currency Management
- **Default Currency**: Set in Settings
- **Exchange Rates**: Update rates automatically
- **Multi-Currency**: Support for different currencies

---

## 🎉 Holiday Management

### Adding Holidays
1. Go to Settings → Holiday Management
2. Click "Add Holiday"
3. Fill in holiday details:
   - **Date BS**: Nepali date (YYYY/MM/DD)
   - **Name**: Holiday name
   - **Type**: National, Religious, Cultural
4. Save the holiday

### Importing Holidays
1. **CSV Format**: Prepare CSV file with columns:
   ```
   date_bs,name,type
   2082/01/01,New Year,National
   2082/01/11,Maha Shivaratri,Religious
   ```
2. Click "Import Holidays"
3. Select CSV file
4. Confirm import

### Exporting Holidays
1. Go to Settings → Holiday Management
2. Click "Export Holidays"
3. Choose format (CSV, Excel, JSON)
4. Download the file

### Managing Holidays
- **View List**: All holidays displayed in chronological order
- **Edit**: Click holiday to modify details
- **Delete**: Remove unwanted holidays
- **Remove Duplicates**: Automatic duplicate detection and removal

### Holiday Display
- **Red Cells**: Holidays marked with red background
- **Holiday Labels**: Holiday names displayed in calendar cells
- **Saturday Highlighting**: Saturdays automatically highlighted

---

## 💾 Data Management

### Exporting Data

#### Supported Formats
- **CSV**: Excel-compatible format
- **Excel**: .xlsx format with multiple sheets
- **JSON**: Structured data format

#### Export Options
1. **Monthly Calendar**: Current month calendar
2. **Yearly Calendar**: Full year calendar
3. **Holidays Only**: Holiday list only
4. **Events & Notes**: All events and notes
5. **Complete Data**: Everything including settings

#### Export Steps
1. Click Export dropdown in calendar controls
2. Select export type
3. Choose format
4. Download file

### Importing Data

#### File Requirements
- **CSV**: Proper headers and formatting
- **Excel**: .xlsx or .xls files
- **JSON**: Valid JSON structure

#### Import Types
- **Monthly Calendar**: Calendar with events
- **Yearly Calendar**: Full year data
- **Holidays**: Holiday list
- **Events**: Income, expenses, notes, bills
- **Complete**: All data types

#### Import Steps
1. Click Import dropdown
2. Select import type
3. Choose file
4. Confirm import
5. Review imported data

### Backup & Restore

#### Creating Backup
1. Go to Settings → Data Management
2. Click "Backup Data"
3. Choose backup format
4. Save backup file

#### Restoring Data
1. Click "Restore Data"
2. Select backup file
3. Confirm restore
4. Wait for completion

### Data Safety
- **Local Storage**: All data stored locally in browser
- **Regular Backups**: Export data regularly
- **Multiple Formats**: Keep backups in different formats
- **Version Control**: Maintain backup versions

---

## ⚙️ Settings & Customization

### General Settings
- **Dark Mode**: Toggle dark/light theme
- **Default Currency**: Set primary currency
- **Date Format**: Choose display format
- **Language**: Interface language preferences

### Calendar Settings
- **Week Start Day**: Choose first day of week
- **Holiday Display**: Show/hide holidays
- **Event Indicators**: Customize event dots
- **Calendar Theme**: Choose color scheme

### Financial Settings
- **Currency Symbol**: Set currency display
- **Exchange Rates**: Update rates manually
- **Tax Settings**: Configure tax calculation
- **Budget Alerts**: Enable/disable notifications

### Data Settings
- **Auto Backup**: Automatic backup scheduling
- **Data Retention**: Set data retention period
- **Export Format**: Default export format
- **Import Settings**: Import preferences

### Notification Settings
- **Event Reminders**: Enable/disable reminders
- **Holiday Alerts**: Holiday notifications
- **Budget Alerts**: Overspending warnings
- **Sound Effects**: Interface sound settings

---

## 🐛 Troubleshooting

### Common Issues

#### Application Not Loading
**Problem**: App shows blank screen or errors
**Solutions**:
1. Check browser compatibility (Chrome, Firefox, Safari, Edge)
2. Enable JavaScript in browser settings
3. Clear browser cache and cookies
4. Try incognito/private mode
5. Check browser console for errors

#### Data Not Saving
**Problem**: Events disappear after refresh
**Solutions**:
1. Enable browser storage permissions
2. Check available storage space
3. Clear browser data and restart
4. Try different browser
5. Export data before clearing

#### Calendar Not Updating
**Problem**: Calendar shows old data
**Solutions**:
1. Refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check system date/time
4. Restart browser
5. Re-open application

#### Import/Export Issues
**Problem**: Files not importing/exporting correctly
**Solutions**:
1. Check file format (CSV, Excel, JSON)
2. Verify file encoding (UTF-8)
3. Check file size limits
4. Validate file structure
5. Try smaller files first

#### PWA Installation Issues
**Problem**: Cannot install as mobile app
**Solutions**:
1. Use Chrome/Edge browser
2. Ensure HTTPS or localhost
3. Clear browser cache
4. Check PWA compatibility
5. Update browser version

### Performance Issues

#### Slow Performance
**Causes**: Large data sets, old browser, low memory
**Solutions**:
1. Export and delete old data
2. Clear browser cache
3. Close other browser tabs
4. Update browser
5. Restart device

#### Memory Issues
**Causes**: Too much data, memory leaks
**Solutions**:
1. Regular data cleanup
2. Export and archive old data
3. Restart browser regularly
4. Use data export to reduce size

### Browser-Specific Issues

#### Chrome/Edge
- Enable JavaScript
- Allow local storage
- Update to latest version
- Clear cache regularly

#### Firefox
- Enable IndexedDB
- Allow storage permissions
- Update browser
- Check privacy settings

#### Safari
- Enable JavaScript
- Allow local storage
- Update to latest version
- Check privacy settings

---

## ❓ Frequently Asked Questions

### General Questions

**Q: Is my data safe?**
A: Yes! All data is stored locally in your browser and never transmitted to servers.

**Q: Can I use this app offline?**
A: Yes, the app works completely offline once loaded.

**Q: Will I lose my data if I clear browser cache?**
A: Yes, clearing browser data will delete all locally stored data. Always export before clearing.

**Q: Can I install this as a mobile app?**
A: Yes, it's a PWA. Install it from Chrome/Edge browser for app-like experience.

### Calendar Questions

**Q: How do I add holidays?**
A: Go to Settings → Holiday Management → Add Holiday or import from CSV file.

**Q: Why are some days marked in red?**
A: Red cells indicate holidays (dark red) and Saturdays (light red) following Hamro Patro style.

**Q: Can I customize the calendar theme?**
A: Yes, the app uses Hamro Patro theme by default. Dark mode is available in settings.

**Q: How do I switch between calendar views?**
A: Use the Year/Month/Week/Day buttons in the calendar controls.

### Data Questions

**Q: How do I backup my data?**
A: Go to Settings → Data Management → Backup Data. Export in CSV, Excel, or JSON format.

**Q: Can I import data from other calendar apps?**
A: Yes, if the data is in CSV, Excel, or JSON format with proper structure.

**Q: What happens if I lose my data?**
A: Without backup, data cannot be recovered. Regular backups are recommended.

**Q: Can I use this on multiple devices?**
A: Data is stored locally per device/browser. Export/import to sync between devices.

### Financial Questions

**Q: How do I set a budget?**
A: Go to Budget tab → Add Budget Category → Set monthly limit.

**Q: Can I track multiple currencies?**
A: Yes, set default currency in settings and update exchange rates.

**Q: How do I add recurring income/expenses?**
A: Add the item and set it as recurring in the Tracker module.

### Technical Questions

**Q: What browsers are supported?**
A: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

**Q: Do I need internet connection?**
A: Only for initial load. Works completely offline thereafter.

**Q: Can I host this myself?**
A: Yes, it's a static app. Upload to any web server with HTTPS.

**Q: Is the source code available?**
A: Yes, it's open source. Check the repository for code.

---

## 📞 Getting Help

### Self-Help Resources
- **This Help File**: Comprehensive documentation
- **Browser Console**: Check for error messages
- **README.md**: Technical documentation
- **GitHub Issues**: Report bugs and request features

### Community Support
- **GitHub Repository**: Report issues and contribute
- **User Forums**: Community discussions (if available)
- **Documentation**: Check all help resources first

### Contact Information
- **Bug Reports**: Create GitHub issue with details
- **Feature Requests**: Submit through GitHub issues
- **General Questions**: Check FAQ and documentation first

### Reporting Issues
When reporting issues, include:
1. **Browser and version**
2. **Operating system**
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Console errors (if any)**
6. **Screenshots (if helpful)

---

## 💡 Tips & Tricks

### Calendar Tips
- **Quick Navigation**: Use Today button to return to current date
- **Event Types**: Use different event types for better organization
- **Holiday Planning**: Import holidays for the entire year at once
- **Color Coding**: Event dots help identify activity at a glance

### Financial Tips
- **Regular Tracking**: Enter expenses daily for accuracy
- **Category Planning**: Use consistent categories for better reports
- **Budget Monitoring**: Check budget status regularly
- **Monthly Reviews**: Review financial reports monthly

### Data Management Tips
- **Regular Backups**: Export data weekly or monthly
- **File Organization**: Keep exported files organized by date
- **Version Control**: Maintain multiple backup versions
- **Data Cleanup**: Remove old or unnecessary data periodically

### Productivity Tips
- **Quick Add**: Use FAB button for fast event entry
- **Keyboard Shortcuts**: Use keyboard navigation when available
- **Batch Operations**: Import multiple events at once
- **Templates**: Create templates for recurring events

---

## 🔄 Version History

### Version 2.0 (Current)
- Added Year view
- Hamro Patro theme implementation
- Mobile responsive design
- Enhanced event indicators
- Improved holiday management
- PWA improvements

### Version 1.x
- Basic calendar functionality
- Financial tracking
- Note management
- Initial PWA support

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Compatibility**: BS 2082-2092 | AD 2025-2036

For the most up-to-date information, check the application and documentation regularly.
