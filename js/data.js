// ShikshaPlay - Mock Data for Quizzes and Badges

// Mock Quiz Data
const mockQuizzes = {
    math: {
        beginner: {
            id: "math-basic",
            subject: "Mathematics",
            level: "beginner",
            pointsPerQuestion: 10,
            questions: [
                {
                    id: "math_q1",
                    text: "What is 5 + 3?",
                    options: ["6", "8", "10"],
                    correctAnswer: 1,
                    explanation: "5 plus 3 equals 8. Count on your fingers: 5... 6, 7, 8!"
                },
                {
                    id: "math_q2",
                    text: "Which number comes after 12?",
                    options: ["11", "13", "14"],
                    correctAnswer: 1,
                    explanation: "Numbers go in order: 11, 12, 13, 14... So 13 comes after 12!"
                },
                {
                    id: "math_q3",
                    text: "What is 10 - 4?",
                    options: ["5", "6", "7"],
                    correctAnswer: 1,
                    explanation: "Start with 10 and count backwards 4 times: 9, 8, 7, 6. The answer is 6!"
                },
                {
                    id: "math_q4",
                    text: "How many sides does a triangle have?",
                    options: ["2", "3", "4"],
                    correctAnswer: 1,
                    explanation: "A triangle has 3 sides. Tri means three, just like a tricycle has 3 wheels!"
                },
                {
                    id: "math_q5",
                    text: "What is 2 × 3?",
                    options: ["5", "6", "7"],
                    correctAnswer: 1,
                    explanation: "2 × 3 means 2 groups of 3: 3 + 3 = 6. Great job!"
                },
                {
                    id: "math_q6",
                    text: "Which is bigger: 15 or 12?",
                    options: ["15", "12", "They are equal"],
                    correctAnswer: 0,
                    explanation: "15 is bigger than 12. When counting, 15 comes after 12!"
                },
                {
                    id: "math_q7",
                    text: "What is half of 8?",
                    options: ["3", "4", "5"],
                    correctAnswer: 1,
                    explanation: "Half means divide by 2. 8 ÷ 2 = 4. Think of sharing 8 candies equally between 2 friends!"
                },
                {
                    id: "math_q8",
                    text: "How many minutes are in one hour?",
                    options: ["50", "60", "70"],
                    correctAnswer: 1,
                    explanation: "There are 60 minutes in one hour. Remember: 60 seconds = 1 minute, 60 minutes = 1 hour!"
                },
                {
                    id: "math_q9",
                    text: "What is 9 + 7?",
                    options: ["15", "16", "17"],
                    correctAnswer: 1,
                    explanation: "9 + 7 = 16. You can think of it as 9 + 1 + 6 = 10 + 6 = 16!"
                },
                {
                    id: "math_q10",
                    text: "Which shape has 4 equal sides?",
                    options: ["Rectangle", "Square", "Circle"],
                    correctAnswer: 1,
                    explanation: "A square has 4 equal sides. All sides are the same length!"
                }
            ]
        }
    },
    science: {
        beginner: {
            id: "science-basic",
            subject: "Science",
            level: "beginner",
            pointsPerQuestion: 10,
            questions: [
                {
                    id: "sci_q1",
                    text: "What do plants need to grow?",
                    options: ["Only water", "Sunlight and water", "Only soil"],
                    correctAnswer: 1,
                    explanation: "Plants need sunlight, water, and nutrients from soil to grow healthy and strong!"
                },
                {
                    id: "sci_q2",
                    text: "How many legs does a spider have?",
                    options: ["6", "8", "10"],
                    correctAnswer: 1,
                    explanation: "Spiders have 8 legs! This makes them different from insects, which have 6 legs."
                },
                {
                    id: "sci_q3",
                    text: "What happens to water when it gets very cold?",
                    options: ["It disappears", "It becomes ice", "It becomes hot"],
                    correctAnswer: 1,
                    explanation: "When water gets very cold (below 0°C), it freezes and becomes ice!"
                },
                {
                    id: "sci_q4",
                    text: "Which animal is known as the king of the jungle?",
                    options: ["Tiger", "Lion", "Elephant"],
                    correctAnswer: 1,
                    explanation: "The lion is called the king of the jungle because of its strength and courage!"
                },
                {
                    id: "sci_q5",
                    text: "What do we call baby cats?",
                    options: ["Puppies", "Kittens", "Cubs"],
                    correctAnswer: 1,
                    explanation: "Baby cats are called kittens! They are born blind and depend on their mother."
                },
                {
                    id: "sci_q6",
                    text: "Which planet do we live on?",
                    options: ["Mars", "Earth", "Jupiter"],
                    correctAnswer: 1,
                    explanation: "We live on Earth! It's the third planet from the Sun and the only one with life as we know it."
                },
                {
                    id: "sci_q7",
                    text: "What gas do we breathe in to stay alive?",
                    options: ["Carbon dioxide", "Oxygen", "Nitrogen"],
                    correctAnswer: 1,
                    explanation: "We breathe in oxygen to stay alive. Plants help make oxygen for us to breathe!"
                },
                {
                    id: "sci_q8",
                    text: "What is the hottest season of the year?",
                    options: ["Winter", "Summer", "Spring"],
                    correctAnswer: 1,
                    explanation: "Summer is the hottest season when the Sun shines the most on our part of Earth!"
                },
                {
                    id: "sci_q9",
                    text: "Which part of the plant makes food?",
                    options: ["Roots", "Flowers", "Leaves"],
                    correctAnswer: 2,
                    explanation: "Leaves make food for the plant using sunlight, water, and air. This process is called photosynthesis!"
                },
                {
                    id: "sci_q10",
                    text: "What sound does thunder make?",
                    options: ["Boom", "Whistle", "Ring"],
                    correctAnswer: 0,
                    explanation: "Thunder makes a loud 'boom' sound! It happens when lightning heats the air very quickly."
                }
            ]
        }
    },
    english: {
        beginner: {
            id: "english-basic",
            subject: "English",
            level: "beginner",
            pointsPerQuestion: 10,
            questions: [
                {
                    id: "eng_q1",
                    text: "Which word rhymes with 'cat'?",
                    options: ["Dog", "Hat", "Bird"],
                    correctAnswer: 1,
                    explanation: "Hat rhymes with cat! Both words end with the 'at' sound."
                },
                {
                    id: "eng_q2",
                    text: "What is the plural of 'book'?",
                    options: ["Books", "Book", "Bookes"],
                    correctAnswer: 0,
                    explanation: "Books is the plural of book. We add 's' to most words to make them plural."
                },
                {
                    id: "eng_q3",
                    text: "Which letter comes after 'M' in the alphabet?",
                    options: ["L", "N", "O"],
                    correctAnswer: 1,
                    explanation: "N comes after M in the alphabet! The order is: L, M, N, O, P..."
                },
                {
                    id: "eng_q4",
                    text: "What is the opposite of 'big'?",
                    options: ["Large", "Huge", "Small"],
                    correctAnswer: 2,
                    explanation: "Small is the opposite of big. These are called opposite words or antonyms!"
                },
                {
                    id: "eng_q5",
                    text: "Which word is a color?",
                    options: ["Happy", "Blue", "Fast"],
                    correctAnswer: 1,
                    explanation: "Blue is a color! Colors help us describe how things look."
                },
                {
                    id: "eng_q6",
                    text: "What do we call a person who teaches?",
                    options: ["Teacher", "Doctor", "Chef"],
                    correctAnswer: 0,
                    explanation: "A teacher is a person who teaches students in school. Teachers help us learn!"
                },
                {
                    id: "eng_q7",
                    text: "Which word means the same as 'happy'?",
                    options: ["Sad", "Joyful", "Angry"],
                    correctAnswer: 1,
                    explanation: "Joyful means the same as happy! Words with the same meaning are called synonyms."
                },
                {
                    id: "eng_q8",
                    text: "How many vowels are there in English?",
                    options: ["4", "6", "5"],
                    correctAnswer: 2,
                    explanation: "There are 5 vowels in English: A, E, I, O, U. Sometimes Y can be a vowel too!"
                },
                {
                    id: "eng_q9",
                    text: "What do we call words that sound the same but mean different things?",
                    options: ["Rhymes", "Homophones", "Synonyms"],
                    correctAnswer: 1,
                    explanation: "Homophones are words that sound the same but mean different things, like 'to', 'too', and 'two'!"
                },
                {
                    id: "eng_q10",
                    text: "Which punctuation mark ends a question?",
                    options: ["Question mark (?)", "Period (.)", "Exclamation mark (!)"],
                    correctAnswer: 0,
                    explanation: "A question mark (?) ends a question. It shows that someone is asking something!"
                }
            ]
        }
    },
    general: {
        beginner: {
            id: "general-basic",
            subject: "General Knowledge",
            level: "beginner",
            pointsPerQuestion: 10,
            questions: [
                {
                    id: "gen_q1",
                    text: "What is the capital of India?",
                    options: ["Mumbai", "New Delhi", "Kolkata"],
                    correctAnswer: 1,
                    explanation: "New Delhi is the capital of India. It's where the government makes important decisions for our country!"
                },
                {
                    id: "gen_q2",
                    text: "How many days are there in a week?",
                    options: ["7", "6", "8"],
                    correctAnswer: 0,
                    explanation: "There are 7 days in a week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday!"
                },
                {
                    id: "gen_q3",
                    text: "What is the largest animal in the world?",
                    options: ["Elephant", "Blue whale", "Giraffe"],
                    correctAnswer: 1,
                    explanation: "The blue whale is the largest animal in the world! It lives in the ocean and can be as long as three school buses!"
                },
                {
                    id: "gen_q4",
                    text: "Which festival is known as the festival of lights?",
                    options: ["Holi", "Diwali", "Eid"],
                    correctAnswer: 1,
                    explanation: "Diwali is called the festival of lights because people light diyas and candles to celebrate!"
                },
                {
                    id: "gen_q5",
                    text: "What do we use to brush our teeth?",
                    options: ["Comb", "Spoon", "Toothbrush"],
                    correctAnswer: 2,
                    explanation: "We use a toothbrush to brush our teeth! It helps keep our teeth clean and healthy."
                },
                {
                    id: "gen_q6",
                    text: "Which bird cannot fly?",
                    options: ["Eagle", "Penguin", "Sparrow"],
                    correctAnswer: 1,
                    explanation: "Penguins cannot fly! But they are excellent swimmers and live in cold places."
                },
                {
                    id: "gen_q7",
                    text: "What do bees make?",
                    options: ["Milk", "Honey", "Cheese"],
                    correctAnswer: 1,
                    explanation: "Bees make honey! They collect nectar from flowers and turn it into sweet, golden honey."
                },
                {
                    id: "gen_q8",
                    text: "Which instrument is used to measure time?",
                    options: ["Clock", "Thermometer", "Scale"],
                    correctAnswer: 0,
                    explanation: "A clock is used to measure time! It tells us what time it is during the day."
                },
                {
                    id: "gen_q9",
                    text: "What is the main source of light during the day?",
                    options: ["Moon", "Sun", "Stars"],
                    correctAnswer: 1,
                    explanation: "The Sun is our main source of light during the day! It also gives us heat and energy."
                },
                {
                    id: "gen_q10",
                    text: "How many colors are there in a rainbow?",
                    options: ["5", "7", "9"],
                    correctAnswer: 1,
                    explanation: "There are 7 colors in a rainbow: Red, Orange, Yellow, Green, Blue, Indigo, Violet! Remember: ROYGBIV!"
                }
            ]
        }
    }
};

