import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Mail, Lock, Sparkles, ArrowRight, GraduationCap, BookOpenCheck } from "lucide-react";

function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return setError("Please enter email and password");
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Role-gate: ensure user is logging in with correct role
        if (role === "faculty" && data.role !== "faculty" && data.role !== "admin") {
          return setError("This account is not registered as Faculty. Please use Student login.");
        }
        if (role === "student" && (data.role === "faculty" || data.role === "admin")) {
          return setError("This account is not registered as Student. Please use Faculty login.");
        }

        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("loggedIn", "true");

        // Redirect based on role
        if (data.role === "faculty" || data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = role === "student";

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-200 font-sans text-slate-800 dark:text-slate-100">
      {/* Left: Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 xl:p-24 relative transition-colors">
        <div className="w-full max-w-md animate-fade-in-up transition-colors">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer transition-colors" onClick={() => navigate('/')}>
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 transition-colors">
              <Brain size={28} className="text-white transition-colors" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent transition-colors">
              QuizMaster
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-3 transition-colors">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-lg transition-colors">Log in to track your progress and conquer new challenges.</p>

          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl mb-8 gap-1 transition-colors">
            <button
              onClick={() => { setRole("student"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isStudent
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <GraduationCap size={18} />
              Login as Student
            </button>
            <button
              onClick={() => { setRole("faculty"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                !isStudent
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <BookOpenCheck size={18} />
              Login as Faculty
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 font-semibold text-sm transition-all">
              <div className="min-w-2 min-h-2 w-2 h-2 rounded-full bg-red-500 animate-pulse transition-colors" />
              {error}
            </div>
          )}

          <div className="space-y-5 mb-8 transition-colors">
            <div className="relative group transition-colors">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:font-normal placeholder:text-slate-400"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="relative group transition-colors">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:font-normal placeholder:text-slate-400"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full text-white py-4 rounded-2xl transition-all flex justify-center items-center gap-2 font-bold text-lg disabled:opacity-70 disabled:hover:translate-y-0 hover:-translate-y-0.5 shadow-xl ${
              isStudent
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:shadow-blue-600/40"
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30 hover:shadow-purple-600/40"
            }`}
          >
            {loading ? 'Authenticating...' : `Sign In as ${isStudent ? 'Student' : 'Faculty'}`} <ArrowRight size={20} />
          </button>

          <p className="text-center mt-5 text-blue-600 font-bold cursor-pointer hover:underline underline-offset-4 transition-colors" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </p>

          <p className="text-center mt-4 text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-bold hover:text-blue-800 transition-colors hover:underline underline-offset-4"
              onClick={() => navigate("/signup")}
            >
              Sign up for free
            </span>
          </p>
        </div>
      </div>

      {/* Right: Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-100 dark:bg-slate-700 relative overflow-hidden items-center justify-center p-12 transition-colors">
        <div className={`absolute inset-0 transition-colors duration-500 ${isStudent ? 'bg-blue-600' : 'bg-purple-700'}`} />
        <div className={`absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse transition-colors duration-500 ${isStudent ? 'bg-indigo-500' : 'bg-pink-500'}`} />
        <div className={`absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse transition-colors duration-500 ${isStudent ? 'bg-cyan-400' : 'bg-indigo-400'}`} style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 transition-colors" />

        {/* Floating Glass Card */}
        <div className="relative z-10 w-full max-w-lg bg-white/10 dark:bg-slate-800/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl transition-transform hover:scale-105 duration-500 transition-colors">
          <div className="w-16 h-16 bg-white/20 dark:bg-slate-800/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-white transition-colors">
            {isStudent ? <GraduationCap size={32} /> : <BookOpenCheck size={32} />}
          </div>
          {isStudent ? (
            <>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight transition-colors">Master your skills, <br/>one quiz at a time.</h2>
              <p className="text-blue-100 text-lg font-medium leading-relaxed transition-colors">
                Join thousands of students testing their knowledge across diverse subjects. Beautiful, fast, and remarkably powerful.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight transition-colors">Empower your<br/>students.</h2>
              <p className="text-purple-100 text-lg font-medium leading-relaxed transition-colors">
                Create engaging quizzes, track student performance, and manage your academic content — all in one place.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
