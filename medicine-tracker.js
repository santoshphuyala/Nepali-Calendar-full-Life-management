// ============================================
// MEDICINE TRACKER MODULE IMPLEMENTATION
// ============================================

// Medicine CRUD Operations
async function showMedicineForm(existingMedicine = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) {
        showNotification('Modal not found', 'error');
        return;
    }
    
    const familyMembers = await familyMembersDB.getAll();
    const familyMemberOptions = familyMembers.map(member => 
        `<option value="${member.id}">${member.name}</option>` 
    ).join('');
    
    modalTitle.textContent = existingMedicine ? 'Edit Medicine' : 'Add New Medicine';
    modalBody.innerHTML = `
        <form id="medicineForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="medicineName">Medicine Name *</label>
                    <input type="text" id="medicineName" class="form-control" required 
                           value="${existingMedicine?.name || ''}" placeholder="e.g., Paracetamol">
                </div>
                <div class="form-group">
                    <label for="medicineBrand">Brand (Optional)</label>
                    <input type="text" id="medicineBrand" class="form-control" 
                           value="${existingMedicine?.brand || ''}" placeholder="e.g., Crocin">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="familyMemberId">Family Member</label>
                    <select id="familyMemberId" class="form-control">
                        <option value="">Select Family Member (Optional)</option>
                        ${familyMemberOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="medicineCategory">Category</label>
                    <select id="medicineCategory" class="form-control">
                        <option value="general">General</option>
                        <option value="antibiotic">Antibiotic</option>
                        <option value="painkiller">Painkiller</option>
                        <option value="vitamin">Vitamin</option>
                        <option value="chronic">Chronic Medicine</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="dosage">Dosage *</label>
                    <input type="text" id="dosage" class="form-control" required 
                           value="${existingMedicine?.dosage || ''}" placeholder="e.g., 500mg">
                </div>
                <div class="form-group">
                    <label for="frequency">Frequency *</label>
                    <select id="frequency" class="form-control" required>
                        <option value="once">Once daily</option>
                        <option value="twice">Twice daily</option>
                        <option value="thrice">Thrice daily</option>
                        <option value="as-needed">As needed</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="startDate">Start Date *</label>
                    <input type="date" id="startDate" class="form-control" required 
                           value="${existingMedicine?.startDate || ''}">
                </div>
                <div class="form-group">
                    <label for="endDate">End Date</label>
                    <input type="date" id="endDate" class="form-control" 
                           value="${existingMedicine?.endDate || ''}" placeholder="Leave empty if ongoing">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="expiryDate">Expiry Date *</label>
                    <input type="date" id="expiryDate" class="form-control" required 
                           value="${existingMedicine?.expiryDate || ''}">
                </div>
                <div class="form-group">
                    <label for="stockQuantity">Stock Quantity</label>
                    <input type="number" id="stockQuantity" class="form-control" min="0"
                           value="${existingMedicine?.stockQuantity || ''}" placeholder="Number of tablets/capsules">
                </div>
            </div>
            
            <div class="form-group">
                <label for="instructions">Special Instructions</label>
                <textarea id="instructions" class="form-control" rows="3" 
                          placeholder="e.g., Take after meals, avoid dairy products, etc.">${existingMedicine?.instructions || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="notes">Additional Notes</label>
                <textarea id="notes" class="form-control" rows="2" 
                          placeholder="Any additional information">${existingMedicine?.notes || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    ${existingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                ${existingMedicine ? `<button type="button" class="btn btn-danger" onclick="deleteMedicine(${existingMedicine.id})">Delete</button>` : ''}
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    if (existingMedicine) {
        document.getElementById('familyMemberId').value = existingMedicine.familyMemberId || '';
        document.getElementById('medicineCategory').value = existingMedicine.category || 'general';
        document.getElementById('frequency').value = existingMedicine.frequency || 'once';
        document.getElementById('startDate').value = existingMedicine.startDate || '';
        document.getElementById('endDate').value = existingMedicine.endDate || '';
    }
    
    document.getElementById('medicineForm').onsubmit = async (e) => {
        e.preventDefault();
        await saveMedicine(existingMedicine?.id);
    };
}

async function saveMedicine(medicineId = null) {
    try {
        const medicineData = {
            name: document.getElementById('medicineName').value.trim(),
            brand: document.getElementById('medicineBrand').value.trim(),
            familyMemberId: document.getElementById('familyMemberId').value || null,
            category: document.getElementById('medicineCategory').value,
            dosage: document.getElementById('dosage').value.trim(),
            frequency: document.getElementById('frequency').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value || null,
            expiryDate: document.getElementById('expiryDate').value,
            stockQuantity: parseInt(document.getElementById('stockQuantity').value) || 0,
            instructions: document.getElementById('instructions').value.trim(),
            notes: document.getElementById('notes').value.trim(),
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!medicineData.name || !medicineData.dosage || 
            !medicineData.frequency || !medicineData.startDate || !medicineData.expiryDate) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        if (medicineId) {
            await medicineDB.update({ ...medicineData, id: medicineId });
            showNotification('Medicine updated successfully', 'success');
        } else {
            await medicineDB.add(medicineData);
            showNotification('Medicine added successfully', 'success');
        }
        
        closeModal();
        await renderMedicineList();
        await updateMedicineStats();
    } catch (error) {
        console.error('Error saving medicine:', error);
        showNotification('Error saving medicine', 'error');
    }
}

async function deleteMedicine(medicineId) {
    if (!confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
        return;
    }
    
    try {
        await medicineDB.delete(medicineId);
        showNotification('Medicine deleted successfully', 'success');
        closeModal();
        await renderMedicineList();
        await updateMedicineStats();
    } catch (error) {
        console.error('Error deleting medicine:', error);
        showNotification('Error deleting medicine', 'error');
    }
}

async function renderMedicineList() {
    const medicineList = document.getElementById('medicineList');
    if (!medicineList) return;
    
    try {
        const medicines = await medicineDB.getAll();
        const familyMembers = await familyMembersDB.getAll();
        
        const memberMap = {};
        familyMembers.forEach(member => {
            memberMap[member.id] = member.name;
        });
        
        if (medicines.length === 0) {
            medicineList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <h3>No medicines found</h3>
                    <p>Add your first medicine to get started</p>
                    <button class="btn btn-primary" onclick="showMedicineForm()">+ Add Medicine</button>
                </div>
            `;
            return;
        }
        
        medicineList.innerHTML = medicines.map(medicine => {
            const memberName = medicine.familyMemberId ? (memberMap[medicine.familyMemberId] || 'Unknown') : 'General';
            const isExpired = new Date(medicine.expiryDate) < new Date();
            const isExpiringSoon = new Date(medicine.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const isLowStock = medicine.stockQuantity <= 7 && medicine.stockQuantity > 0;
            
            const statusColor = isExpired ? '#ef4444' : isExpiringSoon ? '#f59e0b' : isLowStock ? '#f97316' : '#10b981';
            const statusText = isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : isLowStock ? 'Low Stock' : 'Active';
            
            return `
                <div class="medicine-card ${isExpired ? 'expired' : isExpiringSoon ? 'expiring' : isLowStock ? 'low-stock' : 'active'}">
                    <div class="medicine-header">
                        <div class="medicine-info">
                            <h4>${medicine.name}</h4>
                            <p class="medicine-brand">${medicine.brand || 'No brand'}</p>
                            <div class="medicine-meta">
                                <span class="member-badge">${memberName}</span>
                                <span class="category-badge">${medicine.category}</span>
                                <span class="status-badge" style="color: ${statusColor}">${statusText}</span>
                            </div>
                        </div>
                        <div class="medicine-actions">
                            <button class="btn btn-sm btn-primary" onclick="showMedicineForm(${JSON.stringify(medicine).replace(/"/g, '&quot;')})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-info" onclick="markDoseTaken(${medicine.id})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="buyMedicine(${medicine.id}, '${(medicine.name || '').replace(/'/g, "\\'").replace(/"/g, '\\"')}', ${medicine.stockQuantity || 0})">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="medicine-details">
                        <div class="detail-row">
                            <strong>Dosage:</strong> ${medicine.dosage} - ${medicine.frequency}
                        </div>
                        <div class="detail-row">
                            <strong>Period:</strong> ${medicine.startDate} ${medicine.endDate ? 'to ' + medicine.endDate : '(ongoing)'}
                        </div>
                        <div class="detail-row">
                            <strong>Stock:</strong> ${medicine.stockQuantity || 'Not specified'}
                            ${isLowStock ? '<span class="low-stock-warning">⚠️ Low Stock</span>' : ''}
                        </div>
                        <div class="detail-row">
                            <strong>Expiry:</strong> ${medicine.expiryDate}
                            ${isExpired ? '<span class="expired-warning">❌ Expired</span>' : isExpiringSoon ? '<span class="expiring-warning">⚠️ Expiring Soon</span>' : ''}
                        </div>
                        ${medicine.instructions ? `
                            <div class="detail-row">
                                <strong>Instructions:</strong> ${medicine.instructions}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        checkLowStockMedicines(medicines);
        
    } catch (error) {
        console.error('Error rendering medicine list:', error);
        medicineList.innerHTML = '<p class="error">Error loading medicines</p>';
    }
}

async function checkLowStockMedicines(medicines) {
    const lowStockMedicines = medicines.filter(m => 
        m.stockQuantity <= 7 && m.stockQuantity > 0 && m.status === 'active'
    );
    
    if (lowStockMedicines.length > 0) {
        const medicineNames = lowStockMedicines.map(m => m.name).join(', ');
        showNotification(`⚠️ Low Stock Alert: ${medicineNames} need to be restocked soon!`, 'warning');
    }
}

async function updateMedicineStats() {
    try {
        const medicines = await medicineDB.getAll();
        const today = new Date().toISOString().split('T')[0];
        
        const activeMedicines = medicines.filter(m => m.status === 'active' && 
            (!m.endDate || m.endDate >= today));
        
        const expiringSoon = medicines.filter(m => {
            const expiryDate = new Date(m.expiryDate);
            const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
        });
        
        const activeCount = document.getElementById('activeMedicinesCount');
        const expiringCount = document.getElementById('expiringCount');
        
        if (activeCount) activeCount.textContent = activeMedicines.length;
        if (expiringCount) expiringCount.textContent = expiringSoon.length;
        
    } catch (error) {
        console.error('Error updating medicine stats:', error);
    }
}

// Family Member Management
async function showFamilyMemberForm(existingMember = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) {
        showNotification('Modal not found', 'error');
        return;
    }
    
    modalTitle.textContent = existingMember ? 'Edit Family Member' : 'Add Family Member';
    modalBody.innerHTML = `
        <form id="familyMemberForm">
            <div class="form-group">
                <label for="memberName">Name *</label>
                <input type="text" id="memberName" class="form-control" required 
                       value="${existingMember?.name || ''}" placeholder="e.g., John Doe">
            </div>
            
            <div class="form-group">
                <label for="relationship">Relationship</label>
                <select id="relationship" class="form-control">
                    <option value="">Select Relationship (Optional)</option>
                    <option value="self">Self</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" class="form-control" 
                       value="${existingMember?.dateOfBirth || ''}">
            </div>
            
            <div class="form-group">
                <label for="bloodGroup">Blood Group</label>
                <select id="bloodGroup" class="form-control">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="allergies">Known Allergies</label>
                <textarea id="allergies" class="form-control" rows="2" 
                          placeholder="e.g., Penicillin, Peanuts, etc.">${existingMember?.allergies || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="medicalConditions">Medical Conditions</label>
                <textarea id="medicalConditions" class="form-control" rows="2" 
                          placeholder="e.g., Diabetes, Hypertension, etc.">${existingMember?.medicalConditions || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    ${existingMember ? 'Update Member' : 'Add Member'}
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                ${existingMember ? `<button type="button" class="btn btn-danger" onclick="deleteFamilyMember(${existingMember.id})">Delete</button>` : ''}
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    if (existingMember) {
        document.getElementById('relationship').value = existingMember.relationship || '';
        document.getElementById('bloodGroup').value = existingMember.bloodGroup || '';
    }
    
    document.getElementById('familyMemberForm').onsubmit = async (e) => {
        e.preventDefault();
        await saveFamilyMember(existingMember?.id);
    };
}

async function saveFamilyMember(memberId = null) {
    try {
        const memberData = {
            name: document.getElementById('memberName').value.trim(),
            relationship: document.getElementById('relationship').value || null,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            allergies: document.getElementById('allergies').value.trim(),
            medicalConditions: document.getElementById('medicalConditions').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!memberData.name) {
            showNotification('Please fill the name field', 'error');
            return;
        }
        
        if (memberId) {
            await familyMembersDB.update({ ...memberData, id: memberId });
            showNotification('Family member updated successfully', 'success');
        } else {
            await familyMembersDB.add(memberData);
            showNotification('Family member added successfully', 'success');
        }
        
        closeModal();
        await renderFamilyMembersList();
        await updateMemberFilter();
    } catch (error) {
        console.error('Error saving family member:', error);
        showNotification('Error saving family member', 'error');
    }
}

async function deleteFamilyMember(memberId) {
    if (!confirm('Are you sure you want to delete this family member? All associated medicines will also be deleted.')) {
        return;
    }
    
    try {
        await familyMembersDB.delete(memberId);
        showNotification('Family member deleted successfully', 'success');
        closeModal();
        await renderFamilyMembersList();
        await updateMemberFilter();
    } catch (error) {
        console.error('Error deleting family member:', error);
        showNotification('Error deleting family member', 'error');
    }
}

async function renderFamilyMembersList() {
    const familyMembersList = document.getElementById('familyMembersList');
    if (!familyMembersList) return;
    
    try {
        const familyMembers = await familyMembersDB.getAll();
        
        if (familyMembers.length === 0) {
            familyMembersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No family members added</h3>
                    <p>Add family members to track their medicines</p>
                    <button class="btn btn-primary" onclick="showFamilyMemberForm()">+ Add Family Member</button>
                </div>
            `;
            return;
        }
        
        familyMembersList.innerHTML = `
            <div class="family-grid">
                ${await Promise.all(familyMembers.map(async member => {
                    const medicineCount = await getMemberMedicineCount(member.id);
                    return `
                    <div class="family-member-card">
                        <div class="member-header">
                            <div class="member-avatar">
                                ${member.name.charAt(0).toUpperCase()}
                            </div>
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <p class="relationship">${member.relationship || 'Not specified'}</p>
                            </div>
                            <div class="member-actions">
                                <button class="btn btn-sm btn-primary" onclick="showFamilyMemberForm(${JSON.stringify(member).replace(/"/g, '&quot;')})">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="member-details">
                            ${member.dateOfBirth ? `<div class="detail"><strong>DOB:</strong> ${member.dateOfBirth}</div>` : ''}
                            ${member.bloodGroup ? `<div class="detail"><strong>Blood Group:</strong> ${member.bloodGroup}</div>` : ''}
                            ${member.allergies ? `<div class="detail"><strong>Allergies:</strong> ${member.allergies}</div>` : ''}
                            ${member.medicalConditions ? `<div class="detail"><strong>Conditions:</strong> ${member.medicalConditions}</div>` : ''}
                        </div>
                        
                        <div class="member-medicines">
                            <h5>Active Medicines</h5>
                            <div class="medicine-count">
                                ${medicineCount} medicines
                            </div>
                        </div>
                    </div>
                `;})).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error rendering family members list:', error);
        familyMembersList.innerHTML = '<p class="error">Error loading family members</p>';
    }
}

async function getMemberMedicineCount(memberId) {
    try {
        const medicines = await medicineDB.getByIndex('familyMemberId', memberId);
        const today = new Date().toISOString().split('T')[0];
        return medicines.filter(m => m.status === 'active' && 
            (!m.endDate || m.endDate >= today)).length;
    } catch (error) {
        return 0;
    }
}

async function updateMemberFilter() {
    const memberFilter = document.getElementById('memberFilter');
    if (!memberFilter) return;
    
    const familyMembers = await familyMembersDB.getAll();
    
    memberFilter.innerHTML = '<option value="all">All Family Members</option>' +
        familyMembers.map(member => 
            `<option value="${member.id}">${member.name}</option>`
        ).join('');
}

// Dosage tracking
async function markDoseTaken(medicineId) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const time = now.toTimeString().split(' ')[0].substring(0, 5);
        
        const doseData = {
            medicineId: medicineId,
            date: today,
            time: time,
            status: 'taken',
            takenAt: now.toISOString(),
            createdAt: now.toISOString()
        };
        
        await dosageScheduleDB.add(doseData);
        
        // Decrement stock quantity
        const medicine = await medicineDB.get(medicineId);
        if (medicine && medicine.stockQuantity > 0) {
            await medicineDB.update({ ...medicine, stockQuantity: medicine.stockQuantity - 1, updatedAt: new Date().toISOString() });
        }
        
        showNotification('Dose marked as taken', 'success');
        
        await renderMedicineList();
        await updateMedicineStats();
        
    } catch (error) {
        console.error('Error marking dose taken:', error);
        showNotification('Error marking dose taken', 'error');
    }
}

async function renderScheduleList() {
    const scheduleList = document.getElementById('scheduleList');
    if (!scheduleList) return;
    
    try {
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const todayStr = today.toISOString().split('T')[0];
        const schedules = await dosageScheduleDB.getByIndex('date', todayStr);
        
        if (schedules.length === 0) {
            scheduleList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <h3>No doses scheduled for today</h3>
                    <p>Check back later or add medicines with dosage schedules</p>
                </div>
            `;
            return;
        }
        
        const scheduleHtml = await Promise.all(schedules.map(async schedule => {
            const medicine = await medicineDB.get(schedule.medicineId);
            const medicineName = medicine ? medicine.name : 'Unknown Medicine';
            
            return `
                <div class="dose-card ${schedule.status}">
                    <div class="dose-time">${schedule.time}</div>
                    <div class="dose-medicine">${medicineName}</div>
                    <div class="dose-status">
                        ${schedule.status === 'taken' ? 
                            '<span class="status-taken">✓ Taken</span>' : 
                            '<button class="btn btn-sm btn-primary" onclick="markDoseTaken(' + schedule.medicineId + ')">Mark as Taken</button>'
                        }
                    </div>
                </div>
            `;
        }));
        
        scheduleList.innerHTML = scheduleHtml.join('');
        
    } catch (error) {
        console.error('Error rendering schedule list:', error);
        scheduleList.innerHTML = '<p class="error">Error loading schedule</p>';
    }
}

