/**
 * ========================================
 * NEPALI CALENDAR PWA - COMPLETE APP v2.0 FIXED
 * Developer: Santosh Phuyal
 * Email: hisantoshphuyal@gmail.com
 * Version: 2.0.0 - ERROR FREE
 * ========================================
 */

// Debug: Comprehensive Error Logging
window.debugLog = function(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry, data || '');
    
    // Also log to a global debug array for inspection
    if (!window.debugLogs) window.debugLogs = [];
    window.debugLogs.push({ timestamp, message, data });
};

// Debug: Error tracking
window.debugError = function(error, context = '') {
    const timestamp = new Date().toISOString();
    const errorInfo = {
        timestamp,
        context,
        message: error.message,
        stack: error.stack,
        name: error.name
    };
    console.error(`[ERROR ${timestamp}] ${context}:`, errorInfo);
    
    if (!window.debugErrors) window.debugErrors = [];
    window.debugErrors.push(errorInfo);
};

// Debug: Function availability checker
window.debugCheckFunctions = function() {
    const requiredFunctions = [
        'showIncomeExpenseForm', 'showRecurringForm', 'showShoppingForm', 'showNoteForm',
        'showHolidayForm', 'showBudgetForm', 'showBillForm', 'showGoalForm',
        'showInsuranceForm', 'showVehicleForm', 'showSubscriptionForm', 'showCustomTypeForm',
        'closeModal', 'closeDrawer', 'deleteTransaction', 'deleteRecurring',
        'deleteShoppingItem', 'deleteNote', 'deleteHoliday', 'deleteBill',
        'deleteGoal', 'deleteInsurance', 'deleteVehicle', 'deleteSubscription',
        'deleteCustomType', 'deleteCustomItem', 'toggleShoppingStatus', 'markBillPaid',
        'addToGoal', 'viewInsuranceDetails', 'showServiceHistory', 'addServiceRecord',
        'deleteService', 'addFuelExpense', 'updateMileage', 'renewSubscription',
        'selectCustomType', 'showCustomItemForm',
        'backupData', 'restoreData', 'clearAllData', 'exportCalendarData', 'importCalendarData',
        'exportTrackerData', 'importTrackerData'
    ];
    
    const missingFunctions = [];
    const availableFunctions = [];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            availableFunctions.push(funcName);
        } else {
            missingFunctions.push(funcName);
        }
    });
    
    window.debugLog('Function Availability Check', {
        total: requiredFunctions.length,
        available: availableFunctions.length,
        missing: missingFunctions.length,
        missingFunctions
    });
    
    return { availableFunctions, missingFunctions };
};

// Debug: Database connection checker
window.debugCheckDatabase = async function() {
    try {
        const databases = {
            holidayDB: window.holidayDB,
            incomeDB: window.incomeDB,
            expenseDB: window.expenseDB,
            noteDB: window.noteDB,
            shoppingDB: window.shoppingDB,
            budgetDB: window.budgetDB,
            billDB: window.billDB,
            goalDB: window.goalDB,
            recurringDB: window.recurringDB,
            insuranceDB: window.insuranceDB,
            vehicleDB: window.vehicleDB,
            vehicleServiceDB: window.vehicleServiceDB,
            subscriptionDB: window.subscriptionDB,
            customTypeDB: window.customTypeDB,
            customItemDB: window.customItemDB
        };
        
        const dbStatus = {};
        for (const [name, db] of Object.entries(databases)) {
            try {
                if (db && typeof db.getAll === 'function') {
                    const count = await db.count();
                    dbStatus[name] = { status: 'connected', count };
                } else {
                    dbStatus[name] = { status: 'not initialized' };
                }
            } catch (error) {
                dbStatus[name] = { status: 'error', error: error.message };
            }
        }
        
        window.debugLog('Database Status Check', dbStatus);
        return dbStatus;
    } catch (error) {
        window.debugError(error, 'Database Check');
        return null;
    }
};

// Debug: DOM element checker
window.debugCheckDOM = function() {
    const criticalElements = {
        'modal': document.getElementById('modal'),
        'modalBody': document.getElementById('modalBody'),
        'calendarView': document.getElementById('calendarView'),
        'trackerView': document.getElementById('trackerView'),
        'budgetView': document.getElementById('budgetView'),
        'billsView': document.getElementById('billsView'),
        'goalsView': document.getElementById('goalsView'),
        'insuranceView': document.getElementById('insuranceView'),
        'vehicleView': document.getElementById('vehicleView'),
        'subscriptionView': document.getElementById('subscriptionView'),
        'customView': document.getElementById('customView'),
        'shoppingView': document.getElementById('shoppingView'),
        'notesView': document.getElementById('notesView'),
        'settingsView': document.getElementById('settingsView'),
        'calendarGrid': document.getElementById('calendarGrid'),
        'trackerList': document.getElementById('trackerList'),
        'notesList': document.getElementById('notesList')
    };
    
    const elementStatus = {};
    for (const [name, element] of Object.entries(criticalElements)) {
        elementStatus[name] = {
            exists: !!element,
            tagName: element?.tagName || 'null',
            id: element?.id || 'null'
        };
    }
    
    window.debugLog('DOM Elements Check', elementStatus);
    return elementStatus;
};

// Debug: Comprehensive Feature Verification
window.debugCheckAllFeatures = async function() {
    console.log('🔍 === COMPREHENSIVE FEATURE VERIFICATION ===');
    
    const results = {
        timestamp: new Date().toISOString(),
        checks: {}
    };
    
    // Check 1: Core Functions
    results.checks.coreFunctions = {
        'bsToAd': typeof bsToAd === 'function',
        'adToBs': typeof adToBs === 'function',
        'getCurrentNepaliDate': typeof getCurrentNepaliDate === 'function',
        'formatBsDate': typeof formatBsDate === 'function',
        'getNepaliMonthName': typeof getNepaliMonthName === 'function',
        'getDayOfWeek': typeof getDayOfWeek === 'function'
    };
    
    // Check 2: Database Connections
    try {
        const dbStatus = await window.debugCheckDatabase();
        results.checks.database = dbStatus;
    } catch (error) {
        results.checks.database = { error: error.message };
    }
    
    // Check 3: DOM Elements
    try {
        const domStatus = window.debugCheckDOM();
        results.checks.dom = domStatus;
    } catch (error) {
        results.checks.dom = { error: error.message };
    }
    
    // Check 4: Required Functions
    try {
        const functionStatus = window.debugCheckFunctions();
        results.checks.functions = functionStatus;
    } catch (error) {
        results.checks.functions = { error: error.message };
    }
    
    // Check 5: Import/Export Functions
    const importExportFunctions = [
        'exportCalendarData', 'importCalendarData', 'exportTrackerData', 'importTrackerData',
        'backupData', 'restoreData', 'clearAllData'
    ];
    results.checks.importExport = {};
    importExportFunctions.forEach(funcName => {
        results.checks.importExport[funcName] = typeof window[funcName] === 'function';
    });
    
    // Check 6: Calendar Rendering
    try {
        const calendarGrid = document.getElementById('calendarGrid');
        const calendarView = document.getElementById('calendarView');
        results.checks.calendarRendering = {
            calendarGrid: !!calendarGrid,
            calendarView: !!calendarView,
            calendarGridChildren: calendarGrid ? calendarGrid.children.length : 0,
            calendarViewActive: calendarView ? calendarView.classList.contains('active') : false
        };
    } catch (error) {
        results.checks.calendarRendering = { error: error.message };
    }
    
    // Check 7: Event Listeners
    const criticalElements = ['yearSelect', 'monthSelect', 'prevMonth', 'nextMonth', 'todayBtn'];
    results.checks.eventListeners = {};
    criticalElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        results.checks.eventListeners[elementId] = {
            exists: !!element,
            hasListeners: element && element.onclick !== null
        };
    });
    
    // Check 8: Local Storage
    results.checks.localStorage = {
        theme: !!localStorage.getItem('theme'),
        defaultCurrency: !!localStorage.getItem('defaultCurrency')
    };
    
    // Check 9: Service Worker
    results.checks.serviceWorker = {
        'serviceWorker' : 'serviceWorker' in navigator,
        'serviceWorkerReady' : navigator.serviceWorker && navigator.serviceWorker.state === 'activated'
    };
    
    // Check 10: Chart Library
    results.checks.charts = {
        'Chart': typeof Chart !== 'undefined'
    };
    
    // Summary
    const totalChecks = Object.keys(results.checks).length;
    const passedChecks = Object.values(results.checks).reduce((count, check) => {
        if (typeof check === 'object') {
            if (check.error) return count;
            if (Array.isArray(check)) {
                return count + check.filter(c => c).length;
            }
            return count + (Object.values(check).filter(c => c).length);
        }
        return count + (check ? 1 : 0);
    }, 0);
    
    results.summary = {
        total: totalChecks,
        passed: passedChecks,
        failed: totalChecks - passedChecks,
        successRate: totalChecks > 0 ? (passedChecks / totalChecks * 100).toFixed(1) + '%' : '0%',
        status: passedChecks === totalChecks ? '✅ ALL CHECKS PASSED' : '⚠️ SOME CHECKS FAILED'
    };
    
    console.log('📊 Feature Verification Results:', results);
    console.log('📊 Summary:', results.summary);
    
    // Store results for inspection
    window.lastDebugCheck = results;
    
    return results;
};

// Debug: Quick Health Check
window.debugHealthCheck = function() {
    console.log('🏥 === QUICK HEALTH CHECK ===');
    
    const health = {
        timestamp: new Date().toISOString(),
        app: {
            initialized: !!window.currentBsYear,
            currentView: window.currentView,
            calendarView: window.currentCalendarView
        },
        database: {
            connected: !!window.holidayDB,
            databases: ['holidayDB', 'incomeDB', 'expenseDB', 'noteDB', 'shoppingDB', 'budgetDB', 'billDB', 'goalDB', 'recurringDB', 'insuranceDB', 'vehicleDB', 'vehicleServiceDB', 'subscriptionDB', 'customTypeDB', 'customItemDB']
        },
        ui: {
            modal: !!document.getElementById('modal'),
            calendarGrid: !!document.getElementById('calendarGrid'),
            trackerList: !!document.getElementById('trackerList'),
            notesList: !!document.getElementById('notesList')
        },
        features: {
            calendar: !!window.renderCalendar,
            tracker: !!window.renderTrackerList,
            notes: !!window.renderNotes,
            importExport: !!window.exportCalendarData && !!window.importCalendarData
        }
    };
    
    console.log('🏥 Health Status:', health);
    
    const issues = [];
    
    if (!health.app.initialized) issues.push('App not initialized');
    if (!health.database.connected) issues.push('Database not connected');
    if (!health.ui.modal) issues.push('Modal not found');
    if (!health.features.calendar) issues.push('Calendar functions missing');
    if (!health.features.importExport) issues.push('Import/Export functions missing');
    
    if (issues.length === 0) {
        console.log('✅ All core systems operational');
    } else {
        console.warn('⚠️ Issues found:', issues);
    }
    
    return health;
};

// Debug: Test Import/Export Functions
window.debugTestImportExport = async function() {
    console.log('🔄 === TESTING IMPORT/EXPORT FUNCTIONS ===');
    
    const testResults = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    // Test Calendar Export
    try {
        console.log('📅 Testing calendar export...');
        await window.exportCalendarData('monthly');
        testResults.tests.calendarExportMonthly = '✅ Success';
    } catch (error) {
        testResults.tests.calendarExportMonthly = `❌ Error: ${error.message}`;
    }
    
    // Test Tracker Export
    try {
        console.log('💰 Testing tracker export...');
        await window.exportTrackerData('income');
        testResults.tests.trackerExportIncome = '✅ Success';
    } catch (error) {
        testResults.tests.trackerExportIncome = `❌ Error: ${error.message}`;
    }
    
    // Test Backup
    try {
        console.log('💾 Testing backup...');
        await window.backupData();
        testResults.tests.backup = '✅ Success';
    } catch (error) {
        testResults.tests.backup = `❌ Error: ${error.message}`;
    }
    
    console.log('📊 Import/Export Test Results:', testResults);
    return testResults;
};

// Debug: Test Core Functions
window.debugTestCoreFunctions = function() {
    console.log('🔧 === TESTING CORE FUNCTIONS ===');
    
    const coreTests = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    // Test Date Conversion
    try {
        const bsDate = bsToAd(2082, 10, 14);
        const adDate = adToBs(2025, 4, 14);
        coreTests.tests.dateConversion = '✅ Success';
        console.log('📅 Date Conversion Test:', bsDate, adDate);
    } catch (error) {
        coreTests.tests.dateConversion = `❌ Error: ${error.message}`;
    }
    
    // Test Date Formatting
    try {
        const formatted = formatBsDate(2082, 10, 14);
        coreTests.tests.dateFormatting = '✅ Success';
        console.log('📅 Date Formatting Test:', formatted);
    } catch (error) {
        coreTests.tests.dateFormatting = `❌ Error: ${error.message}`;
    }
    
    // Test Current Date
    try {
        const current = getCurrentNepaliDate();
        coreTests.tests.currentDate = '✅ Success';
        console.log('📅 Current Date Test:', current);
    } catch (error) {
        coreTests.tests.currentDate = `❌ Error: ${error.message}`;
    }
    
    console.log('📊 Core Function Test Results:', coreTests);
    return coreTests;
};

// Debug: Test Database Operations
window.debugTestDatabase = async function() {
    console.log('💾 === TESTING DATABASE OPERATIONS ===');
    
    const dbTests = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    const databases = ['holidayDB', 'incomeDB', 'expenseDB', 'noteDB', 'shoppingDB', 'budgetDB', 'billDB', 'goalDB', 'recurringDB', 'insuranceDB', 'vehicleDB', 'vehicleServiceDB', 'subscriptionDB', 'customTypeDB', 'customItemDB'];
    
    for (const dbName of databases) {
        try {
            const db = window[dbName];
            if (db && typeof db.count === 'function') {
                const count = await db.count();
                dbTests.tests[dbName] = `✅ Success (${count} records)`;
            } else {
                dbTests.tests[dbName] = `❌ Not available`;
            }
        } catch (error) {
            dbTests.tests[dbName] = `❌ Error: ${error.message}`;
        }
    }
    
    console.log('📊 Database Test Results:', dbTests);
    return dbTests;
};

// Debug: Test UI Rendering
window.debugTestUI = async function() {
    console.log('🎨 === TESTING UI RENDERING ===');
    
    const uiTests = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    // Test Calendar Rendering
    try {
        await renderCalendar();
        uiTests.tests.calendar = '✅ Success';
        console.log('📅 Calendar rendering test passed');
    } catch (error) {
        uiTests.tests.calendar = `❌ Error: ${error.message}`;
    }
    
    // Test Notes Rendering
    try {
        await renderNotes();
        uiTests.tests.notes = '✅ Success';
        console.log('📝 Notes rendering test passed');
    } catch (error) {
        uiTests.tests.notes = `❌ Error: ${error.message}`;
    }
    
    // Test Tracker Rendering
    try {
        await renderTrackerList();
        uiTests.tests.tracker = '✅ Success';
        console.log('💰 Tracker rendering test passed');
    } catch (error) {
        uiTests.tests.tracker = `❌ Error: ${error.message}`;
    }
    
    console.log('📊 UI Test Results:', uiTests);
    return uiTests;
};

// Debug: Test Event Listeners
window.debugTestEventListeners = function() {
    console.log('🎯 === TESTING EVENT LISTENERS ===');
    
    const eventTests = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    const criticalEvents = [
        'yearSelect', 'monthSelect', 'prevMonth', 'nextMonth', 'todayBtn',
        'addIncomeBtn', 'addExpenseBtn', 'addRecurringBtn', 'addBudgetBtn',
        'addBillBtn', 'addGoalBtn', 'addInsuranceBtn', 'addVehicleBtn', 'addSubscriptionBtn',
        'addShoppingBtn', 'addNoteBtn', 'darkModeToggle', 'addHolidayBtn', 'importHolidayBtn',
        'clearDataBtn', 'backupDataBtn', 'restoreDataBtn'
    ];
    
    criticalEvents.forEach(eventName => {
        try {
            const element = document.getElementById(eventName);
            eventTests.tests[eventName] = {
                exists: !!element,
                hasClick: element && typeof element.onclick === 'function',
                hasChange: element && typeof element.onchange === 'function',
                tagName: element?.tagName || 'null'
            };
        } catch (error) {
            eventTests.tests[eventName] = `❌ Error: ${error.message}`;
        }
    });
    
    console.log('📊 Event Listener Test Results:', eventTests);
    return eventTests;
};

// Debug: Run All Tests
window.debugRunAllTests = async function() {
    console.log('🚀 === RUNNING ALL DEBUG TESTS ===');
    
    const allResults = {
        timestamp: new Date().toISOString(),
        coreFunctions: window.debugTestCoreFunctions(),
        database: await window.debugTestDatabase(),
        ui: await window.debugTestUI(),
        eventListeners: window.debugTestEventListeners(),
        importExport: await window.debugTestImportExport()
    };
    
    const totalTests = Object.keys(allResults).length;
    const passedTests = Object.values(allResults).reduce((count, result) => {
        if (typeof result === 'object') {
            if (result.tests) {
                return count + Object.values(result.tests).filter(t => t.includes('✅')).length;
            }
        }
        return count + (result.includes('✅') ? 1 : 0);
    }, 0);
    
    const failedTests = totalTests - passedTests;
    
    console.log('📊 === ALL TESTS COMPLETE ===');
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) + '%' : '0%'}`);
    
    if (failedTests > 0) {
        console.log('⚠️ Failed Tests:', Object.entries(allResults).filter(([key, result]) => {
            if (typeof result === 'object' && result.tests) {
                return Object.entries(result.tests).filter(([key, test]) => test.includes('❌'));
            }
        }));
    }
    
    return allResults;
};

// Add debug commands to console
console.log('🔧 Debug Commands Available:');
console.log('  debugCheckAllFeatures() - Comprehensive feature verification');
console.log('  debugHealthCheck() - Quick health check');
console.log('  debugTestImportExport() - Test import/export functions');
console.log('  debugTestCoreFunctions() - Test core date functions');
console.log('  debugTestDatabase() - Test database connections');
console.log('  debugTestUI() - Test UI rendering');
console.log('  debugTestEventListeners() - Test event listeners');
console.log('  debugRunAllTests() - Run all tests');

console.log('✅ app.js loading...');

// Global state
let currentBsYear, currentBsMonth, currentBsDay;
let currentView = 'calendar';
let currentCalendarView = 'month';
let selectedDate = null;
let defaultCurrency = 'NPR';

/**
 * ========================================
 * SHOW NOTE FORM
 * ========================================
 */
function showNoteForm(note = null) {
    const today = getCurrentNepaliDate();
    const todayBs = formatBsDate(today.year, today.month, today.day);
    
    const form = `
        <h2>${note ? '✏️ Edit Note' : '📝 Add Note'}</h2>
        <form id="noteForm" class="modal-form enhanced-form">
            <div class="form-row">
                <div class="form-group">
                    <label>📅 Date (BS)</label>
                    <input type="text" id="noteDateBs" value="${note?.date_bs || todayBs}" 
                           placeholder="YYYY/MM/DD" required>
                </div>
                
                <div class="form-group">
                    <label>⏰ Reminder Time</label>
                    <input type="time" id="noteReminderTime" value="${note?.reminderTime || '09:00'}">
                </div>
            </div>
            
            <div class="form-group">
                <label>📝 Note Title</label>
                <input type="text" id="noteTitle" value="${note?.title || ''}" 
                       placeholder="Enter note title" required>
            </div>
            
            <div class="form-group">
                <label>📄 Description</label>
                <textarea id="noteDescription" rows="4" 
                          placeholder="Enter note details">${note?.description || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>🎯 Event Type</label>
                <select id="noteEventType">
                    <option value="note" ${note?.eventType === 'note' ? 'selected' : ''}>📝 Simple Note</option>
                    <option value="birthday" ${note?.eventType === 'birthday' ? 'selected' : ''}>🎂 Birthday</option>
                    <option value="anniversary" ${note?.eventType === 'anniversary' ? 'selected' : ''}>💑 Anniversary</option>
                    <option value="meeting" ${note?.eventType === 'meeting' ? 'selected' : ''}>🤝 Meeting</option>
                    <option value="appointment" ${note?.eventType === 'appointment' ? 'selected' : ''}>🏥 Appointment</option>
                    <option value="deadline" ${note?.eventType === 'deadline' ? 'selected' : ''}>⏰ Deadline</option>
                    <option value="celebration" ${note?.eventType === 'celebration' ? 'selected' : ''}>🎉 Celebration</option>
                    <option value="travel" ${note?.eventType === 'travel' ? 'selected' : ''}>✈️ Travel</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>🏷️ Category</label>
                <select id="noteCategory">
                    <option value="personal" ${note?.category === 'personal' ? 'selected' : ''}>👤 Personal</option>
                    <option value="work" ${note?.category === 'work' ? 'selected' : ''}>💼 Work</option>
                    <option value="finance" ${note?.category === 'finance' ? 'selected' : ''}>💰 Finance</option>
                    <option value="health" ${note?.category === 'health' ? 'selected' : ''}>🏥 Health</option>
                    <option value="family" ${note?.category === 'family' ? 'selected' : ''}>👨‍👩‍👧‍👦 Family</option>
                    <option value="education" ${note?.category === 'education' ? 'selected' : ''}>📚 Education</option>
                    <option value="social" ${note?.category === 'social' ? 'selected' : ''}>🎉 Social</option>
                    <option value="other" ${note?.category === 'other' ? 'selected' : ''}>📌 Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>🔔 Reminder Settings</label>
                <div class="reminder-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="noteIsReminder" ${note?.isReminder ? 'checked' : ''}>
                        <span>Enable Reminder</span>
                    </label>
                    <div class="reminder-advance">
                        <label>Remind me before:</label>
                        <select id="noteReminderAdvance">
                            <option value="0" ${note?.reminderAdvance === 0 ? 'selected' : ''}>On time</option>
                            <option value="15" ${note?.reminderAdvance === 15 ? 'selected' : ''}>15 minutes</option>
                            <option value="30" ${note?.reminderAdvance === 30 ? 'selected' : ''}>30 minutes</option>
                            <option value="60" ${note?.reminderAdvance === 60 ? 'selected' : ''}>1 hour</option>
                            <option value="1440" ${note?.reminderAdvance === 1440 ? 'selected' : ''}>1 day</option>
                            <option value="2880" ${note?.reminderAdvance === 2880 ? 'selected' : ''}>2 days</option>
                            <option value="10080" ${note?.reminderAdvance === 10080 ? 'selected' : ''}>1 week</option>
                        </select>
                    </div>
                    <label class="checkbox-label">
                        <input type="checkbox" id="noteRepeatYearly" ${note?.repeatYearly ? 'checked' : ''}>
                        <span>Repeat yearly (for birthdays/anniversaries)</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label>🎨 Priority</label>
                <div class="priority-options">
                    <label class="radio-label">
                        <input type="radio" name="priority" value="low" ${!note?.priority || note?.priority === 'low' ? 'checked' : ''}>
                        <span class="priority-low">🟢 Low</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="priority" value="medium" ${note?.priority === 'medium' ? 'checked' : ''}>
                        <span class="priority-medium">🟡 Medium</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="priority" value="high" ${note?.priority === 'high' ? 'checked' : ''}>
                        <span class="priority-high">🔴 High</span>
                    </label>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary">💾 Save Note</button>
                ${note?.id ? `<button type="button" class="btn-danger" onclick="deleteNote(${note.id})">🗑️ Delete</button>` : ''}
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    showModal(form);
    
    // Initialize Nepali date picker for date field
    setTimeout(() => {
        const dateInput = document.getElementById('noteDateBs');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);
    
    document.getElementById('noteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const noteData = {
            date_bs: document.getElementById('noteDateBs').value,
            title: document.getElementById('noteTitle').value,
            description: document.getElementById('noteDescription').value,
            eventType: document.getElementById('noteEventType').value,
            category: document.getElementById('noteCategory').value,
            isReminder: document.getElementById('noteIsReminder').checked,
            reminderTime: document.getElementById('noteReminderTime').value,
            reminderAdvance: parseInt(document.getElementById('noteReminderAdvance').value),
            repeatYearly: document.getElementById('noteRepeatYearly').checked,
            priority: document.querySelector('input[name="priority"]:checked').value,
            createdAt: new Date().toISOString()
        };
        
        try {
            if (note?.id) {
                noteData.id = note.id;
                await enhancedNoteDB.update(noteData);
                showNotification('✅ Note updated successfully!', 'success');
            } else {
                await enhancedNoteDB.add(noteData);
                showNotification('✅ Note added successfully!', 'success');
            }
            
            // Schedule browser notification if reminder is set
            if (noteData.isReminder) {
                scheduleNotification(noteData);
            }
            
            closeModal();
            renderNotes(); // ✅ CORRECT function name
            renderCalendar(); // ✅ NO PARAMETERS
        } catch (error) {
            console.error('Error saving note:', error);
            showNotification('❌ Failed to save note', 'error');
        }
    });
}

/**
 * ========================================
 * BROWSER NOTIFICATION SUPPORT
 * ========================================
 */
function scheduleNotification(note) {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    if (!note.isReminder) return;
    
    // Convert BS date to AD for notification scheduling
    const [year, month, day] = note.date_bs.split('/').map(Number);
    const adDate = bsToAd(year, month, day);
    
    // Parse reminder time
    const [hours, minutes] = note.reminderTime.split(':').map(Number);
    
    // Create notification date
    const notificationDate = new Date(adDate.year, adDate.month - 1, adDate.day, hours, minutes);
    
    // Subtract advance time
    notificationDate.setMinutes(notificationDate.getMinutes() - note.reminderAdvance);
    
    const now = new Date();
    const timeUntilNotification = notificationDate.getTime() - now.getTime();
    
    if (timeUntilNotification > 0) {
        setTimeout(() => {
            showBrowserNotification(note);
            
            // Schedule yearly reminder if repeat is enabled
            if (note.repeatYearly) {
                const nextYear = new Date(notificationDate);
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                setTimeout(() => showBrowserNotification(note), nextYear.getTime() - now.getTime());
            }
        }, timeUntilNotification);
    }
}

function showBrowserNotification(note) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const eventIcons = {
            birthday: '🎂',
            anniversary: '💑',
            meeting: '🤝',
            appointment: '🏥',
            deadline: '⏰',
            celebration: '🎉',
            travel: '✈️',
            note: '📝'
        };
        
        const icon = eventIcons[note.eventType] || '📝';
        
        const priorityColors = {
            high: '#E74C3C',
            medium: '#F39C12',
            low: '#2ECC71'
        };
        
        const notification = new Notification(`${icon} ${note.title}`, {
            body: `${note.description || note.title}\n📅 ${note.date_bs}`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="80">📅</text></svg>',
            tag: note.id || `note-${note.date_bs}-${note.title}`,
            requireInteraction: note.priority === 'high'
        });
        
        notification.onclick = () => {
            window.focus();
            // Switch to calendar view and navigate to the note date
            switchView('calendar');
            const [year, month] = note.date_bs.split('/').map(Number);
            currentBsYear = year;
            currentBsMonth = month;
            updateCalendarHeader();
            renderCalendar();
            notification.close();
        };
        
        // Auto-close after 5 seconds for non-high priority
        if (note.priority !== 'high') {
            setTimeout(() => notification.close(), 5000);
        }
    }
}

/**
 * ========================================
 * MONTHLY NOTES DISPLAY
 * ========================================
 */
