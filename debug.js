/**
 * ========================================
 * ROBUST INDEXEDDB MANAGER v3.0
 * Guaranteed Data Persistence
 * Developer: Santosh Phuyal
 * ========================================
 */

console.log('✅ db.js loading...');

const DB_NAME = 'NepaliCalendarDB';
const DB_VERSION = 5; // Increased version for clean upgrade
let db = null;
let isDBReady = false;

/**
 * Enhanced Database Initialization with Retry Logic
 */
async function initDB() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Initializing Enhanced IndexedDB...');
        
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('❌ Database failed to open:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            console.log('✅ Database opened successfully');
            db = request.result;
            isDBReady = true;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            console.log('🔄 Database upgrade needed...');
            db = event.target.result;
            
                        // DO NOT DELETE EXISTING STORES.
            // Only create new object stores with proper indexes if they do not exist

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
    
    /**
     * Add data with guaranteed transaction completion
     */
    async add(data) {
        try {
            await this.ensureDB();
            console.log(`🔄 Adding to ${this.storeName}:`, data);
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.add(data);
                
                let requestResult = null;
                
                request.onsuccess = () => {
                    console.log(`✅ Added to ${this.storeName}:`, request.result);
                    requestResult = request.result;
                };
                
                request.onerror = () => {
                    console.error(`❌ Add error in ${this.storeName}:`, request.error);
                    reject(request.error);
                };
                
                // CRITICAL: Wait for transaction completion before resolving
                transaction.oncomplete = () => {
                    console.log(`✅ Transaction completed for ${this.storeName} (add)`);
                    resolve(requestResult);
                };
                
                transaction.onerror = () => {
                    console.error(`❌ Transaction error in ${this.storeName}:`, transaction.error);
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error(`❌ Error adding to ${this.storeName}:`, error);
            throw error;
        }
    }
    
    /**
     * Update data with guaranteed transaction completion
     */
    async update(data) {
        try {
            await this.ensureDB();
            console.log(`🔄 Updating in ${this.storeName}:`, data);
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(data);
                
                let requestResult = null;
                
                request.onsuccess = () => {
                    console.log(`✅ Updated in ${this.storeName}:`, request.result);
                    requestResult = request.result;
                };
                
                request.onerror = () => {
                    console.error(`❌ Update error in ${this.storeName}:`, request.error);
                    reject(request.error);
                };
                
                // CRITICAL: Wait for transaction completion before resolving
                transaction.oncomplete = () => {
                    console.log(`✅ Transaction completed for ${this.storeName} (update)`);
                    resolve(requestResult);
                };
                
                transaction.onerror = () => {
                    console.error(`❌ Transaction error in ${this.storeName}:`, transaction.error);
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error(`❌ Error updating in ${this.storeName}:`, error);
            throw error;
        }
    }
    
    /**
     * Delete data with guaranteed transaction completion
     */
    async delete(id) {
        try {
            await this.ensureDB();
            console.log(`🔄 Deleting from ${this.storeName}:`, id);
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(id);
                
                request.onsuccess = () => {
                    console.log(`✅ Deleted from ${this.storeName}:`, id);
                };
                
                request.onerror = () => {
                    console.error(`❌ Delete error in ${this.storeName}:`, request.error);
                    reject(request.error);
                };
                
                // CRITICAL: Wait for transaction completion before resolving
                transaction.oncomplete = () => {
                    console.log(`✅ Transaction completed for ${this.storeName} (delete)`);
                    resolve();
                };
                
                transaction.onerror = () => {
                    console.error(`❌ Transaction error in ${this.storeName}:`, transaction.error);
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error(`❌ Error deleting from ${this.storeName}:`, error);
            throw error;
        }
    }
    
    /**
     * Get single item
     */
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
        } catch (error) {
            console.error(`❌ Error getting from ${this.storeName}:`, error);
            return null;
        }
    }
    
    /**
     * Get all items
     */
    async getAll() {
        try {
            await this.ensureDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();
                
                request.onsuccess = () => {
                    const result = request.result || [];
                    console.log(`📊 Retrieved ${result.length} items from ${this.storeName}`);
                    resolve(result);
                };
                
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error(`❌ Error getting all from ${this.storeName}:`, error);
            return [];
        }
    }
    
    /**
     * Get items by index
     */
    async getByIndex(indexName, value) {
        try {
            await this.ensureDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                
                if (!store.indexNames.contains(indexName)) {
                    console.warn(`Index '${indexName}' not found in ${this.storeName}`);
                    resolve([]);
                    return;
                }
                
                const index = store.index(indexName);
                const request = index.getAll(value);
                
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error(`❌ Error in getByIndex (${this.storeName}.${indexName}):`, error);
            return [];
        }
    }
    
    /**
     * Clear all data with guaranteed transaction completion
     */
    async clear() {
        try {
            await this.ensureDB();
            console.log(`🔄 Clearing ${this.storeName}`);
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();
                
                request.onsuccess = () => {
                    console.log(`✅ Cleared ${this.storeName}`);
                };
                
                request.onerror = () => {
                    console.error(`❌ Clear error in ${this.storeName}:`, request.error);
                    reject(request.error);
                };
                
                // CRITICAL: Wait for transaction completion before resolving
                transaction.oncomplete = () => {
                    console.log(`✅ Transaction completed for ${this.storeName} (clear)`);
                    resolve();
                };
                
                transaction.onerror = () => {
                    console.error(`❌ Transaction error in ${this.storeName}:`, transaction.error);
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error(`❌ Error clearing ${this.storeName}:`, error);
            throw error;
        }
    }
    
    /**
     * Count items
     */
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
        } catch (error) {
            console.error(`❌ Error counting in ${this.storeName}:`, error);
            return 0;
        }
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

/**
 * Initialize the enhanced database system
 */
async function initializeEnhancedDB() {
    try {
        console.log('🚀 Initializing Enhanced Database System...');
        await initDB();
        console.log('✅ Enhanced Database System Ready!');
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

// Export all database instances
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

console.log('✅ db.js loaded completely');
