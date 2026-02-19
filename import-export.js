/**
 * ============================================================
 * import-export.js  —  Complete Import / Export System (v3.2)
 * ============================================================
 * Enterprise Edition + Native Excel Support
 */

// ─── Notification helper ──────────────────────────────────────────────────────
if (typeof window.showNotification !== 'function') {
    window.showNotification = function (message, type = 'info') {
        if (!document.body) return; 
        const n = document.createElement('div');
        n.style.cssText = `
            position:fixed;top:20px;right:20px;padding:12px 20px;
            background:${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color:white;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,.1);
            z-index:10000;font-size:14px;`;
        n.textContent = message;
        document.body.appendChild(n);
        setTimeout(() => n.parentNode && n.parentNode.removeChild(n), 3000);
    };
}
function showNotification(msg, type) { window.showNotification(msg, type); }

// ─── Utility: download a file to disk ────────────────────────────────────────
function downloadFile(content, filename, type = 'application/json') {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ─── Utility: normalize any import payload ───────────────────────────────────
function normalizeSources(data) {
    if (!data || typeof data !== 'object') return {};
    if (data.modules) {
        return Object.values(data.modules).reduce((acc, mod) => {
            if (mod && typeof mod === 'object') Object.assign(acc, mod);
            return acc;
        }, {});
    }
    if (data.data) return data.data;
    const bare = {};
    for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) bare[k] = v;
    }
    return Object.keys(bare).length ? bare : {};
}

// ─── DB map — every store the app uses ───────────────────────────────────────
function getDbMap() {
    return {
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
        dosageSchedule:  window.enhancedDosageScheduleDB,
    };
}

