import React, { useEffect, useState } from "react";
import API from "../../api";

export default function Attendance() {
  const [records, setRecords] = useState([]);

useEffect(() => {
  API.get("records/")   // calls http://127.0.0.1:8000/api/records/
    .then((res) => setRecords(res.data))
    .catch((err) => console.log(err));
}, []);

  return (
    <div>
      <h2>Attendance</h2>

      {records.length === 0 ? (
        <p>No data</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r._id}>
              {r.name} - {r.roll} - {r.attendance}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
