// ShikshaPlay - Authentication JavaScript

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('#loginName').value.trim();
    const userClass = form.querySelector('#loginClass').value;
    
    // Validate inputs
    if (!validateLoginForm(name, userClass)) {
        return false;
    }
    
    try {
        showLoadingOverlay('Signing you in...');
        
        // Try to login user
        const user = userManager.loginUser(name, userClass);
        
        hideLoadingOverlay();
        showAlert(`Welcome back, ${user.name}! 🎉`, 'success');
        
        // Redirect to quiz page or home
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 1500);
        
    } catch (error) {
        hideLoadingOverlay();
        
        if (error.message.includes('not found')) {
            showAlert('User not found. Please register first or check your details.', 'warning');
            // Switch to register tab
            switchToRegisterTab();
        } else {
            showAlert('Login failed. Please try again.', 'danger');
        }
        
        console.error('Login error:', error);
    }
    
    return false;
}

// Handle register form submission
function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('#registerName').value.trim();
    const userClass = form.querySelector('#registerClass').value;
    const termsAccepted = form.querySelector('#termsCheck').checked;
    
    // Validate inputs
    if (!validateRegisterForm(name, userClass, termsAccepted)) {
        return false;
    }
    
    try {
        showLoadingOverlay('Creating your account...');
        
        // Create new user
        const user = userManager.createUser(name, userClass);
        
        hideLoadingOverlay();
        showAlert(`Welcome to ShikshaPlay, ${user.name}! 🎉 Let's start learning!`, 'success');
        
        // Show welcome animation
        showWelcomeAnimation();
        
        // Redirect to quiz page
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 2500);
        
    } catch (error) {
        hideLoadingOverlay();
        
        if (error.message.includes('already exists')) {
            showAlert('A user with this name and class already exists. Please try logging in instead.', 'warning');
            // Switch to login tab and pre-fill
            switchToLoginTab(name, userClass);
        } else {
            showAlert('Registration failed. Please try again.', 'danger');
        }
        
        console.error('Registration error:', error);
    }
    
    return false;
}

