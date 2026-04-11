import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Trash2 } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      } else {
        setError("Not authorized or fetch failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-colors">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 transition-colors">Manage Users</h1>
        {error && <p className="text-red-500 mb-4 transition-colors">{error}</p>}
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto transition-colors">
          <table className="w-full text-left border-collapse transition-colors">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600 transition-colors">
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold transition-colors">Name</th>
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold transition-colors">Email</th>
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold transition-colors">Role</th>
                <th className="py-3 px-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold text-right transition-colors">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-100 transition-colors">{u.firstName} {u.lastName}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 transition-colors">{u.email}</td>
                  <td className="py-4 px-4 transition-colors">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right transition-colors">
                    <button 
                      onClick={() => handleDelete(u._id)}
                      disabled={u.role === 'admin'}
                      className={`p-2 rounded-lg transition-colors ${u.role === 'admin' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50'}`}
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

export default ManageUsers;
