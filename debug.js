/**
 * ============================================================
 * debug.js  —  Developer Debug & Diagnostics Tools
 * ============================================================
 * Load this file ONLY in development. Do NOT include in
 * production builds.
 *
 * Available in browser console after loading:
 *   window.debugCheckAllFeatures()  - Full feature check
 *   window.debugHealthCheck()        - Quick health snapshot
 *   window.debugCheckFunctions()     - Function availability
 *   window.debugCheckDatabase()      - DB connection status
 *   window.debugCheckDOM()           - Critical DOM elements
 *   window.debugTestCoreFunctions()  - Date function tests
 *   window.debugTestDatabase()       - DB read/write tests
 *   window.debugTestUI()             - UI rendering tests
 *   window.debugTestEventListeners() - Event listener audit
 *   window.debugTestImportExport()   - Import/export tests
 *   window.debugRunAllTests()        - Run all tests
 *   window.debugLogs                 - Inspect log history
 *   window.debugErrors               - Inspect error history
 *   window.lastDebugCheck            - Last full check result
 * ============================================================
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

console.log('🔧 debug.js loaded — debug tools active.');
console.log('  Run window.debugRunAllTests() to run all diagnostics.');