// Mock Badge Definitions
const mockBadges = [
    {
        id: "first-steps",
        name: "First Steps",
        description: "Complete your very first quiz",
        icon: "🌟",
        criteria: { type: "quizzes", value: 1 },
        rarity: "common",
        points: 50
    },
    {
        id: "quick-learner",
        name: "Quick Learner",
        description: "Score 80% or higher on a quiz",
        icon: "⚡",
        criteria: { type: "accuracy", value: 80 },
        rarity: "common",
        points: 75
    },
    {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Get 100% on any quiz",
        icon: "💯",
        criteria: { type: "accuracy", value: 100 },
        rarity: "rare",
        points: 100
    },
    {
        id: "math-genius",
        name: "Math Genius",
        description: "Complete 3 math quizzes",
        icon: "🔢",
        criteria: { type: "subject", subject: "math", value: 3 },
        rarity: "common",
        points: 100
    },
    {
        id: "science-explorer",
        name: "Science Explorer",
        description: "Complete 3 science quizzes",
        icon: "🔬",
        criteria: { type: "subject", subject: "science", value: 3 },
        rarity: "common",
        points: 100
    },
    {
        id: "word-master",
        name: "Word Master",
        description: "Complete 3 English quizzes",
        icon: "📚",
        criteria: { type: "subject", subject: "english", value: 3 },
        rarity: "common",
        points: 100
    },
    {
        id: "knowledge-seeker",
        name: "Knowledge Seeker",
        description: "Complete 3 general knowledge quizzes",
        icon: "🌍",
        criteria: { type: "subject", subject: "general", value: 3 },
        rarity: "common",
        points: 100
    },
    {
        id: "daily-learner",
        name: "Daily Learner",
        description: "Take a quiz every day for 3 days",
        icon: "📅",
        criteria: { type: "streak", value: 3 },
        rarity: "rare",
        points: 150
    },
    {
        id: "speed-demon",
        name: "Speed Demon",
        description: "Complete a quiz in under 5 minutes",
        icon: "🏃",
        criteria: { type: "time", value: 300 }, // 300 seconds = 5 minutes
        rarity: "rare",
        points: 125
    },
    {
        id: "point-collector",
        name: "Point Collector",
        description: "Earn 500 total points",
        icon: "💰",
        criteria: { type: "points", value: 500 },
        rarity: "rare",
        points: 200
    },
    {
        id: "quiz-master",
        name: "Quiz Master",
        description: "Complete 10 quizzes",
        icon: "🎓",
        criteria: { type: "quizzes", value: 10 },
        rarity: "rare",
        points: 300
    },
    {
        id: "all-rounder",
        name: "All Rounder",
        description: "Complete at least one quiz in each subject",
        icon: "🌈",
        criteria: { type: "diversity", value: 4 }, // 4 subjects
        rarity: "legendary",
        points: 500
    },
    {
        id: "legendary-learner",
        name: "Legendary Learner",
        description: "Earn 1000 total points",
        icon: "👑",
        criteria: { type: "points", value: 1000 },
        rarity: "legendary",
        points: 1000
    }
];