async function displayMonthlyNotes() {
    try {
        const notesContent = document.getElementById('monthlyNotesContent');
        if (!notesContent) return;

        // Get all notes
        const allNotes = await enhancedNoteDB.getAll();
        
        // Filter notes for current month
        const currentMonthNotes = allNotes.filter(note => {
            const [year, month] = note.date_bs.split('/').map(Number);
            return year === currentBsYear && month === currentBsMonth;
        });

        if (currentMonthNotes.length === 0) {
            notesContent.innerHTML = '<div class="no-notes">No notes this month</div>';
            return;
        }

        // Sort notes by date and priority
        currentMonthNotes.sort((a, b) => {
            const dateCompare = a.date_bs.localeCompare(b.date_bs);
            if (dateCompare !== 0) return dateCompare;
            
            // Sort by priority (high > medium > low)
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        // Display notes with event type icons
        notesContent.innerHTML = currentMonthNotes.map(note => {
            const eventIcons = {
                birthday: '🎂',
                anniversary: '💑',
                meeting: '🤝',
                appointment: '🏥',
                deadline: '⏰',
                celebration: '🎉',
                travel: '✈️',
                note: '📝'
            };
            
            const priorityColors = {
                high: '#E74C3C',
                medium: '#F39C12',
                low: '#2ECC71'
            };
            
            const icon = eventIcons[note.eventType] || '📝';
            const priorityColor = priorityColors[note.priority] || '#2ECC71';
            
            return `
                <div class="monthly-note-item priority-${note.priority}" onclick="editNote(${note.id})">
                    <div class="note-header">
                        <span class="note-icon">${icon}</span>
                        <span class="note-date">${note.date_bs}</span>
                        <span class="note-priority" style="color: ${priorityColor};">●</span>
                        ${note.isReminder ? '<span class="reminder-badge">🔔</span>' : ''}
                    </div>
                    <div class="note-title">${note.title}</div>
                    ${note.description ? `<div class="note-description">${note.description}</div>` : ''}
                    <div class="note-meta">
                        <span class="note-category">${note.category}</span>
                        ${note.repeatYearly ? '<span class="repeat-badge">🔄 Yearly</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error displaying monthly notes:', error);
    }
}

/**
 * ========================================
 * ENHANCED CRUD FUNCTIONS FOR NOTES
 * ========================================
 */
async function editNote(id) {
    try {
        const note = await enhancedNoteDB.get(id);
        if (note) {
            showNoteForm(note);
        }
    } catch (error) {
        console.error('Error editing note:', error);
        showNotification('❌ Failed to edit note', 'error');
    }
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        await enhancedNoteDB.delete(id);
        showNotification('✅ Note deleted successfully!', 'success');
        closeModal();
        renderNotes();
        renderCalendar();
    } catch (error) {
        console.error('Error deleting note:', error);
        showNotification('❌ Failed to delete note', 'error');
    }
}

/**
 * ========================================
 * SHOW HOLIDAY FORM
 * ========================================
 */
function showHolidayForm(holiday = null) {
    const today = getCurrentNepaliDate();
    const todayBs = formatBsDate(today.year, today.month, today.day);
    
    const form = `
        <h2>${holiday ? '✏️ Edit Holiday' : '🎉 Add Holiday'}</h2>
        <form id="holidayForm" class="modal-form">
            <div class="form-group">
                <label>📅 Date (BS)</label>
                <input type="text" id="holidayDateBs" value="${holiday?.date_bs || todayBs}" 
                       placeholder="YYYY/MM/DD" required>
            </div>
            
            <div class="form-group">
                <label>📅 Date (AD) - Optional</label>
                <input type="date" id="holidayDateAd" value="${holiday?.date_ad || ''}">
            </div>
            
            <div class="form-group">
                <label>🎉 Holiday Name</label>
                <input type="text" id="holidayName" value="${holiday?.name || ''}" 
                       placeholder="e.g., Dashain, Tihar" required>
            </div>
            
            <div class="form-group">
                <label>🏷️ Type</label>
                <select id="holidayType">
                    <option value="public" ${holiday?.type === 'public' ? 'selected' : ''}>Public Holiday</option>
                    <option value="festival" ${holiday?.type === 'festival' ? 'selected' : ''}>Festival</option>
                    <option value="cultural" ${holiday?.type === 'cultural' ? 'selected' : ''}>Cultural</option>
                    <option value="personal" ${holiday?.type === 'personal' ? 'selected' : ''}>Personal</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>📝 Description - Optional</label>
                <textarea id="holidayDescription" rows="3" 
                          placeholder="Enter details">${holiday?.description || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary">💾 Save Holiday</button>
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    showModal(form);
    
    // Initialize Nepali date picker for holiday BS date
    setTimeout(() => {
        const dateInput = document.getElementById('holidayDateBs');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);
    
    document.getElementById('holidayForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const holidayData = {
            date_bs: document.getElementById('holidayDateBs').value,
            date_ad: document.getElementById('holidayDateAd').value || '',
            name: document.getElementById('holidayName').value,
            type: document.getElementById('holidayType').value,
            description: document.getElementById('holidayDescription').value
        };
        
        try {
            if (holiday?.id) {
                holidayData.id = holiday.id;
                await enhancedHolidayDB.update(holidayData);
                showNotification('✅ Holiday updated successfully!', 'success');
            } else {
                await enhancedHolidayDB.add(holidayData);
                showNotification('✅ Holiday added successfully!', 'success');
            }
            
            closeModal();
            renderHolidayList();
            renderCalendar(); // ✅ NO PARAMETERS
        } catch (error) {
            console.error('Error saving holiday:', error);
            showNotification('❌ Failed to save holiday', 'error');
        }
    });
}
/**
 * ========================================
 * SHOW RECURRING TRANSACTION FORM
 * ========================================
 */
function showRecurringForm(recurring = null) {
    const form = `
        <h2>${recurring ? '✏️ Edit Recurring Transaction' : '🔄 Add Recurring Transaction'}</h2>
        <form id="recurringForm" class="modal-form">
            <div class="form-group">
                <label>💸 Type</label>
                <select id="recurringType" required>
                    <option value="income" ${recurring?.type === 'income' ? 'selected' : ''}>Income</option>
                    <option value="expense" ${recurring?.type === 'expense' ? 'selected' : ''}>Expense</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>📝 Description</label>
                <input type="text" id="recurringDescription" value="${recurring?.description || ''}" 
                       placeholder="e.g., Monthly Salary, Rent" required>
            </div>
            
            <div class="form-group">
                <label>💰 Amount</label>
                <input type="number" id="recurringAmount" value="${recurring?.amount || ''}" 
                       placeholder="0.00" step="0.01" required>
            </div>
            
            <div class="form-group">
                <label>💱 Currency</label>
                <select id="recurringCurrency">
                    <option value="NPR" ${recurring?.currency === 'NPR' ? 'selected' : ''}>NPR (रू)</option>
                    <option value="USD" ${recurring?.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                    <option value="EUR" ${recurring?.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                    <option value="INR" ${recurring?.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>🏷️ Category</label>
                <select id="recurringCategory">
                    <optgroup label="Income">
                        <option value="salary" ${recurring?.category === 'salary' ? 'selected' : ''}>Salary</option>
                        <option value="freelance" ${recurring?.category === 'freelance' ? 'selected' : ''}>Freelance</option>
                        <option value="investment" ${recurring?.category === 'investment' ? 'selected' : ''}>Investment</option>
                    </optgroup>
                    <optgroup label="Expense">
                        <option value="rent" ${recurring?.category === 'rent' ? 'selected' : ''}>Rent</option>
                        <option value="utilities" ${recurring?.category === 'utilities' ? 'selected' : ''}>Utilities</option>
                        <option value="food" ${recurring?.category === 'food' ? 'selected' : ''}>Food</option>
                        <option value="transport" ${recurring?.category === 'transport' ? 'selected' : ''}>Transport</option>
                        <option value="subscription" ${recurring?.category === 'subscription' ? 'selected' : ''}>Subscription</option>
                        <option value="other" ${recurring?.category === 'other' ? 'selected' : ''}>Other</option>
                    </optgroup>
                </select>
            </div>
            
            <div class="form-group">
                <label>🔄 Frequency</label>
                <select id="recurringFrequency" required>
                    <option value="daily" ${recurring?.frequency === 'daily' ? 'selected' : ''}>Daily</option>
                    <option value="weekly" ${recurring?.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                    <option value="monthly" ${recurring?.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                    <option value="yearly" ${recurring?.frequency === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>📅 Start Date (BS)</label>
                <input type="text" id="recurringStartDate" value="${recurring?.startDate || ''}" 
                       placeholder="YYYY/MM/DD" required>
            </div>
            
            <div class="form-group">
                <label>📅 End Date (BS) - Optional</label>
                <input type="text" id="recurringEndDate" value="${recurring?.endDate || ''}" 
                       placeholder="YYYY/MM/DD">
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="recurringIsActive" ${recurring?.isActive !== false ? 'checked' : ''}>
                    ✅ Active
                </label>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary">💾 Save Recurring</button>
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    showModal(form);
    
    // Initialize Nepali date pickers for recurring dates
    setTimeout(() => {
        const startDateInput = document.getElementById('recurringStartDate');
        const endDateInput = document.getElementById('recurringEndDate');
        
        if (startDateInput && !startDateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(startDateInput);
        }
        
        if (endDateInput && !endDateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(endDateInput);
        }
    }, 100);
    
    document.getElementById('recurringForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const recurringData = {
            type: document.getElementById('recurringType').value,
            description: document.getElementById('recurringDescription').value,
            amount: parseFloat(document.getElementById('recurringAmount').value),
            currency: document.getElementById('recurringCurrency').value,
            category: document.getElementById('recurringCategory').value,
            frequency: document.getElementById('recurringFrequency').value,
            startDate: document.getElementById('recurringStartDate').value,
            endDate: document.getElementById('recurringEndDate').value || null,
            isActive: document.getElementById('recurringIsActive').checked,
            createdAt: new Date().toISOString()
        };
        
        try {
            if (recurring?.id) {
                recurringData.id = recurring.id;
                await enhancedRecurringDB.update(recurringData);
                showNotification('✅ Recurring transaction updated!', 'success');
            } else {
                await enhancedRecurringDB.add(recurringData);
                showNotification('✅ Recurring transaction added!', 'success');
            }
            
            closeModal();
            renderRecurringList();
            renderTrackerList();
        } catch (error) {
            console.error('Error saving recurring transaction:', error);
            showNotification('❌ Failed to save recurring transaction', 'error');
        }
    });
}
/**
 * Render Notes List
 */
async function renderNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    const notes = await enhancedNoteDB.getAll();
    
    if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-state">📝 No notes yet. Add your first note!</div>';
        return;
    }
    
    notesList.innerHTML = notes.sort((a, b) => b.date_bs.localeCompare(a.date_bs)).map(note => {
        // Get event type icon
        const eventIcons = {
            birthday: '🎂',
            anniversary: '💑',
            meeting: '🤝',
            appointment: '🏥',
            deadline: '⏰',
            celebration: '🎉',
            travel: '✈️',
            note: '📝'
        };
        
        const icon = eventIcons[note.eventType] || '📝';
        const reminderIcon = note.isReminder ? '🔔' : '';
        
        // Get priority color
        const priorityColors = {
            high: '#E74C3C',
            medium: '#F39C12',
            low: '#2ECC71'
        };
        
        const priorityColor = priorityColors[note.priority] || '#2ECC71';
        
        return `
            <div class="note-item ${note.isReminder ? 'reminder' : ''} priority-${note.priority}">
                <div class="note-header">
                    <h4>${icon} ${reminderIcon} ${note.title || 'Untitled Note'}</h4>
                    <span class="note-date">${note.date_bs}</span>
                    <span class="note-priority" style="color: ${priorityColor};">●</span>
                </div>
                <p class="note-description">${note.description || ''}</p>
                <div class="note-meta">
                    <span class="category-badge">${note.category || 'other'}</span>
                    ${note.repeatYearly ? '<span class="repeat-badge">🔄 Yearly</span>' : ''}
                    ${note.reminderTime ? `<span class="time-badge">⏰ ${note.reminderTime}</span>` : ''}
                </div>
                <div class="note-actions">
                    <button class="btn-icon" onclick="showNoteForm(${JSON.stringify(note).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="btn-icon" onclick="deleteNote(${note.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Holiday List
 */
async function renderHolidayList() {
    const holidayList = document.getElementById('holidayList');
    if (!holidayList) return;
    
    const holidays = await enhancedHolidayDB.getAll();
    
    if (holidays.length === 0) {
        holidayList.innerHTML = '<div class="empty-state">🎉 No holidays added yet.</div>';
        return;
    }
    
    holidayList.innerHTML = holidays.sort((a, b) => a.date_bs.localeCompare(b.date_bs)).map(holiday => `
        <div class="holiday-item ${holiday.type}">
            <div class="holiday-info">
                <strong>${holiday.name}</strong>
                <div class="holiday-dates">
                    <span>BS: ${holiday.date_bs}</span>
                    ${holiday.date_ad ? `<span>AD: ${holiday.date_ad}</span>` : ''}
                </div>
                <span class="holiday-type">${holiday.type}</span>
            </div>
            <div class="holiday-actions">
                <button class="btn-icon" onclick="showHolidayForm(${JSON.stringify(holiday).replace(/"/g, '&quot;')})">✏️</button>
                <button class="btn-icon" onclick="deleteHoliday(${holiday.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

/**
 * Render Recurring List
 */
async function renderRecurringList() {
    const recurringList = document.getElementById('recurringList');
    if (!recurringList) return;
    
    const recurring = await enhancedRecurringDB.getAll();
    const active = recurring.filter(r => r.isActive);
    
    if (active.length === 0) {
        recurringList.innerHTML = '<div class="empty-state">🔄 No recurring transactions.</div>';
        return;
    }
    
    recurringList.innerHTML = active.map(r => `
        <div class="recurring-item ${r.type}">
            <div class="recurring-info">
                <strong>${r.description}</strong>
                <div class="recurring-details">
                    <span>${r.currency} ${r.amount.toFixed(2)}</span>
                    <span>${r.frequency}</span>
                    <span>${r.category}</span>
                </div>
            </div>
            <div class="recurring-actions">
                <button class="btn-icon" onclick="showRecurringForm(${JSON.stringify(r).replace(/"/g, '&quot;')})">✏️</button>
                <button class="btn-icon" onclick="deleteRecurring(${r.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

/**
 * Edit Note Function
 */
async function editNote(id) {
    try {
        const note = await enhancedNoteDB.get(id);
        if (note) {
            showNoteForm(note);
        }
    } catch (error) {
        console.error('Error editing note:', error);
        showNotification('❌ Failed to edit note', 'error');
    }
}

/**
 * Delete Functions
 */
async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    await enhancedNoteDB.delete(id);
    showNotification('✅ Note deleted', 'success');
    renderNotes();
    renderCalendar(currentYear, currentMonth);
}

async function deleteHoliday(id) {
    if (!confirm('Delete this holiday?')) return;
    await enhancedHolidayDB.delete(id);
    showNotification('✅ Holiday deleted', 'success');
    renderHolidayList();
    renderCalendar(currentYear, currentMonth);
}

async function deleteRecurring(id) {
    if (!confirm('Delete this recurring transaction?')) return;
    await enhancedRecurringDB.delete(id);
    showNotification('✅ Recurring transaction deleted', 'success');
    renderRecurringList();
}


/**
 * ========================================
 * NOTIFICATION SYSTEM
 * ========================================
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style it
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * ========================================
 * APP INITIALIZATION
 * ========================================
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.debugLog('=== APP INITIALIZATION START ===');
        
        // Debug: Check DOM elements first
        window.debugLog('Checking DOM elements...');
        const domStatus = window.debugCheckDOM();
        
        // Debug: Check script loading
        window.debugLog('Checking script dependencies...');
        const scripts = {
            'conversion.js': typeof bsToAd !== 'undefined',
            'db.js': typeof initDB !== 'undefined',
            'charts.js': typeof Chart !== 'undefined',
            'import-export.js': typeof ImportExportManager !== 'undefined'
        };
        window.debugLog('Script Dependencies Check', scripts);
        
        // Debug: Initialize database with error tracking
        window.debugLog('Initializing database...');
        try {
            await initDB();
            window.debugLog('Database initialized successfully');
        } catch (dbError) {
            window.debugError(dbError, 'Database Initialization');
            return;
        }
        
        // Debug: Check database connections
        window.debugLog('Checking database connections...');
        const dbStatus = await window.debugCheckDatabase();
        
        // Debug: Initialize app variables
        window.debugLog('Initializing app variables...');
        const today = getCurrentNepaliDate();
        currentBsYear = today.year;
        currentBsMonth = today.month;
        currentBsDay = today.day;

        console.log(`📅 Current BS Date: ${currentBsYear}/${currentBsMonth}/${currentBsDay}`);

        initializeHeader();
        initializeYearMonthSelectors();
        initializeEventListeners();
        
        currentCalendarView = 'month';
        
        document.querySelectorAll('.view-switch-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.calendarView === 'month');
        });
        document.querySelectorAll('.calendar-view-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById('monthView').classList.add('active');
        
        window.debugLog('Rendering calendar...');
        renderCalendar();
        window.debugLog('Calendar rendered successfully');
        
        // Debug: Async operations monitoring
        window.debugLog('Starting async operations...');
        updateMonthlySummary().then(() => {
            window.debugLog('Monthly summary updated successfully');
        }).catch(error => {
            window.debugError(error, 'Monthly Summary Update');
        });
        
        updateAllCharts(currentBsYear, currentBsMonth).then(() => {
            window.debugLog('Charts updated successfully');
        }).catch(error => {
            window.debugError(error, 'Charts Update');
        });

        // Debug: Theme initialization
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = true;
            }
            window.debugLog('Dark theme applied');
        }

        // Debug: Recurring transactions
        await processRecurringTransactions();
        window.debugLog('Recurring transactions processed');

        // Debug: Alerts system
        setTimeout(async () => {
            const alerts = await checkUpcomingAlerts();
            if (alerts.length > 0) {
                window.debugLog('Upcoming alerts found', alerts);
            }
        }, 2000);

        // Debug: Final function availability check
        window.debugLog('Performing final function availability check...');
        const functionStatus = window.debugCheckFunctions();
        
        if (functionStatus.missingFunctions.length > 0) {
            console.warn('⚠️ Missing functions (non-fatal):', functionStatus.missingFunctions);
            window.debugLog('Function Check Warning', functionStatus);
        } else {
            window.debugLog('All required functions are available');
        }
        
        window.debugLog('=== APP INITIALIZATION COMPLETE ===');
        console.log('✅ App initialized successfully!');
        
        // Initialize Nepali date pickers for all date inputs
        initNepaliDatePickers();
        
        // Update SMS process button state
        updateSMSProcessButton();

    } catch (error) {
        window.debugError(error, 'App Initialization');
        console.error('❌ App initialization error:', error);
        console.error('Error details:', error.stack);
        alert('Error initializing app: ' + error.message + '\n\nPlease make sure you are running this on a local server (http://localhost), not by opening the file directly.');
    }
});

/**
 * ========================================
 * HEADER INITIALIZATION
 * ========================================
 */
function initializeHeader() {
    const today = getCurrentNepaliDate();
    const adToday = new Date();
    
    document.getElementById('headerBSDate').textContent = 
        `BS: ${formatBsDate(today.year, today.month, today.day)} (${getNepaliMonthName(today.month)})`;
    
    document.getElementById('headerADDate').textContent = 
        `AD: ${adToday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
}

function initializeYearMonthSelectors() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');

    if (!yearSelect || !monthSelect) return;

    yearSelect.innerHTML = '';
    monthSelect.innerHTML = '';

    for (let year = 2082; year <= 2092; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentBsYear) option.selected = true;
        yearSelect.appendChild(option);
    }

    NEPALI_MONTHS.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        if (index + 1 === currentBsMonth) option.selected = true;
        monthSelect.appendChild(option);
    });
}

function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const isOpening = !menu.classList.contains('show');
    closeAllDropdowns();
    menu.classList.toggle('show', isOpening);
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
    });
}

async function backupData() {
    if (typeof exportAllData === 'function') {
        await exportAllData('json');
    } else {
        showNotification('❌ Export system not available', 'error');
    }
}

async function restoreData() {
    const input = document.getElementById('overallImportJson');
    if (input) {
        input.click();
        return;
    }
    showNotification('❌ Import input not found', 'error');
}

async function renderUpcomingReminders() {
    const container = document.getElementById('remindersList');
    if (!container) return;

    if (typeof getUpcomingReminders !== 'function') {
        container.innerHTML = '';
        return;
    }

    const reminders = await getUpcomingReminders();
    if (!Array.isArray(reminders) || reminders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No upcoming reminders</p></div>';
        return;
    }

    container.innerHTML = reminders.map(reminder => {
        const title = reminder.title || 'Untitled';
        const date = reminder.date_bs || '';
        const time = reminder.reminderTime ? ` ⏰ ${reminder.reminderTime}` : '';
        return `<div class="reminder-item"><strong>${title}</strong><div>${date}${time}</div></div>`;
    }).join('');
}

async function removeDuplicateHolidays() {
    try {
        const holidays = await enhancedHolidayDB.getAll();
        if (!Array.isArray(holidays) || holidays.length === 0) {
            showNotification('No holidays found', 'info');
            return;
        }

        const seen = new Set();
        const duplicateIds = [];

        holidays.forEach(h => {
            const key = `${h?.date_bs || ''}|${(h?.name || '').toLowerCase().trim()}|${(h?.type || '').toLowerCase().trim()}`;
            if (seen.has(key)) {
                if (h && typeof h.id !== 'undefined') {
                    duplicateIds.push(h.id);
                }
            } else {
                seen.add(key);
            }
        });

        if (duplicateIds.length === 0) {
            showNotification('✅ No duplicate holidays found', 'success');
            return;
        }

        const confirmed = confirm(`Found ${duplicateIds.length} duplicate holidays. Remove them?`);
        if (!confirmed) return;

        for (const id of duplicateIds) {
            await enhancedHolidayDB.delete(id);
        }

        showNotification(`✅ Removed ${duplicateIds.length} duplicates`, 'success');
        if (typeof renderHolidayList === 'function') {
            renderHolidayList();
        }
    } catch (error) {
        console.error('Error removing duplicate holidays:', error);
        showNotification('❌ Failed to remove duplicates', 'error');
    }
}

async function exportCalendarData(scope) {
    try {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const allHolidays = await enhancedHolidayDB.getAll();
        const allNotes = await enhancedNoteDB.getAll();

        const filterByYear = (arr) => arr.filter(item => {
            const [y] = (item?.date_bs || '').split('/').map(Number);
            return y === currentBsYear;
        });
        const filterByMonth = (arr) => arr.filter(item => {
            const [y, m] = (item?.date_bs || '').split('/').map(Number);
            return y === currentBsYear && m === currentBsMonth;
        });

        let data = { holidays: [], notes: [] };

        switch (scope) {
            case 'monthly':
                data.holidays = filterByMonth(allHolidays);
                data.notes = filterByMonth(allNotes);
                break;
            case 'yearly':
                data.holidays = filterByYear(allHolidays);
                data.notes = filterByYear(allNotes);
                break;
            case 'holidays':
                data.holidays = filterByYear(allHolidays);
                data.notes = [];
                break;
            case 'events':
                data.holidays = [];
                data.notes = filterByYear(allNotes);
                break;
            case 'complete':
            default:
                data.holidays = allHolidays;
                data.notes = allNotes;
                break;
        }

        const payload = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            scope,
            data
        };

        downloadFile(JSON.stringify(payload, null, 2), `calendar-${scope || 'export'}-${timestamp}.json`, 'application/json');
        showNotification('✅ Calendar export created', 'success');
    } catch (error) {
        console.error('Calendar export error:', error);
        showNotification('❌ Calendar export failed: ' + error.message, 'error');
    }
}

async function importCalendarData(scope, fileInput) {
    try {
        const file = fileInput?.files?.[0];
        if (!file) {
            showNotification('❌ No file selected', 'error');
            return;
        }

        if (!file.name.toLowerCase().endsWith('.json')) {
            showNotification('❌ Only JSON import is supported for calendar import', 'error');
            return;
        }

        const text = await file.text();
        const payload = JSON.parse(text);
        const importData = payload?.data;
        if (!importData) {
            showNotification('❌ Invalid calendar import file', 'error');
            return;
        }

        const confirmed = confirm('This will import items and skip duplicates. Continue?');
        if (!confirmed) return;

        const existingHolidays = await enhancedHolidayDB.getAll();
        const existingNotes = await enhancedNoteDB.getAll();
        const holidayKeys = new Set(existingHolidays.map(h => `${h?.date_bs || ''}|${(h?.name || '').toLowerCase().trim()}|${(h?.type || '').toLowerCase().trim()}`));
        const noteKeys = new Set(existingNotes.map(n => `${n?.date_bs || ''}|${(n?.title || '').toLowerCase().trim()}|${(n?.content || '').toLowerCase().trim()}`));

        let added = 0;
        if (Array.isArray(importData.holidays)) {
            for (const h of importData.holidays) {
                const key = `${h?.date_bs || ''}|${(h?.name || '').toLowerCase().trim()}|${(h?.type || '').toLowerCase().trim()}`;
                if (holidayKeys.has(key)) continue;
                const { id, ...rest } = h || {};
                await enhancedHolidayDB.add(rest);
                holidayKeys.add(key);
                added++;
            }
        }

        if (Array.isArray(importData.notes)) {
            for (const n of importData.notes) {
                const key = `${n?.date_bs || ''}|${(n?.title || '').toLowerCase().trim()}|${(n?.content || '').toLowerCase().trim()}`;
                if (noteKeys.has(key)) continue;
                const { id, ...rest } = n || {};
                await enhancedNoteDB.add(rest);
                noteKeys.add(key);
                added++;
            }
        }

        showNotification(`✅ Imported ${added} item(s)`, 'success');
        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof renderNotes === 'function') renderNotes();
        if (typeof renderHolidayList === 'function') renderHolidayList();
    } catch (error) {
        console.error('Calendar import error:', error);
        showNotification('❌ Calendar import failed: ' + error.message, 'error');
    } finally {
        if (fileInput && typeof fileInput.value === 'string') {
            fileInput.value = '';
        }
    }
}

async function exportTrackerData(scope) {
    try {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

        const income = await enhancedIncomeDB.getAll();
        const expenses = await enhancedExpenseDB.getAll();
        const recurring = await enhancedRecurringDB.getAll();

        let data = {};
        switch (scope) {
            case 'income':
                data = { income };
                break;
            case 'expenses':
                data = { expenses };
                break;
            case 'recurring':
                data = { recurring };
                break;
            case 'monthly': {
                const filterByMonth = (arr) => arr.filter(item => {
                    const [y, m] = (item?.date_bs || '').split('/').map(Number);
                    return y === currentBsYear && m === currentBsMonth;
                });
                data = {
                    income: filterByMonth(income),
                    expenses: filterByMonth(expenses)
                };
                break;
            }
            case 'complete':
            default:
                data = { income, expenses, recurring };
                break;
        }

        const payload = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            scope,
            data
        };

        downloadFile(JSON.stringify(payload, null, 2), `tracker-${scope || 'export'}-${timestamp}.json`, 'application/json');
        showNotification('✅ Tracker export created', 'success');
    } catch (error) {
        console.error('Tracker export error:', error);
        showNotification('❌ Tracker export failed: ' + error.message, 'error');
    }
}

async function importTrackerData(scope, fileInput) {
    try {
        const file = fileInput?.files?.[0];
        if (!file) {
            showNotification('❌ No file selected', 'error');
            return;
        }

        if (!file.name.toLowerCase().endsWith('.json')) {
            showNotification('❌ Only JSON import is supported for tracker import', 'error');
            return;
        }

        const text = await file.text();
        const payload = JSON.parse(text);
        const importData = payload?.data;
        if (!importData) {
            showNotification('❌ Invalid tracker import file', 'error');
            return;
        }

        const confirmed = confirm('This will import items and skip duplicates. Continue?');
        if (!confirmed) return;

        const existingIncome = await enhancedIncomeDB.getAll();
        const existingExpenses = await enhancedExpenseDB.getAll();
        const existingRecurring = await enhancedRecurringDB.getAll();

        const incomeKeys = new Set(existingIncome.map(t => `${t?.date_bs || ''}|${(t?.category || '').toLowerCase().trim()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase().trim()}|${(t?.description || '').toLowerCase().trim()}`));
        const expenseKeys = new Set(existingExpenses.map(t => `${t?.date_bs || ''}|${(t?.category || '').toLowerCase().trim()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase().trim()}|${(t?.description || '').toLowerCase().trim()}`));
        const recurringKeys = new Set(existingRecurring.map(t => `${t?.type || ''}|${(t?.description || '').toLowerCase().trim()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase().trim()}|${(t?.frequency || '').toLowerCase().trim()}`));

        let added = 0;

        if (Array.isArray(importData.income)) {
            for (const t of importData.income) {
                const key = `${t?.date_bs || ''}|${(t?.category || '').toLowerCase().trim()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase().trim()}|${(t?.description || '').toLowerCase().trim()}`;
                if (incomeKeys.has(key)) continue;
                const { id, ...rest } = t || {};
                await enhancedIncomeDB.add(rest);
                incomeKeys.add(key);
                added++;
            }
        }

        if (Array.isArray(importData.expenses)) {
            for (const t of importData.expenses) {
                const key = `${t?.date_bs || ''}|${(t?.category || '').toLowerCase().trim()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase().trim()}|${(t?.description || '').toLowerCase().trim()}`;
                if (expenseKeys.has(key)) continue;
                const { id, ...rest } = t || {};
                await enhancedExpenseDB.add(rest);
                expenseKeys.add(key);
                added++;
            }
        }

        if (Array.isArray(importData.recurring)) {
            for (const t of importData.recurring) {
                const key = `${t?.type || ''}|${(t?.description || '').toLowerCase().trim()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase().trim()}|${(t?.frequency || '').toLowerCase().trim()}`;
                if (recurringKeys.has(key)) continue;
                const { id, ...rest } = t || {};
                await enhancedRecurringDB.add(rest);
                recurringKeys.add(key);
                added++;
            }
        }

        showNotification(`✅ Imported ${added} item(s)`, 'success');
        if (typeof renderTrackerList === 'function') renderTrackerList();
        if (typeof renderRecurringList === 'function') renderRecurringList();
    } catch (error) {
        console.error('Tracker import error:', error);
        showNotification('❌ Tracker import failed: ' + error.message, 'error');
    } finally {
        if (fileInput && typeof fileInput.value === 'string') {
            fileInput.value = '';
        }
    }
}

function initializeEventListeners() {
    // Import/Export Dropdown Event Listeners
    const calendarExportBtn = document.getElementById('calendarExportBtn');
    const calendarImportBtn = document.getElementById('calendarImportBtn');
    const trackerExportBtn = document.getElementById('trackerExportBtn');
    const trackerImportBtn = document.getElementById('trackerImportBtn');

    // Budget Import/Export
    const budgetExportBtn = document.getElementById('budgetExportBtn');
    const budgetImportBtn = document.getElementById('budgetImportBtn');
    
    // Bills Import/Export
    const billsExportBtn = document.getElementById('billsExportBtn');
    const billsImportBtn = document.getElementById('billsImportBtn');
    
    // Goals Import/Export
    const goalsExportBtn = document.getElementById('goalsExportBtn');
    const goalsImportBtn = document.getElementById('goalsImportBtn');
    
    // Insurance Import/Export
    const insuranceExportBtn = document.getElementById('insuranceExportBtn');
    const insuranceImportBtn = document.getElementById('insuranceImportBtn');
    
    // Vehicle Import/Export
    const vehicleExportBtn = document.getElementById('vehicleExportBtn');
    const vehicleImportBtn = document.getElementById('vehicleImportBtn');
    
    // Subscription Import/Export
    const subscriptionExportBtn = document.getElementById('subscriptionExportBtn');
    const subscriptionImportBtn = document.getElementById('subscriptionImportBtn');
    
    // Custom Import/Export
    const customExportBtn = document.getElementById('customExportBtn');
    const customImportBtn = document.getElementById('customImportBtn');
    
    // Shopping Import/Export
    const shoppingExportBtn = document.getElementById('shoppingExportBtn');
    const shoppingImportBtn = document.getElementById('shoppingImportBtn');
    
    // Calendar Export Dropdown
    if (calendarExportBtn) {
        calendarExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('calendarExportMenu');
        });
    }
    
    // Calendar Import Dropdown
    if (calendarImportBtn) {
        calendarImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('calendarImportMenu');
        });
    }
    
    // Tracker Export Dropdown
    if (trackerExportBtn) {
        trackerExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('trackerExportMenu');
        });
    }
    
    // Tracker Import Dropdown
    if (trackerImportBtn) {
        trackerImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('trackerImportMenu');
        });
    }
    
    // Budget Export Dropdown
    if (budgetExportBtn) {
        budgetExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('budgetExportMenu');
        });
    }
    
    // Budget Import Dropdown
    if (budgetImportBtn) {
        budgetImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('budgetImportMenu');
        });
    }
    
    // Bills Export Dropdown
    if (billsExportBtn) {
        billsExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('billsExportMenu');
        });
    }
    
    // Bills Import Dropdown
    if (billsImportBtn) {
        billsImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('billsImportMenu');
        });
    }
    
    // Goals Export Dropdown
    if (goalsExportBtn) {
        goalsExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('goalsExportMenu');
        });
    }
    
    // Goals Import Dropdown
    if (goalsImportBtn) {
        goalsImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('goalsImportMenu');
        });
    }
    
    // Insurance Export Dropdown
    if (insuranceExportBtn) {
        insuranceExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('insuranceExportMenu');
        });
    }
    
    // Insurance Import Dropdown
    if (insuranceImportBtn) {
        insuranceImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('insuranceImportMenu');
        });
    }
    
    // Vehicle Export Dropdown
    if (vehicleExportBtn) {
        vehicleExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('vehicleExportMenu');
        });
    }
    
    // Vehicle Import Dropdown
    if (vehicleImportBtn) {
        vehicleImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('vehicleImportMenu');
        });
    }
    
    // Subscription Export Dropdown
    if (subscriptionExportBtn) {
        subscriptionExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('subscriptionExportMenu');
        });
    }
    
    // Subscription Import Dropdown
    if (subscriptionImportBtn) {
        subscriptionImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('subscriptionImportMenu');
        });
    }
    
    // Custom Export Dropdown
    if (customExportBtn) {
        customExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('customExportMenu');
        });
    }
    
    // Custom Import Dropdown
    if (customImportBtn) {
        customImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('customImportMenu');
        });
    }
    
    // Shopping Export Dropdown
    if (shoppingExportBtn) {
        shoppingExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('shoppingExportMenu');
        });
    }
    
    // Shopping Import Dropdown
    if (shoppingImportBtn) {
        shoppingImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('shoppingImportMenu');
        });
    }
    
    // Financial Manager Export Dropdown (NEW - for merged module)
    const financialExportBtn = document.getElementById('financialExportBtn');
    const financialImportBtn = document.getElementById('financialImportBtn');
    
    if (financialExportBtn) {
        financialExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('financialExportMenu');
        });
    }
    
    if (financialImportBtn) {
        financialImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('financialImportMenu');
        });
    }
    
    // Asset Manager Export Dropdown (NEW - for merged module)
    const assetsExportBtn = document.getElementById('assetsExportBtn');
    const assetsImportBtn = document.getElementById('assetsImportBtn');
    
    if (assetsExportBtn) {
        assetsExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('assetsExportMenu');
        });
    }
    
    if (assetsImportBtn) {
        assetsImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('assetsImportMenu');
        });
    }
    
    // Notes Export Dropdown (NEW - for notes module)
    const notesExportBtn = document.getElementById('notesExportBtn');
    const notesImportBtn = document.getElementById('notesImportBtn');
    
    if (notesExportBtn) {
        notesExportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('notesExportMenu');
        });
    }
    
    if (notesImportBtn) {
        notesImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('notesImportMenu');
        });
    }
    
    // Close dropdowns when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });

    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    // View switcher
    document.querySelectorAll('.view-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => switchCalendarView(btn.dataset.calendarView));
    });

    // Calendar controls - with safe checks
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    
    // Dynamic navigation based on current view
    if (prevMonth) prevMonth.addEventListener('click', () => navigateCalendar(-1));
    if (nextMonth) nextMonth.addEventListener('click', () => navigateCalendar(1));
    if (todayBtn) todayBtn.addEventListener('click', goToToday);
    if (yearSelect) yearSelect.addEventListener('change', onYearMonthChange);
    if (monthSelect) monthSelect.addEventListener('change', onYearMonthChange);

    // Tracker - with safe checks
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const addRecurringBtn = document.getElementById('addRecurringBtn');
    const trackerFilter = document.getElementById('trackerFilter');
    const currencyFilter = document.getElementById('currencyFilter');
    
    if (addIncomeBtn) addIncomeBtn.addEventListener('click', () => showIncomeExpenseForm('income'));
    if (addExpenseBtn) addExpenseBtn.addEventListener('click', () => showIncomeExpenseForm('expense'));
    if (addRecurringBtn) addRecurringBtn.addEventListener('click', () => showRecurringForm());
    // Note: exportTrackerBtn replaced with import-export dropdown
    if (trackerFilter) trackerFilter.addEventListener('change', renderTrackerList);
    if (currencyFilter) currencyFilter.addEventListener('change', renderTrackerList);

    // Budget - with safe check
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    if (addBudgetBtn) addBudgetBtn.addEventListener('click', () => showBudgetForm());

    // Bills - with safe checks
    const addBillBtn = document.getElementById('addBillBtn');
    if (addBillBtn) addBillBtn.addEventListener('click', () => showBillForm());
    document.querySelectorAll('#billsView .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#billsView .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderBillsList();
        });
    });

    // Goals - with safe check
    const addGoalBtn = document.getElementById('addGoalBtn');
    if (addGoalBtn) addGoalBtn.addEventListener('click', () => showGoalForm());

    // Insurance - with safe checks
    const addInsuranceBtn = document.getElementById('addInsuranceBtn');
    if (addInsuranceBtn) addInsuranceBtn.addEventListener('click', () => showInsuranceForm());
    document.querySelectorAll('#insuranceView .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#insuranceView .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderInsuranceList();
        });
    });

    // Vehicle - with safe check
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) addVehicleBtn.addEventListener('click', () => showVehicleForm());

    // Subscription - with safe checks
    const addSubscriptionBtn = document.getElementById('addSubscriptionBtn');
    if (addSubscriptionBtn) addSubscriptionBtn.addEventListener('click', () => showSubscriptionForm());
    document.querySelectorAll('#subscriptionView .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#subscriptionView .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderSubscriptionList();
        });
    });

    // Custom - with safe check
    const addCustomTypeBtn = document.getElementById('addCustomTypeBtn');
    if (addCustomTypeBtn) addCustomTypeBtn.addEventListener('click', () => showCustomTypeForm());

    // Shopping - with safe checks
    const addShoppingBtn = document.getElementById('addShoppingBtn');
    if (addShoppingBtn) addShoppingBtn.addEventListener('click', () => showShoppingForm());
    document.querySelectorAll('#shoppingView .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#shoppingView .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderShoppingList();
        });
    });

    // Notes - with safe check
    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) addNoteBtn.addEventListener('click', () => showNoteForm());

    // Settings - with safe checks
    const darkModeToggle = document.getElementById('darkModeToggle');
    const addHolidayBtn = document.getElementById('addHolidayBtn');
    const importHolidayBtn = document.getElementById('importHolidayBtn');
    const holidayFileInput = document.getElementById('holidayFileInput');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const backupDataBtn = document.getElementById('backupDataBtn');
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    
    if (darkModeToggle) darkModeToggle.addEventListener('change', toggleDarkMode);
    if (addHolidayBtn) addHolidayBtn.addEventListener('click', () => showHolidayForm());
    if (importHolidayBtn) importHolidayBtn.addEventListener('click', () => {
        if (holidayFileInput) holidayFileInput.click();
    });
    if (holidayFileInput) holidayFileInput.addEventListener('change', importHolidaysCSV);
    
    // Data Management buttons
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    if (backupDataBtn) backupDataBtn.addEventListener('click', backupData);
    if (restoreDataBtn) restoreDataBtn.addEventListener('click', restoreData);
    
    // Overall Export button
    const overallExportBtn = document.getElementById('overallExportBtn');
    const overallExportMenu = document.getElementById('overallExportMenu');
    
    console.log(' Export button setup:', {
        button: !!overallExportBtn,
        menu: !!overallExportMenu,
        buttonElement: overallExportBtn,
        menuElement: overallExportMenu
    });
    
    if (overallExportBtn) {
        console.log(' Adding click listener to export button');
        overallExportBtn.addEventListener('click', (e) => {
            console.log(' Export button clicked!', e);
            e.preventDefault();
            e.stopPropagation();
            console.log(' Toggling export menu');
            overallExportMenu.classList.toggle('show');
            console.log(' Export menu classes:', overallExportMenu.className);
        });
    } else {
        console.error(' Export button not found!');
    }
    
    // Overall Import button
    const overallImportBtn = document.getElementById('overallImportBtn');
    const overallImportMenu = document.getElementById('overallImportMenu');
    
    console.log(' Import button setup:', {
        button: !!overallImportBtn,
        menu: !!overallImportMenu,
        buttonElement: overallImportBtn,
        menuElement: overallImportMenu
    });
    
    if (overallImportBtn) {
        console.log(' Adding click listener to import button');
        overallImportBtn.addEventListener('click', (e) => {
            console.log(' Import button clicked!', e);
            e.preventDefault();
            e.stopPropagation();
            console.log(' Toggling import menu');
            overallImportMenu.classList.toggle('show');
            console.log(' Import menu classes:', overallImportMenu.className);
        });
    } else {
        console.error(' Import button not found!');
    }
    
    // Remove Duplicate Holidays Button
    const removeDuplicateHolidaysBtn = document.getElementById('removeDuplicateHolidaysBtn');
    if (removeDuplicateHolidaysBtn) removeDuplicateHolidaysBtn.addEventListener('click', removeDuplicateHolidays);

    // Global Duplicate Scan Button
    const globalDuplicateScanBtn = document.getElementById('globalDuplicateScanBtn');
    if (globalDuplicateScanBtn) globalDuplicateScanBtn.addEventListener('click', scanAllModulesForDuplicates);

    // Module-specific Data Buttons
    const calendarDataBtn = document.getElementById('calendarDataBtn');
    const calendarDataMenu = document.getElementById('calendarDataMenu');
    if (calendarDataBtn) {
        calendarDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            calendarDataMenu.classList.toggle('show');
        });
    }
    
    const trackerDataBtn = document.getElementById('trackerDataBtn');
    const trackerDataMenu = document.getElementById('trackerDataMenu');
    if (trackerDataBtn) {
        trackerDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            trackerDataMenu.classList.toggle('show');
        });
    }
    
    const budgetDataBtn = document.getElementById('budgetDataBtn');
    const budgetDataMenu = document.getElementById('budgetDataMenu');
    if (budgetDataBtn) {
        budgetDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            budgetDataMenu.classList.toggle('show');
        });
    }
    
    const billsDataBtn = document.getElementById('billsDataBtn');
    const billsDataMenu = document.getElementById('billsDataMenu');
    if (billsDataBtn) {
        billsDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            billsDataMenu.classList.toggle('show');
        });
    }
    
    const goalsDataBtn = document.getElementById('goalsDataBtn');
    const goalsDataMenu = document.getElementById('goalsDataMenu');
    if (goalsDataBtn) {
        goalsDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goalsDataMenu.classList.toggle('show');
        });
    }
    
    const insuranceDataBtn = document.getElementById('insuranceDataBtn');
    const insuranceDataMenu = document.getElementById('insuranceDataMenu');
    if (insuranceDataBtn) {
        insuranceDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            insuranceDataMenu.classList.toggle('show');
        });
    }
    
    const vehicleDataBtn = document.getElementById('vehicleDataBtn');
    const vehicleDataMenu = document.getElementById('vehicleDataMenu');
    if (vehicleDataBtn) {
        vehicleDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            vehicleDataMenu.classList.toggle('show');
        });
    }
    
    const subscriptionDataBtn = document.getElementById('subscriptionDataBtn');
    const subscriptionDataMenu = document.getElementById('subscriptionDataMenu');
    if (subscriptionDataBtn) {
        subscriptionDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            subscriptionDataMenu.classList.toggle('show');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            closeAllDropdowns();
        }
    });

    // FAB - with safe checks
    const fab = document.getElementById('fab');
    if (fab) {
        const fabButton = fab.querySelector('.fab-button');
        if (fabButton) {
            fabButton.addEventListener('click', () => fab.classList.toggle('active'));
        }

        document.addEventListener('click', (e) => {
            if (!fab.contains(e.target)) {
                fab.classList.remove('active');
            }
        });

        document.querySelectorAll('.fab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                fab.classList.remove('active');
                handleFabAction(action);
            });
        });
    }

    // Modal - with safe checks
    const modalClose = document.querySelector('.modal-close');
    const modal = document.getElementById('modal');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });

    // Drawer - with safe check
    const drawerClose = document.querySelector('.drawer-close');
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
}

/**
 * ========================================
 * VIEW SWITCHING
 * ========================================
 */
function switchView(viewName) {
    currentView = viewName;
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}View`).classList.add('active');

    switch(viewName) {
        case 'calendar':
            renderCalendar();
            updateMonthlySummary();
            updateAllCharts(currentBsYear, currentBsMonth);
            break;
        case 'tracker':
            renderTrackerList();
            renderRecurringList();
            updateSMSProcessButton();
            break;
        case 'budget':
            updateBudgetOverview(currentBsYear, currentBsMonth);
            renderBudgetCategories(currentBsYear, currentBsMonth);
            renderBudgetChart(currentBsYear, currentBsMonth);
            break;
        case 'bills':
            renderBillsList();
            renderUpcomingBillsList();
            break;
        case 'goals':
            renderGoalsGrid();
            break;
        case 'insurance':
            renderInsuranceList();
            renderInsuranceStats();
            break;
        case 'vehicle':
            renderVehicleGrid();
            break;
        case 'subscription':
            renderSubscriptionList();
            renderSubscriptionSummary();
            break;
        case 'custom':
            renderCustomTypes();
            break;
        case 'shopping':
            renderShoppingList();
            break;
        case 'notes':
            renderNotes();
            renderUpcomingReminders();
            break;
        case 'settings':
            renderHolidayList();
            break;
        case 'medicine':
            // Initialize medicine tracker when medicine view is accessed
            if (typeof initMedicineTracker === 'function') {
                initMedicineTracker();
            }
            break;
    }
}

/**
 * ========================================
 * CALENDAR VIEW SWITCHING
 * ========================================
 */
function switchCalendarView(viewType) {
    currentCalendarView = viewType;

    document.querySelectorAll('.view-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.calendarView === viewType);
    });

    document.querySelectorAll('.calendar-view-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(`${viewType}View`).classList.add('active');

    switch(viewType) {
        case 'year':
            renderYearView();
            break;
        case 'month':
            renderCalendar();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'day':
            renderDayView();
            break;
    }
}

/**
 * Display Monthly Holidays Below Calendar
 */
async function displayMonthlyHolidays() {
    try {
        const holidayContent = document.getElementById('monthlyHolidayContent');
        if (!holidayContent) return;

        // Get all holidays
        const allHolidays = await enhancedHolidayDB.getAll();
        
        // Filter holidays for current month
        const currentMonthHolidays = allHolidays.filter(holiday => {
            const [year, month] = holiday.date_bs.split('/').map(Number);
            return year === currentBsYear && month === currentBsMonth;
        });

        if (currentMonthHolidays.length === 0) {
            holidayContent.innerHTML = '<div class="no-holidays">No holidays this month</div>';
            return;
        }

        // Sort holidays by date
        currentMonthHolidays.sort((a, b) => a.date_bs.localeCompare(b.date_bs));

        // Display holidays in red color
        holidayContent.innerHTML = currentMonthHolidays.map(holiday => `
            <div class="monthly-holiday-item">
                <span class="holiday-date">${holiday.date_bs}</span>
                <span class="holiday-name">${holiday.name}</span>
                <span class="holiday-type">${holiday.type}</span>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error displaying monthly holidays:', error);
    }
}

/**
 * ========================================
 * YEAR VIEW
 * ========================================
 */
async function renderYearView() {
    try {
        const grid = document.getElementById('yearGrid');
        if (!grid) {
            console.error('❌ Year grid not found!');
            return;
        }

        grid.innerHTML = '';

        const today = getCurrentNepaliDate();
        const months = [
            { name: 'बैशाख', number: 1, english: 'Baishakh' },
            { name: 'जेठ', number: 2, english: 'Jestha' },
            { name: 'असार', number: 3, english: 'Ashar' },
            { name: 'श्रावण', number: 4, english: 'Shrawan' },
            { name: 'भाद्र', number: 5, english: 'Bhadra' },
            { name: 'असोज', number: 6, english: 'Ashwin' },
            { name: 'कार्तिक', number: 7, english: 'Kartik' },
            { name: 'मंसिर', number: 8, english: 'Mangsir' },
            { name: 'पुष', number: 9, english: 'Poush' },
            { name: 'माघ', number: 10, english: 'Magh' },
            { name: 'फाल्गुन', number: 11, english: 'Falgun' },
            { name: 'चैत्र', number: 12, english: 'Chaitra' }
        ];

        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            const monthCard = createYearMonthCard(month, currentBsYear, today);
            grid.appendChild(monthCard);
        }

        console.log('✅ Year view rendered successfully');

        // Display yearly holidays and summary after rendering year view
        displayYearlyHolidays();
        displayYearlySummary();

    } catch (error) {
        console.error('❌ Year view render error:', error);
    }
}

function createYearMonthCard(month, year, today) {
    const card = document.createElement('div');
    card.className = 'year-month-card';
    
    // Check if current month
    if (month.number === today.month && year === today.year) {
        card.classList.add('current-month');
    }

    // Month header
    const header = document.createElement('div');
    header.className = 'year-month-header';
    
    const monthName = document.createElement('div');
    monthName.className = 'year-month-name';
    monthName.textContent = month.name;
    
    const monthNumber = document.createElement('div');
    monthNumber.className = 'year-month-number';
    monthNumber.textContent = month.number;
    
    header.appendChild(monthName);
    header.appendChild(monthNumber);
    card.appendChild(header);

    // Mini calendar
    const miniCalendar = document.createElement('div');
    miniCalendar.className = 'year-month-days';
    
    // Day headers (Nepali day names)
    const dayHeaders = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'year-month-day-header';
        dayHeader.textContent = day;
        miniCalendar.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDayAd = bsToAd(year, month.number, 1);
    const firstDayOfWeek = firstDayAd.date.getDay();
    const daysInMonth = getDaysInBSMonth(year, month.number);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'year-month-day';
        miniCalendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'year-month-day';
        dayElement.textContent = day;
        
        const bsDateStr = formatBsDate(year, month.number, day);
        const adDate = bsToAd(year, month.number, day);
        
        // Check if today
        if (year === today.year && month.number === today.month && day === today.day) {
            dayElement.classList.add('today');
        }
        
        // Check if Saturday
        if (adDate.date.getDay() === 6) {
            dayElement.classList.add('saturday');
        }
        
        // Check if holiday
        checkHolidayForYearView(bsDateStr, dayElement);
        
        // Click event to navigate to month view
        dayElement.addEventListener('click', () => {
            currentBsYear = year;
            currentBsMonth = month.number;
            currentBsDay = day;
            switchCalendarView('month');
            updateCalendarControls();
        });
        
        miniCalendar.appendChild(dayElement);
    }
    
    card.appendChild(miniCalendar);

    // Load month events and holidays asynchronously
    loadYearMonthData(card, year, month.number);

    // Click event for month card (navigate to month view)
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('year-month-day')) {
            currentBsYear = year;
            currentBsMonth = month.number;
            currentBsDay = 1;
            switchCalendarView('month');
            updateCalendarControls();
        }
    });

    return card;
}

async function checkHolidayForYearView(bsDateStr, dayElement) {
    try {
        const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
        if (holidays && holidays.length > 0) {
            dayElement.classList.add('holiday');
        }
    } catch (error) {
        console.error('Error checking holiday for year view:', error);
    }
}

async function loadYearMonthData(card, year, monthNumber) {
    try {
        // Get all data for the month
        const monthData = await getMonthData(year, monthNumber);
        
        // Count events and holidays
        let holidayCount = 0;
        const eventTypes = new Set();
        
        // Count holidays
        for (let day = 1; day <= getDaysInBSMonth(year, monthNumber); day++) {
            const bsDateStr = formatBsDate(year, monthNumber, day);
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
            if (holidays && holidays.length > 0) {
                holidayCount++;
            }
            
            const dateData = await getDateData(bsDateStr);
            if (dateData.income.length > 0) eventTypes.add('income');
            if (dateData.expenses.length > 0) eventTypes.add('expense');
            if (dateData.notes.length > 0) eventTypes.add('note');
            if (dateData.bills.length > 0) eventTypes.add('bill');
        }
        
        // Add event dots
        if (eventTypes.size > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'year-month-events';
            
            eventTypes.forEach(eventType => {
                const dot = document.createElement('div');
                dot.className = `year-month-event-dot ${eventType}`;
                eventsContainer.appendChild(dot);
            });
            
            card.appendChild(eventsContainer);
        }
        
        // Add stats
        const stats = document.createElement('div');
        stats.className = 'year-month-stats';
        
        const holidayCountSpan = document.createElement('span');
        holidayCountSpan.className = 'year-month-holiday-count';
        holidayCountSpan.textContent = `🎉 ${holidayCount}`;
        
        const eventCountSpan = document.createElement('span');
        eventCountSpan.textContent = `${eventTypes.size} types`;
        
        stats.appendChild(holidayCountSpan);
        stats.appendChild(eventCountSpan);
        card.appendChild(stats);
        
    } catch (error) {
        console.error('Error loading year month data:', error);
    }
}

/**
 * Display Yearly Holidays Below Year View
 */
async function displayYearlyHolidays() {
    try {
        const holidayContent = document.getElementById('yearlyHolidayContent');
        if (!holidayContent) return;

        // Get all holidays for current year
        const allHolidays = await enhancedHolidayDB.getAll();
        
        // Filter holidays for current year
        const currentYearHolidays = allHolidays.filter(holiday => {
            const [year] = holiday.date_bs.split('/').map(Number);
            return year === currentBsYear;
        });

        if (currentYearHolidays.length === 0) {
            holidayContent.innerHTML = '<div class="no-yearly-holidays">No holidays this year</div>';
            return;
        }

        // Sort holidays by date
        currentYearHolidays.sort((a, b) => a.date_bs.localeCompare(b.date_bs));

        // Get month names for display
        const monthNames = [
            'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'असोज', 
            'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
        ];

        // Display holidays with month names
        holidayContent.innerHTML = currentYearHolidays.map(holiday => {
            const [year, month] = holiday.date_bs.split('/').map(Number);
            const monthName = monthNames[month - 1] || 'Unknown';
            return `
                <div class="yearly-holiday-item">
                    <span class="holiday-date">${holiday.date_bs}</span>
                    <span class="holiday-month">${monthName}</span>
                    <span class="holiday-name">${holiday.name}</span>
                    <span class="holiday-type">${holiday.type}</span>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error displaying yearly holidays:', error);
    }
}

/**
 * Display Yearly Summary Below Year View
 */
async function displayYearlySummary() {
    try {
        const summaryContent = document.getElementById('yearlySummaryContent');
        if (!summaryContent) return;

        // Initialize yearly totals
        let totalIncome = 0;
        let totalExpense = 0;
        let totalHolidays = 0;
        let totalEvents = 0;
        let totalNotes = 0;
        let totalBills = 0;

        // Calculate yearly totals
        for (let month = 1; month <= 12; month++) {
            for (let day = 1; day <= getDaysInBSMonth(currentBsYear, month); day++) {
                const bsDateStr = formatBsDate(currentBsYear, month, day);
                
                // Count holidays
                const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
                if (holidays && holidays.length > 0) {
                    totalHolidays += holidays.length;
                }
                
                // Count events
                const dateData = await getDateData(bsDateStr);
                totalIncome += dateData.income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                totalExpense += dateData.expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                totalNotes += dateData.notes.length;
                totalBills += dateData.bills.length;
                totalEvents += dateData.income.length + dateData.expenses.length + dateData.notes.length + dateData.bills.length;
            }
        }

        const netAmount = totalIncome - totalExpense;

        // Create summary HTML
        summaryContent.innerHTML = `
            <div class="yearly-summary-grid">
                <div class="yearly-summary-card income">
                    <h5>Total Income</h5>
                    <div class="amount">Rs. ${totalIncome.toLocaleString()}</div>
                    <div class="description">Yearly income from all sources</div>
                </div>
                <div class="yearly-summary-card expense">
                    <h5>Total Expenses</h5>
                    <div class="amount">Rs. ${totalExpense.toLocaleString()}</div>
                    <div class="description">Yearly expenses across all categories</div>
                </div>
                <div class="yearly-summary-card income">
                    <h5>Net Amount</h5>
                    <div class="amount ${netAmount >= 0 ? '' : 'negative'}">Rs. ${Math.abs(netAmount).toLocaleString()}</div>
                    <div class="description">${netAmount >= 0 ? 'Net savings' : 'Net deficit'}</div>
                </div>
                <div class="yearly-summary-card holiday">
                    <h5>Total Holidays</h5>
                    <div class="count">${totalHolidays}</div>
                    <div class="description">Holidays and special days</div>
                </div>
                <div class="yearly-summary-card event">
                    <h5>Total Events</h5>
                    <div class="count">${totalEvents}</div>
                    <div class="description">All calendar events</div>
                </div>
                <div class="yearly-summary-card event">
                    <h5>Notes & Bills</h5>
                    <div class="count">${totalNotes + totalBills}</div>
                    <div class="description">Notes: ${totalNotes}, Bills: ${totalBills}</div>
                </div>
            </div>
        `;

        // Add negative styling for net loss
        if (netAmount < 0) {
            const netCard = summaryContent.querySelector('.yearly-summary-card.income:last-child .amount');
            if (netCard) {
                netCard.style.color = 'var(--danger-color)';
            }
        }

    } catch (error) {
        console.error('Error displaying yearly summary:', error);
    }
}

/**
 * Display Weekly Holidays Below Week View
 */
async function displayWeeklyHolidays() {
    try {
        console.log('🔍 displayWeeklyHolidays called');
        const holidayContent = document.getElementById('weeklyHolidayContent');
        if (!holidayContent) {
            console.error('❌ weeklyHolidayContent element not found');
            return;
        }

        // Get current week dates
        const today = getCurrentNepaliDate();
        console.log('📅 Today:', today);
        const currentDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay || today.day);
        const dayOfWeek = currentDate.date.getDay();
        console.log('📅 Current AD date:', currentDate, 'Day of week:', dayOfWeek);
        
        const weekStart = new Date(currentDate.date);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        console.log('📅 Week start:', weekStart);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const bs = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const bsDateStr = formatBsDate(bs.year, bs.month, bs.day);
            weekDates.push(bsDateStr);
            console.log(`📅 Day ${i}: ${bsDateStr} (BS: ${bs.year}/${bs.month}/${bs.day})`);
        }

        console.log('📅 Week dates:', weekDates);

        // Get holidays for the week
        const weeklyHolidays = [];
        for (const bsDateStr of weekDates) {
            console.log(`🔍 Checking holidays for: ${bsDateStr}`);
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
            console.log(`🎉 Holidays found for ${bsDateStr}:`, holidays);
            if (holidays && holidays.length > 0) {
                holidays.forEach(holiday => {
                    weeklyHolidays.push({...holiday, date_bs: bsDateStr});
                });
            }
        }

        console.log('🎉 Total weekly holidays:', weeklyHolidays);

        if (weeklyHolidays.length === 0) {
            holidayContent.innerHTML = '<div class="no-weekly-holidays">No holidays this week</div>';
            console.log('📝 No holidays message displayed');
            return;
        }

        // Sort holidays by date
        weeklyHolidays.sort((a, b) => a.date_bs.localeCompare(b.date_bs));

        // Get day names for display
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Display holidays with day names
        holidayContent.innerHTML = weeklyHolidays.map(holiday => {
            const [year, month, day] = holiday.date_bs.split('/').map(Number);
            const bsDate = bsToAd(year, month, day);
            const dayName = dayNames[bsDate.date.getDay()];
            return `
                <div class="weekly-holiday-item">
                    <span class="holiday-date">${holiday.date_bs}</span>
                    <span class="holiday-day">${dayName}</span>
                    <span class="holiday-name">${holiday.name}</span>
                    <span class="holiday-type">${holiday.type}</span>
                </div>
            `;
        }).join('');

        console.log('✅ Weekly holidays displayed successfully');

    } catch (error) {
        console.error('❌ Error displaying weekly holidays:', error);
    }
}

/**
 * Display Weekly Summary Below Week View
 */
async function displayWeeklySummary() {
    try {
        console.log('🔍 displayWeeklySummary called');
        const summaryContent = document.getElementById('weeklySummaryContent');
        if (!summaryContent) {
            console.error('❌ weeklySummaryContent element not found');
            return;
        }

        // Get current week dates
        const today = getCurrentNepaliDate();
        console.log('📅 Today:', today);
        const currentDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay || today.day);
        const dayOfWeek = currentDate.date.getDay();
        console.log('📅 Current AD date:', currentDate, 'Day of week:', dayOfWeek);
        
        const weekStart = new Date(currentDate.date);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        console.log('📅 Week start:', weekStart);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const bs = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const bsDateStr = formatBsDate(bs.year, bs.month, bs.day);
            weekDates.push(bsDateStr);
            console.log(`📅 Day ${i}: ${bsDateStr} (BS: ${bs.year}/${bs.month}/${bs.day})`);
        }

        console.log('📅 Week dates:', weekDates);

        // Initialize weekly totals
        let totalIncome = 0;
        let totalExpense = 0;
        let totalHolidays = 0;
        let totalEvents = 0;
        let totalNotes = 0;
        let totalBills = 0;

        // Calculate weekly totals
        for (const bsDateStr of weekDates) {
            console.log(`🔍 Processing data for: ${bsDateStr}`);
            
            // Count holidays
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
            if (holidays && holidays.length > 0) {
                totalHolidays += holidays.length;
                console.log(`🎉 Found ${holidays.length} holidays for ${bsDateStr}`);
            }
            
            // Count events
            const dateData = await getDateData(bsDateStr);
            const dayIncome = dateData.income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            const dayExpense = dateData.expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            const dayNotes = dateData.notes.length;
            const dayBills = dateData.bills.length;
            const dayEvents = dateData.income.length + dateData.expenses.length + dateData.notes.length + dateData.bills.length;
            
            totalIncome += dayIncome;
            totalExpense += dayExpense;
            totalNotes += dayNotes;
            totalBills += dayBills;
            totalEvents += dayEvents;
            
            console.log(`💰 Data for ${bsDateStr}: Income=${dayIncome}, Expense=${dayExpense}, Notes=${dayNotes}, Bills=${dayBills}, Events=${dayEvents}`);
        }

        console.log('📊 Weekly totals:', { totalIncome, totalExpense, totalHolidays, totalEvents, totalNotes, totalBills });

        const netAmount = totalIncome - totalExpense;

        // Create summary HTML
        summaryContent.innerHTML = `
            <div class="weekly-summary-grid">
                <div class="weekly-summary-card income">
                    <h5>Weekly Income</h5>
                    <div class="amount">Rs. ${totalIncome.toLocaleString()}</div>
                    <div class="description">Income this week</div>
                </div>
                <div class="weekly-summary-card expense">
                    <h5>Weekly Expenses</h5>
                    <div class="amount">Rs. ${totalExpense.toLocaleString()}</div>
                    <div class="description">Expenses this week</div>
                </div>
                <div class="weekly-summary-card income">
                    <h5>Net Amount</h5>
                    <div class="amount ${netAmount >= 0 ? '' : 'negative'}">Rs. ${Math.abs(netAmount).toLocaleString()}</div>
                    <div class="description">${netAmount >= 0 ? 'Weekly savings' : 'Weekly deficit'}</div>
                </div>
                <div class="weekly-summary-card holiday">
                    <h5>Weekly Holidays</h5>
                    <div class="count">${totalHolidays}</div>
                    <div class="description">Holidays this week</div>
                </div>
                <div class="weekly-summary-card event">
                    <h5>Weekly Events</h5>
                    <div class="count">${totalEvents}</div>
                    <div class="description">Events this week</div>
                </div>
                <div class="weekly-summary-card event">
                    <h5>Notes & Bills</h5>
                    <div class="count">${totalNotes + totalBills}</div>
                    <div class="description">Notes: ${totalNotes}, Bills: ${totalBills}</div>
                </div>
            </div>
        `;

        // Add negative styling for net loss
        if (netAmount < 0) {
            const netCard = summaryContent.querySelector('.weekly-summary-card.income:last-child .amount');
            if (netCard) {
                netCard.style.color = 'var(--danger-color)';
            }
        }

        console.log('✅ Weekly summary displayed successfully');

    } catch (error) {
        console.error('❌ Error displaying weekly summary:', error);
    }
}

/**
 * Display Daily Summary Below Day View
 */
async function displayDailySummary() {
    try {
        const summaryContent = document.getElementById('dailySummaryContent');
        if (!summaryContent) return;

        const today = getCurrentNepaliDate();
        const day = currentBsDay || today.day;
        const bsDateStr = formatBsDate(currentBsYear, currentBsMonth, day);
        
        // Get data for the day
        const dateData = await getDateData(bsDateStr);
        const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);

        // Calculate daily totals
        const totalIncome = dateData.income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalExpense = dateData.expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalBills = dateData.bills.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalNotes = dateData.notes.length;
        const totalHolidays = holidays ? holidays.length : 0;
        const netAmount = totalIncome - totalExpense - totalBills;

        // Create summary HTML
        summaryContent.innerHTML = `
            <div class="daily-summary-grid">
                <div class="daily-summary-card income">
                    <h5>Daily Income</h5>
                    <div class="amount">Rs. ${totalIncome.toLocaleString()}</div>
                    <div class="description">Income today</div>
                </div>
                <div class="daily-summary-card expense">
                    <h5>Daily Expenses</h5>
                    <div class="amount">Rs. ${totalExpense.toLocaleString()}</div>
                    <div class="description">Expenses today</div>
                </div>
                <div class="daily-summary-card bill">
                    <h5>Daily Bills</h5>
                    <div class="amount">Rs. ${totalBills.toLocaleString()}</div>
                    <div class="description">Bills due today</div>
                </div>
                <div class="daily-summary-card income">
                    <h5>Net Amount</h5>
                    <div class="amount ${netAmount >= 0 ? '' : 'negative'}">Rs. ${Math.abs(netAmount).toLocaleString()}</div>
                    <div class="description">${netAmount >= 0 ? 'Daily savings' : 'Daily deficit'}</div>
                </div>
                <div class="daily-summary-card note">
                    <h5>Daily Notes</h5>
                    <div class="count">${totalNotes}</div>
                    <div class="description">Notes & reminders</div>
                </div>
                <div class="daily-summary-card holiday">
                    <h5>Holidays</h5>
                    <div class="count">${totalHolidays}</div>
                    <div class="description">Special days</div>
                </div>
            </div>
        `;

        // Add negative styling for net loss
        if (netAmount < 0) {
            const netCard = summaryContent.querySelector('.daily-summary-card.income:last-child .amount');
            if (netCard) {
                netCard.style.color = 'var(--danger-color)';
            }
        }

    } catch (error) {
        console.error('Error displaying daily summary:', error);
    }
}

/**
 * ========================================
 * WEEK VIEW
 * ========================================
 */
async function renderWeekView() {
    try {
        console.log('🔍 renderWeekView called');
        const grid = document.getElementById('weekGrid');
        if (!grid) {
            console.error('❌ Week grid not found!');
            return;
        }

        grid.innerHTML = '';

        const today = getCurrentNepaliDate();
        const currentDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay || today.day);
        const dayOfWeek = currentDate.date.getDay();
        console.log('📅 Today:', today, 'Day of week:', dayOfWeek);

        const weekStart = new Date(currentDate.date);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        console.log('📅 Week start:', weekStart);

        // Add time slot header
        grid.appendChild(createWeekTimeSlot(''));

        // Add day headers
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const bs = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            
            const header = document.createElement('div');
            header.className = 'week-day-header';
            header.innerHTML = `
                <div class="date-number">${bs.day}</div>
                <div class="day-name">${getNepaliMonthName(bs.month).substring(0, 3)}</div>
            `;
            grid.appendChild(header);
        }

        // Collect events for the week
        const events = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const bs = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const bsDateStr = formatBsDate(bs.year, bs.month, bs.day);
            const dateData = await getDateData(bsDateStr);
            events.push(dateData);
        }

        // Add events section
        grid.appendChild(createWeekTimeSlot('Events'));
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('div');
            cell.className = 'week-cell';
            
            const dateData = events[i];
            let html = '';
            
            dateData.income.forEach(item => {
                html += `<div class="week-event income">💵 ${item.category}: Rs. ${parseFloat(item.amount).toLocaleString()}</div>`;
            });
            dateData.expenses.forEach(item => {
                html += `<div class="week-event expense">💸 ${item.category}: Rs. ${parseFloat(item.amount).toLocaleString()}</div>`;
            });
            dateData.bills.forEach(item => {
                html += `<div class="week-event bill">💳 ${item.name}: Rs. ${parseFloat(item.amount).toLocaleString()}</div>`;
            });
            dateData.notes.forEach(item => {
                // Get event type icon
                const eventIcons = {
                    birthday: '🎂',
                    anniversary: '💑',
                    meeting: '🤝',
                    appointment: '🏥',
                    deadline: '⏰',
                    celebration: '🎉',
                    travel: '✈️',
                    note: '📝'
                };
                
                const icon = eventIcons[item.eventType] || '📝';
                const reminderIcon = item.isReminder ? '🔔' : '';
                const priorityClass = item.priority || 'low';
                
                html += `<div class="week-event note priority-${priorityClass}">${icon} ${reminderIcon} ${item.title || item.content.substring(0, 20)}...</div>`;
            });
            
            cell.innerHTML = html || '<span style="color: var(--text-secondary); font-size: 0.85rem;">No events</span>';
            grid.appendChild(cell);
        }
        
        console.log('✅ Week view rendered successfully');
        
        // Display weekly holidays and summary after rendering week view
        displayWeeklyHolidays();
        displayWeeklySummary();
        
    } catch (error) {
        console.error('❌ Week view render error:', error);
    }
}

