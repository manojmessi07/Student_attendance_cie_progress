import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);

  // 🔔 Check for unread faculty replies
  useEffect(() => {
    if (!user) return;
    (async () => {
      const reasons = await api.listReasons();
      const unread = reasons.filter(
        (r) => r.studentId === user.id && r.facultyReply && !r.seenByStudent
      );
      if (unread.length > 0) {
        setMessages(unread);
        await api.markReplySeen(user.id); // mark as read
      }
    })();
  }, [user]);

  // 📊 Fetch student data
  useEffect(() => {
    if (!user) return;
    api.getStudentData(user.id).then(setData);
  }, [user]);

  if (!data) return <div className="card">Loading...</div>;

  const attendanceSummary = () => {
    const total = data.attendance.length || 0;
    const present = data.attendance.filter((a) => a.status === "present").length;
    const percent = total === 0 ? 100 : Math.round((present / total) * 100);
    return { total, present, percent };
  };

  const cieBySubject = data.subjects
    .map((s) => {
      const marks = data.cie_marks
        .filter((m) => m.subjectId === s.id)
        .sort((a, b) => a.cieNo - b.cieNo);
      return { subject: s.name, marks };
    })
    .filter((x) => x.marks.length > 0);

  const attTimeline = (data.attendance || [])
    .slice(-12)
    .map((a) => ({
      date: a.date,
      val: a.status === "present" ? 1 : 0,
    }));

  return (
    <div style={{ display: "grid", gap: 16, position: "relative" }}>
      {/* 🔔 Notification Popup */}
      {messages.length > 0 && (
        <div
          className="card"
          style={{
            position: "fixed",
            top: 80,
            right: 30,
            backgroundColor: "rgba(37,99,235,0.9)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            zIndex: 1000,
            width: 300,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <h4>📬 New Faculty Replies</h4>
          <ul style={{ marginTop: 8, listStyle: "none", padding: 0 }}>
            {messages.map((m) => (
              <li key={m.id} style={{ marginBottom: 8 }}>
                <strong>{m.subjectName || "Subject"}:</strong>{" "}
                {m.facultyReply}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setMessages([])}
            style={{
              marginTop: 8,
              background: "white",
              color: "#2563eb",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header card */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div className="muted">Welcome back</div>
          <h2 style={{ margin: "6px 0" }}>{user.name}</h2>
          <div className="small muted">Roll: {user.roll || "-"}</div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <div style={{ minWidth: 120 }} className="card">
            <div className="small muted">Attendance</div>
            <div className="kpi">{attendanceSummary().percent}%</div>
            <div className="small muted">
              {attendanceSummary().present} / {attendanceSummary().total}
            </div>
          </div>
          <div style={{ minWidth: 120 }} className="card">
            <div className="small muted">Subjects</div>
            <div className="kpi">{data.subjects.length}</div>
            <div className="small muted">Active</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 16,
        }}
      >
        {/* CIE overview */}
        <div className="card">
          <h3>CIE Overview</h3>
          {cieBySubject.length === 0 && (
            <div className="small muted">No CIE records yet.</div>
          )}
          {cieBySubject.map((s) => (
            <div key={s.subject} style={{ marginTop: 12 }}>
              <div className="small muted">{s.subject}</div>
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={s.marks.map((m) => ({
                      name: `CIE-${m.cieNo}`,
                      obtained: m.obtained,
                      expected: m.expected,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
          ))}
        </div>

        {/* Attendance trend */}
        <div className="card">
          <h3>Attendance Trend</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="val" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
