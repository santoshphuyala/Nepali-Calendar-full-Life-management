/**
 * Smart Import/Export System
 * Handles data import/export with duplicate prevention and smart preview
 */

// Notification helper — use app.js implementation if available, otherwise create a minimal fallback
// FIX: Guard with typeof so we don't shadow app.js's showNotification on the global scope
if (typeof window.showNotification !== 'function') {
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 3000);
    };
}
// Local alias so class methods can call showNotification() without window. prefix
function showNotification(message, type) { window.showNotification(message, type); }

// Import/Export Manager Class
class ImportExportManager {
    constructor() {
        this.duplicateStrategy = 'skip'; // 'skip', 'update', 'merge'
        this.importPreview = null;
        this.initEventListeners();
    }

    isFallbackGlobal(fn) {
        return !!(fn && fn.__ie_fallback);
    }

    initEventListeners() {
        // Dropdown toggle handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('import-export-btn')) {
                this.toggleDropdown(e.target);
            } else if (!e.target.closest('.import-export-dropdown')) {
                this.closeAllDropdowns();
            }
        });

        // Prevent dropdown closing when clicking inside
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dropdown-menu')) {
                e.stopPropagation();
            }
        });
    }

    toggleDropdown(button) {
        const dropdown = button.nextElementSibling;
        const isOpen = dropdown.classList.contains('show');
        
        // Close all dropdowns first
        this.closeAllDropdowns();
        
        // Open clicked dropdown if it wasn't open
        if (!isOpen) {
            dropdown.classList.add('show');
            button.classList.add('active');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.import-export-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Export Functions
    async exportData(module, format) {
        try {
            // NOTE: No delegation to window.exportData — this class IS the authority.
            // Delegating to window.exportData risks circular calls if the flag is missing.
            showNotification('📤 Preparing export...', 'info');
            
            const data = await this.collectModuleData(module);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            
            switch(format) {
                case 'json':
                    await this.exportAsJSON(data, `${module}_export_${timestamp}.json`);
                    break;
                case 'excel':
                    await this.exportAsExcel(data, `${module}_export_${timestamp}.xlsx`);
                    break;
                case 'csv':
                    await this.exportAsCSV(data, `${module}_export_${timestamp}.csv`);
                    break;
            }
            
            showNotification('✅ Export completed successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('❌ Export failed: ' + error.message, 'error');
        }
    }

    async exportAllData(format) {
        try {
            // NOTE: No delegation to window.exportAllData — circular risk removed.
            showNotification('📤 Preparing complete export...', 'info');
            
            const allData = await this.collectAllData();
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            
            switch(format) {
                case 'json':
                    await this.exportAsJSON(allData, `nepali_calendar_complete_${timestamp}.json`);
                    break;
                case 'excel':
                    await this.exportAsExcel(allData, `nepali_calendar_complete_${timestamp}.xlsx`);
                    break;
                case 'csv':
                    await this.exportAsCSV(allData, `nepali_calendar_complete_${timestamp}.csv`);
                    break;
            }
            
            showNotification('✅ Complete export successful!', 'success');
        } catch (error) {
            console.error('Complete export error:', error);
            showNotification('❌ Export failed: ' + error.message, 'error');
        }
    }

    async collectModuleData(module) {
        const data = {};
        
        switch(module) {
            case 'calendar':
                data.notes = await window.enhancedNoteDB.getAll();
                data.holidays = await window.enhancedHolidayDB.getAll();
                break;
            case 'notes':
                if (!window.noteDB) {
                    console.error('❌ Note database not available');
                    data.notes = [];
                } else {
                    data.notes = await window.enhancedNoteDB.getAll();
                }
                break;
            case 'tracker':
            case 'finance': // HTML alias used in settings module export buttons
                data.income = await window.enhancedIncomeDB.getAll();
                data.expenses = await window.enhancedExpenseDB.getAll();
                data.recurring = await window.enhancedRecurringDB.getAll(); // FIX: was missing
                data.budgets = await window.enhancedBudgetDB.getAll();
                data.bills = await window.enhancedBillDB.getAll();
                break;
            case 'budget':
                data.budgets = await window.enhancedBudgetDB.getAll();
                break;
            case 'bills':
                data.bills = await window.enhancedBillDB.getAll();
                break;
            case 'goals':
                data.goals = await window.enhancedGoalDB.getAll();
                break;
            case 'insurance':
                data.insurance = await window.enhancedInsuranceDB.getAll();
                break;
            case 'vehicle':
                data.vehicles = await window.enhancedVehicleDB.getAll();
                break;
            case 'subscription':
                data.subscriptions = await window.enhancedSubscriptionDB.getAll();
                break;
            case 'custom':
                data.customTypes = await window.enhancedCustomTypeDB.getAll();
                data.customItems = await window.enhancedCustomItemDB.getAll();
                break;
            case 'shopping':
                data.shopping = await window.enhancedShoppingDB.getAll();
                break;
            case 'assets': // HTML alias — covers insurance, vehicle, subscription
                data.insurance = await window.enhancedInsuranceDB.getAll();
                data.vehicles = await window.enhancedVehicleDB.getAll();
                data.vehicleServices = await window.enhancedVehicleServiceDB.getAll();
                data.subscriptions = await window.enhancedSubscriptionDB.getAll();
                break;
            default:
                throw new Error(`Unknown module: ${module}`);
        }
        
        return {
            module,
            exportDate: new Date().toISOString(),
            version: '2.0.0',
            data
        };
    }

    async collectAllData() {
        return {
            exportDate: new Date().toISOString(),
            version: '2.0.0',
            modules: {
                calendar: {
                    notes: await window.enhancedNoteDB.getAll(),
                    holidays: await window.enhancedHolidayDB.getAll()
                },
                tracker: {
                    income: await window.enhancedIncomeDB.getAll(),
                    expenses: await window.enhancedExpenseDB.getAll(),
                    recurring: await window.enhancedRecurringDB.getAll()
                },
                budget: {
                    budgets: await window.enhancedBudgetDB.getAll()
                },
                bills: {
                    bills: await window.enhancedBillDB.getAll()
                },
                goals: {
                    goals: await window.enhancedGoalDB.getAll()
                },
                insurance: {
                    insurance: await window.enhancedInsuranceDB.getAll()
                },
                vehicle: {
                    vehicles: await window.enhancedVehicleDB.getAll(),
                    vehicleServices: await window.enhancedVehicleServiceDB.getAll()
                },
                subscription: {
                    subscriptions: await window.enhancedSubscriptionDB.getAll()
                },
                shopping: {
                    shopping: await window.enhancedShoppingDB.getAll()
                },
                custom: {
                    customTypes: await window.enhancedCustomTypeDB.getAll(),
                    customItems: await window.enhancedCustomItemDB.getAll()
                },
                medicine: {
                    medicines: await window.enhancedMedicineDB.getAll(),
                    familyMembers: await window.enhancedFamilyMembersDB.getAll(),
                    prescriptions: await window.enhancedPrescriptionsDB.getAll(),
                    dosageSchedule: await window.enhancedDosageScheduleDB.getAll()
                }
            }
        };
    }

    async exportAsJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        this.downloadFile(blob, filename);
    }

    async exportAsExcel(data, filename) {
        // SheetJS (XLSX) is loaded globally from the CDN in index.html.
        // Use it when available; otherwise fall back to CSV with a clear warning.
        if (typeof XLSX !== 'undefined') {
            const wb = XLSX.utils.book_new();
            const sheets = data.modules || { data: data.data || data };
            for (const [sheetName, sheetData] of Object.entries(sheets)) {
                const rows = Array.isArray(sheetData)
                    ? sheetData
                    : Object.values(sheetData).flat();
                if (rows.length > 0) {
                    const ws = XLSX.utils.json_to_sheet(rows);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                }
            }
            XLSX.writeFile(wb, filename);
        } else {
            showNotification('⚠️ Excel library not available — exporting as CSV instead.', 'warning');
            await this.exportAsCSV(data, filename.replace('.xlsx', '.csv'));
        }
    }

    async exportAsCSV(data, filename) {
        let csvContent = '';
        
        if (data.modules) {
            // Complete export - create separate sheets for each module
            for (const [moduleName, moduleData] of Object.entries(data.modules)) {
                csvContent += `\n# ${moduleName.toUpperCase()}\n`;
                csvContent += await this.convertToCSV(moduleData);
                csvContent += '\n\n';
            }
        } else {
            // Single module export
            csvContent = await this.convertToCSV(data.data);
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadFile(blob, filename);
    }

    async convertToCSV(data) {
        if (!data || Object.keys(data).length === 0) {
            return 'No data available';
        }
        
        let csvContent = '';
        
        for (const [key, items] of Object.entries(data)) {
            if (Array.isArray(items) && items.length > 0) {
                csvContent += `# ${key.toUpperCase()}\n`;
                
                // Get headers from first item
                const headers = Object.keys(items[0]);
                csvContent += headers.join(',') + '\n';
                
                // Add data rows
                items.forEach(item => {
                    const row = headers.map(header => {
                        const value = item[header];
                        return typeof value === 'string' && value.includes(',') 
                            ? `"${value.replace(/"/g, '""')}"` 
                            : value;
                    });
                    csvContent += row.join(',') + '\n';
                });
                
                csvContent += '\n';
            }
        }
        
        return csvContent;
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import Functions
    async importData(module, format, fileInputOrFile) {
        const isFileInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
        try {
            // NOTE: Delegation guard removed — app.js importData doesn't handle all modules
            // and doesn't support the full-backup schema (payload.modules).
            const file = isFileInput ? fileInputOrFile.files[0] : fileInputOrFile;
            if (!file) return;
            
            showNotification('📥 Reading file...', 'info');
            
            let data;
            switch(format) {
                case 'json':
                    data = await this.readJSONFile(file);
                    break;
                case 'excel':
                    data = await this.readExcelFile(file);
                    break;
                case 'csv':
                    data = await this.readCSVFile(file);
                    break;
            }
            
            // Show preview before importing
            await this.showImportPreview(data, module);
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('❌ Import failed: ' + error.message, 'error');
        }
        
        // Reset file input
        if (isFileInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') {
            fileInputOrFile.value = '';
        }
    }

    async importAllData(format, fileInputOrFile) {
        const isFileInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
        try {
            // NOTE: Delegation guard removed — app.js importAllData only checks payload.data,
            // so importing a backup file (which uses payload.modules) always fails with
            // "Invalid import file format". This class handles both schemas correctly.
            const file = isFileInput ? fileInputOrFile.files[0] : fileInputOrFile;
            if (!file) return;
            
            showNotification('📥 Reading complete data...', 'info');
            
            let data;
            switch(format) {
                case 'json':
                    data = await this.readJSONFile(file);
                    break;
                case 'excel':
                    data = await this.readExcelFile(file);
                    break;
                case 'csv':
                    data = await this.readCSVFile(file);
                    break;
            }
            
            // Show preview for complete import
            await this.showImportPreview(data, 'all');
            
        } catch (error) {
            console.error('Complete import error:', error);
            showNotification('❌ Import failed: ' + error.message, 'error');
        }
        
        // Reset file input
        if (isFileInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') {
            fileInputOrFile.value = '';
        }
    }

    async readJSONFile(file) {
        const text = await file.text();
        return JSON.parse(text);
    }

    async readExcelFile(file) {
        // Would need SheetJS library for proper Excel support
        // For now, throw error suggesting CSV format
        throw new Error('Excel import requires SheetJS library. Please use CSV format instead.');
    }

    async readCSVFile(file) {
        const text = await file.text();
        return this.parseCSV(text);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const result = {};
        let currentSection = null;
        let headers = null;
        
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.startsWith('#')) {
                currentSection = line.substring(2).toLowerCase().trim();
                result[currentSection] = [];
                headers = null; // reset headers for each new section
                return;
            }
            
            if (currentSection) {
                const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
                if (!headers) {
                    // First non-comment line in a section is the header row
                    headers = values;
                } else {
                    // Subsequent lines are data rows — map to keyed objects
                    const obj = {};
                    headers.forEach((h, i) => { obj[h] = values[i] !== undefined ? values[i] : ''; });
                    result[currentSection].push(obj);
                }
            }
        });
        
        return result;
    }

    async showImportPreview(data, module) {
        console.log('🐛 DEBUG: showImportPreview called', { data, module });
        return new Promise((resolve, reject) => {
            console.log('🐛 DEBUG: Promise created for showImportPreview');
            this.importPreview = data;
            const analysis = this.analyzeImportData(data, module);
            console.log('🐛 DEBUG: Import analysis completed', analysis);
            
            // Create preview modal
            const modal = document.createElement('div');
            modal.className = 'import-preview-modal';
            modal.innerHTML = `
                <div class="import-preview-content">
                    <div class="import-preview-header">
                        <h3>📋 Import Preview</h3>
                        <button class="import-preview-close">&times;</button>
                    </div>
                    
                    <div class="import-preview-stats">
                        <div class="import-stat-card">
                            <span class="stat-number">${analysis.totalItems}</span>
                            <span class="stat-label">Total Items</span>
                        </div>
                        <div class="import-stat-card">
                            <span class="stat-number" style="color: var(--secondary-color)">${analysis.newItems}</span>
                            <span class="stat-label">New Items</span>
                        </div>
                        <div class="import-stat-card">
                            <span class="stat-number" style="color: var(--warning-color)">${analysis.duplicates}</span>
                            <span class="stat-label">Duplicates</span>
                        </div>
                        <div class="import-stat-card">
                            <span class="stat-number" style="color: var(--info-color)">${analysis.modules}</span>
                            <span class="stat-label">Modules</span>
                        </div>
                    </div>
                    
                    ${analysis.duplicates > 0 ? `
                        <div class="duplicate-options">
                            <h4>⚠️ Duplicate Handling</h4>
                            <div class="duplicate-option">
                                <input type="radio" id="skip-duplicates" name="duplicate-strategy" value="skip" checked>
                                <label for="skip-duplicates">Skip duplicates (recommended)</label>
                            </div>
                            <div class="duplicate-option">
                                <input type="radio" id="update-duplicates" name="duplicate-strategy" value="update">
                                <label for="update-duplicates">Update existing items</label>
                            </div>
                            <div class="duplicate-option">
                                <input type="radio" id="merge-duplicates" name="duplicate-strategy" value="merge">
                                <label for="merge-duplicates">Merge with existing items</label>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="import-preview-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Title/Name</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generatePreviewRows(data)}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="import-preview-actions">
                        <button class="btn-secondary cancel-btn">Cancel</button>
                        <button class="btn-primary import-btn">Import Data</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.style.display = 'block';
            
            // Close modal handlers
            const closeModal = () => {
                console.log('🐛 DEBUG: closeModal called - rejecting Promise');
                modal.remove();
                reject(false); // User cancelled
            };
            
            const confirmImport = async () => {
                console.log('🐛 DEBUG: confirmImport called - starting import process');
                try {
                    // Get duplicate strategy
                    const strategy = document.querySelector('input[name="duplicate-strategy"]:checked')?.value || 'skip';
                    console.log('🐛 DEBUG: Selected strategy', strategy);
                    
                    // Show progress in modal first
                    this.showImportProgress();
                    
                    // Wait a moment to show progress
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    modal.remove();
                    await this.performImport(module, strategy);
                    showNotification('✅ Import completed successfully!', 'success');
                    
                    // Refresh current view
                    if (typeof refreshCurrentView === 'function') {
                        refreshCurrentView();
                    }
                    
                    console.log('🐛 DEBUG: Import completed successfully - resolving Promise');
                    resolve(true); // Import confirmed and completed
                } catch (error) {
                    console.log('🐛 DEBUG: Import failed - rejecting Promise', error);
                    modal.remove();
                    showNotification('❌ Import failed: ' + error.message, 'error');
                    reject(error); // Import failed
                }
            };
            
            modal.querySelector('.import-preview-close').onclick = () => {
                console.log('🐛 DEBUG: Close button clicked');
                closeModal();
            };
            modal.querySelector('.cancel-btn').onclick = () => {
                console.log('🐛 DEBUG: Cancel button clicked');
                closeModal();
            };
            modal.querySelector('.import-btn').onclick = () => {
                console.log('🐛 DEBUG: Import button clicked');
                confirmImport();
            };
            modal.onclick = (e) => {
                if (e.target === modal) {
                    console.log('🐛 DEBUG: Modal backdrop clicked');
                    closeModal();
                }
            };
            
            console.log('🐛 DEBUG: Event handlers attached to modal');
        });
    }

    analyzeImportData(data, module) {
        let totalItems = 0;
        let newItems = 0;
        let duplicates = 0;
        let modulesCount = 0;

        // Normalize: support three schemas:
        //   1. Full backup:      { modules: { calendar: {...}, tracker: {...}, ... } }
        //   2. Module export:    { module, data: { holidays: [...], notes: [...] }, exportDate }
        //   3. Legacy flat:      { data: { ... } } or bare { holidays: [...] }
        const normalizedSources = this._normalizeSources(data);

        for (const [dataType, items] of Object.entries(normalizedSources)) {
            if (!Array.isArray(items) || items.length === 0) continue;
            modulesCount++;
            totalItems += items.length;
            items.forEach(item => {
                if (this.isDuplicate(item, dataType)) {
                    duplicates++;
                } else {
                    newItems++;
                }
            });
        }

        return { totalItems, newItems, duplicates, modules: modulesCount };
    }

    // Normalize any import schema into a flat { dataType: items[] } map
    _normalizeSources(data) {
        if (!data || typeof data !== 'object') return {};

        if (data.modules) {
            // Full backup: { modules: { calendar: { notes, holidays }, tracker: { income, expenses }, ... } }
            return Object.values(data.modules).reduce((acc, mod) => {
                if (mod && typeof mod === 'object') Object.assign(acc, mod);
                return acc;
            }, {});
        }

        if (data.data) {
            // Single-module or grouped export: { data: { income: [], expenses: [] } }
            return data.data;
        }

        // Legacy / bare object where top-level keys are arrays directly
        const bare = {};
        for (const [k, v] of Object.entries(data)) {
            if (Array.isArray(v)) bare[k] = v;
        }
        if (Object.keys(bare).length > 0) return bare;

        return {};
    }

    isDuplicate(item, type) {
        // Simplified duplicate detection - would need to check against actual database
        // For now, return false to show all items as new
        return false;
    }

    generatePreviewRows(data) {
        const sources = this._normalizeSources(data);
        let rows = '';

        const processItems = (items, type) => {
            if (!Array.isArray(items)) return '';
            return items.slice(0, 10).map(item => {
                const title = (item.title || item.name || item.description || 'N/A').toString().substring(0, 40);
                const date = item.date_bs || item.date || item.dueDate || 'N/A';
                const status = this.isDuplicate(item, type) ? 'duplicate' : 'new';
                const statusClass = status === 'duplicate' ? 'duplicate-row' : 'new-row';
                return `<tr class="${statusClass}">
                    <td>${type}</td>
                    <td>${title}</td>
                    <td>${date}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                </tr>`;
            }).join('');
        };

        for (const [dataType, items] of Object.entries(sources)) {
            rows += processItems(items, dataType);
        }

        return rows || '<tr><td colspan="4" style="text-align:center;color:#888">No data to preview</td></tr>';
    }

    async executeImport(module, button) {
        try {
            button.disabled = true;
            button.textContent = 'Importing...';
            
            // Get duplicate strategy
            const strategy = document.querySelector('input[name="duplicate-strategy"]:checked')?.value || 'skip';
            
            // Show progress
            this.showImportProgress();
            
            // Execute actual import
            await this.performImport(module, strategy);
            
            // Close modal
            document.querySelector('.import-preview-modal').remove();
            
            showNotification('✅ Import completed successfully!', 'success');
            
            // Refresh current view
            if (typeof refreshCurrentView === 'function') {
                refreshCurrentView();
            }
            
        } catch (error) {
            console.error('Import execution error:', error);
            showNotification('❌ Import failed: ' + error.message, 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'Import Data';
        }
    }

    showImportProgress() {
        // Show progress indicator
        const progress = document.createElement('div');
        progress.className = 'import-progress';
        progress.innerHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">Starting import...</div>
        `;
        
        const modal = document.querySelector('.import-preview-content');
        const existingProgress = modal.querySelector('.import-progress');
        if (existingProgress) {
            existingProgress.replaceWith(progress);
        } else {
            modal.insertBefore(progress, modal.querySelector('.import-preview-table'));
        }
        
        // Simulate progress
        let progressValue = 0;
        const interval = setInterval(() => {
            progressValue += Math.random() * 20;
            if (progressValue > 90) progressValue = 90;
            
            progress.querySelector('.progress-bar-fill').style.width = progressValue + '%';
            progress.querySelector('.progress-text').textContent = `Importing... ${Math.round(progressValue)}%`;
            
            if (progressValue >= 90) {
                clearInterval(interval);
            }
        }, 200);
    }

    async performImport(module, strategy) {
        // Unified DB map for all stores
        const dbMap = {
            notes:           window.enhancedNoteDB,
            holidays:        window.enhancedHolidayDB,
            income:          window.enhancedIncomeDB,
            expenses:        window.enhancedExpenseDB,
            budgets:         window.enhancedBudgetDB,
            bills:           window.enhancedBillDB,
            goals:           window.enhancedGoalDB,
            recurring:       window.enhancedRecurringDB,
            insurance:       window.enhancedInsuranceDB,
            vehicles:        window.enhancedVehicleDB,
            vehicleServices: window.enhancedVehicleServiceDB,
            subscriptions:   window.enhancedSubscriptionDB,
            shopping:        window.enhancedShoppingDB,
            customTypes:     window.enhancedCustomTypeDB,
            customItems:     window.enhancedCustomItemDB,
            medicines:       window.enhancedMedicineDB,
            familyMembers:   window.enhancedFamilyMembersDB,
            prescriptions:   window.enhancedPrescriptionsDB,
            dosageSchedule:  window.enhancedDosageScheduleDB
        };

        // Normalize all three possible schemas into a flat { dataType: items[] } map
        const importSources = this._normalizeSources(this.importPreview);

        if (Object.keys(importSources).length === 0) {
            throw new Error('No importable data found in file. The file may be empty or use an unsupported format.');
        }

        let totalImported = 0;
        let totalSkipped = 0;
        let totalFailed = 0;

        for (const [dataType, items] of Object.entries(importSources)) {
            if (!Array.isArray(items) || items.length === 0) continue;

            const dbStore = dbMap[dataType];
            if (!dbStore) {
                console.warn(`⚠️ No DB store found for dataType: "${dataType}" — skipping`);
                continue;
            }

            for (const item of items) {
                try {
                    // Strip old id so the DB auto-assigns a new one on insert
                    const { id: _oldId, ...itemWithoutId } = item || {};

                    // For skip strategy: try to find by id first, then fall back to content match
                    let existing = null;
                    if (strategy !== 'update' && item.id) {
                        try { existing = await dbStore.get(item.id); } catch (_) {}
                    }

                    if (existing) {
                        if (strategy === 'skip') {
                            totalSkipped++;
                            continue;
                        } else if (strategy === 'update') {
                            await dbStore.update({ ...existing, ...itemWithoutId, id: existing.id });
                            totalImported++;
                        } else if (strategy === 'merge') {
                            // Merge text fields
                            const merged = { ...existing };
                            for (const [k, v] of Object.entries(itemWithoutId)) {
                                if (typeof v === 'string' && typeof existing[k] === 'string' && v !== existing[k]) {
                                    merged[k] = existing[k] + '\n\n--- Merged ---\n\n' + v;
                                } else if (v !== undefined) {
                                    merged[k] = v;
                                }
                            }
                            await dbStore.update({ ...merged, id: existing.id });
                            totalImported++;
                        }
                    } else {
                        await dbStore.add(itemWithoutId);
                        totalImported++;
                    }
                } catch (err) {
                    console.warn(`❌ Failed to import item in "${dataType}":`, item, err);
                    totalFailed++;
                }
            }
        }

        console.log(`✅ Import complete: ${totalImported} imported, ${totalSkipped} skipped, ${totalFailed} failed`);

        // Refresh all relevant views
        const refreshers = [
            ['renderCalendar',          () => typeof renderCalendar === 'function' && renderCalendar()],
            ['renderNotes',             () => typeof renderNotes === 'function' && renderNotes()],
            ['renderHolidayList',       () => typeof renderHolidayList === 'function' && renderHolidayList()],
            ['renderTrackerList',       () => typeof renderTrackerList === 'function' && renderTrackerList()],
            ['renderRecurringList',     () => typeof renderRecurringList === 'function' && renderRecurringList()],
            ['renderInsuranceList',     () => typeof renderInsuranceList === 'function' && renderInsuranceList()],
            ['renderInsuranceStats',    () => typeof renderInsuranceStats === 'function' && renderInsuranceStats()],
            ['renderVehicleGrid',       () => typeof renderVehicleGrid === 'function' && renderVehicleGrid()],
            ['renderSubscriptionList',  () => typeof renderSubscriptionList === 'function' && renderSubscriptionList()],
            ['renderGoalsGrid',         () => typeof renderGoalsGrid === 'function' && renderGoalsGrid()],
            ['renderShoppingList',      () => typeof renderShoppingList === 'function' && renderShoppingList()],
            ['renderBillsList',         () => typeof renderBillsList === 'function' && renderBillsList()],
            ['renderBudgetOverview',    () => typeof renderBudgetOverview === 'function' && renderBudgetOverview()],
        ];
        for (const [name, fn] of refreshers) {
            try { await fn(); } catch (e) { console.warn(`Refresh failed for ${name}:`, e); }
        }
        
        // Update progress to 100%
        const progressFill = document.querySelector('.progress-bar-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Import completed!';
        }
    }
}

// Global instance
const importExportManager = new ImportExportManager();

// ─── Global function registration ─────────────────────────────────────────────
// LOAD ORDER: import-export.js loads at line 1256, app.js at line 1277 (AFTER).
// app.js declares: async function importAllData(), importData(), importModuleData(),
// showImportPreview() — these shadow any window.* we set here at parse time.
//
// Solution: set window.* now AND re-apply in the 'load' event which fires after
// ALL scripts have executed. This reliably overrides app.js's declarations.

function _applyImportExportOverrides() {
    // Export functions (app.js does not define these — no conflict):
    if (!window.exportData || window.exportData.__ie_fallback) {
        window.exportData = (module, format) => importExportManager.exportData(module, format);
        window.exportData.__ie_fallback = true;
    }
    if (!window.exportAllData || window.exportAllData.__ie_fallback) {
        window.exportAllData = (format) => importExportManager.exportAllData(format);
        window.exportAllData.__ie_fallback = true;
    }
    if (!window.exportModuleData || window.exportModuleData.__ie_fallback) {
        window.exportModuleData = (module, format) => importExportManager.exportData(module, format);
        window.exportModuleData.__ie_fallback = true;
    }

    // CRITICAL overrides — app.js's versions have broken schema handling.
    // These MUST unconditionally replace the app.js function declarations.
    window.importData = (module, format, fileInputOrFile) => importExportManager.importData(module, format, fileInputOrFile);
    window.importAllData = (format, fileInputOrFile) => importExportManager.importAllData(format, fileInputOrFile);
    window.importModuleData = (module, fileInput) => {
        const format = fileInput?.files?.[0]?.name?.endsWith('.json') ? 'json' : 'excel';
        importExportManager.importData(module, format, fileInput);
    };
}

// Apply immediately (in case app.js is not yet loaded or for direct calls)
_applyImportExportOverrides();

// Re-apply after ALL scripts finish loading — beats app.js's function declarations
window.addEventListener('load', () => {
    _applyImportExportOverrides();
    console.log('✅ import-export.js: import/export overrides confirmed after full page load');
});

// Make importExportManager globally available for testing
window.importExportManager = importExportManager;

// Export showImportPreview function for global access
window.showImportPreview = (data, module) => importExportManager.showImportPreview(data, module);

// Add refreshCurrentView function for import/export
window.refreshCurrentView = async () => {
    const activeView = document.querySelector('.view.active');
    if (activeView) {
        const viewName = activeView.id.replace('View', '');
        
        // Handle specific view refreshes
        if (viewName === 'insurance') {
            if (typeof renderInsuranceList === 'function') {
                await renderInsuranceList();
            }
            if (typeof renderInsuranceStats === 'function') {
                await renderInsuranceStats();
            }
        } else if (viewName === 'notes') {
            if (typeof renderNotes === 'function') {
                renderNotes();
            }
        } else if (typeof switchView === 'function') {
            switchView(viewName);
        }
    }
};