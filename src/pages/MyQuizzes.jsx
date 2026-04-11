import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Clock, CheckCircle, XCircle, PlayCircle, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyQuizzes = () => {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [saved, setSaved] = useState([]);

    useEffect(() => {
        const fetchHistoryAndSaved = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) return navigate("/");

                // Fetch History
                const resResults = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/results/user/${user._id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (resResults.ok) {
                    const data = await resResults.json();
                    
                    const formattedHistory = data.map(result => ({
                        id: result._id,
                        title: result.quiz?.title || 'Deleted Quiz',
                        date: new Date(result.createdAt).toISOString().split('T')[0],
                        score: `${result.score}/${result.totalQuestions}`,
                        status: result.score >= (result.totalQuestions / 2) ? 'Passed' : 'Failed'
                    }));
                    setHistory(formattedHistory);
                }

                // Fetch all quizzes to filter saved
                const resQuizzes = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/quizzes`);
                if (resQuizzes.ok) {
                    const allQuizzes = await resQuizzes.json();
                    const savedIds = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
                    const savedQuizzes = allQuizzes.filter(q => savedIds.includes(q._id || q.id));
                    setSaved(savedQuizzes);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchHistoryAndSaved();
    }, [navigate]);

    const removeSaved = (id) => {
        const savedIds = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
        const newSavedIds = savedIds.filter(savedId => savedId !== id);
        localStorage.setItem('savedQuizzes', JSON.stringify(newSavedIds));
        setSaved(saved.filter(q => (q._id || q.id) !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-colors">
                <div className="max-w-6xl mx-auto transition-colors">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 transition-colors">My Quizzes</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-colors">
                        {/* History Section */}
                        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
                                <Clock className="text-blue-600 transition-colors" size={24} />
                                Attempt History
                            </h2>
                            <div className="space-y-4 transition-colors">
                                {history.length > 0 ? history.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 transition-colors">{item.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">{item.date}</p>
                                        </div>
                                        <div className="text-right transition-colors">
                                            <div className="flex items-center gap-2 mb-1 justify-end transition-colors">
                                                {item.status === 'Passed' ?
                                                    <CheckCircle size={16} className="text-green-500 transition-colors" /> :
                                                    <XCircle size={16} className="text-red-500 transition-colors" />
                                                }
                                                <span className={`text-sm font-bold ${item.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.score}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-2 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600 transition-colors">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 p-4 transition-colors">No quiz history yet. Take a quiz!</p>
                                )}
                            </div>
                        </section>

                        {/* Saved Quizzes Section */}
                        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
                                <Bookmark className="text-purple-600 transition-colors" size={24} />
                                Saved for Later
                            </h2>
                            <div className="space-y-4 transition-colors">
                                {saved.length > 0 ? (
                                    saved.map((item) => (
                                        <div key={item._id || item.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                            <div className="flex justify-between items-start mb-2 transition-colors">
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                                <button
                                                    onClick={() => removeSaved(item._id || item.id)}
                                                    className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                                                    title="Remove from saved"
                                                >
                                                    <Bookmark size={18} fill="currentColor" className="text-purple-600 transition-colors" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 transition-colors">
                                                <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 flex gap-3 transition-colors">
                                                    <span>{item.questions?.length || item.totalQuestions} Qs</span>
                                                    <span>•</span>
                                                    <span>{item.timeLimit} mins</span>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/quiz/${item._id || item.id}/play`)}
                                                    className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
                                                >
                                                    Start Now <PlayCircle size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">
                                        <Bookmark size={32} className="mx-auto mb-2 opacity-20 transition-colors" />
                                        <p>No saved quizzes yet.</p>
                                        <button
                                            onClick={() => navigate('/categories')}
                                            className="text-sm text-blue-600 font-medium hover:underline mt-2 transition-colors"
                                        >
                                            Explore Categories
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyQuizzes;
