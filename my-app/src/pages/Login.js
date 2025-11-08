import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("pass");
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    try{
      const u = await login(email, password);
      // route based on role
      if (u.role === "faculty") nav("/staff/dashboard");
      else nav("/student/dashboard");
    }catch(err){
      setErr(err.message || "Login failed");
    }
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div className="card" style={{maxWidth:420,width:"94%"}}>
        <h2 style={{margin:0}}>Sign in</h2>
        <p className="small muted">Use <strong>alice@example.com / pass</strong> or <strong>bob@example.com / pass</strong></p>

        <form onSubmit={submit} style={{marginTop:12, display:"grid", gap:10}}>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          {err && <div style={{color:"crimson"}}>{err}</div>}
          <div style={{display:"flex", gap:8}}>
            <button className="btn btn-primary" type="submit">Login</button>
            <button type="button" className="btn btn-ghost" onClick={()=>{ setEmail("alice@example.com"); setPassword("pass"); }}>Fill demo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
