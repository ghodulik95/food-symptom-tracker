import React, { useState } from "react";
import {formatDisplayDate} from "../utils/dateutils";


export default function SymptomsTable({ entries, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({
    symptom: "",
    intensity: "",
    start: "",
    end: ""
  });

  const startEdit = (sym) => {
    setEditId(sym.id);
    setEditValues({
      symptom: sym.symptom,
      intensity: sym.intensity || "",
      start: sym.start || "",
      end: sym.end || ""
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues({ symptom: "", intensity: "", start: "", end: "" });
  };

  const saveEdit = () => {
    onUpdate({ id: editId, type: "symptom", ...editValues });
    cancelEdit();
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>All Symptoms</h2>
      <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc" }}>symptom</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>intensity</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Start</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>End</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.filter(e => e.type === "symptom")
						.sort((a, b) => new Date(b.start) - new Date(a.start))
						.map(sym => (
              <tr key={sym.id}>
                <td>
                  {editId === sym.id ? (
                    <input
                      value={editValues.symptom}
                      onChange={(e) => setEditValues({ ...editValues, symptom: e.target.value })}
                    />
                  ) : (
                    sym.symptom
                  )}
                </td>
                <td>
                  {editId === sym.id ? (
                    <input
                      value={editValues.intensity}
                      onChange={(e) => setEditValues({ ...editValues, intensity: e.target.value })}
                    />
                  ) : (
                    sym.intensity || "-"
                  )}
                </td>
                <td>
                  {editId === sym.id ? (
                    <input
                      type="datetime-local"
                      value={editValues.start}
                      onChange={(e) => setEditValues({ ...editValues, start: e.target.value })}
                    />
                  ) : (
                    formatDisplayDate(sym.start) || "-"
                  )}
                </td>
                <td>
                  {editId === sym.id ? (
                    <input
                      type="datetime-local"
                      value={editValues.end}
                      onChange={(e) => setEditValues({ ...editValues, end: e.target.value })}
                    />
                  ) : (
                    formatDisplayDate(sym.end) || "-"
                  )}
                </td>
                <td>
                  {editId === sym.id ? (
                    <>
                      <button onClick={saveEdit}>💾 Save</button>
                      <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>✖ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(sym)}>✏️ Edit</button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete symptom "${sym.symptom}"?`)) {
                            onDelete(sym);
                          }
                        }}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        ❌ Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
