// ShikshaPlay - Leaderboard JavaScript

let currentFilter = 'all';
let currentUser = null;

// Initialize leaderboard page
document.addEventListener('DOMContentLoaded', function() {
    initializeLeaderboardPage();
});

// Initialize leaderboard page functionality
function initializeLeaderboardPage() {
    // Load current user
    currentUser = userManager.getCurrentUser();
    
    if (currentUser) {
        updateUserInfo(currentUser);
        updateCurrentUserSection(currentUser);
    } else {
        hideUserSpecificSections();
    }
    
    // Load and display leaderboard
    loadLeaderboard();
    
    // Set up event listeners
    setupEventListeners();
}

// Update user information in UI
function updateUserInfo(user) {
    const userElements = ['currentUser', 'userPoints'];
    userElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id.includes('Points')) {
                element.textContent = `${user.totalPoints} points`;
            } else {
                element.textContent = user.name;
            }
        }
    });
}

// Update current user section
function updateCurrentUserSection(user) {
    const userRankElement = document.getElementById('userRank');
    const userNameDisplayElement = document.getElementById('userNameDisplay');
    const userClassDisplayElement = document.getElementById('userClassDisplay');
    const userPointsDisplayElement = document.getElementById('userPointsDisplay');
    const userBadgesDisplayElement = document.getElementById('userBadgesDisplay');
    
    // Get user rank
    const userRank = leaderboardManager.getUserRank(user.id, currentFilter, user.class);
    
    if (userRankElement) {
        userRankElement.textContent = userRank > 0 ? `#${userRank}` : '#--';
    }
    
    if (userNameDisplayElement) {
        userNameDisplayElement.textContent = user.name;
    }
    
    if (userClassDisplayElement) {
        userClassDisplayElement.textContent = user.class;
    }
    
    if (userPointsDisplayElement) {
        userPointsDisplayElement.textContent = `${user.totalPoints} points`;
    }
    
    if (userBadgesDisplayElement) {
        userBadgesDisplayElement.textContent = `${user.badges.length} badges`;
    }
}

// Hide user-specific sections for non-logged-in users
function hideUserSpecificSections() {
    const currentUserSection = document.getElementById('currentUserSection');
    if (currentUserSection) {
        currentUserSection.classList.add('d-none');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Filter buttons are handled by onclick in HTML
    // Add any additional listeners here if needed
}

// Load and display leaderboard
function loadLeaderboard() {
    showLoadingOverlay('Loading leaderboard...');
    
    setTimeout(() => {
        const leaderboardData = leaderboardManager.getLeaderboard(
            currentFilter, 
            currentUser ? currentUser.class : null
        );
        
        displayLeaderboard(leaderboardData);
        displayTopPerformers(leaderboardData);
        
        hideLoadingOverlay();
    }, 1000);
}

// Display top performers podium
function displayTopPerformers(leaderboardData) {
    const topThree = leaderboardData.slice(0, 3);
    
    // Clear podium
    const positions = ['first', 'second', 'third'];
    positions.forEach(position => {
        document.getElementById(`${position}-name`).textContent = '-';
        document.getElementById(`${position}-class`).textContent = '-';
        document.getElementById(`${position}-points`).textContent = '0 pts';
    });
    
    // Fill podium with top performers
    topThree.forEach((performer, index) => {
        const position = positions[index];
        const nameElement = document.getElementById(`${position}-name`);
        const classElement = document.getElementById(`${position}-class`);
        const pointsElement = document.getElementById(`${position}-points`);
        
        if (nameElement) nameElement.textContent = performer.userName;
        if (classElement) classElement.textContent = performer.userClass;
        if (pointsElement) pointsElement.textContent = `${performer.totalPoints} pts`;
    });
    
    // Show/hide podium based on data availability
    const podiumSection = document.getElementById('podiumSection');
    if (podiumSection) {
        if (topThree.length > 0) {
            podiumSection.classList.remove('d-none');
        } else {
            podiumSection.classList.add('d-none');
        }
    }
}

// Display complete leaderboard table
function displayLeaderboard(leaderboardData) {
    const tableBody = document.getElementById('leaderboardTable');
    if (!tableBody) return;
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    if (leaderboardData.length === 0) {
        // Show empty state
        showEmptyLeaderboard();
        return;
    }
    
    // Create table rows
    leaderboardData.forEach((entry, index) => {
        const row = createLeaderboardRow(entry, index);
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            animateElement(row, 'animate__fadeInUp');
        }, index * 100);
    });
}

