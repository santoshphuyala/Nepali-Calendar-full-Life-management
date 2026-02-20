/**
 * ========================================
 * NEPALI CALENDAR PWA - COMPLETE APP v2.0 FIXED
 * Developer: Santosh Phuyal
 * Email: hisantoshphuyal@gmail.com
 * Version: 2.0.0 - ERROR FREE
 * ========================================
 */

 // Global state
let currentBsYear, currentBsMonth, currentBsDay;
let currentView = 'calendar';
let currentCalendarView = 'month';
let selectedDate = null;
let defaultCurrency = 'NPR';

// Initialize variables inside a safe check
const todayInit = (typeof getCurrentNepaliDate === 'function') ? getCurrentNepaliDate() : {year: 2082, month: 11, day: 7};
currentBsYear = todayInit.year;
currentBsMonth = todayInit.month;
currentBsDay = todayInit.day;

const incomeDB = enhancedIncomeDB;
const expenseDB = enhancedExpenseDB;

const noteDB = enhancedNoteDB;
const holidayDB = enhancedHolidayDB;
const shoppingDB = enhancedShoppingDB;
const billDB = enhancedBillDB;
const budgetDB = enhancedBudgetDB;
const goalDB = enhancedGoalDB;
const recurringDB = enhancedRecurringDB;
const insuranceDB = enhancedInsuranceDB;
const vehicleDB = enhancedVehicleDB;
const vehicleServiceDB = enhancedVehicleServiceDB;
const subscriptionDB = enhancedSubscriptionDB;
const customTypeDB = enhancedCustomTypeDB;
const customItemDB = enhancedCustomItemDB;
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
        const dateInput = safeGetElementById('noteDateBs');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);
    
    const noteForm = safeGetElementById('noteForm');
    if (!noteForm) {
        console.error('Note form not found');
        return;
    }
    
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const noteData = {
            date_bs: safeGetElementById('noteDateBs')?.value || '',
            title: safeGetElementById('noteTitle')?.value || '',
            description: safeGetElementById('noteDescription')?.value || '',
            eventType: safeGetElementById('noteEventType')?.value || 'note',
            category: safeGetElementById('noteCategory')?.value || 'other',
            isReminder: safeGetElementById('noteIsReminder')?.checked || false,
            reminderTime: safeGetElementById('noteReminderTime')?.value || '09:00',
            reminderAdvance: parseInt(safeGetElementById('noteReminderAdvance')?.value || 0),
            repeatYearly: safeGetElementById('noteRepeatYearly')?.checked || false,
            priority: document.querySelector('input[name="priority"]:checked')?.value || 'low',
            createdAt: new Date().toISOString()
        };
        
        try {
            if (note?.id) {
                noteData.id = note.id;
                await enhancedNoteDB.update(noteData);
                safeShowNotification('✅ Note updated successfully!', 'success');
            } else {
                await enhancedNoteDB.add(noteData);
                safeShowNotification('✅ Note added successfully!', 'success');
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
            safeShowNotification('❌ Failed to save note', 'error');
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
        const notesContent = safeGetElementById('monthlyNotesContent');
        if (!notesContent) return;

        // Get all notes
        const allNotes = await enhancedNoteDB.getAll();
        
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
        const note = await enhancedNoteDB.get(id);
        if (note) {
            showNoteForm(note);
        }
    } catch (error) {
        console.error('Error editing note:', error);
        safeShowNotification('❌ Failed to edit note', 'error');
    }
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        await enhancedNoteDB.delete(id);
        safeShowNotification('✅ Note deleted successfully!', 'success');
        closeModal();
        renderNotes();
        renderCalendar();
    } catch (error) {
        console.error('Error deleting note:', error);
        safeShowNotification('❌ Failed to delete note', 'error');
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
        const dateInput = safeGetElementById('holidayDateBs');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);
    
    const holidayForm = safeGetElementById('holidayForm');
    if (!holidayForm) {
        console.error('Holiday form not found');
        return;
    }
    
    holidayForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const holidayData = {
            date_bs: safeGetElementById('holidayDateBs')?.value || '',
            date_ad: safeGetElementById('holidayDateAd')?.value || '',
            name: safeGetElementById('holidayName')?.value || '',
            type: safeGetElementById('holidayType')?.value || 'public',
            description: safeGetElementById('holidayDescription')?.value || ''
        };
        
        try {
            if (holiday?.id) {
                holidayData.id = holiday.id;
                await enhancedHolidayDB.update(holidayData);
                safeShowNotification('✅ Holiday updated successfully!', 'success');
            } else {
                await enhancedHolidayDB.add(holidayData);
                safeShowNotification('✅ Holiday added successfully!', 'success');
            }
            
            closeModal();
            renderHolidayList();
            renderCalendar(); // ✅ NO PARAMETERS
        } catch (error) {
            console.error('Error saving holiday:', error);
            safeShowNotification('❌ Failed to save holiday', 'error');
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
        const startDateInput = safeGetElementById('recurringStartDate');
        const endDateInput = safeGetElementById('recurringEndDate');
        
        if (startDateInput && !startDateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(startDateInput);
        }
        
        if (endDateInput && !endDateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(endDateInput);
        }
    }, 100);
    
    const recurringForm = safeGetElementById('recurringForm');
    if (!recurringForm) {
        console.error('Recurring form not found');
        return;
    }
    
    recurringForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const recurringData = {
            type: safeGetElementById('recurringType')?.value || 'income',
            description: safeGetElementById('recurringDescription')?.value || '',
            amount: parseFloat(safeGetElementById('recurringAmount')?.value || 0),
            currency: safeGetElementById('recurringCurrency')?.value || 'NPR',
            category: safeGetElementById('recurringCategory')?.value || 'salary',
            frequency: safeGetElementById('recurringFrequency')?.value || 'monthly',
            startDate: safeGetElementById('recurringStartDate')?.value || '',
            endDate: safeGetElementById('recurringEndDate')?.value || null,
            isActive: safeGetElementById('recurringIsActive')?.checked || true,
            createdAt: new Date().toISOString()
        };
        
        try {
            if (recurring?.id) {
                recurringData.id = recurring.id;
                await enhancedRecurringDB.update(recurringData);
                safeShowNotification('✅ Recurring transaction updated!', 'success');
            } else {
                await enhancedRecurringDB.add(recurringData);
                safeShowNotification('✅ Recurring transaction added!', 'success');
            }
            
            closeModal();
            renderRecurringList();
            renderTrackerList();
        } catch (error) {
            console.error('Error saving recurring transaction:', error);
            safeShowNotification('❌ Failed to save recurring transaction', 'error');
        }
    });
}

/**
 * Render Notes List
 */
async function renderNotes() {
    const notesList = safeGetElementById('notesList');
    if (!notesList) return;
    
    const notes = await enhancedNoteDB.getAll();
    
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
    const holidayList = safeGetElementById('holidayList');
    if (!holidayList) return;
    
    const holidays = await enhancedHolidayDB.getAll();
    
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
    const recurringList = safeGetElementById('recurringList');
    if (!recurringList) return;
    
    const recurring = await enhancedRecurringDB.getAll();
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
        const note = await enhancedNoteDB.get(id);
        if (note) {
            showNoteForm(note);
        }
    } catch (error) {
        console.error('Error editing note:', error);
        safeShowNotification('❌ Failed to edit note', 'error');
    }
}

/**
 * Delete Functions
 */
async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    await enhancedNoteDB.delete(id);
    safeShowNotification('✅ Note deleted', 'success');
    renderNotes();
    renderCalendar();
}

