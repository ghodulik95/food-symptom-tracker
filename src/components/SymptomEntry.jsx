import React, { useState } from "react";
import { localNow } from "../utils/dateutils.js";
import DataInputOptionalDropdown from "./DataInputOptionalDropdown";

export default function SymptomEntry({ onSave, symptomList }) {
  const [symptom, setSymptom] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [start, setStart] = useState(localNow());
  const [end, setEnd] = useState("");

  const handleSubmit = () => {
    onSave({ type: "symptom", symptom, intensity, start, end: end || null });
  };

  return (
    <div className="card">
      <h3>Symptom Entry</h3>
			<DataInputOptionalDropdown name={symptom} setName={setSymptom} options={symptomList} placeholder={"Symptom description"} />
			<input type="number" min="0" max="10" value={intensity} onChange={(e) => setIntensity(e.target.value)} />
      <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
      <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