// Create leaderboard table row
function createLeaderboardRow(entry, index) {
    const row = document.createElement('tr');
    
    // Highlight current user's row
    if (currentUser && entry.userId === currentUser.id) {
        row.classList.add('user-row');
    }
    
    // Add hover effect
    row.classList.add('table-row-hover');
    
    row.innerHTML = `
        <td class="text-center">
            <span class="rank-badge ${getRankBadgeClass(entry.rank)}">
                ${getRankDisplay(entry.rank)}
            </span>
        </td>
        <td>
            <div class="d-flex align-items-center">
                <div class="user-avatar me-2">
                    ${getUserAvatar(entry.userName)}
                </div>
                <div>
                    <div class="fw-bold">${entry.userName}</div>
                    ${entry.userId === currentUser?.id ? '<small class="text-primary">(You)</small>' : ''}
                </div>
            </div>
        </td>
        <td>
            <span class="badge bg-light text-dark">${entry.userClass}</span>
        </td>
        <td class="text-center">
            <span class="badge bg-primary fs-6">${entry.totalPoints}</span>
        </td>
        <td class="text-center">
            <span class="badge bg-warning text-dark">${entry.badgeCount}</span>
        </td>
        <td class="text-center">
            <div class="progress" style="height: 20px;">
                <div class="progress-bar" style="width: ${getProgressWidth(entry.totalPoints)}%">
                    ${Math.round(entry.totalPoints / 10)}%
                </div>
            </div>
        </td>
    `;
    
    return row;
}

// Get rank badge class based on position
function getRankBadgeClass(rank) {
    if (rank === 1) return 'badge bg-warning text-dark';
    if (rank === 2) return 'badge bg-secondary';
    if (rank === 3) return 'badge bg-warning';
    if (rank <= 10) return 'badge bg-primary';
    return 'badge bg-light text-dark';
}

// Get rank display with icons
function getRankDisplay(rank) {
    if (rank === 1) return '🏆 1';
    if (rank === 2) return '🥈 2';
    if (rank === 3) return '🥉 3';
    return rank;
}

// Get user avatar (simple initial-based avatar)
function getUserAvatar(userName) {
    const initial = userName.charAt(0).toUpperCase();
    const colors = ['primary', 'success', 'warning', 'info', 'secondary'];
    const colorIndex = userName.length % colors.length;
    const color = colors[colorIndex];
    
    return `<div class="rounded-circle bg-${color} text-white d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 14px; font-weight: bold;">${initial}</div>`;
}

// Calculate progress width for progress bar
function getProgressWidth(points) {
    const maxPoints = 1000; // Adjust based on your point system
    return Math.min((points / maxPoints) * 100, 100);
}

