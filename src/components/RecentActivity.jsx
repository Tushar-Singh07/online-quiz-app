import { PlayCircle, BookOpen } from 'lucide-react';

const RecentActivity = ({ activities = [], loading = false }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">Recent Activity</h2>
                <div className="space-y-4 transition-colors">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-600 transition-colors" />
                            <div className="flex-1 space-y-2 transition-colors">
                                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2 transition-colors" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/4 transition-colors" />
                            </div>
                            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-600 rounded-full transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">Recent Activity</h2>
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 transition-colors">
                    <BookOpen size={48} className="mb-4 opacity-30 transition-colors" />
                    <p className="font-semibold text-lg transition-colors">No quizzes taken yet</p>
                    <p className="text-sm mt-1 transition-colors">Start a quiz to see your activity here!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">Recent Activity</h2>
            <div className="space-y-4 transition-colors">
                {activities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-4 transition-colors">
                            <div className={`p-2 rounded-lg ${item.percentage >= 70 ? 'bg-green-100 text-green-600' : item.percentage >= 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                <PlayCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100 transition-colors">{item.quiz}</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{item.category} · {item.date}</p>
                            </div>
                        </div>
                        <div className="text-right transition-colors">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                item.percentage >= 70
                                    ? 'bg-green-100 text-green-700'
                                    : item.percentage >= 40
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {item.percentage}%
                            </span>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 transition-colors">{item.score}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
