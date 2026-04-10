import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await fetch('http://localhost:5000/api/admin/quizzes', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) setQuizzes(await res.json());
      } catch (err) {
        console.error("Error fetching quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz and all its results?")) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`http://localhost:5000/api/admin/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setQuizzes(quizzes.filter(q => q._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-colors">
        <div className="flex justify-between items-center mb-8 transition-colors">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Manage Quizzes</h1>
                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1 transition-colors">Add, review, or delete quizzes on the platform.</p>
            </div>
            <button 
                onClick={() => navigate('/admin/quizzes/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
                <Plus size={20} /> Create New Quiz
            </button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto transition-colors">
          <table className="w-full text-left border-collapse transition-colors">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600 transition-colors">
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold transition-colors">Title</th>
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold transition-colors">Category</th>
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold transition-colors">Questions</th>
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold text-right transition-colors">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">No quizzes available. Try creating one!</td></tr>
              ) : quizzes.map((q) => (
                <tr key={q._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100 transition-colors">{q.title}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium transition-colors">{q.category}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium transition-colors">{q.questions?.length || 0}</td>
                  <td className="py-4 px-4 flex justify-end gap-2 transition-colors">
                    <button 
                      onClick={() => handleDelete(q._id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageQuizzes;