// ─── Refresh all views that may be affected by an import ─────────────────────
async function refreshAllViews() {
    const refreshers = [
        'renderCalendar', 'renderNotes', 'renderHolidayList',
        'renderTrackerList', 'renderRecurringList', 'updateMonthlySummary',
        'renderInsuranceList', 'renderInsuranceStats',
        'renderVehicleGrid', 'renderSubscriptionList', 'renderSubscriptionSummary',
        'renderGoalsGrid', 'renderShoppingList', 'renderBillsList',
        'renderBudgetOverview', 'renderCustomTypes', 'renderCustomItems',
    ];
    for (const fn of refreshers) {
        if (typeof window[fn] === 'function') {
            try { await window[fn](); } catch (e) {}
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT/EXPORT MANAGER CLASS (Enterprise Edition)
// ═══════════════════════════════════════════════════════════════════════════════
class ImportExportManager {
    constructor() {
        this.importPreview = null;
        this._injectStyles();
        this._initDropdowns();
    }

    _injectStyles() {
        if (document.getElementById('ie-modal-styles')) return;
        const style = document.createElement('style');
        style.id = 'ie-modal-styles';
        style.textContent = `
            .import-preview-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.6);
                z-index: 999999;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(4px);
            }
            .import-preview-content {
                background: var(--bg-primary, #ffffff);
                color: var(--text-primary, #333333);
                width: 90%; max-width: 650px; max-height: 90vh;
                border-radius: 12px; padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                display: flex; flex-direction: column;
            }
            .import-preview-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 15px; border-bottom: 1px solid var(--border-color, #eeeeee);
                padding-bottom: 10px;
            }
            .import-preview-header h3 { margin: 0; font-size: 1.3rem; }
            .import-preview-close { 
                background: none; border: none; font-size: 1.5rem; 
                cursor: pointer; color: var(--text-secondary, #666); 
            }
            .import-preview-stats { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
            .import-stat-card { 
                flex: 1; min-width: 100px; background: var(--bg-secondary, #f8f9fa); 
                padding: 12px; border-radius: 8px; text-align: center; 
                border: 1px solid var(--border-color, #eee); 
            }
            .stat-number { display: block; font-size: 1.4rem; font-weight: bold; color: var(--primary-color, #4A90E2); }
            .stat-label { font-size: 0.8rem; color: var(--text-secondary, #666); }
            .duplicate-options { 
                background: var(--bg-secondary, #f8f9fa); padding: 12px; 
                border-radius: 8px; margin-bottom: 15px; border: 1px solid var(--border-color, #eee); 
            }
            .duplicate-option { margin-bottom: 6px; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
            .import-preview-table { 
                border: 1px solid var(--border-color, #eee); border-radius: 8px; 
                overflow-y: auto; max-height: 250px; margin-bottom: 15px; 
            }
            .import-preview-table table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
            .import-preview-table th { 
                background: var(--bg-secondary, #f8f9fa); padding: 10px; text-align: left; 
                position: sticky; top: 0; z-index: 10; border-bottom: 1px solid var(--border-color, #eee); 
            }
            .import-preview-table td { padding: 8px 10px; border-bottom: 1px solid var(--border-color, #eee); }
            .import-preview-actions { 
                display: flex; justify-content: flex-end; gap: 10px; padding-top: 15px; 
                border-top: 1px solid var(--border-color, #eee); 
            }
            .import-preview-actions button { 
                padding: 10px 18px; border-radius: 6px; border: none; 
                cursor: pointer; font-size: 1rem; font-weight: 500; 
            }
            .import-preview-actions .cancel-btn { background: var(--bg-secondary, #e2e8f0); color: var(--text-primary, #333); }
            .import-preview-actions .import-btn { background: var(--primary-color, #4A90E2); color: white; }
        `;
        document.head.appendChild(style);
    }

    _initDropdowns() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('import-export-btn')) {
                this._toggleDropdown(e.target);
            } else if (!e.target.closest('.import-export-dropdown')) {
                this._closeAllDropdowns();
            }
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dropdown-menu')) e.stopPropagation();
        });
    }

    async importAllData(format, fileInputOrFile) {
        const isInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
        const file    = isInput ? fileInputOrFile.files[0] : fileInputOrFile;
        if (!file) return;
        
        showNotification('📥 Reading file...', 'info');
        let data;
        
        try {
            // Safely route the file parsing based on format
            if (format === 'excel' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                if (typeof XLSX === 'undefined') throw new Error("Excel library (SheetJS) is not loaded.");
                data = await readExcelFile(file);
            } else if (format === 'csv' || file.name.endsWith('.csv')) {
                data = this._parseCSV(await file.text());
            } else {
                data = JSON.parse(await file.text());
            }
            
            await this.showImportPreview(data, 'all');
        } catch (err) {
            showNotification('❌ Import failed: ' + err.message, 'error');
        } finally {
            if (isInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') fileInputOrFile.value = '';
        }
    }

    _normalizeSources(data) { return normalizeSources(data); }

    _getBusinessKeyFn(moduleName) {
        const fns = {
            holidays: (i) => `${i.date_bs}-${(i.name||'').toLowerCase().trim()}`,
            notes: (i) => `${i.date_bs}-${(i.title||'').toLowerCase().trim()}`,
            income: (i) => `${i.date_bs||i.date}-${(i.description||'').toLowerCase().trim()}-${i.amount}`,
            expenses: (i) => `${i.date_bs||i.date}-${(i.description||'').toLowerCase().trim()}-${i.amount}`,
            budgets: (i) => `${(i.category||'').toLowerCase().trim()}-${i.year}-${i.month}`,
            bills: (i) => `${(i.name||'').toLowerCase().trim()}-${i.amount}-${i.dueDate}`,
            goals: (i) => `${(i.name||'').toLowerCase().trim()}-${i.targetAmount}`,
            insurance: (i) => `${(i.company||i.provider||'').toLowerCase().trim()}-${(i.policyNumber||'').toLowerCase().trim()}`,
            vehicles: (i) => `${(i.make||'').toLowerCase().trim()}-${(i.model||'').toLowerCase().trim()}-${(i.licensePlate||'').toLowerCase().trim()}`,
            subscriptions: (i) => `${(i.name||'').toLowerCase().trim()}-${(i.category||'').toLowerCase().trim()}`,
            shopping: (i) => (i.name||'').toLowerCase().trim(),
            customTypes: (i) => (i.name||'').toLowerCase().trim(),
            customItems: (i) => `${i.typeId}-${(i.name||'').toLowerCase().trim()}`,
            recurring: (i) => `${(i.description||'').toLowerCase().trim()}-${i.amount}-${i.frequency}`
        };
        return fns[moduleName] || ((i) => JSON.stringify(i)); 
    }

    async showImportPreview(data, module) {
        return new Promise((resolve, reject) => {
            this.importPreview = data;
            const analysis = this._analyzeImportData(data);

            const modal = document.createElement('div');
            modal.className = 'import-preview-modal';
            modal.innerHTML = `
                <div class="import-preview-content">
                    <div class="import-preview-header">
                        <h3>📋 Import Preview</h3>
                        <button class="import-preview-close">&times;</button>
                    </div>
                    <div class="import-preview-stats">
                        <div class="import-stat-card"><span class="stat-number">${analysis.totalItems}</span><span class="stat-label">Total Items</span></div>
                        <div class="import-stat-card"><span class="stat-number" style="color:var(--secondary-color)">${analysis.newItems}</span><span class="stat-label">To Import</span></div>
                        <div class="import-stat-card"><span class="stat-number" style="color:var(--info-color)">${analysis.modules}</span><span class="stat-label">Data Types</span></div>
                    </div>
                    
                    <div class="duplicate-options" style="margin-top: 15px; background: var(--bg-secondary); padding: 15px; border-radius: 8px;">
                        <h4>⚠️ Duplicate Handling Strategy</h4>
                        <div class="duplicate-option"><input type="radio" id="ie-skip" name="duplicate-strategy" value="skip" checked><label for="ie-skip">Skip duplicates (Safe & Recommended)</label></div>
                        <div class="duplicate-option"><input type="radio" id="ie-update" name="duplicate-strategy" value="update"><label for="ie-update">Overwrite existing items</label></div>
                        <div class="duplicate-option"><input type="radio" id="ie-merge" name="duplicate-strategy" value="merge"><label for="ie-merge">Merge text fields with existing items</label></div>
                    </div>
                    
                    <div class="import-preview-table" style="margin-top: 15px; max-height: 250px; overflow-y: auto;">
                        <table style="width: 100%; text-align: left; border-collapse: collapse;">
                            <thead style="position: sticky; top: 0; background: var(--bg-primary);">
                                <tr><th>Type</th><th>Title / Info</th><th>Date</th></tr>
                            </thead>
                            <tbody>${this._generatePreviewRows(data)}</tbody>
                        </table>
                    </div>
                    <div class="import-preview-actions" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                        <button class="btn-secondary cancel-btn">Cancel</button>
                        <button class="btn-primary import-btn">Start Import</button>
                    </div>
                </div>`;

            document.body.appendChild(modal);

            const close = () => { modal.remove(); resolve(false); }; 
            
            const confirm_ = async () => {
                try {
                    const strategy = document.querySelector('input[name="duplicate-strategy"]:checked')?.value || 'skip';
                    this._setupRealProgressUI();
                    modal.style.display = 'none'; 
                    await this._performImport(module, strategy);
                    modal.remove();
                    showNotification('✅ Import completed successfully!', 'success');
                    await refreshAllViews();
                    resolve(true);
                } catch (err) {
                    modal.remove();
                    const prog = document.querySelector('.import-progress');
                    if (prog) prog.remove();
                    showNotification('❌ Import failed or rolled back: ' + err.message, 'error');
                    resolve(false); 
                }
            };

            modal.querySelector('.import-preview-close').onclick = close;
            modal.querySelector('.cancel-btn').onclick = close;
            modal.querySelector('.import-btn').onclick = confirm_;
        });
    }

    _analyzeImportData(data) {
        const sources = this._normalizeSources(data);
        let totalItems = 0, modules = 0;
        for (const items of Object.values(sources)) {
            if (!Array.isArray(items) || items.length === 0) continue;
            modules++;
            totalItems += items.length;
        }
        return { totalItems, newItems: totalItems, modules }; 
    }

    _generatePreviewRows(data) {
        const sources = this._normalizeSources(data);
        let rows = '';
        for (const [type, items] of Object.entries(sources)) {
            if (!Array.isArray(items)) continue;
            rows += items.slice(0, 10).map(item => {
                const title = String(item.title || item.name || item.description || item.category || 'N/A').substring(0, 40);
                const date  = item.date_bs || item.date || item.dueDate || 'N/A';
                return `<tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px 4px;">${type}</td>
                    <td style="padding: 8px 4px;">${this._escapeHTML(title)}</td>
                    <td style="padding: 8px 4px;">${this._escapeHTML(date)}</td>
                </tr>`;
            }).join('');
        }
        return rows || '<tr><td colspan="3" style="text-align:center;color:#888">No data to preview</td></tr>';
    }

    _setupRealProgressUI() {
        const existing = document.querySelector('.import-progress');
        if (existing) existing.remove();
        const p = document.createElement('div');
        p.className = 'import-progress';
        p.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--bg-primary); padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10001; min-width: 300px; text-align: center;`;
        p.innerHTML = `<div style="margin-bottom: 10px; font-weight: bold;">Importing Data...</div><div class="progress-bar" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;"><div class="progress-bar-fill" style="height: 100%; background: var(--primary-color); width: 0%; transition: width 0.1s;"></div></div><div class="progress-text" style="margin-top: 8px; font-size: 0.85rem; color: var(--text-secondary);">0 / 0 processed</div>`;
        document.body.appendChild(p);
    }

    _escapeHTML(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    _sanitizeItem(item) {
        const clean = {};
        for (const [k, v] of Object.entries(item)) {
            if (typeof v === 'string') clean[k] = v.replace(/<[^>]*>?/gm, '');
            else if (k === 'amount' || k === 'cost' || k === 'targetAmount') clean[k] = isNaN(parseFloat(v)) ? 0 : parseFloat(v);
            else clean[k] = v;
        }
        return clean;
    }

    async _performImport(module, strategy) {
        const dbMap = getDbMap();
        const sources = this._normalizeSources(this.importPreview);

        let totalItems = Object.values(sources).reduce((acc, items) => acc + (Array.isArray(items) ? items.length : 0), 0);
        if (totalItems === 0) throw new Error('No importable data found in file.');

        // ── Auto-Backup (Rollback mechanism) ──
        const backupData = {};
        try {
            for (const dataType of Object.keys(sources)) {
                if (dbMap[dataType]) backupData[dataType] = await dbMap[dataType].getAll();
            }
        } catch (e) { console.warn("Could not create pre-import backup. Continuing carefully."); }

        let processed = 0, imported = 0, skipped = 0, failed = 0;
        const fill = document.querySelector('.progress-bar-fill');
        const txt  = document.querySelector('.progress-text');

        try {
            for (const [dataType, rawItems] of Object.entries(sources)) {
                if (!Array.isArray(rawItems) || rawItems.length === 0) continue;
                const db = dbMap[dataType];
                if (!db) { processed += rawItems.length; continue; }

                const existingItems = await db.getAll();
                const keyFn = this._getBusinessKeyFn(dataType);
                const existingMap = new Map();
                existingItems.forEach(item => existingMap.set(keyFn(item), item));

                const CHUNK_SIZE = 50; 
                for (let i = 0; i < rawItems.length; i += CHUNK_SIZE) {
                    const chunk = rawItems.slice(i, i + CHUNK_SIZE);
                    await Promise.all(chunk.map(async (rawItem) => {
                        try {
                            const cleanItem = this._sanitizeItem(rawItem);
                            const { id: _oldId, ...itemNoId } = cleanItem || {};
                            const bKey = keyFn(itemNoId);
                            const existing = existingMap.get(bKey); 

                            if (existing) {
                                if (strategy === 'skip') { skipped++; }
                                else if (strategy === 'update') { await db.update({ ...itemNoId, id: existing.id }); imported++; }
                                else {
                                    const merged = { ...existing };
                                    for (const [k, v] of Object.entries(itemNoId)) {
                                        if (typeof v === 'string' && typeof existing[k] === 'string' && v !== existing[k] && v.trim() !== '') merged[k] = existing[k] + ' | ' + v;
                                        else if (v !== undefined) merged[k] = v;
                                    }
                                    await db.update({ ...merged, id: existing.id });
                                    imported++;
                                }
                            } else {
                                await db.add(itemNoId);
                                imported++;
                            }
                        } catch (err) { failed++; }
                    }));

                    processed += chunk.length;
                    if (fill) fill.style.width = `${Math.min((processed / totalItems) * 100, 100)}%`;
                    if (txt) txt.textContent = `${processed} / ${totalItems} processed`;
                    await new Promise(r => setTimeout(r, 0)); 
                }
            }
        } catch (fatalError) {
            if (txt) txt.innerHTML = `<span style="color: red">Error! Rolling back data...</span>`;
            for (const [dataType, originalItems] of Object.entries(backupData)) {
                const db = dbMap[dataType];
                if (db) { await db.clear(); for (const item of originalItems) await db.add(item); }
            }
            throw new Error("Import crashed. Your previous data has been safely restored.");
        }

        if (txt) txt.innerHTML = `<span style="color: green">Done!</span> ${imported} imported, ${skipped} duplicates skipped.`;
        await new Promise(r => setTimeout(r, 1500)); 
        const prog = document.querySelector('.import-progress');
        if (prog) prog.remove();
    }

    _parseCSV(text) {
        const lines = text.split('\n');
        const result = {};
        let section = null, headers = null;
        lines.forEach(raw => {
            const line = raw.trim();
            if (!line) return;
            if (line.startsWith('#')) {
                section = line.substring(2).toLowerCase().trim();
                result[section] = [];
                headers = null; return;
            }
            if (!section) return;
            const values = [];
            let inQuotes = false, val = '';
            for (let i = 0; i < line.length; i++) {
                let char = line[i];
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) { values.push(val.trim()); val = ''; }
                else val += char;
            }
            values.push(val.trim().replace(/^"(.*)"$/, '$1')); 
            if (!headers) { headers = values; return; }
            const obj = {};
            headers.forEach((h, i) => { obj[h] = values[i] !== undefined ? values[i] : ''; });
            result[section].push(obj);
        });
        return result;
    }
}

