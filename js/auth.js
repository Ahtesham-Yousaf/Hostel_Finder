// ====================
// AUTHENTICATION
// ====================

document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initRegisterForm();
    initLogout();
    checkAuthStatus();
});

// Initialize login form
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const forgotPassword = document.getElementById('forgotPassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
    
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
}

// Initialize registration form
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const roleOptions = document.querySelectorAll('.role-option');
    const nextStepBtn = document.getElementById('nextStep1');
    const prevStepBtn = document.getElementById('prevStep2');
    
    // Role selection
    if (roleOptions) {
        roleOptions.forEach(option => {
            option.addEventListener('click', function() {
                roleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('userRole').value = this.dataset.role;
                
                // Show/hide additional fields
                const role = this.dataset.role;
                const studentFields = document.getElementById('studentFields');
                const wardenFields = document.getElementById('wardenFields');
                
                if (studentFields && wardenFields) {
                    if (role === 'student') {
                        studentFields.style.display = 'block';
                        wardenFields.style.display = 'none';
                    } else if (role === 'warden') {
                        studentFields.style.display = 'none';
                        wardenFields.style.display = 'block';
                    }
                }
            });
        });
    }
    
    // Step navigation
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', function() {
            const selectedRole = document.getElementById('userRole').value;
            if (!selectedRole) {
                showToast('Please select your role', 'warning');
                return;
            }
            
            // Go to step 2
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
        });
    }
    
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', function() {
            // Go back to step 1
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step1').classList.add('active');
        });
    }
    
    // Registration form submit
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration(this);
        });
    }
}

// Initialize logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Handle login
function handleLogin(form) {
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;
    const rememberMe = form.querySelector('#rememberMe').checked;
    
    // Demo credentials check
    const demoCredentials = {
        'student@test.com': { password: 'password123', role: 'student', name: 'Ahmed Khan' },
        'warden@test.com': { password: 'password123', role: 'warden', name: 'Mr. Warden' }
    };
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (demoCredentials[email] && demoCredentials[email].password === password) {
            // Successful login
            const user = demoCredentials[email];
            
            // Save user session
            saveUserSession({
                email: email,
                name: user.name,
                role: user.role,
                rememberMe: rememberMe
            });
            
            showToast('Login successful!', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'student') {
                    window.location.href = 'dashboard.html';
                } else if (user.role === 'warden') {
                    window.location.href = 'wardon_dashboard.html';
                }
            }, 1000);
            
        } else {
            // Failed login
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast('Invalid email or password', 'error');
            
            // Add error styling
            form.querySelector('#loginEmail').classList.add('error');
            form.querySelector('#loginPassword').classList.add('error');
        }
    }, 1500);
}

// Handle registration
function handleRegistration(form) {
    const formData = {
        firstName: form.querySelector('#firstName').value,
        lastName: form.querySelector('#lastName').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        password: form.querySelector('#password').value,
        confirmPassword: form.querySelector('#confirmPassword').value,
        role: document.getElementById('userRole').value,
        terms: form.querySelector('#terms').checked
    };
    
    // Validation
    if (!validateRegistration(formData)) {
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save user data (in real app, this would go to backend)
        const userData = {
            id: generateUserId(),
            ...formData,
            createdAt: new Date().toISOString(),
            verified: false
        };
        
        // Save to localStorage (temporary)
        saveUserToLocalStorage(userData);
        
        // Auto-login the user
        saveUserSession({
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role
        });
        
        // Show success and go to step 3
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
        
    }, 2000);
}

// Handle forgot password
function handleForgotPassword() {
    const email = prompt('Please enter your email address to reset password:');
    if (email) {
        if (isValidEmail(email)) {
            showToast('Password reset instructions sent to your email', 'success');
        } else {
            showToast('Please enter a valid email address', 'error');
        }
    }
}

