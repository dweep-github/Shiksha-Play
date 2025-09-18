// ShikshaPlay - Badge System JavaScript

// Initialize badge system
class BadgeSystem {
    constructor() {
        this.badges = getAllBadges();
        this.setupBadgeAnimations();
    }

    // Set up badge animations and effects
    setupBadgeAnimations() {
        // Create sparkle effect CSS
        this.createSparkleCSS();
    }

    // Create sparkle animation CSS
    createSparkleCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .badge-sparkle {
                position: relative;
                overflow: visible;
            }
            
            .badge-sparkle::before,
            .badge-sparkle::after {
                content: '✨';
                position: absolute;
                font-size: 1.2rem;
                animation: sparkle 2s infinite;
                pointer-events: none;
            }
            
            .badge-sparkle::before {
                top: -10px;
                right: -10px;
                animation-delay: 0s;
            }
            
            .badge-sparkle::after {
                bottom: -10px;
                left: -10px;
                animation-delay: 1s;
            }
            
            @keyframes sparkle {
                0%, 100% { 
                    opacity: 0; 
                    transform: scale(0.5) rotate(0deg); 
                }
                50% { 
                    opacity: 1; 
                    transform: scale(1.2) rotate(180deg); 
                }
            }
            
            .badge-unlock-glow {
                animation: badgeGlow 3s ease-in-out;
                filter: drop-shadow(0 0 20px rgba(255, 193, 7, 0.8));
            }
            
