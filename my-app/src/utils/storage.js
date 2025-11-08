// Simple localStorage-backed store for demo
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
    { studentId: "s1", subjectId: "sub1", cieNo: 1, expected: 70, obtained: 68, date: "2025-08-01" },
    { studentId: "s1", subjectId: "sub1", cieNo: 2, expected: 75, obtained: 72, date: "2025-09-15" },
    { studentId: "s1", subjectId: "sub2", cieNo: 1, expected: 60, obtained: 62, date: "2025-08-01" },
  ],
  attendance: [
    { studentId: "s1", subjectId: "sub1", date: "2025-07-01", status: "present" },
    { studentId: "s1", subjectId: "sub1", date: "2025-07-02", status: "absent", reason: "Medical" },
    { studentId: "s1", subjectId: "sub2", date: "2025-07-01", status: "present" },
  ],
  leaves: [],
  leaves: [],
  reasons: [],   // 👈 add this
  messages: []   // 👈 add this
};

function read() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export default {
  read, write
};
