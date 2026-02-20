/**
 * ========================================
 * ROBUST INDEXEDDB MANAGER v3.0
 * Guaranteed Data Persistence
 * Developer: Santosh Phuyal
 * ========================================
 */

const DB_NAME = 'NepaliCalendarDB';
const DB_VERSION = 6; // v6: added paymentHistory store for notification.js
let db = null;
let isDBReady = false;

/**
 * Enhanced Database Initialization with Retry Logic
 */
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('❌ Database failed to open:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            isDBReady = true;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            const currentVersion = event.oldVersion;
            const newVersion = event.newVersion;
            
            // DO NOT DELETE EXISTING STORES (Prevents data wiping bug)
            // Only create stores and indexes if they don't already exist
            
            // Version-specific migrations
            if (currentVersion < 6 && newVersion >= 6) {
                // Create paymentHistory store for notification.js
                createStore('paymentHistory', 'id', [
                    { name: 'source' },        // 'insurance' | 'bill' | 'subscription' | 'recurring' | 'vehicle'
                    { name: 'itemId' },        // FK to the original item
                    { name: 'paidDateBs' },    // BS date payment was recorded
                    { name: 'dueDateBs' },     // BS due/renewal date that was settled
                    { name: 'amount' },
                    { name: 'recordedAt' }     // ISO timestamp for sorting
                ]);
            }
            
            // Create all object stores with proper indexes
            createStore('notes', 'id', [
                { name: 'date_bs' },
                { name: 'title' },
                { name: 'priority' },
                { name: 'isReminder' },
                { name: 'reminderDate' }
            ]);
            
            createStore('holidays', 'id', [
                { name: 'date_bs' },
                { name: 'type' }
            ]);
            
            createStore('income', 'id', [
                { name: 'date_bs' },
                { name: 'category' },
                { name: 'amount' }
            ]);
            
            createStore('expenses', 'id', [
                { name: 'date_bs' },
                { name: 'category' },
                { name: 'amount' }
            ]);
            
            createStore('shopping', 'id', [
                { name: 'date_bs' },
                { name: 'category' },
                { name: 'status' }
            ]);
            
            createStore('budgets', 'id', [
                { name: 'category' },
                { name: 'month' },
                { name: 'year' }
            ]);
            
            createStore('bills', 'id', [
                { name: 'dueDate' },
                { name: 'category' },
                { name: 'status' }
            ]);
            
            createStore('goals', 'id', [
                { name: 'category' },
                { name: 'targetDate' }
            ]);
            
            createStore('recurring', 'id', [
                { name: 'nextDate' },
                { name: 'category' },
                { name: 'isActive' }
            ]);
            
            // Insurance
            createStore('insurance', 'id', [
                { name: 'provider' },
                { name: 'policyNumber' },
                { name: 'expiryDate' },
                { name: 'status' }
            ]);
            
            // Vehicles
            createStore('vehicles', 'id', [
                { name: 'make' },
                { name: 'model' },
                { name: 'licensePlate' }
            ]);
            
            createStore('vehicleServices', 'id', [
                { name: 'vehicleId' },
                { name: 'type' },
                { name: 'date' }
            ]);
            
            // Subscriptions
            createStore('subscriptions', 'id', [
                { name: 'name' },
                { name: 'category' },
                { name: 'renewalDate' },
                { name: 'status' }
            ]);
            
            // Custom Types and Items
            createStore('customTypes', 'id', [
                { name: 'name', options: { unique: true } }
            ]);
            
            createStore('customItems', 'id', [
                { name: 'typeId' }
            ]);
            
            // Medicine Tracker
            createStore('medicines', 'id', [
                { name: 'status' },
                { name: 'familyMemberId' },
                { name: 'expiryDate' }
            ]);
            
            createStore('familyMembers', 'id', [
                { name: 'name' },
                { name: 'relationship' }
            ]);
            
            createStore('prescriptions', 'id', [
                { name: 'medicineId' },
                { name: 'familyMemberId' },
                { name: 'doctorName' },
                { name: 'issueDate' }
            ]);
            
            createStore('dosageSchedule', 'id', [
                { name: 'medicineId' },
                { name: 'familyMemberId' },
                { name: 'date' },
                { name: 'time' },
                { name: 'status' }
            ]);

            // ── Payment History (notification.js) ──────────────────────────
            // Stores every paid bill / renewed insurance / subscription / recurring
            // Only create if not already created in migration
            if (currentVersion < 6) {
                createStore('paymentHistory', 'id', [
                    { name: 'source' },        // 'insurance' | 'bill' | 'subscription' | 'recurring' | 'vehicle'
                    { name: 'itemId' },        // FK to the original item
                    { name: 'paidDateBs' },    // BS date payment was recorded
                    { name: 'dueDateBs' },     // BS due/renewal date that was settled
                    { name: 'amount' },
                    { name: 'recordedAt' }     // ISO timestamp for sorting
                ]);
            }
            
            console.log('✅ Database upgrade completed successfully');
        };
        
        request.onblocked = () => {
            console.warn('⚠️ Database upgrade blocked. Please close all other tabs with this app.');
        };
    });
}

/**
 * Create object store with indexes
 */
function createStore(storeName, keyPath, indexes = []) {
    if (!db.objectStoreNames.contains(storeName)) {
        console.log(`📦 Creating store: ${storeName}`);
        const store = db.createObjectStore(storeName, { keyPath, autoIncrement: keyPath === 'id' });
        
        indexes.forEach(index => {
            const { name, options = {} } = index;
            store.createIndex(name, name, options);
            console.log(`📋 Created index: ${name} on ${storeName}`);
        });
    }
}

/**
 * Wait for database to be ready with timeout
 */
