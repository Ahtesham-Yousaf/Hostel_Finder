// ====================
// BOOKING FUNCTIONALITY
// ====================

document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    initBookingSummary();
    initDatePicker();
    loadBookingData();
});

// Initialize booking form
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingDetailsForm = document.getElementById('bookingDetailsForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmit(this);
        });
    }
    
    if (bookingDetailsForm) {
        bookingDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingDetailsSubmit(this);
        });
    }
    
    // Update booking summary when form changes
    const formInputs = document.querySelectorAll('#bookingForm select, #bookingForm input');
    formInputs.forEach(input => {
        input.addEventListener('change', updateBookingSummary);
    });
}

// Initialize booking summary
function initBookingSummary() {
    updateBookingSummary();
}

// Initialize date picker
function initDatePicker() {
    const checkinDate = document.getElementById('checkinDate');
    if (checkinDate) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        checkinDate.min = today;
        
        // Set default to 7 days from today
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        checkinDate.value = defaultDate.toISOString().split('T')[0];
        
        // Update checkout date when checkin changes
        checkinDate.addEventListener('change', function() {
            updateCheckoutDate();
        });
    }
}

// Load booking data from localStorage
function loadBookingData() {
    const bookingData = JSON.parse(localStorage.getItem('currentBooking')) || {};
    
    // Pre-fill form if data exists
    if (bookingData.roomType) {
        const roomTypeSelect = document.getElementById('roomType');
        if (roomTypeSelect) {
            roomTypeSelect.value = bookingData.roomType;
        }
    }
    
    updateBookingSummary();
}

// Handle booking form submit
function handleBookingForm(form) {
    const formData = {
        roomType: form.querySelector('#roomType').value,
        checkinDate: form.querySelector('#checkinDate').value,
        duration: parseInt(form.querySelector('#duration').value),
        studentsCount: parseInt(form.querySelector('#studentsCount').value)
    };
    
    // Save to localStorage
    localStorage.setItem('currentBooking', JSON.stringify(formData));
    
    // Redirect to booking details page
    window.location.href = 'booking.html';
}

// Handle booking details submit
function handleBookingDetailsForm(form) {
    // Get all form data
    const formData = {
        firstName: form.querySelector('#firstName').value,
        lastName: form.querySelector('#lastName').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        cnic: form.querySelector('#cnic').value,
        university: form.querySelector('#university').value,
        studentId: form.querySelector('#studentId').value,
        emergencyName: form.querySelector('#emergencyName').value,
        emergencyPhone: form.querySelector('#emergencyPhone').value,
        specialRequests: form.querySelector('#specialRequests').value
    };
    
    // Validate form
    if (!validateBookingForm(formData)) {
        return;
    }
    
    // Combine with booking data
    const bookingData = JSON.parse(localStorage.getItem('currentBooking')) || {};
    const completeBooking = {
        ...bookingData,
        ...formData,
        bookingId: generateBookingId(),
        bookingDate: new Date().toISOString(),
        status: 'pending',
        totalAmount: calculateTotalAmount(bookingData)
    };
    
    // Save complete booking
    localStorage.setItem('currentBooking', JSON.stringify(completeBooking));
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save to bookings list
        saveBookingToHistory(completeBooking);
        
        // Redirect to success page (or payment page)
        window.location.href = 'booking-success.html';
    }, 1500);
}