const importExportManager = new ImportExportManager();

// ─── showImportPreview global alias ─────────────
function showImportPreview(data, module) {
    return importExportManager.showImportPreview(data, module);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY / STANDALONE FUNCTIONS (REQUIRED BY APP.JS & INDEX.HTML)
// ═══════════════════════════════════════════════════════════════════════════════

async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                
                const parsedData = {};
                
                // Iterate through every sheet (tab) in the Excel file
                wb.SheetNames.forEach(sheetName => {
                    const ws = wb.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(ws);
                    
                    // Ignore empty sheets or the placeholder "No data available" message we create during export
                    if (jsonData && jsonData.length > 0) {
                        if (jsonData.length === 1 && jsonData[0].Message === "No data available") {
                            return; // Skip placeholder sheets
                        }
                        
                        // Map the sheet name directly to the database store name
                        parsedData[sheetName] = jsonData;
                    }
                });
                
                // Resolve in the normalized structure expected by the importer
                resolve({ data: parsedData });
            } catch (err) { reject(err); }
        };
        reader.onerror = () => reject(new Error('Failed to read Excel file'));
        reader.readAsArrayBuffer(file);
    });
}

// ── Fixed Universal Exporter (Handles complex HTML module mappings and proper Excel Export) ──
async function exportData(module, format = 'json') {
    try {
        let data = {};
        const dbMap = getDbMap();

        // Map HTML arguments to actual IndexedDB stores
        switch(module) {
            case 'budget':     data = { budgets: await dbMap.budgets.getAll() }; break;
            case 'bills':      data = { bills: await dbMap.bills.getAll() }; break;
            case 'goals':      data = { goals: await dbMap.goals.getAll() }; break;
            case 'shopping':   data = { shopping: await dbMap.shopping.getAll() }; break;
            case 'notes':      data = { notes: await dbMap.notes.getAll() }; break;
            case 'insurance':  data = { insurance: await dbMap.insurance.getAll() }; break;
            
            // Plural/Singular mismatch fixes
            case 'subscription': 
            case 'subscriptions': data = { subscriptions: await dbMap.subscriptions.getAll() }; break;
            case 'vehicle':
            case 'vehicles':   data = { vehicles: await dbMap.vehicles.getAll(), vehicleServices: await dbMap.vehicleServices.getAll() }; break;
            
            // Combined Multi-Store Exports
            case 'finance':    data = { income: await dbMap.income.getAll(), expenses: await dbMap.expenses.getAll(), recurring: await dbMap.recurring.getAll(), budgets: await dbMap.budgets.getAll() }; break;
            case 'custom':     data = { customTypes: await dbMap.customTypes.getAll(), customItems: await dbMap.customItems.getAll() }; break;
            case 'financial':  data = { bills: await dbMap.bills.getAll(), goals: await dbMap.goals.getAll(), subscriptions: await dbMap.subscriptions.getAll(), shopping: await dbMap.shopping.getAll(), customTypes: await dbMap.customTypes.getAll(), customItems: await dbMap.customItems.getAll() }; break;
            case 'assets':     data = { insurance: await dbMap.insurance.getAll(), vehicles: await dbMap.vehicles.getAll(), vehicleServices: await dbMap.vehicleServices.getAll(), subscriptions: await dbMap.subscriptions.getAll() }; break;
            case 'calendar':   data = { notes: await dbMap.notes.getAll(), holidays: await dbMap.holidays.getAll() }; break;
            
            default:
                if(dbMap[module]) data[module] = await dbMap[module].getAll();
                break;
        }

        const payload = { exportDate: new Date().toISOString(), version: '2.0.0', module, data };
        
        if (format === 'json') {
            downloadFile(JSON.stringify(payload, null, 2), `${module}_export.json`);
            showNotification(`✅ ${module} exported successfully`, 'success');
        } else if (format === 'excel') {
            if (typeof XLSX === 'undefined') throw new Error("Excel library (SheetJS) is not loaded.");
            
            const wb = XLSX.utils.book_new();

            for (const [sheetName, sheetData] of Object.entries(payload.data)) {
                if (Array.isArray(sheetData) && sheetData.length > 0) {
                    const ws = XLSX.utils.json_to_sheet(sheetData);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31)); // Excel limits tab names to 31 chars
                } else {
                    const ws = XLSX.utils.json_to_sheet([{ Message: "No data available" }]);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                }
            }

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            downloadFile(wbout, `${module}_export.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            showNotification(`✅ ${module} exported to Excel successfully`, 'success');
        }
    } catch (err) {
        showNotification('❌ Export failed: ' + err.message, 'error');
    }
}

// ── Safely routed importers (Prevents JSON.parse crashes on Excel files) ──
async function importData(module, format, fileInputOrFile) {
    const isInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
    const file = isInput ? fileInputOrFile.files[0] : fileInputOrFile;
    if (!file) return;
    
    try {
        let data;
        // Safely branch to avoid syntax errors
        if (format === 'excel' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            if (typeof XLSX === 'undefined') throw new Error("Excel library (SheetJS) is not loaded.");
            data = await readExcelFile(file);
        } else if (format === 'csv' || file.name.endsWith('.csv')) {
            data = importExportManager._parseCSV(await file.text());
        } else {
            data = JSON.parse(await file.text());
        }
        await importExportManager.showImportPreview(data, module);
    } catch (err) { 
        showNotification('❌ Import failed: ' + err.message, 'error'); 
    } finally { 
        if (isInput && fileInputOrFile) fileInputOrFile.value = ''; 
    }
}

async function importAllData(format, fileInputOrFile) {
    await importData('all', format, fileInputOrFile);
}
async function importModuleData(module, fileInput) {
    const format = fileInput?.files?.[0]?.name?.endsWith('.json') ? 'json' : 'excel';
    await importData(module, format, fileInput);
}

// ── Medicine Specific Functions (Now outputs native Excel files) ──
async function exportMedicineData(scope, format = 'json') {
    try {
        const dbMap = getDbMap();
        let data = {};
        switch(scope) {
            case 'medicines': data = { medicines: await dbMap.medicines.getAll() }; break;
            case 'family': data = { familyMembers: await dbMap.familyMembers.getAll() }; break;
            case 'complete':
            default:
                data = {
                    medicines: await dbMap.medicines.getAll(),
                    familyMembers: await dbMap.familyMembers.getAll(),
                    prescriptions: await dbMap.prescriptions.getAll(),
                    dosageSchedule: await dbMap.dosageSchedule.getAll()
                };
                break;
        }
        
        const payload = { exportDate: new Date().toISOString(), version: '2.0.0', scope, data };
        
        if (format === 'json') {
            downloadFile(JSON.stringify(payload, null, 2), `medicine_${scope}_export.json`);
            showNotification(`✅ Medicine data (${scope}) exported`, 'success');
        } else if (format === 'excel') {
            if (typeof XLSX === 'undefined') throw new Error("Excel library is not loaded.");
            
            const wb = XLSX.utils.book_new();
            for (const [sheetName, sheetData] of Object.entries(payload.data)) {
                if (Array.isArray(sheetData) && sheetData.length > 0) {
                    const ws = XLSX.utils.json_to_sheet(sheetData);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                } else {
                    const ws = XLSX.utils.json_to_sheet([{ Message: "No data available" }]);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                }
            }
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            downloadFile(wbout, `medicine_${scope}_export.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            showNotification(`✅ Medicine data (${scope}) exported to Excel`, 'success');
        }
    } catch (err) {
        showNotification('❌ Medicine export failed: ' + err.message, 'error');
    }
}

