import React, { useState } from "react";

export default function PopupSelectAndFill({ options, onSelect }) {
  const [showPopup, setShowPopup] = useState(false);

  const handlePick = (value) => {
    onSelect(value);
    setShowPopup(false);
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Choose Item</button>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ background: "white", padding: "1rem", borderRadius: "8px" }}>
            <h3>Select an Option</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {options.map((opt, i) => (
                <li key={i} style={{ margin: "0.5rem 0" }}>
                  <button onClick={() => handlePick(opt)}>{opt}</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