            @keyframes badgeGlow {
                0%, 100% { 
                    filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.4)); 
                }
                50% { 
                    filter: drop-shadow(0 0 30px rgba(255, 193, 7, 1)); 
                }
            }
            
            .badge-pulse {
                animation: badgePulse 2s infinite;
            }
            
            @keyframes badgePulse {
                0%, 100% { 
                    transform: scale(1); 
                }
                50% { 
                    transform: scale(1.1); 
                }
            }
            
            .badge-float {
                animation: badgeFloat 3s ease-in-out infinite;
            }
            
            @keyframes badgeFloat {
                0%, 100% { 
                    transform: translateY(0px); 
                }
                50% { 
                    transform: translateY(-10px); 
                }
            }
            
            .badge-celebration {
                position: relative;
            }
            
            .badge-celebration::before {
                content: '🎉';
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 2rem;
                animation: celebration 1s ease-out;
                pointer-events: none;
            }
            
            @keyframes celebration {
                0% { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(20px) scale(0); 
                }
                50% { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(-10px) scale(1.2); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-30px) scale(1); 
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Check and award badges for a user
    checkAndAwardBadges(user, quizResults = null) {
        const newBadges = [];
        const userBadgeIds = user.badges.map(b => b.id);

        for (const badge of this.badges) {
            if (userBadgeIds.includes(badge.id)) continue;

            if (this.checkBadgeCriteria(badge, user, quizResults)) {
                newBadges.push(badge);
            }
        }

        return newBadges;
    }

    // Check if user meets badge criteria
    checkBadgeCriteria(badge, user, quizResults = null) {
        const criteria = badge.criteria;

        switch (criteria.type) {
            case 'quizzes':
                return user.stats.totalQuizzes >= criteria.value;

            case 'points':
                return user.totalPoints >= criteria.value;

            case 'accuracy':
                // Check if user has achieved this accuracy in any quiz
                if (quizResults && quizResults.percentage >= criteria.value) {
                    return true;
                }
                // Or check average accuracy
                return parseFloat(user.stats.averageScore) >= criteria.value;

            case 'subject':
                const subjectStats = user.stats.subjectStats[criteria.subject];
                return subjectStats && subjectStats.quizzes >= criteria.value;

            case 'streak':
                return user.stats.bestStreak >= criteria.value;

            case 'time':
                // Check if user completed any quiz under the time limit
                if (quizResults && quizResults.timeSpent <= criteria.value) {
                    return true;
                }
                return false;

            case 'diversity':
                // Check if user completed quizzes in multiple subjects
                return Object.keys(user.stats.subjectStats).length >= criteria.value;

            case 'perfect':
                // Check for perfect scores
                if (quizResults && quizResults.percentage === 100) {
                    return true;
                }
                return user.completedQuizzes.some(quiz => quiz.score === 100);

            case 'daily':
                // Check for daily completion (would need date tracking)
                return this.checkDailyCompletion(user, criteria.value);

            default:
                return false;
        }
    }

    // Check daily completion streak
    checkDailyCompletion(user, requiredDays) {
        // This is a simplified check - in a real app, you'd track daily activity
        const recentQuizzes = user.completedQuizzes.slice(-requiredDays);
        if (recentQuizzes.length < requiredDays) return false;

        // Check if quizzes were completed on different days
        const uniqueDays = new Set(
            recentQuizzes.map(quiz => 
                new Date(quiz.completedAt).toDateString()
            )
        );

        return uniqueDays.size >= requiredDays;
    }

    // Create badge display element
    createBadgeElement(badge, isNew = false) {
        const badgeDiv = document.createElement('div');
        badgeDiv.className = `badge-display ${isNew ? 'badge-new' : ''}`;
        badgeDiv.setAttribute('data-badge-id', badge.id);

        const rarityClass = this.getBadgeRarityClass(badge.rarity);
        
        badgeDiv.innerHTML = `
            <div class="badge-container ${rarityClass} ${isNew ? 'badge-unlock-glow' : ''}">
                <div class="badge-icon ${isNew ? 'badge-pulse' : 'badge-float'}" style="font-size: 3rem;">
                    ${badge.icon}
                </div>
                <div class="badge-info">
                    <h5 class="badge-name">${badge.name}</h5>
                    <p class="badge-description">${badge.description}</p>
                    <div class="badge-details">
                        <span class="badge-rarity badge bg-${this.getBadgeRarityColor(badge.rarity)}">${badge.rarity}</span>
                        <span class="badge-points text-muted">+${badge.points} points</span>
                    </div>
                </div>
            </div>
        `;

        if (isNew) {
            // Add celebration effects for new badges
            setTimeout(() => {
                badgeDiv.classList.add('badge-celebration');
                this.createConfettiForBadge(badgeDiv);
            }, 500);

            // Add sparkle effect
            setTimeout(() => {
                const icon = badgeDiv.querySelector('.badge-icon');
                if (icon) {
                    icon.classList.add('badge-sparkle');
                }
            }, 1000);
        }

        return badgeDiv;
    }

    // Get badge rarity CSS class
    getBadgeRarityClass(rarity) {
        const classes = {
            common: 'badge-common',
            rare: 'badge-rare',
            legendary: 'badge-legendary'
        };
        return classes[rarity] || 'badge-common';
    }

    // Get badge rarity color
    getBadgeRarityColor(rarity) {
        const colors = {
            common: 'light',
            rare: 'warning',
            legendary: 'danger'
        };
        return colors[rarity] || 'light';
    }

    // Create confetti effect for badge unlock
    createConfettiForBadge(badgeElement) {
        const rect = badgeElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createConfettiPiece(centerX, centerY);
            }, i * 50);
        }
    }

    // Create individual confetti piece
    createConfettiPiece(x, y) {
        const confetti = document.createElement('div');
        confetti.className = 'badge-confetti';
        confetti.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: ${this.getRandomColor()};
            pointer-events: none;
            z-index: 10000;
            border-radius: 50%;
        `;

        document.body.appendChild(confetti);

        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const gravity = 0.5;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let posX = x;
        let posY = y;

        const animate = () => {
            vy += gravity;
            posX += vx * 0.02;
            posY += vy * 0.02;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.transform = `rotate(${Date.now() * 0.01}deg)`;

            if (posY < window.innerHeight + 100) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(confetti);
            }
        };

        requestAnimationFrame(animate);
    }

    // Get random color for confetti
    getRandomColor() {
        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Show badge unlock modal with animation
    showBadgeUnlockModal(badge) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('badgeUnlockModal');
        if (!modal) {
            modal = this.createBadgeUnlockModal();
            document.body.appendChild(modal);
        }

        // Update modal content
        const badgeIcon = modal.querySelector('.badge-modal-icon');
        const badgeName = modal.querySelector('.badge-modal-name');
        const badgeDescription = modal.querySelector('.badge-modal-description');
        const badgePoints = modal.querySelector('.badge-modal-points');

        if (badgeIcon) badgeIcon.textContent = badge.icon;
        if (badgeName) badgeName.textContent = badge.name;
        if (badgeDescription) badgeDescription.textContent = badge.description;
        if (badgePoints) badgePoints.textContent = `+${badge.points} points`;

        // Show modal with animation
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        // Play sound effect
        playSound('success');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            bootstrapModal.hide();
        }, 3000);
    }

    // Create badge unlock modal
    createBadgeUnlockModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'badgeUnlockModal';
        modal.setAttribute('tabindex', '-1');
        modal.style.zIndex = '10000';

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-body text-center p-5">
                        <div class="badge-modal-animation">
                            <div class="badge-modal-icon animate__animated animate__bounceIn" style="font-size: 5rem; margin-bottom: 1rem;">
                                🏆
                            </div>
                        </div>
                        <h3 class="text-warning fw-bold mb-2 animate__animated animate__fadeIn animate__delay-1s">
                            🎉 New Badge Unlocked! 🎉
                        </h3>
                        <h4 class="badge-modal-name text-primary fw-bold mb-3 animate__animated animate__fadeIn animate__delay-1s">
                            Badge Name
                        </h4>
                        <p class="badge-modal-description text-muted mb-3 animate__animated animate__fadeIn animate__delay-2s">
                            Badge description goes here
                        </p>
                        <div class="badge-modal-points badge bg-success fs-6 animate__animated animate__fadeIn animate__delay-2s">
                            +0 points
                        </div>
                        <div class="mt-4">
                            <button type="button" class="btn btn-primary animate__animated animate__fadeIn animate__delay-3s" data-bs-dismiss="modal">
                                <i class="fas fa-thumbs-up"></i> Awesome!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    // Get user's badge progress
    getUserBadgeProgress(user) {
        const progress = {};

        for (const badge of this.badges) {
            const hasEarned = user.badges.some(b => b.id === badge.id);
            
            if (!hasEarned) {
                progress[badge.id] = this.calculateBadgeProgress(badge, user);
            }
        }

        return progress;
    }

    // Calculate progress towards a badge
    calculateBadgeProgress(badge, user) {
        const criteria = badge.criteria;
        let current = 0;
        let target = criteria.value;

        switch (criteria.type) {
            case 'quizzes':
                current = user.stats.totalQuizzes;
                break;
            case 'points':
                current = user.totalPoints;
                break;
            case 'subject':
                const subjectStats = user.stats.subjectStats[criteria.subject];
                current = subjectStats ? subjectStats.quizzes : 0;
                break;
            case 'streak':
                current = user.stats.bestStreak;
                break;
            case 'diversity':
                current = Object.keys(user.stats.subjectStats).length;
                break;
            default:
                current = 0;
        }

        const percentage = Math.min((current / target) * 100, 100);
        
        return {
            current,
            target,
            percentage: Math.round(percentage),
            description: this.getProgressDescription(badge, current, target)
        };
    }

    // Get progress description
    getProgressDescription(badge, current, target) {
        const remaining = Math.max(0, target - current);
        
        switch (badge.criteria.type) {
            case 'quizzes':
                return remaining > 0 ? 
                    `Complete ${remaining} more quiz${remaining !== 1 ? 'es' : ''}` :
                    'Badge earned!';
            case 'points':
                return remaining > 0 ?
                    `Earn ${remaining} more points` :
                    'Badge earned!';
            case 'subject':
                return remaining > 0 ?
                    `Complete ${remaining} more ${badge.criteria.subject} quiz${remaining !== 1 ? 'es' : ''}` :
                    'Badge earned!';
            default:
                return remaining > 0 ?
                    `${remaining} more to go!` :
                    'Badge earned!';
        }
    }

    // Display user's badges
    displayUserBadges(user, container) {
        if (!container) return;

        container.innerHTML = '';

        if (user.badges.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted p-4">
                    <i class="fas fa-medal fa-3x mb-3 opacity-50"></i>
                    <p>No badges earned yet. Start taking quizzes to unlock your first badge!</p>
                </div>
            `;
            return;
        }

        user.badges.forEach(userBadge => {
            const badge = this.badges.find(b => b.id === userBadge.id);
            if (badge) {
                const badgeElement = this.createBadgeElement(badge, false);
                
                // Add earned date
                const earnedDate = new Date(userBadge.unlockedAt).toLocaleDateString();
                const dateElement = document.createElement('small');
                dateElement.className = 'text-muted d-block mt-2';
                dateElement.textContent = `Earned on ${earnedDate}`;
                badgeElement.appendChild(dateElement);
                
                container.appendChild(badgeElement);
            }
        });
    }
}

