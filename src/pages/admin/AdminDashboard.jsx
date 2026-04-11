import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { Users, BookOpen, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalQuizzes: 0, totalResults: 0 });
  const user = JSON.parse(localStorage.getItem('user'));
  const isFaculty = user?.role === 'faculty';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching admin stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-colors">
        <header className="mb-8 transition-colors">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{isFaculty ? 'Faculty Dashboard' : 'Admin Dashboard'}</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1 transition-colors">Platform overview and general statistics.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-colors">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers.toString()}
            color="bg-purple-500"
          />
          <StatCard
            icon={BookOpen}
            label="Total Quizzes"
            value={stats.totalQuizzes.toString()}
            color="bg-blue-500"
          />
          <StatCard
            icon={BarChart}
            label="Total Results Submitted"
            value={stats.totalResults.toString()}
            color="bg-green-500"
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