// Encouraging messages for different score ranges
const encouragementMessages = {
    perfect: [
        "Outstanding! You're absolutely brilliant! 🌟",
        "Perfect score! You're a true champion! 🏆",
        "Incredible! You nailed every question! 💯",
        "Amazing work! You're unstoppable! ⭐"
    ],
    excellent: [ // 80-99%
        "Excellent work! You're doing fantastic! 🎉",
        "Great job! You're really learning well! 👏",
        "Wonderful! Keep up the amazing work! 🌟",
        "Superb performance! You should be proud! 🎊"
    ],
    good: [ // 60-79%
        "Good job! You're making great progress! 👍",
        "Well done! Keep practicing and you'll improve! 📈",
        "Nice work! You're on the right track! ✨",
        "Great effort! Learning takes time and you're doing well! 🌱"
    ],
    needsWork: [ // 40-59%
        "Good try! Practice makes perfect! 💪",
        "Nice effort! Keep learning and you'll get better! 📚",
        "You're learning! Try again and improve your score! 🎯",
        "Keep going! Every mistake is a step towards success! 🌟"
    ],
    keepTrying: [ // 0-39%
        "Don't give up! Learning is a journey! 🚀",
        "Keep trying! You can do this! 💪",
        "Every expert was once a beginner! Keep practicing! 🌱",
        "Stay positive! Your next quiz will be better! ⭐"
    ]
};

