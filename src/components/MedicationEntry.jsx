import React, { useState } from "react";
import { localNow } from "../utils/dateutils";
import DataInputOptionalDropdown from "./DataInputOptionalDropdown";

export default function MedicationEntry({ onSave, medList, medOptionsList }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState(localNow());
  const [useManual, setUseManual] = useState(true);
	
	const medOptions = [
    "Manual Entry",
    ...new Set(medOptionsList.map((m) => `${m.name} ${m.dosage}`)),
  ];

  const handleDropdownSelect = (value) => {
    if (value === "Manual Entry") {
      setUseManual(true);
      setName("");
      setDosage("");
    } else {
      setUseManual(false);
      // Split the combined "name dosage"
      const [selectedName, ...rest] = value.split(" ");
      setName(selectedName);
      setDosage(rest.join(" "));
    }
  };

  const handleSubmit = () => {
    onSave({ type: "medication", name, dosage, time });
  };

  return (
    <div className="card">
      <h3>Medication Entry</h3>

      {/* Dropdown for previous meds */}
      <select onChange={(e) => handleDropdownSelect(e.target.value)}>
        {medOptions.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Manual input fields only visible if "Manual Entry" */}
      {useManual && (
        <>
          <DataInputOptionalDropdown
            name={name}
            setName={setName}
            options={[...new Set(medList.map((m) => m.name))]}
            placeholder="Medication name"
          />
          <input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Dosage"
          />
        </>
      )}

      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
