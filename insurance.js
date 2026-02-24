/**
 * Check insurance renewal status and send notifications
 */
async function checkInsuranceRenewalStatus() {
    console.log('🔍 checkInsuranceRenewalStatus() started');
    try {
        console.log('📊 Fetching insurance policies from database...');
        const allPolicies = await enhancedInsuranceDB.getAll();
        console.log(`📋 Found ${allPolicies.length} total policies:`, allPolicies);
        
        const activePolicies = allPolicies.filter(p => p.status === 'active');
        console.log(`✅ Filtered ${activePolicies.length} active policies:`, activePolicies);
        
        const today = getCurrentNepaliDate();
        const todayStr = formatBsDate(today.year, today.month, today.day);
        console.log(`📅 Today's date (BS): ${todayStr}`);
        
        const in15Days = addDaysToBsDate(todayStr, 15);
        console.log(`⏰ 15 days from today (BS): ${in15Days}`);
        
        const expiringSoon = activePolicies.filter(p => {
            const isExpiring = p.expiryDate >= todayStr && p.expiryDate <= in15Days;
            console.log(`🔍 Policy "${p.name}": expiry=${p.expiryDate}, expiring=${isExpiring}`);
            return isExpiring;
        });
        console.log(`⚠️ Found ${expiringSoon.length} policies expiring soon:`, expiringSoon);
        
        const expired = activePolicies.filter(p => {
            const isExpired = p.expiryDate < todayStr;
            console.log(`🔴 Policy "${p.name}": expiry=${p.expiryDate}, expired=${isExpired}`);
            return isExpired;
        });
        console.log(`❌ Found ${expired.length} expired policies:`, expired);
        
        // Send notifications for expiring policies
        console.log('📣 Sending notifications for expiring policies...');
        for (const policy of expiringSoon) {
            const daysUntil = _daysUntil(policy.expiryDate);
            if (daysUntil !== null && daysUntil >= 0 && daysUntil <= 15) {
                const title = `🛡️ Insurance Renewal Reminder`;
                const body = `${policy.name || 'Insurance Policy'} expires in ${daysUntil} day(s)\nProvider: ${policy.company || '—'}\nPremium: Rs.${policy.premium}`;
                
                console.log(`📣 Sending notification for policy "${policy.name}"`);
                
                // Use notification manager if available
                if (typeof NotificationManager !== 'undefined' && NotificationManager.showNotification) {
                    NotificationManager.showNotification(title, body, 'warning');
                } else {
                    safeShowNotification(`${title}: ${policy.name} expires in ${daysUntil} days`, 'warning');
                }
            }
        }
        
        // Send notifications for expired policies
        console.log('📣 Sending notifications for expired policies...');
        for (const policy of expired) {
            const daysExpired = Math.abs(_daysUntil(policy.expiryDate) || 0);
            const title = `⚠️ Insurance Expired`;
            const body = `${policy.name || 'Insurance Policy'} expired ${daysExpired} day(s) ago\nProvider: ${policy.company || '—'}\nPlease renew immediately`;
            
            console.log(`📣 Sending notification for policy "${policy.name}"`);
            
            if (typeof NotificationManager !== 'undefined' && NotificationManager.showNotification) {
                NotificationManager.showNotification(title, body, 'error');
            } else {
                safeShowNotification(`${title}: ${policy.name} expired ${daysExpired} days ago`, 'error');
            }
        }
        
        // Calculate annual premium
        console.log('💰 Calculating annual premium...');
        const annualPremium = activePolicies.reduce((sum, p) => {
            const premium = parseFloat(p.premium) || 0;
            let annualAmount = premium;
            
            if (p.frequency === 'monthly') {
                annualAmount = premium * 12;
            } else if (p.frequency === 'quarterly') {
                annualAmount = premium * 4;
            } else if (p.frequency === 'half-yearly') {
                annualAmount = premium * 2;
            }
            
            console.log(`💵 Policy "${p.name}": premium=${premium}, frequency=${p.frequency}, annual=${annualAmount}`);
            return sum + annualAmount;
        }, 0);
        console.log(`💰 Total annual premium calculated: Rs. ${annualPremium.toLocaleString()}`);
        
        // Update UI with counts
        console.log('🔄 Updating UI elements...');
        
        const expiringSoonElement = document.getElementById('expiringSoon');
        console.log('🔍 expiringSoon element:', expiringSoonElement);
        if (expiringSoonElement) {
            expiringSoonElement.textContent = expiringSoon.length;
            console.log(`✅ Updated expiringSoon: ${expiringSoon.length}`);
        } else {
            console.error('❌ expiringSoon element not found!');
        }
        
        const totalPremiumElement = document.getElementById('totalPremium');
        console.log('🔍 totalPremium element:', totalPremiumElement);
        if (totalPremiumElement) {
            totalPremiumElement.textContent = `Rs. ${annualPremium.toLocaleString()}`;
            console.log(`✅ Updated totalPremium: Rs. ${annualPremium.toLocaleString()}`);
        } else {
            console.error('❌ totalPremium element not found!');
        }
        
        const totalPoliciesElement = document.getElementById('totalPolicies');
        console.log('🔍 totalPolicies element:', totalPoliciesElement);
        if (totalPoliciesElement) {
            totalPoliciesElement.textContent = allPolicies.length;
            console.log(`✅ Updated totalPolicies: ${allPolicies.length}`);
        } else {
            console.error('❌ totalPolicies element not found!');
        }
        
        const activePoliciesElement = document.getElementById('activePolicies');
        console.log('🔍 activePolicies element:', activePoliciesElement);
        if (activePoliciesElement) {
            activePoliciesElement.textContent = activePolicies.length;
            console.log(`✅ Updated activePolicies: ${activePolicies.length}`);
        } else {
            console.error('❌ activePolicies element not found!');
        }
        
        const expiredPoliciesElement = document.getElementById('expiredPolicies');
        console.log('🔍 expiredPolicies element:', expiredPoliciesElement);
        if (expiredPoliciesElement) {
            expiredPoliciesElement.textContent = expired.length;
            console.log(`✅ Updated expiredPolicies: ${expired.length}`);
        } else {
            console.error('❌ expiredPolicies element not found!');
        }
        
        console.log('🎯 Final summary:', {
            total: allPolicies.length,
            active: activePolicies.length,
            expiringSoon: expiringSoon.length,
            expired: expired.length,
            annualPremium: annualPremium
        });
        
        return {
            total: activePolicies.length,
            expiringSoon: expiringSoon.length,
            expired: expired.length
        };
        
    } catch (error) {
        console.error('Error checking insurance renewal status:', error);
        safeShowNotification('❌ Failed to check insurance renewal status', 'error');
        return null;
    }
}

