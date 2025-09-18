// ShikshaPlay - Local Storage Management System

// Storage Keys
const STORAGE_KEYS = {
    USER_DATA: 'shikshPlay_userData',
    QUIZ_PROGRESS: 'shikshPlay_quizProgress',
    LEADERBOARD: 'shikshPlay_leaderboard',
    SETTINGS: 'shikshPlay_settings'
};

// User Data Management
class UserManager {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Create a new user
    createUser(name, userClass) {
        if (!name || !userClass) {
            throw new Error('Name and class are required');
        }

        // Check if user already exists
        const existingUser = this.findUser(name, userClass);
        if (existingUser) {
            throw new Error('User with this name and class already exists');
        }

        const userId = this.generateUserId();
        const newUser = {
            id: userId,
            name: name.trim(),
            class: userClass,
            totalPoints: 0,
            badges: [],
            completedQuizzes: [],
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            stats: {
                totalQuizzes: 0,
                totalCorrectAnswers: 0,
                totalQuestions: 0,
                bestStreak: 0,
                currentStreak: 0,
                averageScore: 0,
                subjectStats: {}
            }
        };

        // Save user to storage
        this.saveUser(newUser);
        this.setCurrentUser(newUser);
        this.updateLeaderboard(newUser);

        return newUser;
    }

    // Login existing user
    loginUser(name, userClass) {
        if (!name || !userClass) {
            throw new Error('Name and class are required');
        }

        const user = this.findUser(name, userClass);
        if (!user) {
            throw new Error('User not found. Please register first.');
        }

        // Update last active
        user.lastActive = new Date().toISOString();
        this.saveUser(user);
        this.setCurrentUser(user);
        this.updateLeaderboard(user);

        return user;
    }

    // Find user by name and class
    findUser(name, userClass) {
        const users = this.getAllUsers();
        return users.find(user => 
            user.name.toLowerCase() === name.toLowerCase().trim() && 
            user.class === userClass
        );
    }

    // Get all users
    getAllUsers() {
        try {
            const users = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    // Save user to storage
    saveUser(user) {
        try {
            const users = this.getAllUsers();
            const existingIndex = users.findIndex(u => u.id === user.id);
            
            if (existingIndex >= 0) {
                users[existingIndex] = user;
            } else {
                users.push(user);
            }
            
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(users));
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Failed to save user data');
        }
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        try {
            localStorage.setItem('shikshPlay_currentUser', JSON.stringify(user));
        } catch (error) {
            console.error('Error setting current user:', error);
        }
    }

    // Load current user
    loadCurrentUser() {
        try {
            const currentUser = localStorage.getItem('shikshPlay_currentUser');
            this.currentUser = currentUser ? JSON.parse(currentUser) : null;
        } catch (error) {
            console.error('Error loading current user:', error);
            this.currentUser = null;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Logout current user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('shikshPlay_currentUser');
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Update user points
    updateUserPoints(points) {
        if (!this.currentUser) return false;
        
        this.currentUser.totalPoints += points;
        this.saveUser(this.currentUser);
        this.setCurrentUser(this.currentUser);
        this.updateLeaderboard(this.currentUser);
        
        return true;
    }

    // Add badge to user
    addBadgeToUser(badgeId) {
        if (!this.currentUser) return false;
        
        // Check if user already has this badge
        if (this.currentUser.badges.some(badge => badge.id === badgeId)) {
            return false;
        }
        
        const badge = getBadgeById(badgeId);
        if (!badge) return false;
        
        this.currentUser.badges.push({
            id: badgeId,
            unlockedAt: new Date().toISOString()
        });
        
        // Add badge points
        this.currentUser.totalPoints += badge.points;
        
        this.saveUser(this.currentUser);
        this.setCurrentUser(this.currentUser);
        this.updateLeaderboard(this.currentUser);
        
        return true;
    }

    // Update user statistics
    updateUserStats(quizData) {
        if (!this.currentUser || !quizData) return false;
        
        const stats = this.currentUser.stats;
        
        // Update general stats
        stats.totalQuizzes++;
        stats.totalCorrectAnswers += quizData.correctAnswers;
        stats.totalQuestions += quizData.totalQuestions;
        stats.averageScore = (stats.totalCorrectAnswers / stats.totalQuestions * 100).toFixed(1);
        
        // Update subject stats
        const subject = quizData.subject;
        if (!stats.subjectStats[subject]) {
            stats.subjectStats[subject] = {
                quizzes: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                averageScore: 0
            };
        }
        
        const subjectStats = stats.subjectStats[subject];
        subjectStats.quizzes++;
        subjectStats.correctAnswers += quizData.correctAnswers;
        subjectStats.totalQuestions += quizData.totalQuestions;
        subjectStats.averageScore = (subjectStats.correctAnswers / subjectStats.totalQuestions * 100).toFixed(1);
        
        // Update streak
        if (quizData.percentage >= 60) { // Consider 60% as passing
            stats.currentStreak++;
            stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
        } else {
            stats.currentStreak = 0;
        }
        
        // Add completed quiz
        this.currentUser.completedQuizzes.push({
            quizId: quizData.quizId,
            subject: quizData.subject,
            score: quizData.percentage,
            points: quizData.points,
            completedAt: new Date().toISOString()
        });
        
        this.saveUser(this.currentUser);
        this.setCurrentUser(this.currentUser);
        
        return true;
    }

    // Update leaderboard
    updateLeaderboard(user) {
        try {
            let leaderboard = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD) || '[]');
            
            // Remove user if already exists
            leaderboard = leaderboard.filter(entry => entry.userId !== user.id);
            
            // Add updated user
            leaderboard.push({
                userId: user.id,
                userName: user.name,
                userClass: user.class,
                totalPoints: user.totalPoints,
                badgeCount: user.badges.length,
                lastActive: user.lastActive,
                stats: user.stats
            });
            
            // Sort by points (descending)
            leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
            
            // Add ranks
            leaderboard.forEach((entry, index) => {
                entry.rank = index + 1;
            });
            
            localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    }
}

// Quiz Progress Management
class QuizProgressManager {
    constructor() {
        this.currentQuiz = null;
    }

    // Start a new quiz
    startQuiz(quizData) {
        const progress = {
            quizId: quizData.id,
            subject: quizData.subject,
            level: quizData.level,
            currentQuestion: 0,
            answers: [],
            score: 0,
            startTime: new Date().toISOString(),
            timeSpent: 0
        };
        
        this.currentQuiz = progress;
        this.saveProgress();
        
        return progress;
    }

    // Answer a question
    answerQuestion(questionIndex, selectedAnswer, isCorrect) {
        if (!this.currentQuiz) return false;
        
        this.currentQuiz.answers[questionIndex] = {
            selectedAnswer,
            isCorrect,
            answeredAt: new Date().toISOString()
        };
        
        if (isCorrect) {
            this.currentQuiz.score++;
        }
        
        this.saveProgress();
        return true;
    }

    // Move to next question
    nextQuestion() {
        if (!this.currentQuiz) return false;
        
        this.currentQuiz.currentQuestion++;
        this.saveProgress();
        
        return true;
    }

    // Complete quiz
    completeQuiz() {
        if (!this.currentQuiz) return null;
        
        const endTime = new Date();
        const startTime = new Date(this.currentQuiz.startTime);
        this.currentQuiz.timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
        
        const result = { ...this.currentQuiz };
        this.clearProgress();
        
        return result;
    }

    // Get current progress
    getCurrentProgress() {
        return this.currentQuiz;
    }

    // Save progress to localStorage
    saveProgress() {
        try {
            if (this.currentQuiz) {
                localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(this.currentQuiz));
            }
        } catch (error) {
            console.error('Error saving quiz progress:', error);
        }
    }

    // Load progress from localStorage
    loadProgress() {
        try {
            const progress = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
            this.currentQuiz = progress ? JSON.parse(progress) : null;
            return this.currentQuiz;
        } catch (error) {
            console.error('Error loading quiz progress:', error);
            this.currentQuiz = null;
            return null;
        }
    }

    // Clear progress
    clearProgress() {
        this.currentQuiz = null;
        localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
    }
}

// Leaderboard Management
class LeaderboardManager {
    // Get leaderboard data
    getLeaderboard(filter = 'all', userClass = null) {
        try {
            let leaderboard = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD) || '[]');
            
