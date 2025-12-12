import React, { useEffect, useState } from "react";
import store from "../../utils/storage";

export default function ProctorDashboard() {
  const [proctor, setProctor] = useState(null);
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const data = store.read();
    const logged = data.users.find(u => u.role === "proctor");
    setProctor(logged);
    if (!logged) return;

    const assigned = data.students.filter(s => s.proctorId === logged.id);
    const pending = data.students.filter(s => s.requestedProctor === logged.email && !s.proctorId);

    setStudents(assigned);
    setPendingRequests(pending);

    // Certificates uploaded by assigned students but not forwarded yet
    const pendingCerts = data.certificates?.filter(c => assigned.some(s => s.id === c.studentId) && !c.forwarded) || [];
    setCertificates(pendingCerts);
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

  function forwardCertificate(cert) {
    const data = store.read();
    const idx = data.certificates.findIndex(c => c.id === cert.id);
    data.certificates[idx].forwarded = true;
    store.write(data);

    setCertificates(prev => prev.filter(c => c.id !== cert.id));
  }

  if (!proctor) return <div style={{ padding: 20 }}>Login as a proctor to continue</div>;

  return (
    <div style={{ display: "grid", gap: 16, padding: 20 }}>
      <div className="card">
        <h2>Welcome, {proctor.name}</h2>
        <p className="small muted">Proctor Dashboard</p>
      </div>

      {/* Assigned Students */}
      <div className="card">
        <h3>Your Students ({students.length})</h3>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Name</th><th>Roll</th><th>Email</th><th>Phone</th><th>Mail</th></tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="5" className="small muted">No students assigned.</td></tr>
            ) : (
              students.map(st => (
                <tr key={st.id}>
                  <td>{st.name}</td>
                  <td>{st.roll}</td>
                  <td>{st.email}</td>
                  <td>{st.phone || "-"}</td>
                  <td>
                    <a href={`mailto:${st.email}`} className="btn btn-ghost" style={{padding:"6px 10px", fontSize:"0.85rem"}}>Email</a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pending Requests */}
      <div className="card">
        <h3>Pending Requests ({pendingRequests.length})</h3>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Name</th><th>Roll</th><th>Email</th><th>Approve</th></tr>
          </thead>
          <tbody>
            {pendingRequests.length === 0 ? (
              <tr><td colSpan="4" className="small muted">No pending requests.</td></tr>
            ) : (
              pendingRequests.map(st => (
                <tr key={st.id}>
                  <td>{st.name}</td>
                  <td>{st.roll}</td>
                  <td>{st.email}</td>
                  <td><button className="btn btn-primary" onClick={() => approveStudent(st)}>Approve</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pending Certificates */}
      <div className="card">
        <h3>Certificates Pending Review ({certificates.length})</h3>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Student</th><th>Type</th><th>Date</th><th>Reason</th><th>File</th><th>Action</th></tr>
          </thead>
          <tbody>
            {certificates.length === 0 ? (
              <tr><td colSpan="6" className="small muted">No certificates to review.</td></tr>
            ) : (
              certificates.map(c => {
                const student = students.find(s => s.id === c.studentId);
                return (
                  <tr key={c.id}>
                    <td>{student?.name}</td>
                    <td>{c.type}</td>
                    <td>{c.date}</td>
                    <td>{c.reason || "-"}</td>
                    <td><a href={c.file} target="_blank" rel="noreferrer">View</a></td>
                    <td><button className="btn btn-primary" onClick={() => forwardCertificate(c)}>Forward</button></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
