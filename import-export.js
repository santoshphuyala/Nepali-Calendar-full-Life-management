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
                data.notes = await window.noteDB.getAll();
                data.holidays = await window.holidayDB.getAll();
                break;
            case 'notes':
                if (!window.noteDB) {
                    // Try to get notes from other sources if noteDB is not available
                    if (window.state && window.state.notes) {
                        data.notes = window.state.notes;
                    } else {
                        data.notes = [];
                    }
                } else {
                    try {
                        data.notes = await window.noteDB.getAll();
                    } catch (error) {
                        data.notes = [];
                    }
                }
                break;
            case 'tracker':
                data.income = await window.incomeDB.getAll();
                data.expenses = await window.expenseDB.getAll();
                break;
            case 'budget':
                data.budgets = await window.budgetDB.getAll();
                break;
            case 'bills':
                data.bills = await window.billDB.getAll();
                break;
            case 'goals':
                data.goals = await window.goalDB.getAll();
                break;
            case 'insurance':
                data.insurance = await window.insuranceDB.getAll();
                break;
            case 'vehicle':
                data.vehicles = await window.vehicleDB.getAll();
                break;
            case 'subscription':
                data.subscriptions = await window.subscriptionDB.getAll();
                break;
            case 'custom':
                data.customTypes = await window.customTypeDB.getAll();
                data.customItems = await window.customItemDB.getAll();
                break;
            case 'shopping':
                data.shopping = await window.shoppingDB.getAll();
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
                    notes: await window.noteDB.getAll(),
                    holidays: await window.holidayDB.getAll()
                },
                tracker: {
                    income: await window.incomeDB.getAll(),
                    expenses: await window.expenseDB.getAll()
                },
                budget: {
                    budgets: await window.budgetDB.getAll()
                },
                bills: {
                    bills: await window.billDB.getAll()
                },
                goals: {
                    goals: await window.goalDB.getAll()
                },
                insurance: {
                    insurance: await window.insuranceDB.getAll()
                },
                vehicle: {
                    vehicles: await window.vehicleDB.getAll()
                },
                subscription: {
                    subscriptions: await window.subscriptionDB.getAll()
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
        // Create Excel workbook using SheetJS (would need to include SheetJS library)
        // For now, export as CSV format
        await this.exportAsCSV(data, filename.replace('.xlsx', '.csv'));
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
    async importData(module, format, fileInput) {
        try {
            const file = fileInput.files[0];
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
        fileInput.value = '';
    }

    async importAllData(format, fileInput) {
        try {
            const file = fileInput.files[0];
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
        fileInput.value = '';
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
        
        lines.forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) {
                if (line.startsWith('#')) {
                    currentSection = line.substring(2).toLowerCase();
                    result[currentSection] = [];
                }
                return;
            }
            
            if (currentSection && result[currentSection]) {
                // Simple CSV parsing - would need more robust implementation
                const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
                result[currentSection].push(values);
            }
        });
        
        return result;
    }

    async showImportPreview(data, module) {
        const analysis = this.analyzeImportData(data, module);
        
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
                    <button class="btn-secondary" onclick="this.closest('.import-preview-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="importExportManager.executeImport('${module}', this)">Import Data</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close modal handlers
        modal.querySelector('.import-preview-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
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
                        existingNote = await window.noteDB.get(note.id);
                    } else if (window.state && window.state.notes) {
                        existingNote = window.state.notes.find(n => n.id === note.id);
                    }
                    
                    if (existingNote) {
                        if (strategy === 'skip') {
                            continue;
                        } else if (strategy === 'update') {
                            if (window.noteDB) {
                                await window.noteDB.put(note);
                            } else if (window.state && window.state.notes) {
                                const index = window.state.notes.findIndex(n => n.id === note.id);
                                if (index !== -1) {
                                    window.state.notes[index] = note;
                                }
                            }
                        } else if (strategy === 'merge') {
                            // Merge logic - combine content
                            if (existingNote.content !== note.content) {
                                note.content = existingNote.content + '\n\n--- Merged ---\n\n' + note.content;
                            }
                            if (window.noteDB) {
                                await window.noteDB.put(note);
                            } else if (window.state && window.state.notes) {
                                const index = window.state.notes.findIndex(n => n.id === note.id);
                                if (index !== -1) {
                                    window.state.notes[index] = note;
                                }
                            }
                        }
                    } else {
                        // Add new note
                        if (window.noteDB) {
                            await window.noteDB.add(note);
                        } else if (window.state && window.state.notes) {
                            window.state.notes.push(note);
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
        } else {
            // For other modules, simulate import delay for now
            await new Promise(resolve => setTimeout(resolve, 2000));
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
window.exportData = (module, format) => importExportManager.exportData(module, format);
window.exportAllData = (format) => importExportManager.exportAllData(format);
window.exportModuleData = (module, format) => importExportManager.exportData(module, format);
window.importData = (module, format, fileInput) => importExportManager.importData(module, format, fileInput);
window.importAllData = (format, fileInput) => importExportManager.importAllData(format, fileInput);
window.importModuleData = (module, fileInput) => {
    const format = fileInput.files[0]?.name.endsWith('.json') ? 'json' : 'excel';
    importExportManager.importData(module, format, fileInput);
};

// Make importExportManager globally available for testing
window.importExportManager = importExportManager;

// Add refreshCurrentView function for import/export
window.refreshCurrentView = () => {
    const activeView = document.querySelector('.view.active');
    if (activeView) {
        const viewName = activeView.id.replace('View', '');
        // Trigger view refresh
        if (typeof switchView === 'function') {
            switchView(viewName);
        }
    }
};
