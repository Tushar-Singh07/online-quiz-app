export const quizzes = [
    // Quick Round
    {
        id: 'js-basics-quick',
        categoryId: 'quick-round',
        title: 'JavaScript Quickfire',
        description: '10 rapid-fire questions on JS fundamentals.',
        totalQuestions: 5, // Reduced for demo
        timeLimit: '5 mins',
        difficulty: 'Easy',
        questions: [
            {
                id: 1,
                text: "Which of the following is NOT a JavaScript data type?",
                options: ["Number", "Boolean", "Float", "Undefined"],
                correctAnswer: 2 // Index of 'Float'
            },
            {
                id: 2,
                text: "What keyword is used to declare a constant variable?",
                options: ["var", "let", "const", "static"],
                correctAnswer: 2
            },
            {
                id: 3,
                text: "What is the output of '2' + 2 in JavaScript?",
                options: ["4", "22", "NaN", "Error"],
                correctAnswer: 1
            },
            {
                id: 4,
                text: "Which method is used to add an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: 0
            },
            {
                id: 5,
                text: "What does DOM stand for?",
                options: ["Data Object Model", "Document Object Model", "Digital Object Method", "Document Oriented Module"],
                correctAnswer: 1
            }
        ]
    },
    {
        id: 'css-selectors-quick',
        categoryId: 'quick-round',
        title: 'CSS Selectors Speed Run',
        description: 'Test your knowledge of CSS selectors quickly.',
        totalQuestions: 10,
        timeLimit: '5 mins',
        difficulty: 'Medium'
    },

    // Timed Test
    {
        id: 'full-stack-exam',
        categoryId: 'timed-test',
        title: 'Full Stack Developer Exam',
        description: 'Comprehensive test covering frontend and backend technologies.',
        totalQuestions: 50,
        timeLimit: '60 mins',
        difficulty: 'Hard'
    },
    {
        id: 'react-mastery-exam',
        categoryId: 'timed-test',
        title: 'React Mastery Assessment',
        description: 'Deep dive into React hooks, context, and performance.',
        totalQuestions: 60,
        timeLimit: '60 mins',
        difficulty: 'Hard'
    },

    // Job Prep
    {
        id: 'frontend-interview',
        categoryId: 'job-prep',
        title: 'Frontend Interview Questions',
        description: 'Common questions asked in frontend developer interviews.',
        totalQuestions: 20,
        timeLimit: '30 mins',
        difficulty: 'Medium'
    },
    {
        id: 'dsa-basics',
        categoryId: 'job-prep',
        title: 'Data Structures & Algorithms',
        description: 'Core concepts for coding interviews.',
        totalQuestions: 15,
        timeLimit: '25 mins',
        difficulty: 'Hard'
    },

    // College Prep
    {
        id: 'cs101-midterm',
        categoryId: 'college-prep',
        title: 'CS101: Intro to Programming',
        description: 'Mid-term preparation for Computer Science 101.',
        subject: 'Computer Science',
        semester: 1,
        degree: 'B.Tech / B.E.',
        totalQuestions: 30,
        timeLimit: '45 mins',
        difficulty: 'Medium'
    },
    {
        id: 'calc-1-final',
        categoryId: 'college-prep',
        title: 'Calculus I Final',
        description: 'Limits, derivatives, and integrals.',
        subject: 'Mathematics',
        semester: 1,
        degree: 'B.Sc',
        totalQuestions: 25,
        timeLimit: '90 mins',
        difficulty: 'Hard'
    },
    {
        id: 'physics-mechanics',
        categoryId: 'college-prep',
        title: 'Physics I: Mechanics',
        description: 'Newtonian mechanics and kinematics.',
        subject: 'Physics',
        semester: 2,
        degree: 'B.Sc',
        totalQuestions: 20,
        timeLimit: '60 mins',
        difficulty: 'Medium'
    },
    {
        id: 'dsa-midterm',
        categoryId: 'college-prep',
        title: 'Data Structures Midterm',
        description: 'Arrays, Linked Lists, Stacks, and Queues.',
        subject: 'Computer Science',
        semester: 3,
        degree: 'B.Tech / B.E.',
        totalQuestions: 35,
        timeLimit: '50 mins',
        difficulty: 'Hard'
    },
    {
        id: 'dbms-final',
        categoryId: 'college-prep',
        title: 'Database Management Systems',
        description: 'Final exam prep for DBMS course.',
        subject: 'Database Systems',
        semester: 4,
        degree: 'B.Tech / BCA',
        totalQuestions: 40,
        timeLimit: '60 mins',
        difficulty: 'Hard'
    },
    {
        id: 'os-internals',
        categoryId: 'college-prep',
        title: 'Operating Systems Internals',
        description: 'Processes, threads, and memory management.',
        subject: 'Computer Science',
        semester: 4,
        degree: 'B.Tech / B.E.',
        totalQuestions: 30,
        timeLimit: '45 mins',
        difficulty: 'Hard'
    },
    {
        id: 'dip-comp-net',
        categoryId: 'college-prep',
        title: 'Computer Networks Basics',
        description: 'OSI model, TCP/IP, and network topologies.',
        subject: 'Networking',
        semester: 3,
        degree: 'Diploma',
        totalQuestions: 25,
        timeLimit: '40 mins',
        difficulty: 'Medium'
    },
    {
        id: 'mba-marketing-mgmt',
        categoryId: 'college-prep',
        title: 'Marketing Management',
        description: 'Core concepts of marketing for business administration.',
        subject: 'Management',
        semester: 1,
        degree: 'MBA',
        totalQuestions: 40,
        timeLimit: '60 mins',
        difficulty: 'Hard'
    },
    {
        id: 'msc-data-analytics',
        categoryId: 'college-prep',
        title: 'Advanced Data Analytics',
        description: 'Big data concepts and statistical analysis.',
        subject: 'Data Science',
        semester: 2,
        degree: 'Master of Science',
        totalQuestions: 30,
        timeLimit: '50 mins',
        difficulty: 'Hard'
    }
];
