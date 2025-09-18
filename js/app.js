// ShikshaPlay - Main Application JavaScript

// Global state
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Load current user
    currentUser = userManager.getCurrentUser();
    
    // Update UI based on user status
    updateUserInterface();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for saved quiz progress
    checkSavedQuizProgress();
    
    console.log('ShikshaPlay initialized successfully!');
}

// Update user interface based on login status
function updateUserInterface() {
    const authNav = document.getElementById('auth-nav');
    const userProfile = document.getElementById('user-profile');
    const userNameElement = document.getElementById('user-name');
    const userPointsElement = document.getElementById('user-points');
    
    if (currentUser) {
        // User is logged in
        if (authNav) authNav.classList.add('d-none');
        if (userProfile) userProfile.classList.remove('d-none');
        
        // Update user info in various elements
        updateUserInfoElements();
        
        console.log('User interface updated for:', currentUser.name);
    } else {
        // User is not logged in
        if (authNav) authNav.classList.remove('d-none');
        if (userProfile) userProfile.classList.add('d-none');
    }
}

// Update user info in UI elements
function updateUserInfoElements() {
    if (!currentUser) return;
    
    // Update user name
    const userNameElements = document.querySelectorAll('#user-name, #currentUser, #userNameDisplay');
    userNameElements.forEach(element => {
        if (element) element.textContent = currentUser.name;
    });
    
    // Update user points
    const userPointsElements = document.querySelectorAll('#user-points, #currentPoints, #userPoints, #totalUserPoints, #userPointsDisplay');
    userPointsElements.forEach(element => {
        if (element) element.textContent = `${currentUser.totalPoints} points`;
    });
    
    // Update user class
    const userClassElements = document.querySelectorAll('#userClassDisplay');
    userClassElements.forEach(element => {
        if (element) element.textContent = currentUser.class;
    });
    
    // Update badge count
    const userBadgeElements = document.querySelectorAll('#userBadgesDisplay');
    userBadgeElements.forEach(element => {
        if (element) element.textContent = `${currentUser.badges.length} badges`;
    });
}

// Set up global event listeners
function setupEventListeners() {
    // Handle navigation clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('[onclick]')) {
            // Let onclick handlers work naturally
            return;
        }
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.id === 'loginForm' || form.id === 'registerForm') {
            // These are handled by specific functions
            return;
        }
    });
}

// Check for saved quiz progress
function checkSavedQuizProgress() {
    const savedProgress = quizProgressManager.getCurrentProgress();
    if (savedProgress && currentUser) {
        const shouldResume = confirm(
            `You have an unfinished quiz in ${savedProgress.subject}. Would you like to continue where you left off?`
        );
        
        if (shouldResume) {
            // Redirect to quiz page to resume
            window.location.href = 'quiz.html';
        } else {
            // Clear the saved progress
            quizProgressManager.clearProgress();
        }
    }
}

// Navigation functions
function startLearning() {
    if (currentUser) {
        window.location.href = 'quiz.html';
    } else {
        window.location.href = 'login.html';
    }
}

function viewLeaderboard() {
    window.location.href = 'leaderboard.html';
}

function goHome() {
    window.location.href = 'index.html';
}

function takeQuiz() {
    if (currentUser) {
        window.location.href = 'quiz.html';
    } else {
        showAlert('Please login first to take a quiz!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Logout function
function logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        userManager.logout();
        currentUser = null;
        
        showAlert('You have been logged out successfully!', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Utility function to show alerts
function showAlert(message, type = 'info', duration = 4000) {
    const alertContainer = document.getElementById('alertContainer') || document.body;
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show animate__animated animate__fadeInDown`;
    alertElement.style.position = 'fixed';
    alertElement.style.top = '20px';
    alertElement.style.right = '20px';
    alertElement.style.zIndex = '9999';
    alertElement.style.minWidth = '300px';
    
    alertElement.innerHTML = `
        <strong>${getAlertIcon(type)}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertElement);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.classList.add('animate__fadeOutUp');
            setTimeout(() => {
                if (alertElement.parentNode) {
                    alertElement.parentNode.removeChild(alertElement);
                }
            }, 500);
        }
    }, duration);
}

// Get alert icon based on type
function getAlertIcon(type) {
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        danger: '<i class="fas fa-times-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    return icons[type] || icons.info;
}

// Loading overlay functions
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const messageElement = overlay.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        overlay.classList.remove('d-none');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('d-none');
    }
}

// Animation helper functions
function animateElement(element, animationClass, callback) {
    if (!element) return;
    
    element.classList.add('animate__animated', animationClass);
    
    element.addEventListener('animationend', function handler() {
        element.removeEventListener('animationend', handler);
        element.classList.remove('animate__animated', animationClass);
        if (callback) callback();
    });
}

function animateScore(element, targetValue, duration = 2000) {
    if (!element) return;
    
    const startValue = 0;
    const increment = targetValue / (duration / 16); // 60 FPS
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentValue);
    }, 16);
}

// Confetti animation
function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// Sound effects (using Web Audio API or simple audio elements)
function playSound(type) {
    // This is a placeholder for sound effects
    // In a real implementation, you would load and play audio files
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        let frequency;
        switch (type) {
            case 'correct':
                frequency = 800; // High, pleasant tone
                break;
            case 'incorrect':
                frequency = 300; // Lower tone
                break;
            case 'success':
                frequency = 1000; // Very high, celebratory tone
                break;
            default:
                frequency = 500;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        // Fallback: just log the sound type
        console.log('Sound effect:', type);
    }
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Format time helper
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
        return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
}

// Format percentage helper
function formatPercentage(value) {
    return Math.round(value * 100) / 100;
}

// Responsive image loading
function loadImage(src, callback) {
    const img = new Image();
    img.onload = () => callback(null, img);
    img.onerror = () => callback(new Error('Failed to load image'));
    img.src = src;
}

// Debounce function for search/filter inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if user is on mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Smooth scroll to element
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((resolve, reject) => {
            document.execCommand('copy') ? resolve() : reject();
            textArea.remove();
        });
    }
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showAlert('Something went wrong. Please try again.', 'danger');
});

// Prevent right-click and other shortcuts (optional security measure)
// Uncomment if you want to prevent cheating
/*
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});
*/

// Export functions for global access
window.startLearning = startLearning;
window.viewLeaderboard = viewLeaderboard;
window.goHome = goHome;
window.takeQuiz = takeQuiz;
window.logout = logout;
window.showAlert = showAlert;
window.showLoadingOverlay = showLoadingOverlay;
window.hideLoadingOverlay = hideLoadingOverlay;
window.animateElement = animateElement;
window.animateScore = animateScore;
window.createConfetti = createConfetti;
window.playSound = playSound;
window.formatTime = formatTime;
window.formatPercentage = formatPercentage;
window.copyToClipboard = copyToClipboard;