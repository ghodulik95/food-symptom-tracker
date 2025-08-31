import React, { useState } from "react";

export default function MedicationsTable({ entries, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", dosage: "", time: "" });

  const startEdit = (med) => {
    setEditId(med.id);
    setEditValues({ name: med.name, dosage: med.dosage, time: med.time });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues({ name: "", dosage: "", time: "" });
  };

  const saveEdit = () => {
    onUpdate({ id: editId, type: "medication", ...editValues });
    cancelEdit();
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>All Medications</h2>
      <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Dosage</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Time</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.filter(e => e.type === "medication").map(med => (
              <tr key={med.id}>
                <td>
                  {editId === med.id ? (
                    <input
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    />
                  ) : (
                    med.name
                  )}
                </td>
                <td>
                  {editId === med.id ? (
                    <input
                      value={editValues.dosage}
                      onChange={(e) => setEditValues({ ...editValues, dosage: e.target.value })}
                    />
                  ) : (
                    med.dosage
                  )}
                </td>
                <td>
                  {editId === med.id ? (
                    <input
                      type="datetime-local"
                      value={editValues.time}
                      onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                    />
                  ) : (
                    med.time
                  )}
                </td>
                <td>
                  {editId === med.id ? (
                    <>
                      <button onClick={saveEdit}>💾 Save</button>
                      <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>✖ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(med)}>✏️ Edit</button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${med.name}"?`)) {
                            onDelete(med);
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
