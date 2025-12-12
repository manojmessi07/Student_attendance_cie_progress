import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// student
import Dashboard from "./pages/Student/Dashboard";
import Progress from "./pages/Student/Progress";
import Attendance from "./pages/Student/Attendance";
import Reports from "./pages/Student/Reports";

// faculty
import FacultyDashboard from "./pages/staff/FacultyDashboard";
import FacultyProgress from "./pages/staff/FacultyProgress";
import FacultyReports from "./pages/staff/FacultyReports";

// proctor
import ProctorDashboard from "./pages/proctor/ProctorDashboard";

import Admin from "./pages/Admin";
import Login from "./pages/Login";


// ---------------------------
// App Shell (Navbar + Sidebar)
// ---------------------------
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


// ---------------------------
// Generic Protected Route
// ---------------------------
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}


// ---------------------------
// ROLE-BASED ROUTE PROTECTOR
// ---------------------------
function RoleRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/login" replace />;
  return children;
}


// ---------------------------
// MAIN APP ROUTER
// ---------------------------
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Login */}
          <Route path="/login" element={<Login />} />


          {/* ----------------------- */}
          {/* STUDENT ROUTES          */}
          {/* ----------------------- */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute role="student">
                  <AppLayout><Dashboard /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/progress"
            element={
              <ProtectedRoute>
                <RoleRoute role="student">
                  <AppLayout><Progress /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute>
                <RoleRoute role="student">
                  <AppLayout><Attendance /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/reports"
            element={
              <ProtectedRoute>
                <RoleRoute role="student">
                  <AppLayout><Reports /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* ----------------------- */}
          {/* FACULTY ROUTES          */}
          {/* ----------------------- */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute role="faculty">
                  <AppLayout><FacultyDashboard /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/progress"
            element={
              <ProtectedRoute>
                <RoleRoute role="faculty">
                  <AppLayout><FacultyProgress /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/reports"
            element={
              <ProtectedRoute>
                <RoleRoute role="faculty">
                  <AppLayout><FacultyReports /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* ----------------------- */}
          {/* PROCTOR ROUTES          */}
          {/* ----------------------- */}
          <Route
            path="/proctor/ProctorDashboard"
            element={
              <ProtectedRoute>
                <RoleRoute role="proctor">
                  <AppLayout><ProctorDashboard /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute role="faculty">
                  <AppLayout><Admin /></AppLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