async function importMedicineData(format, fileInput) {
    const fileFmt = fileInput?.files?.[0]?.name?.endsWith('.xlsx') ? 'excel' : format;
    await importData('medicine', fileFmt, fileInput);
}

// ── Standard Calendar/Tracker Exports ──
async function exportCalendarData(scope) { await exportData('calendar', 'json'); }
async function importCalendarData(scope, fileInput) { await importModuleData('calendar', fileInput); }
async function exportTrackerData(scope) { await exportData(scope === 'complete' ? 'finance' : scope, 'json'); }
async function importTrackerData(scope, fileInput) { await importModuleData('finance', fileInput); }

// ── Holidays CSV Importer ──
async function importHolidaysCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const lines = e.target.result.split('\n').filter(l => l.trim());
            const dataLines = lines[0].includes('date_bs') ? lines.slice(1) : lines;
            let count = 0;
            for (const line of dataLines) {
                const [date_bs, date_ad, name, type] = line.split(',').map(s => s.trim());
                if (date_bs && date_ad && name) {
                    await window.enhancedHolidayDB.add({ date_bs, date_ad, name, type: type || 'public' });
                    count++;
                }
            }
            showNotification(`✅ ${count} holidays imported!`, 'success');
            if (typeof window.renderHolidayList === 'function') window.renderHolidayList();
            if (typeof window.renderCalendar === 'function') window.renderCalendar();
        } catch (err) { showNotification('❌ CSV import error. Please check format.', 'error'); }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ── Export Transactions CSV ──
