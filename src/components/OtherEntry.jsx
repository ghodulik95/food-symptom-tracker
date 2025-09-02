import React, { useState } from "react";
import { localNow } from "../utils/dateutils.js";
import DataInputOptionalDropdown from "./DataInputOptionalDropdown";

export default function OtherEntry({ onSave, otherList }) {
  const [name, setName] = useState("");
  const [start, setStart] = useState(localNow());
  const [end, setEnd] = useState("");
  const [useManual, setUseManual] = useState(true);
	
	const otherOptions = [
    "Manual Entry",
    ...new Set(otherList),
  ];
	
	const handleDropdownSelect = (value) => {
    if (value === "Manual Entry") {
      setUseManual(true);
      setOther("");
    } else {
      setUseManual(false);
			setOther(value)
    }
  };

  const handleSubmit = () => {
    onSave({ type: "other", name, start, end: end || null });
  };

  return (
    <div className="card">
      <h3>Other Entry</h3>
			{/* Dropdown for previous meds */}
      <select onChange={(e) => handleDropdownSelect(e.target.value)}>
        {otherOptions.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
			<DataInputOptionalDropdown name={name} setName={setName} options={otherList} placeholder={"Other description"} />
			<input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
      <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
