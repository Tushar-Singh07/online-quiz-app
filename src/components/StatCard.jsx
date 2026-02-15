const StatCard = ({ icon: Icon, label, value, color }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{value}</span>
            </div>
            <h3 className="text-slate-500 font-medium">{label}</h3>
        </div>
    );
};

export default StatCard;
