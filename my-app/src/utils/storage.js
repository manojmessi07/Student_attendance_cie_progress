// storage.js
const KEY = "spams_v2_store";

const seed = {
  users: [
    { id: "s1", role: "student", name: "Alice", email: "alice@example.com", password: "pass", roll: "CS101", proctorId: "p1" },
    { id: "f1", role: "faculty", name: "Prof. Bob", email: "bob@example.com", password: "pass" },
    { id: "p1", role: "proctor", name: "Proctor John", email: "proctor@example.com", password: "pass" }
  ],

  students: [
    { id: "s1", name: "Alice", roll: "CS101", email: "alice@example.com", proctorId: "p1" }
  ],

  subjects: [
    { id: "sub1", name: "Mathematics", facultyId: "f1" },
    { id: "sub2", name: "Physics", facultyId: "f1" },
    { id: "sub3", name: "Chemistry", facultyId: "f1" }
  ],

  cie_marks: [
    { studentId: "s1", subjectId: "sub1", cieNo: 1, expected: 70, obtained: 68, total: 45, date: "2025-08-01" },
    { studentId: "s1", subjectId: "sub1", cieNo: 2, expected: 75, obtained: 72, total: 45, date: "2025-09-15" },
    { studentId: "s1", subjectId: "sub2", cieNo: 1, expected: 60, obtained: 62, total: 45, date: "2025-08-01" }
  ],

  attendance: [
    { studentId: "s1", subjectId: "sub1", date: "2025-07-01", status: "present" },
    { studentId: "s1", subjectId: "sub1", date: "2025-07-02", status: "absent", reason: "Medical" },
    { studentId: "s1", subjectId: "sub2", date: "2025-07-01", status: "present" }
  ],

  leaves: [],
  reasons: [],
  messages: [],

  dashboard: {
    upcomingClasses: [],
    dashboardSubjects: [],
    cie_marks_for_chart: [],
    attendanceTimeline: [],
    assignment: null,
    pendingQuizzes: [],
    completedCourses: 0,
    hoursSpent: "0h",
    performance: {}
  }
};

// ---------------- Dashboard Generator ----------------
function generateDashboard(st) {
  if (!st) return seed.dashboard;

  const student = st.students?.[0];
  if (!student) return seed.dashboard;

  const studentId = student.id;

  const dashboardSubjects = st.subjects.map(sub => {
    const cie = st.cie_marks.filter(c => c.studentId === studentId && c.subjectId === sub.id);
    const progress = Math.min(100, cie.length * 30);
    const score = Math.floor(cie.reduce((acc, m) => acc + (m.obtained || 0), 0) / (cie.length || 1));
    return { id: sub.id, name: sub.name, progress, score };
  });

  const cieChart = st.cie_marks.filter(c => c.studentId === studentId).map(c => ({
    cie: `CIE-${c.cieNo}`,
    expected: c.expected,
    obtained: c.obtained
  }));

  const attendanceTimeline = st.attendance.filter(a => a.studentId === studentId).map(a => ({
    date: a.date,
    val: a.status === "present" ? 100 : 0
  }));

  const total = st.attendance.filter(a => a.studentId === studentId).length;
  const present = st.attendance.filter(a => a.studentId === studentId && a.status === "present").length;
  const attendancePercent = total ? Math.round((present / total) * 100) : 100;

  return {
    ...st.dashboard,
    dashboardSubjects,
    cie_marks_for_chart: cieChart,
    attendanceTimeline,
    performance: { attendance: attendancePercent, cie: {} }
  };
}

// ---------------- Read / Write ----------------
function read() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const finalSeed = { ...seed, dashboard: generateDashboard(seed) };
    localStorage.setItem(KEY, JSON.stringify(finalSeed));
    return finalSeed;
  }

  try {
    const parsed = JSON.parse(raw);
    parsed.dashboard = generateDashboard(parsed);
    return parsed;
  } catch {
    const fixed = { ...seed, dashboard: generateDashboard(seed) };
    localStorage.setItem(KEY, JSON.stringify(fixed));
    return fixed;
  }
}

function write(data) {
  data.dashboard = generateDashboard(data);
  localStorage.setItem(KEY, JSON.stringify(data));
}

export default { read, write };
