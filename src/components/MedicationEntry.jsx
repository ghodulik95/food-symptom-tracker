import React, { useState } from "react";
import {localNow} from "../utils/dateutils";
import DataInputOptionalDropdown from "./DataInputOptionalDropdown";

export default function MedicationEntry({ onSave, medList }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState(localNow());

  const handleSubmit = () => {
    onSave({ type: "medication", name, dosage, time });
  };

  return (
    <div className="card">
      <h3>Medication Entry</h3>
      <DataInputOptionalDropdown name={name} setName={setName} options={medList} />
			<input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage" />
      <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
			<button onClick={handleSubmit}>Save</button>
    </div>
  );
}
