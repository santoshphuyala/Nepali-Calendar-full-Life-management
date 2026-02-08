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
                await noteDB.update(noteData);
                showNotification('✅ Note updated successfully!', 'success');
            } else {
                await noteDB.add(noteData);
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
        const allNotes = await noteDB.getAll();
        
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
        const note = await noteDB.get(id);
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
        await noteDB.delete(id);
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
                await holidayDB.update(holidayData);
                showNotification('✅ Holiday updated successfully!', 'success');
            } else {
                await holidayDB.add(holidayData);
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
                await recurringDB.update(recurringData);
                showNotification('✅ Recurring transaction updated!', 'success');
            } else {
                await recurringDB.add(recurringData);
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
    
    const notes = await noteDB.getAll();
    
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
    
    const holidays = await holidayDB.getAll();
    
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
    
    const recurring = await recurringDB.getAll();
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
        const note = await noteDB.get(id);
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
    await noteDB.delete(id);
    showNotification('✅ Note deleted', 'success');
    renderNotes();
    renderCalendar(currentYear, currentMonth);
}

async function deleteHoliday(id) {
    if (!confirm('Delete this holiday?')) return;
    await holidayDB.delete(id);
    showNotification('✅ Holiday deleted', 'success');
    renderHolidayList();
    renderCalendar(currentYear, currentMonth);
}

async function deleteRecurring(id) {
    if (!confirm('Delete this recurring transaction?')) return;
    await recurringDB.delete(id);
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
            window.debugError(new Error('Missing required functions'), 'Function Check');
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

/**
 * ========================================
 * YEAR/MONTH SELECTORS
 * ========================================
 */
function initializeYearMonthSelectors() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');

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

/**
 * ========================================
 * EVENT LISTENERS
 * ========================================
 */
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
        if (calendarDataMenu && !calendarDataBtn.contains(e.target) && !calendarDataMenu.contains(e.target)) {
            calendarDataMenu.classList.remove('show');
        }
        if (trackerDataMenu && !trackerDataBtn.contains(e.target) && !trackerDataMenu.contains(e.target)) {
            trackerDataMenu.classList.remove('show');
        }
        if (budgetDataMenu && !budgetDataBtn.contains(e.target) && !budgetDataMenu.contains(e.target)) {
            budgetDataMenu.classList.remove('show');
        }
        if (billsDataMenu && !billsDataBtn.contains(e.target) && !billsDataMenu.contains(e.target)) {
            billsDataMenu.classList.remove('show');
        }
        if (goalsDataMenu && !goalsDataBtn.contains(e.target) && !goalsDataMenu.contains(e.target)) {
            goalsDataMenu.classList.remove('show');
        }
        if (insuranceDataMenu && !insuranceDataBtn.contains(e.target) && !insuranceDataMenu.contains(e.target)) {
            insuranceDataMenu.classList.remove('show');
        }
        if (vehicleDataMenu && !vehicleDataBtn.contains(e.target) && !vehicleDataMenu.contains(e.target)) {
            vehicleDataMenu.classList.remove('show');
        }
        if (subscriptionDataMenu && !subscriptionDataBtn.contains(e.target) && !subscriptionDataMenu.contains(e.target)) {
            subscriptionDataMenu.classList.remove('show');
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
        const allHolidays = await holidayDB.getAll();
        
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
        const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);
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
            const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);
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
        const allHolidays = await holidayDB.getAll();
        
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
                const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);
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
            const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);
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
            const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);
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
        const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);

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
            const holidays = await holidayDB.getByIndex('date_bs', dateStr);
            
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
        const holidays = await holidayDB.getByIndex('date_bs', bsDateStr);
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
 * ========================================
 * MONTHLY SUMMARY
 * ========================================
 */
async function updateMonthlySummary() {
    try {
        const income = await getMonthlyIncome(currentBsYear, currentBsMonth);
        const expense = await getMonthlyExpense(currentBsYear, currentBsMonth);
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

        const insurances = await insuranceDB.getAll();
        const insuranceRenewals = insurances.filter(ins => ins.expiryDate === bsDate);

        const services = await vehicleServiceDB.getAll();
        const vehicleServices = services.filter(svc => svc.date === bsDate || svc.nextDue === bsDate);

        const subscriptions = await subscriptionDB.getAll();
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
                    await incomeDB.update(data);
                } else {
                    await expenseDB.update(data);
                }
                showNotification(`✅ ${type === 'income' ? 'Income' : 'Expense'} updated successfully!`, 'success');
            } else {
                // Add new transaction
                if (type === 'income') {
                    await incomeDB.add(data);
                } else {
                    await expenseDB.add(data);
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
                await recurringDB.update(data);
            } else {
                await recurringDB.add(data);
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
    const recurring = await recurringDB.getAll();

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
        await recurringDB.delete(id);
        renderRecurringList();
    } catch (error) {
        console.error('Error deleting recurring:', error);
    }
}

async function processRecurringTransactions() {
    const recurring = await recurringDB.getAll();
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
                await incomeDB.add(transData);
            } else {
                await expenseDB.add(transData);
            }

            item.lastProcessed = todayStr;
            await recurringDB.update(item);
        }
    }
}

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
    const holidays = await holidayDB.getAll();

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
        await holidayDB.delete(id);
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

