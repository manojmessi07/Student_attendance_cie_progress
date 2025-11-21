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

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const d = store.read();

    const dashboard = d?.dashboard ?? {};

    setData({
      user:
        d?.students?.[0] ??
        d?.users?.find((u) => u.role === "student") ?? {
          name: "Student",
          roll: "-"
        },

      upcomingClasses: dashboard.upcomingClasses ?? [],
      subjects: dashboard.dashboardSubjects ?? [],
      cieChart: dashboard.cie_marks_for_chart ?? [],
      attendanceTimeline: dashboard.attendanceTimeline ?? [],
      assignment: dashboard.assignment ?? null,
      pendingQuizzes: dashboard.pendingQuizzes ?? [],
      completedCourses: dashboard.completedCourses ?? 0,
      hoursSpent: dashboard.hoursSpent ?? "0h",
      performance: dashboard.performance ?? { attendance: 100, cie: {} }
    });
  }, []);

  if (!data)
    return <div className="card" style={{ padding: 16 }}>Loading...</div>;

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
    <div
      style={{
        padding: 20,
        display: "grid",
        gap: 20,
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 16,
          border: "1px solid #F3F4F6"
        }}
      >
        <div
          style={{
            background: "#ECFDF5",
            padding: 10,
            borderRadius: 8,
            color: "#065F46",
            fontWeight: 600
          }}
        >
          Great effort so far {user?.name ?? "Student"}!
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 16,
            marginTop: 12
          }}
        >
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 14, color: "#374151", marginBottom: 6 }}>
              Overall performance
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <PerformanceGauge value={80} />
            </div>

            <div style={{ fontSize: 12, color: "#6B7280" }}>PRO LEARNER</div>
          </div>

          <div style={{ padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Attendance</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {attendancePercent}%
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>This term</div>
          </div>

          <div style={{ padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Subjects</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {subjects.length}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Active</div>
          </div>

          <div style={{ padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Hours spent</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{hoursSpent}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Total</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 20
        }}
      >
        <div style={{ display: "grid", gap: 20 }}>
          {/* Upcoming classes */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              border: "1px solid #F3F4F6"
            }}
          >
            <h3 style={{ margin: 0 }}>Upcoming classes</h3>

            {upcomingClasses.length === 0 && (
              <div style={{ color: "#9CA3AF", marginTop: 12 }}>
                No upcoming classes
              </div>
            )}

            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  marginTop: 12,
                  borderRadius: 8,
                  border: "1px solid #F3F4F6"
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img
                    src={cls.image}
                    alt={cls.title}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 8
                    }}
                  />

                  <div>
                    <div style={{ fontWeight: 700 }}>{cls.title}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        marginTop: 6
                      }}
                    >
                      {cls.subject} • by {cls.teacher}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 12,
                      background: "#FEF3C7",
                      padding: "4px 8px",
                      borderRadius: 8,
                      display: "inline-block"
                    }}
                  >
                    {cls.dateTimeLabel ??
                      `${cls.date} | ${cls.time}`}
                  </div>

                  <div
                    style={{ marginTop: 8, color: "#EF4444", fontSize: 13 }}
                  >
                    {cls.timeLeft}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      style={{
                        background: "#10B981",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Courses list */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              border: "1px solid #F3F4F6"
            }}
          >
            <h3 style={{ margin: 0 }}>Total courses ({subjects.length})</h3>

            <div style={{ marginTop: 12 }}>
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 240px 90px 110px",
                    gap: 12,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #F3F4F6"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{sub.name}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#9CA3AF",
                        marginTop: 6
                      }}
                    >
                      5 chapter • 30 lecture
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        height: 8,
                        background: "#F3F4F6",
                        borderRadius: 6,
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          width: `${sub.progress ?? 0}%`,
                          height: "100%",
                          background:
                            sub.progress === 100
                              ? "#10B981"
                              : "#FB923C"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ fontWeight: 700 }}>
                    {sub.score ?? 0}%
                  </div>

                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: 20,
                        border: "1px solid #E5E7EB",
                        fontSize: 13
                      }}
                    >
                      {sub.progress === 100
                        ? "Completed"
                        : "In progress"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 20
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: 16,
                border: "1px solid #F3F4F6"
              }}
            >
              <h3 style={{ margin: 0 }}>CIE Overview</h3>

              <div style={{ height: 220, marginTop: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cieChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cie" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="obtained"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#06b6d4"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: 16,
                border: "1px solid #F3F4F6"
              }}
            >
              <h3 style={{ margin: 0 }}>Attendance Trend</h3>

              <div style={{ height: 220, marginTop: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => d.slice(5)}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="val" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "grid", gap: 20 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              border: "1px solid #F3F4F6"
            }}
          >
            <div style={{ fontWeight: 700 }}>Study Streak</div>
            <div style={{ marginTop: 8, color: "#6B7280" }}>
              5 days without a break
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <div>🔥</div>
              <div>🔥</div>
              <div>🔥</div>
              <div>🔥</div>
              <div>🔥</div>
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                color: "#6B7280"
              }}
            >
              6 classes covered • 4 assignments completed
            </div>
          </div>

          {/* Assignment */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              border: "1px solid #F3F4F6"
            }}
          >
            <h4 style={{ marginTop: 0 }}>Assignment</h4>

            {assignment ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#EEF2FF",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    📘
                  </div>

                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {assignment.title}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#9CA3AF",
                        marginTop: 6
                      }}
                    >
                      {assignment.subject} • Assignment
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: "#EF4444"
                      }}
                    >
                      Submit before: {assignment.deadline}
                    </div>
                  </div>
                </div>

                <div
                  style={{ marginTop: 12, display: "flex", gap: 8 }}
                >
                  <button
                    style={{
                      background: "transparent",
                      border: "1px solid #10B981",
                      color: "#10B981",
                      padding: "8px 12px",
                      borderRadius: 8
                    }}
                  >
                    View
                  </button>

                  <button
                    style={{
                      background: "#10B981",
                      border: "none",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: 8
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: "#9CA3AF" }}>No assignments</div>
            )}
          </div>

          {/* Pending quizzes */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              border: "1px solid #F3F4F6"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ fontWeight: 700 }}>Pending quizzes</div>

              <button
                style={{
                  background: "transparent",
                  border: "1px solid #10B981",
                  color: "#10B981",
                  padding: "6px 8px",
                  borderRadius: 8
                }}
              >
                See all
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              {pendingQuizzes.length === 0 && (
                <div style={{ color: "#9CA3AF" }}>No pending quizzes</div>
              )}

              {pendingQuizzes.map((q) => (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #F3F4F6"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{q.title}</div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#9CA3AF"
                      }}
                    >
                      {q.questions ?? 0} question • {q.duration ?? "-"}
                    </div>
                  </div>

                  <div>
                    <button
                      style={{
                        background: "transparent",
                        border: "1px solid #10B981",
                        color: "#10B981",
                        padding: "6px 10px",
                        borderRadius: 8
                      }}
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
