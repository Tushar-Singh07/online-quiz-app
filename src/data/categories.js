import { Zap, Clock, Briefcase, GraduationCap } from 'lucide-react';

export const categories = [
    {
        id: 'quick-round',
        name: 'Quick Round',
        description: 'Fast-paced quizzes to test your knowledge in minutes.',
        icon: Zap,
        color: 'bg-yellow-500',
        gradient: 'from-yellow-400 to-orange-500'
    },
    {
        id: 'timed-test',
        name: 'Timed Test (1 Hour)',
        description: 'Full-length practice tests to simulate real exam conditions.',
        icon: Clock,
        color: 'bg-blue-500',
        gradient: 'from-blue-400 to-indigo-500'
    },
    {
        id: 'job-prep',
        name: 'Job Interview Prep',
        description: 'Prepare for technical interviews with industry-standard questions.',
        icon: Briefcase,
        color: 'bg-green-500',
        gradient: 'from-green-400 to-emerald-500'
    },
    {
        id: 'college-prep',
        name: 'College / University Prep',
        description: 'Subject-wise and semester-wise quizzes for academic excellence.',
        icon: GraduationCap,
        color: 'bg-purple-500',
        gradient: 'from-purple-400 to-pink-500'
    }
];
