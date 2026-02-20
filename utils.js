/**
 * ========================================
 * UTILITY FUNCTIONS
 * Common helper functions with error handling
 * ========================================
 */

/**
 * Safely get DOM element with null check
 * @param {string} id - Element ID
 * @returns {Element|null} DOM element or null if not found
 */
function safeGetElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID "${id}" not found`);
    }
    return element;
}

/**
 * Safely set text content with null check
 * @param {string} id - Element ID
 * @param {string} text - Text content to set
 */
function safeSetTextContent(id, text) {
    const element = safeGetElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Safely set inner HTML with null check
 * @param {string} id - Element ID
 * @param {string} html - HTML content to set
 */
function safeSetInnerHTML(id, html) {
    const element = safeGetElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Safely add event listener with null check
 * @param {string} id - Element ID
 * @param {string} event - Event type
 * @param {Function} callback - Event callback
 * @param {Object} options - Event listener options
 */
function safeAddEventListener(id, event, callback, options = {}) {
    const element = safeGetElementById(id);
    if (element) {
        element.addEventListener(event, callback, options);
    }
}

/**
 * Safe date conversion with error handling
 * @param {number} year - Year
 * @param {number} month - Month
 * @param {number} day - Day
 * @param {string} type - 'bsToAd' or 'adToBs'
 * @returns {Object|null} Converted date or null if error
 */
function safeDateConversion(year, month, day, type) {
    try {
        if (type === 'bsToAd') {
            return bsToAd(year, month, day);
        } else if (type === 'adToBs') {
            return adToBs(year, month, day);
        }
    } catch (error) {
        console.error(`Date conversion error (${type}):`, error);
        return null;
    }
}

/**
 * Show notification with fallback
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 */
function safeShowNotification(message, type = 'info') {
    try {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback to alert
            alert(`${type.toUpperCase()}: ${message}`);
        }
    } catch (error) {
        console.error('Error showing notification:', error);
        alert(message); // Last resort
    }
}

/**
 * Validate BS date parameters
 * @param {number} year - BS year
 * @param {number} month - BS month
 * @param {number} day - BS day
 * @returns {boolean} True if valid
 */
function validateBsDate(year, month, day) {
    return typeof year === 'number' && 
           typeof month === 'number' && 
           typeof day === 'number' &&
           year >= 2082 && year <= 2092 &&
           month >= 1 && month <= 12 &&
           day >= 1 && day <= 32;
}

/**
 * Validate AD date parameters
 * @param {number} year - AD year
 * @param {number} month - AD month
 * @param {number} day - AD day
 * @returns {boolean} True if valid
 */
function validateAdDate(year, month, day) {
    return typeof year === 'number' && 
           typeof month === 'number' && 
           typeof day === 'number' &&
           year >= 2020 && year <= 2100 &&
           month >= 1 && month <= 12 &&
           day >= 1 && day <= 31;
}

/**
 * Safely stringify JSON for HTML attributes
 * @param {Object} obj - Object to stringify
 * @returns {string} Safe JSON string for HTML
 */
function safeJsonStringify(obj) {
    try {
        return JSON.stringify(obj)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    } catch (error) {
        console.error('Error stringifying JSON:', error);
        return '{}';
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        safeGetElementById,
        safeSetTextContent,
        safeSetInnerHTML,
        safeAddEventListener,
        safeDateConversion,
        safeShowNotification,
        validateBsDate,
        validateAdDate,
        safeJsonStringify
    };
}
