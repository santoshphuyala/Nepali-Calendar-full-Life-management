/**
 * ========================================
 * NOTIFICATION MANAGER + PAYMENT HISTORY
 * notification.js — Nepali Calendar PWA
 * Developer: Santosh Phuyal
 * Version: 2.0.0
 *
 * Sections:
 *  1 — Constants
 *  2 — Core notification engine (reminders, inbox, browser push)
 *  3 — Payment History engine  (record, query, delete, export)
 *  4 — Payment History UI      (modal panel, tabs, filters, CSV)
 *  5 — Notification Center UI  (inbox panel, snooze, dismiss)
 *  6 — Scheduler & init
 *  7 — All CSS styles
 *  8 — Auto-init + window exposure
 * ========================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REMINDER_STAGES_DAYS = [15, 10, 5, 1, 0];

const NOTIF_TYPES = {
    INSURANCE:    { icon: '🛡️',  color: '#3498db', label: 'Insurance'        },
    BILL:         { icon: '🧾',  color: '#e67e22', label: 'Bill'              },
    SUBSCRIPTION: { icon: '📡',  color: '#9b59b6', label: 'Subscription'      },
    RECURRING:    { icon: '🔄',  color: '#27ae60', label: 'Recurring Expense' },
    NOTE:         { icon: '📝',  color: '#f39c12', label: 'Reminder Note'     },
    VEHICLE:      { icon: '🚗',  color: '#1abc9c', label: 'Vehicle Renewal'   },
    OVERDUE:      { icon: '⚠️',  color: '#e74c3c', label: 'Overdue'           },
    RENEWED:      { icon: '✅',  color: '#2ecc71', label: 'Renewal Confirmed' },
    MEDICINE_LOW: { icon: '💊',  color: '#e67e22', label: 'Low Medicine Stock'},
    MEDICINE_EXP: { icon: '🏥',  color: '#e74c3c', label: 'Medicine Expiring' },
    MEDICINE_OUT: { icon: '🚨',  color: '#c0392b', label: 'Out of Stock'      },
    MED_RESTOCKED:{ icon: '✅',  color: '#2ecc71', label: 'Medicine Restocked'},
};

// Maps history source string → NOTIF_TYPES key
const HISTORY_SOURCE_MAP = {
    insurance:    'INSURANCE',
    bill:         'BILL',
    subscription: 'SUBSCRIPTION',
    recurring:    'RECURRING',
    vehicle:      'VEHICLE',
};

const SK = {
    DISMISSED:  'notif_dismissed_ids',
    SNOOZED:    'notif_snoozed',
    INBOX:      'notif_inbox',
    PERM_ASKED: 'notif_perm_asked',
    LAST_CHECK: 'notif_last_check',
    HISTORY:    'payment_history',
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — MAIN MODULE
// ─────────────────────────────────────────────────────────────────────────────

const NotificationManager = (() => {

    /* ── localStorage helpers ───────────────────────────────────────────── */
    function _load(key, fallback = null) {
        try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
        catch { return fallback; }
    }
    function _save(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    }

    /* ── Dismiss / Snooze ───────────────────────────────────────────────── */
    function isDismissed(id) { return _load(SK.DISMISSED, []).includes(id); }
    function dismiss(id) {
        const list = _load(SK.DISMISSED, []);
        if (!list.includes(id)) list.push(id);
        _save(SK.DISMISSED, list.slice(-500));
    }
    function isSnoozed(id) {
        const map = _load(SK.SNOOZED, {});
        return map[id] ? new Date(map[id]) > new Date() : false;
    }
    function snooze(id, minutes = 1440) {
        const map = _load(SK.SNOOZED, {});
        map[id] = new Date(Date.now() + minutes * 60000).toISOString();
        _save(SK.SNOOZED, map);
    }

    /* ── In-app inbox ───────────────────────────────────────────────────── */
    function _addToInbox(notif) {
        const inbox = _load(SK.INBOX, []);
        if (inbox.find(n => n.id === notif.id)) return;
        inbox.unshift({ ...notif, read: false, createdAt: new Date().toISOString() });
        _save(SK.INBOX, inbox.slice(0, 100));
        updateBadge();
    }
    function getInbox()    { return _load(SK.INBOX, []); }
    function markRead(id)  {
        const inbox = _load(SK.INBOX, []);
        inbox.forEach(n => { if (n.id === id) n.read = true; });
        _save(SK.INBOX, inbox);
        updateBadge();
    }
    function markAllRead() {
        const inbox = _load(SK.INBOX, []);
        inbox.forEach(n => n.read = true);
        _save(SK.INBOX, inbox);
        updateBadge();
    }
    function clearInbox()  { _save(SK.INBOX, []); updateBadge(); }

    function updateBadge() {
        const unread = getInbox().filter(n => !n.read).length;
        const badge  = document.getElementById('notifBadge');
        if (badge) {
            badge.textContent = unread > 99 ? '99+' : (unread || '');
            badge.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
        if ('setAppBadge' in navigator)
            unread > 0 ? navigator.setAppBadge(unread) : navigator.clearAppBadge();
    }

    /* ── Browser notification ───────────────────────────────────────────── */
    async function _ensurePerm() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied')  return false;
        if (sessionStorage.getItem(SK.PERM_ASKED)) return false;
        sessionStorage.setItem(SK.PERM_ASKED, '1');
        return (await Notification.requestPermission()) === 'granted';
    }

    async function _fireBrowser({ id, title, body, type, requireInteraction = false, clickView = null }) {
        if (!(await _ensurePerm())) return;
        const t = NOTIF_TYPES[type] || NOTIF_TYPES.NOTE;
        const n = new Notification(title, {
            body,
            icon:  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='85'>${encodeURIComponent(t.icon)}</text></svg>`,
            badge: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='${encodeURIComponent(t.color)}'/></svg>`,
            tag: id, requireInteraction,
        });
        n.onclick = () => {
            window.focus();
            if (clickView && typeof window[clickView.fn] === 'function')
                window[clickView.fn](...(clickView.args || []));
            n.close();
        };
        if (!requireInteraction) setTimeout(() => n.close(), 8000);
    }

    /* ── Core dispatcher ────────────────────────────────────────────────── */
    function _dispatch({ type, item, dueDateBs, daysBefore, extraBody = '' }) {
        const t  = NOTIF_TYPES[type];
        const id = `${type}_${item.id || item.name}_${daysBefore}d`;
        if (isDismissed(id) || isSnoozed(id)) return;

        let urgency, req;
        if      (daysBefore === 0)  { urgency = '🔴 DUE TODAY';                 req = true;  }
        else if (daysBefore === 1)  { urgency = '🔴 Due Tomorrow';              req = true;  }
        else if (daysBefore <= 5)   { urgency = `🟠 Due in ${daysBefore} days`; req = false; }
        else if (daysBefore <= 10)  { urgency = `🟡 Due in ${daysBefore} days`; req = false; }
        else                        { urgency = `🟢 Due in ${daysBefore} days`; req = false; }

        const name  = item.name || item.title || item.policyNumber || 'Item';
        const title = `${t.icon} ${t.label}: ${name}`;
        const body  = `${urgency} • ${dueDateBs}${extraBody ? '\n' + extraBody : ''}`;

        _addToInbox({ id, title, body, type, dueDateBs, daysBefore, itemName: name });
        _fireBrowser({ id, title, body, type, requireInteraction: req,
            clickView: { fn: 'switchView', args: [_viewFor(type)] } });
    }

    function _viewFor(type) {
        return { INSURANCE: 'insurance', BILL: 'finance', SUBSCRIPTION: 'subscription',
                 RECURRING: 'finance', NOTE: 'calendar', VEHICLE: 'vehicle',
                 OVERDUE: 'finance' }[type] || 'calendar';
    }

    /* ── Date helpers ───────────────────────────────────────────────────── */
    function _daysUntil(dueDateBs) {
        try {
            const today = getCurrentNepaliDate();
            const todayBs = formatBsDate(today.year, today.month, today.day);
            const [ty, tm, td] = todayBs.split('/').map(Number);
            const [dy, dm, dd] = dueDateBs.split('/').map(Number);
            const ms  = (y, m, d) => new Date(y, m - 1, d).getTime();
            const tAd = bsToAd(ty, tm, td), dAd = bsToAd(dy, dm, dd);
            return Math.round((ms(dAd.year, dAd.month, dAd.day) - ms(tAd.year, tAd.month, tAd.day)) / 86400000);
        } catch { return null; }
    }

    function _todayBs() {
        const t = getCurrentNepaliDate();
        return formatBsDate(t.year, t.month, t.day);
    }

    function _isStage(d) { return REMINDER_STAGES_DAYS.includes(d); }

    /* ── Module checkers ────────────────────────────────────────────────── */
    async function _checkInsurance() {
        try {
            for (const p of await enhancedInsuranceDB.getAll()) {
                if (p.status !== 'active' || !p.expiryDate) continue;
                const d = _daysUntil(p.expiryDate);
                if (d === null) continue;
                if (d < 0) _dispatch({ type:'OVERDUE', item:p, dueDateBs:p.expiryDate, daysBefore:d,
                    extraBody:`Expired ${Math.abs(d)} day(s) ago. Renew immediately.` });
                else if (_isStage(d)) _dispatch({ type:'INSURANCE', item:p, dueDateBs:p.expiryDate, daysBefore:d,
                    extraBody:`Provider: ${p.provider||'—'} | Premium: Rs.${p.premium}` });
            }
        } catch(e) { console.warn('[NotifMgr] insurance:', e); }
    }

    async function _checkBills() {
        try {
            for (const b of await enhancedBillDB.getAll()) {
                if (b.status === 'paid') continue;
                const due = b.dueDate || b.date_bs;
                if (!due) continue;
                const d = _daysUntil(due);
                if (d === null) continue;
                if (d < 0) _dispatch({ type:'OVERDUE', item:b, dueDateBs:due, daysBefore:d,
                    extraBody:`Overdue ${Math.abs(d)} day(s). Rs.${b.amount}` });
                else if (_isStage(d)) _dispatch({ type:'BILL', item:b, dueDateBs:due, daysBefore:d,
                    extraBody:`Rs.${b.amount} | ${b.category||'—'}` });
            }
        } catch(e) { console.warn('[NotifMgr] bills:', e); }
    }

    async function _checkSubscriptions() {
        try {
            for (const s of await enhancedSubscriptionDB.getAll()) {
                if (s.status !== 'active' || !s.renewalDate) continue;
                const d = _daysUntil(s.renewalDate);
                if (d === null) continue;
                if (d < 0) _dispatch({ type:'OVERDUE', item:s, dueDateBs:s.renewalDate, daysBefore:d,
                    extraBody:`Renewal missed ${Math.abs(d)} day(s) ago.` });
                else if (_isStage(d)) _dispatch({ type:'SUBSCRIPTION', item:s, dueDateBs:s.renewalDate, daysBefore:d,
                    extraBody:`${s.currency} ${s.cost} | ${s.billingCycle}` });
            }
        } catch(e) { console.warn('[NotifMgr] subscriptions:', e); }
    }

    async function _checkRecurring() {
        try {
            for (const r of await enhancedRecurringDB.getAll()) {
                const due = r.nextDueDate || r.dueDate;
                if (!due) continue;
                const d = _daysUntil(due);
                if (d === null) continue;
                if (d < 0) _dispatch({ type:'OVERDUE', item:r, dueDateBs:due, daysBefore:d,
                    extraBody:`Overdue. Rs.${r.amount}` });
                else if (_isStage(d)) _dispatch({ type:'RECURRING', item:r, dueDateBs:due, daysBefore:d,
                    extraBody:`Rs.${r.amount} | ${r.frequency||'—'}` });
            }
        } catch(e) { console.warn('[NotifMgr] recurring:', e); }
    }

    async function _checkNotes() {
        try {
            const multiTypes = ['deadline','appointment','meeting','birthday','anniversary'];
            for (const n of await enhancedNoteDB.getAll()) {
                if (!n.isReminder || !n.date_bs || !multiTypes.includes(n.eventType)) continue;
                const d = _daysUntil(n.date_bs);
                if (d !== null && _isStage(d)) _dispatch({ type:'NOTE', item:n, dueDateBs:n.date_bs, daysBefore:d,
                    extraBody:`${n.description||''} | ${n.eventType}` });
            }
        } catch(e) { console.warn('[NotifMgr] notes:', e); }
    }

    async function _checkVehicle() {
        try {
            for (const v of await enhancedVehicleDB.getAll()) {
                // vehicle.js stores: v.name, v.registrationNumber, v.insuranceExpiry, v.bluebookExpiry
                const displayName = v.vehicleName || v.name || 'Vehicle';
                const plateNum    = v.plateNumber  || v.registrationNumber || '—';
                for (const [field, label] of [['insuranceExpiry','Insurance'],['bluebookExpiry','Bluebook']]) {
                    if (!v[field]) continue;
                    const d    = _daysUntil(v[field]);
                    const item = { ...v, name: `${displayName} ${label}` };
                    if (d === null) continue;
                    if (d < 0) _dispatch({ type:'OVERDUE', item, dueDateBs:v[field], daysBefore:d,
                        extraBody:`${label} expired. Plate: ${plateNum}` });
                    else if (_isStage(d)) _dispatch({ type:'VEHICLE', item, dueDateBs:v[field], daysBefore:d,
                        extraBody:`Plate: ${plateNum}` });
                }
            }
        } catch(e) { console.warn('[NotifMgr] vehicle:', e); }
    }

    // ── Medicine stock low + expiry checker ──────────────────────────────────
    // Stock thresholds: OUT = 0, CRITICAL = 1-3, LOW = 4-7, WARNING = 8-14
    // Expiry stages: 0 days (expired), 1-7 days, 8-30 days
    async function _checkMedicines() {
        try {
            const medicines = await enhancedMedicineDB.getAll();
            const today     = new Date();
            today.setHours(0, 0, 0, 0);

            for (const m of medicines) {
                if (m.status !== 'active') continue;
                const name   = m.name || 'Medicine';
                const member = m.familyMemberName || '';   // populated by medicine-tracker if available
                const label  = member ? `${name} (${member})` : name;

                // ── Stock alerts ──────────────────────────────────────────────
                const stock = typeof m.stockQuantity === 'number' ? m.stockQuantity : null;

                if (stock !== null) {
                    if (stock === 0) {
                        // Out of stock — fire every day until restocked
                        const id = `med_out_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_OUT.icon} Out of Stock: ${label}`;
                            const body  = `You have 0 units left. Please restock immediately.`;
                            _addToInbox({ id, title, body, type:'MEDICINE_OUT', daysBefore:0, itemName:label });
                            _fireBrowser({ id, title, body, type:'MEDICINE_OUT', requireInteraction:true });
                        }
                    } else if (stock <= 3) {
                        const id = `med_critical_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_OUT.icon} Critical Stock: ${label}`;
                            const body  = `Only ${stock} unit(s) remaining. Restock now!`;
                            _addToInbox({ id, title, body, type:'MEDICINE_OUT', daysBefore:1, itemName:label });
                            _fireBrowser({ id, title, body, type:'MEDICINE_OUT', requireInteraction:true });
                        }
                    } else if (stock <= 7) {
                        const id = `med_low_${m.id}_${stock}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_LOW.icon} Low Stock: ${label}`;
                            const body  = `Only ${stock} units left. Consider restocking soon.\nDosage: ${m.dosage||'—'} ${m.frequency||''}`;
                            _addToInbox({ id, title, body, type:'MEDICINE_LOW', daysBefore:stock, itemName:label });
                            _fireBrowser({ id, title, body, type:'MEDICINE_LOW' });
                        }
                    } else if (stock <= 14) {
                        const id = `med_warn_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_LOW.icon} Stock Warning: ${label}`;
                            const body  = `${stock} units remaining. Plan to restock soon.`;
                            _addToInbox({ id, title, body, type:'MEDICINE_LOW', daysBefore:stock, itemName:label });
                            // No browser push for warning level — inbox only
                        }
                    }
                }

                // ── Expiry alerts ─────────────────────────────────────────────
                if (m.expiryDate) {
                    const expiryMs  = new Date(m.expiryDate).getTime();
                    const daysLeft  = Math.round((expiryMs - today.getTime()) / 86400000);

                    if (daysLeft < 0) {
                        const id = `med_expired_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_EXP.icon} EXPIRED: ${label}`;
                            const body  = `Expired ${Math.abs(daysLeft)} day(s) ago (${m.expiryDate}). Do NOT use. Dispose safely.`;
                            _addToInbox({ id, title, body, type:'MEDICINE_EXP', daysBefore:daysLeft, itemName:label });
                            _fireBrowser({ id, title, body, type:'MEDICINE_EXP', requireInteraction:true });
                        }
                    } else if (daysLeft === 0) {
                        const id = `med_exptoday_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_EXP.icon} Expires TODAY: ${label}`;
                            const body  = `This medicine expires today. Check with your pharmacist.`;
                            _addToInbox({ id, title, body, type:'MEDICINE_EXP', daysBefore:0, itemName:label });
                            _fireBrowser({ id, title, body, type:'MEDICINE_EXP', requireInteraction:true });
                        }
                    } else if (daysLeft <= 7) {
                        const id = `med_exp7_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_EXP.icon} Expiring in ${daysLeft} day(s): ${label}`;
                            const body  = `Expires on ${m.expiryDate}. Arrange a replacement.`;
                            _addToInbox({ id, title, body, type:'MEDICINE_EXP', daysBefore:daysLeft, itemName:label });
                            _fireBrowser({ id, title, body, type:'MEDICINE_EXP', requireInteraction:daysLeft <= 2 });
                        }
                    } else if (daysLeft <= 30) {
                        const id = `med_exp30_${m.id}`;
                        if (!isDismissed(id) && !isSnoozed(id)) {
                            const title = `${NOTIF_TYPES.MEDICINE_EXP.icon} Expiring in ${daysLeft} days: ${label}`;
                            const body  = `Expires on ${m.expiryDate}. Plan ahead.`;
                            _addToInbox({ id, title, body, type:'MEDICINE_EXP', daysBefore:daysLeft, itemName:label });
                            // Inbox only for 30-day warning
                        }
                    }
                }
            }
        } catch(e) { console.warn('[NotifMgr] medicines:', e); }
    }

    /**
     * Call this from buyMedicine() in medicine-tracker.js after updating stock.
     * Records a restock event and fires a confirmation notification.
     *
     * Usage:
     *   NotificationManager.notifyMedicineRestocked({ medicine, quantityAdded, newStock, amount, store });
     */
    async function notifyMedicineRestocked({ medicine, quantityAdded, newStock, amount = 0, store = '—' }) {
        const label = medicine.name || 'Medicine';
        const id    = `med_restocked_${medicine.id}_${Date.now()}`;
        const title = `${NOTIF_TYPES.MED_RESTOCKED.icon} Restocked: ${label}`;
        const body  = `+${quantityAdded} units added. New stock: ${newStock}.\nFrom: ${store}`;

        _addToInbox({ id, title, body, type:'MED_RESTOCKED', daysBefore:null, itemName:label });
        _fireBrowser({ id, title, body, type:'MED_RESTOCKED' });

        // Clear low-stock dismiss IDs so next check re-fires if stock goes low again
        const clearIds = [`med_out_${medicine.id}`, `med_critical_${medicine.id}`,
                          `med_low_${medicine.id}_${medicine.stockQuantity}`,
                          `med_warn_${medicine.id}`];
        const dismissed = _load(SK.DISMISSED, []).filter(d => !clearIds.includes(d));
        _save(SK.DISMISSED, dismissed);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 3 — PAYMENT HISTORY ENGINE  (backed by IndexedDB)
    // ─────────────────────────────────────────────────────────────────────────
    //
    // All payment records are stored in the 'paymentHistory' IndexedDB store
    // defined in db.js (DB_VERSION 6).  The UI functions (Section 4) call
    // getHistory() which returns a Promise, so they await it properly.
    //
    // localStorage is still used for notifications inbox, snooze & dismissed
    // lists only — those are tiny and don't need IDB.
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Resolve the IDB manager.  enhancedPaymentHistoryDB is created in db.js
     * and exposed on window.  We reference it lazily so notification.js can
     * load before db.js finishes initialising (db.js auto-inits on load).
     */
    function _phDB() {
        return window.enhancedPaymentHistoryDB;
    }

    /**
     * Save one payment record to IndexedDB.
     *
     * @param {Object} opts
     *   source        'insurance' | 'bill' | 'subscription' | 'recurring' | 'vehicle'
     *   itemId        ID of the original item
     *   itemName      Display name
     *   amount        Number
     *   currency      'NPR' | 'USD' | …
     *   paidDateBs    BS date paid (defaults to today)
     *   dueDateBs     The due/renewal date being settled
     *   paymentMethod e.g. 'eSewa', 'Cash', 'Bank Transfer'
     *   notes         Free-text note
     *   meta          { provider, policyNumber, billingCycle, frequency, … }
     *
     * @returns {Promise<Object>}  The saved record (with generated id)
     */
    async function recordPayment(opts) {
        const record = {
            // IDB autoIncrement gives a numeric id; we also keep a string uid
            // for display and deduplication purposes.
            uid:           `ph_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
            source:        opts.source        || 'bill',
            itemId:        opts.itemId        || null,
            itemName:      opts.itemName      || 'Unknown',
            amount:        parseFloat(opts.amount) || 0,
            currency:      opts.currency      || 'NPR',
            paidDateBs:    opts.paidDateBs    || _todayBs(),
            dueDateBs:     opts.dueDateBs     || null,
            paymentMethod: opts.paymentMethod || '—',
            notes:         opts.notes         || '',
            meta:          opts.meta          || {},
            recordedAt:    new Date().toISOString(),
        };

        try {
            const db  = _phDB();
            if (db) {
                const newId = await db.add(record);
                record.id   = newId;   // IDB-assigned autoincrement key
            } else {
                // Fallback: store in localStorage if IDB not ready yet
                console.warn('[NotifMgr] IDB not ready, falling back to localStorage for payment record');
                const fallback = _load(SK.HISTORY, []);
                record.id = record.uid;
                fallback.unshift(record);
                _save(SK.HISTORY, fallback.slice(0, 200));
            }
        } catch(e) {
            console.error('[NotifMgr] recordPayment IDB error:', e);
        }

        return record;
    }

    /**
     * Retrieve all payment history records from IndexedDB.
     * Falls back to localStorage if IDB is unavailable.
     *
     * @param {Function|null} filterFn  Optional client-side filter
     * @returns {Promise<Array>}
     */
    async function getHistory(filterFn = null) {
        try {
            const db = _phDB();
            let rows = db ? await db.getAll() : _load(SK.HISTORY, []);

            // Also merge any localStorage fallback records (edge case on first run)
            const lsFallback = _load(SK.HISTORY, []);
            if (lsFallback.length > 0 && db) {
                // Migrate ls records into IDB, then clear ls
                for (const r of lsFallback) {
                    try { await db.add(r); } catch {}
                }
                _save(SK.HISTORY, []);
                rows = await db.getAll();
            }

            // Sort newest first
            rows.sort((a, b) => (b.recordedAt || '').localeCompare(a.recordedAt || ''));
            return filterFn ? rows.filter(filterFn) : rows;
        } catch(e) {
            console.error('[NotifMgr] getHistory error:', e);
            return [];
        }
    }

    /**
     * Delete a single history record by its IDB numeric id.
     * @param {number|string} id
     */
    async function deleteHistoryRecord(id) {
        try {
            const db = _phDB();
            if (db) await db.delete(Number(id));
            else {
                _save(SK.HISTORY, _load(SK.HISTORY, []).filter(r => r.id != id));
            }
        } catch(e) { console.error('[NotifMgr] deleteHistoryRecord:', e); }
    }

    /** Wipe all history records */
    async function clearHistory() {
        try {
            const db = _phDB();
            if (db) await db.clear();
            _save(SK.HISTORY, []);   // also clear any ls fallback
        } catch(e) { console.error('[NotifMgr] clearHistory:', e); }
    }

    /**
     * Record a payment AND fire a "Renewal Confirmed" notification.
     * This is the single function you call from renewSubscription(),
     * insurance form submit, markBillPaid(), etc.
     *
     * @returns {Promise<void>}
     */
    async function notifyRenewal({ type = 'INSURANCE', item, newDueDateBs,
                                   amount = null, currency = 'NPR',
                                   paymentMethod = '—', notes = '' }) {
        const sourceKey = Object.keys(HISTORY_SOURCE_MAP)
            .find(k => HISTORY_SOURCE_MAP[k] === type) || 'bill';

        const record = await recordPayment({
            source:        sourceKey,
            itemId:        item.id,
            itemName:      item.name || item.title || item.policyNumber || 'Item',
            amount:        amount ?? item.premium ?? item.cost ?? item.amount ?? 0,
            currency,
            paidDateBs:    _todayBs(),
            dueDateBs:     newDueDateBs,
            paymentMethod,
            notes,
            meta: {
                provider:     item.provider      || null,
                policyNumber: item.policyNumber  || null,
                billingCycle: item.billingCycle  || null,
                frequency:    item.frequency     || null,
            },
        });

        const t     = NOTIF_TYPES[type];
        const id    = `renewed_${type}_${item.id}_${newDueDateBs}`;
        const title = `${NOTIF_TYPES.RENEWED.icon} Renewal Confirmed: ${record.itemName}`;
        const body  = `Next due: ${newDueDateBs}\n${t.label} renewed successfully.`;

        _addToInbox({ id, title, body, type:'RENEWED', dueDateBs:newDueDateBs,
                      daysBefore:null, itemName:record.itemName });
        _fireBrowser({ id, title, body, type:'RENEWED' });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 4 — PAYMENT HISTORY UI
    // ─────────────────────────────────────────────────────────────────────────

    /** Open history modal, optionally pre-filtered to a source */
    async function showPaymentHistory(preFilterSource = null) {
        // Show a loading placeholder first
        showModal(`<div class="ph-panel" style="min-height:200px;display:flex;align-items:center;justify-content:center">
            <span style="font-size:2rem">⏳</span>&nbsp;Loading history…
        </div>`);
        const history = await getHistory();
        showModal(_buildHistoryHTML(preFilterSource || 'all', history));
        _bindHistoryUI(history);
    }

    function _buildHistoryHTML(activeSource, history) {
        const sources   = ['all','insurance','bill','subscription','recurring','vehicle'];

        // Summary totals (convert to NPR where possible)
        function toNPR(r) {
            return r.currency === 'NPR' ? r.amount
                : (typeof convertCurrency === 'function'
                   ? convertCurrency(r.amount, r.currency, 'NPR') : r.amount);
        }

        const totalPaid = history.reduce((s, r) => s + toNPR(r), 0);
        const thisMonth = _todayBs().substring(0, 7);
        const monthPaid = history
            .filter(r => (r.paidDateBs || '').startsWith(thisMonth))
            .reduce((s, r) => s + toNPR(r), 0);

        // Per-source totals for mini breakdown
        const bySource = {};
        sources.filter(s => s !== 'all').forEach(s => {
            bySource[s] = history.filter(r => r.source === s).reduce((t, r) => t + toNPR(r), 0);
        });

        return `
        <div id="phPanel" class="ph-panel">

            <div class="ph-header">
                <h2>📜 Payment History</h2>
                <div class="ph-header-actions">
                    <button class="btn-link" id="phExportBtn">⬇ Export CSV</button>
                    <button class="btn-link danger" id="phClearBtn">🗑 Clear All</button>
                    <button class="btn-icon" onclick="closeModal()">✕</button>
                </div>
            </div>

            <div class="ph-summary">
                <div class="ph-card ph-card-primary">
                    <span class="ph-card-label">Total Paid (All-time)</span>
                    <span class="ph-card-value">रू ${Math.round(totalPaid).toLocaleString()}</span>
                </div>
                <div class="ph-card">
                    <span class="ph-card-label">This Month</span>
                    <span class="ph-card-value">रू ${Math.round(monthPaid).toLocaleString()}</span>
                </div>
                <div class="ph-card">
                    <span class="ph-card-label">Total Records</span>
                    <span class="ph-card-value">${history.length}</span>
                </div>
            </div>

            <div class="ph-breakdown">
                ${sources.filter(s => s !== 'all' && bySource[s] > 0).map(s => {
                    const t = NOTIF_TYPES[HISTORY_SOURCE_MAP[s]];
                    return `<div class="ph-breakdown-item" style="border-color:${t.color}20">
                        <span>${t.icon}</span>
                        <span class="ph-breakdown-label">${t.label}</span>
                        <span class="ph-breakdown-val" style="color:${t.color}">
                            रू ${Math.round(bySource[s]).toLocaleString()}
                        </span>
                    </div>`;
                }).join('')}
            </div>

            <div class="ph-tabs">
                ${sources.map(s => `
                <button class="ph-tab ${s === activeSource ? 'active' : ''}" data-source="${s}">
                    ${s === 'all'           ? '🗂 All'
                      : s === 'insurance'   ? '🛡️ Insurance'
                      : s === 'bill'        ? '🧾 Bills'
                      : s === 'subscription'? '📡 Subscriptions'
                      : s === 'recurring'   ? '🔄 Recurring'
                      :                      '🚗 Vehicle'}
                    ${s !== 'all' && history.filter(r=>r.source===s).length > 0
                        ? `<span class="ph-tab-count">${history.filter(r=>r.source===s).length}</span>` : ''}
                </button>`).join('')}
            </div>

            <div class="ph-filters">
                <input type="text" id="phSearch"   placeholder="🔍 Search by name…"  class="ph-search-input">
                <input type="text" id="phFromDate" placeholder="From YYYY/MM/DD"      class="ph-date-input">
                <input type="text" id="phToDate"   placeholder="To   YYYY/MM/DD"      class="ph-date-input">
                <button class="btn-secondary btn-sm" id="phFilterApply">Apply</button>
            </div>

            <div id="phList" class="ph-list">
                ${_renderRows(history, activeSource, '', '', '')}
            </div>
        </div>`;
    }

    function _renderRows(history, source, search, from, to) {
        let rows = [...history];
        if (source && source !== 'all') rows = rows.filter(r => r.source === source);
        if (search) rows = rows.filter(r => (r.itemName||'').toLowerCase().includes(search.toLowerCase()));
        if (from)  rows = rows.filter(r => (r.paidDateBs||'') >= from);
        if (to)    rows = rows.filter(r => (r.paidDateBs||'') <= to);

        if (!rows.length)
            return `<div class="ph-empty"><span>📭</span><p>No payment records found.</p></div>`;

        return rows.map(r => {
            const typeKey = HISTORY_SOURCE_MAP[r.source] || 'BILL';
            const t       = NOTIF_TYPES[typeKey];
            const sym     = r.currency === 'NPR' ? 'रू' : r.currency;
            return `
            <div class="ph-row">
                <div class="ph-row-icon" style="background:${t.color}20;color:${t.color}">${t.icon}</div>
                <div class="ph-row-main">
                    <div class="ph-row-name">${r.itemName}</div>
                    <div class="ph-row-meta">
                        ${r.meta?.provider     ? `<span>🏢 ${r.meta.provider}</span>`     : ''}
                        ${r.meta?.policyNumber ? `<span>📋 ${r.meta.policyNumber}</span>` : ''}
                        ${r.paymentMethod !== '—' ? `<span>💳 ${r.paymentMethod}</span>`  : ''}
                        ${r.notes              ? `<span>📝 ${r.notes}</span>`             : ''}
                    </div>
                    <div class="ph-row-dates">
                        <span>Paid: <strong>${r.paidDateBs||'—'}</strong></span>
                        ${r.dueDateBs ? `<span>Due/Renewed to: ${r.dueDateBs}</span>` : ''}
                    </div>
                </div>
                <div class="ph-row-right">
                    <div class="ph-row-amount">${sym} ${parseFloat(r.amount).toLocaleString()}</div>
                    <div class="ph-row-source-tag" style="color:${t.color}">${t.label}</div>
                    <button class="ph-delete-btn" data-id="${r.id}" title="Delete">🗑</button>
                </div>
            </div>`;
        }).join('');
    }

    function _bindHistoryUI(initialHistory) {
        let currentSource = document.querySelector('.ph-tab.active')?.dataset.source || 'all';
        // Cache loaded history so re-filters don't always re-query IDB
        let cachedHistory = initialHistory || [];

        async function refresh(reloadFromDB = false) {
            if (reloadFromDB) cachedHistory = await getHistory();
            const search = document.getElementById('phSearch')?.value   || '';
            const from   = document.getElementById('phFromDate')?.value || '';
            const to     = document.getElementById('phToDate')?.value   || '';
            const list   = document.getElementById('phList');
            if (list) list.innerHTML = _renderRows(cachedHistory, currentSource, search, from, to);
            _bindDeleteBtns();
        }

        function _bindDeleteBtns() {
            document.querySelectorAll('.ph-delete-btn').forEach(btn => {
                btn.addEventListener('click', async e => {
                    e.stopPropagation();
                    if (!confirm('Delete this payment record?')) return;
                    await deleteHistoryRecord(btn.dataset.id);
                    await refresh(true);
                });
            });
        }

        document.querySelectorAll('.ph-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.ph-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentSource = tab.dataset.source;
                refresh();   // uses cachedHistory — no DB round-trip
            });
        });

        // Debounced search and refresh functions
        const debouncedRefresh = debounce(() => {
            const source = document.getElementById('phSource')?.value || 'all';
            const from = document.getElementById('phFromDate')?.value || '';
            const to = document.getElementById('phToDate')?.value || '';
            refresh();
        }, 300);
        
        document.getElementById('phFilterApply')?.addEventListener('click', debouncedRefresh);
        document.getElementById('phSearch')?.addEventListener('input', debouncedRefresh);

        document.getElementById('phExportBtn')?.addEventListener('click', () => {
            _exportCSV(cachedHistory, currentSource);
        });

        document.getElementById('phClearBtn')?.addEventListener('click', async () => {
            if (!confirm('Clear ALL payment history? This cannot be undone.')) return;
            await clearHistory();
            await refresh(true);
        });

        _bindDeleteBtns();
    }

    function _exportCSV(history, source) {
        let rows = history || [];
        if (source && source !== 'all') rows = rows.filter(r => r.source === source);
        const esc = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
        const headers = ['#','Name','Source','Amount','Currency','Paid Date (BS)',
                         'Due/Renewal Date (BS)','Payment Method','Provider','Policy No.','Notes'];
        const lines = [headers.join(','), ...rows.map((r, i) => [
            i+1, esc(r.itemName), esc(r.source), r.amount, esc(r.currency),
            esc(r.paidDateBs), esc(r.dueDateBs||''), esc(r.paymentMethod),
            esc(r.meta?.provider||''), esc(r.meta?.policyNumber||''), esc(r.notes),
        ].join(','))];

        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), {
            href: url, download: `payment_history_${_todayBs().replace(/\//g,'-')}.csv`
        });
        a.click();
        URL.revokeObjectURL(url);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 5 — NOTIFICATION CENTER UI
    // ─────────────────────────────────────────────────────────────────────────

    function showNotificationCenter() {
        const inbox  = getInbox();
        const unread = inbox.filter(n => !n.read).length;

        showModal(`
        <div id="notifCenter" class="notif-center-panel">
            <div class="notif-center-header">
                <h3>🔔 Notifications ${unread > 0
                    ? `<span class="notif-badge-count">${unread}</span>` : ''}</h3>
                <div class="notif-center-actions">
                    <button class="btn-link"
                        onclick="NotificationManager.markAllRead();NotificationManager.showNotificationCenter()">
                        ✓ Mark all read
                    </button>
                    <button class="btn-link danger"
                        onclick="NotificationManager.clearInbox();NotificationManager.showNotificationCenter()">
                        🗑 Clear
                    </button>
                    <button class="btn-link"
                        onclick="NotificationManager.showPaymentHistory()">
                        📜 Payment History
                    </button>
                    <button class="btn-icon" onclick="closeModal()">✕</button>
                </div>
            </div>
            <div class="notif-center-list">
                ${!inbox.length
                    ? `<div class="notif-empty"><span>🎉</span><p>You're all caught up!</p></div>`
                    : inbox.map(_renderInboxItem).join('')}
            </div>
        </div>`);
    }

    function _renderInboxItem(n) {
        const t      = NOTIF_TYPES[n.type] || NOTIF_TYPES.NOTE;
        const urgCls = n.daysBefore === 0 ? 'urgent' : n.daysBefore === 1 ? 'critical'
                     : n.daysBefore <= 5  ? 'warning' : '';
        return `
        <div class="notif-item ${n.read?'read':'unread'} ${urgCls}"
             onclick="NotificationManager.markRead('${n.id}');this.classList.replace('unread','read')">
            <div class="notif-item-icon" style="background:${t.color}20;color:${t.color}">${t.icon}</div>
            <div class="notif-item-content">
                <div class="notif-item-title">${n.title}</div>
                <div class="notif-item-body">${n.body}</div>
                <div class="notif-item-meta">
                    <span class="notif-type-tag" style="color:${t.color}">${t.label}</span>
                    <span class="notif-time">${_timeAgo(n.createdAt)}</span>
                </div>
            </div>
            <div class="notif-item-actions">
                <button class="notif-snooze-btn" title="Snooze 1 day"
                    onclick="event.stopPropagation();NotificationManager.snooze('${n.id}',1440);this.closest('.notif-item').remove()">💤</button>
                <button class="notif-dismiss-btn" title="Dismiss"
                    onclick="event.stopPropagation();NotificationManager.dismiss('${n.id}');this.closest('.notif-item').remove();NotificationManager.updateBadge()">✕</button>
            </div>
        </div>`;
    }

    function _timeAgo(iso) {
        if (!iso) return '';
        const m = Math.floor((Date.now() - new Date(iso)) / 60000);
        if (m < 1)  return 'just now';
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        return h < 24 ? `${h}h ago` : `${Math.floor(h/24)}d ago`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 6 — SCHEDULER & INIT
    // ─────────────────────────────────────────────────────────────────────────

    async function runAllChecks() {
        _save(SK.LAST_CHECK, new Date().toISOString());
        await _checkInsurance();
        await _checkBills();
        await _checkSubscriptions();
        await _checkRecurring();
        await _checkNotes();
        await _checkVehicle();
        await _checkMedicines();
        updateBadge();
    }

    // Global variable to store the daily timer ID
    let dailyTimerId = null;

    // Schedule daily check at 8 AM
    function _scheduleDailyCheck() {
        // Clear existing timer if it exists
        if (dailyTimerId) {
            clearInterval(dailyTimerId);
            dailyTimerId = null;
            console.log('🧹 Cleared previous daily timer');
        }
        
        const t8am = new Date();
        t8am.setDate(t8am.getDate() + 1);
        t8am.setHours(8, 0, 0, 0);
        
        const timeUntil8am = t8am - Date.now();
        
        if (timeUntil8am > 0) {
            dailyTimerId = setTimeout(() => {
                runAllChecks();
                // Set up recurring daily check
                dailyTimerId = setInterval(runAllChecks, 86400000);
                console.log('⏰ Daily timer scheduled - runs every 24 hours');
            }, timeUntil8am);
        } else {
            // If it's already past 8 AM, start immediately
            runAllChecks();
            dailyTimerId = setInterval(runAllChecks, 86400000);
            console.log('⏰ Daily timer started immediately - runs every 24 hours');
        }
    }

    function init() {
        console.log('🔔 Notification Manager initializing...');
        
        // Initialize notification system
        _injectBell();
        _loadPersistedNotifications();
        _updateBadge();
        
        _scheduleDailyCheck();
        
        // Run initial check after a short delay
        setTimeout(() => runAllChecks(), 2000);
    }

    // Cleanup function to prevent memory leaks
    function cleanup() {
        console.log('🧹 Notification Manager cleanup...');
        
        if (dailyTimerId) {
            clearInterval(dailyTimerId);
            dailyTimerId = null;
            console.log('✅ Daily timer cleared');
        }
    }

    // Add cleanup on page unload to prevent memory leaks
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    function _injectBell() {
        if (document.getElementById('notifBell')) return;
        const header = document.querySelector('.app-header,header,.top-bar,nav');
        if (!header) return;
        const bell = document.createElement('button');
        bell.id        = 'notifBell';
        bell.className = 'notif-bell-btn';
        bell.title     = 'Notifications & Payment History';
        bell.setAttribute('aria-label', 'Open notifications');
        bell.innerHTML = `🔔<span id="notifBadge" class="notif-badge" style="display:none"></span>`;
        bell.addEventListener('click', showNotificationCenter);
        header.appendChild(bell);
    }

    function init() {
        _injectBell();
        _injectStyles();
        _scheduleDailyCheck();
        updateBadge();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 7 — STYLES
    // ─────────────────────────────────────────────────────────────────────────

    function _injectStyles() {
        if (document.getElementById('nmStyles')) return;
        const s = document.createElement('style');
        s.id = 'nmStyles';
        s.textContent = `

/* ── Bell & Badge ──────────────────────────────── */
.notif-bell-btn {
    position: relative;
    background: none; border: none;
    font-size: 1.4rem; cursor: pointer;
    padding: 6px 10px; border-radius: 50%;
    transition: background .2s; line-height: 1;
}
.notif-bell-btn:hover { background: rgba(255,255,255,.18); }

.notif-badge, .notif-badge-count {
    position: absolute; top: 2px; right: 2px;
    background: #e74c3c; color: #fff;
    font-size: .6rem; font-weight: 700;
    min-width: 18px; height: 18px; border-radius: 9px;
    display: inline-flex; align-items: center;
    justify-content: center; padding: 0 4px; pointer-events: none;
}
.notif-badge-count {
    position: static; margin-left: 6px; font-size: .75rem;
}

/* ── Shared buttons ────────────────────────────── */
.btn-link {
    background: none; border: none;
    color: var(--primary-color, #3498db);
    cursor: pointer; font-size: .82rem;
    padding: 3px 7px; border-radius: 4px; white-space: nowrap;
}
.btn-link:hover { background: rgba(52,152,219,.1); }
.btn-link.danger { color: #e74c3c; }
.btn-link.danger:hover { background: rgba(231,76,60,.1); }
.btn-icon {
    background: none; border: none; cursor: pointer;
    font-size: 1rem; padding: 4px 8px; border-radius: 4px;
}
.btn-icon:hover { background: rgba(0,0,0,.07); }

/* ── Notification Center ───────────────────────── */
.notif-center-panel {
    width: min(460px, 96vw);
    max-height: 85vh;
    display: flex; flex-direction: column;
}
.notif-center-header {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    gap: 8px; flex-shrink: 0;
}
.notif-center-header h3 {
    margin: 0; font-size: 1rem;
    display: flex; align-items: center; gap: 4px;
}
.notif-center-actions {
    display: flex; gap: 3px; align-items: center;
    flex-wrap: wrap; justify-content: flex-end;
}
.notif-center-list { overflow-y: auto; flex: 1; padding: 6px 0; }

.notif-empty { text-align: center; padding: 40px 20px; color: var(--text-secondary,#888); }
.notif-empty span { font-size: 2.5rem; display: block; margin-bottom: 8px; }

.notif-item {
    display: flex; align-items: flex-start;
    gap: 10px; padding: 11px 16px;
    border-bottom: 1px solid var(--border-color, #f0f0f0);
    cursor: pointer; transition: background .15s; position: relative;
}
.notif-item:hover { background: var(--hover-bg, #f9f9f9); }
.notif-item.unread { background: var(--unread-bg, #fffbf0); }
.notif-item.unread::before {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:3px; background:#f39c12; border-radius:0 2px 2px 0;
}
.notif-item.urgent.unread::before   { background:#e74c3c; }
.notif-item.critical.unread::before { background:#e67e22; }
.notif-item.warning.unread::before  { background:#f39c12; }

.notif-item-icon {
    width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:1.1rem; flex-shrink:0;
}
.notif-item-content { flex:1; min-width:0; }
.notif-item-title {
    font-weight:600; font-size:.87rem;
    color:var(--text-primary,#1a1a1a);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.notif-item-body {
    font-size:.79rem; color:var(--text-secondary,#555);
    margin-top:2px; line-height:1.4; white-space:pre-line;
}
.notif-item-meta { display:flex; gap:8px; margin-top:3px; align-items:center; }
.notif-type-tag { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.03em; }
.notif-time { font-size:.7rem; color:#aaa; }

.notif-item-actions { display:flex; flex-direction:column; gap:3px; }
.notif-snooze-btn, .notif-dismiss-btn {
    background:none; border:none; cursor:pointer;
    font-size:.85rem; padding:3px 4px; border-radius:4px;
    opacity:.4; transition:opacity .15s, background .15s;
}
.notif-snooze-btn:hover, .notif-dismiss-btn:hover { opacity:1; background:rgba(0,0,0,.07); }

/* ── Payment History Panel ─────────────────────── */
.ph-panel {
    width: min(700px, 97vw);
    max-height: 90vh;
    display: flex; flex-direction: column;
}

.ph-header {
    display:flex; align-items:center;
    justify-content:space-between;
    padding:14px 18px 10px;
    border-bottom:1px solid var(--border-color,#e5e7eb);
    flex-shrink:0; gap:8px;
}
.ph-header h2 { margin:0; font-size:1.1rem; }
.ph-header-actions { display:flex; gap:6px; align-items:center; }

/* Summary cards */
.ph-summary {
    display:flex; gap:10px;
    padding:12px 18px 8px;
    flex-shrink:0; flex-wrap:wrap;
}
.ph-card {
    flex:1 1 130px;
    background:var(--card-bg,#f8f9fa);
    border:1px solid var(--border-color,#e5e7eb);
    border-radius:10px; padding:10px 14px;
    display:flex; flex-direction:column; gap:4px;
}
.ph-card-primary {
    background:linear-gradient(135deg,#3498db15,#3498db08);
    border-color:#3498db40;
}
.ph-card-label { font-size:.7rem; color:var(--text-secondary,#777); text-transform:uppercase; letter-spacing:.04em; }
.ph-card-value { font-size:1.05rem; font-weight:700; color:var(--text-primary,#1a1a1a); }

/* Per-source breakdown */
.ph-breakdown {
    display:flex; gap:8px; flex-wrap:wrap;
    padding:0 18px 10px; flex-shrink:0;
}
.ph-breakdown-item {
    display:flex; align-items:center; gap:5px;
    background:var(--card-bg,#f8f9fa);
    border:1px solid; border-radius:8px;
    padding:5px 10px; font-size:.78rem;
}
.ph-breakdown-label { color:var(--text-secondary,#777); }
.ph-breakdown-val   { font-weight:700; }

/* Tabs */
.ph-tabs {
    display:flex; gap:4px; padding:0 18px 10px;
    overflow-x:auto; flex-shrink:0; scrollbar-width:none;
}
.ph-tabs::-webkit-scrollbar { display:none; }
.ph-tab {
    background:none;
    border:1px solid var(--border-color,#ddd);
    border-radius:20px; padding:5px 12px;
    font-size:.78rem; cursor:pointer;
    white-space:nowrap; transition:all .15s;
    color:var(--text-secondary,#666);
    display:flex; align-items:center; gap:4px;
}
.ph-tab:hover  { border-color:var(--primary-color,#3498db); color:var(--primary-color,#3498db); }
.ph-tab.active {
    background:var(--primary-color,#3498db);
    border-color:var(--primary-color,#3498db);
    color:#fff; font-weight:600;
}
.ph-tab-count {
    background:rgba(255,255,255,.35); color:inherit;
    font-size:.65rem; font-weight:700;
    min-width:16px; height:16px; border-radius:8px;
    display:inline-flex; align-items:center; justify-content:center; padding:0 3px;
}
.ph-tab.active .ph-tab-count { background:rgba(255,255,255,.3); }

/* Filters */
.ph-filters {
    display:flex; gap:8px; padding:0 18px 10px;
    flex-shrink:0; align-items:center; flex-wrap:wrap;
}
.ph-search-input, .ph-date-input {
    border:1px solid var(--border-color,#ddd);
    border-radius:8px; padding:6px 10px;
    font-size:.82rem; outline:none;
    background:var(--input-bg,#fff);
    color:var(--text-primary,#1a1a1a);
    transition:border .15s;
}
.ph-search-input { flex:1; min-width:130px; }
.ph-date-input   { width:128px; }
.ph-search-input:focus, .ph-date-input:focus { border-color:var(--primary-color,#3498db); }

/* List */
.ph-list { overflow-y:auto; flex:1; padding:4px 0; }
.ph-empty {
    text-align:center; padding:40px 20px; color:var(--text-secondary,#888);
}
.ph-empty span { font-size:2rem; display:block; margin-bottom:6px; }

/* Row */
.ph-row {
    display:flex; align-items:flex-start;
    gap:12px; padding:12px 18px;
    border-bottom:1px solid var(--border-color,#f0f0f0);
    transition:background .12s;
}
.ph-row:hover { background:var(--hover-bg,#f9f9f9); }

.ph-row-icon {
    width:38px; height:38px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:1.15rem; flex-shrink:0;
}

.ph-row-main { flex:1; min-width:0; }
.ph-row-name {
    font-weight:600; font-size:.9rem;
    color:var(--text-primary,#1a1a1a);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.ph-row-meta {
    display:flex; flex-wrap:wrap; gap:6px;
    margin-top:3px; font-size:.74rem; color:var(--text-secondary,#777);
}
.ph-row-dates {
    display:flex; gap:10px; margin-top:3px;
    font-size:.74rem; color:var(--text-secondary,#888);
}
.ph-row-dates strong { color:var(--text-primary,#333); }

.ph-row-right {
    text-align:right; flex-shrink:0;
    display:flex; flex-direction:column;
    align-items:flex-end; gap:3px;
}
.ph-row-amount {
    font-size:.95rem; font-weight:700;
    color:var(--success-color,#27ae60);
}
.ph-row-source-tag {
    font-size:.67rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.04em;
}
.ph-delete-btn {
    background:none; border:none; cursor:pointer;
    font-size:.78rem; padding:2px 4px; border-radius:4px;
    opacity:.3; transition:opacity .15s, background .15s; color:#e74c3c;
}
.ph-delete-btn:hover { opacity:1; background:rgba(231,76,60,.1); }

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .notif-item.unread           { background:rgba(243,156,18,.07); }
    .notif-item:hover            { background:rgba(255,255,255,.05); }
    .notif-item-title            { color:#f0f0f0; }
    .notif-item-body             { color:#aaa; }
    .ph-card                     { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.1); }
    .ph-card-value               { color:#f0f0f0; }
    .ph-card-primary             { background:rgba(52,152,219,.12); border-color:rgba(52,152,219,.3); }
    .ph-breakdown-item           { background:rgba(255,255,255,.05); }
    .ph-row:hover                { background:rgba(255,255,255,.04); }
    .ph-row-name                 { color:#f0f0f0; }
    .ph-search-input,.ph-date-input {
        background:rgba(255,255,255,.07);
        color:#f0f0f0;
        border-color:rgba(255,255,255,.15);
    }
}

/* Mobile */
@media (max-width:500px) {
    .ph-filters          { flex-direction:column; }
    .ph-search-input,.ph-date-input { width:100%; }
    .ph-summary          { gap:6px; }
    .ph-card             { flex:1 1 100px; }
    .ph-row-dates        { flex-direction:column; gap:2px; }
    .ph-breakdown        { gap:6px; }
    .notif-center-actions{ gap:2px; }
}
        `;
        document.head.appendChild(s);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────
    return {
        init,
        runAllChecks,

        // Notification center
        showNotificationCenter,
        markRead,
        markAllRead,
        clearInbox,
        dismiss,
        snooze,
        getInbox,
        updateBadge,

        // Payment history
        recordPayment,
        notifyRenewal,
        showPaymentHistory,
        getHistory,
        deleteHistoryRecord,
        clearHistory,

        // Medicine notifications
        notifyMedicineRestocked,
        checkMedicines: _checkMedicines,
    };

})();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — AUTO-INIT
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => NotificationManager.init(), 1500);
});

window.NotificationManager = NotificationManager;

/**
 * ══════════════════════════════════════════════════════
 * INTEGRATION QUICK REFERENCE
 * ══════════════════════════════════════════════════════
 *
 * ① Add to index.html (last <script>):
 *      <script src="notification.js"></script>
 *
 * ② Add a "Payment History" button anywhere:
 *      <button onclick="NotificationManager.showPaymentHistory()">
 *          📜 Payment History
 *      </button>
 *      // Or per-module filtered:
 *      NotificationManager.showPaymentHistory('insurance');
 *
 * ③ In renewSubscription() — after updating DB:
 *      NotificationManager.notifyRenewal({
 *          type: 'SUBSCRIPTION',
 *          item: sub,
 *          newDueDateBs: sub.renewalDate,
 *          amount: sub.cost,
 *          currency: sub.currency,
 *          paymentMethod: sub.paymentMethod || '—',
 *      });
 *
 * ④ In insurance form submit (renew/update):
 *      NotificationManager.notifyRenewal({
 *          type: 'INSURANCE',
 *          item: data,
 *          newDueDateBs: data.expiryDate,
 *          amount: data.premium,
 *      });
 *
 * ⑤ Mark a bill as paid:
 *      NotificationManager.notifyRenewal({
 *          type: 'BILL',
 *          item: bill,
 *          newDueDateBs: bill.nextDueDate,
 *          amount: bill.amount,
 *          paymentMethod: 'eSewa',
 *      });
 *
 * ⑥ Recurring expense paid:
 *      NotificationManager.notifyRenewal({
 *          type: 'RECURRING',
 *          item: recurring,
 *          newDueDateBs: recurring.nextDueDate,
 *          amount: recurring.amount,
 *      });
 *
 * ⑦ Vehicle renewal:
 *      NotificationManager.notifyRenewal({
 *          type: 'VEHICLE',
 *          item: { ...vehicle, name: vehicle.vehicleName + ' Insurance' },
 *          newDueDateBs: vehicle.insuranceExpiry,
 *          amount: vehicle.insurancePremium || 0,
 *      });
 *
 * notifyRenewal() does TWO things automatically:
 *   → Records the payment in Payment History
 *   → Fires a "Renewal Confirmed" browser notification + inbox entry
 * ══════════════════════════════════════════════════════
 */