            // Apply filters
            switch (filter) {
                case 'class':
                    if (userClass) {
                        leaderboard = leaderboard.filter(entry => entry.userClass === userClass);
                    }
                    break;
                case 'week':
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    leaderboard = leaderboard.filter(entry => 
                        new Date(entry.lastActive) >= oneWeekAgo
                    );
                    break;
                default:
                    // 'all' - no filter
                    break;
            }
            
            // Re-sort and re-rank after filtering
            leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
            leaderboard.forEach((entry, index) => {
                entry.rank = index + 1;
            });
            
            return leaderboard;
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return [];
        }
    }

    // Get user rank
    getUserRank(userId, filter = 'all', userClass = null) {
        const leaderboard = this.getLeaderboard(filter, userClass);
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry ? userEntry.rank : 0;
    }

    // Get top performers
    getTopPerformers(count = 3) {
        const leaderboard = this.getLeaderboard();
        return leaderboard.slice(0, count);
    }
}

// Badge System Management
class BadgeManager {
    constructor() {
        this.badges = getAllBadges();
    }

    // Check for new badges
    checkForNewBadges(user) {
        const newBadges = [];
        const userBadgeIds = user.badges.map(b => b.id);
        
        for (const badge of this.badges) {
            if (userBadgeIds.includes(badge.id)) continue;
            
            if (this.checkBadgeCriteria(badge, user)) {
                newBadges.push(badge);
            }
        }
        
        return newBadges;
    }

    // Check if user meets badge criteria
    checkBadgeCriteria(badge, user) {
        const criteria = badge.criteria;
        
        switch (criteria.type) {
            case 'quizzes':
                return user.stats.totalQuizzes >= criteria.value;
                
            case 'points':
                return user.totalPoints >= criteria.value;
                
            case 'accuracy':
                return parseFloat(user.stats.averageScore) >= criteria.value;
                
            case 'subject':
                const subjectStats = user.stats.subjectStats[criteria.subject];
                return subjectStats && subjectStats.quizzes >= criteria.value;
                
            case 'streak':
                return user.stats.bestStreak >= criteria.value;
                
            case 'time':
                // Check if user completed any quiz under the time limit
                return user.completedQuizzes.some(quiz => {
                    // This would need to be implemented based on quiz timing data
                    return false; // Placeholder
                });
                
            case 'diversity':
                // Check if user completed quizzes in multiple subjects
                return Object.keys(user.stats.subjectStats).length >= criteria.value;
                
            default:
                return false;
        }
    }
}

// Initialize managers
const userManager = new UserManager();
const quizProgressManager = new QuizProgressManager();
const leaderboardManager = new LeaderboardManager();
const badgeManager = new BadgeManager();

// Load saved quiz progress on page load
quizProgressManager.loadProgress();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.userManager = userManager;
    window.quizProgressManager = quizProgressManager;
    window.leaderboardManager = leaderboardManager;
    window.badgeManager = badgeManager;
}