/**
 * Helper function to calculate days until date
 */
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

/**
 * ========================================
 * INSURANCE MANAGER MODULE
 * Developer: Santosh Phuyal
 * ========================================
 */

/**
 * Render insurance statistics
 */
async function renderInsuranceStats() {
    try {
        const allPolicies = await enhancedInsuranceDB.getAll();
        const activePolicies = allPolicies.filter(p => p.status === 'active');
        const today = getCurrentNepaliDate();
        const todayStr = formatBsDate(today.year, today.month, today.day);
        const in15Days = addDaysToBsDate(todayStr, 15); // Changed from 30 to 15 days
        const expiringSoon = activePolicies.filter(p => {
            return p.expiryDate >= todayStr && p.expiryDate <= in15Days;
        });
        const annualPremium = activePolicies.reduce((sum, p) => {
            const premium = parseFloat(p.premium);
            if (p.frequency === 'monthly') return sum + (premium * 12);
            if (p.frequency === 'quarterly') return sum + (premium * 4);
            if (p.frequency === 'half-yearly') return sum + (premium * 2);
            return sum + premium; // yearly
        }, 0);
        
        const totalPoliciesElement = safeGetElementById('totalPolicies');
        const activePoliciesElement = safeGetElementById('activePolicies');
        const totalPremiumElement = safeGetElementById('totalPremium');
        const expiringSoonElement = safeGetElementById('expiringSoon');
        
        if (totalPoliciesElement) totalPoliciesElement.textContent = allPolicies.length;
        if (activePoliciesElement) activePoliciesElement.textContent = activePolicies.length;
        if (totalPremiumElement) totalPremiumElement.textContent = `Rs. ${annualPremium.toLocaleString()}`;
        if (expiringSoonElement) expiringSoonElement.textContent = expiringSoon.length;
        
    } catch (error) {
        console.error('Error in renderInsuranceStats:', error);
    }
}

/**
 * Show insurance form
 */
