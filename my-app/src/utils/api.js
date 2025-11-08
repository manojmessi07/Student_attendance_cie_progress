import store from "./storage";

function getStore() {
  return store.read();
}

function saveStore(s) {
  store.write(s);
}

export const api = {
  // ---------------- AUTH ----------------
  async login(email, password) {
    const s = getStore();
    const user = s.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    return { user };
  },

  // ---------------- SUBJECTS ----------------
  async listSubjects() {
    const s = getStore();
    return s.subjects;
  },

  // ---------------- STUDENTS ----------------
  async listStudents(facultyId = null) {
    const s = getStore();

    // Filter subjects for this faculty (if facultyId provided)
    let subjectsForFaculty = s.subjects;
    if (facultyId) {
      subjectsForFaculty = s.subjects.filter(sub => sub.facultyId === facultyId);
    }
    const subjectIds = subjectsForFaculty.map(sub => sub.id);

    // Return all students and attach their related data
    return s.students.map(stu => ({
      ...stu,
      cie_marks: s.cie_marks.filter(
        m => m.studentId === stu.id && (facultyId ? subjectIds.includes(m.subjectId) : true)
      ),
      attendance: s.attendance.filter(a => a.studentId === stu.id),
      leaves: s.leaves.filter(l => l.studentId === stu.id)
    }));
  },

  async getStudentData(studentId) {
    const s = getStore();
    return {
      student: s.students.find(x => x.id === studentId),
      cie_marks: s.cie_marks.filter(m => m.studentId === studentId),
      attendance: s.attendance.filter(a => a.studentId === studentId),
      leaves: s.leaves.filter(l => l.studentId === studentId),
      subjects: s.subjects
    };
  },

  // ---------------- CIE MARKS ----------------
  async addCieMark(mark) {
    const s = getStore();
    s.cie_marks.push(mark);
    saveStore(s);
    return mark;
  },

  // ---------------- REASONS ----------------
  async addReason(reason) {
    const s = getStore();
    if (!s.reasons) s.reasons = [];
    reason.id = "R" + Math.random().toString(36).slice(2, 9);
    reason.facultyReply = "";
    reason.seenByStudent = false;
    s.reasons.push(reason);
    saveStore(s);
    return reason;
  },

  async listReasons() {
    const s = getStore();
    return s.reasons || [];
  },

  async addReasonReply(id, replyText) {
    const s = getStore();
    if (!s.reasons) s.reasons = [];
    const r = s.reasons.find(x => x.id === id);
    if (r) {
      r.facultyReply = replyText;
      r.seenByStudent = false; // mark unread for student
    }
    saveStore(s);
    return r;
  },

  async markReplySeen(studentId) {
    const s = getStore();
    if (s.reasons) {
      s.reasons.forEach(r => {
        if (r.studentId === studentId) r.seenByStudent = true;
      });
    }
    saveStore(s);
  },

  // ---------------- LEAVES ----------------
  async applyLeave(leave) {
    const s = getStore();
    leave.id = "L" + Math.random().toString(36).slice(2, 9);
    leave.status = "pending";
    s.leaves.push(leave);
    saveStore(s);
    return leave;
  },

  async listLeaves() {
    const s = getStore();
    return s.leaves;
  },

  async approveLeave(id, approved) {
    const s = getStore();
    const l = s.leaves.find(x => x.id === id);
    if (l) l.status = approved ? "approved" : "rejected";
    saveStore(s);
    return l;
  }
};