async function deleteHoliday(id) {
    if (!confirm('Delete this holiday?')) return;
    await enhancedHolidayDB.delete(id);
    safeShowNotification('✅ Holiday deleted', 'success');
    renderHolidayList();
    renderCalendar();
}

async function deleteRecurring(id) {
    if (!confirm('Delete this recurring transaction?')) return;
    await enhancedRecurringDB.delete(id);
    safeShowNotification('✅ Recurring transaction deleted', 'success');
    renderRecurringList();
}

/**
 * ========================================
 * NOTIFICATION SYSTEM
 * ========================================
 */
function safeShowNotification(message, type = 'info') {
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
        
        // Debug: Check DOM elements first
        const domStatus = window.debugCheckDOM();
        
        // Debug: Check script loading
        const scripts = {
            'conversion.js': typeof bsToAd !== 'undefined',
            'db.js': typeof initDB !== 'undefined',
            'charts.js': typeof Chart !== 'undefined',
            'import-export.js': typeof ImportExportManager !== 'undefined'
        };
        
        // Debug: Initialize database with error tracking
        try {
            await initDB();
        } catch (dbError) {
            return;
        }
        
        // Debug: Check database connections
        const dbStatus = await window.debugCheckDatabase();
        
        // Debug: Initialize app variables
        const today = getCurrentNepaliDate();
        currentBsYear = today.year;
        currentBsMonth = today.month;
        currentBsDay = today.day;

        initializeHeader();
        initializeYearMonthSelectors();
        initializeEventListeners();
        
        currentCalendarView = 'month';
        
        const viewSwitchBtns = document.querySelectorAll('.view-switch-btn');
        viewSwitchBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.calendarView === 'month');
        });
        const calendarViewContainers = document.querySelectorAll('.calendar-view-container');
        calendarViewContainers.forEach(container => {
            container.classList.remove('active');
        });
        const monthView = safeGetElementById('monthView');
        if (monthView) {
            monthView.classList.add('active');
        }
        
        // FIXED: Wrap initial rendering in a timeout to ensure DB is ready
        setTimeout(() => {
            initializeYearMonthSelectors();
            renderCalendar();
            updateMonthlySummary();
            if (typeof updateAllCharts === 'function') updateAllCharts(currentBsYear, currentBsMonth);
        }, 100);

        // Debug: Theme initialization



        // Debug: Theme initialization
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            const darkModeToggle = safeGetElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = true;
            }
        }

        // Debug: Recurring transactions
        await processRecurringTransactions();

        // Debug: Alerts system
        setTimeout(async () => {
            const alerts = await checkUpcomingAlerts();
            if (alerts.length > 0) {
            }
        }, 2000);

        // Debug: Final function availability check
        const functionStatus = window.debugCheckFunctions();
        
        if (functionStatus.missingFunctions.length > 0) {
        } else {
        }
        
        // Initialize Nepali date pickers for all date inputs
        initNepaliDatePickers();
        
        // Update SMS process button state
        updateSMSProcessButton();

    } catch (error) {
        console.error('❌ App initialization error:', error);
        safeShowNotification('Error initializing app: ' + error.message + '\n\nPlease make sure you are running this on a local server (http://localhost), not by opening the file directly.', 'error');
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
    
    const headerBSDate = safeGetElementById('headerBSDate');
    const headerADDate = safeGetElementById('headerADDate');
    
    if (headerBSDate) {
        headerBSDate.textContent = 
            `BS: ${formatBsDate(today.year, today.month, today.day)} (${getNepaliMonthName(today.month)})`;
    }
    
    if (headerADDate) {
        headerADDate.textContent = 
            `AD: ${adToday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
}

function initializeYearMonthSelectors() {
    const yearSelect = safeGetElementById('yearSelect');
    const monthSelect = safeGetElementById('monthSelect');

    if (!yearSelect || !monthSelect) return;

    yearSelect.innerHTML = '';
    monthSelect.innerHTML = '';

    for (let year = 2082; year <= 2092; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    const nepaliMonthsLocal = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'];
    
    nepaliMonthsLocal.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Force the dropdowns to match the current global state
    if (yearSelect) {
        yearSelect.value = currentBsYear;
    }

    const reminders = await getUpcomingReminders();
    if (!Array.isArray(reminders) || reminders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No upcoming reminders</p></div>';
        return;
    }

    container.innerHTML = reminders.map(reminder => {
        const title = reminder.title || 'Untitled';
        const date = reminder.date_bs || '';
        const time = reminder.reminderTime ? ` ⏰ ${reminder.reminderTime}` : '';
        return `<div class="reminder-item"><strong>${title}</strong><div>${date}${time}</div></div>`;
    }).join('');
}

async function removeDuplicateHolidays() {
    try {
        const holidays = await enhancedHolidayDB.getAll();
        if (!Array.isArray(holidays) || holidays.length === 0) {
            showNotification('No holidays found', 'info');
            return;
        }

        const seen = new Set();
        const duplicateIds = [];

        holidays.forEach(h => {
            const key = `${h?.date_bs || ''}|${(h?.name || '').toLowerCase().trim()}|${(h?.type || '').toLowerCase().trim()}`;
            if (seen.has(key)) {
                if (h && typeof h.id !== 'undefined') {
                    duplicateIds.push(h.id);
                }
            } else {
                seen.add(key);
            }
        });

        if (duplicateIds.length === 0) {
            showNotification('✅ No duplicate holidays found', 'success');
            return;
        }

        const confirmed = confirm(`Found ${duplicateIds.length} duplicate holidays. Remove them?`);
        if (!confirmed) return;

        for (const id of duplicateIds) {
            await enhancedHolidayDB.delete(id);
        }

        showNotification(`✅ Removed ${duplicateIds.length} duplicates`, 'success');
        if (typeof renderHolidayList === 'function') {
            renderHolidayList();
        }
    } catch (error) {
        console.error('Error removing duplicate holidays:', error);
        showNotification('❌ Failed to remove duplicates', 'error');
    }
}



function initializeEventListeners() {
    // Use performance optimizer for event listener management
    const perf = window.performanceOptimizer;

    // Import/Export Dropdown Event Listeners
    const calendarExportBtn = perf.getCachedElement('#calendarExportBtn');
    const calendarImportBtn = perf.getCachedElement('#calendarImportBtn');
    const trackerExportBtn = perf.getCachedElement('#trackerExportBtn');
    const trackerImportBtn = perf.getCachedElement('#trackerImportBtn');

    // Budget Import/Export
    const budgetExportBtn = perf.getCachedElement('#budgetExportBtn');
    const budgetImportBtn = perf.getCachedElement('#budgetImportBtn');

    // Bills Import/Export
    const billsExportBtn = perf.getCachedElement('#billsExportBtn');
    const billsImportBtn = perf.getCachedElement('#billsImportBtn');

    // Goals Import/Export
    const goalsExportBtn = perf.getCachedElement('#goalsExportBtn');
    const goalsImportBtn = perf.getCachedElement('#goalsImportBtn');

    // Insurance Import/Export
    const insuranceExportBtn = perf.getCachedElement('#insuranceExportBtn');
    const insuranceImportBtn = perf.getCachedElement('#insuranceImportBtn');

    // Vehicle Import/Export
    const vehicleExportBtn = perf.getCachedElement('#vehicleExportBtn');
    const vehicleImportBtn = perf.getCachedElement('#vehicleImportBtn');

    // Subscription Import/Export
    const subscriptionExportBtn = perf.getCachedElement('#subscriptionExportBtn');
    const subscriptionImportBtn = perf.getCachedElement('#subscriptionImportBtn');

    // Custom Import/Export
    const customExportBtn = perf.getCachedElement('#customExportBtn');
    const customImportBtn = perf.getCachedElement('#customImportBtn');

    // Shopping Import/Export
    const shoppingExportBtn = perf.getCachedElement('#shoppingExportBtn');
    const shoppingImportBtn = perf.getCachedElement('#shoppingImportBtn');

    // Calendar Export Dropdown
    if (calendarExportBtn) {
        perf.addTrackedListener(calendarExportBtn, 'click', (e) => {
            e.stopPropagation();
            toggleDropdown('calendarExportMenu');
        });
    }

    // Calendar Import Dropdown
    if (calendarImportBtn) {
        perf.addTrackedListener(calendarImportBtn, 'click', (e) => {
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
    
    if (overallExportBtn) {
        overallExportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            overallExportMenu.classList.toggle('show');
        });
    } else {
    }
    
    // Overall Import button
    const overallImportBtn = document.getElementById('overallImportBtn');
    const overallImportMenu = document.getElementById('overallImportMenu');
    
    if (overallImportBtn) {
        overallImportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            overallImportMenu.classList.toggle('show');
        });
    } else {
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

    const financeDataBtn = document.getElementById('financeDataBtn');
    const financeDataMenu = document.getElementById('financeDataMenu');
    if (financeDataBtn) {
        financeDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            financeDataMenu.classList.toggle('show');
        });
    }
    
    const assetsDataBtn = document.getElementById('assetsDataBtn');
    const assetsDataMenu = document.getElementById('assetsDataMenu');
    if (assetsDataBtn) {
        assetsDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            assetsDataMenu.classList.toggle('show');
        });
    }

    const medicineDataBtn = document.getElementById('medicineDataBtn');
    const medicineDataMenu = document.getElementById('medicineDataMenu');
    if (medicineDataBtn) {
        medicineDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            medicineDataMenu.classList.toggle('show');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // FIXED: Respects both dropdown classes so menus don't instantly close
        if (!e.target.closest('.dropdown-container') && !e.target.closest('.import-export-dropdown')) {
            closeAllDropdowns();
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
        case 'assets':
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
        case 'medicine':
            // Initialize medicine tracker when medicine view is accessed
            if (typeof initMedicineTracker === 'function') {
                initMedicineTracker();
            }
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
            break;
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
        const allHolidays = await enhancedHolidayDB.getAll();
        
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
        if (!grid) return;
        grid.innerHTML = '';

        const today = getCurrentNepaliDate();
        
        // CRITICAL PERFORMANCE FIX: Fetch all data ONCE for the whole year
        const [allIncome, allExpenses, allNotes, allBills, allHolidays] = await Promise.all([
            enhancedIncomeDB.getAll(),
            enhancedExpenseDB.getAll(),
            enhancedNoteDB.getAll(),
            enhancedBillDB.getAll(),
            enhancedHolidayDB.getAll()
        ]);

        const yearData = { allIncome, allExpenses, allNotes, allBills, allHolidays };

        const months = [
            { name: 'बैशाख', number: 1 }, { name: 'जेठ', number: 2 }, { name: 'असार', number: 3 },
            { name: 'श्रावण', number: 4 }, { name: 'भाद्र', number: 5 }, { name: 'असोज', number: 6 },
            { name: 'कार्तिक', number: 7 }, { name: 'मंसिर', number: 8 }, { name: 'पुष', number: 9 },
            { name: 'माघ', number: 10 }, { name: 'फाल्गुन', number: 11 }, { name: 'चैत्र', number: 12 }
        ];

        for (const month of months) {
            // Pass the pre-fetched yearData to the card creator
            const monthCard = createYearMonthCard(month, currentBsYear, today, yearData);
            grid.appendChild(monthCard);
        }

        displayYearlyHolidays(allHolidays); 
        displayYearlySummary(yearData);

    } catch (error) {
        console.error('❌ Year view render error:', error);
    }
}




    
    
function createYearMonthCard(month, year, today, yearData) {
    const card = document.createElement('div');
    card.className = 'year-month-card';
    if (month.number === today.month && year === today.year) card.classList.add('current-month');

    const header = document.createElement('div');
    header.className = 'year-month-header';
    header.innerHTML = `<span class="year-month-name">${month.name}</span><span class="year-month-number">${month.number}</span>`;
    card.appendChild(header);

    const miniCalendar = document.createElement('div');
    miniCalendar.className = 'year-month-days'; 
    
    // Day Name Headers
    ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'year-month-day-header';
        h.textContent = d;
        miniCalendar.appendChild(h);
    });

    const firstDayAd = bsToAd(year, month.number, 1);
    const startDay = firstDayAd.date.getDay(); 
    const daysInMonth = getDaysInBSMonth(year, month.number);
    
    // Add Empty Padding Cells
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'year-month-day empty';
        miniCalendar.appendChild(empty);
    }
    
    // Add Day Cells
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'year-month-day';
        dayEl.textContent = d;
        
        const bsDateStr = formatBsDate(year, month.number, d);
        const adDate = bsToAd(year, month.number, d);
        
        // Check Status
        if (year === today.year && month.number === today.month && d === today.day) dayEl.classList.add('today');
        if (adDate.date.getDay() === 6) dayEl.classList.add('saturday');
        
        const isHoliday = yearData.allHolidays.some(h => h.date_bs === bsDateStr);
        if (isHoliday) dayEl.classList.add('holiday');
        
        dayEl.onclick = (e) => {
            e.stopPropagation();
            currentBsYear = year;
            currentBsMonth = month.number;
            currentBsDay = d;
            switchCalendarView('day');
            updateCalendarControls();
            renderDayView();
        };
        miniCalendar.appendChild(dayEl);
    }
    
    card.appendChild(miniCalendar);
    
    // Quick Event Dots Check
    const monthHasEvents = checkMonthEvents(year, month.number, yearData);
    if (monthHasEvents) {
        const dotContainer = document.createElement('div');
        dotContainer.className = 'year-month-events';
        const dot = document.createElement('div');
        dot.className = 'year-month-event-dot active';
        dot.style.cssText = 'width: 6px; height: 6px; border-radius: 50%; background: var(--primary-color); margin: 0 auto;';
        dotContainer.appendChild(dot);
        card.appendChild(dotContainer);
    }

    // Click event for month card (navigate to month view)
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('year-month-day')) {
            currentBsYear = year;
            currentBsMonth = month.number;
            currentBsDay = 1;
            switchCalendarView('month');
            updateCalendarControls();
            renderCalendar();
        }
    });

    return card;
}

async function checkHolidayForYearView(bsDateStr, dayElement) {
    try {
        const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
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
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
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
        const allHolidays = await enhancedHolidayDB.getAll();
        
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
async function displayYearlySummary(yearData) {
    const summaryContent = document.getElementById('yearlySummaryContent');
    if (!summaryContent) return;

    // Filter all data for the current year once from memory
    const yearIncome = yearData.allIncome.filter(i => i.date_bs.startsWith(`${currentBsYear}/`));
    const yearExpense = yearData.allExpenses.filter(e => e.date_bs.startsWith(`${currentBsYear}/`));
    const yearHolidays = yearData.allHolidays.filter(h => h.date_bs.startsWith(`${currentBsYear}/`));

    const totalIncome = yearIncome.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const totalExpense = yearExpense.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const netAmount = totalIncome - totalExpense;

    summaryContent.innerHTML = `
        <div class="yearly-summary-grid">
            <div class="yearly-summary-card income">
                <h5>Yearly Income</h5>
                <div class="amount">Rs. ${totalIncome.toLocaleString()}</div>
            </div>
            <div class="yearly-summary-card expense">
                <h5>Yearly Expenses</h5>
                <div class="amount">Rs. ${totalExpense.toLocaleString()}</div>
            </div>
            <div class="yearly-summary-card ${netAmount >= 0 ? 'income' : 'expense'}">
                <h5>Net Balance</h5>
                <div class="amount">Rs. ${Math.abs(netAmount).toLocaleString()}</div>
            </div>
            <div class="yearly-summary-card holiday">
                <h5>Total Holidays</h5>
                <div class="count">${yearHolidays.length}</div>
            </div>
        </div>
    `;
}


/**
 * Display Weekly Holidays Below Week View
 */
async function displayWeeklyHolidays() {
    try {
        const holidayContent = document.getElementById('weeklyHolidayContent');
        if (!holidayContent) {
            return;
        }

        // Get current week dates
        const today = getCurrentNepaliDate();
        const currentDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay || today.day);
        const dayOfWeek = currentDate.date.getDay();
        
        const weekStart = new Date(currentDate.date);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const bs = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const bsDateStr = formatBsDate(bs.year, bs.month, bs.day);
            weekDates.push(bsDateStr);
        }

        // Get holidays for the week
        const weeklyHolidays = [];
        for (const bsDateStr of weekDates) {
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
            if (holidays && holidays.length > 0) {
                holidays.forEach(holiday => {
                    weeklyHolidays.push({...holiday, date_bs: bsDateStr});
                });
            }
        }

        if (weeklyHolidays.length === 0) {
            holidayContent.innerHTML = '<div class="no-weekly-holidays">No holidays this week</div>';
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

    } catch (error) {
        console.error('❌ Error displaying weekly holidays:', error);
    }
}

/**
 * Display Weekly Summary Below Week View
 */
async function displayWeeklySummary() {
    try {
        const summaryContent = document.getElementById('weeklySummaryContent');
        if (!summaryContent) {
            return;
        }

        // Get current week dates
        const today = getCurrentNepaliDate();
        const currentDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay || today.day);
        const dayOfWeek = currentDate.date.getDay();
        
        const weekStart = new Date(currentDate.date);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const bs = adToBs(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const bsDateStr = formatBsDate(bs.year, bs.month, bs.day);
            weekDates.push(bsDateStr);
        }

        // Initialize weekly totals
        let totalIncome = 0;
        let totalExpense = 0;
        let totalHolidays = 0;
        let totalEvents = 0;
        let totalNotes = 0;
        let totalBills = 0;

        // Calculate weekly totals
        for (const bsDateStr of weekDates) {
            
            // Count holidays
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
            if (holidays && holidays.length > 0) {
                totalHolidays += holidays.length;
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
            
        }

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
        const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);

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
        const grid = document.getElementById('weekGrid');
        if (!grid) {
            return;
        }

        grid.innerHTML = '';

        const today = getCurrentNepaliDate();
        const currentDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay || today.day);
        const dayOfWeek = currentDate.date.getDay();

        const weekStart = new Date(currentDate.date);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);

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
    if (!container) return;

    const today = getCurrentNepaliDate();
    // Ensure we have a valid day selected
    if (!currentBsDay) currentBsDay = today.day;
    
    const bsDateStr = formatBsDate(currentBsYear, currentBsMonth, currentBsDay);
    const adDate = bsToAd(currentBsYear, currentBsMonth, currentBsDay);
    const dateData = await getDateData(bsDateStr);

    let html = `
        <div class="day-detail-header">
            <div class="day-detail-date">${currentBsDay}</div>
            <div class="day-detail-month">${getNepaliMonthName(currentBsMonth)} ${currentBsYear}</div>
            <div class="day-detail-ad">${adDate.month}/${adDate.day}/${adDate.year} AD</div>
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
            const holidays = await enhancedHolidayDB.getByIndex('date_bs', dateStr);
            
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
        const holidays = await enhancedHolidayDB.getByIndex('date_bs', bsDateStr);
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
 * Get data for a specific date
 */
async function getDateData(bsDateStr) {
    try {
        // Get all data stores including holidays
        const [allIncome, allExpenses, allNotes, allBills, allHolidays] = await Promise.all([
            enhancedIncomeDB.getAll(),
            enhancedExpenseDB.getAll(),
            enhancedNoteDB.getAll(),
            enhancedBillDB.getAll(),
            enhancedHolidayDB.getAll()
        ]);
        
        return {
            income: allIncome.filter(item => item.date_bs === bsDateStr),
            expenses: allExpenses.filter(item => item.date_bs === bsDateStr),
            notes: allNotes.filter(item => item.date_bs === bsDateStr),
            bills: allBills.filter(item => item.dueDate === bsDateStr),
            holidays: allHolidays.filter(item => item.date_bs === bsDateStr)
        };

    } catch (error) {
        console.error('Error getting date data:', error);
        return {
            income: [],
            expenses: [],
            notes: [],
            bills: []
        };
    }
}

/**
 * Get data for a specific month
 */
async function getMonthData(year, month) {
    try {
        // Get all data
        const allIncome = await enhancedIncomeDB.getAll();
        const allExpenses = await enhancedExpenseDB.getAll();
        const allNotes = await enhancedNoteDB.getAll();
        const allBills = await enhancedBillDB.getAll();
        
        // Filter by month
        const income = allIncome.filter(item => {
            const [itemYear, itemMonth] = item.date_bs.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        const expenses = allExpenses.filter(item => {
            const [itemYear, itemMonth] = item.date_bs.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        const notes = allNotes.filter(item => {
            const [itemYear, itemMonth] = item.date_bs.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        const bills = allBills.filter(item => {
            const [itemYear, itemMonth] = item.dueDate.split('/').map(Number);
            return itemYear === year && itemMonth === month;
        });
        
        return {
            income,
            expenses,
            notes,
            bills
        };
    } catch (error) {
        console.error('Error getting month data:', error);
        return {
            income: [],
            expenses: [],
            notes: [],
            bills: []
        };
    }
}

/**
 * Get budget for a specific month
 */
async function getMonthBudget(year, month) {
    try {
        const allBudgets = await enhancedBudgetDB.getAll();
        return allBudgets.filter(budget => {
            const [budgetYear, budgetMonth] = budget.month.split('/').map(Number);
            return budgetYear === year && budgetMonth === month;
        });
    } catch (error) {
        console.error('Error getting month budget:', error);
        return [];
    }
}

/**
 * Get monthly transactions for charts
 */
async function getMonthlyTransactions(year, month) {
    try {
        const monthData = await getMonthData(year, month);
        return {
            income: monthData.income,
            expenses: monthData.expenses
        };
    } catch (error) {
        console.error('Error getting monthly transactions:', error);
        return {
            income: [],
            expenses: []
        };
    }
}

/**
 * ========================================
 * MONTHLY SUMMARY
 * ========================================
 */
async function updateMonthlySummary() {
    try {
        const monthData = await getMonthData(currentBsYear, currentBsMonth);
        const income = monthData.income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const expense = monthData.expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
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

        const insurances = await enhancedInsuranceDB.getAll();
        const insuranceRenewals = insurances.filter(ins => ins.expiryDate === bsDate);

        const services = await enhancedVehicleServiceDB.getAll();
        const vehicleServices = services.filter(svc => svc.date === bsDate || svc.nextDue === bsDate);

        const subscriptions = await enhancedSubscriptionDB.getAll();
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
                								<button class="btn-primary" onclick="showNoteForm()">+ Note</button>	
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
                    await enhancedIncomeDB.update(data);
                } else {
                    await enhancedExpenseDB.update(data);
                }
                showNotification(`✅ ${type === 'income' ? 'Income' : 'Expense'} updated successfully!`, 'success');
            } else {
                // Add new transaction
                if (type === 'income') {
                    await enhancedIncomeDB.add(data);
                } else {
                    await enhancedExpenseDB.add(data);
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
                await enhancedRecurringDB.update(data);
            } else {
                await enhancedRecurringDB.add(data);
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
    const recurring = await enhancedRecurringDB.getAll();

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
        await enhancedRecurringDB.delete(id);
        renderRecurringList();
    } catch (error) {
        console.error('Error deleting recurring:', error);
    }
}

async function processRecurringTransactions() {
    const recurring = await enhancedRecurringDB.getAll();
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
                await enhancedIncomeDB.add(transData);
            } else {
                await enhancedExpenseDB.add(transData);
            }

            item.lastProcessed = todayStr;
            await enhancedRecurringDB.update(item);
        }
    }
}

/**
 * Helper function to determine if recurring transaction should be processed
 */
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
        showNotification(`📱 Found ${pendingTransactions.length} pending transactions in localStorage`, 'info');
        
        // Then, collect all transactions from SMS parser IndexedDB
        let smsParserTransactions = [];
        
        try {
            // Try to access SMS parser's IndexedDB
            const smsParserDB = await openSMSParserDB();
            if (smsParserDB) {
                const allSmsTransactions = await smsParserDB.getAll('transactions');
                smsParserTransactions = allSmsTransactions || [];
                showNotification(`📱 Found ${smsParserTransactions.length} transactions in SMS parser database`, 'info');
            } else {
                showNotification('📱 SMS parser database not accessible', 'warning');
            }
        } catch (error) {
            showNotification('⚠️ Could not access SMS parser database', 'warning');
        }
        
        // Combine all transactions
        const allTransactions = [...pendingTransactions, ...smsParserTransactions];
        
        if (allTransactions.length === 0) {
            showNotification('📱 No SMS transactions found to import', 'warning');
            return;
        }
        
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
                } else {
                    await expenseDB.add(trackerData);
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
    const description = (trackerData.description || '').toLowerCase();
    
    // Check explicit debit/credit markers first
    if (description.includes('debit')) return false;
    if (description.includes('credit')) return true;
    
    // Strict income-only categories
    const incomeCategories = ['Salary', 'Freelance', 'Investment'];
    const expenseCategories = [
        'Food', 'Transport', 'Shopping', 'Bills',
        'Healthcare', 'Education', 'Entertainment',
        'Cash Withdrawal', 'Transfer', 'Other Expense'
    ];
    
    if (incomeCategories.includes(category)) return true;
    if (expenseCategories.includes(category)) return false;
    
    // Default ambiguous categories to expense (safer)
    return false;
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
    const holidays = await enhancedHolidayDB.getAll();

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
        await enhancedHolidayDB.delete(id);
        renderHolidayList();
        renderCalendar();
    } catch (error) {
        console.error('Error deleting holiday:', error);
    }
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


// Clear All Data Function
async function clearAllData() {
    const confirmed = confirm('⚠️ WARNING: This will permanently delete ALL data including:\n\n• Holidays\n• Income & Expenses\n• Notes\n• Shopping Lists\n• Budgets\n• Bills\n• Goals\n• Insurance Policies\n• Vehicles\n• Subscriptions\n• Custom Data\n• Settings\n\nThis action cannot be undone. Are you absolutely sure?');
    
    if (!confirmed) return;
    
    try {
        showNotification('🗑️ Clearing all data...', 'info');
        
        // Clear all databases
        await enhancedHolidayDB.clear();
        await enhancedIncomeDB.clear();
        await enhancedExpenseDB.clear();
        await enhancedNoteDB.clear();
        await enhancedShoppingDB.clear();
        await enhancedBudgetDB.clear();
        await enhancedBillDB.clear();
        await enhancedGoalDB.clear();
        await enhancedRecurringDB.clear();
        await enhancedInsuranceDB.clear();
        await enhancedVehicleDB.clear();
        await enhancedVehicleServiceDB.clear();
        await enhancedSubscriptionDB.clear();
        await enhancedCustomTypeDB.clear();
        await enhancedCustomItemDB.clear();
        
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
    const insurances = await enhancedInsuranceDB.getAll();
    const expiringInsurance = insurances.filter(ins => 
        ins.status === 'active' && 
        ins.expiryDate >= todayStr && 
        ins.expiryDate <= in7Days
    );

    expiringInsurance.forEach(ins => {
        alerts.push(`🛡️ Insurance "${ins.name}" expiring on ${ins.expiryDate}`);
    });

    // Check bills due soon
    const bills = await enhancedBillDB.getAll();
    const dueBills = bills.filter(bill =>
        bill.status !== 'paid' &&
        bill.dueDate >= todayStr &&
        bill.dueDate <= in7Days
    );

    dueBills.forEach(bill => {
        alerts.push(`💳 Bill "${bill.name}" due on ${bill.dueDate}`);
    });

    // Check subscriptions renewing soon
    const subscriptions = await enhancedSubscriptionDB.getAll();
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
        const existingGoals = await enhancedGoalDB.getAll();
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
                await enhancedGoalDB.add(goalData);
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
    
    try {
        // Handle both direct and nested data structures
        let insuranceData = null;
        
        if (data.insurance && Array.isArray(data.insurance)) {
            // Direct structure: { "insurance": [...] }
            insuranceData = data.insurance;
        } else if (data.data && data.data.insurance && Array.isArray(data.data.insurance)) {
            // Nested structure: { "data": { "insurance": [...] } }
            insuranceData = data.data.insurance;
        } else {
            showNotification('⚠️ No insurance data found in import file', 'warning');
            return;
        }
        
        const existingInsurance = await enhancedInsuranceDB.getAll();
        
        const existingKeys = new Set();
        existingInsurance.forEach(insurance => {
            // Handle both provider and company fields, with fallback to empty string
            const company = insurance.provider || insurance.company || '';
            const policyNumber = insurance.policyNumber || '';
            const key = `${company.toString().toLowerCase().trim()}-${policyNumber.toString().toLowerCase().trim()}`;
            existingKeys.add(key);
        });
        
        let addedCount = 0, duplicateCount = 0, errorCount = 0;
        
        for (const [index, insurance] of insuranceData.entries()) {
            
            try {
                const { id, ...insuranceItemData } = insurance;
                // Use provider field first, fallback to company
                const company = insuranceItemData.provider || insuranceItemData.company || '';
                const policyNumber = insuranceItemData.policyNumber || '';
                const key = `${company.toString().toLowerCase().trim()}-${policyNumber.toString().toLowerCase().trim()}`;
                
                if (!existingKeys.has(key)) {
                    
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
                    
                    await enhancedInsuranceDB.add(processedData);
                    existingKeys.add(key);
                    addedCount++;
                    
                } else {
                    duplicateCount++;
                }
            } catch (itemError) {
                errorCount++;
            }
        }
        
        showNotification(`✅ Insurance import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}, Errors: ${errorCount}`, 'success');
        
        await renderInsuranceList();
        await renderInsuranceStats();
        
    } catch (error) {
        showNotification('❌ Insurance import failed: ' + error.message, 'error');
    }
}

// Process Vehicle Import
async function processVehicleImport(data) {
    
    try {
        if (data.vehicles && Array.isArray(data.vehicles)) {
            
            const existingVehicles = await enhancedVehicleDB.getAll();
            
            const existingKeys = new Set();
            existingVehicles.forEach(vehicle => {
                const key = `${vehicle.make.toLowerCase().trim()}-${vehicle.model.toLowerCase().trim()}-${vehicle.licensePlate.toLowerCase().trim()}`;
                existingKeys.add(key);
            });
            
            let addedCount = 0, duplicateCount = 0, errorCount = 0;
            
            for (const [index, vehicle] of data.vehicles.entries()) {
                
                try {
                    const { id, ...vehicleData } = vehicle;
                    const key = `${vehicleData.make?.toLowerCase().trim() || ''}-${vehicleData.model?.toLowerCase().trim() || ''}-${vehicleData.licensePlate?.toLowerCase().trim() || ''}`;
                    
                    if (!existingKeys.has(key)) {
                        
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
                        
                        await enhancedVehicleDB.add(processedData);
                        existingKeys.add(key);
                        addedCount++;
                        
                    } else {
                        duplicateCount++;
                    }
                } catch (itemError) {
                    errorCount++;
                }
            }
            
            showNotification(`✅ Vehicle import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}, Errors: ${errorCount}`, 'success');
        } else {
            showNotification('⚠️ No vehicle data found in import file', 'warning');
        }
        
        await renderVehicleGrid();
        
    } catch (error) {
        showNotification('❌ Vehicle import failed: ' + error.message, 'error');
    }
}

// Process Subscription Import
async function processSubscriptionImport(data) {
    if (data.subscriptions && Array.isArray(data.subscriptions)) {
        const existingSubscriptions = await enhancedSubscriptionDB.getAll();
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
                await enhancedSubscriptionDB.add(subscriptionData);
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
        const existingTypes = await enhancedCustomTypeDB.getAll();
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
                await enhancedCustomTypeDB.add(typeData);
                existingKeys.add(key);
                addedCount++;
            } else {
                duplicateCount++;
            }
        }
        showNotification(`✅ Custom types import complete! Added: ${addedCount}, Duplicates skipped: ${duplicateCount}`, 'success');
    }
    
    if (data.customItems && Array.isArray(data.customItems)) {
        const existingItems = await enhancedCustomItemDB.getAll();
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
                await enhancedCustomItemDB.add(itemData);
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
        const existingShopping = await enhancedShoppingDB.getAll();
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
                await enhancedShoppingDB.add(itemData);
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
    
    if (processBtn) {
        if (pendingTransactions.length > 0) {
            processBtn.textContent = `🔄 Process SMS (${pendingTransactions.length})`;
            processBtn.classList.add('btn-warning');
            processBtn.classList.remove('btn-secondary');
        } else {
            processBtn.textContent = '🔄 Process SMS';
            processBtn.classList.remove('btn-warning');
            processBtn.classList.add('btn-secondary');
        }
    } else {
    }
}

// ADD these stubs to prevent ReferenceError crashes:

function updateCalendarHeader() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    if (yearSelect) yearSelect.value = currentBsYear;
    if (monthSelect) monthSelect.value = currentBsMonth;
}

function updateCalendarControls() {
    updateCalendarHeader();
}

let exchangeRates = {
    NPR: 1,
    USD: 0.0075,
    EUR: 0.0069,
    INR: 0.63
};


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

// UI Functions for SMS Parser Module

// Holds the last successfully parsed SMS result
let currentParsedSMS = null;

/**
 * parseSMS(smsText)
 * Parses a Nepali bank / digital-wallet SMS and returns a structured object.
 * Supports: Nabil, Global IME, Sanima, NIC Asia, Himalayan, Laxmi, Citizens,
 *           Machhapuchhre, Kumari, Everest, Siddhartha, Prime, Sunrise, Prabhu,
 *           Muktinath, eSewa, Khalti, IME Pay, ConnectIPS, FonePay + generic patterns.
 *
 * @param  {string} smsText  Raw SMS string
 * @returns {{ amount, type, bank, date, remarks, confidence, rawSMS } | null}
 */
function parseSMS(smsText) {
    if (!smsText || typeof smsText !== 'string') return null;

    const raw  = smsText.trim();
    const text = raw.toLowerCase();

    // ── 1. Transaction type ──────────────────────────────────────────────────
    let type = null;

    const creditKw = [
        'credited','credit','received','deposited','deposit',
        'added','refund','cashback','cr.','inward',
        'payment received','fund received','amount received',
        'to your account','to your a/c','to a/c'
    ];
    const debitKw = [
        'debited','debit','withdrawn','withdrawal','sent',
        'paid','purchase','transferred','transfer','spent',
        'dr.','outward','payment done','payment sent',
        'cash out','atm','from your account','from your a/c','from a/c'
    ];

    for (const kw of creditKw) { if (text.includes(kw)) { type = 'credit'; break; } }
    if (!type) {
        for (const kw of debitKw) { if (text.includes(kw)) { type = 'debit'; break; } }
    }

    // ── 2. Amount ────────────────────────────────────────────────────────────
    let amount = null;
    const amtPatterns = [
        /(?:rs\.?|npr|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
        /([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:rs\.?|npr|inr)/i,
        /(?:amount|amt)[:\s]+(?:rs\.?|npr)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
        /(?:debited|credited|of|for)\s+(?:rs\.?|npr)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    ];
    for (const pat of amtPatterns) {
        const m = raw.match(pat);
        if (m) {
            const val = parseFloat(m[1].replace(/,/g, ''));
            if (!isNaN(val) && val > 0) { amount = val; break; }
        }
    }

    // ── 3. Bank / wallet ─────────────────────────────────────────────────────
    const bankMap = [
        [/\bnabil\b/i,               'Nabil Bank'],
        [/\bglobal\s*ime\b/i,        'Global IME Bank'],
        [/\bsanima\b/i,              'Sanima Bank'],
        [/\bnic\s*asia\b/i,          'NIC Asia Bank'],
        [/\bhimalayan\b/i,           'Himalayan Bank'],
        [/\blaxmi\b/i,               'Laxmi Bank'],
        [/\bcitizens\b/i,            'Citizens Bank'],
        [/\bmachhapuchhre\b|\bmbbl\b/i, 'Machhapuchhre Bank'],
        [/\bkumari\b/i,              'Kumari Bank'],
        [/\beverest\b/i,             'Everest Bank'],
        [/\bsiddhartha\b/i,          'Siddhartha Bank'],
        [/\bprime\s*bank\b/i,        'Prime Bank'],
        [/\bsunrise\b/i,             'Sunrise Bank'],
        [/\bprabhu\b/i,              'Prabhu Bank'],
        [/\bmuktinath\b/i,           'Muktinath Bikas Bank'],
        [/\besewa\b/i,               'eSewa'],
        [/\bkhalti\b/i,              'Khalti'],
        [/\bime\s*pay\b/i,           'IME Pay'],
        [/\bconnectips\b/i,          'ConnectIPS'],
        [/\bfonepay\b/i,             'FonePay'],
    ];
    let bank = 'Unknown Bank';
    for (const [pat, name] of bankMap) {
        if (pat.test(raw)) { bank = name; break; }
    }

    // ── 4. Date ──────────────────────────────────────────────────────────────
    let date = new Date();
    const datePats = [
        /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/,
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
    ];
    for (const pat of datePats) {
        const m = raw.match(pat);
        if (m) {
            let d;
            if (m[1].length === 4) {
                d = new Date(+m[1], +m[2] - 1, +m[3]);
            } else {
                const yr = m[3].length === 2 ? 2000 + +m[3] : +m[3];
                d = new Date(yr, +m[2] - 1, +m[1]);
            }
            if (!isNaN(d.getTime())) { date = d; break; }
        }
    }

    // ── 5. Remarks ───────────────────────────────────────────────────────────
    let remarks = '';
    const remPats = [
        /(?:remarks?|narration|description|ref(?:erence)?)[:\s]+([^\n\.]{3,60})/i,
        /(?:for|to|from)[:\s]+([A-Za-z0-9 &,\.\/\-]{3,60})/i,
        /(?:at|via)[:\s]+([A-Za-z0-9 &,\.\/\-]{3,40})/i,
    ];
    for (const pat of remPats) {
        const m = raw.match(pat);
        if (m) { remarks = m[1].trim(); break; }
    }

    // ── 6. Confidence ────────────────────────────────────────────────────────
    let confidence = 0;
    if (amount)                confidence += 40;
    if (type)                  confidence += 30;
    if (bank !== 'Unknown Bank') confidence += 20;
    if (remarks)               confidence += 10;

    // Need at least an amount to be useful
    if (!amount) return null;
    if (!type)   type = 'debit'; // safe default

    return { amount, type, bank, date, remarks, confidence, rawSMS: raw };
}

function parseAndPreviewSMS() {
    const smsInput = document.getElementById('smsInput');
    const smsText = smsInput.value.trim();
    
    if (!smsText) {
        showNotification('Please paste an SMS message first', 'warning');
        return;
    }
    
    const parsed = parseSMS(smsText);
    
    if (!parsed || !parsed.amount || !parsed.type) {
        showNotification('Could not parse transaction details. Please check the SMS format.', 'error');
        return;
    }
    
    currentParsedSMS = parsed;
    displaySMSPreview(parsed);
}

function displaySMSPreview(parsed) {
    const previewDiv = document.getElementById('smsParsePreview');
    const detailsDiv = document.getElementById('parsedDetails');
    const addBtn = document.getElementById('addParsedTransactionBtn');
    
    const typeColor = parsed.type === 'credit' ? '#10b981' : '#ef4444';
    const typeIcon = parsed.type === 'credit' ? '⬇️' : '⬆️';
    const typeText = parsed.type === 'credit' ? 'Income' : 'Expense';
    
    detailsDiv.innerHTML = `
        <div class="parsed-item">
            <strong>Amount:</strong> Rs. ${parsed.amount.toLocaleString()}
        </div>
        <div class="parsed-item">
            <strong>Type:</strong> <span style="color: ${typeColor};">${typeIcon} ${typeText}</span>
        </div>
        <div class="parsed-item">
            <strong>Bank:</strong> ${parsed.bank}
        </div>
        <div class="parsed-item">
            <strong>Date:</strong> ${parsed.date.toLocaleDateString()}
        </div>
        <div class="parsed-item">
            <strong>Description:</strong> ${parsed.remarks || 'Bank Transaction'}
        </div>
        <div class="parsed-item">
            <strong>Confidence:</strong> ${parsed.confidence}%
        </div>
    `;
    
    previewDiv.style.display = 'block';
    addBtn.style.display = 'inline-flex';
}

function addParsedTransaction() {
    if (!currentParsedSMS) {
        showNotification('No parsed SMS data available', 'error');
        return;
    }
    
    const transactionType = currentParsedSMS.type === 'credit' ? 'income' : 'expense';
    
    // Convert to BS date
    const today = getCurrentNepaliDate();
    const bsDate = formatBsDate(today.year, today.month, today.day);
    
    // Create transaction data
    const transactionData = {
        date_bs: bsDate,
        category: mapBankTransactionToCategory(currentParsedSMS),
        currency: 'NPR',
        amount: currentParsedSMS.amount,
        description: `${currentParsedSMS.bank}: ${currentParsedSMS.remarks || 'Bank Transaction'}`,
        type: transactionType,
        source: 'sms_parser',
        bank: currentParsedSMS.bank,
        rawSMS: currentParsedSMS.rawSMS,
        confidence: currentParsedSMS.confidence
    };
    
    // Add to appropriate database
    addSMSTransactionToTracker(transactionData, transactionType);
    
    // Clear and reset
    clearSMSInput();
    showNotification(`✅ ${transactionType === 'income' ? 'Income' : 'Expense'} of Rs. ${currentParsedSMS.amount.toLocaleString()} added successfully!`, 'success');
}

function mapBankTransactionToCategory(parsedSMS) {
    const remarks = String(parsedSMS.remarks || '').toLowerCase();
    const bank = String(parsedSMS.bank || '').toLowerCase();
    
    // Income categories
    if (parsedSMS.type === 'credit') {
        if (remarks.includes('salary') || remarks.includes('pay')) return 'Salary';
        if (remarks.includes('refund') || remarks.includes('cashback')) return 'Refund';
        if (remarks.includes('transfer') || remarks.includes('received')) return 'Transfer';
        if (bank.includes('esewa') || bank.includes('khalti')) return 'Digital Payment';
        return 'Other Income';
    }
    
    // Expense categories
    if (parsedSMS.type === 'debit') {
        if (remarks.includes('atm') || remarks.includes('withdraw')) return 'Cash Withdrawal';
        if (remarks.includes('purchase') || remarks.includes('shop')) return 'Shopping';
        if (remarks.includes('food') || remarks.includes('restaurant')) return 'Food & Dining';
        if (remarks.includes('fuel') || remarks.includes('petrol')) return 'Transportation';
        if (remarks.includes('bill') || remarks.includes('utility')) return 'Bills & Utilities';
        if (remarks.includes('transfer') || remarks.includes('sent')) return 'Transfer';
        if (bank.includes('esewa') || bank.includes('khalti')) return 'Digital Payment';
        return 'Other Expense';
    }
    
    return 'Uncategorized';
}

async function addSMSTransactionToTracker(transactionData, type) {
    try {
        if (type === 'income') {
            await incomeDB.add(transactionData);
        } else {
            await expenseDB.add(transactionData);
        }
        
        // Refresh tracker list
        await renderTrackerList();
        
        // Update recent SMS transactions list
        updateRecentSMSTransactions();
        
    } catch (error) {
        console.error('Error adding SMS transaction:', error);
        showNotification('Error adding transaction to tracker', 'error');
    }
}

function clearSMSInput() {
    document.getElementById('smsInput').value = '';
    document.getElementById('smsParsePreview').style.display = 'none';
    document.getElementById('addParsedTransactionBtn').style.display = 'none';
    currentParsedSMS = null;
}

async function readClipboardSMS() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('smsInput').value = text;
        showNotification('SMS text pasted from clipboard', 'success');
    } catch (error) {
        showNotification('Could not read from clipboard. Please paste manually.', 'error');
    }
}

function updateRecentSMSTransactions() {
    const recentSmsList = document.getElementById('recentSmsList');
    if (!recentSmsList) return;

    recentSmsList.innerHTML = '<div class="empty-state"><p>⏳ Loading...</p></div>';

    Promise.all([incomeDB.getAll(), expenseDB.getAll()]).then(function(results) {
        const allIncome   = results[0] || [];
        const allExpenses = results[1] || [];

        const smsTxns = [
            ...allIncome.map(function(t)   { return Object.assign({}, t, { _kind: 'income'  }); }),
            ...allExpenses.map(function(t) { return Object.assign({}, t, { _kind: 'expense' }); })
        ]
        .filter(function(t) { return t.source === 'sms_parser'; })
        .sort(function(a, b) { return (b.id || 0) - (a.id || 0); })
        .slice(0, 20);

        if (smsTxns.length === 0) {
            recentSmsList.innerHTML =
                '<div class="empty-state"><p>📭 No SMS transactions yet. Parse an SMS above to get started.</p></div>';
            return;
        }

        recentSmsList.innerHTML = smsTxns.map(function(t) {
            const isIncome = t._kind === 'income';
            const color    = isIncome ? '#10b981' : '#ef4444';
            const icon     = isIncome ? '⬇️' : '⬆️';
            const amt      = (t.amount || 0).toLocaleString();
            const bankTag  = t.bank
                ? '<span style="background:#e5e7eb;border-radius:4px;padding:1px 6px;font-size:11px;">' + t.bank + '</span>'
                : '';
            return '<div style="display:flex;align-items:center;justify-content:space-between;' +
                       'padding:10px 12px;margin-bottom:8px;border-radius:8px;' +
                       'background:#f9fafb;border-left:4px solid ' + color + ';">' +
                     '<div style="flex:1;">' +
                       '<div style="font-weight:600;color:' + color + ';">' + icon + ' Rs. ' + amt + '</div>' +
                       '<div style="font-size:12px;color:#6b7280;margin-top:2px;">' +
                         (t.description || 'Bank Transaction') + ' ' + bankTag +
                       '</div>' +
                       '<div style="font-size:11px;color:#9ca3af;">' + (t.date_bs || '') + '</div>' +
                     '</div>' +
                     '<button onclick="deleteSMSTransaction(' + t.id + ',\'' + t._kind + '\')" ' +
                       'style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;padding:4px 8px;" ' +
                       'title="Delete">🗑️</button>' +
                   '</div>';
        }).join('');
    }).catch(function(err) {
        console.error('Error loading recent SMS transactions:', err);
        recentSmsList.innerHTML = '<div class="empty-state"><p>⚠️ Error loading transactions.</p></div>';
    });
}

async function deleteSMSTransaction(id, kind) {
    if (!id) return;
    try {
        if (kind === 'income') {
            await incomeDB.delete(id);
        } else {
            await expenseDB.delete(id);
        }
        showNotification('Transaction deleted', 'success');
        updateRecentSMSTransactions();
        await renderTrackerList();
    } catch (err) {
        console.error('Error deleting SMS transaction:', err);
        showNotification('Error deleting transaction', 'error');
    }
}
window.deleteSMSTransaction = deleteSMSTransaction;

// Module tab switching for Finance Tracker
// Scoped to #trackerView to avoid colliding with Medicine Tracker's .module-tab buttons
document.addEventListener('click', function(e) {
    const tab = e.target.closest('.module-tab');
    if (!tab) return;

    const trackerView = tab.closest('#trackerView');
    if (!trackerView) return;          // not our tabs – let other handler deal with it

    const module = tab.dataset.module;
    if (!module) return;

    // Activate tab
    trackerView.querySelectorAll('.module-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');

    // Show module
    trackerView.querySelectorAll('.finance-module').forEach(function(m) { m.classList.remove('active'); });
    var target = document.getElementById(module + 'Module');
    if (target) {
        target.classList.add('active');
    } else {
        console.warn('Finance Tracker: element not found →', module + 'Module');
    }

    // Refresh SMS list whenever that tab is opened
    if (module === 'smsParser') {
        updateRecentSMSTransactions();
    }
});

// Initialize medicine tracker when view is shown
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-tab') && e.target.dataset.view === 'medicine') {
        setTimeout(() => {
            if (typeof renderMedicineList === 'function') renderMedicineList();
            if (typeof updateMedicineStats === 'function') updateMedicineStats();
            if (typeof updateMemberFilter === 'function') updateMemberFilter();
            if (typeof renderFamilyMembersList === 'function') renderFamilyMembersList();
            if (typeof renderScheduleList === 'function') renderScheduleList();
        }, 100);
    }
});

