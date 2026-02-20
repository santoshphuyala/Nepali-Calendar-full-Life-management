/**
 * ========================================
 * VEHICLE MANAGER MODULE
 * Developer: Santosh Phuyal
 * ========================================
 */

/**
 * Show vehicle form
 */
function showVehicleForm(vehicle = null) {
    const today = getCurrentNepaliDate();

    const html = `
        <h2>${vehicle ? 'Edit' : 'Add'} Vehicle</h2>
        <form id="vehicleForm">
            <div class="form-group">
                <label>Vehicle Type</label>
                <select id="vehicleType" required>
                    <option value="car" ${vehicle && vehicle.type === 'car' ? 'selected' : ''}>🚗 Car</option>
                    <option value="motorcycle" ${vehicle && vehicle.type === 'motorcycle' ? 'selected' : ''}>🏍️ Motorcycle</option>
                    <option value="scooter" ${vehicle && vehicle.type === 'scooter' ? 'selected' : ''}>🛵 Scooter</option>
                    <option value="truck" ${vehicle && vehicle.type === 'truck' ? 'selected' : ''}>🚚 Truck</option>
                    <option value="bus" ${vehicle && vehicle.type === 'bus' ? 'selected' : ''}>🚌 Bus</option>
                    <option value="other" ${vehicle && vehicle.type === 'other' ? 'selected' : ''}>🚙 Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Vehicle Name/Model</label>
                <input type="text" id="vehicleName" value="${vehicle ? vehicle.name : ''}" placeholder="e.g., Honda City 2020" required>
            </div>
            <div class="form-group">
                <label>Registration Number</label>
                <input type="text" id="vehicleRegNumber" value="${vehicle ? vehicle.registrationNumber : ''}" placeholder="e.g., BA 1 PA 1234" required>
            </div>
            <div class="form-group">
                <label>Manufacturer</label>
                <input type="text" id="vehicleManufacturer" value="${vehicle ? vehicle.manufacturer : ''}" placeholder="e.g., Honda, Yamaha">
            </div>
            <div class="form-group">
                <label>Year of Manufacture</label>
                <input type="number" id="vehicleYear" value="${vehicle ? vehicle.year : ''}" placeholder="2020" min="1980" max="2092">
            </div>
            <div class="form-group">
                <label>Purchase Date (BS)</label>
                <input type="text" id="vehiclePurchaseDate" value="${vehicle ? vehicle.purchaseDate : formatBsDate(today.year, today.month, today.day)}">
            </div>
            <div class="form-group">
                <label>Purchase Price (NPR)</label>
                <input type="number" id="vehiclePrice" value="${vehicle ? vehicle.price : ''}" step="1000">
            </div>
            <div class="form-group">
                <label>Current Mileage (KM)</label>
                <input type="number" id="vehicleMileage" value="${vehicle ? vehicle.mileage : ''}" step="1">
            </div>
            <div class="form-group">
                <label>Fuel Type</label>
                <select id="vehicleFuelType">
                    <option value="petrol" ${vehicle && vehicle.fuelType === 'petrol' ? 'selected' : ''}>Petrol</option>
                    <option value="diesel" ${vehicle && vehicle.fuelType === 'diesel' ? 'selected' : ''}>Diesel</option>
                    <option value="electric" ${vehicle && vehicle.fuelType === 'electric' ? 'selected' : ''}>Electric</option>
                    <option value="hybrid" ${vehicle && vehicle.fuelType === 'hybrid' ? 'selected' : ''}>Hybrid</option>
                    <option value="cng" ${vehicle && vehicle.fuelType === 'cng' ? 'selected' : ''}>CNG</option>
                </select>
            </div>
            <div class="form-group">
                <label>Color</label>
                <input type="text" id="vehicleColor" value="${vehicle ? vehicle.color : ''}" placeholder="e.g., Black, White">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="vehicleNotes">${vehicle ? vehicle.notes || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save Vehicle</button>
            </div>
        </form>
    `;

    showModal(html);

    // Initialize Nepali date picker for vehicle purchase date
    setTimeout(() => {
        const dateInput = document.getElementById('vehiclePurchaseDate');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);

    document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            type: document.getElementById('vehicleType').value,
            name: document.getElementById('vehicleName').value,
            registrationNumber: document.getElementById('vehicleRegNumber').value,
            manufacturer: document.getElementById('vehicleManufacturer').value,
            year: document.getElementById('vehicleYear').value,
            purchaseDate: document.getElementById('vehiclePurchaseDate').value,
            price: parseFloat(document.getElementById('vehiclePrice').value) || 0,
            mileage: parseFloat(document.getElementById('vehicleMileage').value) || 0,
            fuelType: document.getElementById('vehicleFuelType').value,
            color: document.getElementById('vehicleColor').value,
            notes: document.getElementById('vehicleNotes').value,
            createdAt: vehicle ? vehicle.createdAt : new Date().toISOString()
        };

        try {
            if (vehicle) {
                data.id = vehicle.id;
                await enhancedVehicleDB.update(data);
            } else {
                await enhancedVehicleDB.add(data);
            }

            closeModal();
            if (currentView === 'vehicle') renderVehicleGrid();
            safeShowNotification('Vehicle saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving vehicle:', error);
            safeShowNotification('Error saving vehicle.', 'error');
        }
    });
}