function createWeekTimeSlot(label) {
    const slot = document.createElement('div');
    slot.className = 'week-time-slot';
    slot.textContent = label;
    return slot;
}

/**
 * ========================================
 * DAY VIEW
 * ========================================
 */
async function renderDayView() {
    const container = document.getElementById('dayDetail');
    const today = getCurrentNepaliDate();
    const day = currentBsDay || today.day;
    
    const bsDateStr = formatBsDate(currentBsYear, currentBsMonth, day);
    const adDate = bsToAd(currentBsYear, currentBsMonth, day);
    const dateData = await getDateData(bsDateStr);

    let html = `
        <div class="day-detail-header">
            <div class="day-detail-date">${day}</div>
            <div class="day-detail-month">${getNepaliMonthName(currentBsMonth)} ${currentBsYear}</div>
            <div class="day-detail-month">${adDate.month}/${adDate.day}/${adDate.year} AD</div>
        </div>
    `;

    if (dateData.holidays.length > 0) {
        html += `<div class="day-events-section"><h4 style="color: var(--danger-color);">🎉 Holidays</h4>`;
        dateData.holidays.forEach(holiday => {
            html += `<div class="day-event-item">${holiday.name}</div>`;
        });
        html += `</div>`;
    }

    if (dateData.income.length > 0) {
        html += `<div class="day-events-section"><h4 style="color: var(--secondary-color);">💵 Income</h4>`;
        dateData.income.forEach(item => {
            html += `
                <div class="day-event-item" style="border-left-color: var(--secondary-color);">
                    <strong>${item.category}</strong><br>
                    ${item.description || ''}<br>
                    <span style="font-size: 1.2rem; color: var(--secondary-color);">Rs. ${parseFloat(item.amount).toLocaleString()}</span>
                </div>`;
        });
        html += `</div>`;
    }

    if (dateData.expenses.length > 0) {
        html += `<div class="day-events-section"><h4 style="color: var(--danger-color);">💸 Expenses</h4>`;
        dateData.expenses.forEach(item => {
            html += `
                <div class="day-event-item" style="border-left-color: var(--danger-color);">
                    <strong>${item.category}</strong><br>
                    ${item.description || ''}<br>
                    <span style="font-size: 1.2rem; color: var(--danger-color);">Rs. ${parseFloat(item.amount).toLocaleString()}</span>
                </div>`;
        });
        html += `</div>`;
    }

    if (dateData.bills.length > 0) {
        html += `<div class="day-events-section"><h4 style="color: var(--warning-color);">💳 Bills Due</h4>`;
        dateData.bills.forEach(item => {
            html += `
                <div class="day-event-item" style="border-left-color: var(--warning-color);">
                    <strong>${item.name}</strong><br>
                    <span style="font-size: 1.2rem; color: var(--warning-color);">Rs. ${parseFloat(item.amount).toLocaleString()}</span>
                </div>`;
        });
        html += `</div>`;
    }

    if (dateData.notes.length > 0) {
        html += `<div class="day-events-section"><h4>📝 Notes & Reminders</h4>`;
        dateData.notes.forEach(item => {
            // Get event type icon
            const eventIcons = {
                birthday: '🎂',
                anniversary: '💑',
                meeting: '🤝',
                appointment: '🏥',
                deadline: '⏰',
                celebration: '🎉',
                travel: '✈️',
                note: '📝'
            };
            
            // Get priority color
            const priorityColors = {
                high: '#E74C3C',
                medium: '#F39C12',
                low: '#2ECC71'
            };
            
            const icon = eventIcons[item.eventType] || '📝';
            const priorityColor = priorityColors[item.priority] || '#2ECC71';
            const priorityClass = item.priority || 'low';
            
            html += `
                <div class="day-event-item priority-${priorityClass}" style="border-left-color: ${priorityColor};">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.2rem;">${icon}</span>
                        <strong>${item.title || 'Untitled Note'}</strong>
                        <span style="color: ${priorityColor}; font-weight: bold;">●</span>
                        ${item.isReminder ? '<span style="color: var(--warning-color);">🔔 Reminder</span>' : ''}
                    </div>
                    ${item.description ? `<div style="margin-bottom: 0.5rem; color: var(--text-secondary);">${item.description}</div>` : ''}
                    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.85rem;">
                        <span class="category-badge">${item.category || 'other'}</span>
                        ${item.repeatYearly ? '<span class="repeat-badge">🔄 Yearly</span>' : ''}
                        ${item.reminderTime ? `<span class="time-badge">⏰ ${item.reminderTime}</span>` : ''}
                    </div>
                </div>`;
        });
        html += `</div>`;
    }

    if (dateData.income.length === 0 && dateData.expenses.length === 0 && 
        dateData.bills.length === 0 && dateData.notes.length === 0 && dateData.holidays.length === 0) {
        html += `<div class="day-events-section">
            <p style="text-align: center; color: var(--text-secondary);">No events for this day</p>
        </div>`;
    }

    container.innerHTML = html;
    
    // Display daily summary after rendering day view
    displayDailySummary();
}

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */
async function getMonthData(year, month) {
    try {
        const daysInMonth = getDaysInBSMonth(year, month);
        const monthData = {
            income: [],
            expenses: [],
            notes: [],
            bills: [],
            holidays: []
        };

        // Collect data for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatBsDate(year, month, day);
            const dateData = await getDateData(dateStr);
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', dateStr);
            
            // Add data to month arrays
            monthData.income.push(...dateData.income);
            monthData.expenses.push(...dateData.expenses);
            monthData.notes.push(...dateData.notes);
            monthData.bills.push(...dateData.bills);
            monthData.holidays.push(...(holidays || []));
        }

        return monthData;
    } catch (error) {
        console.error('Error getting month data:', error);
        return {
            income: [],
            expenses: [],
            notes: [],
            bills: [],
            holidays: []
        };
    }
}

