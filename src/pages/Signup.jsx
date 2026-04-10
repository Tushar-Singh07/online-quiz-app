import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, User, Mail, Lock, Calendar, BookOpen, ChevronDown, CheckCircle, GraduationCap, BookOpenCheck } from "lucide-react";

// Defined OUTSIDE Signup to prevent remount on every keystroke
const InputField = ({ icon: Icon, type, name, placeholder, options, value, onChange }) => (
  <div className="relative group col-span-1 transition-colors">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
      <Icon size={18} />
    </div>
    {options ? (
      <>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-slate-100 font-medium appearance-none cursor-pointer ${!value && 'text-slate-400 dark:text-slate-500'}`}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt === placeholder ? "" : opt} disabled={opt === placeholder} className="text-slate-800 dark:text-slate-100 transition-colors">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
          <ChevronDown size={18} />
        </div>
      </>
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:font-normal placeholder:text-slate-400"
      />
    )}
  </div>
);

function Signup() {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", gender: "", dob: "", stream: "", branch: "", password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, gender, dob, stream, branch, password } = formData;
    if (!firstName || !lastName || !email || !password || !gender || !dob || !stream || !branch) {
      return setError("Please fill all required fields");
    }
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("loggedIn", "true");
        if (data.role === 'faculty' || data.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-slate-800 font-sans text-slate-800 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Right: Visual Side */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative overflow-hidden flex-col items-center justify-center p-12 transition-colors">
        <div className="absolute inset-0 bg-indigo-900 transition-colors" />
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-br from-indigo-500/40 to-blue-500/0 rounded-bl-full transition-colors" />
        <div className="absolute bottom-0 left-0 w-full h-[600px] bg-gradient-to-tr from-purple-600/40 to-indigo-900/0 rounded-tr-full transition-colors" />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 transition-colors" />

        <div className="relative z-10 w-full max-w-sm transition-colors">
          <div className="p-4 bg-white/10 dark:bg-slate-800/10 backdrop-blur-md rounded-3xl border border-white/10 mb-10 shadow-2xl transition-transform hover:-translate-y-2 duration-500 transition-colors">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-colors">
                      <CheckCircle className="text-white transition-colors" size={24} />
                  </div>
                  <div>
                      <p className="text-white font-bold tracking-wide transition-colors">Fast Registration</p>
                      <p className="text-indigo-200 text-sm font-medium transition-colors">Takes less than a minute</p>
                  </div>
              </div>
              <div className="flex flex-col gap-3 transition-colors">
                  <div className="h-2.5 w-full bg-white/20 dark:bg-slate-800/20 rounded-full overflow-hidden transition-colors">
                      <div className="w-1/3 h-full bg-blue-400 rounded-full animate-pulse transition-colors" />
                  </div>
                  <div className="h-2.5 w-3/4 bg-white/10 dark:bg-slate-800/10 rounded-full transition-colors" />
              </div>
          </div>
          
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight transition-colors">Start Your Journey.</h2>
          <p className="text-indigo-200 text-lg font-medium leading-relaxed transition-colors">
            Create an account to track your quiz performance, analyze your strengths, and join the elite.
          </p>
        </div>
      </div>

      {/* Left: Form Side */}
      <div className="w-full lg:w-7/12 flex flex-col items-center p-6 sm:p-12 xl:px-24 xl:py-12 relative overflow-y-auto transition-colors">
        <div className="w-full max-w-xl animate-fade-in-up m-auto py-8 transition-colors">
          
          <div className="flex items-center gap-3 mb-8 cursor-pointer w-fit transition-colors" onClick={() => navigate('/')}>
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 transition-colors">
              <Brain size={28} className="text-white transition-colors" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent transition-colors">
              QuizMaster
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 transition-colors">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 text-lg transition-colors">Build your academic profile below.</p>

          {/* Role selector */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl mb-6 gap-1 transition-colors">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                role === 'faculty'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <BookOpenCheck size={16} /> Faculty
            </button>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 font-semibold text-sm transition-colors">
              <div className="min-w-2 min-h-2 w-2 h-2 rounded-full bg-red-500 animate-pulse transition-colors" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 transition-colors">
            <InputField icon={User} type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
            <InputField icon={User} type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="mb-4 transition-colors">
            <InputField icon={Mail} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 transition-colors">
            <InputField icon={User} name="gender" placeholder="Select Gender" options={["Select Gender", "Male", "Female", "Other"]} value={formData.gender} onChange={handleChange} />
            <InputField icon={Calendar} type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 transition-colors">
            <InputField icon={BookOpen} type="text" name="stream" placeholder="Stream (e.g., Science)" value={formData.stream} onChange={handleChange} />
            <InputField icon={BookOpen} type="text" name="branch" placeholder="Branch (e.g., Physics)" value={formData.branch} onChange={handleChange} />
          </div>

          <div className="mb-8 transition-colors">
            <InputField icon={Lock} type="password" name="password" placeholder="Create Password (Min. 6 chars)" value={formData.password} onChange={handleChange} />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full text-white py-4 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 font-bold text-lg disabled:opacity-70 disabled:hover:translate-y-0 tracking-wide mt-2 ${
              role === 'faculty'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
            }`}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'faculty' ? 'Faculty' : 'Student'}`}
          </button>

          <p className="text-center mt-8 text-slate-500 dark:text-slate-400 font-medium pb-8 transition-colors">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-bold hover:text-blue-800 transition-colors hover:underline underline-offset-4"
              onClick={() => navigate("/")}
            >
              Sign in instead
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