/**
 * Render vehicle grid
 */
async function renderVehicleGrid() {
    const container = safeGetElementById('vehicleGrid');
    if (!container) {
        console.error('Vehicle grid container not found');
        return;
    }
    
    const vehicles = await enhancedVehicleDB.getAll();

    if (vehicles.length === 0) {
        container.innerHTML = '<div class="loading">No vehicles added. Click "Add Vehicle" to get started.</div>';
        return;
    }

    const typeIcons = {
        car: '🚗',
        motorcycle: '🏍️',
        scooter: '🛵',
        truck: '🚚',
        bus: '🚌',
        other: '🚙'
    };

    container.innerHTML = vehicles.map(vehicle => {
        return `
            <div class="vehicle-card">
                <div class="vehicle-header">
                    <div class="vehicle-icon-large">${typeIcons[vehicle.type]}</div>
                    <div class="vehicle-info">
                        <h3 class="vehicle-name">${vehicle.name}</h3>
                        <p class="vehicle-reg">${vehicle.registrationNumber}</p>
                    </div>
                </div>

                <div class="vehicle-details">
                    <div class="vehicle-detail-item">
                        <span class="label">Manufacturer:</span>
                        <span class="value">${vehicle.manufacturer || 'N/A'}</span>
                    </div>
                    <div class="vehicle-detail-item">
                        <span class="label">Year:</span>
                        <span class="value">${vehicle.year || 'N/A'}</span>
                    </div>
                    <div class="vehicle-detail-item">
                        <span class="label">Fuel Type:</span>
                        <span class="value">${vehicle.fuelType}</span>
                    </div>
                    <div class="vehicle-detail-item">
                        <span class="label">Mileage:</span>
                        <span class="value">${vehicle.mileage.toLocaleString()} KM</span>
                    </div>
                    <div class="vehicle-detail-item">
                        <span class="label">Purchase Date:</span>
                        <span class="value">${vehicle.purchaseDate}</span>
                    </div>
                </div>

                <div class="vehicle-services">
                    <button class="btn-secondary btn-sm" onclick="showServiceHistory(${vehicle.id})">🔧 Services</button>
                    <button class="btn-secondary btn-sm" onclick="addFuelExpense(${vehicle.id})">⛽ Add Fuel</button>
                    <button class="btn-secondary btn-sm" onclick="updateMileage(${vehicle.id})">📊 Update KM</button>
                </div>

                <div class="vehicle-actions">
                    <button class="btn-primary btn-sm" onclick='showVehicleForm(${safeJsonStringify(vehicle)})'>✏️ Edit</button>
                    <button class="btn-danger btn-sm" onclick="deleteVehicle(${vehicle.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Show service history
 */
async function showServiceHistory(vehicleId) {
    const vehicle = await enhancedVehicleDB.get(vehicleId);
    const services = await enhancedVehicleServiceDB.getByIndex('vehicleId', vehicleId);

    const html = `
        <h2>🔧 Service History - ${vehicle.name}</h2>
        <button class="btn-primary" onclick="addServiceRecord(${vehicleId})">+ Add Service</button>
        
        <div class="service-list" style="margin-top: 1rem; max-height: 400px; overflow-y: auto;">
            ${services.length === 0 ? '<p style="color: var(--text-secondary);">No service records</p>' : 
                services.sort((a, b) => b.date.localeCompare(a.date)).map(service => `
                    <div class="service-item" style="background: var(--bg-color); padding: 1rem; margin-bottom: 0.5rem; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <strong>${service.type}</strong><br>
                                <small>${service.date} | ${service.mileage} KM</small><br>
                                <small>${service.description || ''}</small>
                            </div>
                            <div style="text-align: right;">
                                <strong style="color: var(--danger-color);">Rs. ${parseFloat(service.cost).toLocaleString()}</strong><br>
                                <button class="icon-btn" onclick="deleteService(${service.id})">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('')
            }
        </div>

        <div class="form-actions">
            <button class="btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;

    showModal(html);
}

/**
 * Add service record
 */
function addServiceRecord(vehicleId) {
    closeModal();
    const today = getCurrentNepaliDate();

    const html = `
        <h2>Add Service Record</h2>
        <form id="serviceForm">
            <div class="form-group">
                <label>Service Type</label>
                <select id="serviceType" required>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Rotation">Tire Rotation</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Engine Service">Engine Service</option>
                    <option value="General Maintenance">General Maintenance</option>
                    <option value="Repair">Repair</option>
                    <option value="Insurance Renewal">Insurance Renewal</option>
                    <option value="Tax/Registration">Tax/Registration</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date (BS)</label>
                <input type="text" id="serviceDate" value="${formatBsDate(today.year, today.month, today.day)}" required>
            </div>
            <div class="form-group">
                <label>Mileage (KM)</label>
                <input type="number" id="serviceMileage" required>
            </div>
            <div class="form-group">
                <label>Cost (NPR)</label>
                <input type="number" id="serviceCost" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Next Service Due (BS)</label>
                <input type="text" id="serviceNextDue" placeholder="Optional">
            </div>
            <div class="form-group">
                <label>Description/Notes</label>
                <textarea id="serviceDescription"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
            </div>
        </form>
    `;

    showModal(html);

    // Initialize Nepali date pickers for service dates
    setTimeout(() => {
        const serviceDateInput = document.getElementById('serviceDate');
        const serviceNextDueInput = document.getElementById('serviceNextDue');
        
        if (serviceDateInput && !serviceDateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(serviceDateInput);
        }
        
        if (serviceNextDueInput && !serviceNextDueInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(serviceNextDueInput);
        }
    }, 100);

    document.getElementById('serviceForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            vehicleId: vehicleId,
            type: document.getElementById('serviceType').value,
            date: document.getElementById('serviceDate').value,
            mileage: parseFloat(document.getElementById('serviceMileage').value),
            cost: parseFloat(document.getElementById('serviceCost').value),
            nextDue: document.getElementById('serviceNextDue').value,
            description: document.getElementById('serviceDescription').value,
            createdAt: new Date().toISOString()
        };

        try {
            await enhancedVehicleServiceDB.add(data);
            
            // Add to expenses
            await enhancedExpenseDB.add({
                date_bs: data.date,
                category: 'Vehicle',
                amount: data.cost,
                currency: 'NPR',
                description: `${data.type} - Vehicle Service`,
                source: 'vehicle',
                createdAt: new Date().toISOString()
            });

            // Record payment history for insurance/registration renewals
            const renewalTypes = ['Insurance Renewal', 'Tax/Registration'];
            if (typeof NotificationManager !== 'undefined' && renewalTypes.includes(data.type)) {
                const vehicle = await enhancedVehicleDB.get(vehicleId);
                await NotificationManager.notifyRenewal({
                    type: 'VEHICLE',
                    item: { ...vehicle, name: `${vehicle.name} — ${data.type}` },
                    newDueDateBs: data.nextDue || data.date,
                    amount: data.cost,
                    currency: 'NPR',
                });
            }

            closeModal();
            showServiceHistory(vehicleId);
            safeShowNotification('Service record added!', 'success');
        } catch (error) {
            console.error('Error adding service:', error);
            if (typeof showNotification === 'function') {
                showNotification('Error adding service record.', 'error');
            } else {
                alert('Error adding service record.');
            }
        }
    });
}

/**
 * Delete service
 */
async function deleteService(id) {
    if (!confirm('Delete this service record?')) return;
    try {
        await enhancedVehicleServiceDB.delete(id);
        alert('Service deleted!');
        closeModal();
    } catch (error) {
        console.error('Error deleting service:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error deleting service record.', 'error');
        } else {
            alert('Error deleting service.');
        }
    }
}

/**
 * Add fuel expense
 */
async function addFuelExpense(vehicleId) {
    const vehicle = await enhancedVehicleDB.get(vehicleId);
    const today = getCurrentNepaliDate();

    const html = `
        <h2>⛽ Add Fuel Expense - ${vehicle.name}</h2>
        <form id="fuelForm">
            <div class="form-group">
                <label>Date (BS)</label>
                <input type="text" id="fuelDate" value="${formatBsDate(today.year, today.month, today.day)}" required>
            </div>
            <div class="form-group">
                <label>Fuel Amount (Liters)</label>
                <input type="number" id="fuelAmount" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Price per Liter (NPR)</label>
                <input type="number" id="fuelPrice" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Total Cost (NPR)</label>
                <input type="number" id="fuelTotalCost" readonly>
            </div>
            <div class="form-group">
                <label>Current Mileage (KM)</label>
                <input type="number" id="fuelMileage">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Add Fuel</button>
            </div>
        </form>
    `;

    showModal(html);

    // Auto-calculate total
    const amountInput = document.getElementById('fuelAmount');
    const priceInput = document.getElementById('fuelPrice');
    const totalInput = document.getElementById('fuelTotalCost');

    const calculateTotal = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        totalInput.value = (amount * price).toFixed(2);
    };

    amountInput.addEventListener('input', calculateTotal);
    priceInput.addEventListener('input', calculateTotal);
    
    // Initialize Nepali date picker for fuel date
    setTimeout(() => {
        const dateInput = document.getElementById('fuelDate');
        if (dateInput && !dateInput.hasAttribute('data-nepali-picker')) {
            new NepaliDatePicker(dateInput);
        }
    }, 100);

    document.getElementById('fuelForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const totalCost = parseFloat(document.getElementById('fuelTotalCost').value);
        const mileage = document.getElementById('fuelMileage').value;

        try {
            await enhancedExpenseDB.add({
                date_bs: document.getElementById('fuelDate').value,
                category: 'Fuel',
                amount: totalCost,
                currency: 'NPR',
                description: `Fuel for ${vehicle.name} (${document.getElementById('fuelAmount').value}L)`,
                source: 'vehicle',
                createdAt: new Date().toISOString()
            });

            // Update mileage if provided
            if (mileage) {
                vehicle.mileage = parseFloat(mileage);
                await enhancedVehicleDB.update(vehicle);
            }

            closeModal();
            renderVehicleGrid();
            safeShowNotification('Fuel expense added!', 'success');
        } catch (error) {
            console.error('Error adding fuel:', error);
            alert('Error adding fuel expense.');
        }
    });
}

/**
 * Update mileage
 */
async function updateMileage(vehicleId) {
    const vehicle = await enhancedVehicleDB.get(vehicleId);

    const newMileage = prompt(`Enter current mileage for ${vehicle.name} (KM):`, vehicle.mileage);
    if (!newMileage || isNaN(newMileage)) return;

    vehicle.mileage = parseFloat(newMileage);
    await enhancedVehicleDB.update(vehicle);
    renderVehicleGrid();
    safeShowNotification('Mileage updated!', 'success');
}

/**
 * Delete vehicle
 */
async function deleteVehicle(id) {
    if (!confirm('Delete this vehicle? This will also delete all service records.')) return;

    try {
        const services = await enhancedVehicleServiceDB.getByIndex('vehicleId', id);
        for (const service of services) {
            await enhancedVehicleServiceDB.delete(service.id);
        }

        await enhancedVehicleDB.delete(id);
        renderVehicleGrid();
        safeShowNotification('Vehicle deleted!', 'success');
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        safeShowNotification('Error deleting vehicle.', 'error');
    }
}

// Initialize vehicle grid when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🐛 DEBUG: DOMContentLoaded, checking if vehicle view needs initialization');
    
    // Check if we're on the vehicle view
    const vehicleModule = safeGetElementById('vehicleModule');
    if (vehicleModule && vehicleModule.classList.contains('active')) {
        console.log('🐛 DEBUG: Vehicle module is active, initializing renderVehicleGrid');
        await renderVehicleGrid();
    } else {
        console.log('🐛 DEBUG: Vehicle module is not active, skipping initialization');
    }
});

// Also try to initialize after a short delay to ensure everything is loaded
setTimeout(async () => {
    console.log('🐛 DEBUG: Delayed initialization check for vehicle');
    const vehicleModule = document.getElementById('vehicleModule');
    if (vehicleModule && vehicleModule.classList.contains('active')) {
        console.log('🐛 DEBUG: Delayed - Vehicle module is active, initializing renderVehicleGrid');
        await renderVehicleGrid();
    }
}, 1000);