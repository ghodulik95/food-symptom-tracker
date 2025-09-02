import React, { useState } from "react";
import {formatDisplayDate} from "../utils/dateutils";


export default function SymptomsTable({ entries, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    start: "",
    end: ""
  });

  const startEdit = (sym) => {
    setEditId(sym.id);
    setEditValues({
      name: sym.name,
      start: sym.start || "",
      end: sym.end || ""
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues({ name: "", start: "", end: "" });
  };

  const saveEdit = () => {
    onUpdate({ id: editId, type: "other", ...editValues });
    cancelEdit();
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Other events</h2>
      <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Start</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>End</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.filter(e => e.type === "other")
						.sort((a, b) => new Date(b.start) - new Date(a.start))
						.map(sym => (
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
                          if (window.confirm(`Delete name "${sym.name}"?`)) {
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