async function exportTransactions() {
    const allIncome   = await window.enhancedIncomeDB.getAll();
    const allExpenses = await window.enhancedExpenseDB.getAll();
    const csv = [
        ['Type', 'Date (BS)', 'Category', 'Description', 'Amount', 'Currency'],
        ...allIncome.map(i   => ['Income',  i.date_bs, i.category, i.description, i.amount, i.currency || 'NPR']),
        ...allExpenses.map(e => ['Expense', e.date_bs, e.category, e.description, e.amount, e.currency || 'NPR']),
    ].map(row => row.join(',')).join('\n');
    downloadFile(csv, 'transactions.csv', 'text/csv');
}

// ── Collectors & Global Actions (Complete Excel generation added) ──
async function collectAllData() {
    const dbMap = getDbMap();
    const payload = { exportDate: new Date().toISOString(), version: '2.0.0', data: {} };
    for (const [key, db] of Object.entries(dbMap)) {
        payload.data[key] = await db.getAll();
    }
    return payload;
}

async function exportAllData(format = 'json') {
    try {
        showNotification('📤 Preparing complete export...', 'info');
        const allData  = await collectAllData();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        if (format === 'json') {
            downloadFile(JSON.stringify(allData, null, 2), `nepali_calendar_backup_${timestamp}.json`);
            showNotification('✅ JSON Backup completed successfully', 'success');
        } else if (format === 'excel') {
            if (typeof XLSX === 'undefined') throw new Error("Excel library is not loaded.");
            
            const wb = XLSX.utils.book_new();
            for (const [sheetName, sheetData] of Object.entries(allData.data)) {
                if (Array.isArray(sheetData) && sheetData.length > 0) {
                    const ws = XLSX.utils.json_to_sheet(sheetData);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                } else {
                    const ws = XLSX.utils.json_to_sheet([{ Message: "No data available" }]);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                }
            }
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            downloadFile(wbout, `nepali_calendar_backup_${timestamp}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            showNotification('✅ Complete Excel backup successful', 'success');
        } else {
            showNotification('Unsupported format', 'warning');
        }
    } catch (err) { 
        showNotification('❌ Export failed: ' + err.message, 'error'); 
    }
}

async function backupData() { await exportAllData('json'); }
function restoreData() { 
    const input = document.getElementById('overallImportJson');
    if (input) { input.click(); } else { showNotification('❌ Import input not found', 'error'); }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALISE + EXPOSE ALL GLOBALS
// ═══════════════════════════════════════════════════════════════════════════════

function _applyImportExportGlobals() {
    // Manager
    window.showImportPreview   = showImportPreview;
    window.importExportManager = importExportManager;

    // Legacy functions needed by app.js / index.html listeners
    window.importHolidaysCSV   = importHolidaysCSV;
    window.backupData          = backupData;
    window.restoreData         = restoreData;
    window.exportAllData       = exportAllData;
    window.importAllData       = importAllData;
    window.exportData          = exportData;
    window.importData          = importData;
    window.exportModuleData    = exportData;
    window.importModuleData    = importModuleData;
    window.exportCalendarData  = exportCalendarData;
    window.importCalendarData  = importCalendarData;
    window.exportTrackerData   = exportTrackerData;
    window.importTrackerData   = importTrackerData;
    window.exportMedicineData  = exportMedicineData; 
    window.importMedicineData  = importMedicineData; 
    window.exportTransactions  = exportTransactions;
    window.readExcelFile       = readExcelFile;
    window.downloadFile        = downloadFile;

    // View refresher
    window.refreshCurrentView = async () => {
        const active = document.querySelector('.view.active');
        if (!active) return;
        const view = active.id.replace('View', '');
        const map = {
            insurance:    () => { if (window.renderInsuranceList) window.renderInsuranceList(); if (window.renderInsuranceStats) window.renderInsuranceStats(); },
            notes:        () => { if (window.renderNotes) window.renderNotes(); },
            calendar:     () => { if (window.renderCalendar) window.renderCalendar(); },
            tracker:      () => { if (window.renderTrackerList) window.renderTrackerList(); },
            vehicle:      () => { if (window.renderVehicleGrid) window.renderVehicleGrid(); },
            subscription: () => { if (window.renderSubscriptionList) window.renderSubscriptionList(); },
            goals:        () => { if (window.renderGoalsGrid) window.renderGoalsGrid(); },
            medicine:     () => { if (window.renderMedicineList) window.renderMedicineList(); }
        };
        if (map[view]) map[view]();
        else if (window.switchView) window.switchView(view);
    };
}

// Apply globals heavily to ensure app.js doesn't overwrite them
_applyImportExportGlobals();

window.addEventListener('load', () => {
    _applyImportExportGlobals(); // Run again after app.js executes to enforce single-source-of-truth
    console.log('✅ import-export.js: all functions secured to window');
});