/**
 * ========================================
 * CALENDAR NAVIGATION
 * ========================================
 */
function goToToday() {
    const today = getCurrentNepaliDate();
    currentBsYear = today.year;
    currentBsMonth = today.month;
    currentBsDay = today.day;

    document.getElementById('yearSelect').value = currentBsYear;
    document.getElementById('monthSelect').value = currentBsMonth;

    if (currentCalendarView === 'month') {
        renderCalendar();
    } else if (currentCalendarView === 'week') {
        renderWeekView();
    } else if (currentCalendarView === 'day') {
        renderDayView();
    }

    updateMonthlySummary();
    updateAllCharts(currentBsYear, currentBsMonth);
}

function onYearMonthChange() {
    currentBsYear = parseInt(document.getElementById('yearSelect').value);
    currentBsMonth = parseInt(document.getElementById('monthSelect').value);
    // Rest of the code remains the same
    
    if (currentCalendarView === 'month') {
        renderCalendar();
    } else if (currentCalendarView === 'week') {
        renderWeekView();
    }
    
    updateMonthlySummary();
    updateAllCharts(currentBsYear, currentBsMonth);
}

function changeMonth(direction) {
    currentBsMonth += direction;
    
    if (currentBsMonth > 12) {
        currentBsMonth = 1;
        currentBsYear++;
    } else if (currentBsMonth < 1) {
        currentBsMonth = 12;
        currentBsYear--;
    }
    
    // Update UI elements
    document.getElementById('yearSelect').value = currentBsYear;
    document.getElementById('monthSelect').value = currentBsMonth;
    
    // Re-render calendar
    renderCalendar();
    updateMonthlySummary();
    updateAllCharts(currentBsYear, currentBsMonth);
}

function changeWeek(direction) {
    // Convert current BS date to AD
    const currentAd = bsToAd(currentBsYear, currentBsMonth, currentBsDay || 1);
    
    // Add/subtract 7 days
    currentAd.date.setDate(currentAd.date.getDate() + (direction * 7));
    
    // Convert back to BS
    const newBs = adToBs(currentAd.date.getFullYear(), currentAd.date.getMonth() + 1, currentAd.date.getDate());
    
    currentBsYear = newBs.year;
    currentBsMonth = newBs.month;
    currentBsDay = newBs.day;
    
    // Update UI elements
    document.getElementById('yearSelect').value = currentBsYear;
    document.getElementById('monthSelect').value = currentBsMonth;
    
    // Re-render week view
    renderWeekView();
    updateMonthlySummary();
    updateAllCharts(currentBsYear, currentBsMonth);
}

function changeDay(direction) {
    // Convert current BS date to AD
    const currentAd = bsToAd(currentBsYear, currentBsMonth, currentBsDay || 1);
    
    // Add/subtract 1 day
    currentAd.date.setDate(currentAd.date.getDate() + direction);
    
    // Convert back to BS
    const newBs = adToBs(currentAd.date.getFullYear(), currentAd.date.getMonth() + 1, currentAd.date.getDate());
    
    currentBsYear = newBs.year;
    currentBsMonth = newBs.month;
    currentBsDay = newBs.day;
    
    // Update UI elements
    document.getElementById('yearSelect').value = currentBsYear;
    document.getElementById('monthSelect').value = currentBsMonth;
    
    // Re-render day view
    renderDayView();
    updateMonthlySummary();
    updateAllCharts(currentBsYear, currentBsMonth);
}

function changeYear(direction) {
    currentBsYear += direction;
    
    // Update UI elements
    document.getElementById('yearSelect').value = currentBsYear;
    
    // Re-render year view
    renderYearView();
    updateMonthlySummary();
    updateAllCharts(currentBsYear, currentBsMonth);
}

function navigateCalendar(direction) {
    // Call appropriate navigation function based on current view
    switch (currentCalendarView) {
        case 'month':
            changeMonth(direction);
            break;
        case 'week':
            changeWeek(direction);
            break;
        case 'day':
            changeDay(direction);
            break;
        case 'year':
            changeYear(direction);
            break;
        default:
            // Default to month navigation
            changeMonth(direction);
            break;
    }
}

/**
 * ========================================
 * CALENDAR RENDERING - FIXED (SYNCHRONOUS)
 * ========================================
 */
function renderCalendar() {
    try {
        if (currentCalendarView !== 'month') return;

        const grid = document.getElementById('calendarGrid');
        if (!grid) {
            console.error('❌ Calendar grid not found!');
            return;
        }

        // Clear old cells (keep first 7 headers)
        while (grid.children.length > 7) {
            grid.removeChild(grid.lastChild);
        }

        const daysInMonth = getDaysInBSMonth(currentBsYear, currentBsMonth);
        const firstDayAd = bsToAd(currentBsYear, currentBsMonth, 1);
        const firstDayOfWeek = firstDayAd.date.getDay();

        // Add empty cells
        for (let i = 0; i < firstDayOfWeek; i++) {
            const cell = createCalendarCell(null, true);
            grid.appendChild(cell);
        }

        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = createCalendarCell(day, false);
            grid.appendChild(cell);
        }

        // Display monthly holidays after rendering calendar
        displayMonthlyHolidays();
        
        // Display monthly notes after rendering calendar
        displayMonthlyNotes();

        console.log('✅ Calendar rendered successfully');

    } catch (error) {
        console.error('❌ Calendar render error:', error);
    }
}

/**
 * Create calendar cell - NON-ASYNC (FIXED)
 */
function createCalendarCell(day, isEmpty) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';

    if (isEmpty) {
        cell.classList.add('other-month');
        return cell;
    }

    const bsDateStr = formatBsDate(currentBsYear, currentBsMonth, day);
    const adDate = bsToAd(currentBsYear, currentBsMonth, day);

    // Check if today
    const today = getCurrentNepaliDate();
    if (currentBsYear === today.year && currentBsMonth === today.month && day === today.day) {
        cell.classList.add('today');
    }

    // Check if Saturday (6 = Saturday in JavaScript getDay())
    if (adDate.date.getDay() === 6) {
        cell.classList.add('saturday');
    }

    // Date numbers
    const dateNumber = document.createElement('div');
    dateNumber.className = 'date-number';
    dateNumber.textContent = day;
    cell.appendChild(dateNumber);

    const dateAd = document.createElement('div');
    dateAd.className = 'date-ad';
    dateAd.textContent = `${adDate.month}/${adDate.day}`;
    cell.appendChild(dateAd);

    // Load async data separately
    loadCellData(cell, bsDateStr);

    // Click event
    cell.addEventListener('click', () => {
        const adDateStr = formatAdDate(adDate.year, adDate.month, adDate.day);
        openDateDrawer(bsDateStr, adDateStr);
    });

    return cell;
}