function showInsuranceForm(policy = null) {
    const today = getCurrentNepaliDate();
    const defaultExpiry = formatBsDate(today.year + 1, today.month, today.day);

    const html = `
        <h2>${policy ? 'Edit' : 'Add'} Insurance Policy</h2>
        <form id="insuranceForm">
            <div class="form-group">
                <label>Policy Type</label>
                <select id="insuranceType" required>
                    <option value="life" ${policy && policy.type === 'life' ? 'selected' : ''}>Life Insurance</option>
                    <option value="health" ${policy && policy.type === 'health' ? 'selected' : ''}>Health Insurance</option>
                    <option value="vehicle" ${policy && policy.type === 'vehicle' ? 'selected' : ''}>Vehicle Insurance</option>
                    <option value="property" ${policy && policy.type === 'property' ? 'selected' : ''}>Property Insurance</option>
                    <option value="travel" ${policy && policy.type === 'travel' ? 'selected' : ''}>Travel Insurance</option>
                    <option value="other" ${policy && policy.type === 'other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Policy Name</label>
                <input type="text" id="insuranceName" value="${policy ? policy.name : ''}" placeholder="e.g., Family Health Plus" required>
            </div>
            <div class="form-group">
                <label>Policy Number</label>
                <input type="text" id="insurancePolicyNumber" value="${policy ? policy.policyNumber : ''}" placeholder="e.g., POL-2025-12345" required>
            </div>
            <div class="form-group">
                <label>Insurance Provider</label>
                <input type="text" id="insuranceProvider" value="${policy ? policy.provider : ''}" placeholder="e.g., Nepal Life Insurance" required>
            </div>
            <div class="form-group">
                <label>Coverage Amount (NPR)</label>
                <input type="number" id="insuranceCoverage" value="${policy ? policy.coverage : ''}" step="1000" required>
            </div>
            <div class="form-group">
                <label>Premium Amount (NPR)</label>
                <input type="number" id="insurancePremium" value="${policy ? policy.premium : ''}" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Premium Frequency</label>
                <select id="insuranceFrequency" required>
                    <option value="monthly" ${policy && policy.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                    <option value="quarterly" ${policy && policy.frequency === 'quarterly' ? 'selected' : ''}>Quarterly</option>
                    <option value="half-yearly" ${policy && policy.frequency === 'half-yearly' ? 'selected' : ''}>Half-Yearly</option>
                    <option value="yearly" ${policy && policy.frequency === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
            </div>
            <div class="form-group">
                <label>Start Date (BS)</label>
                <input type="text" id="insuranceStartDate" value="${policy ? policy.startDate : formatBsDate(today.year, today.month, today.day)}" required>
            </div>
            <div class="form-group">
                <label>Expiry Date (BS)</label>
                <input type="text" id="insuranceExpiryDate" value="${policy ? policy.expiryDate : defaultExpiry}" required>
            </div>
            <div class="form-group">
                <label>Beneficiary</label>
                <input type="text" id="insuranceBeneficiary" value="${policy ? policy.beneficiary : ''}" placeholder="e.g., Spouse, Parents">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="insuranceStatus">
                    <option value="active" ${!policy || policy.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="expired" ${policy && policy.status === 'expired' ? 'selected' : ''}>Expired</option>
                    <option value="cancelled" ${policy && policy.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="insuranceNotes">${policy ? policy.notes || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save Policy</button>
            </div>
        </form>
    `;

    showModal(html);

    document.getElementById('insuranceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('🐛 DEBUG: Insurance form submitted');

        const data = {
            type: document.getElementById('insuranceType').value,
            name: document.getElementById('insuranceName').value,
            policyNumber: document.getElementById('insurancePolicyNumber').value,
            provider: document.getElementById('insuranceProvider').value,
            coverage: parseFloat(document.getElementById('insuranceCoverage').value),
            premium: parseFloat(document.getElementById('insurancePremium').value),
            frequency: document.getElementById('insuranceFrequency').value,
            startDate: document.getElementById('insuranceStartDate').value,
            expiryDate: document.getElementById('insuranceExpiryDate').value,
            beneficiary: document.getElementById('insuranceBeneficiary').value,
            status: document.getElementById('insuranceStatus').value,
            notes: document.getElementById('insuranceNotes').value,
            createdAt: policy ? policy.createdAt : new Date().toISOString()
        };
        
        console.log('🐛 DEBUG: Insurance data to save:', data);

        try {
            console.log('🐛 DEBUG: Starting database save operation');
            
            if (policy) {
                console.log('🐛 DEBUG: Updating existing policy:', policy.id);
                data.id = policy.id;
                const result = await enhancedInsuranceDB.update(data);
                console.log('🐛 DEBUG: Policy updated successfully:', result);

                // Record payment history + fire renewal notification
                if (typeof NotificationManager !== 'undefined') {
                    await NotificationManager.notifyRenewal({
                        type: 'INSURANCE',
                        item: data,
                        newDueDateBs: data.expiryDate,
                        amount: data.premium,
                        currency: 'NPR',
                    });
                }
            } else {
                console.log('🐛 DEBUG: Adding new policy');
                const result = await enhancedInsuranceDB.add(data);
                console.log('🐛 DEBUG: Policy added successfully:', result);
            }
            
            // Verify the save by immediately retrieving
            console.log('🐛 DEBUG: Verifying save by retrieving all policies');
            const allPolicies = await enhancedInsuranceDB.getAll();
            console.log('🐛 DEBUG: Retrieved policies after save:', { count: allPolicies.length });
            
            // Check if our policy is in the list
            const savedPolicy = allPolicies.find(p => p.policyNumber === data.policyNumber);
            console.log('🐛 DEBUG: Found saved policy:', !!savedPolicy);

            closeModal();
            if (currentView === 'insurance') {
                console.log('🐛 DEBUG: Refreshing insurance views');
                await renderInsuranceList();
                await renderInsuranceStats();
            }
            safeShowNotification('Insurance policy saved successfully!', 'success');
        } catch (error) {
            console.error('🐛 DEBUG: Error saving insurance:', error);
            console.error('🐛 DEBUG: Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            safeShowNotification('Error saving policy. Please try again.', 'error');
        }
    });
}

