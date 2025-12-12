import React, { useEffect, useState } from "react";
import store from "../../utils/storage";

export default function ProctorDashboard() {
  const [proctor, setProctor] = useState(null);
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const data = store.read();

    // logged in user
    const logged = data.users.find(u => u.role === "proctor");

    setProctor(logged);

    if (!logged) return;

    // Students already assigned
    const assigned = data.students.filter(s => s.proctorId === logged.id);

    // Students who requested this proctor while registering
    const pending = data.students.filter(
      s => s.requestedProctor === logged.email && !s.proctorId
    );

    setStudents(assigned);
    setPendingRequests(pending);
  }, []);

  function approveStudent(st) {
    const data = store.read();

    const idx = data.students.findIndex(x => x.id === st.id);
    data.students[idx].proctorId = proctor.id;
    delete data.students[idx].requestedProctor;

    store.write(data);

    setStudents(prev => [...prev, st]);
    setPendingRequests(prev => prev.filter(x => x.id !== st.id));
  }

  if (!proctor)
    return <div style={{ padding: 20 }}>Login as a proctor to continue</div>;

  return (
    <div style={{ display: "grid", gap: 16, padding: 20 }}>
      
      <div className="card">
        <h2>Welcome, {proctor.name}</h2>
        <p className="small muted">Proctor Dashboard</p>
      </div>

      {/* --------------------- */}
      {/* ASSIGNED STUDENTS */}
      {/* --------------------- */}
      <div className="card">
        <h3>Your Students ({students.length})</h3>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Mail</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" className="small muted">No students assigned.</td>
              </tr>
            ) : (
              students.map(st => (
                <tr key={st.id}>
                  <td>{st.name}</td>
                  <td>{st.roll}</td>
                  <td>{st.email}</td>
                  <td>{st.phone || "-"}</td>
                  <td>
                    <a
                      href={`mailto:${st.email}`}
                      className="btn btn-ghost"
                      style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                    >
                      Email
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --------------------- */}
      {/* PENDING REQUESTS */}
      {/* --------------------- */}
      <div className="card">
        <h3>Pending Requests ({pendingRequests.length})</h3>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Email</th>
              <th>Approve</th>
            </tr>
          </thead>

          <tbody>
            {pendingRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="small muted">No pending requests.</td>
              </tr>
            ) : (
              pendingRequests.map(st => (
                <tr key={st.id}>
                  <td>{st.name}</td>
                  <td>{st.roll}</td>
                  <td>{st.email}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => approveStudent(st)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