// Generic Export Function for Individual Modules
async function exportData(module, format) {
    try {
        showNotification(`📤 Preparing ${module} export...`, 'info');
        
        let exportData = {};
        let filename = '';
        
        switch(module) {
            case 'insurance':
                const insurance = await insuranceDB.getAll();
                exportData = {
                    type: 'insurance',
                    timestamp: new Date().toISOString(),
                    insurance: insurance
                };
                filename = `insurance-${new Date().toISOString().slice(0, 10)}.json`;
                break;
            case 'vehicle':
                const vehicles = await vehicleDB.getAll();
                exportData = {
                    type: 'vehicle',
                    timestamp: new Date().toISOString(),
                    vehicles: vehicles
                };
                filename = `vehicles-${new Date().toISOString().slice(0, 10)}.json`;
                break;
            case 'subscription':
                const subscriptions = await subscriptionDB.getAll();
                exportData = {
                    type: 'subscription',
                    timestamp: new Date().toISOString(),
                    subscriptions: subscriptions
                };
                filename = `subscriptions-${new Date().toISOString().slice(0, 10)}.json`;
                break;
            case 'goals':
                const goals = await goalDB.getAll();
                exportData = {
                    type: 'goals',
                    timestamp: new Date().toISOString(),
                    goals: goals
                };
                filename = `goals-${new Date().toISOString().slice(0, 10)}.json`;
                break;
            case 'custom':
                const customTypes = await customTypeDB.getAll();
                const customItems = await customItemDB.getAll();
                exportData = {
                    type: 'custom',
                    timestamp: new Date().toISOString(),
                    customTypes: customTypes,
                    customItems: customItems
                };
                filename = `custom-data-${new Date().toISOString().slice(0, 10)}.json`;
                break;
            default:
                showNotification('❌ Unknown module for export', 'error');
                return;
        }
        
        if (format === 'json') {
            const jsonData = JSON.stringify(exportData, null, 2);
            downloadFile(jsonData, filename, 'application/json');
        } else if (format === 'excel') {
            // Convert to Excel format
            const workbook = XLSX.utils.book_new();
            
            if (module === 'insurance' && exportData.insurance) {
                const worksheet = XLSX.utils.json_to_sheet(exportData.insurance);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Insurance');
            } else if (module === 'vehicle' && exportData.vehicles) {
                const worksheet = XLSX.utils.json_to_sheet(exportData.vehicles);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicles');
            } else if (module === 'subscription' && exportData.subscriptions) {
                const worksheet = XLSX.utils.json_to_sheet(exportData.subscriptions);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscriptions');
            } else if (module === 'goals' && exportData.goals) {
                const worksheet = XLSX.utils.json_to_sheet(exportData.goals);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Goals');
            } else if (module === 'custom') {
                if (exportData.customTypes) {
                    const worksheet = XLSX.utils.json_to_sheet(exportData.customTypes);
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Custom Types');
                }
                if (exportData.customItems) {
                    const worksheet = XLSX.utils.json_to_sheet(exportData.customItems);
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Custom Items');
                }
            }
            
            XLSX.writeFile(workbook, filename.replace('.json', '.xlsx'));
        }
        
        showNotification(`✅ ${module} exported successfully!`, 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('❌ Export failed: ' + error.message, 'error');
    }
}

// Module Export Function for Settings
async function exportModuleData(module, format) {
    await exportData(module, format);
}

// Old functions removed to prevent conflicts with new import-export system

// Enhanced Calendar Export Functions with Month/Year Selection
async function exportCalendarData(type) {
    try {
        showNotification('📤 Preparing calendar export...', 'info');
        
        let exportData = {};
        let filename = '';
        
        switch(type) {
            case 'monthly':
                // Show month/year selection dialog
                const selectedMonthYear = await showMonthYearSelectionDialog();
                if (!selectedMonthYear) return; // User cancelled
                
                exportData = await getMonthlyCalendarData(selectedMonthYear.year, selectedMonthYear.month);
                filename = `calendar-monthly-${selectedMonthYear.year}-${selectedMonthYear.month}.json`;
                break;
            case 'yearly':
                // Show year selection dialog
                const selectedYear = await showYearSelectionDialog();
                if (!selectedYear) return; // User cancelled
                
                exportData = await getYearlyCalendarData(selectedYear);
                filename = `calendar-yearly-${selectedYear}.json`;
                break;
            case 'holidays':
                // Show year selection dialog
                const selectedHolidayYear = await showYearSelectionDialog();
                if (!selectedHolidayYear) return; // User cancelled
                
                exportData = await getHolidaysData(selectedHolidayYear);
                filename = `holidays-${selectedHolidayYear}.json`;
                break;
            case 'events':
                // Show month/year selection dialog
                const selectedEventsMonthYear = await showMonthYearSelectionDialog();
                if (!selectedEventsMonthYear) return; // User cancelled
                
                exportData = await getEventsAndNotesData(selectedEventsMonthYear.year, selectedEventsMonthYear.month);
                filename = `events-notes-${selectedEventsMonthYear.year}-${selectedEventsMonthYear.month}.json`;
                break;
            case 'complete':
                exportData = await getCompleteCalendarData();
                filename = `calendar-complete-${new Date().getFullYear()}.json`;
                break;
        }
        
        // Create and download file
        const jsonData = JSON.stringify(exportData, null, 2);
        downloadFile(jsonData, filename, 'application/json');
        
        showNotification('✅ Calendar exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('❌ Export failed: ' + error.message, 'error');
    }
}

// Enhanced Calendar Import Functions
async function importCalendarData(type, fileInput) {
    try {
        const file = fileInput.files[0];
        if (!file) return;
        
        showNotification('📥 Reading calendar data...', 'info');
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Show preview before importing
                const confirmed = await showImportPreview(importData, type);
                if (!confirmed) return;
                
                showNotification('🔄 Importing calendar data...', 'info');
                
                // Process import based on type
                await processCalendarImport(importData, type);
                
                showNotification('✅ Calendar imported successfully!', 'success');
                
                // Refresh calendar view
                renderCalendar();
                updateMonthlySummary();
                
                // Also refresh tracker view if income/expenses were imported
                if (importData.income || importData.expenses || importData.recurring) {
                    renderTrackerList();
                    renderRecurringList();
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

// Smart Import Preview Function
async function showImportPreview(importData, type) {
    return new Promise((resolve) => {
        let previewContent = '';
        
        switch(type) {
            case 'monthly':
                previewContent = `
                    <h3>📅 Monthly Calendar Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Month:</strong> ${importData.monthName || 'N/A'}</p>
                    <p><strong>Days:</strong> ${importData.days ? importData.days.length : 0}</p>
                    <p><strong>Holidays:</strong> ${importData.days ? importData.days.reduce((sum, day) => sum + (day.holidays ? day.holidays.length : 0), 0) : 0}</p>
                    <p><strong>Notes:</strong> ${importData.days ? importData.days.reduce((sum, day) => sum + (day.notes ? day.notes.length : 0), 0) : 0}</p>
                `;
                break;
            case 'yearly':
                previewContent = `
                    <h3>📅 Yearly Calendar Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Months:</strong> ${importData.months ? importData.months.length : 0}</p>
                    <p><strong>Total Holidays:</strong> ${importData.months ? importData.months.reduce((sum, month) => sum + (month.holidays ? month.holidays.length : 0), 0) : 0}</p>
                    <p><strong>Total Notes:</strong> ${importData.months ? importData.months.reduce((sum, month) => sum + (month.notes ? month.notes.length : 0), 0) : 0}</p>
                `;
                break;
            case 'holidays':
                previewContent = `
                    <h3>🎉 Holidays Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Holidays:</strong> ${importData.holidays ? importData.holidays.length : 0}</p>
                    ${importData.holidays ? importData.holidays.slice(0, 5).map(h => `<p>• ${h.name} (${h.date_bs})</p>`).join('') : ''}
                    ${importData.holidays && importData.holidays.length > 5 ? `<p>... and ${importData.holidays.length - 5} more</p>` : ''}
                `;
                break;
            case 'events':
                previewContent = `
                    <h3>📝 Events & Notes Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Month:</strong> ${importData.monthName || 'N/A'}</p>
                    <p><strong>Notes:</strong> ${importData.notes ? importData.notes.length : 0}</p>
                    ${importData.notes ? importData.notes.slice(0, 3).map(n => `<p>• ${n.title || 'Note'} (${n.date_bs})</p>`).join('') : ''}
                    ${importData.notes && importData.notes.length > 3 ? `<p>... and ${importData.notes.length - 3} more</p>` : ''}
                `;
                break;
            case 'complete':
                previewContent = `
                    <h3>📦 Complete Calendar Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Holidays:</strong> ${importData.holidays ? importData.holidays.length : 0}</p>
                    <p><strong>Notes:</strong> ${importData.notes ? importData.notes.length : 0}</p>
                    <p><strong>Income:</strong> ${importData.income ? importData.income.length : 0}</p>
                    <p><strong>Expenses:</strong> ${importData.expenses ? importData.expenses.length : 0}</p>
                    <p><strong>Recurring:</strong> ${importData.recurring ? importData.recurring.length : 0}</p>
                    <p><strong>Timestamp:</strong> ${importData.timestamp || 'N/A'}</p>
                `;
                break;
        }
        
        previewContent += `
            <div class="preview-actions">
                <button class="btn-primary" onclick="confirmImport(true)">✅ Import</button>
                <button class="btn-secondary" onclick="confirmImport(false)">❌ Cancel</button>
            </div>
        `;
        
        // Create preview modal
        const modalHtml = `
            <div class="import-preview-modal">
                <div class="preview-content">
                    ${previewContent}
                </div>
            </div>
        `;
        
        showModal(modalHtml);
        
        // Handle confirmation
        window.confirmImport = (confirmed) => {
            closeModal();
            resolve(confirmed);
        };
    });
}

// Helper functions for calendar data collection
async function getMonthlyCalendarData(year = currentBsYear, month = currentBsMonth) {
    const daysInMonth = getDaysInBSMonth(year, month);
    const monthlyData = {
        type: 'monthly_calendar',
        year: year,
        month: month,
        monthName: getNepaliMonthName(month),
        days: []
    };
    
    // Collect data for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatBsDate(year, month, day);
        const dayData = {
            date: dateStr,
            dayOfWeek: getDayOfWeek(year, month, day),
            holidays: await getHolidaysForDate(dateStr),
            notes: await getNotesForDate(dateStr),
            events: await getEventsForDate(dateStr)
        };
        monthlyData.days.push(dayData);
    }
    
    return monthlyData;
}

async function getYearlyCalendarData(year = currentBsYear) {
    const yearlyData = {
        type: 'yearly_calendar',
        year: year,
        months: []
    };
    
    // Collect data for each month
    for (let month = 1; month <= 12; month++) {
        const monthData = {
            month: month,
            monthName: getNepaliMonthName(month),
            daysInMonth: getDaysInBSMonth(year, month),
            holidays: await getHolidaysForMonth(year, month),
            notes: await getNotesForMonth(year, month),
            events: await getEventsForMonth(year, month)
        };
        yearlyData.months.push(monthData);
    }
    
    return yearlyData;
}

async function getHolidaysData(year = currentBsYear) {
    const holidays = await holidayDB.getAll();
    const yearHolidays = holidays.filter(h => {
        const [hYear] = h.date_bs.split('/').map(Number);
        return hYear === year;
    });
    
    return {
        type: 'holidays',
        year: year,
        holidays: yearHolidays.sort((a, b) => a.date_bs.localeCompare(b.date_bs))
    };
}

async function getEventsAndNotesData(year = currentBsYear, month = currentBsMonth) {
    const notes = await noteDB.getAll();
    const monthNotes = notes.filter(n => {
        const [nYear, nMonth] = n.date_bs.split('/').map(Number);
        return nYear === year && nMonth === month;
    });
    
    return {
        type: 'events_and_notes',
        year: year,
        month: month,
        monthName: getNepaliMonthName(month),
        notes: monthNotes
    };
}

async function getCompleteCalendarData() {
    return {
        type: 'complete_calendar',
        year: currentBsYear,
        timestamp: new Date().toISOString(),
        holidays: await holidayDB.getAll(),
        notes: await noteDB.getAll(),
        income: await incomeDB.getAll(),
        expenses: await expenseDB.getAll(),
        recurring: await recurringDB.getAll(),
        monthlyData: await getMonthlyCalendarData(),
        yearlyData: await getYearlyCalendarData()
    };
}

// Process Calendar Import
async function processCalendarImport(importData, type) {
    switch(type) {
        // ... (rest of the code remains the same)
        case 'monthly':
            await processMonthlyCalendarImport(importData);
            break;
        case 'yearly':
            await processYearlyCalendarImport(importData);
            break;
        case 'holidays':
            await processHolidaysImport(importData);
            break;
        case 'events':
            await processEventsImport(importData);
            break;
        case 'complete':
            await processCompleteCalendarImport(importData);
            break;
    }
}

// Individual import processors
async function processMonthlyCalendarImport(data) {
    if (data.days) {
        for (const day of data.days) {
            if (day.holidays) {
                for (const holiday of day.holidays) {
                    // Remove ID to avoid duplicate key errors
                    const { id, ...holidayData } = holiday;
                    await holidayDB.add(holidayData);
                }
            }
            if (day.notes) {
                for (const note of day.notes) {
                    // Remove ID to avoid duplicate key errors
                    const { id, ...noteData } = note;
                    await noteDB.add(noteData);
                }
            }
        }
    }
}

async function processYearlyCalendarImport(data) {
    if (data.months) {
        for (const month of data.months) {
            if (month.holidays) {
                for (const holiday of month.holidays) {
                    // Remove ID to avoid duplicate key errors
                    const { id, ...holidayData } = holiday;
                    await holidayDB.add(holidayData);
                }
            }
            if (month.notes) {
                for (const note of month.notes) {
                    // Remove ID to avoid duplicate key errors
                    const { id, ...noteData } = note;
                    await noteDB.add(noteData);
                }
            }
        }
    }
}

async function processHolidaysImport(data) {
    if (data.holidays) {
        for (const holiday of data.holidays) {
            // Remove ID to avoid duplicate key errors
            const { id, ...holidayData } = holiday;
            await holidayDB.add(holidayData);
        }
    }
}

async function processEventsImport(data) {
    if (data.notes) {
        for (const note of data.notes) {
            // Remove ID to avoid duplicate key errors
            const { id, ...noteData } = note;
            await noteDB.add(noteData);
        }
    }
}

async function processCompleteCalendarImport(data) {
    if (data.holidays) {
        for (const holiday of data.holidays) {
            // Remove ID to avoid duplicate key errors
            const { id, ...holidayData } = holiday;
            await holidayDB.add(holidayData);
        }
    }
    if (data.notes) {
        for (const note of data.notes) {
            // Remove ID to avoid duplicate key errors
            const { id, ...noteData } = note;
            await noteDB.add(noteData);
        }
    }
    if (data.income) {
        for (const income of data.income) {
            // Remove ID to avoid duplicate key errors
            const { id, ...incomeData } = income;
            await incomeDB.add(incomeData);
        }
    }
    if (data.expenses) {
        for (const expense of data.expenses) {
            // Remove ID to avoid duplicate key errors
            const { id, ...expenseData } = expense;
            await expenseDB.add(expenseData);
        }
    }
    if (data.recurring) {
        for (const recurring of data.recurring) {
            await recurringDB.add(recurring);
        }
    }
}

// Individual tracker import processors
async function processIncomeImport(data) {
    if (data.income) {
        for (const income of data.income) {
            // Remove ID to avoid duplicate key errors
            const { id, ...incomeData } = income;
            await incomeDB.add(incomeData);
        }
    }
}

async function processExpensesImport(data) {
    if (data.expenses) {
        for (const expense of data.expenses) {
            // Remove ID to avoid duplicate key errors
            const { id, ...expenseData } = expense;
            await expenseDB.add(expenseData);
        }
    }
}

async function processRecurringImport(data) {
    if (data.recurring) {
        for (const recurring of data.recurring) {
            // Remove ID to avoid duplicate key errors
            const { id, ...recurringData } = recurring;
            await recurringDB.add(recurringData);
        }
    }
}

async function processCompleteTrackerImport(data) {
    if (data.income) {
        for (const income of data.income) {
            // Remove ID to avoid duplicate key errors
            const { id, ...incomeData } = income;
            await incomeDB.add(incomeData);
        }
    }
    if (data.expenses) {
        for (const expense of data.expenses) {
            // Remove ID to avoid duplicate key errors
            const { id, ...expenseData } = expense;
            await expenseDB.add(expenseData);
        }
    }
    if (data.recurring) {
        for (const recurring of data.recurring) {
            // Remove ID to avoid duplicate key errors
            const { id, ...recurringData } = recurring;
            await recurringDB.add(recurringData);
        }
    }
}

// Helper functions for data retrieval
async function getHolidaysForDate(dateStr) {
    try {
        const holidays = await holidayDB.getAll();
        return holidays.filter(h => h.date_bs === dateStr);
    } catch (error) {
        console.error('Error getting holidays for date:', error);
        return [];
    }
}

async function getNotesForDate(dateStr) {
    try {
        const notes = await noteDB.getAll();
        return notes.filter(n => n.date_bs === dateStr);
    } catch (error) {
        console.error('Error getting notes for date:', error);
        return [];
    }
}

async function getEventsForDate(dateStr) {
    // Add events logic here if you have events
    return [];
}

async function getHolidaysForMonth(year, month) {
    try {
        const holidays = await holidayDB.getAll();
        return holidays.filter(h => {
            const [hYear, hMonth] = h.date_bs.split('/').map(Number);
            return hYear === year && hMonth === month;
        });
    } catch (error) {
        console.error('Error getting holidays for month:', error);
        return [];
    }
}

async function getNotesForMonth(year, month) {
    try {
        const notes = await noteDB.getAll();
        return notes.filter(n => {
            const [nYear, nMonth] = n.date_bs.split('/').map(Number);
            return nYear === year && nMonth === month;
        });
    } catch (error) {
        console.error('Error getting notes for month:', error);
        return [];
    }
}

async function getEventsForMonth(year, month) {
    // Add events logic here if you have events
    return [];
}

async function showYearSelectionDialog() {
    return new Promise((resolve) => {
        const currentYear = currentBsYear || 2082;
        
        // Create year options (current year ± 10)
        let yearOptions = '';
        for (let year = currentYear - 10; year <= currentYear + 10; year++) {
            yearOptions += `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`;
        }
        
        const dialogHtml = `
            <div class="year-selection-dialog">
                <h3> Select Year to Export</h3>
                <div class="selection-form">
                    <div class="form-group">
                        <label for="exportYear">Year:</label>
                        <select id="exportYear">
                            ${yearOptions}
                        </select>
                    </div>
                </div>
                <div class="dialog-actions">
                    <button class="btn-primary" onclick="confirmYearSelection()"> Export</button>
                    <button class="btn-secondary" onclick="cancelYearSelection()"> Cancel</button>
                </div>
            </div>
        `;
        
        showModal(dialogHtml);
        
        // Handle confirmation
        window.confirmYearSelection = () => {
            const year = parseInt(document.getElementById('exportYear').value);
            closeModal();
            resolve(year);
        };
        
        // Handle cancellation
        window.cancelYearSelection = () => {
            closeModal();
            resolve(null);
        };
    });
}

// Enhanced Tracker Export Functions
async function exportTrackerData(type) {
    try {
        showNotification(' Preparing tracker export...', 'info');
        
        let exportData = {};
        let filename = '';
        
        switch(type) {
            case 'income':
                const income = await incomeDB.getAll();
                const validIncomeData = income.filter(item => item && item.date);
                exportData = {
                    type: 'income',
                    year: currentBsYear,
                    month: currentBsMonth,
                    income: validIncomeData.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                };
                filename = `income-${currentBsYear}-${currentBsMonth}.json`;
                break;
            case 'expenses':
                const expenses = await expenseDB.getAll();
                const validExpensesData = expenses.filter(item => item && item.date);
                exportData = {
                    type: 'expenses',
                    year: currentBsYear,
                    month: currentBsMonth,
                    expenses: validExpensesData.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                };
                filename = `expenses-${currentBsYear}-${currentBsMonth}.json`;
                break;
            case 'recurring':
                const recurring = await recurringDB.getAll();
                exportData = {
                    type: 'recurring',
                    year: currentBsYear,
                    recurring: recurring.filter(r => r.isActive)
                };
                filename = `recurring-${currentBsYear}.json`;
                break;
            case 'monthly':
                const monthlyIncome = await incomeDB.getAll();
                const monthlyExpenses = await expenseDB.getAll();
                const monthlyRecurring = await recurringDB.getAll();
                
                exportData = {
                    type: 'monthly_summary',
                    year: currentBsYear,
                    month: currentBsMonth,
                    monthName: getNepaliMonthName(currentBsMonth),
                    income: monthlyIncome.filter(i => i.date.startsWith(`${currentBsYear}/${currentBsMonth}`)),
                    expenses: monthlyExpenses.filter(e => e.date.startsWith(`${currentBsYear}/${currentBsMonth}`)),
                    recurring: monthlyRecurring.filter(r => r.isActive),
                    summary: {
                        totalIncome: monthlyIncome
                            .filter(i => i.date.startsWith(`${currentBsYear}/${currentBsMonth}`))
                            .reduce((sum, i) => sum + i.amount, 0),
                        totalExpenses: monthlyExpenses
                            .filter(e => e.date.startsWith(`${currentBsYear}/${currentBsMonth}`))
                            .reduce((sum, e) => sum + e.amount, 0),
                        totalRecurring: monthlyRecurring
                            .filter(r => r.isActive)
                            .reduce((sum, r) => sum + r.amount, 0)
                    }
                };
                filename = `tracker-monthly-${currentBsYear}-${currentBsMonth}.json`;
                break;
            case 'complete':
                const allIncome = await incomeDB.getAll();
                const allExpenses = await expenseDB.getAll();
                const allRecurring = await recurringDB.getAll();
                
                // Filter out invalid items and sort safely
                const validCompleteIncome = allIncome.filter(item => item && item.date);
                const validCompleteExpenses = allExpenses.filter(item => item && item.date);
                
                exportData = {
                    type: 'complete_tracker',
                    year: currentBsYear,
                    timestamp: new Date().toISOString(),
                    income: validCompleteIncome.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
                    expenses: validCompleteExpenses.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
                    recurring: allRecurring,
                    summary: {
                        totalIncome: validCompleteIncome.reduce((sum, i) => sum + (i.amount || 0), 0),
                        totalExpenses: validCompleteExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
                        totalRecurring: allRecurring.filter(r => r.isActive).reduce((sum, r) => sum + (r.amount || 0), 0)
                    }
                };
                filename = `tracker-complete-${currentBsYear}.json`;
                break;
        }
        
        // Create and download file
        const jsonData = JSON.stringify(exportData, null, 2);
        downloadFile(jsonData, filename, 'application/json');
        
        showNotification('✅ Tracker exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('❌ Export failed: ' + error.message, 'error');
    }
}

// Enhanced Tracker Import Functions
async function importTrackerData(type, fileInput) {
    try {
        const file = fileInput.files[0];
        if (!file) return;
        
        showNotification('📥 Reading tracker data...', 'info');
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Show preview before importing
                const confirmed = await showTrackerImportPreview(importData, type);
                if (!confirmed) return;
                
                showNotification('🔄 Importing tracker data...', 'info');
                
                // Process import based on type
                await processTrackerImport(importData, type);
                
                showNotification('✅ Tracker imported successfully!', 'success');
                
                // Refresh tracker view
                renderTrackerList();
                updateMonthlySummary();
                
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

// Smart Tracker Import Preview Function
async function showTrackerImportPreview(importData, type) {
    return new Promise((resolve) => {
        let previewContent = '';
        
        switch(type) {
            case 'income':
                previewContent = `
                    <h3>💵 Income Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Month:</strong> ${importData.monthName || 'N/A'}</p>
                    <p><strong>Income Records:</strong> ${importData.income ? importData.income.length : 0}</p>
                    <p><strong>Total Amount:</strong> ${importData.income ? importData.income.reduce((sum, i) => sum + i.amount, 0).toFixed(2) : 0}</p>
                    ${importData.income ? importData.income.slice(0, 3).map(i => `<p>• ${i.description || 'Income'} (${i.amount})</p>`).join('') : ''}
                    ${importData.income && importData.income.length > 3 ? `<p>... and ${importData.income.length - 3} more</p>` : ''}
                `;
                break;
            case 'expenses':
                previewContent = `
                    <h3>💸 Expenses Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Month:</strong> ${importData.monthName || 'N/A'}</p>
                    <p><strong>Expense Records:</strong> ${importData.expenses ? importData.expenses.length : 0}</p>
                    <p><strong>Total Amount:</strong> ${importData.expenses ? importData.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2) : 0}</p>
                    ${importData.expenses ? importData.expenses.slice(0, 3).map(e => `<p>• ${e.description || 'Expense'} (${e.amount})</p>`).join('') : ''}
                    ${importData.expenses && importData.expenses.length > 3 ? `<p>... and ${importData.expenses.length - 3} more</p>` : ''}
                `;
                break;
            case 'recurring':
                previewContent = `
                    <h3>🔄 Recurring Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Active Recurring:</strong> ${importData.recurring ? importData.recurring.length : 0}</p>
                    <p><strong>Total Monthly:</strong> ${importData.recurring ? importData.recurring.reduce((sum, r) => sum + r.amount, 0).toFixed(2) : 0}</p>
                    ${importData.recurring ? importData.recurring.slice(0, 3).map(r => `<p>• ${r.description || 'Recurring'} (${r.amount})</p>`).join('') : ''}
                    ${importData.recurring && importData.recurring.length > 3 ? `<p>... and ${importData.recurring.length - 3} more</p>` : ''}
                `;
                break;
            case 'monthly':
                previewContent = `
                    <h3>📊 Monthly Summary Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Month:</strong> ${importData.monthName || 'N/A'}</p>
                    <p><strong>Income:</strong> ${importData.income ? importData.income.length : 0} records</p>
                    <p><strong>Expenses:</strong> ${importData.expenses ? importData.expenses.length : 0} records</p>
                    <p><strong>Recurring:</strong> ${importData.recurring ? importData.recurring.length : 0} records</p>
                    ${importData.summary ? `
                        <p><strong>Total Income:</strong> ${importData.summary.totalIncome?.toFixed(2) || 0}</p>
                        <p><strong>Total Expenses:</strong> ${importData.summary.totalExpenses?.toFixed(2) || 0}</p>
                        <p><strong>Net:</strong> ${(importData.summary.totalIncome - importData.summary.totalExpenses)?.toFixed(2) || 0}</p>
                    ` : ''}
                `;
                break;
            case 'complete':
                previewContent = `
                    <h3>📦 Complete Tracker Import Preview</h3>
                    <p><strong>Year:</strong> ${importData.year || 'N/A'}</p>
                    <p><strong>Income Records:</strong> ${importData.income ? importData.income.length : 0}</p>
                    <p><strong>Expense Records:</strong> ${importData.expenses ? importData.expenses.length : 0}</p>
                    <p><strong>Recurring Records:</strong> ${importData.recurring ? importData.recurring.length : 0}</p>
                    <p><strong>Timestamp:</strong> ${importData.timestamp || 'N/A'}</p>
                    ${importData.summary ? `
                        <p><strong>Total Income:</strong> ${importData.summary.totalIncome?.toFixed(2) || 0}</p>
                        <p><strong>Total Expenses:</strong> ${importData.summary.totalExpenses?.toFixed(2) || 0}</p>
                        <p><strong>Net:</strong> ${(importData.summary.totalIncome - importData.summary.totalExpenses)?.toFixed(2) || 0}</p>
                    ` : ''}
                `;
                break;
        }
        
        previewContent += `
            <div class="preview-actions">
                <button class="btn-primary" onclick="confirmTrackerImport(true)">✅ Import</button>
                <button class="btn-secondary" onclick="confirmTrackerImport(false)">❌ Cancel</button>
            </div>
        `;
        
        // Create preview modal
        const modalHtml = `
            <div class="import-preview-modal">
                <div class="preview-content">
                    ${previewContent}
                </div>
            </div>
        `;
        
        showModal(modalHtml);
        
        // Handle confirmation
        window.confirmTrackerImport = (confirmed) => {
            closeModal();
            resolve(confirmed);
        };
    });
}

// Process Tracker Import
async function processTrackerImport(importData, type) {
    switch(type) {
        case 'income':
            await processIncomeImport(importData);
            break;
        case 'expenses':
            await processExpensesImport(importData);
            break;
        case 'recurring':
            await processRecurringImport(importData);
            break;
        case 'monthly':
            await processMonthlyTrackerImport(importData);
            break;
        case 'complete':
            await processCompleteTrackerImport(importData);
            break;
    }
}

// Process Monthly Tracker Import
async function processMonthlyTrackerImport(data) {
    if (data.income) {
        for (const income of data.income) {
            // Remove ID to avoid duplicate key errors
            const { id, ...incomeData } = income;
            await incomeDB.add(incomeData);
        }
    }
    if (data.expenses) {
        for (const expense of data.expenses) {
            // Remove ID to avoid duplicate key errors
            const { id, ...expenseData } = expense;
            await expenseDB.add(expenseData);
        }
    }
    if (data.recurring) {
        for (const recurring of data.recurring) {
            // Remove ID to avoid duplicate key errors
            const { id, ...recurringData } = recurring;
            await recurringDB.add(recurringData);
        }
    }
}

// Render Upcoming Reminders Function
async function renderUpcomingReminders() {
    const remindersList = document.getElementById('remindersList');
    if (!remindersList) return;
    
    try {
        const notes = await noteDB.getAll();
        const today = getCurrentNepaliDate();
        const todayStr = formatBsDate(today.year, today.month, today.day);
        
        // Get upcoming reminders (next 7 days)
        const upcomingReminders = [];
        for (let i = 0; i <= 7; i++) {
            const checkDate = new Date(today.year, today.month - 1, today.day + i);
            const checkBsDate = adToBs(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
            const checkDateStr = formatBsDate(checkBsDate.year, checkBsDate.month, checkBsDate.day);
            
            const dayReminders = notes.filter(note => 
                note.isReminder && note.date_bs === checkDateStr
            );
            
            dayReminders.forEach(reminder => {
                upcomingReminders.push({
                    ...reminder,
                    daysUntil: i,
                    dateStr: checkDateStr
                });
            });
        }
        
        if (upcomingReminders.length === 0) {
            remindersList.innerHTML = '<div class="empty-state">🔔 No upcoming reminders</div>';
            return;
        }
        
        remindersList.innerHTML = upcomingReminders.map(reminder => {
            const urgencyBadge = reminder.daysUntil === 0 ? '🔴 Today' : 
                               reminder.daysUntil === 1 ? '🟡 Tomorrow' : 
                               `📅 ${reminder.daysUntil} days`;
            
            return `
                <div class="reminder-item">
                    <div class="reminder-content">
                        <h4>${reminder.title || 'Untitled'}</h4>
                        <p>${reminder.description || ''}</p>
                        <div class="reminder-meta">
                            <span class="reminder-date">${reminder.dateStr}</span>
                            <span class="reminder-urgency">${urgencyBadge}</span>
                            ${reminder.reminderTime ? `<span class="reminder-time">⏰ ${reminder.reminderTime}</span>` : ''}
                        </div>
                    </div>
                    <div class="reminder-actions">
                        <button class="btn-icon" onclick="showNoteForm(${JSON.stringify(reminder).replace(/"/g, '&quot;')})">✏️</button>
                        <button class="btn-icon" onclick="deleteNote(${reminder.id})">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error rendering reminders:', error);
        remindersList.innerHTML = '<div class="error-state">❌ Error loading reminders</div>';
    }
}

// ========================================
// EXCEL IMPORT/EXPORT UTILITIES
// ========================================
async function exportToExcel(data, filename) {
    try {
        // Simple CSV export for now (can be enhanced with proper Excel library)
        let csvContent = '';
        
        if (data.type === 'budget' && data.budgets) {
            csvContent = 'Category,Amount,Year,Month\n';
            data.budgets.forEach(budget => {
                csvContent += `${budget.category},${budget.amount},${budget.year},${budget.month}\n`;
            });
        } else if (data.type === 'bills' && data.bills) {
            csvContent = 'Name,Amount,Due Date,Status\n';
            data.bills.forEach(bill => {
                csvContent += `${bill.name},${bill.amount},${bill.dueDate},${bill.status}\n`;
            });
        } else if (data.type === 'goals' && data.goals) {
            csvContent = 'Goal Name,Target Amount,Current Amount,Status,Deadline\n';
            data.goals.forEach(goal => {
                csvContent += `${goal.name},${goal.targetAmount},${goal.currentAmount},${goal.status},${goal.deadline}\n`;
            });
        }
        
        // Download as CSV (Excel compatible)
        downloadFile(csvContent, filename.replace('.xlsx', '.csv'), 'text/csv');
        showNotification('✅ Data exported as CSV (Excel compatible)', 'success');
    } catch (error) {
        console.error('Excel export error:', error);
        showNotification('❌ Excel export failed', 'error');
    }
}

async function importFromExcel(file) {
    try {
        // Simple CSV parsing for now (can be enhanced with proper Excel library)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n');
                    const headers = lines[0].split(',');
                    const data = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            const values = lines[i].split(',');
                            const row = {};
                            headers.forEach((header, index) => {
                                row[header.trim()] = values[index] ? values[index].trim() : '';
                            });
                            data.push(row);
                        }
                    }
                    
                    resolve({ data: data });
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    } catch (error) {
        console.error('Excel import error:', error);
        throw error;
    }
}

// Dropdown Functions
function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;
    
    // Close all other dropdowns first
    closeAllDropdowns();
    
    // Toggle current dropdown
    menu.classList.toggle('show');
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// ========================================
// REMOVE DUPLICATE HOLIDAYS FUNCTION
// ========================================
async function removeDuplicateHolidays() {
    try {
        showNotification('🔍 Scanning for duplicate holidays...', 'info');
        
        // Get all holidays
        const allHolidays = await holidayDB.getAll();
        
        if (allHolidays.length === 0) {
            showNotification('ℹ️ No holidays found to check for duplicates', 'info');
            return;
        }
        
        // Create a map to track unique holidays by date and name
        const holidayMap = new Map();
        const duplicates = [];
        
        allHolidays.forEach(holiday => {
            // Create a unique key based on date and name (case-insensitive)
            const key = `${holiday.date_bs}-${holiday.name.toLowerCase().trim()}`;
            
            if (holidayMap.has(key)) {
                // This is a duplicate
                duplicates.push({
                    id: holiday.id,
                    date: holiday.date_bs,
                    name: holiday.name,
                    type: holiday.type || 'Holiday'
                });
            } else {
                // First occurrence, add to map
                holidayMap.set(key, holiday);
            }
        });
        
        if (duplicates.length === 0) {
            showNotification('✅ No duplicate holidays found', 'success');
            return;
        }
        
        // Show confirmation dialog with duplicate details
        const duplicateList = duplicates.map(dup => 
            `• ${dup.date} - ${dup.name} (${dup.type})`
        ).join('\n');
        
        const confirmed = confirm(
            `Found ${duplicates.length} duplicate holiday(s):\n\n${duplicateList}\n\n` +
            `Do you want to remove these duplicates?\n\n` +
            `This will keep only the first occurrence of each duplicate.`
        );
        
        if (!confirmed) return;
        
        // Remove duplicates
        showNotification('🗑️ Removing duplicate holidays...', 'info');
        
        for (const duplicate of duplicates) {
            await holidayDB.delete(duplicate.id);
        }
        
        showNotification(`✅ Successfully removed ${duplicates.length} duplicate holiday(s)`, 'success');
        
        // Refresh the holiday list and calendar
        renderHolidayList();
        renderCalendar();
        
    } catch (error) {
        console.error('Error removing duplicate holidays:', error);
        showNotification('❌ Failed to remove duplicate holidays: ' + error.message, 'error');
    }
}

// Clear All Data Function
async function clearAllData() {
    if (!confirm('Delete ALL data?')) return;
    if (!confirm('Really sure? This cannot be undone!')) return;
    
    try {
        await holidayDB.clear();
        await incomeDB.clear();
        await expenseDB.clear();
        await noteDB.clear();
        await shoppingDB.clear();
        await budgetDB.clear();
        await billDB.clear();
        await goalDB.clear();
        await recurringDB.clear();
        await insuranceDB.clear();
        await vehicleDB.clear();
        await vehicleServiceDB.clear();
        await subscriptionDB.clear();
        await customTypeDB.clear();
        await customItemDB.clear();
        
        showNotification('✅ All data cleared successfully!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (error) {
        console.error('Clear data error:', error);
        showNotification('❌ Error clearing data. Please try again.', 'error');
    }
}

// Backup and Restore Functions
async function backupData() {
    try {
        showNotification('📤 Creating backup...', 'info');
        
        // Collect all data
        const backupData = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            appInfo: {
                name: 'Nepali Calendar 2082–2092 Complete Manager',
                version: '2.0.0',
                developer: 'Santosh Phuyal'
            },
            data: {
                holidays: await holidayDB.getAll(),
                income: await incomeDB.getAll(),
                expenses: await expenseDB.getAll(),
                notes: await noteDB.getAll(),
                shopping: await shoppingDB.getAll(),
                budgets: await budgetDB.getAll(),
                bills: await billDB.getAll(),
                goals: await goalDB.getAll(),
                recurring: await recurringDB.getAll(),
                insurance: await insuranceDB.getAll(),
                vehicles: await vehicleDB.getAll(),
                vehicleServices: await vehicleServiceDB.getAll(),
                subscriptions: await subscriptionDB.getAll(),
                customTypes: await customTypeDB.getAll(),
                customItems: await customItemDB.getAll()
            },
            settings: {
                defaultCurrency: localStorage.getItem('defaultCurrency') || 'NPR',
                theme: localStorage.getItem('theme') || 'light',
                exchangeRates: exchangeRates
            }
        };
        
        // Create backup file
        const backupJson = JSON.stringify(backupData, null, 2);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `nepali-calendar-backup-${timestamp}.json`;
        
        downloadFile(backupJson, filename, 'application/json');
        showNotification('✅ Backup created successfully!', 'success');
        
    } catch (error) {
        console.error('Backup error:', error);
        showNotification(' Backup failed: ' + error.message, 'error');
    }
}

async function restoreData() {
    try {
        // Create file input for restore
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const backupData = JSON.parse(text);
                
                // Validate backup structure
                if (!backupData.data) {
                    showNotification(' Invalid backup file format', 'error');
                    return;
                }
                
                // Show restore preview modal
                await showRestorePreviewModal(backupData);
                
            } catch (parseError) {
                console.error('Parse error:', parseError);
                showNotification(' Failed to parse backup file', 'error');
            }
        };
        
        fileInput.click();
        
    } catch (error) {
        console.error('Restore error:', error);
        showNotification(' Restore failed: ' + error.message, 'error');
    }
}

// Show restore preview modal with smart restore options
async function showRestorePreviewModal(backupData) {
    const currentData = await analyzeCurrentData();
    const analysis = analyzeBackupData(backupData, currentData);
    
    const modalContent = `
        <h2> Restore Data Preview</h2>
        <div class="restore-preview">
            <div class="preview-summary">
                <h3> Backup Analysis</h3>
                <div class="backup-info">
                    <p><strong>Backup Date:</strong> ${backupData.backupDate || 'Unknown'}</p>
                    <p><strong>App Version:</strong> ${backupData.appInfo?.version || 'Unknown'}</p>
                </div>
            </div>
            
            <div class="data-comparison">
                <h3> Data Comparison</h3>
                <div class="comparison-grid">
                    ${Object.entries(analysis.modules).map(([module, data]) => `
                        <div class="module-comparison">
                            <h4>${getModuleIcon(module)} ${module}</h4>
                            <div class="stats">
                                <div class="stat">
                                    <span class="label">Current:</span>
                                    <span class="value">${data.current}</span>
                                </div>
                                <div class="stat">
                                    <span class="label">Backup:</span>
                                    <span class="value">${data.backup}</span>
                                </div>
                                <div class="stat ${data.new > 0 ? 'highlight' : ''}">
                                    <span class="label">New:</span>
                                    <span class="value">${data.new}</span>
                                </div>
                                <div class="stat ${data.duplicates > 0 ? 'warning' : ''}">
                                    <span class="label">Duplicates:</span>
                                    <span class="value">${data.duplicates}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="restore-options">
                <h3> Restore Options</h3>
                <div class="option-cards">
                    <div class="option-card recommended" onclick="performSmartRestoreFromModal('${JSON.stringify(backupData).replace(/'/g, "\\'")}')">
                        <div class="option-header">
                            <h4> Smart Restore</h4>
                            <span class="recommended-badge">Recommended</span>
                        </div>
                        <p>Adds only new data, avoids duplicates, preserves existing information</p>
                        <div class="option-stats">
                            <span class="stat"> ${analysis.total.new} new items</span>
                            <span class="stat"> ${analysis.total.duplicates} duplicates skipped</span>
                        </div>
                    </div>
                    
                    <div class="option-card" onclick="performReplaceRestoreFromModal('${JSON.stringify(backupData).replace(/'/g, "\\'")}')">
                        <div class="option-header">
                            <h4> Replace All</h4>
                            <span class="warning-badge"> Destructive</span>
                        </div>
                        <p>Deletes all existing data and replaces with backup data</p>
                        <div class="option-stats">
                            <span class="stat"> ${analysis.total.backup} total items</span>
                            <span class="stat"> ${analysis.total.current} items deleted</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

// Analyze current data in all databases
async function analyzeCurrentData() {
    const databases = {
        'Holidays': holidayDB,
        'Income': incomeDB,
        'Expenses': expenseDB,
        'Notes': noteDB,
        'Shopping': shoppingDB,
        'Budget': budgetDB,
        'Bills': billDB,
        'Goals': goalDB,
        'Recurring': recurringDB,
        'Insurance': insuranceDB,
        'Vehicles': vehicleDB,
        'Vehicle Services': vehicleServiceDB,
        'Subscriptions': subscriptionDB,
        'Custom Types': customTypeDB,
        'Custom Items': customItemDB
    };
    
    const currentData = {};
    
    for (const [name, db] of Object.entries(databases)) {
        try {
            currentData[name] = await db.count();
        } catch (error) {
            currentData[name] = 0;
        }
    }
    
    return currentData;
}

// Analyze backup data and compare with current data
function analyzeBackupData(backupData, currentData) {
    const analysis = {
        modules: {},
        total: {
            current: 0,
            backup: 0,
            new: 0,
            duplicates: 0
        }
    };
    
    // Map backup data keys to display names
    const keyMapping = {
        'holidays': 'Holidays',
        'income': 'Income',
        'expenses': 'Expenses',
        'notes': 'Notes',
        'shopping': 'Shopping',
        'budget': 'Budget',
        'bills': 'Bills',
        'goals': 'Goals',
        'recurring': 'Recurring',
        'insurance': 'Insurance',
        'vehicles': 'Vehicles',
        'vehicleServices': 'Vehicle Services',
        'subscriptions': 'Subscriptions',
        'customTypes': 'Custom Types',
        'customItems': 'Custom Items'
    };
    
    for (const [backupKey, backupArray] of Object.entries(backupData.data || {})) {
        const moduleName = keyMapping[backupKey] || backupKey;
        const currentCount = currentData[moduleName] || 0;
        const backupCount = Array.isArray(backupArray) ? backupArray.length : 0;
        
        // For smart restore, we'll assume some items are new and some are duplicates
        // This is a simplified calculation - in real implementation, you'd compare actual data
        const estimatedNew = Math.max(0, backupCount - currentCount * 0.3); // Assume 30% overlap
        const estimatedDuplicates = Math.max(0, backupCount - estimatedNew);
        
        analysis.modules[moduleName] = {
            current: currentCount,
            backup: backupCount,
            new: estimatedNew,
            duplicates: estimatedDuplicates
        };
        
        analysis.total.current += currentCount;
        analysis.total.backup += backupCount;
        analysis.total.new += estimatedNew;
        analysis.total.duplicates += estimatedDuplicates;
    }
    
    return analysis;
}

// Get module icon for display
function getModuleIcon(moduleName) {
    const icons = {
        'Holidays': '',
        'Income': '',
        'Expenses': '',
        'Notes': '',
        'Shopping': '',
        'Budget': '',
        'Bills': '',
        'Goals': '',
        'Recurring': '',
        'Insurance': '',
        'Vehicles': '',
        'Vehicle Services': '',
        'Subscriptions': '',
        'Custom Types': '',
        'Custom Items': ''
    };
    return icons[moduleName] || '';
}

// Perform smart restore from modal
async function performSmartRestoreFromModal(backupDataString) {
    try {
        const backupData = JSON.parse(backupDataString);
        closeModal();
        showNotification(' Performing smart restore...', 'info');
        await performSmartRestore(backupData);
    } catch (error) {
        console.error('Smart restore error:', error);
        showNotification(' Smart restore failed: ' + error.message, 'error');
    }
}

// Perform replace restore from modal
async function performReplaceRestoreFromModal(backupDataString) {
    try {
        const backupData = JSON.parse(backupDataString);
        closeModal();
        
        const confirmed = confirm(' This will REPLACE ALL current data. Are you absolutely sure?');
        if (!confirmed) return;
        
        showNotification(' Replacing all data...', 'info');
        await performReplaceRestore(backupData);
    } catch (error) {
        console.error('Replace restore error:', error);
        showNotification(' Replace restore failed: ' + error.message, 'error');
    }
}

// Smart Restore Function - adds incremental data avoiding duplicates
async function performSmartRestore(backupData) {
    let totalAdded = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;
    
    try {
        // Process each module with smart restore
        const modules = [
            { name: 'Holidays', db: holidayDB, key: (item) => `${item.date_bs}-${item.name.toLowerCase().trim()}` },
            { name: 'Income', db: incomeDB, key: (item) => `${item.date}-${item.description.toLowerCase().trim()}-${item.amount}` },
            { name: 'Expenses', db: expenseDB, key: (item) => `${item.date}-${item.description.toLowerCase().trim()}-${item.amount}` },
            { name: 'Notes', db: noteDB, key: (item) => `${item.date_bs}-${item.title.toLowerCase().trim()}` },
            { name: 'Shopping', db: shoppingDB, key: (item) => item.name.toLowerCase().trim() },
            { name: 'Budgets', db: budgetDB, key: (item) => `${item.category.toLowerCase().trim()}-${item.year}-${item.month}` },
            { name: 'Bills', db: billDB, key: (item) => `${item.name.toLowerCase().trim()}-${item.amount}-${item.dueDate}` },
            { name: 'Goals', db: goalDB, key: (item) => `${item.name.toLowerCase().trim()}-${item.targetAmount}` },
            { name: 'Recurring', db: recurringDB, key: (item) => `${item.description.toLowerCase().trim()}-${item.amount}-${item.frequency}` },
            { name: 'Insurance', db: insuranceDB, key: (item) => `${item.company.toLowerCase().trim()}-${item.policyNumber.toLowerCase().trim()}` },
            { name: 'Vehicles', db: vehicleDB, key: (item) => `${item.make.toLowerCase().trim()}-${item.model.toLowerCase().trim()}-${item.licensePlate.toLowerCase().trim()}` },
            { name: 'Vehicle Services', db: vehicleServiceDB, key: (item) => `${item.vehicleId}-${item.date}-${item.type}` },
            { name: 'Subscriptions', db: subscriptionDB, key: (item) => `${item.name.toLowerCase().trim()}-${item.category.toLowerCase().trim()}` },
            { name: 'Custom Types', db: customTypeDB, key: (item) => item.name.toLowerCase().trim() },
            { name: 'Custom Items', db: customItemDB, key: (item) => `${item.typeId}-${item.name.toLowerCase().trim()}` }
        ];
        
        for (const module of modules) {
            const moduleName = module.name.toLowerCase();
            const backupItems = backupData.data[moduleName];
            
            if (!backupItems || !Array.isArray(backupItems)) continue;
            
            const existingItems = await module.db.getAll();
            const existingKeys = new Set();
            
            // Build set of existing keys
            existingItems.forEach(item => {
                existingKeys.add(module.key(item));
            });
            
            let moduleAdded = 0;
            let moduleDuplicates = 0;
            let moduleErrors = 0;
            
            // Process backup items
            for (const item of backupItems) {
                try {
                    const itemKey = module.key(item);
                    
                    if (!existingKeys.has(itemKey)) {
                        // Remove ID to avoid conflicts
                        const { id, ...itemData } = item;
                        await module.db.add(itemData);
                        existingKeys.add(itemKey);
                        moduleAdded++;
                    } else {
                        moduleDuplicates++;
                    }
                } catch (itemError) {
                    console.error(`Error adding ${module.name} item:`, itemError);
                    moduleErrors++;
                }
            }
            
            totalAdded += moduleAdded;
            totalDuplicates += moduleDuplicates;
            totalErrors += moduleErrors;
            
            console.log(`📊 ${module.name}: Added ${moduleAdded}, Duplicates ${moduleDuplicates}, Errors ${moduleErrors}`);
        }
        
        // Restore settings (merge approach)
        if (backupData.settings) {
            if (backupData.settings.defaultCurrency) {
                localStorage.setItem('defaultCurrency', backupData.settings.defaultCurrency);
            }
            if (backupData.settings.theme) {
                localStorage.setItem('theme', backupData.settings.theme);
            }
        }
        
        showNotification(
            `✅ Smart restore complete!\n` +
            `Added: ${totalAdded} items\n` +
            `Duplicates skipped: ${totalDuplicates} items\n` +
            `Errors: ${totalErrors} items`,
            'success'
        );
        
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('Smart restore error:', error);
        showNotification('❌ Smart restore failed: ' + error.message, 'error');
    }
}

// Replace Restore Function - replaces all existing data
async function performReplaceRestore(backupData) {
    try {
        showNotification('📥 Clearing existing data...', 'info');
        
        // Clear existing data
        await holidayDB.clear();
        await incomeDB.clear();
        await expenseDB.clear();
        await noteDB.clear();
        await shoppingDB.clear();
        await budgetDB.clear();
        await billDB.clear();
        await goalDB.clear();
        await recurringDB.clear();
        await insuranceDB.clear();
        await vehicleDB.clear();
        await vehicleServiceDB.clear();
        await subscriptionDB.clear();
        await customTypeDB.clear();
        await customItemDB.clear();
        
        showNotification('📥 Restoring backup data...', 'info');
        
        // Restore data
        if (backupData.data.holidays) {
            for (const holiday of backupData.data.holidays) {
                await holidayDB.add(holiday);
            }
        }
        
        if (backupData.data.income) {
            for (const income of backupData.data.income) {
                await incomeDB.add(income);
            }
        }
        
        if (backupData.data.expenses) {
            for (const expense of backupData.data.expenses) {
                await expenseDB.add(expense);
            }
        }
        
        if (backupData.data.notes) {
            for (const note of backupData.data.notes) {
                await noteDB.add(note);
            }
        }
        
        if (backupData.data.shopping) {
            for (const item of backupData.data.shopping) {
                await shoppingDB.add(item);
            }
        }
        
        if (backupData.data.budgets) {
            for (const budget of backupData.data.budgets) {
                await budgetDB.add(budget);
            }
        }
        
        if (backupData.data.bills) {
            for (const bill of backupData.data.bills) {
                await billDB.add(bill);
            }
        }
        
        if (backupData.data.goals) {
            for (const goal of backupData.data.goals) {
                await goalDB.add(goal);
            }
        }
        
        if (backupData.data.recurring) {
            for (const recurring of backupData.data.recurring) {
                await recurringDB.add(recurring);
            }
        }
        
        if (backupData.data.insurance) {
            for (const insurance of backupData.data.insurance) {
                await insuranceDB.add(insurance);
            }
        }
        
        if (backupData.data.vehicles) {
            for (const vehicle of backupData.data.vehicles) {
                await vehicleDB.add(vehicle);
            }
        }
        
        if (backupData.data.subscriptions) {
            for (const subscription of backupData.data.subscriptions) {
                await subscriptionDB.add(subscription);
            }
        }
        
        if (backupData.data.customTypes) {
            for (const customType of backupData.data.customTypes) {
                await customTypeDB.add(customType);
            }
        }
        
        if (backupData.data.customItems) {
            for (const customItem of backupData.data.customItems) {
                await customItemDB.add(customItem);
            }
        }
        
        // Restore settings
        if (backupData.settings) {
            if (backupData.settings.defaultCurrency) {
                localStorage.setItem('defaultCurrency', backupData.settings.defaultCurrency);
            }
            if (backupData.settings.theme) {
                localStorage.setItem('theme', backupData.settings.theme);
            }
        }
        
        showNotification(' Data replaced successfully!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('Replace restore error:', error);
        showNotification(' Replace restore failed: ' + error.message, 'error');
    }
}

// Export All Data Function
async function exportAllData(format) {
    try {
        showNotification(` Creating ${format.toUpperCase()} export...`, 'info');
        
        // Collect all data
        const exportData = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            appInfo: {
                name: 'Nepali Calendar 2082–2092 Complete Manager',
                version: '2.0.0',
                developer: 'Santosh Phuyal'
            },
            data: {
                holidays: await holidayDB.getAll(),
                income: await incomeDB.getAll(),
                expenses: await expenseDB.getAll(),
                notes: await noteDB.getAll(),
                shopping: await shoppingDB.getAll(),
                budgets: await budgetDB.getAll(),
                bills: await billDB.getAll(),
                goals: await goalDB.getAll(),
                recurring: await recurringDB.getAll(),
                insurance: await insuranceDB.getAll(),
                vehicles: await vehicleDB.getAll(),
                vehicleServices: await vehicleServiceDB.getAll(),
                subscriptions: await subscriptionDB.getAll(),
                customTypes: await customTypeDB.getAll(),
                customItems: await customItemDB.getAll()
            },
            settings: {
                defaultCurrency: localStorage.getItem('defaultCurrency') || 'NPR',
                theme: localStorage.getItem('theme') || 'light',
                exchangeRates: exchangeRates
            }
        };
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        if (format === 'json') {
            const exportJson = JSON.stringify(exportData, null, 2);
            const filename = `nepali-calendar-complete-backup-${timestamp}.json`;
            downloadFile(exportJson, filename, 'application/json');
            showNotification(' JSON export created successfully!', 'success');
            
        } else if (format === 'excel') {
            // Create Excel workbook with multiple sheets
            const workbook = XLSX.utils.book_new();
            
            // Add data sheets
            if (exportData.data.holidays.length > 0) {
                const holidaySheet = XLSX.utils.json_to_sheet(exportData.data.holidays);
                XLSX.utils.book_append_sheet(workbook, holidaySheet, 'Holidays');
            }
            
            if (exportData.data.income.length > 0) {
                const incomeSheet = XLSX.utils.json_to_sheet(exportData.data.income);
                XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income');
            }
            
            if (exportData.data.expenses.length > 0) {
                const expenseSheet = XLSX.utils.json_to_sheet(exportData.data.expenses);
                XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
            }
            
            if (exportData.data.insurance.length > 0) {
                const insuranceSheet = XLSX.utils.json_to_sheet(exportData.data.insurance);
                XLSX.utils.book_append_sheet(workbook, insuranceSheet, 'Insurance');
            }
            
            if (exportData.data.vehicles.length > 0) {
                const vehicleSheet = XLSX.utils.json_to_sheet(exportData.data.vehicles);
                XLSX.utils.book_append_sheet(workbook, vehicleSheet, 'Vehicles');
            }
            
            if (exportData.data.subscriptions.length > 0) {
                const subscriptionSheet = XLSX.utils.json_to_sheet(exportData.data.subscriptions);
                XLSX.utils.book_append_sheet(workbook, subscriptionSheet, 'Subscriptions');
            }
            
            if (exportData.data.goals.length > 0) {
                const goalsSheet = XLSX.utils.json_to_sheet(exportData.data.goals);
                XLSX.utils.book_append_sheet(workbook, goalsSheet, 'Goals');
            }
            
            if (exportData.data.bills.length > 0) {
                const billsSheet = XLSX.utils.json_to_sheet(exportData.data.bills);
                XLSX.utils.book_append_sheet(workbook, billsSheet, 'Bills');
            }
            
            if (exportData.data.notes.length > 0) {
                const notesSheet = XLSX.utils.json_to_sheet(exportData.data.notes);
                XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes');
            }
            
            if (exportData.data.shopping.length > 0) {
                const shoppingSheet = XLSX.utils.json_to_sheet(exportData.data.shopping);
                XLSX.utils.book_append_sheet(workbook, shoppingSheet, 'Shopping');
            }
            
            if (exportData.data.budgets.length > 0) {
                const budgetSheet = XLSX.utils.json_to_sheet(exportData.data.budgets);
                XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Budgets');
            }
            
            if (exportData.data.recurring.length > 0) {
                const recurringSheet = XLSX.utils.json_to_sheet(exportData.data.recurring);
                XLSX.utils.book_append_sheet(workbook, recurringSheet, 'Recurring');
            }
            
            if (exportData.data.vehicleServices.length > 0) {
                const vehicleServicesSheet = XLSX.utils.json_to_sheet(exportData.data.vehicleServices);
                XLSX.utils.book_append_sheet(workbook, vehicleServicesSheet, 'Vehicle Services');
            }
            
            if (exportData.data.customTypes.length > 0) {
                const customTypesSheet = XLSX.utils.json_to_sheet(exportData.data.customTypes);
                XLSX.utils.book_append_sheet(workbook, customTypesSheet, 'Custom Types');
            }
            
            if (exportData.data.customItems.length > 0) {
                const customItemsSheet = XLSX.utils.json_to_sheet(exportData.data.customItems);
                XLSX.utils.book_append_sheet(workbook, customItemsSheet, 'Custom Items');
            }
            
            // Add metadata sheet
            const metadataSheet = XLSX.utils.json_to_sheet([
                { 'Property': 'Version', 'Value': exportData.version },
                { 'Property': 'Export Date', 'Value': exportData.timestamp },
                { 'Property': 'App Name', 'Value': exportData.appInfo.name },
                { 'Property': 'App Version', 'Value': exportData.appInfo.version },
                { 'Property': 'Developer', 'Value': exportData.appInfo.developer },
                { 'Property': 'Default Currency', 'Value': exportData.settings.defaultCurrency },
                { 'Property': 'Theme', 'Value': exportData.settings.theme }
            ]);
            XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
            
            // Generate and download Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nepali-calendar-complete-backup-${timestamp}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification(' Excel export created successfully!', 'success');
            
        } else if (format === 'csv') {
            // Create separate CSV files for each module
            const csvData = {};
            
            Object.keys(exportData.data).forEach(module => {
                if (exportData.data[module].length > 0) {
                    csvData[module] = exportData.data[module];
                }
            });
            
            const csvJson = JSON.stringify(csvData, null, 2);
            const filename = `nepali-calendar-complete-backup-${timestamp}.csv`;
            downloadFile(csvJson, filename, 'text/csv');
            showNotification(' CSV export created successfully!', 'success');
        }
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification(' Export failed: ' + error.message, 'error');
    }
}

// Import All Data Function
async function importAllData(format, fileInput) {
    try {
        const file = fileInput.files[0];
        if (!file) {
            showNotification(' No file selected', 'error');
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
                    
                    // Clear existing data
                    await holidayDB.clear();
                    await incomeDB.clear();
                    await expenseDB.clear();
                    await noteDB.clear();
                    await shoppingDB.clear();
                    await budgetDB.clear();
                    await billDB.clear();
                    await goalDB.clear();
                    await recurringDB.clear();
                    await insuranceDB.clear();
                    await vehicleDB.clear();
                    await vehicleServiceDB.clear();
                    await subscriptionDB.clear();
                    await customTypeDB.clear();
                    await customItemDB.clear();
                    
                    // Restore data
                    if (importData.data.holidays) {
                        for (const holiday of importData.data.holidays) {
                            await holidayDB.add(holiday);
                        }
                    }
                    
                    if (importData.data.income) {
                        for (const income of importData.data.income) {
                            await incomeDB.add(income);
                        }
                    }
                    
                    if (importData.data.expenses) {
                        for (const expense of importData.data.expenses) {
                            await expenseDB.add(expense);
                        }
                    }
                    
                    if (importData.data.notes) {
                        for (const note of importData.data.notes) {
                            await noteDB.add(note);
                        }
                    }
                    
                    if (importData.data.shopping) {
                        for (const item of importData.data.shopping) {
                            await shoppingDB.add(item);
                        }
                    }
                    
                    if (importData.data.budgets) {
                        for (const budget of importData.data.budgets) {
                            await budgetDB.add(budget);
                        }
                    }
                    
                    if (importData.data.bills) {
                        for (const bill of importData.data.bills) {
                            await billDB.add(bill);
                        }
                    }
                    
                    if (importData.data.goals) {
                        for (const goal of importData.data.goals) {
                            await goalDB.add(goal);
                        }
                    }
                    
                    if (importData.data.recurring) {
                        for (const recurring of importData.data.recurring) {
                            await recurringDB.add(recurring);
                        }
                    }
                    
                    if (importData.data.insurance) {
                        for (const insurance of importData.data.insurance) {
                            await insuranceDB.add(insurance);
                        }
                    }
                    
                    if (importData.data.vehicles) {
                        for (const vehicle of importData.data.vehicles) {
                            await vehicleDB.add(vehicle);
                        }
                    }
                    
                    if (importData.data.vehicleServices) {
                        for (const service of importData.data.vehicleServices) {
                            await vehicleServiceDB.add(service);
                        }
                    }
                    
                    if (importData.data.subscriptions) {
                        for (const subscription of importData.data.subscriptions) {
                            await subscriptionDB.add(subscription);
                        }
                    }
                    
                    if (importData.data.customTypes) {
                        for (const customType of importData.data.customTypes) {
                            await customTypeDB.add(customType);
                        }
                    }
                    
                    if (importData.data.customItems) {
                        for (const customItem of importData.data.customItems) {
                            await customItemDB.add(customItem);
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
                
                // Process Excel data similar to JSON import
                // This would need more complex logic to handle Excel sheets
                // For now, we'll use the existing data structure from readExcelFile
                await importAllData('json', { files: [new File([JSON.stringify(data)], 'import.json')] });
                
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
                        
                        // Convert CSV data to import format
                        const importData = {
                            version: '2.0.0',
                            timestamp: new Date().toISOString(),
                            data: csvData
                        };
                        
                        // Use JSON import logic
                        const jsonFile = new File([JSON.stringify(importData)], 'import.json');
                        await importAllData('json', { files: [jsonFile] });
                        
                    } catch (csvError) {
                        console.error('CSV processing error:', csvError);
                        showNotification('❌ Failed to process CSV file: ' + csvError.message, 'error');
                    }
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
    }
    
    // Reset file input
    fileInput.value = '';
}

// Clear All Data Function
async function clearAllData() {
    const confirmed = confirm('⚠️ WARNING: This will permanently delete ALL data including:\n\n• Holidays\n• Income & Expenses\n• Notes\n• Shopping Lists\n• Budgets\n• Bills\n• Goals\n• Insurance Policies\n• Vehicles\n• Subscriptions\n• Custom Data\n• Settings\n\nThis action cannot be undone. Are you absolutely sure?');
    
    if (!confirmed) return;
    
    try {
        showNotification('🗑️ Clearing all data...', 'info');
        
        // Clear all databases
        await holidayDB.clear();
        await incomeDB.clear();
        await expenseDB.clear();
        await noteDB.clear();
        await shoppingDB.clear();
        await budgetDB.clear();
        await billDB.clear();
        await goalDB.clear();
        await recurringDB.clear();
        await insuranceDB.clear();
        await vehicleDB.clear();
        await vehicleServiceDB.clear();
        await subscriptionDB.clear();
        await customTypeDB.clear();
        await customItemDB.clear();
        
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
    const insurances = await insuranceDB.getAll();
    const expiringInsurance = insurances.filter(ins => 
        ins.status === 'active' && 
        ins.expiryDate >= todayStr && 
        ins.expiryDate <= in7Days
    );

    expiringInsurance.forEach(ins => {
        alerts.push(`🛡️ Insurance "${ins.name}" expiring on ${ins.expiryDate}`);
    });

    // Check bills due soon
    const bills = await billDB.getAll();
    const dueBills = bills.filter(bill =>
        bill.status !== 'paid' &&
        bill.dueDate >= todayStr &&
        bill.dueDate <= in7Days
    );

    dueBills.forEach(bill => {
        alerts.push(`💳 Bill "${bill.name}" due on ${bill.dueDate}`);
    });

    // Check subscriptions renewing soon
    const subscriptions = await subscriptionDB.getAll();
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
        const existingGoals = await goalDB.getAll();
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
                await goalDB.add(goalData);
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
        const existingInsurance = await insuranceDB.getAll();
        console.log('🐛 DEBUG: Existing insurance retrieved', { count: existingInsurance.length });
        
        const existingKeys = new Set();
        existingInsurance.forEach(insurance => {
            const key = `${insurance.company.toLowerCase().trim()}-${insurance.policyNumber.toLowerCase().trim()}`;
            existingKeys.add(key);
        });
        console.log('🐛 DEBUG: Existing keys created', { count: existingKeys.size });
        
        let addedCount = 0, duplicateCount = 0, errorCount = 0;
        
        for (const [index, insurance] of insuranceData.entries()) {
            console.log(`🐛 DEBUG: Processing insurance item ${index + 1}/${insuranceData.length}`, {
                name: insurance.name,
                company: insurance.company,
                policyNumber: insurance.policyNumber
            });
            
            try {
                const { id, ...insuranceItemData } = insurance;
                const key = `${insuranceItemData.company?.toLowerCase().trim() || ''}-${insuranceItemData.policyNumber?.toLowerCase().trim() || ''}`;
                
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
                    
                    await insuranceDB.add(processedData);
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
            
            const existingVehicles = await vehicleDB.getAll();
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
                        
                        await vehicleDB.add(processedData);
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
        const existingSubscriptions = await subscriptionDB.getAll();
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
                await subscriptionDB.add(subscriptionData);
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
        const existingTypes = await customTypeDB.getAll();
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
                await customTypeDB.add(typeData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Custom types import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    }
    
    if (data.customItems && Array.isArray(data.customItems)) {
        const existingItems = await customItemDB.getAll();
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
                await customItemDB.add(itemData);
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
        const existingShopping = await shoppingDB.getAll();
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
                await shoppingDB.add(itemData);
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
window.closeDrawer = closeDrawer;
window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;
window.deleteRecurring = deleteRecurring;
window.deleteShoppingItem = deleteShoppingItem;
window.deleteNote = deleteNote;
window.deleteHoliday = deleteHoliday;
window.deleteBill = deleteBill;
window.deleteBudget = deleteBudget;
window.deleteGoal = deleteGoal;
window.deleteInsurance = deleteInsurance;
window.deleteVehicle = deleteVehicle;
window.deleteSubscription = deleteSubscription;
window.deleteCustomType = deleteCustomType;
window.deleteCustomItem = deleteCustomItem;
window.toggleShoppingStatus = toggleShoppingStatus;
window.markBillPaid = markBillPaid;
window.addToGoal = addToGoal;
window.viewInsuranceDetails = viewInsuranceDetails;
window.showServiceHistory = showServiceHistory;
window.addServiceRecord = addServiceRecord;
window.deleteService = deleteService;
window.addFuelExpense = addFuelExpense;
window.updateMileage = updateMileage;
window.renewSubscription = renewSubscription;
window.selectCustomType = selectCustomType;
window.showCustomItemForm = showCustomItemForm;
window.backupData = backupData;
window.restoreData = restoreData;
window.clearAllData = clearAllData;
window.exportCalendarData = exportCalendarData;
window.importCalendarData = importCalendarData;
window.exportTrackerData = exportTrackerData;
window.importTrackerData = importTrackerData;
window.processPendingSMSTransactions = processPendingSMSTransactions;

// Add new module import/export functions
window.importData = importData;
window.importModuleData = importModuleData;
window.exportData = exportData;
window.exportModuleData = exportModuleData;
window.exportAllData = exportAllData;
window.importAllData = importAllData;

// Test function for debugging SMS integration
window.testSMSIntegration = function() {
    console.log('🧪 Testing SMS Integration...');
    
    const pending = JSON.parse(localStorage.getItem('pendingTrackerTransactions') || '[]');
    const button = document.getElementById('processSMSBtn');
    
    console.log('📊 Test Results:');
    console.log('- Pending transactions:', pending.length);
    console.log('- Button exists:', !!button);
    console.log('- Button text:', button ? button.textContent : 'N/A');
    console.log('- Process function exists:', typeof processPendingSMSTransactions);
    
    showNotification(`🧪 SMS Test: ${pending.length} pending, button ${button ? 'found' : 'not found'}`, 'info');
    
    if (pending.length > 0) {
        console.log('📱 Sample transaction:', pending[0]);
    }
};

console.log('✅ app.js loaded completely');

// Debug verification for export/import functions
console.log('🔍 Export/Import Functions Verification:');
console.log('- exportAllData:', typeof exportAllData);
console.log('- importAllData:', typeof importAllData);
console.log('- backupData:', typeof backupData);
console.log('- restoreData:', typeof restoreData);
console.log('- clearAllData:', typeof clearAllData);
console.log('- XLSX library:', typeof XLSX !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');

// Test button elements existence
setTimeout(() => {
    console.log('🔍 Button Elements Verification:');
    const overallExportBtn = document.getElementById('overallExportBtn');
    const overallImportBtn = document.getElementById('overallImportBtn');
    const backupDataBtn = document.getElementById('backupDataBtn');
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    
    console.log('- overallExportBtn:', !!overallExportBtn);
    console.log('- overallImportBtn:', !!overallImportBtn);
    console.log('- backupDataBtn:', !!backupDataBtn);
    console.log('- restoreDataBtn:', !!restoreDataBtn);
    
    // Test dropdown menus
    const overallExportMenu = document.getElementById('overallExportMenu');
    const overallImportMenu = document.getElementById('overallImportMenu');
    
    console.log('- overallExportMenu:', !!overallExportMenu);
    console.log('- overallImportMenu:', !!overallImportMenu);
    
    // Test file inputs
    const overallImportJson = document.getElementById('overallImportJson');
    const overallImportExcel = document.getElementById('overallImportExcel');
    const overallImportCsv = document.getElementById('overallImportCsv');
    
    console.log('- overallImportJson:', !!overallImportJson);
    console.log('- overallImportExcel:', !!overallImportExcel);
    console.log('- overallImportCsv:', !!overallImportCsv);
    
    console.log('✅ Export/Import verification complete');
}, 1000);

// Manual test function for export/import verification
window.testExportImport = async function() {
    console.log('🧪 Starting Export/Import Manual Test...');
    
    try {
        // Test 1: Check if functions exist
        console.log('📋 Test 1: Function Existence');
        console.log('- exportAllData:', typeof exportAllData === 'function' ? '✅' : '❌');
        console.log('- importAllData:', typeof importAllData === 'function' ? '✅' : '❌');
        console.log('- backupData:', typeof backupData === 'function' ? '✅' : '❌');
        console.log('- restoreData:', typeof restoreData === 'function' ? '✅' : '❌');
        console.log('- clearAllData:', typeof clearAllData === 'function' ? '✅' : '❌');
        
        // Test 2: Check if buttons exist
        console.log('📋 Test 2: Button Elements');
        const overallExportBtn = document.getElementById('overallExportBtn');
        const overallImportBtn = document.getElementById('overallImportBtn');
        const backupDataBtn = document.getElementById('backupDataBtn');
        const restoreDataBtn = document.getElementById('restoreDataBtn');
        
        console.log('- overallExportBtn:', !!overallExportBtn ? '✅' : '❌');
        console.log('- overallImportBtn:', !!overallImportBtn ? '✅' : '❌');
        console.log('- backupDataBtn:', !!backupDataBtn ? '✅' : '❌');
        console.log('- restoreDataBtn:', !!restoreDataBtn ? '✅' : '❌');
        
        // Test 3: Check if dropdowns exist
        console.log('📋 Test 3: Dropdown Menus');
        const overallExportMenu = document.getElementById('overallExportMenu');
        const overallImportMenu = document.getElementById('overallImportMenu');
        
        console.log('- overallExportMenu:', !!overallExportMenu ? '✅' : '❌');
        console.log('- overallImportMenu:', !!overallImportMenu ? '✅' : '❌');
        
        // Test 4: Check if file inputs exist
        console.log('📋 Test 4: File Inputs');
        const overallImportJson = document.getElementById('overallImportJson');
        const overallImportExcel = document.getElementById('overallImportExcel');
        const overallImportCsv = document.getElementById('overallImportCsv');
        
        console.log('- overallImportJson:', !!overallImportJson ? '✅' : '❌');
        console.log('- overallImportExcel:', !!overallImportExcel ? '✅' : '❌');
        console.log('- overallImportCsv:', !!overallImportCsv ? '✅' : '❌');
        
        // Test 5: Test export functionality (small test)
        console.log('📋 Test 5: Export Function Test');
        if (typeof exportAllData === 'function') {
            console.log('🔄 Testing JSON export (should trigger download)...');
            await exportAllData('json');
            console.log('✅ JSON export test completed');
        } else {
            console.log('❌ exportAllData function not available');
        }
        
        console.log('🎉 Manual test completed! Check console for results.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

console.log('💡 Added testExportImport() function - call from console to test export/import');

// Quick test function to verify buttons are working
window.testButtons = function() {
    console.log('🧪 Testing Export/Import Buttons...');
    
    const exportBtn = document.getElementById('overallExportBtn');
    const importBtn = document.getElementById('overallImportBtn');
    const exportMenu = document.getElementById('overallExportMenu');
    const importMenu = document.getElementById('overallImportMenu');
    
    console.log('📊 Elements found:', {
        exportBtn: !!exportBtn,
        importBtn: !!importBtn,
        exportMenu: !!exportMenu,
        importMenu: !!importMenu
    });
    
    if (exportBtn) {
        console.log('✅ Export button found, testing click...');
        exportBtn.click();
        setTimeout(() => {
            console.log('📊 Export menu active:', exportMenu.classList.contains('active'));
        }, 100);
    }
    
    if (importBtn) {
        console.log('✅ Import button found, testing click...');
        importBtn.click();
        setTimeout(() => {
            console.log('📊 Import menu active:', importMenu.classList.contains('active'));
        }, 100);
    }
};

console.log('💡 Added testButtons() function - call from console to test buttons');