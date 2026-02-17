/**
 * Smart Import/Export System
 * Handles data import/export with duplicate prevention and smart preview
 */

// Simple notification function (fallback if app.js not loaded)
function showNotification(message, type = 'info') {
    // Try to use app.js notification if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
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
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

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
            if (typeof window.exportData === 'function' && !this.isFallbackGlobal(window.exportData)) {
                return await window.exportData(module, format);
            }
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
            if (typeof window.exportAllData === 'function' && !this.isFallbackGlobal(window.exportAllData)) {
                return await window.exportAllData(format);
            }
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
                data.income = await window.enhancedIncomeDB.getAll();
                data.expenses = await window.enhancedExpenseDB.getAll();
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
            if (typeof window.importData === 'function' && !this.isFallbackGlobal(window.importData)) {
                return await window.importData(module, format, fileInputOrFile);
            }
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
            if (typeof window.importAllData === 'function' && !this.isFallbackGlobal(window.importAllData)) {
                return await window.importAllData(format, fileInputOrFile);
            }
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
        let modules = 0;
        
        if (data.modules) {
            // Complete import
            for (const [moduleName, moduleData] of Object.entries(data.modules)) {
                modules++;
                for (const [dataType, items] of Object.entries(moduleData)) {
                    if (Array.isArray(items)) {
                        totalItems += items.length;
                        // Check for duplicates (simplified)
                        items.forEach(item => {
                            if (this.isDuplicate(item, dataType)) {
                                duplicates++;
                            } else {
                                newItems++;
                            }
                        });
                    }
                }
            }
        } else if (data.data) {
            // Single module import
            modules = 1;
            for (const [dataType, items] of Object.entries(data.data)) {
                if (Array.isArray(items)) {
                    totalItems += items.length;
                    items.forEach(item => {
                        if (this.isDuplicate(item, dataType)) {
                            duplicates++;
                        } else {
                            newItems++;
                        }
                    });
                }
            }
        }
        
        return { totalItems, newItems, duplicates, modules };
    }

    isDuplicate(item, type) {
        // Simplified duplicate detection - would need to check against actual database
        // For now, return false to show all items as new
        return false;
    }

    generatePreviewRows(data) {
        let rows = '';
        
        const processItems = (items, type) => {
            if (!Array.isArray(items)) return '';
            
            return items.slice(0, 10).map(item => {
                const title = item.title || item.name || item.description || 'N/A';
                const date = item.date_bs || item.date || item.dueDate || 'N/A';
                const status = this.isDuplicate(item, type) ? 'duplicate' : 'new';
                const statusClass = status === 'duplicate' ? 'duplicate-row' : 'new-row';
                
                return `
                    <tr class="${statusClass}">
                        <td>${type}</td>
                        <td>${title}</td>
                        <td>${date}</td>
                        <td>${status}</td>
                    </tr>
                `;
            }).join('');
        };
        
        if (data.modules) {
            for (const [moduleName, moduleData] of Object.entries(data.modules)) {
                for (const [dataType, items] of Object.entries(moduleData)) {
                    rows += processItems(items, dataType);
                }
            }
        } else if (data.data) {
            for (const [dataType, items] of Object.entries(data.data)) {
                rows += processItems(items, dataType);
            }
        }
        
        return rows || '<tr><td colspan="4">No data to preview</td></tr>';
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
        if (module === 'notes') {
            // Handle notes import
            const previewData = this.importPreview;
            if (!previewData || !previewData.data || !previewData.data.notes) {
                throw new Error('No notes data found in import file');
            }
            
            const notes = previewData.data.notes;
            
            for (let i = 0; i < notes.length; i++) {
                const note = notes[i];
                try {
                    // Check if note already exists
                    let existingNote = null;
                    if (window.noteDB) {
                        existingNote = await window.enhancedNoteDB.get(note.id);
                    } else {
                        console.error('❌ Note database not available');
                        continue;
                    }
                    
                    if (existingNote) {
                        if (strategy === 'skip') {
                            continue;
                        } else if (strategy === 'update') {
                            if (window.noteDB) {
                                await window.enhancedNoteDB.update(note);
                            } else {
                                console.error('❌ Note database not available');
                                continue;
                            }
                        } else if (strategy === 'merge') {
                            // Merge logic - combine content
                            if (existingNote.content !== note.content) {
                                note.content = existingNote.content + '\n\n--- Merged ---\n\n' + note.content;
                            }
                            if (window.noteDB) {
                                await window.enhancedNoteDB.update(note);
                            } else {
                                console.error('❌ Note database not available');
                                continue;
                            }
                        }
                    } else {
                        // Add new note
                        if (window.noteDB) {
                            await window.enhancedNoteDB.add(note);
                        } else {
                            console.error('❌ Note database not available');
                            continue;
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to import note ${i + 1}:`, note, error);
                }
            }
            
            // Refresh notes display
            if (typeof renderNotes === 'function') {
                renderNotes();
            } else if (typeof updateUI === 'function') {
                updateUI();
            }
        } else if (module === 'insurance') {
            // Handle insurance import
            const previewData = this.importPreview;
            if (!previewData || !previewData.data || !previewData.data.insurance) {
                throw new Error('No insurance data found in import file');
            }
            
            const insurances = previewData.data.insurance;
            
            for (let i = 0; i < insurances.length; i++) {
                const insurance = insurances[i];
                try {
                    // Check if insurance already exists
                    let existingInsurance = null;
                    if (window.insuranceDB) {
                        existingInsurance = insurance.id ? await window.enhancedInsuranceDB.get(insurance.id) : null;
                    }
                    
                    if (existingInsurance) {
                        if (strategy === 'skip') {
                            continue;
                        } else if (strategy === 'update') {
                            if (window.insuranceDB) {
                                await window.enhancedInsuranceDB.update(insurance);
                            }
                        } else if (strategy === 'merge') {
                            // Merge logic - combine notes
                            if (existingInsurance.notes !== insurance.notes) {
                                insurance.notes = existingInsurance.notes + '\n\n--- Merged ---\n\n' + insurance.notes;
                            }
                            if (window.insuranceDB) {
                                await window.enhancedInsuranceDB.update(insurance);
                            }
                        }
                    } else {
                        // Add new insurance
                        if (window.insuranceDB) {
                            const newItem = { ...insurance };
                            delete newItem.id;
                            await window.enhancedInsuranceDB.add(newItem);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to import insurance ${i + 1}:`, insurance, error);
                }
            }
            
            // Refresh insurance display
            if (typeof renderInsuranceList === 'function') {
                await renderInsuranceList();
            }
            if (typeof renderInsuranceStats === 'function') {
                await renderInsuranceStats();
            } else if (typeof updateUI === 'function') {
                updateUI();
            }
        } else {
            // General import handler for all non-notes modules
            const dbMap = {
                income:          window.incomeDB,
                expenses:        window.expenseDB,
                budgets:         window.budgetDB,
                bills:           window.billDB,
                goals:           window.goalDB,
                recurring:       window.recurringDB,
                insurance:       window.insuranceDB,
                vehicles:        window.vehicleDB,
                vehicleServices: window.vehicleServiceDB,
                subscriptions:   window.subscriptionDB,
                shopping:        window.shoppingDB,
                customTypes:     window.customTypeDB,
                customItems:     window.customItemDB,
                medicines:       window.medicineDB,
                familyMembers:   window.familyMembersDB,
                prescriptions:   window.prescriptionsDB,
                dosageSchedule:  window.dosageScheduleDB
            };

            // Support both single-module (data.data) and complete (data.modules) export shapes
            const importSources = this.importPreview?.modules
                ? Object.values(this.importPreview.modules).reduce((acc, mod) => Object.assign(acc, mod), {})
                : (this.importPreview?.data || {});

            for (const [dataType, items] of Object.entries(importSources)) {
                if (!Array.isArray(items)) continue;
                const dbStore = dbMap[dataType];
                if (!dbStore) {
                    console.warn(`No DB store found for dataType: ${dataType}`);
                    continue;
                }

                for (const item of items) {
                    try {
                        const existing = item.id ? await dbStore.get(item.id) : null;
                        if (existing) {
                            if (strategy === 'skip') continue;
                            await dbStore.update({ ...existing, ...item });
                        } else {
                            const newItem = { ...item };
                            delete newItem.id;
                            await dbStore.add(newItem);
                        }
                    } catch (err) {
                        console.warn(`Failed to import item in ${dataType}:`, item, err);
                    }
                }
            }
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

// Export functions for global access
if (typeof window.exportData !== 'function') {
    const exportDataFn = (module, format) => importExportManager.exportData(module, format);
    exportDataFn.__ie_fallback = true;
    window.exportData = exportDataFn;
}
if (typeof window.exportAllData !== 'function') {
    const exportAllDataFn = (format) => importExportManager.exportAllData(format);
    exportAllDataFn.__ie_fallback = true;
    window.exportAllData = exportAllDataFn;
}
if (typeof window.exportModuleData !== 'function') {
    const exportModuleDataFn = (module, format) => importExportManager.exportData(module, format);
    exportModuleDataFn.__ie_fallback = true;
    window.exportModuleData = exportModuleDataFn;
}
if (typeof window.importData !== 'function') {
    const importDataFn = (module, format, fileInputOrFile) => importExportManager.importData(module, format, fileInputOrFile);
    importDataFn.__ie_fallback = true;
    window.importData = importDataFn;
}
if (typeof window.importAllData !== 'function') {
    const importAllDataFn = (format, fileInputOrFile) => importExportManager.importAllData(format, fileInputOrFile);
    importAllDataFn.__ie_fallback = true;
    window.importAllData = importAllDataFn;
}
if (typeof window.importModuleData !== 'function') {
    const importModuleDataFn = (module, fileInput) => {
        const format = fileInput.files[0]?.name.endsWith('.json') ? 'json' : 'excel';
        importExportManager.importData(module, format, fileInput);
    };
    importModuleDataFn.__ie_fallback = true;
    window.importModuleData = importModuleDataFn;
}

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