/**
 * Load cell data asynchronously (SEPARATE FUNCTION)
 */
async function loadCellData(cell, bsDateStr) {
    try {
        const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
        if (holidays && holidays.length > 0) {
            // Add holiday class to the cell
            cell.classList.add('holiday');
            
            const holidayLabel = document.createElement('div');
            holidayLabel.className = 'holiday-label';
            holidayLabel.textContent = holidays[0].name;
            cell.appendChild(holidayLabel);
        }

        const dateData = await getDateData(bsDateStr);
        const hasEvents = dateData.income.length > 0 || dateData.expenses.length > 0 || 
                          dateData.notes.length > 0 || dateData.bills.length > 0;

        if (hasEvents) {
            const indicator = document.createElement('div');
            indicator.className = 'event-indicator';
            
            // Count total event types to determine if we need smaller dots
            const eventTypes = [];
            if (dateData.income.length > 0) eventTypes.push('income');
            if (dateData.expenses.length > 0) eventTypes.push('expense');
            if (dateData.notes.length > 0) eventTypes.push('note');
            if (dateData.bills.length > 0) eventTypes.push('bill');
            
            // Add multiple-dots class if more than one event type
            if (eventTypes.length > 1) {
                indicator.classList.add('multiple-dots');
            }
            
            if (dateData.income.length > 0) {
                const dot = document.createElement('div');
                dot.className = 'event-dot income';
                indicator.appendChild(dot);
            }
            if (dateData.expenses.length > 0) {
                const dot = document.createElement('div');
                dot.className = 'event-dot expense';
                indicator.appendChild(dot);
            }
            if (dateData.notes.length > 0) {
                const dot = document.createElement('div');
                dot.className = 'event-dot note';
                indicator.appendChild(dot);
            }
            if (dateData.bills.length > 0) {
                const dot = document.createElement('div');
                dot.className = 'event-dot bill';
                indicator.appendChild(dot);
            }
            
            cell.appendChild(indicator);
        }
    } catch (error) {
        console.error('Error loading cell data:', error);
    }
}

/**
 * Get data for a specific date
 */
async function getDateData(bsDateStr) {
    try {
        const [year, month, day] = bsDateStr.split('/').map(Number);
        
        // Get all data for the date
        const allIncome = await enhancedIncomeDB.getAll();
        const allExpenses = await enhancedExpenseDB.getAll();
        const allNotes = await enhancedNoteDB.getAll();
        const allBills = await enhancedBillDB.getAll();
        
        // Filter by date
        const income = allIncome.filter(item => item.date_bs === bsDateStr);
        const expenses = allExpenses.filter(item => item.date_bs === bsDateStr);
        const notes = allNotes.filter(item => item.date_bs === bsDateStr);
        const bills = allBills.filter(item => item.dueDate === bsDateStr);
        
        return {
            income,
            expenses,
            notes,
            bills
        };
    } catch (error) {
        console.error('Error getting date data:', error);
        return {
            income: [],
            expenses: [],
            notes: [],
            bills: []
        };
    }
}

/**
 * Get data for a specific month
 */
