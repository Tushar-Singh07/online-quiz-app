import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Mail, ArrowRight, ArrowLeft } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset link sent! Please check your email.");
      } else {
        setError(data.message || "Failed to process request.");
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

        <h1 className="text-2xl font-bold tracking-tight mb-2 transition-colors">Reset Password</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-8 text-sm transition-colors">Enter the email address associated with your account and we'll send you a secure link to reset your password.</p>

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

        <div className="space-y-5 mb-8 transition-colors">
          <div className="relative group transition-colors">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:text-slate-500"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); setMessage(""); }}
              onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
            />
          </div>
        </div>

        <button
          onClick={handleForgotPassword}
          disabled={loading || Boolean(message)}
          className="w-full text-white py-4 rounded-2xl transition-all flex justify-center items-center gap-2 font-bold disabled:opacity-70 disabled:bg-slate-400 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
        >
          {loading ? 'Sending link...' : 'Send Reset Link'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