// Show empty leaderboard state
function showEmptyLeaderboard() {
    const tableBody = document.getElementById('leaderboardTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center p-5">
                <div class="empty-state">
                    <i class="fas fa-users-slash fa-4x text-muted mb-3"></i>
                    <h5 class="text-muted">No students found</h5>
                    <p class="text-muted">Be the first to start learning and climb the leaderboard!</p>
                    <button class="btn btn-primary" onclick="takeQuiz()">
                        <i class="fas fa-rocket"></i> Start Learning
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Filter leaderboard
function filterLeaderboard(filterType) {
    currentFilter = filterType;
    
    // Update filter button states
    const filterButtons = document.querySelectorAll('input[name="filterType"]');
    filterButtons.forEach(button => {
        if (button.id === `filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`) {
            button.checked = true;
        }
    });
    
    // Update current user section if needed
    if (currentUser) {
        updateCurrentUserSection(currentUser);
    }
    
    // Reload leaderboard with new filter
    loadLeaderboard();
    
    // Show filter feedback
    const filterNames = {
        all: 'All Students',
        class: 'Your Class',
        week: 'This Week'
    };
    showAlert(`Showing: ${filterNames[filterType]}`, 'info', 2000);
}

// Refresh leaderboard
function refreshLeaderboard() {
    showLoadingOverlay('Refreshing leaderboard...');
    
    // Simulate refresh delay
    setTimeout(() => {
        loadLeaderboard();
        showAlert('Leaderboard refreshed!', 'success', 2000);
    }, 1000);
}

// Take quiz (navigation)
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

// View user profile (future feature)
function viewUserProfile(userId) {
    showAlert('User profiles coming soon! 👤', 'info');
    // In the future, this could show detailed user statistics
}

// Challenge user (future feature)
function challengeUser(userId) {
    showAlert('Challenge feature coming soon! ⚔️', 'info');
    // In the future, this could allow users to challenge each other
}

// Export leaderboard data (future feature)
function exportLeaderboard() {
    showAlert('Export feature coming soon! 📊', 'info');
    // In the future, this could export leaderboard as CSV or PDF
}

// Auto-refresh leaderboard every 5 minutes
setInterval(() => {
    if (document.visibilityState === 'visible') {
        console.log('Auto-refreshing leaderboard...');
        loadLeaderboard();
    }
}, 300000); // 5 minutes

// Handle visibility change to refresh when user returns
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, refresh leaderboard
        setTimeout(() => {
            loadLeaderboard();
        }, 1000);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // R key for refresh
    if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey) { // Avoid interfering with browser refresh
            e.preventDefault();
            refreshLeaderboard();
        }
    }
    
    // Q key for quiz
    if (e.key === 'q' || e.key === 'Q') {
        takeQuiz();
    }
    
    // Number keys for filters
    if (e.key === '1') {
        filterLeaderboard('all');
    } else if (e.key === '2') {
        filterLeaderboard('class');
    } else if (e.key === '3') {
        filterLeaderboard('week');
    }
});

// Smooth scroll to user's position in leaderboard
function scrollToUser() {
    if (!currentUser) return;
    
    const userRow = document.querySelector('.user-row');
    if (userRow) {
        userRow.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Highlight user row temporarily
        userRow.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            userRow.classList.remove('animate__animated', 'animate__pulse');
        }, 2000);
    }
}

// Share leaderboard achievement
function shareLeaderboard() {
    if (!currentUser) {
        showAlert('Please login to share your achievement!', 'warning');
        return;
    }
    
    const userRank = leaderboardManager.getUserRank(currentUser.id, currentFilter, currentUser.class);
    
    if (userRank > 0) {
        const shareText = `🎯 I'm ranked #${userRank} on the ShikshaPlay leaderboard with ${currentUser.totalPoints} points! 🏆\n\nJoin me in this fun learning adventure! 📚✨\n\n#ShikshaPlay #Learning #Leaderboard`;
        
        copyToClipboard(shareText)
            .then(() => {
                showAlert('Achievement shared to clipboard! 📋', 'success');
            })
            .catch(() => {
                showAlert('Failed to copy. Please try again.', 'danger');
            });
    } else {
        showAlert('Complete a quiz first to share your ranking!', 'info');
    }
}

// Add CSS for table row hover effect
const style = document.createElement('style');
style.textContent = `
    .table-row-hover:hover {
        background-color: rgba(0, 123, 255, 0.05) !important;
        transform: scale(1.01);
        transition: all 0.2s ease;
        cursor: pointer;
    }
    
    .rank-badge {
        font-size: 0.9rem;
        padding: 0.375rem 0.75rem;
    }
    
    .empty-state {
        padding: 2rem;
    }
    
    .user-avatar {
        flex-shrink: 0;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.filterLeaderboard = filterLeaderboard;
window.refreshLeaderboard = refreshLeaderboard;
window.takeQuiz = takeQuiz;
window.scrollToUser = scrollToUser;
window.shareLeaderboard = shareLeaderboard;
window.viewUserProfile = viewUserProfile;
window.challengeUser = challengeUser;
window.exportLeaderboard = exportLeaderboard;