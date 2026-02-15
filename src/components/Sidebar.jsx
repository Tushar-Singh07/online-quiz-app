import { Home, BarChart2, User, LogOut, BookOpen, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        navigate("/");
    };

    const navItems = [
        { icon: <Home size={20} />, label: 'Dashboard', active: true },
        { icon: <BookOpen size={20} />, label: 'My Quizzes', active: false },
        { icon: <BarChart2 size={20} />, label: 'Analytics', active: false },
        { icon: <User size={20} />, label: 'Profile', active: false },
        { icon: <Settings size={20} />, label: 'Settings', active: false },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl fixed left-0 top-0">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    QuizMaster
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