// Additional event listener setup for medicine tracker buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for medicine tracker buttons
    setTimeout(() => {
        const addMedicineBtn = document.getElementById('addMedicineBtn');
        const addFamilyMemberBtn = document.getElementById('addFamilyMemberBtn');
        const medicineExportBtn = document.getElementById('medicineExportBtn');
        const medicineImportBtn = document.getElementById('medicineImportBtn');
        
        if (addMedicineBtn) {
            addMedicineBtn.addEventListener('click', function(e) {
                e.preventDefault();
                try {
                    if (typeof showMedicineForm === 'function') {
                        showMedicineForm();
                    } else {
                        showNotification('Medicine form function not available', 'error');
                    }
                } catch (error) {
                    console.error('❌ Error opening medicine form:', error);
                    showNotification('Error opening medicine form', 'error');
                }
            });
        } else {
        }
        
        if (addFamilyMemberBtn) {
            addFamilyMemberBtn.addEventListener('click', function(e) {
                e.preventDefault();
                try {
                    if (typeof showFamilyMemberForm === 'function') {
                        showFamilyMemberForm();
                    } else {
                        showNotification('Family member form function not available', 'error');
                    }
                } catch (error) {
                    console.error('❌ Error opening family member form:', error);
                    showNotification('Error opening family member form', 'error');
                }
            });
        } else {
        }
        
        // Export dropdown toggle
        if (medicineExportBtn) {
            medicineExportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown('medicineExportMenu');
            });
        }
        
        // Import dropdown toggle
        if (medicineImportBtn) {
            medicineImportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown('medicineImportMenu');
            });
        }
        
    }, 500);
});

