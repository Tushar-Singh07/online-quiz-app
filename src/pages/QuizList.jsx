import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { categories } from '../data/categories';
import { ArrowLeft, Clock, BarChart, BookOpen, ChevronRight, Play, Filter, Bookmark } from 'lucide-react';

const QuizList = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    // College Prep Filter State
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedSemester, setSelectedSemester] = useState('All');
    const [selectedDegree, setSelectedDegree] = useState('All');

    const category = categories.find(c => c.id === categoryId);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/quizzes");
                const data = await res.json();
                if (res.ok) {
                    setQuizzes(data);
                }
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    // Memoized filtered quizzes
    const filteredQuizzes = useMemo(() => {
        let qs = quizzes.filter(q => q.category === categoryId || q.categoryId === categoryId);

        if (categoryId === 'college-prep') {
            if (selectedSubject !== 'All') {
                qs = qs.filter(q => q.subject === selectedSubject);
            }
            if (selectedSemester !== 'All') {
                qs = qs.filter(q => q.semester === Number(selectedSemester));
            }
            if (selectedDegree !== 'All') {
                qs = qs.filter(q => q.degree === selectedDegree);
            }
        }
        return qs;
    }, [quizzes, categoryId, selectedSubject, selectedSemester, selectedDegree]);

    // Extract unique subjects and semesters for filters
    const { subjects, semesters, degrees } = useMemo(() => {
        if (categoryId !== 'college-prep') return { subjects: [], semesters: [], degrees: [] };

        const allQuizzes = quizzes.filter(q => q.category === 'college-prep' || q.categoryId === 'college-prep');
        const uniqueSubjects = [...new Set(allQuizzes.map(q => q.subject).filter(Boolean))].sort();
        const uniqueSemesters = [...new Set(allQuizzes.map(q => q.semester).filter(Boolean))].sort((a, b) => a - b);
        const uniqueDegrees = [...new Set(allQuizzes.map(q => q.degree).filter(Boolean))].sort();
        return { subjects: uniqueSubjects, semesters: uniqueSemesters, degrees: uniqueDegrees };
    }, [quizzes, categoryId]);

    // Bookmark Logic
    const [savedQuizIds, setSavedQuizIds] = useState(() => {
        const saved = localStorage.getItem('savedQuizzes');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleBookmark = (e, quizId) => {
        e.stopPropagation(); // Prevent navigating to quiz
        let newSavedIds;
        if (savedQuizIds.includes(quizId)) {
            newSavedIds = savedQuizIds.filter(id => id !== quizId);
        } else {
            newSavedIds = [...savedQuizIds, quizId];
        }
        setSavedQuizIds(newSavedIds);
        localStorage.setItem('savedQuizzes', JSON.stringify(newSavedIds));
    };

    if (!category) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200 items-center justify-center">
                <div className="text-center transition-colors">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Category not found</h2>
                    <button
                        onClick={() => navigate('/categories')}
                        className="mt-4 text-blue-600 hover:underline transition-colors"
                    >
                        Return to Categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-colors">
                <div className="max-w-6xl mx-auto transition-colors">
                    {/* Header */}
                    <button
                        onClick={() => navigate('/categories')}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Categories
                    </button>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between overflow-hidden relative transition-colors">
                        <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${category.gradient} opacity-10 rounded-full blur-3xl`} />

                        <div className="relative z-10 flex items-center gap-6 transition-colors">
                            <div className={`p-4 rounded-xl text-white bg-gradient-to-br ${category.gradient} shadow-lg`}>
                                <category.icon size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{category.name}</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">{filteredQuizzes.length} Quizzes Available</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section (Only for College Prep) */}
                    {categoryId === 'college-prep' && (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex flex-wrap gap-4 items-center transition-colors">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium mr-2 transition-colors">
                                <Filter size={18} />
                                Filters:
                            </div>

                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-colors"
                            >
                                <option value="All">All Subjects</option>
                                {subjects.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>

                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-colors"
                            >
                                <option value="All">All Semesters</option>
                                {semesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>

                            <select
                                value={selectedDegree}
                                onChange={(e) => setSelectedDegree(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-colors"
                            >
                                <option value="All">Degree</option>
                                {degrees.map(Deg => (
                                    <option key={Deg} value={Deg}>Degree{Deg}</option>
                                ))}
                            </select>

                            {(selectedSubject !== 'All' || selectedSemester !== 'All') && (
                                <button
                                    onClick={() => { setSelectedSubject('All'); setSelectedSemester('All'); }}
                                    className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12 transition-colors">
                            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse transition-colors">Loading quizzes...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 transition-colors">
                            {filteredQuizzes.length > 0 ? (
                                filteredQuizzes.map((quiz) => (
                                    <div
                                        key={quiz._id || quiz.id}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-blue-100 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex-1 transition-colors">
                                            <div className="flex items-center justify-between mb-2 transition-colors">
                                                <div className="flex items-center gap-3 transition-colors">
                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                                        {quiz.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                                        ${quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                            quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'}`}>
                                                        {quiz.difficulty}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => toggleBookmark(e, quiz._id || quiz.id)}
                                                    className={`p-2 rounded-full transition-colors ${savedQuizIds.includes(quiz._id || quiz.id) ? 'text-purple-600 bg-purple-50' : 'text-slate-300 hover:text-purple-400'}`}
                                                >
                                                    <Bookmark size={20} fill={savedQuizIds.includes(quiz._id || quiz.id) ? "currentColor" : "none"} />
                                                </button>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 transition-colors">{quiz.description}</p>
    
                                            <div className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-500 transition-colors">
                                                <div className="flex items-center gap-2 transition-colors">
                                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md transition-colors">
                                                        <BookOpen size={14} />
                                                    </div>
                                                    {quiz.questions?.length || quiz.totalQuestions} Questions
                                                </div>
                                                <div className="flex items-center gap-2 transition-colors">
                                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md transition-colors">
                                                        <Clock size={14} />
                                                    </div>
                                                    {quiz.timeLimit} mins
                                                </div>
                                                {quiz.subject && (
                                                    <div className="flex items-center gap-2 transition-colors">
                                                        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md transition-colors">
                                                            <BarChart size={14} />
                                                        </div>
                                                        {quiz.subject} (Sem {quiz.semester})
                                                    </div>
                                                )}
                                            </div>
                                        </div>
    
                                        <button
                                            onClick={() => navigate(`/quiz/${quiz._id || quiz.id}/play`)}
                                            className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 group-hover:translate-x-1 ml-4"
                                        >
                                            Start Quiz
                                            <Play size={18} fill="currentColor" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 transition-colors">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">No quizzes match your filters.</p>
                                    <button
                                        onClick={() => { setSelectedSubject('All'); setSelectedSemester('All'); }}
                                        className="mt-2 text-blue-600 hover:underline transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuizList;
