// src/pages/Proctor/Certificates.js
import React, { useEffect, useState } from "react";
import store from "../../utils/storage";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [proctor, setProctor] = useState(null);

  useEffect(() => {
    const data = store.read();
    const logged = data.users.find((u) => u.role === "proctor");
    setProctor(logged);

    if (!logged) return;

    // Filter certificates for students assigned to this proctor
    const certs = (data.certificates || []).filter((c) => {
      const student = data.students.find((s) => s.id === c.studentId);
      return student?.proctorId === logged.id && !c.forwarded;
    });

    setCertificates(certs);
  }, []);

  const forwardToFaculty = (cert) => {
    const data = store.read();
    const updatedCerts = data.certificates.map((c) =>
      c.id === cert.id ? { ...c, forwarded: true, facultyId: "f1" } : c
    ); // Replace "f1" with relevant teacher
    data.certificates = updatedCerts;
    store.write(data);

    setCertificates(updatedCerts.filter((c) => !c.forwarded));
  };

  if (!proctor) return <div className="card">Login as Proctor to view certificates</div>;

  return (
    <div className="card">
      <h3>Pending Certificates ({certificates.length})</h3>
      {certificates.length === 0 && <p className="small muted">No certificates to review.</p>}
      {certificates.length > 0 && (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Date</th>
              <th>Reason</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c) => {
              const student = store.read().students.find((s) => s.id === c.studentId);
              return (
                <tr key={c.id}>
                  <td>{student?.name}</td>
                  <td>{c.type}</td>
                  <td>{c.date}</td>
                  <td>{c.reason || "-"}</td>
                  <td>
                    <a href={c.file} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => forwardToFaculty(c)}>
                      Forward to Faculty
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
