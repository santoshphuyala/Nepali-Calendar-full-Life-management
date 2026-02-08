/**
 * Nepali BS Date Picker Component
 * Provides a calendar interface for selecting Nepali Bikram Sambat dates
 */

class NepaliDatePicker {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            format: 'YYYY/MM/DD',
            showWeekDays: true,
            showTodayButton: true,
            ...options
        };
        
        this.currentDate = getCurrentNepaliDate();
        this.selectedDate = null;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.createDatePicker();
        this.bindEvents();
        this.setValue(this.input.value || formatBsDate(this.currentDate.year, this.currentDate.month, this.currentDate.day));
    }
    
    createDatePicker() {
        // Create date picker container
        this.picker = document.createElement('div');
        this.picker.className = 'nepali-date-picker';
        this.picker.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 16px;
            z-index: 10000;
            min-width: 320px;
            font-family: inherit;
            display: none;
        `;
        
        // Create header with month/year navigation
        this.createHeader();
        
        // Create calendar grid
        this.createCalendarGrid();
        
        // Create footer with action buttons
        this.createFooter();
        
        document.body.appendChild(this.picker);
    }
    
    createHeader() {
        const header = document.createElement('div');
        header.className = 'date-picker-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
        `;
        
        // Previous month button
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '‹';
        prevBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            color: #666;
        `;
        prevBtn.onmouseover = () => prevBtn.style.backgroundColor = '#f0f0f0';
        prevBtn.onmouseout = () => prevBtn.style.backgroundColor = 'transparent';
        prevBtn.onclick = () => this.navigateMonth(-1);
        
        // Month/year display
        this.monthYearDisplay = document.createElement('div');
        this.monthYearDisplay.style.cssText = `
            font-weight: 600;
            color: #333;
            font-size: 16px;
        `;
        
        // Next month button
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '›';
        nextBtn.style.cssText = prevBtn.style.cssText;
        nextBtn.onmouseover = () => nextBtn.style.backgroundColor = '#f0f0f0';
        nextBtn.onmouseout = () => nextBtn.style.backgroundColor = 'transparent';
        nextBtn.onclick = () => this.navigateMonth(1);
        
        header.appendChild(prevBtn);
        header.appendChild(this.monthYearDisplay);
        header.appendChild(nextBtn);
        
        this.picker.appendChild(header);
    }
    
    createCalendarGrid() {
        const grid = document.createElement('div');
        grid.className = 'date-picker-grid';
        
        // Week day headers
        if (this.options.showWeekDays) {
            const weekDays = ['सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि', 'आइत'];
            const weekDayRow = document.createElement('div');
            weekDayRow.style.cssText = `
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
                margin-bottom: 8px;
            `;
            
            weekDays.forEach(day => {
                const dayCell = document.createElement('div');
                dayCell.textContent = day;
                dayCell.style.cssText = `
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    padding: 4px;
                `;
                weekDayRow.appendChild(dayCell);
            });
            
            grid.appendChild(weekDayRow);
        }
        
        // Days grid
        this.daysGrid = document.createElement('div');
        this.daysGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
        `;
        
        grid.appendChild(this.daysGrid);
        this.picker.appendChild(grid);
        
        this.renderCalendar();
    }
    
    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'date-picker-footer';
        footer.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid #eee;
        `;
        
        // Today button
        if (this.options.showTodayButton) {
            const todayBtn = document.createElement('button');
            todayBtn.textContent = 'आज';
            todayBtn.style.cssText = `
                background: #007bff;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            todayBtn.onmouseover = () => todayBtn.style.backgroundColor = '#0056b3';
            todayBtn.onmouseout = () => todayBtn.style.backgroundColor = '#007bff';
            todayBtn.onclick = () => this.selectToday();
            footer.appendChild(todayBtn);
        }
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeBtn.onmouseover = () => closeBtn.style.backgroundColor = '#545b62';
        closeBtn.onmouseout = () => closeBtn.style.backgroundColor = '#6c757d';
        closeBtn.onclick = () => this.close();
        footer.appendChild(closeBtn);
        
        this.picker.appendChild(footer);
    }
    
    renderCalendar() {
        const { year, month } = this.currentDate;
        const daysInMonth = getDaysInBSMonth(year, month);
        const firstDayOfWeek = getDayOfWeek(year, month, 1);
        
        // Update month/year display
        const monthNames = ['बैशाख', 'जेष्ठ', 'असार', 'श्रावन', 'भाद्र', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत'];
        this.monthYearDisplay.textContent = `${monthNames[month - 1]} ${year}`;
        
        // Clear days grid
        this.daysGrid.innerHTML = '';
        
        // Add empty cells for days before month starts
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(firstDayOfWeek);
        for (let i = 0; i < dayIndex; i++) {
            const emptyCell = document.createElement('div');
            this.daysGrid.appendChild(emptyCell);
        }
        
        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('button');
            dayCell.textContent = day;
            dayCell.style.cssText = `
                background: none;
                border: 1px solid #ddd;
                padding: 8px;
                cursor: pointer;
                border-radius: 4px;
                font-size: 14px;
                color: #333;
            `;
            
            // Check if this is today
            const today = getCurrentNepaliDate();
            if (year === today.year && month === today.month && day === today.day) {
                dayCell.style.backgroundColor = '#e3f2fd';
                dayCell.style.borderColor = '#2196f3';
                dayCell.style.fontWeight = '600';
            }
            
            // Check if this is selected date
            if (this.selectedDate && 
                year === this.selectedDate.year && 
                month === this.selectedDate.month && 
                day === this.selectedDate.day) {
                dayCell.style.backgroundColor = '#007bff';
                dayCell.style.color = 'white';
                dayCell.style.borderColor = '#007bff';
            }
            
            dayCell.onmouseover = () => {
                if (!dayCell.style.backgroundColor.includes('007bff')) {
                    dayCell.style.backgroundColor = '#f0f0f0';
                }
            };
            dayCell.onmouseout = () => {
                if (!dayCell.style.backgroundColor.includes('007bff')) {
                    dayCell.style.backgroundColor = 'white';
                }
            };
            
            dayCell.onclick = () => this.selectDate(year, month, day);
            
            this.daysGrid.appendChild(dayCell);
        }
    }
    
    navigateMonth(direction) {
        this.currentDate.month += direction;
        
        if (this.currentDate.month > 12) {
            this.currentDate.month = 1;
            this.currentDate.year++;
        } else if (this.currentDate.month < 1) {
            this.currentDate.month = 12;
            this.currentDate.year--;
        }
        
        this.renderCalendar();
    }
    
    selectDate(year, month, day) {
        this.selectedDate = { year, month, day };
        const dateStr = formatBsDate(year, month, day);
        this.setValue(dateStr);
        this.close();
    }
    
    selectToday() {
        const today = getCurrentNepaliDate();
        this.selectDate(today.year, today.month, today.day);
    }
    
    setValue(dateStr) {
        this.input.value = dateStr;
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    getValue() {
        return this.input.value;
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.picker.style.display = 'block';
        
        // Position the picker
        const rect = this.input.getBoundingClientRect();
        this.picker.style.left = rect.left + 'px';
        this.picker.style.top = (rect.bottom + window.scrollY + 2) + 'px';
        
        // Adjust position if picker goes off screen
        const pickerRect = this.picker.getBoundingClientRect();
        if (pickerRect.right > window.innerWidth) {
            this.picker.style.left = (rect.right - pickerRect.width) + 'px';
        }
        if (pickerRect.bottom > window.innerHeight) {
            this.picker.style.top = (rect.top - pickerRect.height - 2 + window.scrollY) + 'px';
        }
    }
    
    close() {
        this.isOpen = false;
        this.picker.style.display = 'none';
    }
    
    bindEvents() {
        // Open picker on input click/focus
        this.input.addEventListener('click', () => this.open());
        this.input.addEventListener('focus', () => this.open());
        
        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.picker.contains(e.target) && e.target !== this.input) {
                this.close();
            }
        });
        
        // Handle keyboard navigation
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.open();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.isOpen) {
                this.close();
                this.open();
            }
        });
    }
    
    destroy() {
        if (this.picker && this.picker.parentNode) {
            this.picker.parentNode.removeChild(this.picker);
        }
        this.isOpen = false;
    }
}

// Global function to initialize date pickers
function initNepaliDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="text"][id*="Date"], input[type="text"][placeholder*="YYYY/MM/DD"]');
    
    dateInputs.forEach(input => {
        // Skip if already initialized
        if (input.hasAttribute('data-nepali-picker')) return;
        
        // Mark as initialized
        input.setAttribute('data-nepali-picker', 'true');
        
        // Add Nepali date picker
        new NepaliDatePicker(input);
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNepaliDatePickers);
} else {
    initNepaliDatePickers();
}

// Make available globally
window.NepaliDatePicker = NepaliDatePicker;
window.initNepaliDatePickers = initNepaliDatePickers;