// Handle logout
function handleLogout() {
    // Clear user session
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Redirect to login page
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Validate registration data
function validateRegistration(data) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    // Password validation
    if (data.password.length < 8) {
        showFieldError('password', 'Password must be at least 8 characters');
        isValid = false;
    }
    
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Email validation
    if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (!isValidPhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Terms agreement
    if (!data.terms) {
        showToast('You must agree to the terms and conditions', 'warning');
        isValid = false;
    }
    
    // Role-specific validation
    if (data.role === 'student') {
        const gender = document.querySelector('input[name="gender"]:checked');
        if (!gender) {
            showToast('Please select your gender', 'warning');
            isValid = false;
        }
    } else if (data.role === 'warden') {
        const cnic = document.getElementById('cnic');
        if (cnic && !isValidCNIC(cnic.value)) {
            showFieldError('cnic', 'Please enter a valid CNIC');
            isValid = false;
        }
    }
    
    return isValid;
}

// Save user session
function saveUserSession(user) {
    const sessionData = {
        ...user,
        loggedInAt: new Date().toISOString(),
        token: generateToken()
    };
    
    if (user.rememberMe) {
        // Save to localStorage (persists across sessions)
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
    } else {
        // Save to sessionStorage (clears when browser closes)
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    }
    
    // Also save to users list (for demo purposes)
    saveUserToUsersList(sessionData);
}

// Save user to localStorage (demo only)
function saveUserToLocalStorage(user) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Save user to users list
function saveUserToUsersList(user) {
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    
    // Check if user already exists
    const existingUserIndex = allUsers.findIndex(u => u.email === user.email);
    if (existingUserIndex !== -1) {
        allUsers[existingUserIndex] = user;
    } else {
        allUsers.push(user);
    }
    
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
}

// Check authentication status
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // User is logged in
        updateUIForLoggedInUser(currentUser);
        
        // Protect routes if needed
        protectRoutes(currentUser);
    } else {
        // User is not logged in
        updateUIForLoggedOutUser();
    }
}

// Get current user from storage
function getCurrentUser() {
    // Check sessionStorage first, then localStorage
    let user = sessionStorage.getItem('currentUser');
    if (!user) {
        user = localStorage.getItem('currentUser');
    }
    
    return user ? JSON.parse(user) : null;
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    // Update user menu if exists
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
    
    // Update profile info if on dashboard
    const profileName = document.querySelector('.user-profile h3');
    if (profileName) {
        profileName.textContent = user.name;
    }
    
    // Hide login/register buttons
    const loginButtons = document.querySelectorAll('a[href="login.html"], a[href="register.html"]');
    loginButtons.forEach(btn => {
        btn.style.display = 'none';
    });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    // Show login/register buttons
    const loginButtons = document.querySelectorAll('a[href="login.html"], a[href="register.html"]');
    loginButtons.forEach(btn => {
        btn.style.display = 'inline-flex';
    });
}

// Protect routes (e.g., dashboard pages)
function protectRoutes(user) {
    const protectedPaths = ['dashboard.html', 'wardon_dashboard.html', 'booking.html'];
    const currentPath = window.location.pathname;
    
    // Check if current page is protected
    const isProtected = protectedPaths.some(path => currentPath.includes(path));
    
    if (isProtected && !user) {
        // Redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Check role-based access
    if (currentPath.includes('wardon_dashboard.html') && user.role !== 'warden') {
        showToast('Access denied. Warden access required.', 'error');
        window.location.href = 'dashboard.html';
    }
    
    if (currentPath.includes('dashboard.html') && user.role !== 'student') {
        showToast('Access denied. Student access required.', 'error');
        window.location.href = 'wardon_dashboard.html';
    }
}

// Generate user ID
function generateUserId() {
    return 'USR' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

// Generate token (demo only)
function generateToken() {
    return 'tok_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Helper function from main.js
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

// Export auth functions
window.AuthManager = {
    getCurrentUser,
    handleLogout,
    checkAuthStatus,
    saveUserSession
};