import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// student
import Dashboard from "./pages/Student/Dashboard";
import Progress from "./pages/Student/Progress";
import Attendance from "./pages/Student/Attendance";
import Reports from "./pages/Student/Reports";

// staff
import FacultyDashboard from "./pages/staff/FacultyDashboard";
import FacultyProgress from "./pages/staff/FacultyProgress";
import FacultyReports from "./pages/staff/FacultyReports";

import Admin from "./pages/Admin";
import Login from "./pages/Login";

function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/student/progress" element={<ProtectedRoute><AppLayout><Progress /></AppLayout></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute><AppLayout><Attendance /></AppLayout></ProtectedRoute>} />
          <Route path="/student/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />

          {/* Faculty routes */}
          <Route path="/staff/dashboard" element={<ProtectedRoute><AppLayout><FacultyDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/staff/progress" element={<ProtectedRoute><AppLayout><FacultyProgress /></AppLayout></ProtectedRoute>} />
          <Route path="/staff/reports" element={<ProtectedRoute><AppLayout><FacultyReports /></AppLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AppLayout><Admin /></AppLayout></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