async function waitForDB() {
    return new Promise((resolve, reject) => {
        if (isDBReady && db) {
            resolve(db);
            return;
        }
        
        const maxWait = 100; // 10 seconds
        let count = 0;
        
        const interval = setInterval(() => {
            if (isDBReady && db) {
                clearInterval(interval);
                resolve(db);
            } else if (++count >= maxWait) {
                clearInterval(interval);
                reject(new Error('Database timeout'));
            }
        }, 100);
    });
}

/**
 * Enhanced Database Manager Class with Guaranteed Persistence
 */
class EnhancedDBManager {
    constructor(storeName) {
        this.storeName = storeName;
    }
    
    async ensureDB() {
        if (!isDBReady || !db) {
            await waitForDB();
        }
    }
    
    async add(data) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.add(data);
                let requestResult = null;
                request.onsuccess = () => { requestResult = request.result; };
                request.onerror = () => { reject(request.error); };
                transaction.oncomplete = () => { resolve(requestResult); };
                transaction.onerror = () => { reject(transaction.error); };
            });
        } catch (error) { throw error; }
    }
    
    async update(data) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(data);
                let requestResult = null;
                request.onsuccess = () => { requestResult = request.result; };
                request.onerror = () => { reject(request.error); };
                transaction.oncomplete = () => { resolve(requestResult); };
                transaction.onerror = () => { reject(transaction.error); };
            });
        } catch (error) { throw error; }
    }
    
    async delete(id) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(id);
                request.onerror = () => { reject(request.error); };
                transaction.oncomplete = () => { resolve(); };
                transaction.onerror = () => { reject(transaction.error); };
            });
        } catch (error) { throw error; }
    }
    
    async get(id) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) { return null; }
    }
    
    async getAll() {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();
                request.onsuccess = () => { resolve(request.result || []); };
                request.onerror = () => reject(request.error);
            });
        } catch (error) { return []; }
    }
    
    async getByIndex(indexName, value) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                if (!store.indexNames.contains(indexName)) { resolve([]); return; }
                const index = store.index(indexName);
                const request = index.getAll(value);
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            });
        } catch (error) { return []; }
    }
    
    async clear() {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();
                request.onerror = () => { reject(request.error); };
                transaction.oncomplete = () => { resolve(); };
                transaction.onerror = () => { reject(transaction.error); };
            });
        } catch (error) { throw error; }
    }
    
    async count() {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) { return 0; }
    }
}

// Initialize enhanced database managers
const enhancedNoteDB = new EnhancedDBManager('notes');
const enhancedHolidayDB = new EnhancedDBManager('holidays');
const enhancedIncomeDB = new EnhancedDBManager('income');
const enhancedExpenseDB = new EnhancedDBManager('expenses');
const enhancedShoppingDB = new EnhancedDBManager('shopping');
const enhancedBudgetDB = new EnhancedDBManager('budgets');
const enhancedBillDB = new EnhancedDBManager('bills');
const enhancedGoalDB = new EnhancedDBManager('goals');
const enhancedRecurringDB = new EnhancedDBManager('recurring');
const enhancedInsuranceDB = new EnhancedDBManager('insurance');
const enhancedVehicleDB = new EnhancedDBManager('vehicles');
const enhancedVehicleServiceDB = new EnhancedDBManager('vehicleServices');
const enhancedSubscriptionDB = new EnhancedDBManager('subscriptions');
const enhancedCustomTypeDB = new EnhancedDBManager('customTypes');
const enhancedCustomItemDB = new EnhancedDBManager('customItems');
const enhancedMedicineDB = new EnhancedDBManager('medicines');
const enhancedFamilyMembersDB = new EnhancedDBManager('familyMembers');
const enhancedPrescriptionsDB = new EnhancedDBManager('prescriptions');
const enhancedDosageScheduleDB = new EnhancedDBManager('dosageSchedule');
// ── Payment History DB (used by notification.js) ─────────────────────────────
const enhancedPaymentHistoryDB = new EnhancedDBManager('paymentHistory');

async function initializeEnhancedDB() {
    try {
        await initDB();
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Enhanced Database:', error);
        return false;
    }
}

// Auto-initialize when script loads
initializeEnhancedDB();

// Export for global use
window.EnhancedDBManager = EnhancedDBManager;
window.initializeEnhancedDB = initializeEnhancedDB;
window.enhancedNoteDB = enhancedNoteDB;
window.enhancedHolidayDB = enhancedHolidayDB;
window.enhancedIncomeDB = enhancedIncomeDB;
window.enhancedExpenseDB = enhancedExpenseDB;
window.enhancedShoppingDB = enhancedShoppingDB;
window.enhancedBudgetDB = enhancedBudgetDB;
window.enhancedBillDB = enhancedBillDB;
window.enhancedGoalDB = enhancedGoalDB;
window.enhancedRecurringDB = enhancedRecurringDB;
window.enhancedInsuranceDB = enhancedInsuranceDB;
window.enhancedVehicleDB = enhancedVehicleDB;
window.enhancedVehicleServiceDB = enhancedVehicleServiceDB;
window.enhancedSubscriptionDB = enhancedSubscriptionDB;
window.enhancedCustomTypeDB = enhancedCustomTypeDB;
window.enhancedCustomItemDB = enhancedCustomItemDB;
window.enhancedMedicineDB = enhancedMedicineDB;
window.enhancedFamilyMembersDB = enhancedFamilyMembersDB;
window.enhancedPrescriptionsDB = enhancedPrescriptionsDB;
window.enhancedDosageScheduleDB = enhancedDosageScheduleDB;
// Payment History
window.enhancedPaymentHistoryDB = enhancedPaymentHistoryDB;

console.log('✅ db.js loaded completely');