async function renderPrescriptionsList() {
    const prescriptionsList = document.getElementById('prescriptionsList');
    if (!prescriptionsList) return;
    
    try {
        const prescriptions = await prescriptionsDB.getAll();
        
        if (prescriptions.length === 0) {
            prescriptionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-prescription"></i>
                    <h3>No prescriptions found</h3>
                    <p>Add prescriptions to track medical history</p>
                </div>
            `;
            return;
        }
        
        const prescriptionHtml = await Promise.all(prescriptions.map(async prescription => {
            const medicine = await medicineDB.get(prescription.medicineId);
            const medicineName = medicine ? medicine.name : 'Unknown Medicine';
            const memberName = prescription.familyMemberId ? (memberMap[prescription.familyMemberId] || 'Unknown') : 'General';
            
            return `
                <div class="prescription-card">
                    <div class="prescription-header">
                        <h4>${prescription.doctorName || 'Unknown Doctor'}</h4>
                        <span class="prescription-date">${prescription.issueDate || 'No date'}</span>
                    </div>
                    <div class="prescription-details">
                        <div class="detail"><strong>Medicine:</strong> ${medicineName}</div>
                        <div class="detail"><strong>Patient:</strong> ${memberName}</div>
                        ${prescription.dosage ? `<div class="detail"><strong>Dosage:</strong> ${prescription.dosage}</div>` : ''}
                        ${prescription.notes ? `<div class="detail"><strong>Notes:</strong> ${prescription.notes}</div>` : ''}
                    </div>
                </div>
            `;
        }));
        
        prescriptionsList.innerHTML = prescriptionHtml.join('');
        
    } catch (error) {
        console.error('Error rendering prescriptions list:', error);
        prescriptionsList.innerHTML = '<p class="error">Error loading prescriptions</p>';
    }
}

// Prescription Management Functions
async function showPrescriptionForm(existingPrescription = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) {
        showNotification('Modal not found', 'error');
        return;
    }
    
    const medicines = await medicineDB.getAll();
    const familyMembers = await familyMembersDB.getAll();
    
    const medicineOptions = medicines.map(medicine => 
        `<option value="${medicine.id}">${medicine.name}</option>`
    ).join('');
    
    const memberOptions = familyMembers.map(member => 
        `<option value="${member.id}">${member.name}</option>`
    ).join('');
    
    modalTitle.textContent = existingPrescription ? 'Edit Prescription' : 'Add New Prescription';
    modalBody.innerHTML = `
        <form id="prescriptionForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="doctorName">Doctor Name *</label>
                    <input type="text" id="doctorName" class="form-control" required 
                           value="${existingPrescription?.doctorName || ''}" placeholder="e.g., Dr. Smith">
                </div>
                <div class="form-group">
                    <label for="issueDate">Issue Date *</label>
                    <input type="date" id="issueDate" class="form-control" required 
                           value="${existingPrescription?.issueDate || ''}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="prescriptionMedicineId">Medicine *</label>
                    <select id="prescriptionMedicineId" class="form-control" required>
                        <option value="">Select Medicine</option>
                        ${medicineOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="prescriptionFamilyMemberId">Patient *</label>
                    <select id="prescriptionFamilyMemberId" class="form-control" required>
                        <option value="">Select Family Member</option>
                        ${memberOptions}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="prescriptionDosage">Dosage Instructions</label>
                <input type="text" id="prescriptionDosage" class="form-control" 
                       value="${existingPrescription?.dosage || ''}" placeholder="e.g., 1 tablet twice daily">
            </div>
            
            <div class="form-group">
                <label for="prescriptionNotes">Notes</label>
                <textarea id="prescriptionNotes" class="form-control" rows="3" 
                          placeholder="Additional notes about this prescription">${existingPrescription?.notes || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    ${existingPrescription ? 'Update Prescription' : 'Add Prescription'}
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                ${existingPrescription ? `<button type="button" class="btn btn-danger" onclick="deletePrescription(${existingPrescription.id})">Delete</button>` : ''}
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    if (existingPrescription) {
        document.getElementById('prescriptionMedicineId').value = existingPrescription.medicineId || '';
        document.getElementById('prescriptionFamilyMemberId').value = existingPrescription.familyMemberId || '';
        document.getElementById('prescriptionDosage').value = existingPrescription.dosage || '';
    }
    
    document.getElementById('prescriptionForm').onsubmit = async (e) => {
        e.preventDefault();
        await savePrescription(existingPrescription?.id);
    };
}

async function savePrescription(prescriptionId = null) {
    try {
        const prescriptionData = {
            doctorName: document.getElementById('doctorName').value.trim(),
            issueDate: document.getElementById('issueDate').value,
            medicineId: document.getElementById('prescriptionMedicineId').value,
            familyMemberId: document.getElementById('prescriptionFamilyMemberId').value,
            dosage: document.getElementById('prescriptionDosage').value.trim(),
            notes: document.getElementById('prescriptionNotes').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!prescriptionData.doctorName || !prescriptionData.issueDate || 
            !prescriptionData.medicineId || !prescriptionData.familyMemberId) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        if (prescriptionId) {
            await prescriptionsDB.update({ ...prescriptionData, id: prescriptionId });
            showNotification('Prescription updated successfully', 'success');
        } else {
            await prescriptionsDB.add(prescriptionData);
            showNotification('Prescription added successfully', 'success');
        }
        
        closeModal();
        await renderPrescriptionsList();
    } catch (error) {
        console.error('Error saving prescription:', error);
        showNotification('Error saving prescription', 'error');
    }
}

async function deletePrescription(prescriptionId) {
    if (!confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
        return;
    }
    
    try {
        await prescriptionsDB.delete(prescriptionId);
        showNotification('Prescription deleted successfully', 'success');
        closeModal();
        await renderPrescriptionsList();
    } catch (error) {
        console.error('Error deleting prescription:', error);
        showNotification('Error deleting prescription', 'error');
    }
}

// Import/Export Functions
async function exportMedicineData(type, format = 'json') {
    try {
        let data = {};
        
        switch(type) {
            case 'medicines':
                data.medicines = await medicineDB.getAll();
                break;
            case 'family':
                data.familyMembers = await familyMembersDB.getAll();
                break;
            case 'complete':
                data.medicines = await medicineDB.getAll();
                data.familyMembers = await familyMembersDB.getAll();
                data.prescriptions = await prescriptionsDB.getAll();
                data.dosageSchedule = await dosageScheduleDB.getAll();
                break;
        }
        
        data.exportDate = new Date().toISOString();
        data.version = '1.0';
        
        if (format === 'json') {
            const jsonStr = JSON.stringify(data, null, 2);
            downloadFile(jsonStr, `medicine-data-${type}-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        } else if (format === 'excel' && typeof XLSX !== 'undefined') {
            const wb = XLSX.utils.book_new();
            
            if (data.medicines) {
                const ws = XLSX.utils.json_to_sheet(data.medicines);
                XLSX.utils.book_append_sheet(wb, ws, 'Medicines');
            }
            
            if (data.familyMembers) {
                const ws = XLSX.utils.json_to_sheet(data.familyMembers);
                XLSX.utils.book_append_sheet(wb, ws, 'Family Members');
            }
            
            if (data.prescriptions) {
                const ws = XLSX.utils.json_to_sheet(data.prescriptions);
                XLSX.utils.book_append_sheet(wb, ws, 'Prescriptions');
            }
            
            if (data.dosageSchedule) {
                const ws = XLSX.utils.json_to_sheet(data.dosageSchedule);
                XLSX.utils.book_append_sheet(wb, ws, 'Dosage Schedule');
            }
            
            XLSX.writeFile(wb, `medicine-data-${type}-${new Date().toISOString().split('T')[0]}.xlsx`);
        }
        
        showNotification(`Medicine data exported successfully`, 'success');
    } catch (error) {
        console.error('Error exporting medicine data:', error);
        showNotification('Error exporting medicine data', 'error');
    }
}

async function importMedicineData(format, fileInput) {
    try {
        const file = fileInput.files[0];
        if (!file) {
            showNotification('No file selected', 'error');
            return;
        }
        
        if (format === 'json') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (!importData.medicines && !importData.familyMembers) {
                        showNotification('Invalid import file format', 'error');
                        return;
                    }
                    
                    if (importData.medicines) {
                        for (const item of importData.medicines) {
                            delete item.id;
                            await medicineDB.add(item);
                        }
                    }
                    
                    if (importData.familyMembers) {
                        for (const item of importData.familyMembers) {
                            delete item.id;
                            await familyMembersDB.add(item);
                        }
                    }
                    
                    if (importData.prescriptions) {
                        for (const item of importData.prescriptions) {
                            delete item.id;
                            await prescriptionsDB.add(item);
                        }
                    }
                    
                    if (importData.dosageSchedule) {
                        for (const item of importData.dosageSchedule) {
                            delete item.id;
                            await dosageScheduleDB.add(item);
                        }
                    }
                    
                    showNotification('Medicine data imported successfully', 'success');
                    
                    await renderMedicineList();
                    await updateMedicineStats();
                    await updateMemberFilter();
                    await renderFamilyMembersList();
                    await renderScheduleList();
                    await renderPrescriptionsList();
                    
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                    showNotification('Failed to parse import file', 'error');
                }
            };
            
            reader.onerror = () => {
                showNotification('Failed to read file', 'error');
            };
            
            reader.readAsText(file);
        }
        
    } catch (error) {
        console.error('Error importing medicine data:', error);
        showNotification('Error importing medicine data', 'error');
    }
    
    fileInput.value = '';
}

// Buy medicine function - adds to shopping list and creates expense
async function buyMedicine(medicineId, medicineName, currentStock) {
    try {
        const familyMembers = await familyMembersDB.getAll();
        const familyMemberOptions = familyMembers.map(member => 
            `<option value="${member.id}">${member.name}</option>`
        ).join('');
        
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Buy Medicine - Add to Shopping';
        modalBody.innerHTML = `
            <form id="buyMedicineForm">
                <div class="form-group">
                    <label for="purchaseQuantity">Purchase Quantity *</label>
                    <input type="number" id="purchaseQuantity" class="form-control" required 
                           min="1" value="1" placeholder="How many units to buy">
                </div>
                
                <div class="form-group">
                    <label for="purchasePrice">Price per Unit (Rs.) *</label>
                    <input type="number" id="purchasePrice" class="form-control" required 
                           min="0" step="0.01" placeholder="Price per tablet/capsule">
                </div>
                
                <div class="form-group">
                    <label for="totalPrice">Total Price (Rs.)</label>
                    <input type="number" id="totalPrice" class="form-control" readonly 
                           placeholder="Calculated automatically">
                </div>
                
                <div class="form-group">
                    <label for="purchaseStore">Store/Pharmacy *</label>
                    <input type="text" id="purchaseStore" class="form-control" required 
                           placeholder="e.g., Pharmacy name">
                </div>
                
                <div class="form-group">
                    <label for="purchaseFamilyMemberId">Purchased For</label>
                    <select id="purchaseFamilyMemberId" class="form-control">
                        <option value="">Select Family Member</option>
                        ${familyMemberOptions}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="purchaseNotes">Notes</label>
                    <textarea id="purchaseNotes" class="form-control" rows="2" 
                              placeholder="Any additional notes about this purchase"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Add to Shopping List</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'block';
        
        const updateTotalPrice = () => {
            const quantity = parseInt(document.getElementById('purchaseQuantity').value) || 0;
            const price = parseFloat(document.getElementById('purchasePrice').value) || 0;
            const total = quantity * price;
            document.getElementById('totalPrice').value = total.toFixed(2);
        };
        
        document.getElementById('purchaseQuantity').addEventListener('input', updateTotalPrice);
        document.getElementById('purchasePrice').addEventListener('input', updateTotalPrice);
        
        document.getElementById('buyMedicineForm').onsubmit = async (e) => {
            e.preventDefault();
            
            const quantity = parseInt(document.getElementById('purchaseQuantity').value);
            const price = parseFloat(document.getElementById('purchasePrice').value);
            const store = document.getElementById('purchaseStore').value.trim();
            const familyMemberId = document.getElementById('purchaseFamilyMemberId').value;
            const notes = document.getElementById('purchaseNotes').value.trim();
            
            if (!quantity || !price || !store) {
                showNotification('Please fill all required fields', 'error');
                return;
            }
            
            const shoppingItem = {
                name: `${medicineName} (Medicine)`,
                quantity: quantity,
                price: price,
                category: 'Medicine',
                priority: 'high',
                notes: notes || `Purchased from ${store}`,
                familyMemberId: familyMemberId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            await shoppingDB.add(shoppingItem);
            
            const today = getCurrentNepaliDate();
            const bsDate = formatBsDate(today.year, today.month, today.day);
            
            const expenseData = {
                date_bs: bsDate,
                category: 'Healthcare',
                currency: 'NPR',
                amount: quantity * price,
                description: `Medicine: ${medicineName} from ${store}`,
                type: 'expense',
                source: 'medicine_tracker',
                notes: `Purchased ${quantity} units of ${medicineName} from ${store}. ${notes || ''}`
            };
            
            await expenseDB.add(expenseData);
            
            const medicine = await medicineDB.get(medicineId);
            if (medicine) {
                const newStock = (medicine.stockQuantity || 0) + quantity;
                await medicineDB.update({ ...medicine, stockQuantity: newStock, updatedAt: new Date().toISOString() });
            }
            
            closeModal();
            showNotification(`✅ Added ${quantity} units of ${medicineName} to shopping list and expense tracker!`, 'success');
            
            await renderMedicineList();
            await updateMedicineStats();
            await renderShoppingList();
        };
    } catch (error) {
        console.error('Error in buy medicine:', error);
        showNotification('Error processing medicine purchase', 'error');
    }
}

// ============================================
// INITIALISATION
// ============================================

function initMedicineTracker() {
    // Wire the header action buttons
    const addMedicineBtn = document.getElementById('addMedicineBtn');
    if (addMedicineBtn) {
        addMedicineBtn.onclick = () => showMedicineForm();
    }

    const addFamilyMemberBtn = document.getElementById('addFamilyMemberBtn');
    if (addFamilyMemberBtn) {
        addFamilyMemberBtn.onclick = () => showFamilyMemberForm();
    }

    // Wire the module tabs (Medicines / Family / Schedule / Prescriptions)
    const medicineView = document.getElementById('medicineView');
    if (medicineView) {
        medicineView.querySelectorAll('.module-tab').forEach(tab => {
            tab.onclick = () => {
                medicineView.querySelectorAll('.module-tab').forEach(t => t.classList.remove('active'));
                medicineView.querySelectorAll('.medicine-module').forEach(m => m.classList.remove('active'));
                tab.classList.add('active');
                const moduleId = tab.dataset.module + 'Module';
                const moduleEl = document.getElementById(moduleId);
                if (moduleEl) moduleEl.classList.add('active');
            };
        });
    }

    // Load initial data
    renderMedicineList();
    updateMedicineStats();
    updateMemberFilter();
    renderFamilyMembersList();
    renderScheduleList();
    renderPrescriptionsList();
}

// ============================================
// GLOBAL FUNCTION EXPORTS
// ============================================

// Make medicine tracker functions globally available
window.showMedicineForm = showMedicineForm;
window.saveMedicine = saveMedicine;
window.deleteMedicine = deleteMedicine;
window.renderMedicineList = renderMedicineList;
window.updateMedicineStats = updateMedicineStats;

window.showFamilyMemberForm = showFamilyMemberForm;
window.saveFamilyMember = saveFamilyMember;
window.deleteFamilyMember = deleteFamilyMember;
window.renderFamilyMembersList = renderFamilyMembersList;
window.updateMemberFilter = updateMemberFilter;

window.markDoseTaken = markDoseTaken;
window.renderScheduleList = renderScheduleList;

window.showPrescriptionForm = showPrescriptionForm;
window.savePrescription = savePrescription;
window.deletePrescription = deletePrescription;
window.renderPrescriptionsList = renderPrescriptionsList;

window.buyMedicine = buyMedicine;
window.exportMedicineData = exportMedicineData;
window.importMedicineData = importMedicineData;
window.initMedicineTracker = initMedicineTracker;