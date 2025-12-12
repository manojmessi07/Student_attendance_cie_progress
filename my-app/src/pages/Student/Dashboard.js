import React, { useEffect, useState } from "react";
import store from "../../utils/storage";
import PerformanceGauge from "../../components/PerformanceGauge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import "./Dashboard.css";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const st = store.read();
    const student = st.students?.[0] || st.users?.find(u => u.role === "student") || { name: "Student", roll: "-" };

    setData({
      user: student,
      upcomingClasses: st.dashboard?.upcomingClasses || [],
      subjects: st.dashboard?.dashboardSubjects || [],
      cieChart: st.dashboard?.cie_marks_for_chart || [],
      attendanceTimeline: st.dashboard?.attendanceTimeline || [],
      assignment: st.dashboard?.assignment || null,
      pendingQuizzes: st.dashboard?.pendingQuizzes || [],
      completedCourses: st.dashboard?.completedCourses || 0,
      hoursSpent: st.dashboard?.hoursSpent || "0h",
      performance: st.dashboard?.performance || { attendance: 100, cie: {} }
    });

    // Load certificates uploaded by this student
    const studentCerts = st.certificates?.filter(c => c.studentId === student.id) || [];
    setCertificates(studentCerts);
  }, []);

  if (!data) return <div className="dashboard-loading"><div className="loading-spinner"></div><p>Loading your dashboard...</p></div>;

  const { user, upcomingClasses, subjects, cieChart, attendanceTimeline, assignment, pendingQuizzes, hoursSpent, performance } = data;
  const attendancePercent = performance?.attendance ?? 100;

  return (
    <div className="student-dashboard">
      {/* Header and Metrics (unchanged) */}
      <div className="dashboard-header">
        <div className="welcome-banner">
          <div className="welcome-icon">🎯</div>
          <div className="welcome-text">
            <h1>Welcome back, {user?.name ?? "Student"}!</h1>
            <p>Great effort so far! Keep up the hard work — you're doing amazing!</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid (unchanged) */}
      <div className="metrics-grid">
        {/* ... existing metric cards ... */}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-column main-content">
          {/* Existing sections: Upcoming Classes, Courses, CIE Chart, Attendance Trend */}
          
          {/* Certificates Section */}
          <div className="content-card">
            <h3>Your Uploaded Certificates</h3>
            {certificates.length === 0 ? (
              <p className="small muted">No certificates uploaded.</p>
            ) : (
              <table className="table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(c => (
                    <tr key={c.id}>
                      <td>{c.type}</td>
                      <td>{c.date}</td>
                      <td>{c.reason || "-"}</td>
                      <td>{c.forwarded ? "Forwarded" : "Pending"}</td>
                      <td><a href={c.file} target="_blank" rel="noreferrer">View</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Sidebar (Assignments, Pending Quizzes unchanged) */}
      </div>
    </div>
  );
}
