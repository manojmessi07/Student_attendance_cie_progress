import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function Attendance(){
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ subjectId:"", from:"", to:"", reason:"", doc:null, });
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    if(user) api.getStudentData(user.id).then(setData);
  },[user]);

  async function apply(e){
    e.preventDefault();
    const leave = {
      studentId: user.id,
      subjectId: form.subjectId,
      from: form.from,
      to: form.to,
      reason: form.reason,
      docLink: form.doc ? "uploaded-placeholder.pdf" : null
    };
    await api.applyLeave(leave);
    setMsg("Leave applied");
    const d = await api.getStudentData(user.id);
    setData(d);
    setTimeout(()=>setMsg(""), 2000);
  }

  if(!data) return <div className="card">Loading...</div>;

  const totalFor = (sid) => data.attendance.filter(a=>a.subjectId===sid).length;
  const presentFor = (sid) => data.attendance.filter(a=>a.subjectId===sid && a.status==="present").length;

  return (
    <div style={{display:"grid", gap:16}}>
      <div className="card">
        <h3>Apply for leave</h3>
        <form onSubmit={apply} style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10}}>
          <select className="select" value={form.subjectId} onChange={e=>setForm({...form, subjectId:e.target.value})}>
            <option value="select subject">Select subject (optional)</option>
            {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input className="input" type="date" value={form.from} onChange={e=>setForm({...form, from:e.target.value})} />
          <input className="input" type="date" value={form.to} onChange={e=>setForm({...form, to:e.target.value})} />
          <input className="input" placeholder="Reason" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
          <input className="input" type="file" onChange={e=>setForm({...form, doc: e.target.files[0]})} />
          <div style={{gridColumn:"1/-1"}}>
            <button className="btn btn-primary" type="submit">Apply</button>
            {msg && <span className="msg">{msg}</span>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Attendance overview</h3>
        <table className="table" style={{marginTop:10}}>
          <thead><tr><th>Subject</th><th>Present</th><th>Total</th><th>%</th></tr></thead>
          <tbody>
            {data.subjects.map(s => {
              const tot = totalFor(s.id);
              const pres = presentFor(s.id);
              const pct = tot ===0 ? 100 : Math.round((pres/tot)*100);
              return <tr key={s.id}>
                <td>{s.name}</td><td>{pres}</td><td>{tot}</td><td>{pct}%</td>
              </tr>;
            })}
          </tbody>
        </table>

        <h4 style={{marginTop:12}}>Leaves</h4>
        <div style={{marginTop:8}}>
          {data.leaves.length===0 && <div className="small muted">No leaves found.</div>}
          {data.leaves.map(l => (
            <div key={l.id} style={{padding:10, borderRadius:8, border:"1px solid rgba(0,0,0,0.04)", marginBottom:8}}>
              <div><strong>{l.reason}</strong> ({l.from} → {l.to})</div>
              <div className="small muted">Status: {l.status}</div>
              {l.docLink && <div><a href="#preview" className="small muted">Attached file</a></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
