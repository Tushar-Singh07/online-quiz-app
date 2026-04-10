import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import { Trophy, Target, Star, Zap, Crown, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalPoints: 0,
    totalQuizzes: 0,
    bestScore: 0,
    streak: 0,
    recentActivity: []
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, leaderboardRes] = await Promise.all([
          fetch('http://localhost:5000/api/results/me/stats', {
            headers: { Authorization: `Bearer ${user?.token}` }
          }),
          fetch('http://localhost:5000/api/results/leaderboard', {
            headers: { Authorization: `Bearer ${user?.token}` }
          })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (leaderboardRes.ok) setLeaderboard(await leaderboardRes.json());
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user?.token]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-colors">
        <header className="flex justify-between items-center mb-8 transition-colors">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Hello, {user?.firstName || 'Student'}! 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Here's what's happening with your learning today.</p>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Zap size={20} />
            Start New Quiz
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-colors">
          <StatCard
            icon={Trophy}
            label="Total Points"
            value={loading ? '...' : stats.totalPoints.toString()}
            color="bg-purple-500"
          />
          <StatCard
            icon={Target}
            label="Quizzes Taken"
            value={loading ? '...' : stats.totalQuizzes.toString()}
            color="bg-blue-500"
          />
          <StatCard
            icon={Star}
            label="Best Score"
            value={loading ? '...' : `${stats.bestScore}%`}
            color="bg-green-500"
          />
          <StatCard
            icon={Zap}
            label="Current Streak"
            value={loading ? '...' : `${stats.streak} Day${stats.streak !== 1 ? 's' : ''}`}
            color="bg-orange-500"
          />
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-colors">
          <div className="lg:col-span-2 transition-colors">
            <RecentActivity activities={stats.recentActivity} loading={loading} />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-5 flex items-center gap-3 transition-colors">
              <div className="bg-white/20 dark:bg-slate-800/20 rounded-xl p-2 transition-colors">
                <Crown className="text-white transition-colors" size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white transition-colors">Global Leaderboard</h2>
                <p className="text-yellow-100 text-xs font-medium transition-colors">Top performers this week</p>
              </div>
            </div>

            <div className="p-5 transition-colors">
              <div className="space-y-2 transition-colors">
                {loading ? (
                  [1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse transition-colors">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 shrink-0 transition-colors" />
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 shrink-0 transition-colors" />
                      <div className="flex-1 space-y-1.5 transition-colors">
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-3/4 transition-colors" />
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-600 rounded w-1/2 transition-colors" />
                      </div>
                      <div className="w-10 h-5 bg-slate-200 dark:bg-slate-600 rounded transition-colors" />
                    </div>
                  ))
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 transition-colors">
                    <Trophy size={36} className="mx-auto mb-3 opacity-30 transition-colors" />
                    <p className="font-semibold transition-colors">No results yet</p>
                    <p className="text-sm mt-1 transition-colors">Be the first on the board!</p>
                  </div>
                ) : (
                  leaderboard.map((student, index) => {
                    const isCurrentUser = student._id === user?._id;
                    const rankColors = [
                      'bg-yellow-100 text-yellow-700 border-yellow-300',
                      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600',
                      'bg-orange-100 text-orange-700 border-orange-300'
                    ];
                    const rankLabel = ['🥇', '🥈', '🥉'];
                    const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();
                    const avatarColors = ['bg-purple-500','bg-blue-500','bg-green-500','bg-orange-500','bg-pink-500'];

                    return (
                      <div
                        key={student._id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isCurrentUser
                            ? 'bg-blue-50 border border-blue-200'
                            : index === 0
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border ${
                          index < 3 ? rankColors[index] : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600'
                        }`}>
                          {index < 3 ? rankLabel[index] : `#${index + 1}`}
                        </div>

                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                          {initials || '?'}
                        </div>

                        {/* Name & quizzes */}
                        <div className="flex-1 min-w-0 transition-colors">
                          <p className={`font-semibold truncate text-sm ${
                            index === 0 ? 'text-amber-900' : isCurrentUser ? 'text-blue-700' : 'text-slate-800 dark:text-slate-100'
                          }`}>
                            {student.firstName} {student.lastName}
                            {isCurrentUser && <span className="ml-1 text-xs text-blue-500 font-bold transition-colors">(You)</span>}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{student.quizzesTaken} quiz{student.quizzesTaken !== 1 ? 'zes' : ''}</p>
                        </div>

                        {/* Points */}
                        <div className="text-right transition-colors">
                          <p className={`font-black text-base ${
                            index === 0 ? 'text-amber-600' : isCurrentUser ? 'text-blue-600' : 'text-slate-700 dark:text-slate-200'
                          }`}>{student.totalPoints}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors">pts</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => navigate('/categories')}
                className="w-full mt-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-orange-200 transition-colors"
              >
                <Zap size={16} /> Earn More Points
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
