import { Home, BarChart2, LogOut, BookOpen, Settings, Brain } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        navigate("/");
    };

    const baseNavItems = [
        { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <BookOpen size={20} />, label: 'My Quizzes', path: '/my-quizzes' },
        { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    const adminNavItems = [
        { icon: <Home size={20} />, label: 'Admin Panel', path: '/admin' },
        { icon: <BookOpen size={20} />, label: 'Manage Quizzes', path: '/admin/quizzes' },
        { icon: <BarChart2 size={20} />, label: 'Manage Users', path: '/admin/users' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    const user = JSON.parse(localStorage.getItem('user'));
    
    let navItems = baseNavItems;
    if (user?.role === 'admin') {
        navItems = adminNavItems;
    } else if (user?.role === 'faculty') {
        navItems = [
            { icon: <Home size={20} />, label: 'Faculty Dashboard', path: '/admin' },
            { icon: <BookOpen size={20} />, label: 'Manage Quizzes', path: '/admin/quizzes' },
            { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
        ];
    }

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl fixed left-0 top-0 transition-colors">
            <div className="p-6 border-b border-slate-700 transition-colors">
                <div className="flex items-center gap-3 transition-colors">
                    <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg shadow-lg shadow-blue-500/30 transition-colors">
                        <Brain size={24} className="text-white transition-colors" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide transition-colors">
                        QuizMaster
                    </h1>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 transition-colors">
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium transition-colors">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-700 transition-colors">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium transition-colors">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