async function getMonthData(year, month) {
    try {
        // Get all data
        const allIncome = await enhancedIncomeDB.getAll();
        const allExpenses = await enhancedExpenseDB.getAll();
        const allNotes = await enhancedNoteDB.getAll();
        const allBills = await enhancedBillDB.getAll();
        
        // Filter by month
        const income = allIncome.filter(item => {
            const [itemYear, itemMonth] = item.date_bs.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        const expenses = allExpenses.filter(item => {
            const [itemYear, itemMonth] = item.date_bs.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        const notes = allNotes.filter(item => {
            const [itemYear, itemMonth] = item.date_bs.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        const bills = allBills.filter(item => {
            const [itemYear, itemMonth] = item.dueDate.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        
        return {
            income,
            expenses,
            notes,
            bills
        };
    } catch (error) {
        console.error('Error getting month data:', error);
        return {
            income: [],
            expenses: [],
            notes: [],
            bills: []
        };
    }
}

/**
 * Get budget for a specific month
 */
async function getMonthBudget(year, month) {
    try {
        const allBudgets = await enhancedBudgetDB.getAll();
        return allBudgets.filter(budget => {
            const [budgetYear, budgetMonth] = budget.month.split('/').map(Number);
            return budgetYear === year && budgetMonth === month;
        });
    } catch (error) {
        console.error('Error getting month budget:', error);
        return [];
    }
}

/**
 * Get monthly transactions for charts
 */
async function getMonthlyTransactions(year, month) {
    try {
        const monthData = await getMonthData(year, month);
        return {
            income: monthData.income,
            expenses: monthData.expenses
        };
    } catch (error) {
        console.error('Error getting monthly transactions:', error);
        return {
            income: [],
            expenses: []
        };
    }
}

/**
 * ========================================
 * MONTHLY SUMMARY
 * ========================================
 */
async function updateMonthlySummary() {
    try {
        const monthData = await getMonthData(currentBsYear, currentBsMonth);
        const income = monthData.income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const expense = monthData.expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const savings = income - expense;

        const budgets = await getMonthBudget(currentBsYear, currentBsMonth);
        const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
        const budgetRemaining = totalBudget - expense;

        document.getElementById('monthlyIncome').textContent = `Rs. ${income.toLocaleString()}`;
        document.getElementById('monthlyExpense').textContent = `Rs. ${expense.toLocaleString()}`;
        document.getElementById('monthlySavings').textContent = `Rs. ${savings.toLocaleString()}`;
        document.getElementById('budgetRemaining').textContent = `Rs. ${budgetRemaining.toLocaleString()}`;
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

/**
 * ========================================
 * DATE DRAWER
 * ========================================
 */
async function openDateDrawer(bsDate, adDate) {
    try {
        selectedDate = bsDate;
        const drawer = document.getElementById('dateDrawer');
        const title = document.getElementById('drawerTitle');
        const body = document.getElementById('drawerBody');

        title.textContent = `${bsDate} (${adDate})`;

        const data = await getDateData(bsDate);

        const insurances = await enhancedInsuranceDB.getAll();
        const insuranceRenewals = insurances.filter(ins => ins.expiryDate === bsDate);

        const services = await enhancedVehicleServiceDB.getAll();
        const vehicleServices = services.filter(svc => svc.date === bsDate || svc.nextDue === bsDate);

        const subscriptions = await enhancedSubscriptionDB.getAll();
        const subRenewals = subscriptions.filter(sub => sub.renewalDate === bsDate);

        let html = `
            <div class="drawer-section">
                <h4>💰 Transactions</h4>
                <button class="btn-primary" onclick="showIncomeExpenseForm('income', '${bsDate}')">+ Income</button>
                <button class="btn-danger" onclick="showIncomeExpenseForm('expense', '${bsDate}')">+ Expense</button>
                <div style="margin-top: 1rem;">
        `;

        if (data.income.length > 0 || data.expenses.length > 0) {
            [...data.income.map(i => ({...i, type: 'income'})), ...data.expenses.map(e => ({...e, type: 'expense'}))].forEach(item => {
                const currencySymbol = getCurrencySymbol(item.currency || 'NPR');
                html += `
                    <div class="tracker-item ${item.type}" style="margin-bottom: 0.5rem;">
                        <div class="item-details">
                            <div class="item-category">${item.category}</div>
                            <div class="item-description">${item.description || ''}</div>
                        </div>
                        <div class="item-amount ${item.type}">${currencySymbol} ${parseFloat(item.amount).toLocaleString()}</div>
                        <div class="item-actions">
                            <button class="icon-btn" onclick='editTransaction("${item.type}", ${item.id})' title="Edit Transaction">✏️</button>
                            <button class="icon-btn" onclick="deleteTransaction('${item.type}', ${item.id})" title="Delete Transaction">🗑️</button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += '<p style="color: var(--text-secondary);">No transactions</p>';
        }

        html += `</div></div>`;

        if (data.bills.length > 0) {
            html += `<div class="drawer-section"><h4>💳 Bills Due</h4>`;
            data.bills.forEach(bill => {
                html += `
                    <div class="bill-item" style="margin-bottom: 0.5rem;">
                        <div class="bill-info">
                            <div class="bill-name">${bill.name}</div>
                        </div>
                        <div class="bill-amount">Rs. ${parseFloat(bill.amount).toLocaleString()}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (insuranceRenewals.length > 0) {
            html += `<div class="drawer-section"><h4>🛡️ Insurance Renewals</h4>`;
            insuranceRenewals.forEach(ins => {
                html += `<p>• ${ins.name} (${ins.provider})</p>`;
            });
            html += '</div>';
        }

        if (subRenewals.length > 0) {
            html += `<div class="drawer-section"><h4>📺 Subscription Renewals</h4>`;
            subRenewals.forEach(sub => {
                html += `<p>• ${sub.name} - Rs. ${parseFloat(sub.cost).toLocaleString()}</p>`;
            });
            html += '</div>';
        }

        if (vehicleServices.length > 0) {
            html += `<div class="drawer-section"><h4>🚗 Vehicle Services</h4>`;
            vehicleServices.forEach(svc => {
                html += `<p>• ${svc.type} - Rs. ${parseFloat(svc.cost).toLocaleString()}</p>`;
            });
            html += '</div>';
        }

        html += `
            <div class="drawer-section">
                <h4>📝 Notes</h4>
                <button class="btn-primary" onclick="showNoteForm('${bsDate}')">+ Note</button>
                <div style="margin-top: 1rem;">
        `;

        if (data.notes.length > 0) {
            data.notes.forEach(note => {
                // Get event type icon
                const eventIcons = {
                    birthday: '🎂',
                    anniversary: '💑',
                    meeting: '🤝',
                    appointment: '🏥',
                    deadline: '⏰',
                    celebration: '🎉',
                    travel: '✈️',
                    note: '📝'
                };
                
                // Get priority color
                const priorityColors = {
                    high: '#E74C3C',
                    medium: '#F39C12',
                    low: '#2ECC71'
                };
                
                const icon = eventIcons[note.eventType] || '📝';
                const priorityColor = priorityColors[note.priority] || '#2ECC71';
                const priorityClass = note.priority || 'low';
                
                html += `
                    <div class="note-item ${note.isReminder ? 'reminder' : ''} priority-${priorityClass}" style="margin-bottom: 0.5rem; border-left: 3px solid ${priorityColor};">
                        <div class="item-details">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                <span style="font-size: 1rem;">${icon}</span>
                                <strong>${note.title || 'Untitled Note'}</strong>
                                <span style="color: ${priorityColor}; font-size: 0.8rem;">●</span>
                                ${note.isReminder ? '<span style="color: var(--warning-color); font-size: 0.8rem;">🔔</span>' : ''}
                            </div>
                            ${note.description ? `<div class="item-description" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">${note.description}</div>` : ''}
                            <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.75rem;">
                                <span class="category-badge" style="background: var(--primary-color); color: white; padding: 0.2rem 0.4rem; border-radius: 3px;">${note.category || 'other'}</span>
                                ${note.repeatYearly ? '<span style="background: var(--secondary-color); color: white; padding: 0.2rem 0.4rem; border-radius: 3px;">🔄 Yearly</span>' : ''}
                                ${note.reminderTime ? `<span style="background: var(--info-color); color: white; padding: 0.2rem 0.4rem; border-radius: 3px;">⏰ ${note.reminderTime}</span>` : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.25rem;">
                            <button class="icon-btn" onclick="showNoteForm(${JSON.stringify(note).replace(/"/g, '&quot;')})" style="font-size: 1rem;">✏️</button>
                            <button class="icon-btn" onclick="deleteNote(${note.id})" style="font-size: 1rem;">🗑️</button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += '<p style="color: var(--text-secondary);">No notes</p>';
        }

        html += '</div></div>';

        body.innerHTML = html;
        drawer.classList.add('active');
    } catch (error) {
        console.error('Error opening drawer:', error);
    }
}

function closeDrawer() {
    document.getElementById('dateDrawer').classList.remove('active');
}

/**
 * ========================================
 * INCOME/EXPENSE FORMS
 * ========================================
 */
function showIncomeExpenseForm(type, date = null, existingTransaction = null) {
    const today = getCurrentNepaliDate();
    const defaultDate = date || formatBsDate(today.year, today.month, today.day);

// Rest of the code remains the same
    const html = `
        <h2>${existingTransaction ? 'Edit' : 'Add'} ${type === 'income' ? 'Income' : 'Expense'}</h2>
        <form id="transactionForm">
            <div class="form-group">
                <label>Date (BS)</label>
                <input type="text" id="transDate" value="${existingTransaction ? existingTransaction.date_bs : defaultDate}" required>
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="transCategory" required>
                    ${type === 'income' ? `
                        <option value="Salary" ${existingTransaction && existingTransaction.category === 'Salary' ? 'selected' : ''}>Salary</option>
                        <option value="Business" ${existingTransaction && existingTransaction.category === 'Business' ? 'selected' : ''}>Business</option>
                        <option value="Investment" ${existingTransaction && existingTransaction.category === 'Investment' ? 'selected' : ''}>Investment</option>
                        <option value="Freelance" ${existingTransaction && existingTransaction.category === 'Freelance' ? 'selected' : ''}>Freelance</option>
                        <option value="Other" ${existingTransaction && existingTransaction.category === 'Other' ? 'selected' : ''}>Other</option>
                    ` : `
                        <option value="Food" ${existingTransaction && existingTransaction.category === 'Food' ? 'selected' : ''}>Food</option>
                        <option value="Transport" ${existingTransaction && existingTransaction.category === 'Transport' ? 'selected' : ''}>Transport</option>
                        <option value="Shopping" ${existingTransaction && existingTransaction.category === 'Shopping' ? 'selected' : ''}>Shopping</option>
                        <option value="Bills" ${existingTransaction && existingTransaction.category === 'Bills' ? 'selected' : ''}>Bills</option>
                        <option value="Healthcare" ${existingTransaction && existingTransaction.category === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
                        <option value="Entertainment" ${existingTransaction && existingTransaction.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                        <option value="Education" ${existingTransaction && existingTransaction.category === 'Education' ? 'selected' : ''}>Education</option>
                        <option value="Other" ${existingTransaction && existingTransaction.category === 'Other' ? 'selected' : ''}>Other</option>
                    `}
                </select>
            </div>
            <div class="form-group">
                <label>Currency</label>
                <select id="transCurrency">
                    <option value="NPR" ${(!existingTransaction || existingTransaction.currency === 'NPR') ? 'selected' : ''}>NPR (रू)</option>
                    <option value="USD" ${existingTransaction && existingTransaction.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                    <option value="EUR" ${existingTransaction && existingTransaction.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                    <option value="INR" ${existingTransaction && existingTransaction.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" id="transAmount" step="0.01" value="${existingTransaction ? existingTransaction.amount : ''}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="transDescription">${existingTransaction ? existingTransaction.description : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">${existingTransaction ? 'Update' : 'Save'}</button>
            </div>
        </form>
    `;

    showModal(html);

    // Initialize Nepali date picker for transaction date
    setTimeout(() => {
        const dateInput = document.getElementById('transDate');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);

    document.getElementById('transactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            date_bs: document.getElementById('transDate').value,
            category: document.getElementById('transCategory').value,
            currency: document.getElementById('transCurrency').value,
            amount: parseFloat(document.getElementById('transAmount').value),
            description: document.getElementById('transDescription').value,
            createdAt: existingTransaction ? existingTransaction.createdAt : new Date().toISOString()
        };

        try {
            if (existingTransaction) {
                // Update existing transaction
                data.id = existingTransaction.id;
                if (type === 'income') {
                    await enhancedIncomeDB.update(data);
                } else {
                    await enhancedExpenseDB.update(data);
                }
                showNotification(`✅ ${type === 'income' ? 'Income' : 'Expense'} updated successfully!`, 'success');
            } else {
                // Add new transaction
                if (type === 'income') {
                    await enhancedIncomeDB.add(data);
                } else {
                    await enhancedExpenseDB.add(data);
                }
                showNotification(`✅ ${type === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
            }

            closeModal();
            renderCalendar();
            updateMonthlySummary();
            updateAllCharts(currentBsYear, currentBsMonth);
            if (currentView === 'tracker') renderTrackerList();
            if (currentView === 'budget') {
                await updateBudgetOverview(currentBsYear, currentBsMonth);
                await renderBudgetCategories(currentBsYear, currentBsMonth);
                await renderBudgetChart(currentBsYear, currentBsMonth);
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            showNotification('❌ Error saving transaction. Please try again.', 'error');
        }
    });
}

function getCurrencySymbol(currency) {
    const symbols = {
        NPR: 'रू',
        USD: '$',
        EUR: '€',
        INR: '₹'
    };
    return symbols[currency] || currency;
}

// Continue with remaining functions...
// Due to character limit, I'll provide the rest in separate files

/**
 * ========================================
 * PLACEHOLDER FUNCTIONS (Refer to other module files)
 * These are called from other modules
 * ========================================
 */

/**
 * ========================================
 * RECURRING TRANSACTIONS
 * ========================================
 */
function showRecurringForm(recurring = null) {
    const today = getCurrentNepaliDate();
    const defaultDate = formatBsDate(today.year, today.month, today.day);

    const html = `
        <h2>${recurring ? 'Edit' : 'Add'} Recurring Transaction</h2>
        <form id="recurringForm">
            <div class="form-group">
                <label>Type</label>
                <select id="recurringType" required>
                    <option value="income" ${recurring && recurring.type === 'income' ? 'selected' : ''}>Income</option>
                    <option value="expense" ${recurring && recurring.type === 'expense' ? 'selected' : ''}>Expense</option>
                </select>
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" id="recurringCategory" value="${recurring ? recurring.category : ''}" required>
            </div>
            <div class="form-group">
                <label>Amount (NPR)</label>
                <input type="number" id="recurringAmount" value="${recurring ? recurring.amount : ''}" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" id="recurringDescription" value="${recurring ? recurring.description : ''}">
            </div>
            <div class="form-group">
                <label>Frequency</label>
                <select id="recurringFrequency" required>
                    <option value="daily" ${recurring && recurring.frequency === 'daily' ? 'selected' : ''}>Daily</option>
                    <option value="weekly" ${recurring && recurring.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                    <option value="monthly" ${recurring && recurring.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                    <option value="yearly" ${recurring && recurring.frequency === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
            </div>
            <div class="form-group">
                <label>Start Date (BS)</label>
                <input type="text" id="recurringStartDate" value="${recurring ? recurring.startDate : defaultDate}" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="recurringActive" ${!recurring || recurring.isActive ? 'checked' : ''}>
                    <span>Active</span>
                </label>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
            </div>
        </form>
    `;

    showModal(html);
    
    // Initialize Nepali date picker for recurring start date
    setTimeout(() => {
        const dateInput = document.getElementById('recurringStartDate');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);

    document.getElementById('recurringForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            type: document.getElementById('recurringType').value,
            category: document.getElementById('recurringCategory').value,
            amount: parseFloat(document.getElementById('recurringAmount').value),
            description: document.getElementById('recurringDescription').value,
            frequency: document.getElementById('recurringFrequency').value,
            startDate: document.getElementById('recurringStartDate').value,
            isActive: document.getElementById('recurringActive').checked,
            lastProcessed: recurring ? recurring.lastProcessed : null,
            createdAt: recurring ? recurring.createdAt : new Date().toISOString()
        };

        try {
            if (recurring) {
                data.id = recurring.id;
                await enhancedRecurringDB.update(data);
            } else {
                await enhancedRecurringDB.add(data);
            }

            closeModal();
            if (currentView === 'tracker') renderRecurringList();
            alert('Recurring transaction saved!');
        } catch (error) {
            console.error('Error saving recurring transaction:', error);
            alert('Error saving recurring transaction.');
        }
    });
}

async function renderRecurringList() {
    const container = document.getElementById('recurringList');
    const recurring = await enhancedRecurringDB.getAll();

    if (recurring.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No recurring transactions</p>';
        return;
    }

    container.innerHTML = recurring.map(item => `
        <div class="tracker-item ${item.type}" style="margin-bottom: 0.5rem;">
            <div class="item-details">
                <div class="item-category">${item.category} <span class="recurring-badge">🔄 ${item.frequency}</span></div>
                <div class="item-description">${item.description || ''}</div>
                <div class="item-date">Started: ${item.startDate} | ${item.isActive ? '✅ Active' : '⏸ Inactive'}</div>
            </div>
            <div class="item-amount ${item.type}">Rs. ${parseFloat(item.amount).toLocaleString()}</div>
            <div class="item-actions">
                <button class="icon-btn" onclick='showRecurringForm(${JSON.stringify(item).replace(/'/g, "&apos;")})'>✏️</button>
                <button class="icon-btn" onclick="deleteRecurring(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function deleteRecurring(id) {
    if (!confirm('Delete this recurring transaction?')) return;
    try {
        await enhancedRecurringDB.delete(id);
        renderRecurringList();
    } catch (error) {
        console.error('Error deleting recurring:', error);
    }
}

async function processRecurringTransactions() {
    const recurring = await enhancedRecurringDB.getAll();
    const today = getCurrentNepaliDate();
    const todayStr = formatBsDate(today.year, today.month, today.day);

    for (const item of recurring) {
        if (!item.isActive) continue;

        const lastProcessed = item.lastProcessed || item.startDate;
        const shouldProcess = shouldProcessRecurring(lastProcessed, item.frequency, todayStr);

        if (shouldProcess) {
            const transData = {
                date_bs: todayStr,
                category: item.category,
                amount: item.amount,
                currency: 'NPR',
                description: `${item.description} (Recurring)`,
                source: 'recurring',
                createdAt: new Date().toISOString()
            };

            if (item.type === 'income') {
                await enhancedIncomeDB.add(transData);
            } else {
                await enhancedExpenseDB.add(transData);
            }

            item.lastProcessed = todayStr;
            await enhancedRecurringDB.update(item);
        }
    }
}

/**
 * Helper function to determine if recurring transaction should be processed
 */
function shouldProcessRecurring(lastDate, frequency, currentDate) {
    const [lastY, lastM, lastD] = lastDate.split('/').map(Number);
    const [currY, currM, currD] = currentDate.split('/').map(Number);

    switch(frequency) {
        case 'daily':
            return currentDate !== lastDate;
        case 'weekly':
            const lastAd = bsToAd(lastY, lastM, lastD);
            const currAd = bsToAd(currY, currM, currD);
            const daysDiff = Math.floor((currAd.date - lastAd.date) / (1000 * 60 * 60 * 24));
            return daysDiff >= 7;
        case 'monthly':
            return currM !== lastM || currY !== lastY;
        case 'yearly':
            return currY !== lastY;
        default:
            return false;
    }
}

/**
 * ========================================
 * SMS PARSER INTEGRATION
 * ========================================
 */
async function processPendingSMSTransactions() {
    try {
        // Show initial toast
        showNotification('🔄 Checking for SMS transactions...', 'info');
        
        // First, collect all transactions from localStorage (pending)
        const pendingTransactions = JSON.parse(localStorage.getItem('pendingTrackerTransactions') || '[]');
        
        // Debug: Log what we found
        console.log('📱 SMS Processing - Pending from localStorage:', pendingTransactions.length);
        showNotification(`📱 Found ${pendingTransactions.length} pending transactions in localStorage`, 'info');
        
        // Then, collect all transactions from SMS parser IndexedDB
        let smsParserTransactions = [];
        
        try {
            // Try to access SMS parser's IndexedDB
            const smsParserDB = await openSMSParserDB();
            if (smsParserDB) {
                const allSmsTransactions = await smsParserDB.getAll('transactions');
                smsParserTransactions = allSmsTransactions || [];
                console.log(`📱 Found ${smsParserTransactions.length} transactions in SMS parser IndexedDB`);
                showNotification(`📱 Found ${smsParserTransactions.length} transactions in SMS parser database`, 'info');
            } else {
                console.log('📱 SMS parser IndexedDB not accessible');
                showNotification('📱 SMS parser database not accessible', 'warning');
            }
        } catch (error) {
            console.warn('Could not access SMS parser IndexedDB:', error);
            showNotification('⚠️ Could not access SMS parser database', 'warning');
        }
        
        // Combine all transactions
        const allTransactions = [...pendingTransactions, ...smsParserTransactions];
        
        if (allTransactions.length === 0) {
            showNotification('📱 No SMS transactions found to import', 'warning');
            return;
        }
        
        console.log(`📱 Processing ${allTransactions.length} total SMS transactions (${pendingTransactions.length} from localStorage, ${smsParserTransactions.length} from IndexedDB)`);
        showNotification(`📱 Processing ${allTransactions.length} total SMS transactions...`, 'info');
        
        // Show preview before importing
        const shouldImport = await showSMSImportPreview(allTransactions);
        if (!shouldImport) {
            return;
        }
        
        // Get existing transactions to check for duplicates
        const existingIncome = await incomeDB.getAll();
        const existingExpenses = await expenseDB.getAll();
        const existingTransactions = [...existingIncome, ...existingExpenses];
        
        // Create a set of existing transaction signatures for duplicate checking
        const existingSignatures = new Set();
        existingTransactions.forEach(txn => {
            const signature = createTransactionSignature(txn);
            existingSignatures.add(signature);
        });
        
        let processedCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        
        for (const transaction of allTransactions) {
            try {
                // Convert SMS parser transaction to tracker format
                const trackerData = await convertSMSTransactionToTracker(transaction);
                
                if (!trackerData) {
                    errorCount++;
                    continue;
                }
                
                // Check for duplicates
                const transactionSignature = createTransactionSignature(trackerData);
                if (existingSignatures.has(transactionSignature)) {
                    duplicateCount++;
                    continue;
                }
                
                // Add to existing signatures to avoid duplicates within this batch
                existingSignatures.add(transactionSignature);
                
                // Determine if income or expense
                const isIncome = await determineTransactionType(trackerData);
                
                if (isIncome) {
                    await incomeDB.add(trackerData);
                    console.log('Added to income DB:', trackerData);
                } else {
                    await expenseDB.add(trackerData);
                    console.log('Added to expense DB:', trackerData);
                }
                
                processedCount++;
                
            } catch (error) {
                console.error('Error processing SMS transaction:', error, transaction);
                errorCount++;
            }
        }
        
        // Clear processed transactions from localStorage
        localStorage.removeItem('pendingTrackerTransactions');
        
        // Update SMS process button state
        updateSMSProcessButton();
        
        // Show results
        if (processedCount > 0) {
            showNotification(`📊 Successfully imported ${processedCount} new transactions from SMS parser`, 'success');
            
            // Update UI if we're on the tracker view
            if (currentView === 'tracker') {
                renderTrackerList();
            }
            
            // Update calendar to reflect new transactions
            renderCalendar();
            
            // Update monthly summary and charts
            updateMonthlySummary();
            updateAllCharts(currentBsYear, currentBsMonth);
        }
        
        if (duplicateCount > 0) {
            showNotification(`⚠️ Skipped ${duplicateCount} duplicate transactions`, 'warning');
        }
        
        if (errorCount > 0) {
            console.warn(`⚠️ Failed to process ${errorCount} SMS transactions`);
            showNotification(`⚠️ Failed to process ${errorCount} SMS transactions`, 'error');
        }
        
        if (processedCount === 0 && duplicateCount === 0 && errorCount === 0) {
            showNotification('📱 No new transactions to import', 'info');
        }
        
    } catch (error) {
        console.error('Error processing pending SMS transactions:', error);
        showNotification('Error processing SMS transactions', 'error');
    }
}

// Helper function to open SMS parser IndexedDB
async function openSMSParserDB() {
    try {
        // Try to open the SMS parser's IndexedDB
        const request = indexedDB.open('SMSParserDB', 1);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                reject(new Error('Failed to open SMS parser database'));
            };
            
            request.onupgradeneeded = (event) => {
                reject(new Error('SMS parser database not found'));
            };
        });
    } catch (error) {
        return null;
    }
}

// Helper function to convert SMS transaction to tracker format
async function convertSMSTransactionToTracker(smsTransaction) {
    try {
        // Handle both localStorage format and IndexedDB format
        let transactionData;
        
        if (smsTransaction.date_bs) {
            // Already in tracker format (from localStorage)
            transactionData = smsTransaction;
        } else {
            // SMS parser IndexedDB format - convert to tracker format
            transactionData = {
                date_bs: convertToBSDate(smsTransaction.date),
                category: mapBankTransactionToCategory(smsTransaction),
                currency: smsTransaction.currency || 'NPR',
                amount: smsTransaction.amount,
                description: `${smsTransaction.bank || 'Unknown'}: ${smsTransaction.remarks || 'Bank Transaction'}`,
                source: 'sms_parser',
                sourceId: smsTransaction.id,
                bank: smsTransaction.bank,
                account: smsTransaction.account,
                createdAt: smsTransaction.createdAt || new Date().toISOString()
            };
        }
        
        return transactionData;
    } catch (error) {
        console.error('Error converting SMS transaction:', error);
        return null;
    }
}

// Helper function to convert date to BS format
function convertToBSDate(isoDate) {
    try {
        const date = new Date(isoDate);
        
        // Check if adToBs function is available
        if (typeof adToBs === 'function') {
            const bsDate = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            return `${bsDate.year}/${String(bsDate.month).padStart(2, '0')}/${String(bsDate.day).padStart(2, '0')}`;
        } else {
            // Fallback: Simple conversion
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        }
    } catch (error) {
        // Fallback to today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }
}

// Helper function to map bank transaction to category
function mapBankTransactionToCategory(transaction) {
    const remarks = String(transaction.remarks || '').toLowerCase();
    const bank = String(transaction.bank || '').toLowerCase();
    
    // Income categories
    if (transaction.type === 'credit') {
        if (remarks.includes('salary') || remarks.includes('payroll')) return 'Salary';
        if (remarks.includes('bonus') || remarks.includes('reward')) return 'Other';
        if (remarks.includes('refund') || remarks.includes('return')) return 'Other';
        if (remarks.includes('transfer') || remarks.includes('received')) return 'Business';
        if (bank.includes('esewa') || bank.includes('khalti')) return 'Business';
        return 'Other';
    }
    
    // Expense categories
    if (transaction.type === 'debit') {
        // Food & Dining
        if (remarks.includes('restaurant') || remarks.includes('food') || remarks.includes('meal') || 
            remarks.includes('coffee') || remarks.includes('bhatbhateni') || remarks.includes('mart')) {
            return 'Food';
        }
        
        // Transport
        if (remarks.includes('petrol') || remarks.includes('fuel') || remarks.includes('parking') || 
            remarks.includes('taxi') || remarks.includes('uber') || remarks.includes('pathao') || 
            remarks.includes('transport') || remarks.includes('travel')) {
            return 'Transport';
        }
        
        // Shopping
        if (remarks.includes('shopping') || remarks.includes('purchase') || remarks.includes('retail') || 
            remarks.includes('store') || remarks.includes('mall') || remarks.includes('daraz') || 
            remarks.includes('sastodeal') || remarks.includes('hamro')) {
            return 'Shopping';
        }
        
        // Bills & Utilities
        if (remarks.includes('bill') || remarks.includes('electricity') || remarks.includes('water') || 
            remarks.includes('internet') || remarks.includes('phone') || remarks.includes('recharge') || 
            remarks.includes('subscription')) {
            return 'Bills';
        }
        
        // Healthcare
        if (remarks.includes('hospital') || remarks.includes('medical') || remarks.includes('pharmacy') || 
            remarks.includes('health') || remarks.includes('medicine')) {
            return 'Healthcare';
        }
        
        // Education
        if (remarks.includes('school') || remarks.includes('college') || remarks.includes('education') || 
            remarks.includes('course') || remarks.includes('fee')) {
            return 'Education';
        }
        
        // Entertainment
        if (remarks.includes('movie') || remarks.includes('cinema') || remarks.includes('game') || 
            remarks.includes('entertainment') || remarks.includes('subscription')) {
            return 'Entertainment';
        }
        
        // Default to Other for unrecognized expenses
        return 'Other';
    }
    
    return 'Other';
}

// Helper function to determine transaction type
async function determineTransactionType(trackerData) {
    const category = trackerData.category;
    const description = trackerData.description.toLowerCase();
    
    // Income categories
    const incomeCategories = ['Salary', 'Business', 'Investment', 'Freelance', 'Other'];
    return incomeCategories.includes(category) || description.includes('credit');
}

// Helper function to create transaction signature for duplicate checking
function createTransactionSignature(transaction) {
    return `${transaction.date_bs}-${transaction.amount}-${transaction.description}-${transaction.category}`;
}

// Helper function to show import preview
async function showSMSImportPreview(transactions) {
    return new Promise((resolve) => {
        // Create preview modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const previewContent = document.createElement('div');
        previewContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            width: 90%;
        `;
        
        const transactionList = transactions.slice(0, 10).map(t => {
            const date = t.date_bs || new Date(t.date).toLocaleDateString();
            const amount = t.amount ? `Rs. ${t.amount.toLocaleString()}` : 'N/A';
            const description = t.description || t.remarks || 'No description';
            const type = t.type === 'credit' ? 'Income' : 'Expense';
            
            return `
                <div style="border-bottom: 1px solid #eee; padding: 0.5rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${date}</strong> - ${description}
                            <div style="color: #666; font-size: 0.9rem;">${t.bank || 'Unknown Bank'}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold; color: ${t.type === 'credit' ? 'green' : 'red'}">
                                ${amount}
                            </div>
                            <div style="color: #666; font-size: 0.8rem;">${type}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        previewContent.innerHTML = `
            <h2>📱 SMS Transaction Import Preview</h2>
            <p>Found <strong>${transactions.length}</strong> transactions from SMS parser</p>
            ${transactions.length > 10 ? `<p>Showing first 10 transactions of ${transactions.length}</p>` : ''}
            <div style="margin: 1rem 0;">
                ${transactionList}
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                <button id="cancelImport" style="padding: 0.5rem 1rem; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">
                    Cancel
                </button>
                <button id="confirmImport" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Import All Transactions
                </button>
            </div>
        `;
        
        modal.appendChild(previewContent);
        document.body.appendChild(modal);
        
        // Handle button clicks
        document.getElementById('cancelImport').onclick = () => {
            document.body.removeChild(modal);
            resolve(false);
        };
        
        document.getElementById('confirmImport').onclick = () => {
            document.body.removeChild(modal);
            resolve(true);
        };
        
        // Close modal on background click
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resolve(false);
            }
        };
    });
}

/**
 * ========================================
 * TRACKER LIST
 * ========================================
 */
async function renderTrackerList() {
    const list = document.getElementById('trackerList');
    const filterElement = document.getElementById('trackerFilter');
    const currencyElement = document.getElementById('currencyFilter');
    
    if (!list) {
        console.warn('Tracker list element not found');
        return;
    }
    
    const filter = filterElement ? filterElement.value : 'all';
    const currencyFilter = currencyElement ? currencyElement.value : 'NPR';

    const allIncome = await incomeDB.getAll();
    const allExpenses = await expenseDB.getAll();

    let items = [];
    if (filter === 'all' || filter === 'income') {
        items = items.concat(allIncome.map(item => ({ ...item, type: 'income' })));
    }
    if (filter === 'all' || filter === 'expense') {
        items = items.concat(allExpenses.map(item => ({ ...item, type: 'expense' })));
    }

    // Filter by currency
    if (currencyFilter !== 'NPR') {
        items = items.filter(item => item.currency === currencyFilter);
    }

    // Sort by date (newest first)
    items.sort((a, b) => b.date_bs.localeCompare(a.date_bs));

    if (items.length === 0) {
        list.innerHTML = '<div class="loading">No transactions found</div>';
        return;
    }

    list.innerHTML = items.map(item => {
        const currencySymbol = getCurrencySymbol(item.currency || 'NPR');
        const amountInNPR = convertCurrency(parseFloat(item.amount), item.currency || 'NPR', 'NPR');
        
        return `
            <div class="tracker-item ${item.type}">
                <div class="item-details">
                    <div class="item-category">${item.category}</div>
                    <div class="item-description">${item.description || ''}</div>
                    <div class="item-date">${item.date_bs}</div>
                </div>
                <div>
                    <div class="item-amount ${item.type}">
                        ${currencySymbol} ${parseFloat(item.amount).toLocaleString()}
                        ${item.currency !== 'NPR' ? `<span class="currency-badge">≈ रू ${amountInNPR.toLocaleString()}</span>` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick='editTransaction("${item.type}", ${item.id})' title="Edit Transaction">✏️</button>
                    <button class="icon-btn" onclick="deleteTransaction('${item.type}', ${item.id})" title="Delete Transaction">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

async function deleteTransaction(type, id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
        if (type === 'income') {
            await incomeDB.delete(id);
        } else {
            await expenseDB.delete(id);
        }

        renderTrackerList();
        renderCalendar();
        updateMonthlySummary();
        updateAllCharts(currentBsYear, currentBsMonth);
        if (currentView === 'budget') {
            await updateBudgetOverview(currentBsYear, currentBsMonth);
            await renderBudgetCategories(currentBsYear, currentBsMonth);
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction.');
    }
}

async function editTransaction(type, id) {
    try {
        // Get the transaction from the appropriate database
        let transaction;
        if (type === 'income') {
            transaction = await incomeDB.get(id);
        } else {
            transaction = await expenseDB.get(id);
        }
        
        if (!transaction) {
            showNotification('❌ Transaction not found', 'error');
            return;
        }
        
        // Show the form with the transaction data
        showIncomeExpenseForm(type, transaction.date_bs, transaction);
        
    } catch (error) {
        console.error('Error editing transaction:', error);
        showNotification('❌ Error loading transaction for editing', 'error');
    }
}

async function exportTransactions() {
    const allIncome = await incomeDB.getAll();
    const allExpenses = await expenseDB.getAll();

    const csv = [
        ['Type', 'Date (BS)', 'Category', 'Description', 'Amount', 'Currency'],
        ...allIncome.map(item => ['Income', item.date_bs, item.category, item.description, item.amount, item.currency || 'NPR']),
        ...allExpenses.map(item => ['Expense', item.date_bs, item.category, item.description, item.amount, item.currency || 'NPR'])
    ].map(row => row.join(',')).join('\n');

    downloadFile(csv, 'transactions.csv', 'text/csv');
}

/**
 * ========================================
 * SHOPPING LIST
 * ========================================
 */
function showShoppingForm(item = null) {
    const html = `
        <h2>${item ? 'Edit' : 'Add'} Shopping Item</h2>
        <form id="shoppingForm">
            <div class="form-group">
                <label>Item Name</label>
                <input type="text" id="itemName" value="${item ? item.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="text" id="itemQuantity" value="${item ? item.quantity : ''}">
            </div>
            <div class="form-group">
                <label>Expected Price (Rs.)</label>
                <input type="number" id="itemPrice" step="0.01" value="${item ? item.expectedPrice : ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
            </div>
        </form>
    `;

    showModal(html);

    document.getElementById('shoppingForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('itemName').value,
            quantity: document.getElementById('itemQuantity').value,
            expectedPrice: parseFloat(document.getElementById('itemPrice').value) || 0,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            if (item) {
                data.id = item.id;
                await shoppingDB.update(data);
            } else {
                await shoppingDB.add(data);
            }

            closeModal();
            renderShoppingList();
            alert('Shopping item saved!');
        } catch (error) {
            console.error('Error saving shopping item:', error);
            alert('Error saving item.');
        }
    });
}

async function renderShoppingList() {
    const list = document.getElementById('shoppingList');
    const activeFilter = document.querySelector('#shoppingView .filter-btn.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'pending';

    const allItems = await shoppingDB.getAll();
    let items = allItems;

    if (filter !== 'all') {
        items = allItems.filter(item => item.status === filter);
    }

    if (items.length === 0) {
        list.innerHTML = '<div class="loading">No items found</div>';
        return;
    }

    list.innerHTML = items.map(item => `
        <div class="shopping-item ${item.status}">
            <input type="checkbox" class="checkbox-custom" ${item.status === 'purchased' ? 'checked' : ''} 
                   onchange="toggleShoppingStatus(${item.id}, this.checked)">
            <div class="item-details" style="flex: 1;">
                <div class="item-description">${item.name}</div>
                <div class="item-date">Qty: ${item.quantity || 'N/A'} | Expected: Rs. ${item.expectedPrice.toLocaleString()}</div>
                ${item.actualPrice ? `<div class="item-date">Actual: Rs. ${item.actualPrice.toLocaleString()}</div>` : ''}
            </div>
            <div class="item-actions">
                <button class="icon-btn" onclick='showShoppingForm(${JSON.stringify(item).replace(/'/g, "&apos;")})'>✏️</button>
                <button class="icon-btn" onclick="deleteShoppingItem(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function toggleShoppingStatus(id, isPurchased) {
    const item = await shoppingDB.get(id);

    if (isPurchased) {
        const actualPrice = prompt('Enter actual purchase price (Rs.):', item.expectedPrice);
        if (actualPrice === null) {
            renderShoppingList();
            return;
        }

        item.status = 'purchased';
        item.actualPrice = parseFloat(actualPrice) || item.expectedPrice;
        item.purchasedAt = new Date().toISOString();

        const today = getCurrentNepaliDate();
        await expenseDB.add({
            date_bs: formatBsDate(today.year, today.month, today.day),
            category: 'Shopping',
            amount: item.actualPrice,
            currency: 'NPR',
            description: `Purchased: ${item.name}`,
            source: 'shopping_list',
            createdAt: new Date().toISOString()
        });

    } else {
        item.status = 'pending';
        delete item.actualPrice;
        delete item.purchasedAt;
    }

    await shoppingDB.update(item);
    renderShoppingList();
    updateMonthlySummary();
    renderCalendar();
}

async function deleteShoppingItem(id) {
    if (!confirm('Delete this item?')) return;

    try {
        await shoppingDB.delete(id);
        renderShoppingList();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}


/**
 * ========================================
 * HOLIDAYS
 * ========================================
 */
function showHolidayForm(holiday = null) {
    const html = `
        <h2>${holiday ? 'Edit' : 'Add'} Holiday</h2>
        <form id="holidayForm">
            <div class="form-group">
                <label>Date (BS)</label>
                <input type="text" id="holidayDateBs" value="${holiday ? holiday.date_bs : ''}" required>
            </div>
            <div class="form-group">
                <label>Date (AD)</label>
                <input type="date" id="holidayDateAd" value="${holiday ? holiday.date_ad : ''}" required>
            </div>
            <div class="form-group">
                <label>Holiday Name</label>
                <input type="text" id="holidayName" value="${holiday ? holiday.name : ''}" required>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select id="holidayType">
                    <option value="public" ${holiday && holiday.type === 'public' ? 'selected' : ''}>Public</option>
                    <option value="festival" ${holiday && holiday.type === 'festival' ? 'selected' : ''}>Festival</option>
                    <option value="other" ${holiday && holiday.type === 'other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
            </div>
        </form>
    `;

    showModal(html);

    document.getElementById('holidayForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            date_bs: document.getElementById('holidayDateBs').value,
            date_ad: document.getElementById('holidayDateAd').value,
            name: document.getElementById('holidayName').value,
            type: document.getElementById('holidayType').value
        };

        try {
            if (holiday) {
                data.id = holiday.id;
                await holidayDB.update(data);
            } else {
                await holidayDB.add(data);
            }

            closeModal();
            renderHolidayList();
            renderCalendar();
            alert('Holiday saved!');
        } catch (error) {
            console.error('Error saving holiday:', error);
            alert('Error saving holiday.');
        }
    });
}

async function renderHolidayList() {
    const list = document.getElementById('holidayList');
    const holidays = await enhancedHolidayDB.getAll();

    if (holidays.length === 0) {
        list.innerHTML = '<p style="color: var(--text-secondary);">No holidays</p>';
        return;
    }

    list.innerHTML = holidays.sort((a, b) => a.date_bs.localeCompare(b.date_bs)).map(holiday => `
        <div class="holiday-item">
            <div>
                <strong>${holiday.name}</strong><br>
                <small>${holiday.date_bs} (${holiday.date_ad})</small>
            </div>
            <div>
                <button class="icon-btn" onclick='showHolidayForm(${JSON.stringify(holiday).replace(/'/g, "&apos;")})'>✏️</button>
                <button class="icon-btn" onclick="deleteHoliday(${holiday.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function deleteHoliday(id) {
    if (!confirm('Delete this holiday?')) return;

    try {
        await enhancedHolidayDB.delete(id);
        renderHolidayList();
        renderCalendar();
    } catch (error) {
        console.error('Error deleting holiday:', error);
    }
}

async function importHolidaysCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());
            
            const dataLines = lines[0].includes('date_bs') ? lines.slice(1) : lines;

            let count = 0;
            for (const line of dataLines) {
                const [date_bs, date_ad, name, type] = line.split(',').map(s => s.trim());
                if (date_bs && date_ad && name) {
                    await holidayDB.add({
                        date_bs,
                        date_ad,
                        name,
                        type: type || 'public'
                    });
                    count++;
                }
            }

            alert(`${count} holidays imported successfully!`);
            renderHolidayList();
            renderCalendar();
        } catch (error) {
            console.error('CSV import error:', error);
            alert('Error importing CSV. Please check the format.');
        }
    };

    reader.readAsText(file);
    event.target.value = '';
}

// Settings
function toggleDarkMode(e) {
    if (e.target.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

function updateDefaultCurrency(e) {
    defaultCurrency = e.target.value;
    localStorage.setItem('defaultCurrency', defaultCurrency);
    alert('Currency updated!');
}

// Helper function to format date for filename
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Excel file reader function
async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Get the first worksheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                
                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // Determine module type based on file content or name
                const fileName = file.name.toLowerCase();
                let moduleType = 'unknown';
                let processedData = {};
                
                if (fileName.includes('insurance') || jsonData.some(row => row.policyNumber || row.company)) {
                    moduleType = 'insurance';
                    processedData = {
                        type: 'insurance',
                        insurance: jsonData.map(row => ({
                            name: row.name || row.policyName || '',
                            policyNumber: row.policyNumber || row.policyNo || '',
                            company: row.company || row.provider || '',
                            type: row.type || 'other',
                            coverage: parseFloat(row.coverage) || 0,
                            premium: parseFloat(row.premium) || 0,
                            frequency: row.frequency || 'yearly',
                            startDate: row.startDate || '',
                            expiryDate: row.expiryDate || '',
                            beneficiary: row.beneficiary || '',
                            status: row.status || 'active',
                            notes: row.notes || '',
                            createdAt: new Date().toISOString()
                        }))
                    };
                } else if (fileName.includes('vehicle') || jsonData.some(row => row.make || row.model)) {
                    moduleType = 'vehicle';
                    processedData = {
                        type: 'vehicle',
                        vehicles: jsonData.map(row => ({
                            make: row.make || '',
                            model: row.model || '',
                            year: parseInt(row.year) || new Date().getFullYear(),
                            licensePlate: row.licensePlate || row.plate || '',
                            type: row.type || 'car',
                            mileage: parseInt(row.mileage) || 0,
                            fuelType: row.fuelType || 'petrol',
                            status: row.status || 'active',
                            notes: row.notes || '',
                            createdAt: new Date().toISOString()
                        }))
                    };
                } else if (fileName.includes('subscription') || jsonData.some(row => row.renewalDate || row.cost)) {
                    moduleType = 'subscription';
                    processedData = {
                        type: 'subscription',
                        subscriptions: jsonData.map(row => ({
                            name: row.name || '',
                            category: row.category || 'other',
                            cost: parseFloat(row.cost) || parseFloat(row.amount) || 0,
                            frequency: row.frequency || 'monthly',
                            renewalDate: row.renewalDate || row.dueDate || '',
                            status: row.status || 'active',
                            notes: row.notes || '',
                            createdAt: new Date().toISOString()
                        }))
                    };
                } else if (fileName.includes('goal') || jsonData.some(row => row.targetAmount)) {
                    moduleType = 'goals';
                    processedData = {
                        type: 'goals',
                        goals: jsonData.map(row => ({
                            name: row.name || '',
                            targetAmount: parseFloat(row.targetAmount) || 0,
                            currentAmount: parseFloat(row.currentAmount) || 0,
                            deadline: row.deadline || '',
                            category: row.category || 'other',
                            priority: row.priority || 'medium',
                            status: row.status || 'active',
                            notes: row.notes || '',
                            createdAt: new Date().toISOString()
                        }))
                    };
                } else {
                    // Default to generic data structure
                    processedData = {
                        type: 'generic',
                        data: jsonData
                    };
                }
                
                resolve(processedData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// Data Management - Replaced by import-export.js system
// Generic Import Function for Individual Modules
async function importData(module, format, fileInput) {
    console.log('🐛 DEBUG: importData called', { module, format, fileInput });
    
    try {
        const file = fileInput.files[0];
        if (!file) {
            console.error('🐛 DEBUG: No file selected');
            return;
        }
        
        console.log('🐛 DEBUG: File selected', { 
            name: file.name, 
            size: file.size, 
            type: file.type,
            lastModified: file.lastModified 
        });
        
        showNotification(`📥 Reading ${module} data...`, 'info');
        
        if (format === 'json') {
            console.log('🐛 DEBUG: Processing JSON file');
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    console.log('🐛 DEBUG: FileReader loaded, parsing JSON');
                    const importData = JSON.parse(e.target.result);
                    console.log('🐛 DEBUG: JSON parsed successfully', { 
                        dataType: typeof importData,
                        keys: Object.keys(importData),
                        hasInsurance: !!importData.insurance,
                        insuranceLength: importData.insurance ? importData.insurance.length : 0,
                        fullData: importData
                    });
                    
                    // Show preview before importing
                    console.log('🐛 DEBUG: Showing import preview');
                    const confirmed = await showImportPreview(importData, module);
                    console.log('🐛 DEBUG: Preview confirmed', confirmed);
                    if (!confirmed) {
                        console.log('🐛 DEBUG: Import cancelled by user');
                        return;
                    }
                    
                    showNotification(`🔄 Importing ${module} data...`, 'info');
                    
                    // Process import based on module
                    console.log('🐛 DEBUG: Processing import for module', module);
                    switch(module) {
                        case 'insurance':
                            console.log('🐛 DEBUG: Calling processInsuranceImport');
                            await processInsuranceImport(importData);
                            console.log('🐛 DEBUG: processInsuranceImport completed');
                            break;
                        case 'vehicle':
                            console.log('🐛 DEBUG: Calling processVehicleImport');
                            await processVehicleImport(importData);
                            break;
                        case 'subscription':
                            console.log('🐛 DEBUG: Calling processSubscriptionImport');
                            await processSubscriptionImport(importData);
                            break;
                        case 'goals':
                            console.log('🐛 DEBUG: Calling processGoalsImport');
                            await processGoalsImport(importData);
                            break;
                        case 'custom':
                            console.log('🐛 DEBUG: Calling processCustomImport');
                            await processCustomImport(importData);
                            break;
                        default:
                            console.error('🐛 DEBUG: Unknown module for import', module);
                            showNotification('❌ Unknown module for import', 'error');
                            return;
                    }
                    
                    showNotification(`✅ ${module} imported successfully!`, 'success');
                    console.log('🐛 DEBUG: Import success notification shown');
                    
                    // Refresh relevant views
                    console.log('🐛 DEBUG: Refreshing views for module', module);
                    if (module === 'insurance') {
                        console.log('🐛 DEBUG: Calling renderInsuranceList');
                        await renderInsuranceList();
                        console.log('🐛 DEBUG: Calling renderInsuranceStats');
                        await renderInsuranceStats();
                    } else if (module === 'vehicle') {
                        console.log('🐛 DEBUG: Calling renderVehicleGrid');
                        await renderVehicleGrid();
                    } else if (module === 'subscription') {
                        console.log('🐛 DEBUG: Calling renderSubscriptionList');
                        await renderSubscriptionList();
                        console.log('🐛 DEBUG: Calling renderSubscriptionSummary');
                        await renderSubscriptionSummary();
                    } else if (module === 'goals') {
                        console.log('🐛 DEBUG: Calling renderGoalsGrid');
                        await renderGoalsGrid();
                    }
                    console.log('🐛 DEBUG: View refresh completed');
                    
                } catch (parseError) {
                    console.error('🐛 DEBUG: Parse error occurred', parseError);
                    console.error('🐛 DEBUG: Error details', {
                        message: parseError.message,
                        stack: parseError.stack,
                        name: parseError.name
                    });
                    showNotification('❌ Failed to parse import file: ' + parseError.message, 'error');
                }
            };
            
            reader.onerror = (error) => {
                console.error('🐛 DEBUG: FileReader error', error);
                showNotification('❌ Failed to read file', 'error');
            };
            
            console.log('🐛 DEBUG: Starting FileReader.readAsText');
            reader.readAsText(file);
        } else if (format === 'excel') {
            // Handle Excel import
            console.log('🐛 DEBUG: Processing Excel file');
            showNotification('📊 Processing Excel file...', 'info');
            
            try {
                console.log('🐛 DEBUG: Calling readExcelFile');
                const data = await readExcelFile(file);
                console.log('🐛 DEBUG: Excel file read successfully', { 
                    dataType: typeof data,
                    keys: Object.keys(data),
                    hasInsurance: !!data.insurance,
                    insuranceLength: data.insurance ? data.insurance.length : 0
                });
                
                // Show preview before importing
                console.log('🐛 DEBUG: Showing Excel import preview');
                const confirmed = await showImportPreview(data, module);
                console.log('🐛 DEBUG: Excel preview confirmed', confirmed);
                if (!confirmed) {
                    console.log('🐛 DEBUG: Excel import cancelled by user');
                    return;
                }
                
                showNotification(`🔄 Importing ${module} data...`, 'info');
                
                // Process import based on module
                console.log('🐛 DEBUG: Processing Excel import for module', module);
                switch(module) {
                    case 'insurance':
                        console.log('🐛 DEBUG: Calling processInsuranceImport for Excel');
                        await processInsuranceImport(data);
                        break;
                    case 'vehicle':
                        console.log('🐛 DEBUG: Calling processVehicleImport for Excel');
                        await processVehicleImport(data);
                        break;
                    case 'subscription':
                        console.log('🐛 DEBUG: Calling processSubscriptionImport for Excel');
                        await processSubscriptionImport(data);
                        break;
                    case 'goals':
                        console.log('🐛 DEBUG: Calling processGoalsImport for Excel');
                        await processGoalsImport(data);
                        break;
                    case 'custom':
                        console.log('🐛 DEBUG: Calling processCustomImport for Excel');
                        await processCustomImport(data);
                        break;
                    default:
                        console.error('🐛 DEBUG: Unknown module for Excel import', module);
                        showNotification('❌ Unknown module for import', 'error');
                        return;
                }
                
                showNotification(`✅ ${module} imported successfully!`, 'success');
                console.log('🐛 DEBUG: Excel import success notification shown');
                
                // Refresh relevant views
                console.log('🐛 DEBUG: Refreshing views after Excel import for module', module);
                if (module === 'insurance') {
                    console.log('🐛 DEBUG: Calling renderInsuranceList after Excel import');
                    await renderInsuranceList();
                    console.log('🐛 DEBUG: Calling renderInsuranceStats after Excel import');
                    await renderInsuranceStats();
                } else if (module === 'vehicle') {
                    console.log('🐛 DEBUG: Calling renderVehicleGrid after Excel import');
                    await renderVehicleGrid();
                } else if (module === 'subscription') {
                    console.log('🐛 DEBUG: Calling renderSubscriptionList after Excel import');
                    await renderSubscriptionList();
                    console.log('🐛 DEBUG: Calling renderSubscriptionSummary after Excel import');
                    await renderSubscriptionSummary();
                } else if (module === 'goals') {
                    console.log('🐛 DEBUG: Calling renderGoalsGrid after Excel import');
                    await renderGoalsGrid();
                }
                console.log('🐛 DEBUG: Excel view refresh completed');
                
            } catch (excelError) {
                console.error('🐛 DEBUG: Excel processing error', excelError);
                console.error('🐛 DEBUG: Excel error details', {
                    message: excelError.message,
                    stack: excelError.stack,
                    name: excelError.name
                });
                showNotification('❌ Failed to process Excel file: ' + excelError.message, 'error');
            }
        }
        
    } catch (error) {
        console.error('🐛 DEBUG: Import error occurred', error);
        console.error('🐛 DEBUG: Import error details', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            module,
            format
        });
        showNotification('❌ Import failed: ' + error.message, 'error');
    }
    
    // Reset file input
    console.log('🐛 DEBUG: Resetting file input');
    fileInput.value = '';
    console.log('🐛 DEBUG: importData function completed');
}

// Module Import Function for Settings
async function importModuleData(module, fileInput) {
    try {
        const file = fileInput.files[0];
        if (!file) return;
        
        showNotification(`📥 Reading ${module} module data...`, 'info');
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                let importData;
                
                // Check file extension
                if (file.name.endsWith('.json')) {
                    importData = JSON.parse(e.target.result);
                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    importData = await readExcelFile(file);
                } else {
                    showNotification('❌ Unsupported file format', 'error');
                    return;
                }
                
                // Show preview before importing
                const confirmed = await showImportPreview(importData, module);
                if (!confirmed) return;
                
                showNotification(`🔄 Importing ${module} module data...`, 'info');
                
                // Process import based on module
                switch(module) {
                    case 'insurance':
                        await processInsuranceImport(importData);
                        break;
                    case 'vehicle':
                        await processVehicleImport(importData);
                        break;
                    case 'subscription':
                        await processSubscriptionImport(importData);
                        break;
                    case 'goals':
                        await processGoalsImport(importData);
                        break;
                    case 'custom':
                        await processCustomImport(importData);
                        break;
                    default:
                        showNotification('❌ Unknown module for import', 'error');
                        return;
                }
                
                showNotification(`✅ ${module} module imported successfully!`, 'success');
                
                // Refresh relevant views
                if (module === 'insurance') {
                    renderInsuranceList();
                    renderInsuranceStats();
                } else if (module === 'vehicle') {
                    renderVehicleGrid();
                } else if (module === 'subscription') {
                    renderSubscriptionList();
                    renderSubscriptionStats();
                } else if (module === 'goals') {
                    renderGoalsGrid();
                }
                
            } catch (parseError) {
                console.error('Parse error:', parseError);
                showNotification('❌ Failed to parse import file', 'error');
            }
        };
        
        reader.readAsText(file);
    } catch (error) {
        console.error('Import error:', error);
        showNotification('❌ Import failed: ' + error.message, 'error');
    }
    
    // Reset file input
    fileInput.value = '';
}

// Import All Data Function
async function importAllData(format, fileInputOrFile) {
    const isFileInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
    const file = isFileInput ? fileInputOrFile.files[0] : fileInputOrFile;

    try {
        if (!file) {
            showNotification('❌ No file selected', 'error');
            return;
        }

        showNotification(`📥 Reading ${format.toUpperCase()} file...`, 'info');

        if (format === 'json') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importData = JSON.parse(e.target.result);

                    // Validate import structure
                    if (!importData.data) {
                        showNotification('❌ Invalid import file format', 'error');
                        return;
                    }

                    const confirmed = confirm('This will replace all current data. Are you sure?');
                    if (!confirmed) return;

                    showNotification('🔄 Importing data...', 'info');

                    // Clear all databases first
                    await enhancedHolidayDB.clear();
                    await enhancedIncomeDB.clear();
                    await enhancedExpenseDB.clear();
                    await enhancedNoteDB.clear();
                    await enhancedShoppingDB.clear();
                    await enhancedBudgetDB.clear();
                    await enhancedBillDB.clear();
                    await enhancedGoalDB.clear();
                    await enhancedRecurringDB.clear();
                    await enhancedInsuranceDB.clear();
                    await enhancedVehicleDB.clear();
                    await enhancedVehicleServiceDB.clear();
                    await enhancedSubscriptionDB.clear();
                    await enhancedCustomTypeDB.clear();
                    await enhancedCustomItemDB.clear();

                    // Restore data by store
                    if (importData.data.holidays) {
                        for (const holiday of importData.data.holidays) {
                            await enhancedHolidayDB.add(holiday);
                        }
                    }

                    if (importData.data.income) {
                        for (const income of importData.data.income) {
                            await enhancedIncomeDB.add(income);
                        }
                    }

                    if (importData.data.expenses) {
                        for (const expense of importData.data.expenses) {
                            await enhancedExpenseDB.add(expense);
                        }
                    }

                    if (importData.data.notes) {
                        for (const note of importData.data.notes) {
                            await enhancedNoteDB.add(note);
                        }
                    }

                    if (importData.data.shopping) {
                        for (const item of importData.data.shopping) {
                            await enhancedShoppingDB.add(item);
                        }
                    }

                    if (importData.data.budgets) {
                        for (const budget of importData.data.budgets) {
                            await enhancedBudgetDB.add(budget);
                        }
                    }

                    if (importData.data.bills) {
                        for (const bill of importData.data.bills) {
                            await enhancedBillDB.add(bill);
                        }
                    }

                    if (importData.data.goals) {
                        for (const goal of importData.data.goals) {
                            await enhancedGoalDB.add(goal);
                        }
                    }

                    if (importData.data.recurring) {
                        for (const recurring of importData.data.recurring) {
                            await enhancedRecurringDB.add(recurring);
                        }
                    }

                    if (importData.data.insurance) {
                        for (const insurance of importData.data.insurance) {
                            await enhancedInsuranceDB.add(insurance);
                        }
                    }

                    if (importData.data.vehicles) {
                        for (const vehicle of importData.data.vehicles) {
                            await enhancedVehicleDB.add(vehicle);
                        }
                    }

                    if (importData.data.vehicleServices) {
                        for (const service of importData.data.vehicleServices) {
                            await enhancedVehicleServiceDB.add(service);
                        }
                    }

                    if (importData.data.subscriptions) {
                        for (const subscription of importData.data.subscriptions) {
                            await enhancedSubscriptionDB.add(subscription);
                        }
                    }

                    if (importData.data.customTypes) {
                        for (const customType of importData.data.customTypes) {
                            await enhancedCustomTypeDB.add(customType);
                        }
                    }

                    if (importData.data.customItems) {
                        for (const customItem of importData.data.customItems) {
                            await enhancedCustomItemDB.add(customItem);
                        }
                    }

                    // Restore settings
                    if (importData.settings) {
                        if (importData.settings.defaultCurrency) {
                            localStorage.setItem('defaultCurrency', importData.settings.defaultCurrency);
                        }
                        if (importData.settings.theme) {
                            localStorage.setItem('theme', importData.settings.theme);
                        }
                        if (importData.settings.exchangeRates) {
                            exchangeRates = importData.settings.exchangeRates;
                        }
                    }

                    showNotification('✅ Data imported successfully!', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                    showNotification('❌ Failed to parse import file', 'error');
                }
            };

            reader.onerror = () => {
                showNotification('❌ Failed to read file', 'error');
            };

            reader.readAsText(file);
        } else if (format === 'excel') {
            showNotification('📊 Processing Excel file...', 'info');

            try {
                const data = await readExcelFile(file);
                if (!data || !data.data) {
                    showNotification('❌ Invalid Excel file format', 'error');
                    return;
                }

                const confirmed = confirm('This will replace all current data. Are you sure?');
                if (!confirmed) return;

                showNotification('🔄 Importing Excel data...', 'info');
                await importAllData('json', new File([JSON.stringify(data)], 'import.json', { type: 'application/json' }));
            } catch (excelError) {
                console.error('Excel processing error:', excelError);
                showNotification('❌ Failed to process Excel file: ' + excelError.message, 'error');
            }
        } else if (format === 'csv') {
            showNotification('📋 Processing CSV file...', 'info');

            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const csvData = JSON.parse(e.target.result);
                        if (!csvData) {
                            showNotification('❌ Invalid CSV file format', 'error');
                            return;
                        }

                        const importData = {
                            version: '2.0.0',
                            timestamp: new Date().toISOString(),
                            data: csvData
                        };

                        const jsonFile = new File([JSON.stringify(importData)], 'import.json', { type: 'application/json' });
                        await importAllData('json', jsonFile);
                    } catch (csvError) {
                        console.error('CSV processing error:', csvError);
                        showNotification('❌ Failed to process CSV file: ' + csvError.message, 'error');
                    }
                };

                reader.onerror = () => {
                    showNotification('❌ Failed to read file', 'error');
                };

                reader.readAsText(file);
            } catch (error) {
                console.error('CSV import error:', error);
                showNotification('❌ CSV import failed: ' + error.message, 'error');
            }
        }
    } catch (error) {
        console.error('Import error:', error);
        showNotification('❌ Import failed: ' + error.message, 'error');
    } finally {
        if (isFileInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') {
            fileInputOrFile.value = '';
        }
    }
}

// Clear All Data Function
async function clearAllData() {
    const confirmed = confirm('⚠️ WARNING: This will permanently delete ALL data including:\n\n• Holidays\n• Income & Expenses\n• Notes\n• Shopping Lists\n• Budgets\n• Bills\n• Goals\n• Insurance Policies\n• Vehicles\n• Subscriptions\n• Custom Data\n• Settings\n\nThis action cannot be undone. Are you absolutely sure?');
    
    if (!confirmed) return;
    
    try {
        showNotification('🗑️ Clearing all data...', 'info');
        
        // Clear all databases
        await enhancedHolidayDB.clear();
        await enhancedIncomeDB.clear();
        await enhancedExpenseDB.clear();
        await enhancedNoteDB.clear();
        await enhancedShoppingDB.clear();
        await enhancedBudgetDB.clear();
        await enhancedBillDB.clear();
        await enhancedGoalDB.clear();
        await enhancedRecurringDB.clear();
        await enhancedInsuranceDB.clear();
        await enhancedVehicleDB.clear();
        await enhancedVehicleServiceDB.clear();
        await enhancedSubscriptionDB.clear();
        await enhancedCustomTypeDB.clear();
        await enhancedCustomItemDB.clear();
        
        // Clear local storage
        localStorage.removeItem('defaultCurrency');
        localStorage.removeItem('theme');
        localStorage.removeItem('pendingTrackerTransactions');
        
        // Reset exchange rates to default
        exchangeRates = {
            NPR: 1,
            USD: 0.0075,
            EUR: 0.0069,
            INR: 0.63
        };
        
        showNotification('✅ All data cleared successfully!', 'success');
        
        // Reload the page to reset everything
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('Clear data error:', error);
        showNotification('❌ Failed to clear data: ' + error.message, 'error');
    }
}

// Helper function to get database for store name
function getDatabaseForStore(storeName) {
    const dbMap = {
        'holidays': holidayDB,
        'income': incomeDB,
        'expenses': expenseDB,
        'notes': noteDB,
        'shopping': shoppingDB,
        'budgets': budgetDB,
        'bills': billDB,
        'goals': goalDB,
        'recurring': recurringDB,
        'insurance': insuranceDB,
        'vehicles': vehicleDB,
        'vehicleServices': vehicleServiceDB,
        'subscriptions': subscriptionDB,
        'customTypes': customTypeDB,
        'customItems': customItemDB
    };
    return dbMap[storeName] || null;
}

/**
 * ========================================
 * ALERTS & NOTIFICATIONS
 * ========================================
 */
async function checkUpcomingAlerts() {
    const today = getCurrentNepaliDate();
    const todayStr = formatBsDate(today.year, today.month, today.day);
    const in7Days = addDaysToBsDate(todayStr, 7);

    let alerts = [];

    // Check insurance expiring soon
    const insurances = await enhancedInsuranceDB.getAll();
    const expiringInsurance = insurances.filter(ins => 
        ins.status === 'active' && 
        ins.expiryDate >= todayStr && 
        ins.expiryDate <= in7Days
    );

    expiringInsurance.forEach(ins => {
        alerts.push(`🛡️ Insurance "${ins.name}" expiring on ${ins.expiryDate}`);
    });

    // Check bills due soon
    const bills = await enhancedBillDB.getAll();
    const dueBills = bills.filter(bill =>
        bill.status !== 'paid' &&
        bill.dueDate >= todayStr &&
        bill.dueDate <= in7Days
    );

    dueBills.forEach(bill => {
        alerts.push(`💳 Bill "${bill.name}" due on ${bill.dueDate}`);
    });

    // Check subscriptions renewing soon
    const subscriptions = await enhancedSubscriptionDB.getAll();
    const renewingSubs = subscriptions.filter(sub =>
        sub.status === 'active' &&
        sub.renewalDate >= todayStr &&
        sub.renewalDate <= in7Days
    );

    renewingSubs.forEach(sub => {
        alerts.push(`📺 Subscription "${sub.name}" renewing on ${sub.renewalDate}`);
    });

    // Log alerts
    if (alerts.length > 0) {
        console.log('🔔 Upcoming Alerts:', alerts);
    }

    return alerts;
}

function addDaysToBsDate(bsDateStr, days) {
    const [year, month, day] = bsDateStr.split('/').map(Number);
    const adDate = bsToAd(year, month, day);
    adDate.date.setDate(adDate.date.getDate() + days);
    const newBs = adToBs(adDate.date.getFullYear(), adDate.date.getMonth() + 1, adDate.date.getDate());
    return formatBsDate(newBs.year, newBs.month, newBs.day);
}

// FAB
function handleFabAction(action) {
    switch(action) {
        case 'income':
            showIncomeExpenseForm('income');
            break;
        case 'expense':
            showIncomeExpenseForm('expense');
            break;
        case 'note':
            showNoteForm();
            break;
        case 'shopping':
            showShoppingForm();
            break;
        case 'bill':
            showBillForm();
            break;
        case 'goal':
            showGoalForm();
            break;
        case 'insurance':
            showInsuranceForm();
            break;
        case 'vehicle':
            showVehicleForm();
            break;
        case 'subscription':
            showSubscriptionForm();
            break;
    }
}

// UI Helpers
function showModal(content) {
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ========================================
// MISSING IMPORT PROCESSING FUNCTIONS
// ========================================

// Process Goals Import
async function processGoalsImport(data) {
    if (data.goals && Array.isArray(data.goals)) {
        const existingGoals = await enhancedGoalDB.getAll();
        const existingKeys = new Set();
        existingGoals.forEach(goal => {
            const key = `${goal.name.toLowerCase().trim()}-${goal.targetAmount}`;
            existingKeys.add(key);
        });
        
        let addedCount = 0, duplicateCount = 0;
        for (const goal of data.goals) {
            const { id, ...goalData } = goal;
            const key = `${goalData.name.toLowerCase().trim()}-${goalData.targetAmount}`;
            if (!existingKeys.has(key)) {
                await enhancedGoalDB.add(goalData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Goals import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    } else {
        showNotification('⚠️ No goals data found in import file', 'warning');
    }
    renderGoalsGrid();
}

// Process Insurance Import
async function processInsuranceImport(data) {
    console.log('🐛 DEBUG: processInsuranceImport called', { data });
    
    try {
        // Handle both direct and nested data structures
        let insuranceData = null;
        
        if (data.insurance && Array.isArray(data.insurance)) {
            // Direct structure: { "insurance": [...] }
            insuranceData = data.insurance;
            console.log('🐛 DEBUG: Using direct insurance data structure');
        } else if (data.data && data.data.insurance && Array.isArray(data.data.insurance)) {
            // Nested structure: { "data": { "insurance": [...] } }
            insuranceData = data.data.insurance;
            console.log('🐛 DEBUG: Using nested data structure');
        } else {
            console.error('🐛 DEBUG: No insurance data found or invalid format', { 
                hasInsurance: !!data.insurance,
                hasData: !!data.data,
                hasNestedInsurance: !!(data.data && data.data.insurance),
                isArray: Array.isArray(data.insurance),
                isNestedArray: !!(data.data && Array.isArray(data.data.insurance)),
                dataKeys: Object.keys(data),
                dataType: typeof data,
                fullData: data
            });
            showNotification('⚠️ No insurance data found in import file', 'warning');
            return;
        }
        
        console.log('🐛 DEBUG: Found insurance array', { length: insuranceData.length });
        
        console.log('🐛 DEBUG: Getting existing insurance from DB');
        const existingInsurance = await enhancedInsuranceDB.getAll();
        console.log('🐛 DEBUG: Existing insurance retrieved', { count: existingInsurance.length });
        
        const existingKeys = new Set();
        existingInsurance.forEach(insurance => {
            // Handle both provider and company fields, with fallback to empty string
            const company = insurance.provider || insurance.company || '';
            const policyNumber = insurance.policyNumber || '';
            const key = `${company.toString().toLowerCase().trim()}-${policyNumber.toString().toLowerCase().trim()}`;
            existingKeys.add(key);
        });
        console.log('🐛 DEBUG: Existing keys created', { count: existingKeys.size });
        
        let addedCount = 0, duplicateCount = 0, errorCount = 0;
        
        for (const [index, insurance] of insuranceData.entries()) {
            console.log(`🐛 DEBUG: Processing insurance item ${index + 1}/${insuranceData.length}`, {
                name: insurance.name,
                provider: insurance.provider,
                company: insurance.company,
                policyNumber: insurance.policyNumber
            });
            
            try {
                const { id, ...insuranceItemData } = insurance;
                // Use provider field first, fallback to company
                const company = insuranceItemData.provider || insuranceItemData.company || '';
                const policyNumber = insuranceItemData.policyNumber || '';
                const key = `${company.toString().toLowerCase().trim()}-${policyNumber.toString().toLowerCase().trim()}`;
                
                console.log(`🐛 DEBUG: Checking duplicate key`, { key });
                
                if (!existingKeys.has(key)) {
                    console.log(`🐛 DEBUG: Adding new insurance item`, { key });
                    
                    // Ensure required fields
                    const processedData = {
                        name: insuranceItemData.name || insuranceItemData.policyName || 'Unknown Policy',
                        policyNumber: insuranceItemData.policyNumber || insuranceItemData.policyNo || '',
                        company: insuranceItemData.company || insuranceItemData.provider || 'Unknown Company',
                        type: insuranceItemData.type || 'other',
                        coverage: parseFloat(insuranceItemData.coverage) || 0,
                        premium: parseFloat(insuranceItemData.premium) || 0,
                        frequency: insuranceItemData.frequency || 'yearly',
                        startDate: insuranceItemData.startDate || '',
                        expiryDate: insuranceItemData.expiryDate || '',
                        beneficiary: insuranceItemData.beneficiary || '',
                        status: insuranceItemData.status || 'active',
                        notes: insuranceItemData.notes || '',
                        createdAt: insuranceItemData.createdAt || new Date().toISOString()
                    };
                    
                    console.log(`🐛 DEBUG: Processed insurance data`, processedData);
                    
                    await enhancedInsuranceDB.add(processedData);
                    existingKeys.add(key);
                    addedCount++;
                    
                    console.log(`🐛 DEBUG: Successfully added insurance item`, { 
                        addedCount, 
                        name: processedData.name,
                        company: processedData.company
                    });
                } else {
                    console.log(`🐛 DEBUG: Duplicate found, skipping`, { key });
                    duplicateCount++;
                }
            } catch (itemError) {
                console.error(`🐛 DEBUG: Error processing insurance item ${index + 1}`, itemError);
                console.error(`🐛 DEBUG: Item error details`, {
                    message: itemError.message,
                    stack: itemError.stack,
                    insuranceData: insurance
                });
                errorCount++;
            }
        }
        
        console.log(`🐛 DEBUG: Insurance import processing completed`, {
            totalItems: insuranceData.length,
            addedCount,
            duplicateCount,
            errorCount
        });
        
        showNotification(`✅ Insurance import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}, Errors: ${errorCount}`, 'success');
        
        console.log('🐛 DEBUG: Calling renderInsuranceList after import');
        await renderInsuranceList();
        console.log('🐛 DEBUG: Calling renderInsuranceStats after import');
        await renderInsuranceStats();
        console.log('🐛 DEBUG: processInsuranceImport completed successfully');
        
    } catch (error) {
        console.error('🐛 DEBUG: processInsuranceImport error occurred', error);
        console.error('🐛 DEBUG: ProcessInsuranceImport error details', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            dataReceived: !!data,
            dataType: typeof data
        });
        showNotification('❌ Insurance import failed: ' + error.message, 'error');
    }
}

// Process Vehicle Import
async function processVehicleImport(data) {
    console.log('🐛 DEBUG: processVehicleImport called', { data });
    
    try {
        if (data.vehicles && Array.isArray(data.vehicles)) {
            console.log('🐛 DEBUG: Found vehicles array', { length: data.vehicles.length });
            
            const existingVehicles = await enhancedVehicleDB.getAll();
            console.log('🐛 DEBUG: Existing vehicles retrieved', { count: existingVehicles.length });
            
            const existingKeys = new Set();
            existingVehicles.forEach(vehicle => {
                const key = `${vehicle.make.toLowerCase().trim()}-${vehicle.model.toLowerCase().trim()}-${vehicle.licensePlate.toLowerCase().trim()}`;
                existingKeys.add(key);
            });
            console.log('🐛 DEBUG: Vehicle existing keys created', { count: existingKeys.size });
            
            let addedCount = 0, duplicateCount = 0, errorCount = 0;
            
            for (const [index, vehicle] of data.vehicles.entries()) {
                console.log(`🐛 DEBUG: Processing vehicle item ${index + 1}/${data.vehicles.length}`, {
                    make: vehicle.make,
                    model: vehicle.model,
                    licensePlate: vehicle.licensePlate
                });
                
                try {
                    const { id, ...vehicleData } = vehicle;
                    const key = `${vehicleData.make?.toLowerCase().trim() || ''}-${vehicleData.model?.toLowerCase().trim() || ''}-${vehicleData.licensePlate?.toLowerCase().trim() || ''}`;
                    
                    if (!existingKeys.has(key)) {
                        console.log(`🐛 DEBUG: Adding new vehicle item`, { key });
                        
                        const processedData = {
                            make: vehicleData.make || '',
                            model: vehicleData.model || '',
                            year: parseInt(vehicleData.year) || new Date().getFullYear(),
                            licensePlate: vehicleData.licensePlate || vehicleData.plate || '',
                            type: vehicleData.type || 'car',
                            mileage: parseInt(vehicleData.mileage) || 0,
                            fuelType: vehicleData.fuelType || 'petrol',
                            status: vehicleData.status || 'active',
                            notes: vehicleData.notes || '',
                            createdAt: vehicleData.createdAt || new Date().toISOString()
                        };
                        
                        await enhancedVehicleDB.add(processedData);
                        existingKeys.add(key);
                        addedCount++;
                        
                        console.log(`🐛 DEBUG: Successfully added vehicle item`, { 
                            addedCount, 
                            make: processedData.make,
                            model: processedData.model
                        });
                    } else {
                        console.log(`🐛 DEBUG: Vehicle duplicate found, skipping`, { key });
                        duplicateCount++;
                    }
                } catch (itemError) {
                    console.error(`🐛 DEBUG: Error processing vehicle item ${index + 1}`, itemError);
                    errorCount++;
                }
            }
            
            console.log(`🐛 DEBUG: Vehicle import processing completed`, {
                totalItems: data.vehicles.length,
                addedCount,
                duplicateCount,
                errorCount
            });
            
            showNotification(`✅ Vehicle import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}, Errors: ${errorCount}`, 'success');
        } else {
            console.error('🐛 DEBUG: No vehicle data found', { 
                hasVehicles: !!data.vehicles,
                isArray: Array.isArray(data.vehicles)
            });
            showNotification('⚠️ No vehicle data found in import file', 'warning');
        }
        
        console.log('🐛 DEBUG: Calling renderVehicleGrid after import');
        await renderVehicleGrid();
        console.log('🐛 DEBUG: processVehicleImport completed');
        
    } catch (error) {
        console.error('🐛 DEBUG: processVehicleImport error', error);
        showNotification('❌ Vehicle import failed: ' + error.message, 'error');
    }
}

// Process Subscription Import
async function processSubscriptionImport(data) {
    if (data.subscriptions && Array.isArray(data.subscriptions)) {
        const existingSubscriptions = await enhancedSubscriptionDB.getAll();
        const existingKeys = new Set();
        existingSubscriptions.forEach(subscription => {
            const key = `${subscription.name.toLowerCase().trim()}-${subscription.category.toLowerCase().trim()}`;
            existingKeys.add(key);
        });
        
        let addedCount = 0, duplicateCount = 0;
        for (const subscription of data.subscriptions) {
            const { id, ...subscriptionData } = subscription;
            const key = `${subscriptionData.name.toLowerCase().trim()}-${subscriptionData.category.toLowerCase().trim()}`;
            if (!existingKeys.has(key)) {
                await enhancedSubscriptionDB.add(subscriptionData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Subscription import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    } else {
        showNotification('⚠️ No subscription data found in import file', 'warning');
    }
    renderSubscriptionList();
    renderSubscriptionSummary();
}

// Process Custom Import
async function processCustomImport(data) {
    if (data.customTypes && Array.isArray(data.customTypes)) {
        const existingTypes = await enhancedCustomTypeDB.getAll();
        const existingKeys = new Set();
        existingTypes.forEach(type => {
            const key = type.name.toLowerCase().trim();
            existingKeys.add(key);
        });
        
        let addedCount = 0, duplicateCount = 0;
        for (const type of data.customTypes) {
            const { id, ...typeData } = type;
            const key = typeData.name.toLowerCase().trim();
            if (!existingKeys.has(key)) {
                await enhancedCustomTypeDB.add(typeData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Custom types import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    }
    
    if (data.customItems && Array.isArray(data.customItems)) {
        const existingItems = await enhancedCustomItemDB.getAll();
        const existingKeys = new Set();
        existingItems.forEach(item => {
            const key = `${item.typeId}-${item.name.toLowerCase().trim()}`;
            existingKeys.add(key);
        });
        
        let addedCount = 0, duplicateCount = 0;
        for (const item of data.customItems) {
            const { id, ...itemData } = item;
            const key = `${itemData.typeId}-${itemData.name.toLowerCase().trim()}`;
            if (!existingKeys.has(key)) {
                await enhancedCustomItemDB.add(itemData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Custom items import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    }
    
    renderCustomTypes();
    renderCustomItems();
}

// Process Shopping Import
async function processShoppingImport(data) {
    if (data.shopping && Array.isArray(data.shopping)) {
        const existingShopping = await enhancedShoppingDB.getAll();
        const existingKeys = new Set();
        existingShopping.forEach(item => {
            const key = item.name.toLowerCase().trim();
            existingKeys.add(key);
        });
        
        let addedCount = 0, duplicateCount = 0;
        for (const item of data.shopping) {
            const { id, ...itemData } = item;
            const key = itemData.name.toLowerCase().trim();
            if (!existingKeys.has(key)) {
                await enhancedShoppingDB.add(itemData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Shopping import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    } else {
        showNotification('⚠️ No shopping data found in import file', 'warning');
    }
    renderShoppingList();
}

// ========================================
// GLOBAL DUPLICATE DETECTION FUNCTION
// ========================================
async function scanAllModulesForDuplicates() {
    try {
        const resultsContainer = document.getElementById('duplicateScanResults');
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="scanning-progress">
                <div class="spinner"></div>
                Scanning all modules for duplicates...
            </div>
        `;

        const modules = [
            { name: 'Holidays', db: holidayDB, keyFn: (item) => `${item.date_bs}-${item.name.toLowerCase().trim()}`, displayFn: (item) => `${item.date_bs} - ${item.name}` },
            { name: 'Notes', db: noteDB, keyFn: (item) => `${item.date_bs}-${item.title.toLowerCase().trim()}`, displayFn: (item) => `${item.date_bs} - ${item.title}` },
            { name: 'Income', db: incomeDB, keyFn: (item) => `${item.date}-${item.description.toLowerCase().trim()}-${item.amount}`, displayFn: (item) => `${item.date} - ${item.description} (${item.amount})` },
            { name: 'Expenses', db: expenseDB, keyFn: (item) => `${item.date}-${item.description.toLowerCase().trim()}-${item.amount}`, displayFn: (item) => `${item.date} - ${item.description} (${item.amount})` },
            { name: 'Budget', db: budgetDB, keyFn: (item) => `${item.category.toLowerCase().trim()}-${item.year}-${item.month}`, displayFn: (item) => `${item.category} (${item.year}/${item.month})` },
            { name: 'Bills', db: billDB, keyFn: (item) => `${item.name.toLowerCase().trim()}-${item.amount}-${item.dueDate}`, displayFn: (item) => `${item.name} (${item.amount}) - Due: ${item.dueDate}` },
            { name: 'Goals', db: goalDB, keyFn: (item) => `${item.name.toLowerCase().trim()}-${item.targetAmount}`, displayFn: (item) => `${item.name} (Target: ${item.targetAmount})` },
            { name: 'Insurance', db: insuranceDB, keyFn: (item) => `${item.company.toLowerCase().trim()}-${item.policyNumber.toLowerCase().trim()}`, displayFn: (item) => `${item.company} - Policy: ${item.policyNumber}` },
            { name: 'Vehicles', db: vehicleDB, keyFn: (item) => `${item.make.toLowerCase().trim()}-${item.model.toLowerCase().trim()}-${item.licensePlate.toLowerCase().trim()}`, displayFn: (item) => `${item.make} ${item.model} (${item.licensePlate})` },
            { name: 'Subscriptions', db: subscriptionDB, keyFn: (item) => `${item.name.toLowerCase().trim()}-${item.category.toLowerCase().trim()}`, displayFn: (item) => `${item.name} (${item.category})` },
            { name: 'Shopping', db: shoppingDB, keyFn: (item) => item.name.toLowerCase().trim(), displayFn: (item) => `${item.name} (${item.category || 'No category'})` },
            { name: 'Custom Types', db: customTypeDB, keyFn: (item) => item.name.toLowerCase().trim(), displayFn: (item) => item.name },
            { name: 'Custom Items', db: customItemDB, keyFn: (item) => `${item.typeId}-${item.name.toLowerCase().trim()}`, displayFn: (item) => `${item.name} (Type: ${item.typeId})` },
            { name: 'Recurring', db: recurringDB, keyFn: (item) => `${item.description.toLowerCase().trim()}-${item.amount}-${item.frequency}`, displayFn: (item) => `${item.description} (${item.amount}) - ${item.frequency}` }
        ];

        let allDuplicates = {};
        let totalDuplicates = 0;

        // Scan each module
        for (const module of modules) {
            try {
                const items = await module.db.getAll();
                const duplicates = findDuplicates(items, module.keyFn);
                
                if (duplicates.length > 0) {
                    allDuplicates[module.name] = {
                        duplicates: duplicates,
                        db: module.db,
                        displayFn: module.displayFn
                    };
                    totalDuplicates += duplicates.length;
                }
            } catch (error) {
                console.error(`Error scanning ${module.name}:`, error);
            }
        }

        // Display results
        if (totalDuplicates === 0) {
            resultsContainer.innerHTML = `
                <div class="no-duplicates">
                    ✅ No duplicates found in any module!
                </div>
            `;
            showNotification('✅ No duplicates found in any module!', 'success');
        } else {
            resultsContainer.innerHTML = generateDuplicateResultsHTML(allDuplicates, totalDuplicates);
            showNotification(`🔍 Found ${totalDuplicates} duplicate(s) across ${Object.keys(allDuplicates).length} module(s)`, 'info');
        }

    } catch (error) {
        console.error('Error scanning for duplicates:', error);
        const resultsContainer = document.getElementById('duplicateScanResults');
        resultsContainer.innerHTML = `
            <div class="error-state">
                ❌ Error scanning for duplicates: ${error.message}
            </div>
        `;
        showNotification('❌ Failed to scan for duplicates', 'error');
    }
} // Added missing closing brace here

function findDuplicates(items, keyFn) {
    const seen = new Map();
    const duplicates = [];
    
    items.forEach(item => {
        const key = keyFn(item);
        if (seen.has(key)) {
            // Add to duplicates array if not already there
            if (!duplicates.find(dup => dup.key === key)) {
                duplicates.push({
                    key: key,
                    items: [seen.get(key), item]
                });
            } else {
                const existingDup = duplicates.find(dup => dup.key === key);
                existingDup.items.push(item);
            }
        } else {
            seen.set(key, item);
        }
    });
    
    return duplicates;
}

function generateDuplicateResultsHTML(allDuplicates, totalDuplicates) {
    let html = `
        <div class="duplicate-summary">
            <h4>🔍 Scan Results: ${totalDuplicates} duplicate(s) found</h4>
        </div>
    `;

    for (const [moduleName, moduleData] of Object.entries(allDuplicates)) {
        html += `
            <div class="duplicate-module">
                <div class="duplicate-module-header">
                    <div class="duplicate-module-title">
                        ${getModuleIcon(moduleName)} ${moduleName}
                    </div>
                    <span class="duplicate-count">${moduleData.duplicates.length} duplicate(s)</span>
                </div>
                <div class="duplicate-items">
        `;

        moduleData.duplicates.forEach((duplicateGroup, groupIndex) => {
            duplicateGroup.items.forEach((item, itemIndex) => {
                const isFirst = itemIndex === 0;
                html += `
                    <div class="duplicate-item">
                        <div class="duplicate-item-info">
                            ${moduleData.displayFn(item)}
                            ${isFirst ? '<span style="color: #27ae60; font-weight: 500;"> (Original)</span>' : '<span style="color: #e74c3c; font-weight: 500;"> (Duplicate)</span>'}
                        </div>
                        <div class="duplicate-item-actions">
                            ${!isFirst ? `
                                <button class="btn-delete-single" onclick="deleteDuplicateItem('${moduleName}', ${item.id})">
                                    🗑️ Delete
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        });

        html += `
                </div>
                <div class="duplicate-module-actions">
                    <button class="btn-keep-first" onclick="keepFirstItems('${moduleName}')">
                        ✅ Keep First, Delete Rest
                    </button>
                    <button class="btn-delete-all-duplicates" onclick="deleteAllDuplicates('${moduleName}')">
                        🗑️ Delete All Duplicates
                    </button>
                </div>
            </div>
        `;
    }

    return html;
}

function getModuleIcon(moduleName) {
    const icons = {
        'Holidays': '🎉',
        'Notes': '📝',
        'Income': '💵',
        'Expenses': '💸',
        'Budget': '📊',
        'Bills': '💳',
        'Goals': '🎯',
        'Insurance': '🛡️',
        'Vehicles': '🚗',
        'Subscriptions': '📺',
        'Shopping': '🛒',
        'Custom Types': '📂',
        'Custom Items': '📋',
        'Recurring': '🔄'
    };
    return icons[moduleName] || '📄';
}

// ========================================
// DUPLICATE DELETION FUNCTIONS
// ========================================

async function deleteDuplicateItem(moduleName, itemId) {
    try {
        const db = getDatabaseForModule(moduleName);
        if (!db) {
            showNotification(`❌ Unknown module: ${moduleName}`, 'error');
            return;
        }

        await db.delete(itemId);
        showNotification(`✅ Duplicate item deleted from ${moduleName}`, 'success');
        
        // Refresh the scan results
        await scanAllModulesForDuplicates();
        
        // Refresh the relevant module view
        refreshModuleView(moduleName);
        
    } catch (error) {
        console.error('Error deleting duplicate item:', error);
        showNotification(`❌ Failed to delete item: ${error.message}`, 'error');
    }
}

async function keepFirstItems(moduleName) {
    try {
        const confirmed = confirm(`Keep only the first item of each duplicate group in ${moduleName} and delete the rest?`);
        if (!confirmed) return;

        const db = getDatabaseForModule(moduleName);
        if (!db) {
            showNotification(`❌ Unknown module: ${moduleName}`, 'error');
            return;
        }

        const items = await db.getAll();
        const keyFn = getModuleKeyFunction(moduleName);
        const duplicates = findDuplicates(items, keyFn);
        
        let deletedCount = 0;
        
        for (const duplicateGroup of duplicates) {
            // Keep the first item, delete the rest
            for (let i = 1; i < duplicateGroup.items.length; i++) {
                await db.delete(duplicateGroup.items[i].id);
                deletedCount++;
            }
        }
        
        showNotification(`✅ Deleted ${deletedCount} duplicate(s) from ${moduleName}`, 'success');
        
        // Refresh the scan results
        await scanAllModulesForDuplicates();
        
        // Refresh the relevant module view
        refreshModuleView(moduleName);
        
    } catch (error) {
        console.error('Error keeping first items:', error);
        showNotification(`❌ Failed to clean duplicates: ${error.message}`, 'error');
    }
}

async function deleteAllDuplicates(moduleName) {
    try {
        const confirmed = confirm(`Delete ALL duplicate items in ${moduleName}? This will remove all items that have duplicates, keeping none of them.`);
        if (!confirmed) return;

        const db = getDatabaseForModule(moduleName);
        if (!db) {
            showNotification(`❌ Unknown module: ${moduleName}`, 'error');
            return;
        }

        const items = await db.getAll();
        const keyFn = getModuleKeyFunction(moduleName);
        const duplicates = findDuplicates(items, keyFn);
        
        let deletedCount = 0;
        
        for (const duplicateGroup of duplicates) {
            // Delete all items in the duplicate group
            for (const item of duplicateGroup.items) {
                await db.delete(item.id);
                deletedCount++;
            }
        }
        
        showNotification(`✅ Deleted ${deletedCount} duplicate items from ${moduleName}`, 'success');
        
        // Refresh the scan results
        await scanAllModulesForDuplicates();
        
        // Refresh the relevant module view
        refreshModuleView(moduleName);
        
    } catch (error) {
        console.error('Error deleting all duplicates:', error);
        showNotification(`❌ Failed to delete duplicates: ${error.message}`, 'error');
    }
}

function getDatabaseForModule(moduleName) {
    const dbMap = {
        'Holidays': holidayDB,
        'Notes': noteDB,
        'Income': incomeDB,
        'Expenses': expenseDB,
        'Budget': budgetDB,
        'Bills': billDB,
        'Goals': goalDB,
        'Insurance': insuranceDB,
        'Vehicles': vehicleDB,
        'Subscriptions': subscriptionDB,
        'Shopping': shoppingDB,
        'Custom Types': customTypeDB,
        'Custom Items': customItemDB,
        'Recurring': recurringDB
    };
    return dbMap[moduleName] || null;
}

function getModuleKeyFunction(moduleName) {
    const keyFunctions = {
        'Holidays': (item) => `${item.date_bs}-${item.name.toLowerCase().trim()}`,
        'Notes': (item) => `${item.date_bs}-${item.title.toLowerCase().trim()}`,
        'Income': (item) => `${item.date}-${item.description.toLowerCase().trim()}-${item.amount}`,
        'Expenses': (item) => `${item.date}-${item.description.toLowerCase().trim()}-${item.amount}`,
        'Budget': (item) => `${item.category.toLowerCase().trim()}-${item.year}-${item.month}`,
        'Bills': (item) => `${item.name.toLowerCase().trim()}-${item.amount}-${item.dueDate}`,
        'Goals': (item) => `${item.name.toLowerCase().trim()}-${item.targetAmount}`,
        'Insurance': (item) => `${item.company.toLowerCase().trim()}-${item.policyNumber.toLowerCase().trim()}`,
        'Vehicles': (item) => `${item.make.toLowerCase().trim()}-${item.model.toLowerCase().trim()}-${item.licensePlate.toLowerCase().trim()}`,
        'Subscriptions': (item) => `${item.name.toLowerCase().trim()}-${item.category.toLowerCase().trim()}`,
        'Shopping': (item) => item.name.toLowerCase().trim(),
        'Custom Types': (item) => item.name.toLowerCase().trim(),
        'Custom Items': (item) => `${item.typeId}-${item.name.toLowerCase().trim()}`,
        'Recurring': (item) => `${item.description.toLowerCase().trim()}-${item.amount}-${item.frequency}`
    };
    return keyFunctions[moduleName] || ((item) => item.id);
}

function refreshModuleView(moduleName) {
switch(moduleName) {
    case 'Holidays':
        renderHolidayList();
        renderCalendar();
        break;
    case 'Notes':
        renderNotes();
        renderCalendar();
        break;
    case 'Income':
    case 'Expenses':
    case 'Recurring':
        renderTrackerList();
        renderRecurringList();
        updateMonthlySummary();
        break;
    case 'Budget':
        updateBudgetOverview(currentBsYear, currentBsMonth);
        renderBudgetCategories(currentBsYear, currentBsMonth);
        renderBudgetChart(currentBsYear, currentBsMonth);
        break;
    case 'Bills':
        renderBillsList();
        renderUpcomingBillsList();
        break;
    case 'Goals':
        renderGoalsGrid();
        break;
    case 'Insurance':
        renderInsuranceList();
        renderInsuranceStats();
        break;
    case 'Vehicles':
        renderVehicleGrid();
        break;
    case 'Subscriptions':
        renderSubscriptionList();
        renderSubscriptionSummary();
        break;
    case 'Shopping':
        renderShoppingList();
        break;
    case 'Custom Types':
    case 'Custom Items':
        renderCustomTypes();
        renderCustomItems();
        break;
}
}

// Make functions global
window.scanAllModulesForDuplicates = scanAllModulesForDuplicates;
window.deleteDuplicateItem = deleteDuplicateItem;
window.keepFirstItems = keepFirstItems;
window.deleteAllDuplicates = deleteAllDuplicates;

// Make functions global
window.processGoalsImport = processGoalsImport;
window.processInsuranceImport = processInsuranceImport;
window.processVehicleImport = processVehicleImport;
window.processSubscriptionImport = processSubscriptionImport;
window.processCustomImport = processCustomImport;
window.processShoppingImport = processShoppingImport;

window.showIncomeExpenseForm = showIncomeExpenseForm;
window.showRecurringForm = showRecurringForm;
window.showShoppingForm = showShoppingForm;
window.showNoteForm = showNoteForm;

// SMS Parser Integration
function openSMSParser() {
    // Open SMS parser in a new window/tab
    const smsParserUrl = './nepali_bank_sms_parser_mobile.html';
    window.open(smsParserUrl, '_blank', 'width=400,height=800,scrollbars=yes,resizable=yes');
}

// Check and update SMS process button state
function updateSMSProcessButton() {
    const pendingTransactions = JSON.parse(localStorage.getItem('pendingTrackerTransactions') || '[]');
    const processBtn = document.getElementById('processSMSBtn');
    
    console.log('🔄 Updating SMS Process Button - Pending transactions:', pendingTransactions.length);
    
    if (processBtn) {
        if (pendingTransactions.length > 0) {
            processBtn.textContent = `🔄 Process SMS (${pendingTransactions.length})`;
            processBtn.classList.add('btn-warning');
            processBtn.classList.remove('btn-secondary');
            console.log('✅ SMS Process Button updated to show pending count:', pendingTransactions.length);
        } else {
            processBtn.textContent = '🔄 Process SMS';
            processBtn.classList.remove('btn-warning');
            processBtn.classList.add('btn-secondary');
            console.log('✅ SMS Process Button updated to normal state');
        }
    } else {
        console.log('❌ SMS Process Button not found in DOM');
    }
}

window.openSMSParser = openSMSParser;
window.updateSMSProcessButton = updateSMSProcessButton;

// Expose calendar navigation functions globally
window.changeMonth = changeMonth;
window.changeWeek = changeWeek;
window.changeDay = changeDay;
window.changeYear = changeYear;
window.navigateCalendar = navigateCalendar;
window.goToToday = goToToday;
window.onYearMonthChange = onYearMonthChange;

window.showHolidayForm = showHolidayForm;
window.showBudgetForm = showBudgetForm;
window.showBillForm = showBillForm;
window.showGoalForm = showGoalForm;
window.showInsuranceForm = showInsuranceForm;
window.showVehicleForm = showVehicleForm;
window.showSubscriptionForm = showSubscriptionForm;
window.showCustomTypeForm = showCustomTypeForm;
window.closeModal = closeModal;

// UI Functions for SMS Parser Module
function parseAndPreviewSMS() {
    const smsInput = document.getElementById('smsInput');
    const smsText = smsInput.value.trim();
    
    if (!smsText) {
        showNotification('Please paste an SMS message first', 'warning');
        return;
    }
    
    const parsed = parseSMS(smsText);
    
    if (!parsed || !parsed.amount || !parsed.type) {
        showNotification('Could not parse transaction details. Please check the SMS format.', 'error');
        return;
    }
    
    currentParsedSMS = parsed;
    displaySMSPreview(parsed);
}

function displaySMSPreview(parsed) {
    const previewDiv = document.getElementById('smsParsePreview');
    const detailsDiv = document.getElementById('parsedDetails');
    const addBtn = document.getElementById('addParsedTransactionBtn');
    
    const typeColor = parsed.type === 'credit' ? '#10b981' : '#ef4444';
    const typeIcon = parsed.type === 'credit' ? '⬇️' : '⬆️';
    const typeText = parsed.type === 'credit' ? 'Income' : 'Expense';
    
    detailsDiv.innerHTML = `
        <div class="parsed-item">
            <strong>Amount:</strong> Rs. ${parsed.amount.toLocaleString()}
        </div>
        <div class="parsed-item">
            <strong>Type:</strong> <span style="color: ${typeColor};">${typeIcon} ${typeText}</span>
        </div>
        <div class="parsed-item">
            <strong>Bank:</strong> ${parsed.bank}
        </div>
        <div class="parsed-item">
            <strong>Date:</strong> ${parsed.date.toLocaleDateString()}
        </div>
        <div class="parsed-item">
            <strong>Description:</strong> ${parsed.remarks || 'Bank Transaction'}
        </div>
        <div class="parsed-item">
            <strong>Confidence:</strong> ${parsed.confidence}%
        </div>
    `;
    
    previewDiv.style.display = 'block';
    addBtn.style.display = 'inline-flex';
}

function addParsedTransaction() {
    if (!currentParsedSMS) {
        showNotification('No parsed SMS data available', 'error');
        return;
    }
    
    const transactionType = currentParsedSMS.type === 'credit' ? 'income' : 'expense';
    
    // Convert to BS date
    const today = getCurrentNepaliDate();
    const bsDate = formatBsDate(today.year, today.month, today.day);
    
    // Create transaction data
    const transactionData = {
        date_bs: bsDate,
        category: mapBankTransactionToCategory(currentParsedSMS),
        currency: 'NPR',
        amount: currentParsedSMS.amount,
        description: `${currentParsedSMS.bank}: ${currentParsedSMS.remarks || 'Bank Transaction'}`,
        type: transactionType,
        source: 'sms_parser',
        bank: currentParsedSMS.bank,
        rawSMS: currentParsedSMS.rawSMS,
        confidence: currentParsedSMS.confidence
    };
    
    // Add to appropriate database
    addSMSTransactionToTracker(transactionData, transactionType);
    
    // Clear and reset
    clearSMSInput();
    showNotification(`✅ ${transactionType === 'income' ? 'Income' : 'Expense'} of Rs. ${currentParsedSMS.amount.toLocaleString()} added successfully!`, 'success');
}

function mapBankTransactionToCategory(parsedSMS) {
    const remarks = String(parsedSMS.remarks || '').toLowerCase();
    const bank = String(parsedSMS.bank || '').toLowerCase();
    
    // Income categories
    if (parsedSMS.type === 'credit') {
        if (remarks.includes('salary') || remarks.includes('pay')) return 'Salary';
        if (remarks.includes('refund') || remarks.includes('cashback')) return 'Refund';
        if (remarks.includes('transfer') || remarks.includes('received')) return 'Transfer';
        if (bank.includes('esewa') || bank.includes('khalti')) return 'Digital Payment';
        return 'Other Income';
    }
    
    // Expense categories
    if (parsedSMS.type === 'debit') {
        if (remarks.includes('atm') || remarks.includes('withdraw')) return 'Cash Withdrawal';
        if (remarks.includes('purchase') || remarks.includes('shop')) return 'Shopping';
        if (remarks.includes('food') || remarks.includes('restaurant')) return 'Food & Dining';
        if (remarks.includes('fuel') || remarks.includes('petrol')) return 'Transportation';
        if (remarks.includes('bill') || remarks.includes('utility')) return 'Bills & Utilities';
        if (remarks.includes('transfer') || remarks.includes('sent')) return 'Transfer';
        if (bank.includes('esewa') || bank.includes('khalti')) return 'Digital Payment';
        return 'Other Expense';
    }
    
    return 'Uncategorized';
}

async function addSMSTransactionToTracker(transactionData, type) {
    try {
        if (type === 'income') {
            await incomeDB.add(transactionData);
        } else {
            await expenseDB.add(transactionData);
        }
        
        // Refresh tracker list
        await renderTrackerList();
        
        // Update recent SMS transactions list
        updateRecentSMSTransactions();
        
    } catch (error) {
        console.error('Error adding SMS transaction:', error);
        showNotification('Error adding transaction to tracker', 'error');
    }
}

function clearSMSInput() {
    document.getElementById('smsInput').value = '';
    document.getElementById('smsParsePreview').style.display = 'none';
    document.getElementById('addParsedTransactionBtn').style.display = 'none';
    currentParsedSMS = null;
}

async function readClipboardSMS() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('smsInput').value = text;
        showNotification('SMS text pasted from clipboard', 'success');
    } catch (error) {
        showNotification('Could not read from clipboard. Please paste manually.', 'error');
    }
}

function updateRecentSMSTransactions() {
    const recentSmsList = document.getElementById('recentSmsList');
    if (!recentSmsList) return;
    
    // Get recent transactions from SMS parser
    // This would ideally query the database for recent SMS-sourced transactions
    // For now, show a placeholder
    recentSmsList.innerHTML = `
        <div class="empty-state">
            <p>No recent SMS transactions found</p>
        </div>
    `;
}

// Module tab switching for tracker
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('module-tab')) {
        const module = e.target.dataset.module;
        
        // Update active tab
        document.querySelectorAll('.module-tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show corresponding module
        document.querySelectorAll('.finance-module').forEach(mod => mod.classList.remove('active'));
        document.getElementById(module + 'Module').classList.add('active');
        
        // Initialize SMS parser module if selected
        if (module === 'smsParser') {
            // Initialize SMS parser module
            console.log('SMS parser module initialized');
        }
    }
});

// Initialize medicine tracker when view is shown
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-tab') && e.target.dataset.view === 'medicine') {
        setTimeout(() => {
            if (typeof renderMedicineList === 'function') renderMedicineList();
            if (typeof updateMedicineStats === 'function') updateMedicineStats();
            if (typeof updateMemberFilter === 'function') updateMemberFilter();
            if (typeof renderFamilyMembersList === 'function') renderFamilyMembersList();
            if (typeof renderScheduleList === 'function') renderScheduleList();
        }, 100);
    }
});

// Additional event listener setup for medicine tracker buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for medicine tracker buttons
    setTimeout(() => {
        const addMedicineBtn = document.getElementById('addMedicineBtn');
        const addFamilyMemberBtn = document.getElementById('addFamilyMemberBtn');
        const medicineExportBtn = document.getElementById('medicineExportBtn');
        const medicineImportBtn = document.getElementById('medicineImportBtn');
        
        console.log('🔧 Medicine tracker buttons setup:', {
            addMedicineBtn: !!addMedicineBtn,
            addFamilyMemberBtn: !!addFamilyMemberBtn,
            medicineExportBtn: !!medicineExportBtn,
            medicineImportBtn: !!medicineImportBtn,
            showMedicineForm: typeof showMedicineForm,
            showFamilyMemberForm: typeof showFamilyMemberForm
        });
        
        if (addMedicineBtn) {
            addMedicineBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('📋 Add Medicine button clicked');
                try {
                    if (typeof showMedicineForm === 'function') {
                        showMedicineForm();
                    } else {
                        console.error('❌ showMedicineForm function not available');
                        showNotification('Medicine form function not available', 'error');
                    }
                } catch (error) {
                    console.error('❌ Error opening medicine form:', error);
                    showNotification('Error opening medicine form', 'error');
                }
            });
        } else {
            console.error('❌ Add Medicine button not found');
        }
        
        if (addFamilyMemberBtn) {
            addFamilyMemberBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('👪 Add Family Member button clicked');
                try {
                    if (typeof showFamilyMemberForm === 'function') {
                        showFamilyMemberForm();
                    } else {
                        console.error('❌ showFamilyMemberForm function not available');
                        showNotification('Family member form function not available', 'error');
                    }
                } catch (error) {
                    console.error('❌ Error opening family member form:', error);
                    showNotification('Error opening family member form', 'error');
                }
            });
        } else {
            console.error('❌ Add Family Member button not found');
        }
        
        // Export dropdown toggle
        if (medicineExportBtn) {
            medicineExportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown('medicineExportMenu');
            });
        }
        
        // Import dropdown toggle
        if (medicineImportBtn) {
            medicineImportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown('medicineImportMenu');
            });
        }
        
        console.log('🔧 Medicine tracker buttons initialized');
    }, 500);
});

