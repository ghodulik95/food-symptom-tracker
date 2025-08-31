import React, { useState } from "react";

export default function SymptomsTable({ entries, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    severity: "",
    start: "",
    end: ""
  });

  const startEdit = (sym) => {
    setEditId(sym.id);
    setEditValues({
      name: sym.name,
      severity: sym.severity || "",
      start: sym.start || "",
      end: sym.end || ""
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues({ name: "", severity: "", start: "", end: "" });
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
              <th style={{ borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Severity</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Start</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>End</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.filter(e => e.type === "symptom").map(sym => (
              <tr key={sym.id}>
                <td>
                  {editId === sym.id ? (
                    <input
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    />
                  ) : (
                    sym.name
                  )}
                </td>
                <td>
                  {editId === sym.id ? (
                    <input
                      value={editValues.severity}
                      onChange={(e) => setEditValues({ ...editValues, severity: e.target.value })}
                    />
                  ) : (
                    sym.severity || "-"
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
                    sym.start || "-"
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
                    sym.end || "-"
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
                          if (window.confirm(`Delete symptom "${sym.name}"?`)) {
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
