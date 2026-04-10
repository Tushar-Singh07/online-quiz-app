import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Target, TrendingUp, Award, Hash, BarChart2 } from 'lucide-react';

// ─── Empty State Component ───────────────────────────────────────────
const EmptyChart = ({ message = "No data yet. Take some quizzes to see your progress!" }) => (
    <div className="h-80 w-full flex flex-col items-center justify-center text-slate-300 transition-colors">
        <BarChart2 size={56} className="mb-4 opacity-40 transition-colors" />
        <p className="text-slate-400 dark:text-slate-500 font-medium text-center text-sm leading-relaxed max-w-xs transition-colors">{message}</p>
    </div>
);

// ─── Metric Card ─────────────────────────────────────────────────────
const MetricCard = ({ icon: Icon, label, value, color, sub }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
        <div className={`p-3 ${color} rounded-xl`}><Icon size={24} /></div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium transition-colors">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{value}</h3>
            {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{sub}</p>}
        </div>
    </div>
);

// ─── Skeleton loader ──────────────────────────────────────────────────
const Skeleton = () => (
    <div className="h-80 w-full animate-pulse flex flex-col gap-3 justify-end pb-4 px-4 transition-colors">
        {[60, 80, 50, 90, 70, 85, 65].map((h, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors" style={{ height: `${h}%`, width: `${100 / 7 - 2}%`, display: 'inline-block', marginRight: '2%' }} />
        ))}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────
const Analytics = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/results/me/analytics', {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (err) {
                console.error('Failed to load analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const hasData = data && (data.dailyProgress?.length > 0 || data.categoryData?.length > 0);
    const improvementColor = data?.improvement >= 0 ? 'text-green-600' : 'text-red-500';
    const improvementPrefix = data?.improvement >= 0 ? '+' : '';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-colors">
                <div className="max-w-7xl mx-auto transition-colors">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 transition-colors">Performance Analytics</h1>

                    {/* ── Key Metrics ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-colors">
                        <MetricCard
                            icon={Target}
                            label="Average Score"
                            value={loading ? '...' : (data?.avgScore ? `${data.avgScore}%` : '—')}
                            color="bg-blue-100 text-blue-600"
                            sub={!loading && !data?.avgScore ? 'No quizzes taken yet' : undefined}
                        />
                        <MetricCard
                            icon={TrendingUp}
                            label="Improvement"
                            value={loading ? '...' : (data?.improvement !== undefined && data?.totalAnswered > 0
                                ? <span className={improvementColor}>{improvementPrefix}{data.improvement}%</span>
                                : '—')}
                            color="bg-green-100 text-green-600"
                            sub={!loading && !data?.totalAnswered ? 'Take 2+ quizzes to see' : 'vs. your first half'}
                        />
                        <MetricCard
                            icon={Award}
                            label="Quizzes Passed"
                            value={loading ? '...' : (data?.quizzesPassed ?? '—')}
                            color="bg-orange-100 text-orange-600"
                            sub="Score ≥ 60%"
                        />
                        <MetricCard
                            icon={Hash}
                            label="Total Answers"
                            value={loading ? '...' : (data?.totalAnswered ?? '—')}
                            color="bg-purple-100 text-purple-600"
                            sub="Questions attempted"
                        />
                    </div>

                    {/* ── Charts Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-colors">

                        {/* Daily Progress */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors">Daily Progress</h2>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 transition-colors">Average score per activity day (last 7)</p>
                            {loading ? (
                                <Skeleton />
                            ) : !data?.dailyProgress?.length ? (
                                <EmptyChart message="No quiz history yet. Complete quizzes to track your daily score trend." />
                            ) : (
                                <div className="h-80 w-full transition-colors">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.dailyProgress}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} unit="%" />
                                            <Tooltip
                                                formatter={(v) => [`${v}%`, 'Avg Score']}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" dot={{ r: 4, fill: '#3b82f6' }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Category Performance */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors">Category Performance</h2>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 transition-colors">Correct vs Wrong % per quiz category</p>
                            {loading ? (
                                <Skeleton />
                            ) : !data?.categoryData?.length ? (
                                <EmptyChart message="No category data yet. Take quizzes across different categories to see your breakdown." />
                            ) : (
                                <div className="h-80 w-full transition-colors">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.categoryData} layout="vertical" margin={{ left: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                            <XAxis type="number" hide domain={[0, 100]} />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 500 }} width={90} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                                formatter={(v, name) => [`${v}%`, name]}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="correct" name="Correct %" stackId="a" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={28} />
                                            <Bar dataKey="wrong" name="Wrong %" stackId="a" fill="#f87171" radius={[0, 4, 4, 0]} barSize={28} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