window.parseAndPreviewSMS = parseAndPreviewSMS;
window.addParsedTransaction = addParsedTransaction;
window.clearSMSInput = clearSMSInput;
window.readClipboardSMS = readClipboardSMS;

// ============================================
// MEDICINE TRACKER MODULE
// ============================================

// Implemented in medicine-tracker.js

// Module tab switching for medicine tracker
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('module-tab') && e.target.closest('#medicineView')) {
        const module = e.target.dataset.module;
        
        // Update active tab
        document.querySelectorAll('#medicineView .module-tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show corresponding module
        document.querySelectorAll('#medicineView .medicine-module').forEach(mod => mod.classList.remove('active'));
        document.getElementById(module + 'Module').classList.add('active');
        
        // Initialize module
        if (module === 'medicines') {
            if (typeof renderMedicineList === 'function') renderMedicineList();
            if (typeof updateMedicineStats === 'function') updateMedicineStats();
        } else if (module === 'family') {
            if (typeof renderFamilyMembersList === 'function') renderFamilyMembersList();
        } else if (module === 'schedule') {
            if (typeof renderScheduleList === 'function') renderScheduleList();
        } else if (module === 'prescriptions') {
            if (typeof renderPrescriptionsList === 'function') renderPrescriptionsList();
        }
    }
});

// Make functions globally accessible
if (typeof showMedicineForm === 'function') window.showMedicineForm = showMedicineForm;
if (typeof showFamilyMemberForm === 'function') window.showFamilyMemberForm = showFamilyMemberForm;
if (typeof deleteMedicine === 'function') window.deleteMedicine = deleteMedicine;
if (typeof deleteFamilyMember === 'function') window.deleteFamilyMember = deleteFamilyMember;
if (typeof buyMedicine === 'function') window.buyMedicine = buyMedicine;
if (typeof checkLowStockMedicines === 'function') window.checkLowStockMedicines = checkLowStockMedicines;

// ... (rest of the code remains the same)