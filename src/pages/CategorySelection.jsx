import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { categories } from '../data/categories';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const CategorySelection = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-colors">
                <div className="max-w-7xl mx-auto transition-colors">
                    {/* Header */}
                    <div className="mb-8 transition-colors">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors mb-4"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Select a Quiz Category</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Choose tailored quizzes to boost your skills.</p>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 transition-colors">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => navigate(`/category/${category.id}`)}
                                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.gradient} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`} />

                                <div className="flex items-start justify-between relative z-10 transition-colors">
                                    <div className={`p-4 rounded-xl text-white bg-gradient-to-br ${category.gradient} shadow-lg mb-6`}>
                                        <category.icon size={32} />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CategorySelection;