// Motivational quotes for results page
const motivationalQuotes = [
    "The more you learn, the more you realize how much you don't know, and that's the beauty of learning!",
    "Education is the key that unlocks the golden door to freedom.",
    "Learning is a treasure that will follow its owner everywhere.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Every accomplishment starts with the decision to try.",
    "Believe in yourself and all that you are. You are capable of amazing things!",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "You are braver than you believe, stronger than you seem, and smarter than you think.",
    "The only impossible journey is the one you never begin."
];

// Function to get a random quiz for a subject
function getQuizForSubject(subject, level = 'beginner') {
    if (mockQuizzes[subject] && mockQuizzes[subject][level]) {
        return JSON.parse(JSON.stringify(mockQuizzes[subject][level])); // Deep copy
    }
    return null;
}

// Function to get all available subjects
function getAvailableSubjects() {
    return Object.keys(mockQuizzes);
}

// Function to get encouragement message based on score
function getEncouragementMessage(percentage) {
    let category;
    if (percentage === 100) category = 'perfect';
    else if (percentage >= 80) category = 'excellent';
    else if (percentage >= 60) category = 'good';
    else if (percentage >= 40) category = 'needsWork';
    else category = 'keepTrying';
    
    const messages = encouragementMessages[category];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Function to get random motivational quote
function getRandomMotivationalQuote() {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

// Function to get badge by ID
function getBadgeById(badgeId) {
    return mockBadges.find(badge => badge.id === badgeId);
}

// Function to get all badges
function getAllBadges() {
    return mockBadges;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockQuizzes,
        mockBadges,
        encouragementMessages,
        motivationalQuotes,
        getQuizForSubject,
        getAvailableSubjects,
        getEncouragementMessage,
        getRandomMotivationalQuote,
        getBadgeById,
        getAllBadges
    };
}