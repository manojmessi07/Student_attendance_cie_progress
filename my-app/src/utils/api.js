import store from "./storage";

function getStore() {
  return store.read();
}

function saveStore(s) {
  store.write(s);
}

export const api = {
  async login(email, password) {
    const s = getStore();
    const user = s.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");

    // Attach dashboard for students
    if (user.role === "student") {
      user.dashboard = store.generateDashboard(s, user);
    }

    return { user };
  },

  async listSubjects() {
    const s = getStore();
    return s.subjects;
  },

  async listStudents(filterId = null, role = null) {
    const s = getStore();

    if (role === "faculty") {
      const subjects = s.subjects.filter(sub => sub.facultyId === filterId);
      const subjectIds = subjects.map(sub => sub.id);
      return s.students.map(stu => ({
        ...stu,
        cie_marks: s.cie_marks.filter(m => m.studentId === stu.id && subjectIds.includes(m.subjectId)),
        attendance: s.attendance.filter(a => a.studentId === stu.id),
        leaves: s.leaves.filter(l => l.studentId === stu.id)
      }));
    }

    if (role === "proctor") {
      const proctorStudents = s.students.filter(stu => stu.proctorId === filterId);
      return proctorStudents.map(stu => ({
        ...stu,
        cie_marks: s.cie_marks.filter(m => m.studentId === stu.id),
        attendance: s.attendance.filter(a => a.studentId === stu.id),
        leaves: s.leaves.filter(l => l.studentId === stu.id)
      }));
    }

    return s.students;
  }
};