window.parseSMS = parseSMS;
window.parseAndPreviewSMS = parseAndPreviewSMS;
window.addParsedTransaction = addParsedTransaction;
window.clearSMSInput = clearSMSInput;
window.readClipboardSMS = readClipboardSMS;

// ============================================
// MEDICINE TRACKER MODULE
// ============================================

// Implemented in medicine-tracker.js

// Module tab switching for medicine tracker
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('module-tab') && e.target.closest('#medicineView')) {
        const module = e.target.dataset.module;
        
        // Update active tab
        document.querySelectorAll('#medicineView .module-tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show corresponding module
        document.querySelectorAll('#medicineView .medicine-module').forEach(mod => mod.classList.remove('active'));
        document.getElementById(module + 'Module').classList.add('active');
        
        // Initialize module
        if (module === 'medicines') {
            if (typeof renderMedicineList === 'function') renderMedicineList();
            if (typeof updateMedicineStats === 'function') updateMedicineStats();
        } else if (module === 'family') {
            if (typeof renderFamilyMembersList === 'function') renderFamilyMembersList();
        } else if (module === 'schedule') {
            if (typeof renderScheduleList === 'function') renderScheduleList();
        } else if (module === 'prescriptions') {
            if (typeof renderPrescriptionsList === 'function') renderPrescriptionsList();
        }
    }
});

