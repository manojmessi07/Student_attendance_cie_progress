import React, { useEffect, useState } from "react";
import store from "../../utils/storage";
import PerformanceGauge from "../../components/PerformanceGauge";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { 
  FiSun, 
  FiMoon, 
  FiCalendar, 
  FiBook, 
  FiClock, 
  FiCheckCircle, 
  FiTrendingUp,
  FiArrowRight,
  FiUpload,
  FiEye,
  FiPlay,
  FiChevronRight,
  FiBookOpen
} from "react-icons/fi";

import "./Dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const st = store.read();

    // Select first student as default
    const user = st.students.length ? st.students[0] : st.users.find(u => u.role === "student");
    if (!user) return;

    // Generate dashboard for this student
    const dashboard = store.generateDashboard(st, user);

    // Persist dashboard
    st.dashboard = dashboard;
    store.write(st);

    setData(dashboard);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('dashboard-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('dashboard-theme', 'light');
    }
  };

  if (!data) return (
    <div className="dashboard-loading">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  const {
    user,
    upcomingClasses = [],
    dashboardSubjects = [],
    cie_marks_for_chart = [],
    attendanceTimeline = [],
    assignment = null,
    pendingQuizzes = [],
    completedCourses = 0,
    hoursSpent = "12h",
    performance = { attendance: 100 }
  } = data;

  // Calculate overall performance
  const overallPerformance = dashboardSubjects.length ? 
    Math.round(dashboardSubjects.reduce((acc, s) => acc + (s.progress || 0), 0) / dashboardSubjects.length) : 0;

  const avgScore = dashboardSubjects.length > 0 ? 
    Math.round(dashboardSubjects.reduce((acc, s) => acc + s.score, 0) / dashboardSubjects.length) : 0;

  const bestSubject = dashboardSubjects.length > 0 ? 
    dashboardSubjects.reduce((prev, current) => (prev.score > current.score) ? prev : current).name : 'N/A';

  return (
    <div className={`student-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header with Theme Toggle */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="welcome-section">
            <div className="greeting">
              <h1>Welcome back, <span className="highlight">{user?.name ?? "Student"}</span>!</h1>
              <p>Great effort so far! Keep up the hard work — you're doing amazing!</p>
            </div>
            <div className="student-info">
              <div className="info-item">
                <FiBook className="info-icon" />
                <span>Roll No: {user?.roll || 'CS101'}</span>
              </div>
              <div className="info-item">
                <FiCalendar className="info-icon" />
                <span>Academic Year: 2024-25</span>
              </div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <br/>
          <br/>
          <br/>
          <div className="student-badge">
            <div className="badge-icon">
              <FiTrendingUp />
            </div>
            <div className="badge-content">
              <span className="badge-title">PRO LEARNER</span>
              <span className="badge-subtitle">{overallPerformance}% Average</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">
            <div className="icon-circle">
              <FiTrendingUp />
            </div>
          </div>
          <div className="stat-content">
            <h3>{overallPerformance}%</h3>
            <p>Overall Performance</p>
            <span className="stat-subtitle">Course Completion Rate</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <div className="icon-circle">
              <FiCheckCircle />
            </div>
          </div>
          <div className="stat-content">
            <h3>{completedCourses}</h3>
            <p>Completed Courses</p>
            <span className="stat-subtitle">Out of {dashboardSubjects.length}</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <div className="icon-circle">
              <FiCalendar />
            </div>
          </div>
          <div className="stat-content">
            <h3>{performance.attendance}%</h3>
            <p>Attendance</p>
            <span className="stat-subtitle">This term</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <div className="icon-circle">
              <FiBook />
            </div>
          </div>
          <div className="stat-content">
            <h3>{dashboardSubjects.length}</h3>
            <p>Subjects</p>
            <span className="stat-subtitle">Active</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="left-column">
          {/* Courses Section */}
          <div className="section-card">
            <div className="section-header">
              <h2><FiBookOpen /> Total Courses ({dashboardSubjects.length})</h2>
              <button className="view-all-btn">View All <FiArrowRight /></button>
            </div>
            <div className="courses-container">
              {dashboardSubjects.map((sub, index) => {
                const displayProgress = Math.min(sub.progress, 100);
                const isOver100 = sub.progress > 100;
                
                return (
                  <div key={sub.id} className="course-item">
                    <div className="course-header">
                      <div className="course-title">
                        <span className="course-number">0{index + 1}</span>
                        <h3>{sub.name}</h3>
                      </div>
                      <div className="course-score">
                        <span className="score-value">{sub.score}%</span>
                      </div>
                    </div>
                    
                    <div className="course-progress">
                      <div className="progress-info">
                        <span>Progress</span>
                        <span className="progress-value">
                          {displayProgress}%
                          {isOver100 && <span className="exceeded"> (Exceeded!)</span>}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${displayProgress}%`,
                            background: displayProgress === 100 ? 
                              'linear-gradient(90deg, #10b981, #34d399)' :
                              displayProgress >= 80 ? 
                              'linear-gradient(90deg, #3b82f6, #60a5fa)' :
                              'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="course-footer">
                      <div className={`status-badge ${sub.progress === 100 ? 'completed' : sub.progress >= 80 ? 'good' : 'average'}`}>
                        {sub.progress === 100 ? 'Completed' : 
                         sub.progress >= 80 ? 'Almost There' : 
                         sub.progress >= 60 ? 'On Track' : 'Needs Improvement'}
                      </div>
                      <button className="course-action-btn">View Details <FiChevronRight /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="section-card">
              <div className="section-header">
                <h2>CIE Overview</h2>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cie_marks_for_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis 
                      dataKey="cie" 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="obtained" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Obtained"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expected" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Expected"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#3b82f6' }}></div>
                    <span>Obtained Marks</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#10b981' }}></div>
                    <span>Expected Marks</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h2>Attendance Trend</h2>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={attendanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Attendance']}
                      contentStyle={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="val" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                      name="Attendance %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Upcoming Classes */}
          <div className="section-card">
            <div className="section-header">
              <h2><FiCalendar /> Upcoming Classes</h2>
            </div>
            <div className="upcoming-classes">
              {upcomingClasses.map(cls => (
                <div key={cls.id} className="class-card">
                  <div className="class-icon">
                    {cls.subject === "Mathematics" ? "🧮" : 
                     cls.subject === "Physics" ? "⚛️" : "🧪"}
                  </div>
                  <div className="class-info">
                    <h4>{cls.title}</h4>
                    <p className="class-meta">{cls.subject} • {cls.teacher}</p>
                    <div className="class-time">
                      <span className="date-time">
                        <FiClock /> {cls.date} {cls.time}
                      </span>
                      <span className="time-left">{cls.timeLeft} left</span>
                    </div>
                  </div>
                  <button className="join-btn">
                    Join <FiArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment */}
          <div className="section-card assignment-card">
            <div className="section-header">
              <h2>Assignment</h2>
              <span className="priority-badge">High Priority</span>
            </div>
            {assignment ? (
              <div className="assignment-content">
                <div className="assignment-header">
                  <div className="assignment-icon">📘</div>
                  <div className="assignment-details">
                    <h3>{assignment.title}</h3>
                    <p className="subject">{assignment.subject}</p>
                    <div className="deadline">
                      <span className="deadline-label">Due Date:</span>
                      <span className="deadline-date">{assignment.deadline}</span>
                    </div>
                  </div>
                </div>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Submission Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <div className="progress-stats">
                    <span className="submitted">65% submitted</span>
                    <span className="pending">35% pending</span>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button className="btn-secondary">
                    <FiEye /> View Details
                  </button>
                  <button className="btn-primary">
                    <FiUpload /> Upload Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-assignment">
                <div className="empty-icon">📝</div>
                <p>No pending assignments</p>
              </div>
            )}
          </div>

          {/* Pending Quizzes */}
          <div className="section-card">
            <div className="section-header">
              <h2>Pending Quizzes</h2>
            </div>
            <div className="quizzes-container">
              {pendingQuizzes.map(q => (
                <div key={q.id} className="quiz-card">
                  <div className="quiz-icon">❓</div>
                  <div className="quiz-details">
                    <h4>{q.title}</h4>
                    <div className="quiz-meta">
                      <span className="meta-item">
                        <span className="meta-icon">💬</span>
                        {q.questions} questions
                      </span>
                      <span className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        {q.duration} min
                      </span>
                    </div>
                  </div>
                  <button className="quiz-start-btn">
                    <FiPlay /> Start
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="section-card">
            <div className="section-header">
              <h2>Performance Summary</h2>
            </div>
            <div className="performance-summary">
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-label">Best Subject</div>
                  <div className="summary-value">{bestSubject}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Avg Score</div>
                  <div className="summary-value">{avgScore}%</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Study Hours</div>
                  <div className="summary-value">{hoursSpent}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Attendance Rate</div>
                  <div className="summary-value">{performance.attendance}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}