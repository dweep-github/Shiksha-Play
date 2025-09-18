// ShikshaPlay - Results JavaScript

let quizResults = null;

// Initialize results page
document.addEventListener('DOMContentLoaded', function() {
    initializeResultsPage();
});

// Initialize results page functionality
function initializeResultsPage() {
    // Check if user is logged in
    const user = userManager.getCurrentUser();
    if (!user) {
        showAlert('Please login first!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Load quiz results
    loadQuizResults();
    
    // Update user info
    updateUserInfo(user);
    
    if (quizResults) {
        displayResults();
        displayBadges();
        displayQuizSummary();
        playResultsAnimation();
    } else {
        // No results found, redirect to quiz page
        showAlert('No quiz results found. Please take a quiz first.', 'info');
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 2000);
    }
}

// Load quiz results from session storage
function loadQuizResults() {
    try {
        const resultsData = sessionStorage.getItem('quizResults');
        if (resultsData) {
            quizResults = JSON.parse(resultsData);
            console.log('Quiz results loaded:', quizResults);
        }
    } catch (error) {
        console.error('Error loading quiz results:', error);
    }
}

// Update user information in UI
function updateUserInfo(user) {
    const userElements = ['currentUser', 'totalUserPoints'];
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

// Display quiz results
function displayResults() {
    if (!quizResults) return;
    
    // Update score display
    const pointsEarnedElement = document.getElementById('pointsEarned');
    const percentageScoreElement = document.getElementById('percentageScore');
    const correctAnswersElement = document.getElementById('correctAnswers');
    
    if (pointsEarnedElement) {
        animateScore(pointsEarnedElement, quizResults.points);
    }
    
    if (percentageScoreElement) {
        setTimeout(() => {
            animateScore(percentageScoreElement, quizResults.percentage);
            setTimeout(() => {
                percentageScoreElement.textContent = `${quizResults.percentage}%`;
            }, 100);
        }, 500);
    }
    
    if (correctAnswersElement) {
        setTimeout(() => {
            correctAnswersElement.textContent = `${quizResults.correctAnswers}/${quizResults.totalQuestions}`;
        }, 1000);
    }
    
    // Update performance message
    updatePerformanceMessage();
    
    // Trigger celebration if high score
    if (quizResults.percentage >= 80) {
        setTimeout(() => {
            createConfetti();
            playSound('success');
            // Remove confetti container after 3 seconds to restore clickability
            setTimeout(() => {
                const confetti = document.getElementById('confetti-container');
                if (confetti) {
                    confetti.remove();
                }
            }, 3000);
        }, 1500);
    }
}

// Update performance message based on score
function updatePerformanceMessage() {
    const performanceMessageElement = document.getElementById('performanceMessage');
    const performanceDescriptionElement = document.getElementById('performanceDescription');
    
    if (!performanceMessageElement || !performanceDescriptionElement) return;
    
    const percentage = quizResults.percentage;
    let message, description, className;
    
    if (percentage === 100) {
        message = "🏆 Perfect Score! 🏆";
        description = "Outstanding! You got every question right! You're a true champion!";
        className = "text-warning";
    } else if (percentage >= 90) {
        message = "⭐ Excellent Work! ⭐";
        description = "Amazing performance! You're really mastering this subject!";
        className = "text-success";
    } else if (percentage >= 80) {
        message = "🎉 Great Job! 🎉";
        description = "Well done! You're doing fantastic and learning so much!";
        className = "text-success";
    } else if (percentage >= 70) {
        message = "👍 Good Work! 👍";
        description = "Nice job! You're making good progress. Keep it up!";
        className = "text-primary";
    } else if (percentage >= 60) {
        message = "📈 Keep Learning! 📈";
        description = "You're on the right track! Practice makes perfect!";
        className = "text-info";
    } else {
        message = "💪 Don't Give Up! 💪";
        description = "Every expert was once a beginner. Keep trying and you'll improve!";
        className = "text-warning";
    }
    
    performanceMessageElement.textContent = message;
    performanceMessageElement.className = `fw-bold ${className}`;
    performanceDescriptionElement.textContent = description;
}

// Display earned badges
function displayBadges() {
    const newBadgesContainer = document.getElementById('newBadges');
    const noBadgesElement = document.getElementById('noBadges');
    const badgesSection = document.getElementById('badgesSection');
    
    if (!quizResults.newBadges || quizResults.newBadges.length === 0) {
        // No new badges
        if (newBadgesContainer) newBadgesContainer.innerHTML = '';
        if (noBadgesElement) noBadgesElement.classList.remove('d-none');
        return;
    }
    
    // Hide "no badges" message
    if (noBadgesElement) noBadgesElement.classList.add('d-none');
    
    // Show badges section
    if (badgesSection) badgesSection.classList.remove('d-none');
    
    // Display new badges
    if (newBadgesContainer) {
        newBadgesContainer.innerHTML = '';
        
        quizResults.newBadges.forEach((badge, index) => {
            const badgeElement = createBadgeElement(badge);
            newBadgesContainer.appendChild(badgeElement);
            
            // Animate badge appearance
            setTimeout(() => {
                animateElement(badgeElement, 'animate__bounceIn');
                playSound('success');
                
                // Show badge modal after animation
                setTimeout(() => {
                    showBadgeUnlockModal(badge);
                }, 500);
            }, index * 1000);
        });
    }
}

// Create badge element
function createBadgeElement(badge) {
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'col-md-4 mb-3';
    
    badgeDiv.innerHTML = `
        <div class="badge-item text-center p-3 border rounded shadow-sm">
            <div class="badge-icon text-warning fs-1 mb-2">${badge.icon}</div>
            <h5 class="badge-name fw-bold text-primary">${badge.name}</h5>
            <p class="badge-description text-muted small">${badge.description}</p>
            <span class="badge bg-${getBadgeRarityColor(badge.rarity)} text-dark">${badge.rarity}</span>
        </div>
    `;
    
    return badgeDiv;
}

// Get badge rarity color
function getBadgeRarityColor(rarity) {
    const colors = {
        common: 'light',
        rare: 'warning',
        legendary: 'danger'
    };
    return colors[rarity] || 'light';
}

// Show badge unlock modal
function showBadgeUnlockModal(badge) {
    const modal = document.getElementById('badgeModal');
    const badgeNameElement = document.getElementById('badgeName');
    const badgeDescriptionElement = document.getElementById('badgeDescription');
    
    if (modal && badgeNameElement && badgeDescriptionElement) {
        badgeNameElement.textContent = badge.name;
        badgeDescriptionElement.textContent = badge.description;
        
        const badgeModal = new bootstrap.Modal(modal);
        badgeModal.show();

        // Auto-close after 2 seconds and force-remove all modal artifacts
        setTimeout(() => {
            badgeModal.hide();
            // Remove any leftover modal backdrops
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            // Remove 'show' class and inline styles from the modal
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }, 2000);
    }
}

// Display quiz summary
function displayQuizSummary() {
    if (!quizResults) return;
    
    const questionsAnsweredElement = document.getElementById('questionsAnswered');
    const timeTakenElement = document.getElementById('timeTaken');
    const quizSubjectElement = document.getElementById('quizSubject');
    
    if (questionsAnsweredElement) {
        questionsAnsweredElement.textContent = quizResults.totalQuestions;
    }
    
    if (timeTakenElement) {
        const minutes = Math.floor(quizResults.timeSpent / 60);
        const seconds = quizResults.timeSpent % 60;
        timeTakenElement.textContent = minutes > 0 
            ? `${minutes} min ${seconds} sec` 
            : `${seconds} seconds`;
    }
    
    if (quizSubjectElement) {
        quizSubjectElement.textContent = quizResults.subject;
    }
}

// Play results animation
function playResultsAnimation() {
    // Animate score cards
    const scoreCards = document.querySelectorAll('.score-card');
    scoreCards.forEach((card, index) => {
        setTimeout(() => {
            animateElement(card, 'animate__flipInY');
        }, index * 200);
    });
    
    // Animate badge section if there are new badges
    if (quizResults.newBadges && quizResults.newBadges.length > 0) {
        setTimeout(() => {
            const badgesSection = document.getElementById('badgesSection');
            if (badgesSection) {
                animateElement(badgesSection, 'animate__fadeInUp');
            }
        }, 1000);
    }
}

// Try another quiz
function tryAnotherQuiz() {
    // Clear results from session storage
    sessionStorage.removeItem('quizResults');
    
    // Navigate to quiz page
    window.location.href = 'quiz.html';
}

// View leaderboard
function viewLeaderboard() {
    window.location.href = 'leaderboard.html';
}

// Share achievement
function shareAchievement() {
    const shareModal = document.getElementById('shareModal');
    const shareScoreElement = document.getElementById('shareScore');
    
    if (shareScoreElement) {
        shareScoreElement.textContent = quizResults.percentage;
    }
    
    if (shareModal) {
        const modal = new bootstrap.Modal(shareModal);
        modal.show();
    }
}

// Copy share text
function copyShareText() {
    const shareText = `🎉 I just scored ${quizResults.percentage}% on a ${quizResults.subject} quiz on ShikshaPlay! 🎉

Join me in this fun learning adventure at ShikshaPlay - where learning meets gaming! 📚🎮

#ShikshaPlay #Learning #Education #Quiz`;
    
    copyToClipboard(shareText)
        .then(() => {
            const copySuccessElement = document.getElementById('copySuccess');
            if (copySuccessElement) {
                copySuccessElement.classList.remove('d-none');
                setTimeout(() => {
                    copySuccessElement.classList.add('d-none');
                }, 3000);
            }
            showAlert('Share text copied to clipboard!', 'success');
        })
        .catch(() => {
            showAlert('Failed to copy text. Please try again.', 'danger');
        });
}

// Get new motivational quote
function getNewQuote() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (quoteElement) {
        const newQuote = getRandomMotivationalQuote();
        
        // Animate quote change
        animateElement(quoteElement, 'animate__fadeOut', () => {
            quoteElement.textContent = newQuote;
            animateElement(quoteElement, 'animate__fadeIn');
        });
    }
}

// Calculate grade based on percentage
function calculateGrade(percentage) {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'A-';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'C-';
    if (percentage >= 50) return 'D';
    return 'F';
}

// Generate certificate (future feature)
function generateCertificate() {
    if (quizResults.percentage >= 80) {
        showAlert('Certificate feature coming soon! 🎓', 'info');
        // In the future, this could generate a downloadable certificate
    } else {
        showAlert('You need at least 80% to earn a certificate. Keep practicing!', 'warning');
    }
}

// Review quiz answers (future feature)
function reviewAnswers() {
    showAlert('Answer review feature coming soon! 📝', 'info');
    // In the future, this could show a detailed review of all questions and answers
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // N key for new quiz
    if (e.key === 'n' || e.key === 'N') {
        tryAnotherQuiz();
    }
    
    // L key for leaderboard
    if (e.key === 'l' || e.key === 'L') {
        viewLeaderboard();
    }
    
    // S key for share
    if (e.key === 's' || e.key === 'S') {
        shareAchievement();
    }
    
    // Q key for new quote
    if (e.key === 'q' || e.key === 'Q') {
        getNewQuote();
    }
});

// Auto-redirect after inactivity (optional)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const confirmRedirect = confirm('You\'ve been inactive for a while. Would you like to take another quiz?');
        if (confirmRedirect) {
            tryAnotherQuiz();
        }
    }, 300000); // 5 minutes
}

// Set up inactivity detection
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
resetInactivityTimer();

// Export functions for global access
window.tryAnotherQuiz = tryAnotherQuiz;
window.viewLeaderboard = viewLeaderboard;
window.shareAchievement = shareAchievement;
window.copyShareText = copyShareText;
window.getNewQuote = getNewQuote;
window.generateCertificate = generateCertificate;
window.reviewAnswers = reviewAnswers;