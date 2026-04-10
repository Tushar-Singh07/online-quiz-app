import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CategorySelection from "./pages/CategorySelection";
import QuizList from "./pages/QuizList";
import Settings from "./pages/Settings";
import MyQuizzes from "./pages/MyQuizzes";
import Analytics from "./pages/Analytics";
import QuizPage from "./pages/QuizPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import CreateQuiz from "./pages/admin/CreateQuiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student routes */}
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute requiredRole="student"><CategorySelection /></ProtectedRoute>} />
        <Route path="/category/:categoryId" element={<ProtectedRoute requiredRole="student"><QuizList /></ProtectedRoute>} />
        <Route path="/my-quizzes" element={<ProtectedRoute requiredRole="student"><MyQuizzes /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute requiredRole="student"><Analytics /></ProtectedRoute>} />
        <Route path="/quiz/:quizId/play" element={<ProtectedRoute requiredRole="student"><QuizPage /></ProtectedRoute>} />

        {/* Shared routes */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Faculty & Admin routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="facultyOrAdmin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/quizzes" element={<ProtectedRoute requiredRole="facultyOrAdmin"><ManageQuizzes /></ProtectedRoute>} />
        <Route path="/admin/quizzes/create" element={<ProtectedRoute requiredRole="facultyOrAdmin"><CreateQuiz /></ProtectedRoute>} />

        {/* Admin-only routes */}
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><ManageUsers /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
