import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function FacultyDashboard(){
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total:0, aboveExpected:0, belowExpected:0, average:0 });

  useEffect(()=>{
    async function load(){
      const s = await api.listStudents();
      setStudents(s);

      let total = 0, above = 0, below = 0, avg = 0;
      s.forEach(stu => {
        stu.cie_marks?.forEach(m => {
          total++;
          avg += (m.obtained ?? 0);
          if ((m.obtained ?? -1) >= (m.expected ?? 0)) above++;
          else below++;
        });
      });
      avg = total ? (avg / total).toFixed(2) : 0;
      setSummary({ total, aboveExpected: above, belowExpected: below, average: avg });
    }
    load();
  },[]);

  return (
    <div style={{display:"grid", gap:16}}>
      <div className="card">
        <h3>Faculty Performance Overview</h3>
        <div className="row" style={{marginTop:12}}>
          <div className="card" style={{flex:1, minWidth:160}}>
            <div className="small muted">Total Records</div>
            <div className="kpi">{summary.total}</div>
          </div>
          <div className="card" style={{flex:1, minWidth:160}}>
            <div className="small muted">Above Expected</div>
            <div className="kpi" style={{color:"var(--primary)"}}>{summary.aboveExpected}</div>
          </div>
          <div className="card" style={{flex:1, minWidth:160}}>
            <div className="small muted">Below Expected</div>
            <div className="kpi" style={{color:"var(--accent)"}}>{summary.belowExpected}</div>
          </div>
          <div className="card" style={{flex:1, minWidth:160}}>
            <div className="small muted">Average Marks</div>
            <div className="kpi">{summary.average}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>At-Risk Students</h3>
        <table className="table" style={{marginTop:10}}>
          <thead><tr><th>Student</th><th>Subject</th><th>Expected</th><th>Obtained</th><th>Contact</th></tr></thead>
          <tbody>
            {students.flatMap(stu =>
              (stu.cie_marks || []).filter(m => (m.obtained ?? -1) < (m.expected ?? 0)).map((m, i) => (
                <tr key={`${stu.id}-${i}`}>
                  <td>{stu.name}</td>
                  <td>{m.subjectId}</td>
                  <td>{m.expected}</td>
                  <td>{m.obtained ?? "-"}</td>
                  <td>
                    <a className="btn btn-ghost" style={{padding:"6px 10px", fontSize:"0.85rem"}} href={`mailto:${stu.email}`}>Email</a>
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
