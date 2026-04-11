import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Brain, Lock, ArrowRight, ArrowLeft } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) return setError("Please fill in both fields");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Password has been successfully reset! You can now log in.");
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || "Failed to reset password. The link might exist or have expired.");
      }
    } catch (err) {
      setError("Error connecting to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans text-slate-800 dark:text-slate-100 flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl animate-fade-in-up border border-slate-100 dark:border-slate-700 transition-colors">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="flex items-center gap-3 mb-6 transition-colors">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 transition-colors">
            <Brain size={24} className="text-white transition-colors" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent transition-colors">
            QuizMaster
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2 transition-colors">Create New Password</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-8 text-sm transition-colors">Please formulate a strong new password below.</p>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-semibold text-sm transition-colors">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-semibold text-sm transition-colors">
            {message}
          </div>
        )}

        <div className="space-y-4 mb-8 transition-colors">
          <div className="relative group transition-colors">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder="New Password"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </div>
          
          <div className="relative group transition-colors">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
            />
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading || Boolean(message)}
          className="w-full text-white py-4 rounded-2xl transition-all flex justify-center items-center gap-2 font-bold disabled:opacity-70 disabled:bg-slate-400 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
        >
          {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
