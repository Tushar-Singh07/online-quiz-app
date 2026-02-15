import { PlayCircle } from 'lucide-react';

const RecentActivity = () => {
    const activities = [
        { quiz: "JavaScript Basics", score: "8/10", date: "2 hours ago", status: "Completed" },
        { quiz: "React Components", score: "Pending", date: "Yesterday", status: "In Progress" },
        { quiz: "CSS Layouts", score: "9/10", date: "2 days ago", status: "Completed" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <PlayCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">{item.quiz}</h4>
                                <p className="text-sm text-slate-500">{item.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {item.status}
                            </span>
                            <p className="text-sm font-bold text-slate-700 mt-1">{item.score}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
