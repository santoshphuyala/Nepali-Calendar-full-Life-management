/**
 * ============================================================
 * import-export.js  —  Complete Import / Export System
 * ============================================================
 * Single source of truth for ALL import/export logic.
 * app.js contains NO import/export code; it delegates here.
 *
 * Exports exposed on window (unconditionally after page load):
 *   exportAllData(format)
 *   importAllData(format, fileInputOrFile)
 *   exportData(module, format)
 *   importData(module, format, fileInputOrFile)
 *   exportModuleData(module, format)
 *   importModuleData(module, fileInput)
 *   exportCalendarData(scope)
 *   importCalendarData(scope, fileInput)
 *   exportTrackerData(scope)
 *   importTrackerData(scope, fileInput)
 *   backupData()
 *   restoreData()
 *   importHolidaysCSV(event)
 *   exportTransactions()
 *   readExcelFile(file)
 *   downloadFile(content, filename, type)
 *   showImportPreview(data, module)   ← rich modal version
 * ============================================================
 */

// ─── Notification helper ──────────────────────────────────────────────────────
// Use app.js's showNotification if already defined, otherwise create a fallback.
if (typeof window.showNotification !== 'function') {
    window.showNotification = function (message, type = 'info') {
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
// Local alias used throughout this file
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

// ─── Utility: read an Excel file via SheetJS ─────────────────────────────────
async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(ws);
                const name = file.name.toLowerCase();
                let out = {};

                if (name.includes('insurance') || jsonData.some(r => r.policyNumber || r.company)) {
                    out = { type: 'insurance', insurance: jsonData.map(r => ({
                        name: r.name || r.policyName || '', policyNumber: r.policyNumber || r.policyNo || '',
                        company: r.company || r.provider || '', type: r.type || 'other',
                        coverage: parseFloat(r.coverage) || 0, premium: parseFloat(r.premium) || 0,
                        frequency: r.frequency || 'yearly', startDate: r.startDate || '',
                        expiryDate: r.expiryDate || '', beneficiary: r.beneficiary || '',
                        status: r.status || 'active', notes: r.notes || '',
                        createdAt: r.createdAt || new Date().toISOString()
                    }))};
                } else if (name.includes('vehicle') || jsonData.some(r => r.make || r.model)) {
                    out = { type: 'vehicle', vehicles: jsonData.map(r => ({
                        make: r.make || '', model: r.model || '',
                        year: parseInt(r.year) || new Date().getFullYear(),
                        licensePlate: r.licensePlate || r.plate || '', type: r.type || 'car',
                        mileage: parseInt(r.mileage) || 0, fuelType: r.fuelType || 'petrol',
                        status: r.status || 'active', notes: r.notes || '',
                        createdAt: r.createdAt || new Date().toISOString()
                    }))};
                } else if (name.includes('subscription') || jsonData.some(r => r.renewalDate || r.cost)) {
                    out = { type: 'subscription', subscriptions: jsonData.map(r => ({
                        name: r.name || '', category: r.category || 'other',
                        cost: parseFloat(r.cost) || parseFloat(r.amount) || 0,
                        frequency: r.frequency || 'monthly',
                        renewalDate: r.renewalDate || r.dueDate || '',
                        status: r.status || 'active', notes: r.notes || '',
                        createdAt: r.createdAt || new Date().toISOString()
                    }))};
                } else if (name.includes('goal') || jsonData.some(r => r.targetAmount)) {
                    out = { type: 'goals', goals: jsonData.map(r => ({
                        name: r.name || '', targetAmount: parseFloat(r.targetAmount) || 0,
                        currentAmount: parseFloat(r.currentAmount) || 0, deadline: r.deadline || '',
                        category: r.category || 'other', priority: r.priority || 'medium',
                        status: r.status || 'active', notes: r.notes || '',
                        createdAt: r.createdAt || new Date().toISOString()
                    }))};
                } else {
                    out = { type: 'generic', data: jsonData };
                }
                resolve(out);
            } catch (err) { reject(err); }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// ─── Utility: normalize any import payload to { dataType: items[] } ──────────
function normalizeSources(data) {
    if (!data || typeof data !== 'object') return {};
    if (data.modules) {
        // Full backup: { modules: { calendar: { notes, holidays }, tracker: { income, ... }, ... } }
        return Object.values(data.modules).reduce((acc, mod) => {
            if (mod && typeof mod === 'object') Object.assign(acc, mod);
            return acc;
        }, {});
    }
    if (data.data) {
        // Single-module export: { data: { income: [], expenses: [] } }
        return data.data;
    }
    // Bare / flat: top-level keys are arrays
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
            try { await window[fn](); } catch (e) { console.warn(`${fn} failed:`, e); }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR IMPORT / EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

async function exportCalendarData(scope) {
    try {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const allHolidays = await window.enhancedHolidayDB.getAll();
        const allNotes    = await window.enhancedNoteDB.getAll();

        const filterYear  = arr => arr.filter(i => {
            const [y] = (i?.date_bs || '').split('/').map(Number);
            return y === window.currentBsYear;
        });
        const filterMonth = arr => arr.filter(i => {
            const [y, m] = (i?.date_bs || '').split('/').map(Number);
            return y === window.currentBsYear && m === window.currentBsMonth;
        });

        let data = { holidays: [], notes: [] };
        switch (scope) {
            case 'monthly':  data = { holidays: filterMonth(allHolidays), notes: filterMonth(allNotes) }; break;
            case 'yearly':   data = { holidays: filterYear(allHolidays),  notes: filterYear(allNotes)  }; break;
            case 'holidays': data = { holidays: filterYear(allHolidays),  notes: [] }; break;
            case 'events':   data = { holidays: [],                        notes: filterYear(allNotes) }; break;
            default:         data = { holidays: allHolidays,               notes: allNotes }; break;
        }

        const payload = { version: '2.0.0', timestamp: new Date().toISOString(), scope, data };
        downloadFile(JSON.stringify(payload, null, 2), `calendar-${scope || 'export'}-${timestamp}.json`);
        showNotification('✅ Calendar export created', 'success');
    } catch (err) {
        console.error('Calendar export error:', err);
        showNotification('❌ Calendar export failed: ' + err.message, 'error');
    }
}

async function importCalendarData(scope, fileInput) {
    try {
        const file = fileInput?.files?.[0];
        if (!file) { showNotification('❌ No file selected', 'error'); return; }
        if (!file.name.toLowerCase().endsWith('.json')) {
            showNotification('❌ Only JSON is supported for calendar import', 'error'); return;
        }

        const payload = JSON.parse(await file.text());

        // Support all three schemas
        let importData = payload?.data;
        if (!importData && payload?.modules) {
            const cal = payload.modules.calendar || {};
            importData = { holidays: cal.holidays || [], notes: cal.notes || [] };
        }
        if (!importData) { showNotification('❌ Invalid calendar import file', 'error'); return; }

        if (!confirm('This will import items and skip duplicates. Continue?')) return;

        const existingHolidays = await window.enhancedHolidayDB.getAll();
        const existingNotes    = await window.enhancedNoteDB.getAll();
        const hKeys = new Set(existingHolidays.map(h =>
            `${h?.date_bs || ''}|${(h?.name || '').toLowerCase().trim()}|${(h?.type || '').toLowerCase().trim()}`));
        const nKeys = new Set(existingNotes.map(n =>
            `${n?.date_bs || ''}|${(n?.title || '').toLowerCase().trim()}|${(n?.content || '').toLowerCase().trim()}`));

        let added = 0;
        if (Array.isArray(importData.holidays)) {
            for (const h of importData.holidays) {
                const key = `${h?.date_bs || ''}|${(h?.name || '').toLowerCase().trim()}|${(h?.type || '').toLowerCase().trim()}`;
                if (hKeys.has(key)) continue;
                const { id, ...rest } = h || {};
                await window.enhancedHolidayDB.add(rest);
                hKeys.add(key); added++;
            }
        }
        if (Array.isArray(importData.notes)) {
            for (const n of importData.notes) {
                const key = `${n?.date_bs || ''}|${(n?.title || '').toLowerCase().trim()}|${(n?.content || '').toLowerCase().trim()}`;
                if (nKeys.has(key)) continue;
                const { id, ...rest } = n || {};
                await window.enhancedNoteDB.add(rest);
                nKeys.add(key); added++;
            }
        }

        showNotification(`✅ Imported ${added} item(s)`, 'success');
        if (typeof window.renderCalendar === 'function')    window.renderCalendar();
        if (typeof window.renderNotes === 'function')       window.renderNotes();
        if (typeof window.renderHolidayList === 'function') window.renderHolidayList();
    } catch (err) {
        console.error('Calendar import error:', err);
        showNotification('❌ Calendar import failed: ' + err.message, 'error');
    } finally {
        if (fileInput && typeof fileInput.value === 'string') fileInput.value = '';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRACKER IMPORT / EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

async function exportTrackerData(scope) {
    try {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const income    = await window.enhancedIncomeDB.getAll();
        const expenses  = await window.enhancedExpenseDB.getAll();
        const recurring = await window.enhancedRecurringDB.getAll();

        let data = {};
        switch (scope) {
            case 'income':    data = { income }; break;
            case 'expenses':  data = { expenses }; break;
            case 'recurring': data = { recurring }; break;
            case 'monthly': {
                const fm = arr => arr.filter(i => {
                    const [y, m] = (i?.date_bs || '').split('/').map(Number);
                    return y === window.currentBsYear && m === window.currentBsMonth;
                });
                data = { income: fm(income), expenses: fm(expenses) };
                break;
            }
            default: data = { income, expenses, recurring }; break;
        }

        const payload = { version: '2.0.0', timestamp: new Date().toISOString(), scope, data };
        downloadFile(JSON.stringify(payload, null, 2), `tracker-${scope || 'export'}-${timestamp}.json`);
        showNotification('✅ Tracker export created', 'success');
    } catch (err) {
        console.error('Tracker export error:', err);
        showNotification('❌ Tracker export failed: ' + err.message, 'error');
    }
}

async function importTrackerData(scope, fileInput) {
    try {
        const file = fileInput?.files?.[0];
        if (!file) { showNotification('❌ No file selected', 'error'); return; }
        if (!file.name.toLowerCase().endsWith('.json')) {
            showNotification('❌ Only JSON is supported for tracker import', 'error'); return;
        }

        const payload = JSON.parse(await file.text());

        let importData = payload?.data;
        if (!importData && payload?.modules) {
            const tr = payload.modules.tracker || {};
            importData = { income: tr.income || [], expenses: tr.expenses || [], recurring: tr.recurring || [] };
        }
        if (!importData) { showNotification('❌ Invalid tracker import file', 'error'); return; }

        if (!confirm('This will import items and skip duplicates. Continue?')) return;

        const existingIncome    = await window.enhancedIncomeDB.getAll();
        const existingExpenses  = await window.enhancedExpenseDB.getAll();
        const existingRecurring = await window.enhancedRecurringDB.getAll();

        const makeKey  = t => `${t?.date_bs || ''}|${(t?.category || '').toLowerCase()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase()}|${(t?.description || '').toLowerCase()}`;
        const recKey   = t => `${t?.type || ''}|${(t?.description || '').toLowerCase()}|${t?.amount ?? ''}|${(t?.currency || '').toLowerCase()}|${(t?.frequency || '').toLowerCase()}`;

        const iKeys = new Set(existingIncome.map(makeKey));
        const eKeys = new Set(existingExpenses.map(makeKey));
        const rKeys = new Set(existingRecurring.map(recKey));

        let added = 0;
        for (const t of (importData.income || [])) {
            const k = makeKey(t); if (iKeys.has(k)) continue;
            const { id, ...rest } = t; await window.enhancedIncomeDB.add(rest); iKeys.add(k); added++;
        }
        for (const t of (importData.expenses || [])) {
            const k = makeKey(t); if (eKeys.has(k)) continue;
            const { id, ...rest } = t; await window.enhancedExpenseDB.add(rest); eKeys.add(k); added++;
        }
        for (const t of (importData.recurring || [])) {
            const k = recKey(t); if (rKeys.has(k)) continue;
            const { id, ...rest } = t; await window.enhancedRecurringDB.add(rest); rKeys.add(k); added++;
        }

        showNotification(`✅ Imported ${added} item(s)`, 'success');
        if (typeof window.renderTrackerList === 'function')  window.renderTrackerList();
        if (typeof window.renderRecurringList === 'function') window.renderRecurringList();
    } catch (err) {
        console.error('Tracker import error:', err);
        showNotification('❌ Tracker import failed: ' + err.message, 'error');
    } finally {
        if (fileInput && typeof fileInput.value === 'string') fileInput.value = '';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOLIDAYS CSV IMPORT
// ═══════════════════════════════════════════════════════════════════════════════

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
            alert(`${count} holidays imported successfully!`);
            if (typeof window.renderHolidayList === 'function') window.renderHolidayList();
            if (typeof window.renderCalendar === 'function')    window.renderCalendar();
        } catch (err) {
            console.error('CSV import error:', err);
            alert('Error importing CSV. Please check the format.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT TRANSACTIONS (legacy CSV helper used by SMS parser view)
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// BACKUP / RESTORE  (called by backupDataBtn / restoreDataBtn)
// ═══════════════════════════════════════════════════════════════════════════════

async function backupData() {
    await exportAllData('json');
}

function restoreData() {
    const input = document.getElementById('overallImportJson');
    if (input) { input.click(); return; }
    showNotification('❌ Import input not found', 'error');
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLLECT DATA HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

async function collectAllData() {
    return {
        exportDate: new Date().toISOString(),
        version: '2.0.0',
        modules: {
            calendar:     { notes:         await window.enhancedNoteDB.getAll(),
                            holidays:      await window.enhancedHolidayDB.getAll() },
            tracker:      { income:        await window.enhancedIncomeDB.getAll(),
                            expenses:      await window.enhancedExpenseDB.getAll(),
                            recurring:     await window.enhancedRecurringDB.getAll() },
            budget:       { budgets:       await window.enhancedBudgetDB.getAll() },
            bills:        { bills:         await window.enhancedBillDB.getAll() },
            goals:        { goals:         await window.enhancedGoalDB.getAll() },
            insurance:    { insurance:     await window.enhancedInsuranceDB.getAll() },
            vehicle:      { vehicles:      await window.enhancedVehicleDB.getAll(),
                            vehicleServices: await window.enhancedVehicleServiceDB.getAll() },
            subscription: { subscriptions: await window.enhancedSubscriptionDB.getAll() },
            shopping:     { shopping:      await window.enhancedShoppingDB.getAll() },
            custom:       { customTypes:   await window.enhancedCustomTypeDB.getAll(),
                            customItems:   await window.enhancedCustomItemDB.getAll() },
            medicine:     { medicines:     await window.enhancedMedicineDB.getAll(),
                            familyMembers: await window.enhancedFamilyMembersDB.getAll(),
                            prescriptions: await window.enhancedPrescriptionsDB.getAll(),
                            dosageSchedule: await window.enhancedDosageScheduleDB.getAll() },
        }
    };
}

async function collectModuleData(module) {
    const data = {};
    switch (module) {
        case 'calendar':
            data.notes    = await window.enhancedNoteDB.getAll();
            data.holidays = await window.enhancedHolidayDB.getAll();
            break;
        case 'notes':
            data.notes = await window.enhancedNoteDB.getAll();
            break;
        case 'tracker':
        case 'finance': // alias used in HTML settings buttons
            data.income    = await window.enhancedIncomeDB.getAll();
            data.expenses  = await window.enhancedExpenseDB.getAll();
            data.recurring = await window.enhancedRecurringDB.getAll();
            data.budgets   = await window.enhancedBudgetDB.getAll();
            data.bills     = await window.enhancedBillDB.getAll();
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
            data.vehicles       = await window.enhancedVehicleDB.getAll();
            data.vehicleServices = await window.enhancedVehicleServiceDB.getAll();
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
        case 'assets': // alias — insurance + vehicle + subscription
            data.insurance     = await window.enhancedInsuranceDB.getAll();
            data.vehicles      = await window.enhancedVehicleDB.getAll();
            data.vehicleServices = await window.enhancedVehicleServiceDB.getAll();
            data.subscriptions = await window.enhancedSubscriptionDB.getAll();
            break;
        default:
            console.warn(`collectModuleData: unknown module "${module}" — collecting all`);
            return collectAllData();
    }
    return { module, exportDate: new Date().toISOString(), version: '2.0.0', data };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL DATA
// ═══════════════════════════════════════════════════════════════════════════════

async function exportAllData(format = 'json') {
    try {
        showNotification('📤 Preparing complete export...', 'info');
        const allData  = await collectAllData();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

        switch (format) {
            case 'json':
                downloadFile(JSON.stringify(allData, null, 2),
                    `nepali_calendar_backup_${timestamp}.json`);
                break;
            case 'excel':
                if (typeof XLSX !== 'undefined') {
                    const wb = XLSX.utils.book_new();
                    for (const [sheetName, sheetData] of Object.entries(allData.modules)) {
                        const rows = Object.values(sheetData).flat().filter(r => r && typeof r === 'object');
                        if (rows.length > 0) {
                            const ws = XLSX.utils.json_to_sheet(rows);
                            XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
                        }
                    }
                    XLSX.writeFile(wb, `nepali_calendar_backup_${timestamp}.xlsx`);
                } else {
                    showNotification('⚠️ Excel library not available — exporting as JSON instead', 'warning');
                    downloadFile(JSON.stringify(allData, null, 2),
                        `nepali_calendar_backup_${timestamp}.json`);
                }
                break;
            case 'csv': {
                let csv = '';
                for (const [modName, modData] of Object.entries(allData.modules)) {
                    for (const [key, items] of Object.entries(modData)) {
                        if (!Array.isArray(items) || items.length === 0) continue;
                        csv += `# ${modName.toUpperCase()} — ${key.toUpperCase()}\n`;
                        const headers = Object.keys(items[0]);
                        csv += headers.join(',') + '\n';
                        items.forEach(item => {
                            csv += headers.map(h => {
                                const v = item[h];
                                return typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : (v ?? '');
                            }).join(',') + '\n';
                        });
                        csv += '\n';
                    }
                }
                downloadFile(csv, `nepali_calendar_backup_${timestamp}.csv`, 'text/csv');
                break;
            }
        }
        showNotification('✅ Complete export successful!', 'success');
    } catch (err) {
        console.error('Complete export error:', err);
        showNotification('❌ Export failed: ' + err.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT DATA (single module)
// ═══════════════════════════════════════════════════════════════════════════════

async function exportData(module, format = 'json') {
    try {
        showNotification('📤 Preparing export...', 'info');
        const data      = await collectModuleData(module);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

        switch (format) {
            case 'json':
                downloadFile(JSON.stringify(data, null, 2),
                    `${module}_export_${timestamp}.json`);
                break;
            case 'excel':
                if (typeof XLSX !== 'undefined') {
                    const wb = XLSX.utils.book_new();
                    const src = data.data || data;
                    for (const [key, items] of Object.entries(src)) {
                        if (!Array.isArray(items) || items.length === 0) continue;
                        const ws = XLSX.utils.json_to_sheet(items);
                        XLSX.utils.book_append_sheet(wb, ws, key.substring(0, 31));
                    }
                    XLSX.writeFile(wb, `${module}_export_${timestamp}.xlsx`);
                } else {
                    showNotification('⚠️ Excel library not available — exporting as JSON', 'warning');
                    downloadFile(JSON.stringify(data, null, 2), `${module}_export_${timestamp}.json`);
                }
                break;
            case 'csv': {
                const src = data.data || {};
                let csv = '';
                for (const [key, items] of Object.entries(src)) {
                    if (!Array.isArray(items) || items.length === 0) continue;
                    csv += `# ${key.toUpperCase()}\n`;
                    const headers = Object.keys(items[0]);
                    csv += headers.join(',') + '\n';
                    items.forEach(item => {
                        csv += headers.map(h => {
                            const v = item[h];
                            return typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : (v ?? '');
                        }).join(',') + '\n';
                    });
                    csv += '\n';
                }
                downloadFile(csv, `${module}_export_${timestamp}.csv`, 'text/csv');
                break;
            }
        }
        showNotification('✅ Export completed!', 'success');
    } catch (err) {
        console.error('Export error:', err);
        showNotification('❌ Export failed: ' + err.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT ALL DATA  (full backup restore)
// ═══════════════════════════════════════════════════════════════════════════════

async function importAllData(format, fileInputOrFile) {
    const isInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
    const file    = isInput ? fileInputOrFile.files[0] : fileInputOrFile;
    try {
        if (!file) { showNotification('❌ No file selected', 'error'); return; }
        showNotification(`📥 Reading ${format.toUpperCase()} file...`, 'info');

        let parsed;
        if (format === 'json') {
            parsed = JSON.parse(await file.text());
        } else if (format === 'excel') {
            parsed = await readExcelFile(file);
        } else if (format === 'csv') {
            // CSV backup: run through the preview/import flow via the manager
            await importExportManager.importAllData('csv', file);
            return;
        }

        // Normalize: { modules: {...} } OR { data: {...} } OR bare flat object
        const flatData = normalizeSources(parsed);
        const totalRecords = Object.values(flatData).filter(Array.isArray).reduce((s, a) => s + a.length, 0);

        if (totalRecords === 0) {
            showNotification('⚠️ Import file appears to be empty or unrecognised format', 'warning');
            return;
        }

        const moduleList = Object.keys(flatData)
            .filter(k => Array.isArray(flatData[k]) && flatData[k].length > 0).join(', ');

        if (!confirm(
            `This will REPLACE all current data with ${totalRecords} records.\n\n` +
            `Data types found: ${moduleList}\n\nThis cannot be undone. Continue?`
        )) return;

        showNotification('🔄 Importing data...', 'info');

        const dbMap = getDbMap();

        // Clear only stores that have incoming data (safe — no mass wipe)
        for (const [key, db] of Object.entries(dbMap)) {
            if (db && Array.isArray(flatData[key]) && flatData[key].length > 0) {
                try { await db.clear(); } catch (_) {}
            }
        }

        // Restore — strip old ids so DB auto-assigns
        let imported = 0;
        for (const [key, db] of Object.entries(dbMap)) {
            const items = flatData[key];
            if (!db || !Array.isArray(items)) continue;
            for (const item of items) {
                try {
                    const { id, ...rest } = item;
                    await db.add(rest);
                    imported++;
                } catch (e) { console.warn(`Import failed for ${key}:`, e); }
            }
        }

        // Restore settings if present
        if (parsed?.settings) {
            if (parsed.settings.defaultCurrency) localStorage.setItem('defaultCurrency', parsed.settings.defaultCurrency);
            if (parsed.settings.theme)           localStorage.setItem('theme', parsed.settings.theme);
        }

        showNotification(`✅ ${imported} records imported. Reloading...`, 'success');
        setTimeout(() => location.reload(), 1200);
    } catch (err) {
        console.error('Import all error:', err);
        showNotification('❌ Import failed: ' + err.message, 'error');
    } finally {
        if (isInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') fileInputOrFile.value = '';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT DATA  (single module, with rich preview modal)
// ═══════════════════════════════════════════════════════════════════════════════

async function importData(module, format, fileInputOrFile) {
    const isInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
    try {
        const file = isInput ? fileInputOrFile.files[0] : fileInputOrFile;
        if (!file) return;
        showNotification(`📥 Reading ${module} data...`, 'info');

        let data;
        if (format === 'json') {
            data = JSON.parse(await file.text());
        } else if (format === 'excel') {
            data = await readExcelFile(file);
        } else {
            showNotification('❌ Unsupported format', 'error'); return;
        }

        await importExportManager.showImportPreview(data, module);
    } catch (err) {
        console.error('Import error:', err);
        showNotification('❌ Import failed: ' + err.message, 'error');
    } finally {
        if (isInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') fileInputOrFile.value = '';
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT MODULE DATA  (alias used from HTML module-level buttons)
// ═══════════════════════════════════════════════════════════════════════════════

async function importModuleData(module, fileInput) {
    const fmt = fileInput?.files?.[0]?.name?.endsWith('.json') ? 'json' : 'excel';
    await importData(module, fmt, fileInput);
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT/EXPORT MANAGER CLASS  (rich preview modal, CSV, progress UI)
// ═══════════════════════════════════════════════════════════════════════════════

class ImportExportManager {
    constructor() {
        this.duplicateStrategy = 'skip';
        this.importPreview     = null;
        this._initDropdowns();
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

    _toggleDropdown(btn) {
        const dd   = btn.nextElementSibling;
        const open = dd.classList.contains('show');
        this._closeAllDropdowns();
        if (!open) { dd.classList.add('show'); btn.classList.add('active'); }
    }

    _closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.import-export-btn').forEach(b => b.classList.remove('active'));
    }

    // ── importAllData via CSV path (called from importAllData above) ────────
    async importAllData(format, fileInputOrFile) {
        const isInput = !!(fileInputOrFile && typeof fileInputOrFile === 'object' && 'files' in fileInputOrFile);
        const file    = isInput ? fileInputOrFile.files[0] : fileInputOrFile;
        if (!file) return;
        showNotification('📥 Reading file...', 'info');
        let data;
        if (format === 'csv') {
            data = this._parseCSV(await file.text());
        } else {
            data = JSON.parse(await file.text());
        }
        await this.showImportPreview(data, 'all');
        if (isInput && fileInputOrFile && typeof fileInputOrFile.value === 'string') fileInputOrFile.value = '';
    }

    // ── Normalize sources (same logic as top-level function) ───────────────
    _normalizeSources(data) { return normalizeSources(data); }

    // ── Preview modal ───────────────────────────────────────────────────────
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
                        <div class="import-stat-card">
                            <span class="stat-number">${analysis.totalItems}</span>
                            <span class="stat-label">Total Items</span>
                        </div>
                        <div class="import-stat-card">
                            <span class="stat-number" style="color:var(--secondary-color)">${analysis.newItems}</span>
                            <span class="stat-label">New Items</span>
                        </div>
                        <div class="import-stat-card">
                            <span class="stat-number" style="color:var(--warning-color)">${analysis.duplicates}</span>
                            <span class="stat-label">Duplicates</span>
                        </div>
                        <div class="import-stat-card">
                            <span class="stat-number" style="color:var(--info-color)">${analysis.modules}</span>
                            <span class="stat-label">Data Types</span>
                        </div>
                    </div>
                    ${analysis.duplicates > 0 ? `
                    <div class="duplicate-options">
                        <h4>⚠️ Duplicate Handling</h4>
                        <div class="duplicate-option">
                            <input type="radio" id="ie-skip" name="duplicate-strategy" value="skip" checked>
                            <label for="ie-skip">Skip duplicates (recommended)</label>
                        </div>
                        <div class="duplicate-option">
                            <input type="radio" id="ie-update" name="duplicate-strategy" value="update">
                            <label for="ie-update">Update existing items</label>
                        </div>
                        <div class="duplicate-option">
                            <input type="radio" id="ie-merge" name="duplicate-strategy" value="merge">
                            <label for="ie-merge">Merge with existing items</label>
                        </div>
                    </div>` : ''}
                    <div class="import-preview-table">
                        <table>
                            <thead><tr><th>Type</th><th>Title/Name</th><th>Date</th><th>Status</th></tr></thead>
                            <tbody>${this._generatePreviewRows(data)}</tbody>
                        </table>
                    </div>
                    <div class="import-preview-actions">
                        <button class="btn-secondary cancel-btn">Cancel</button>
                        <button class="btn-primary import-btn">Import Data</button>
                    </div>
                </div>`;

            document.body.appendChild(modal);
            modal.style.display = 'block';

            const close = () => { modal.remove(); reject(false); };
            const confirm_ = async () => {
                try {
                    const strategy = document.querySelector('input[name="duplicate-strategy"]:checked')?.value || 'skip';
                    this._showImportProgress();
                    await new Promise(r => setTimeout(r, 400));
                    modal.remove();
                    await this._performImport(module, strategy);
                    showNotification('✅ Import completed successfully!', 'success');
                    await refreshAllViews();
                    resolve(true);
                } catch (err) {
                    modal.remove();
                    showNotification('❌ Import failed: ' + err.message, 'error');
                    reject(err);
                }
            };

            modal.querySelector('.import-preview-close').onclick = close;
            modal.querySelector('.cancel-btn').onclick = close;
            modal.querySelector('.import-btn').onclick = confirm_;
            modal.onclick = e => { if (e.target === modal) close(); };
        });
    }

    _analyzeImportData(data) {
        const sources = this._normalizeSources(data);
        let totalItems = 0, newItems = 0, duplicates = 0, modules = 0;
        for (const [, items] of Object.entries(sources)) {
            if (!Array.isArray(items) || items.length === 0) continue;
            modules++;
            totalItems += items.length;
            newItems   += items.length; // Simplified: real duplicate check needs async DB call
        }
        return { totalItems, newItems, duplicates, modules };
    }

    _generatePreviewRows(data) {
        const sources = this._normalizeSources(data);
        let rows = '';
        for (const [type, items] of Object.entries(sources)) {
            if (!Array.isArray(items)) continue;
            rows += items.slice(0, 10).map(item => {
                const title = String(item.title || item.name || item.description || 'N/A').substring(0, 40);
                const date  = item.date_bs || item.date || item.dueDate || 'N/A';
                return `<tr class="new-row">
                    <td>${type}</td>
                    <td>${title}</td>
                    <td>${date}</td>
                    <td><span class="status-badge new-row">new</span></td>
                </tr>`;
            }).join('');
        }
        return rows || '<tr><td colspan="4" style="text-align:center;color:#888">No data to preview</td></tr>';
    }

    _showImportProgress() {
        const existing = document.querySelector('.import-progress');
        if (existing) existing.remove();
        const p = document.createElement('div');
        p.className = 'import-progress';
        p.innerHTML = `<div class="progress-bar"><div class="progress-bar-fill" style="width:0%"></div></div>
                       <div class="progress-text">Importing...</div>`;
        document.body.appendChild(p);
        let val = 0;
        const iv = setInterval(() => {
            val = Math.min(val + Math.random() * 15, 90);
            const fill = p.querySelector('.progress-bar-fill');
            if (fill) fill.style.width = val + '%';
            if (val >= 90) clearInterval(iv);
        }, 200);
    }

    async _performImport(module, strategy) {
        const dbMap  = getDbMap();
        const sources = this._normalizeSources(this.importPreview);

        if (Object.keys(sources).length === 0) {
            throw new Error('No importable data found in file.');
        }

        let imported = 0, skipped = 0, failed = 0;

        for (const [dataType, items] of Object.entries(sources)) {
            if (!Array.isArray(items) || items.length === 0) continue;
            const db = dbMap[dataType];
            if (!db) { console.warn(`No DB for "${dataType}" — skipping`); continue; }

            for (const item of items) {
                try {
                    const { id: _oldId, ...itemNoId } = item || {};
                    let existing = null;
                    if (item.id) { try { existing = await db.get(item.id); } catch (_) {} }

                    if (existing) {
                        if (strategy === 'skip') { skipped++; continue; }
                        if (strategy === 'update') {
                            await db.update({ ...existing, ...itemNoId, id: existing.id });
                        } else { // merge
                            const merged = { ...existing };
                            for (const [k, v] of Object.entries(itemNoId)) {
                                if (typeof v === 'string' && typeof existing[k] === 'string' && v !== existing[k]) {
                                    merged[k] = existing[k] + '\n\n--- Merged ---\n\n' + v;
                                } else if (v !== undefined) {
                                    merged[k] = v;
                                }
                            }
                            await db.update({ ...merged, id: existing.id });
                        }
                        imported++;
                    } else {
                        await db.add(itemNoId);
                        imported++;
                    }
                } catch (err) {
                    console.warn(`Failed to import item in "${dataType}":`, item, err);
                    failed++;
                }
            }
        }

        // Dismiss progress indicator
        const prog = document.querySelector('.import-progress');
        if (prog) {
            const fill = prog.querySelector('.progress-bar-fill');
            const txt  = prog.querySelector('.progress-text');
            if (fill) fill.style.width = '100%';
            if (txt)  txt.textContent  = `Done! ${imported} imported, ${skipped} skipped, ${failed} failed`;
            setTimeout(() => prog.remove(), 2000);
        }

        console.log(`✅ Import: ${imported} imported, ${skipped} skipped, ${failed} failed`);
    }

    // ── CSV parser ──────────────────────────────────────────────────────────
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
                headers = null;
                return;
            }
            if (!section) return;
            const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
            if (!headers) { headers = values; return; }
            const obj = {};
            headers.forEach((h, i) => { obj[h] = values[i] !== undefined ? values[i] : ''; });
            result[section].push(obj);
        });
        return result;
    }
}

// ─── showImportPreview global alias (used by inline HTML callers) ─────────────
function showImportPreview(data, module) {
    return importExportManager.showImportPreview(data, module);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALISE + EXPOSE ALL GLOBALS
// ═══════════════════════════════════════════════════════════════════════════════

const importExportManager = new ImportExportManager();

/**
 * Apply (or re-apply) all window.* assignments.
 * Called immediately AND on 'load' event so app.js's function declarations
 * (which run after this file because app.js loads last) do not shadow these.
 */
function _applyImportExportGlobals() {
    // Core backup/restore
    window.backupData        = backupData;
    window.restoreData       = restoreData;

    // Full-backup import/export
    window.exportAllData     = exportAllData;
    window.importAllData     = importAllData;

    // Module-level import/export
    window.exportData        = exportData;
    window.importData        = importData;
    window.exportModuleData  = exportData;       // alias
    window.importModuleData  = importModuleData;

    // Calendar
    window.exportCalendarData = exportCalendarData;
    window.importCalendarData = importCalendarData;

    // Tracker
    window.exportTrackerData  = exportTrackerData;
    window.importTrackerData  = importTrackerData;

    // Helpers
    window.importHolidaysCSV  = importHolidaysCSV;
    window.exportTransactions = exportTransactions;
    window.readExcelFile      = readExcelFile;
    window.downloadFile       = downloadFile;
    window.showImportPreview  = showImportPreview;

    // Manager instance (for direct access / testing)
    window.importExportManager = importExportManager;

    // refresh helper used by some views
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
        };
        if (map[view]) map[view]();
        else if (window.switchView) window.switchView(view);
    };
}

// Apply now (covers cases before app.js loads)
_applyImportExportGlobals();

// Re-apply after ALL scripts finish — this beats app.js's named function
// declarations which run when app.js is evaluated (after this file).
window.addEventListener('load', () => {
    _applyImportExportGlobals();
    console.log('✅ import-export.js: all globals confirmed after page load');
});