// ✅ Add this to the bottom of app.js to make Year View dots work
function checkMonthEvents(year, month, yearData) {
    const monthPrefix = `${year}/${String(month).padStart(2, '0')}`;
    
    // Check all data sources for activity in this month
    const hasIncome = yearData.allIncome.some(i => i.date_bs.startsWith(monthPrefix));
    const hasExpense = yearData.allExpenses.some(e => e.date_bs.startsWith(monthPrefix));
    const hasNote = yearData.allNotes.some(n => n.date_bs.startsWith(monthPrefix));
    const hasBill = yearData.allBills.some(b => b.dueDate.startsWith(monthPrefix));
    
    return hasIncome || hasExpense || hasNote || hasBill;
}


// Make functions globally accessible
if (typeof showMedicineForm === 'function') window.showMedicineForm = showMedicineForm;
if (typeof showFamilyMemberForm === 'function') window.showFamilyMemberForm = showFamilyMemberForm;
if (typeof deleteMedicine === 'function') window.deleteMedicine = deleteMedicine;
if (typeof deleteFamilyMember === 'function') window.deleteFamilyMember = deleteFamilyMember;
if (typeof buyMedicine === 'function') window.buyMedicine = buyMedicine;
if (typeof checkLowStockMedicines === 'function') window.checkLowStockMedicines = checkLowStockMedicines;

// ... (rest of the code remains the same)