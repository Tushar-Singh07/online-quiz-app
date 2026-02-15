import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import { Trophy, Clock, Target, Zap } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed width */}
      <Sidebar />

      {/* Main Content - offset by sidebar width */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Hello, Student! 👋</h1>
            <p className="text-slate-500 mt-1">Here's what's happening with your learning today.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
            <Zap size={20} />
            Start New Quiz
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Trophy}
            label="Total Points"
            value="2,450"
            color="bg-purple-500"
          />
          <StatCard
            icon={Target}
            label="Quizzes Taken"
            value="12"
            color="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            label="Time Spent"
            value="5h 45m"
            color="bg-green-500"
          />
          <StatCard
            icon={Zap}
            label="Current Streak"
            value="4 Days"
            color="bg-orange-500"
          />
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart/Activity Area */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Side Panel or Leaderboard could go here */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-4">Pro Tip 💡</h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Consistently taking quizzes helps improve retention by up to 40%. Keep up the good work!
            </p>
            <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
              View Study Plan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