// Validate booking form
function validateBookingForm(formData) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Email validation
    if (!isValidEmail(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (Pakistani format)
    if (!isValidPhone(formData.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // CNIC validation (XXXXX-XXXXXXX-X)
    if (!isValidCNIC(formData.cnic)) {
        showFieldError('cnic', 'Please enter a valid CNIC (XXXXX-XXXXXXX-X)');
        isValid = false;
    }
    
    // Emergency phone validation
    if (!isValidPhone(formData.emergencyPhone)) {
        showFieldError('emergencyPhone', 'Please enter a valid emergency phone number');
        isValid = false;
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (Pakistani)
function isValidPhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// CNIC validation
function isValidCNIC(cnic) {
    const re = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
    return re.test(cnic);
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger mt-1';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.focus();
}

// Clear all form errors
function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// Update booking summary
function updateBookingSummary() {
    const roomType = document.getElementById('roomType')?.value || 'double';
    const duration = parseInt(document.getElementById('duration')?.value) || 3;
    const studentsCount = parseInt(document.getElementById('studentsCount')?.value) || 1;
    
    // Calculate amounts based on room type
    const roomRates = {
        'single': 12000,
        'double': 8000,
        'triple': 6500
    };
    
    const roomRate = roomRates[roomType] || 8000;
    const roomRent = roomRate * duration;
    const securityDeposit = 5000;
    const serviceFee = 500;
    const totalAmount = roomRent + securityDeposit + serviceFee;
    
    // Update summary display
    updateSummaryItem('Room Rent', roomRent, duration);
    updateSummaryItem('Security Deposit', securityDeposit);
    updateSummaryItem('Service Fee', serviceFee);
    updateTotalAmount(totalAmount);
    
    // Save to localStorage
    const bookingData = {
        roomType,
        duration,
        studentsCount,
        roomRent,
        securityDeposit,
        serviceFee,
        totalAmount
    };
    
    localStorage.setItem('bookingSummary', JSON.stringify(bookingData));
}

// Update summary item
function updateSummaryItem(label, amount, months = 1) {
    const item = document.querySelector(`.summary-item:has(span:contains("${label}"))`);
    if (item) {
        const amountSpan = item.querySelector('span:last-child');
        if (amountSpan) {
            amountSpan.textContent = `₨ ${amount.toLocaleString()}`;
            if (months > 1) {
                item.querySelector('span:first-child').textContent = `${label} (${months} months)`;
            }
        }
    }
}

// Update total amount
function updateTotalAmount(amount) {
    const totalElement = document.querySelector('.summary-total span:last-child');
    if (totalElement) {
        totalElement.textContent = `₨ ${amount.toLocaleString()}`;
    }
}

// Calculate total amount
function calculateTotalAmount(bookingData) {
    const roomRates = {
        'single': 12000,
        'double': 8000,
        'triple': 6500
    };
    
    const roomRate = roomRates[bookingData.roomType] || 8000;
    return (roomRate * bookingData.duration) + 5000 + 500; // room rent + deposit + fee
}

// Update checkout date
function updateCheckoutDate() {
    const checkinDate = document.getElementById('checkinDate');
    const duration = document.getElementById('duration');
    
    if (!checkinDate || !duration) return;
    
    const checkin = new Date(checkinDate.value);
    const months = parseInt(duration.value);
    
    const checkout = new Date(checkin);
    checkout.setMonth(checkout.getMonth() + months);
    
    // Format date as YYYY-MM-DD
    const checkoutStr = checkout.toISOString().split('T')[0];
    
    // Update checkout display if exists
    const checkoutElement = document.getElementById('checkoutDate');
    if (checkoutElement) {
        checkoutElement.textContent = formatDate(checkoutStr);
    }
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate booking ID
function generateBookingId() {
    return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

// Save booking to history
function saveBookingToHistory(booking) {
    // Get existing bookings
    let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
    
    // Add new booking
    bookings.push(booking);
    
    // Save back to localStorage
    localStorage.setItem('userBookings', JSON.stringify(bookings));
    
    // Also save to all bookings (for warden view)
    saveToAllBookings(booking);
}

// Save to all bookings (for warden access)
function saveToAllBookings(booking) {
    let allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];
    allBookings.push({
        ...booking,
        hostelId: 'hv001', // Default to Green View Hostel
        hostelName: 'Green View Hostel'
    });
    localStorage.setItem('allBookings', JSON.stringify(allBookings));
}

// Load user bookings for dashboard
function loadUserBookings() {
    const bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
    return bookings;
}

// Load hostel bookings for warden
function loadHostelBookings(hostelId) {
    const allBookings = JSON.parse(localStorage.getItem('allBookings')) || [];
    return allBookings.filter(booking => booking.hostelId === hostelId);
}

// Export functions for use in other files
window.BookingManager = {
    loadUserBookings,
    loadHostelBookings,
    updateBookingSummary,
    validateBookingForm
};