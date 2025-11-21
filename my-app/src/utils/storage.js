// storage.jsx
const KEY = "spams_v2_store";

const seed = {
  users: [
    { id: "s1", role: "student", name: "Alice", email: "alice@example.com", password: "pass", roll: "CS101" },
    { id: "f1", role: "faculty", name: "Prof. Bob", email: "bob@example.com", password: "pass" }
  ],

  students: [
    { id: "s1", name: "Alice", roll: "CS101", email: "alice@example.com" }
  ],

  subjects: [
    { id: "sub1", name: "Mathematics" },
    { id: "sub2", name: "Physics" },
    { id: "sub3", name: "Chemistry" }
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

  // --------------------------
  // 🔥 DASHBOARD STATIC DATA
  // --------------------------
  dashboard: {
    upcomingClasses: [
      {
        id: "c1",
        title: "Linear Algebra Intro",
        subject: "Math",
        teacher: "Prof. Bob",
        date: "Jan 26",
        time: "10:00 AM",
        timeLeft: "2 hours left",
        image: "https://picsum.photos/100"
      },
      {
        id: "c2",
        title: "Wave Optics",
        subject: "Physics",
        teacher: "Prof. Ellis",
        date: "Jan 28",
        time: "2:30 PM",
        timeLeft: "1 day left",
        image: "https://picsum.photos/101"
      }
    ],

    subjects: [
      { id: "sub1", name: "Mathematics", teacher: "Prof. Bob", progress: 70, score: 82 },
      { id: "sub2", name: "Physics", teacher: "Prof. Ella", progress: 50, score: 74 },
      { id: "sub3", name: "Chemistry", teacher: "Dr. Smith", progress: 40, score: 66 }
    ],

    assignments: [
      { id: "a1", title: "Math Assignment 1", dueDate: "Jan 30", status: "Pending" },
      { id: "a2", title: "Physics Practical File", dueDate: "Feb 2", status: "Completed" }
    ],

    pendingQuizzes: [
      { id: "q1", title: "CIE-1 Math Quiz", subject: "Mathematics", due: "Due Tomorrow" },
      { id: "q2", title: "Optics Quiz", subject: "Physics", due: "Due in 3 days" }
    ],

    performance: {
      attendance: 86,
      cie: {
        math: 24,
        physics: 21,
        chemistry: 18
      }
    }
  }
};

function read() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export default { read, write };