/**
 * Render insurance list
 */
async function renderInsuranceList() {
    try {
        const container = document.getElementById('insuranceList');
        
        if (!container) {
            return;
        }
        
        const activeFilter = document.querySelector('#insuranceModule .filter-btn.active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';

        let policies = await enhancedInsuranceDB.getAll();

        // Apply filter
        if (filter !== 'all') {
            policies = policies.filter(p => p.type === filter);
        }

        if (policies.length === 0) {
            container.innerHTML = '<div class="loading">No insurance policies found</div>';
            return;
        }

        const today = getCurrentNepaliDate();
        const todayStr = formatBsDate(today.year, today.month, today.day);

        const html = policies.map(policy => {
            const isExpiringSoon = policy.expiryDate >= todayStr && policy.expiryDate <= addDaysToBsDate(todayStr, 15);
            const isExpired = policy.expiryDate < todayStr;
            
            // Calculate remaining days
            const daysUntil = _daysUntil(policy.expiryDate);
            let remainingDaysText = '';
            
            if (isExpired) {
                remainingDaysText = `Expired ${Math.abs(daysUntil)} days ago`;
            } else if (daysUntil !== null) {
                if (daysUntil === 0) {
                    remainingDaysText = 'Expires today';
                } else if (daysUntil === 1) {
                    remainingDaysText = 'Expires tomorrow';
                } else if (daysUntil <= 15) {
                    remainingDaysText = `${daysUntil} days left`;
                } else {
                    remainingDaysText = `${daysUntil} days left`;
                }
            } else {
                remainingDaysText = 'Unknown';
            }

            let statusClass = 'insurance-active';
            let statusBadge = '✓ Active';
            
            if (isExpired || policy.status === 'expired') {
                statusClass = 'insurance-expired';
                statusBadge = '✗ Expired';
            } else if (policy.status === 'cancelled') {
                statusClass = 'insurance-cancelled';
                statusBadge = '⊗ Cancelled';
            } else if (isExpiringSoon) {
                statusClass = 'insurance-expiring';
                statusBadge = '⚠ Expiring Soon';
            }

            const typeIcons = {
                life: '👤',
                health: '🏥',
                vehicle: '🚗',
                property: '🏠',
                travel: '✈️',
                other: '📋'
            };

            return `
                <div class="insurance-card ${statusClass}">
                    <div class="insurance-header">
                        <div class="insurance-icon">${typeIcons[policy.type]}</div>
                        <div class="insurance-title-section">
                            <h3 class="insurance-title">${policy.name}</h3>
                            <p class="insurance-provider">${policy.provider}</p>
                        </div>
                        <span class="insurance-status-badge ${statusClass}">${statusBadge}</span>
                    </div>
                    
                    <div class="insurance-details">
                        <div class="detail-row">
                            <span class="detail-label">Policy Number:</span>
                            <span class="detail-value">${policy.policyNumber}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Coverage:</span>
                            <span class="detail-value">Rs. ${parseFloat(policy.coverage).toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Premium:</span>
                            <span class="detail-value">Rs. ${parseFloat(policy.premium).toLocaleString()} / ${policy.frequency}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Valid Period:</span>
                            <span class="detail-value">${policy.startDate} to ${policy.expiryDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Time Remaining:</span>
                            <span class="detail-value ${isExpired ? 'expired-text' : isExpiringSoon ? 'expiring-text' : 'active-text'}">${remainingDaysText}</span>
                        </div>
                        ${policy.beneficiary ? `
                        <div class="detail-row">
                            <span class="detail-label">Beneficiary:</span>
                            <span class="detail-value">${policy.beneficiary}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="insurance-actions">
                        <button class="btn-info" onclick='viewInsuranceDetails(${JSON.stringify(policy).replace(/'/g, "&apos;")})'>
                            ℹ️ View Details
                        </button>
                        <button class="btn-primary" onclick='closeModal(); showInsuranceForm(${JSON.stringify(policy).replace(/'/g, "&apos;")})'>
                            ✏️ Edit
                        </button>
                        <button class="btn-danger" onclick="deleteInsurance(${policy.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error in renderInsuranceList', error);
        
        const container = document.getElementById('insuranceList');
        if (container) {
            container.innerHTML = '<div class="error">Error loading insurance policies</div>';
        }
    }
}

