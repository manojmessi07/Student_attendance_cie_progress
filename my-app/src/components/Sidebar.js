import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar card">
      <nav>
        {user?.role === "student" && (
          <>
            <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/student/progress">Progress</Link>
            <Link className="nav-link" to="/student/attendance">Attendance</Link>
            <Link className="nav-link" to="/student/reports">Reports</Link>
          </>
        )}

        {user?.role === "faculty" && (
          <>
            <Link className="nav-link" to="/staff/dashboard">Faculty Dashboard</Link>
            <Link className="nav-link" to="/staff/progress">Manage Marks</Link>
            <Link className="nav-link" to="/staff/reports">Reports & Messaging</Link>
            <Link className="nav-link" to="/admin">Leave Approvals</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
