const StatCard = ({ icon: Icon, label, value, color }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow transition-colors">
            <div className="flex items-center justify-between mb-4 transition-colors">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} className="text-white transition-colors" />
                </div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{value}</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{label}</h3>
        </div>
    );
};

export default StatCard;