/**
 * View insurance details
 */
async function viewInsuranceDetails(id) {
    const policy = await enhancedInsuranceDB.get(id);
    
    if (!policy) {
        safeShowNotification('Insurance policy not found', 'error');
        return;
    }
    
    const typeIcons = {
        life: '👤',
        health: '🏥',
        vehicle: '🚗',
        property: '🏠',
        travel: '✈️',
        other: '📋'
    };

    const html = `
        <div class="insurance-detail-view">
            <div class="detail-header">
                <span class="detail-icon">${typeIcons[policy.type]}</span>
                <h2>${policy.name}</h2>
            </div>
            
            <div class="detail-section">
                <h3>Policy Information</h3>
                <table class="detail-table">
                    <tr><td>Policy Number:</td><td><strong>${policy.policyNumber}</strong></td></tr>
                    <tr><td>Provider:</td><td>${policy.provider}</td></tr>
                    <tr><td>Type:</td><td>${policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}</td></tr>
                    <tr><td>Status:</td><td>${policy.status}</td></tr>
                </table>
            </div>

            <div class="detail-section">
                <h3>Coverage & Premium</h3>
                <table class="detail-table">
                    <tr><td>Coverage Amount:</td><td><strong>Rs. ${parseFloat(policy.coverage).toLocaleString()}</strong></td></tr>
                    <tr><td>Premium:</td><td>Rs. ${parseFloat(policy.premium).toLocaleString()}</td></tr>
                    <tr><td>Frequency:</td><td>${policy.frequency}</td></tr>
                </table>
            </div>

            <div class="detail-section">
                <h3>Validity</h3>
                <table class="detail-table">
                    <tr><td>Start Date:</td><td>${policy.startDate}</td></tr>
                    <tr><td>Expiry Date:</td><td>${policy.expiryDate}</td></tr>
                    <tr><td>Beneficiary:</td><td>${policy.beneficiary || 'Not specified'}</td></tr>
                </table>
            </div>

            ${policy.notes ? `
            <div class="detail-section">
                <h3>Notes</h3>
                <p>${policy.notes}</p>
            </div>
            ` : ''}

            <div class="form-actions">
                <button class="btn-secondary" onclick="closeModal()">Close</button>
                <button class="btn-primary" onclick='closeModal(); showInsuranceForm(${JSON.stringify(policy).replace(/'/g, "&apos;")})'>Edit Policy</button>
            </div>
        </div>
    `;

    showModal(html);
}

/**
 * Delete insurance
 */
async function deleteInsurance(id) {
    if (!confirm('Are you sure you want to delete this insurance policy?')) return;

    try {
        await enhancedInsuranceDB.delete(id);
        await renderInsuranceList();
        await renderInsuranceStats();
        safeShowNotification('Insurance policy deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting insurance:', error);
        safeShowNotification('Error deleting policy.', 'error');
    }
}

/**
 * Helper: Add days to BS date (simple version)
 */
function addDaysToBsDate(bsDateStr, days) {
    const [year, month, day] = bsDateStr.split('/').map(Number);
    const adDate = bsToAd(year, month, day);
    adDate.date.setDate(adDate.date.getDate() + days);
    const newBs = adToBs(adDate.date.getFullYear(), adDate.date.getMonth() + 1, adDate.date.getDate());
    return formatBsDate(newBs.year, newBs.month, newBs.day);
}

// Initialize insurance list when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we're on the insurance view
    const insuranceModule = safeGetElementById('insuranceModule');
    if (insuranceModule && insuranceModule.classList.contains('active')) {
        await renderInsuranceList();
        await renderInsuranceStats();
    }
});

// Global function to manually trigger insurance stats update
window.updateInsuranceStats = async function() {
    console.log('🐛 DEBUG: Manual insurance stats update triggered');
    await renderInsuranceStats();
};