// Validate login form
function validateLoginForm(name, userClass) {
    const form = document.getElementById('loginForm');
    let isValid = true;
    
    // Clear previous validation
    clearValidation(form);
    
    // Validate name
    if (!name || name.length < 2) {
        showFieldError(form.querySelector('#loginName'), 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate class
    if (!userClass) {
        showFieldError(form.querySelector('#loginClass'), 'Please select your class');
        isValid = false;
    }
    
    return isValid;
}

// Validate register form
function validateRegisterForm(name, userClass, termsAccepted) {
    const form = document.getElementById('registerForm');
    let isValid = true;
    
    // Clear previous validation
    clearValidation(form);
    
    // Validate name
    if (!name || name.length < 2) {
        showFieldError(form.querySelector('#registerName'), 'Name must be at least 2 characters long');
        isValid = false;
    } else if (name.length > 50) {
        showFieldError(form.querySelector('#registerName'), 'Name must be less than 50 characters');
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        showFieldError(form.querySelector('#registerName'), 'Name should only contain letters and spaces');
        isValid = false;
    }
    
    // Validate class
    if (!userClass) {
        showFieldError(form.querySelector('#registerClass'), 'Please select your class');
        isValid = false;
    }
    
    // Validate terms
    if (!termsAccepted) {
        showFieldError(form.querySelector('#termsCheck'), 'Please agree to our learning guidelines');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    if (!field) return;
    
    field.classList.add('is-invalid');
    
    // Find or create feedback element
    let feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
}

// Clear validation
function clearValidation(form) {
    if (!form) return;
    
    // Remove is-invalid class from all fields
    const fields = form.querySelectorAll('.form-control, .form-select, .form-check-input');
    fields.forEach(field => {
        field.classList.remove('is-invalid');
    });
    
    // Hide all feedback messages
    const feedbacks = form.querySelectorAll('.invalid-feedback');
    feedbacks.forEach(feedback => {
        feedback.style.display = 'none';
    });
}

// Switch to register tab
function switchToRegisterTab() {
    const registerTab = document.getElementById('register-tab');
    if (registerTab) {
        registerTab.click();
        
        // Focus on the name field
        setTimeout(() => {
            const nameField = document.getElementById('registerName');
            if (nameField) nameField.focus();
        }, 300);
    }
}

// Switch to login tab and pre-fill
function switchToLoginTab(name = '', userClass = '') {
    const loginTab = document.getElementById('login-tab');
    if (loginTab) {
        loginTab.click();
        
        // Pre-fill form
        setTimeout(() => {
            const nameField = document.getElementById('loginName');
            const classField = document.getElementById('loginClass');
            
            if (nameField && name) nameField.value = name;
            if (classField && userClass) classField.value = userClass;
            
            // Focus on appropriate field
            if (name && userClass) {
                nameField.focus();
            } else {
                nameField.focus();
            }
        }, 300);
    }
}

// Show welcome animation
function showWelcomeAnimation() {
    // Create welcome modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'welcomeModal';
    modal.setAttribute('tabindex', '-1');
    modal.style.zIndex = '9999';
    
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-body text-center p-5">
                    <div class="welcome-animation animate__animated animate__bounceIn">
                        <i class="fas fa-rocket fa-5x text-primary mb-3"></i>
                    </div>
                    <h3 class="text-primary fw-bold mb-3">Welcome to ShikshaPlay!</h3>
                    <p class="text-muted mb-4">
                        Get ready for an amazing learning adventure! 
                        <br>You'll earn points, unlock badges, and have fun while learning!
                    </p>
                    <div class="welcome-features mt-4">
                        <div class="row g-3">
                            <div class="col-4">
                                <i class="fas fa-star fa-2x text-warning"></i>
                                <p class="small mt-2">Earn Points</p>
                            </div>
                            <div class="col-4">
                                <i class="fas fa-medal fa-2x text-success"></i>
                                <p class="small mt-2">Unlock Badges</p>
                            </div>
                            <div class="col-4">
                                <i class="fas fa-trophy fa-2x text-primary"></i>
                                <p class="small mt-2">Climb Leaderboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    const welcomeModal = new bootstrap.Modal(modal);
    welcomeModal.show();
    
    // Auto-close after 2 seconds
    setTimeout(() => {
        welcomeModal.hide();
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }, 2000);
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = userManager.getCurrentUser();
    
    if (currentUser && window.location.pathname.includes('login.html')) {
        // User is already logged in, redirect to quiz page
        showAlert(`Welcome back, ${currentUser.name}!`, 'info');
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 1500);
    }
    
    // Set up form event listeners
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Add real-time validation
    setupRealTimeValidation();
});

// Set up real-time validation
function setupRealTimeValidation() {
    // Login form validation
    const loginName = document.getElementById('loginName');
    const loginClass = document.getElementById('loginClass');
    
    if (loginName) {
        loginName.addEventListener('input', function() {
            if (this.value.trim().length >= 2) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
    
    if (loginClass) {
        loginClass.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
    
    // Register form validation
    const registerName = document.getElementById('registerName');
    const registerClass = document.getElementById('registerClass');
    const termsCheck = document.getElementById('termsCheck');
    
    if (registerName) {
        registerName.addEventListener('input', function() {
            const name = this.value.trim();
            if (name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name)) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
    
    if (registerClass) {
        registerClass.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
    
    if (termsCheck) {
        termsCheck.addEventListener('change', function() {
            if (this.checked) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    }
}

// Quick login for development/testing (can be removed in production)
function quickLogin(name = 'Test Student', userClass = 'Class 8') {
    if (confirm(`Quick login as "${name}" in "${userClass}"?`)) {
        try {
            let user;
            try {
                user = userManager.loginUser(name, userClass);
            } catch (error) {
                // If user doesn't exist, create them
                user = userManager.createUser(name, userClass);
            }
            
            showAlert(`Logged in as ${user.name}!`, 'success');
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 1000);
        } catch (error) {
            showAlert('Quick login failed', 'danger');
            console.error('Quick login error:', error);
        }
    }
}

// Guest mode (optional feature)
function enterGuestMode() {
    if (confirm('Enter as guest? You won\'t be able to save progress or earn badges.')) {
        // Create a temporary guest user
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Guest User',
            class: 'Guest',
            totalPoints: 0,
            badges: [],
            completedQuizzes: [],
            stats: {
                totalQuizzes: 0,
                totalCorrectAnswers: 0,
                totalQuestions: 0,
                averageScore: 0,
                subjectStats: {}
            },
            isGuest: true
        };
        
        userManager.setCurrentUser(guestUser);
        currentUser = guestUser;
        
        showAlert('Entered as guest! Your progress won\'t be saved.', 'info');
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 1500);
    }
}

// Export functions
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.quickLogin = quickLogin;
window.enterGuestMode = enterGuestMode;

// In userManager.createUser
function createUser(name, userClass) {
    const users = getUsers(); // get all users from storage
    const exists = users.some(u => u.name === name && u.class === userClass);
    if (exists) {
        throw new Error('User already exists');
    }
    // ...create and save user...
}