// Create global badge system instance
const badgeSystem = new BadgeSystem();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.badgeSystem = badgeSystem;
}

// Additional CSS for badge styling
const badgeStyles = document.createElement('style');
badgeStyles.textContent = `
    .badge-display {
        margin-bottom: 1rem;
    }
    
    .badge-container {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .badge-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .badge-common {
        border-color: #e9ecef;
    }
    
    .badge-rare {
        border-color: #ffc107;
        background: linear-gradient(135deg, #fff, #fff3cd);
    }
    
    .badge-legendary {
        border-color: #dc3545;
        background: linear-gradient(135deg, #fff, #f8d7da);
    }
    
    .badge-info {
        text-align: center;
    }
    
    .badge-name {
        color: #007bff;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    
    .badge-description {
        color: #6c757d;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
    
    .badge-details {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .badge-rarity {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .badge-points {
        font-size: 0.9rem;
        font-weight: 500;
    }
`;
document.head.appendChild(badgeStyles);

// Export functions
window.checkAndAwardBadges = (user, quizResults) => badgeSystem.checkAndAwardBadges(user, quizResults);
window.showBadgeUnlockModal = (badge) => badgeSystem.showBadgeUnlockModal(badge);
window.displayUserBadges = (user, container) => badgeSystem.displayUserBadges(user, container);
window.getUserBadgeProgress = (user) => badgeSystem.getUserBadgeProgress(user);