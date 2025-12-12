// src/pages/Student/Dashboard.js
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

  useEffect(() => {
    const st = store.read();
    const dashboard = st.dashboard || {};

    setData({
      user:
        st.students?.[0] ||
        st.users?.find((u) => u.role === "student") ||
        { name: "Student", roll: "-" },

      upcomingClasses: dashboard.upcomingClasses || [],
      subjects: dashboard.dashboardSubjects || [],
      cieChart: dashboard.cie_marks_for_chart || [],
      attendanceTimeline: dashboard.attendanceTimeline || [],
      assignment: dashboard.assignment || null,
      pendingQuizzes: dashboard.pendingQuizzes || [],

      completedCourses: dashboard.completedCourses || 0,
      hoursSpent: dashboard.hoursSpent || "0h",

      performance: dashboard.performance || {
        attendance: 100,
        cie: {}
      }
    });
  }, []);

  if (!data)
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );

  const {
    user,
    upcomingClasses,
    subjects,
    cieChart,
    attendanceTimeline,
    assignment,
    pendingQuizzes,
    hoursSpent,
    performance
  } = data;

  const attendancePercent = performance?.attendance ?? 100;

  return (
    <div className="student-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-banner">
          <div className="welcome-icon">🎯</div>
          <div className="welcome-text">
            <h1>Welcome back, {user?.name ?? "Student"}!</h1>
            <p>
              Great effort so far! Keep up the hard work — you're doing amazing!
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="metrics-grid">
        <div className="metric-card performance-card">
          <div className="metric-header">
            <h3>Overall Performance</h3>
            <span className="metric-subtitle">Course Completion Rate</span>
          </div>
          <div className="gauge-container">
            <PerformanceGauge
              value={
                subjects.length
                  ? Math.round(
                      subjects.reduce((acc, s) => acc + (s.progress || 0), 0) /
                        subjects.length
                    )
                  : 0
              }
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{attendancePercent}%</div>
            <div className="metric-label">Attendance</div>
            <div className="metric-subtext">This term</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <div className="metric-value">{subjects.length}</div>
            <div className="metric-label">Subjects</div>
            <div className="metric-subtext">Active</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{hoursSpent}</div>
            <div className="metric-label">Hours Spent</div>
            <div className="metric-subtext">Total</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* LEFT SECTION */}
        <div className="content-column main-content">
          {/* Upcoming Classes */}
          <div className="content-card">
            <div className="card-header">
              <h3>Upcoming Classes</h3>
              <button className="view-all-btn">View All</button>
            </div>

            <div className="classes-list">
              {upcomingClasses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <p>No upcoming classes</p>
                </div>
              ) : (
                upcomingClasses.map((cls) => (
                  <div key={cls.id} className="class-card">
                    <div className="class-info">
                      <div className="class-image">
                        {cls.image && <img src={cls.image} alt={cls.title} />}
                      </div>
                      <div className="class-details">
                        <h4 className="class-title">{cls.title}</h4>
                        <p className="class-meta">
                          {cls.subject} • {cls.teacher}
                        </p>
                        <div className="class-time">
                          <span className="time-badge">
                            {cls.dateTimeLabel ||
                              `${cls.date || ""} ${cls.time || ""}`}
                          </span>
                          <span className="time-left">{cls.timeLeft}</span>
                        </div>
                      </div>
                    </div>

                    <button className="join-btn primary-btn">Join</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Courses List */}
          <div className="content-card">
            <div className="card-header">
              <h3>Total Courses ({subjects.length})</h3>
            </div>

            <div className="courses-table">
              {subjects.length === 0 ? (
                <div className="empty-state">
                  <p>No subjects found</p>
                </div>
              ) : (
                subjects.map((sub) => (
                  <div key={sub.id} className="course-row">
                    <div className="course-info">
                      <h4 className="course-name">{sub.name}</h4>
                         <p className="course-stats">
                        Progress: {sub.progress || 0}%
                      </p>
                    </div>

                    <div className="progress-section">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${sub.progress || 0}%`,
                            backgroundColor:
                              sub.progress === 100 ? "#10B981" : "#3B82F6"
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="score-section">
                      <p className="score-value"> Score: {sub.score || 0}%</p>
                    </div>

                    <div className="status-section">
                      <span
                        className={`status-badge ${
                          sub.progress === 100
                            ? "status-completed"
                            : "status-progress"
                        }`}
                      >
                        {sub.progress === 100 ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CIE Chart */}
          <div className="charts-grid">
            <div className="content-card">
              <div className="card-header">
                <h3>CIE Overview</h3>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={cieChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="cie" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="obtained"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#06b6d4"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Trend */}
            <div className="content-card">
              <div className="card-header">
                <h3>Attendance Trend</h3>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={attendanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => d.slice(5)}
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis allowDecimals={false} stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="val" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="content-column sidebar">
          {/* Assignment */}
          <div className="content-card">
            <div className="card-header">
              <h3>Assignment</h3>
            </div>

            <div className="assignment-content">
              {!assignment ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No pending assignments</p>
                </div>
              ) : (
                <>
                  <div className="assignment-header">
                    <div className="assignment-icon">📘</div>
                    <div className="assignment-details">
                      <h4>{assignment.title}</h4>
                      <p>{assignment.subject}</p>

                      <div className="assignment-deadline">
                        <span className="deadline-label">Due:</span>
                        <span className="deadline-time">
                          {assignment.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="assignment-actions">
                    <button className="secondary-btn">View</button>
                    <button className="primary-btn">Upload</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pending Quizzes */}
          <div className="content-card">
            <div className="card-header">
              <h3>Pending Quizzes</h3>
              <button className="view-all-btn">See All</button>
            </div>

            <div className="quizzes-list">
              {pendingQuizzes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">❓</div>
                  <p>No pending quizzes</p>
                </div>
              ) : (
                pendingQuizzes.map((q) => (
                  <div key={q.id} className="quiz-item">
                    <div className="quiz-info">
                      <h4 className="quiz-title">{q.title}</h4>
                      <p className="quiz-meta">
                        {q.questions || 0} questions • {q.duration || 15} min
                      </p>
                    </div>

                    <button className="start-btn secondary-btn">Start</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
