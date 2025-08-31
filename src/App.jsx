import React, { useState, useEffect, useRef } from "react";
import FoodEntry from "./components/FoodEntry";
import MedicationEntry from "./components/MedicationEntry";
import SymptomEntry from "./components/SymptomEntry";
import CurrentSymptoms from "./components/CurrentSymptoms";
import CurrentMedications from "./components/CurrentMedications";
import RecentFoods from "./components/RecentFoods";
import MedicationsTable from "./components/MedicationsTable";
import SymptomsTable from "./components/SymptomsTable";
import { initDataFile, loadData, saveData, exportData, importData } from "./services/fileSystem";

function App() {
  const [entries, setEntries] = useState([]);
  const [apiKey, setApiKey] = useState("");
	const [notes, setNotes] = useState("");
	const [initialized, setInitialized] = useState(false);
	const notesRef = useRef(null);

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      await initDataFile();
      const data = await loadData();
      console.log("Loaded data:", data);

      if (data.entries) {
        setEntries(data.entries);
      }
      if (data.apiKey) {
        setApiKey(data.apiKey);
      }
			
      if (data.notes) setNotes(data.notes); 
			setInitialized(true);
    })();
  }, []);
	
	const goToNotes = () => {
    notesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Save whenever entries or apiKey change
  useEffect(() => {
		if (initialized) {
			console.log(apiKey);
			console.log(entries);
			saveData({ apiKey, entries, notes });
		}
  }, [entries, apiKey, initialized, notes]);

  const addEntry = (entry) => {
		console.log(entry);
		entry.id = crypto.randomUUID();
    setEntries([...entries, entry]);
  };

  const updateEntry = (updated) => {
    const newEntries = entries.map(e => (e.id === updated.id ? updated : e));
    setEntries(newEntries);
  };

  const handleApiKeyChange = () => {
    const key = prompt("Enter your OpenAI API key:", apiKey || "");
    if (key) {
      setApiKey(key);
      localStorage.setItem("openai_api_key", key);
    }
  };
	
	const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const data = await importData(file);
    if (data.entries) setEntries(data.entries);
    if (data.apiKey) setApiKey(data.apiKey);
  };
	
	const handleDelete = (entryToDelete) => {
    setEntries(entries.filter((e) => e.id !== entryToDelete.id));
  };
	
	const medList = Array.from(
    new Set(
      entries
        .filter((e) => e.type === "medication" && e.name) // adjust field name if different
        .map((e) => e.name.trim())
    )
  );
	
	const symptomList = Array.from(
    new Set(
      entries
        .filter((e) => e.type === "symptom" && e.name) // adjust field name if different
        .map((e) => e.name.trim())
    )
  );
	
	const foodList = Array.from(
    new Set(
      entries
        .filter((e) => e.type === "food" && e.text) // adjust field name if different
        .map((e) => e.text)
    )
  );
	
	const medOptionsList = Array.from(
		new Set(
			entries
				.filter(e => e.type === "medication" && e.name && e.dosage)
				.map(e => JSON.stringify({ name: e.name, dosage: e.dosage }))
		)
	).map(str => JSON.parse(str));

  return (
    <div className="App">
      <h1>Food & Symptom Tracker</h1>

      <button onClick={handleApiKeyChange}>
        {apiKey ? "Update API Key" : "Set API Key"}
      </button>
			<button onClick={goToNotes} style={{ marginLeft: "1rem" }}>
        📝 Go to Notes
      </button>

      {!apiKey && (
        <p style={{ color: "red" }}>
          ⚠️ You must set your API key to analyze foods.
        </p>
      )}
			
			{/* Backup buttons */}
      <div style={{ margin: "1rem 0" }}>
        <button onClick={exportData}>⬇️ Download Backup</button>
        <label style={{ marginLeft: "1rem" }}>
          ⬆️ Upload Backup
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <FoodEntry onSave={addEntry} apiKey={apiKey} foodList={foodList} />
      <MedicationEntry onSave={addEntry} medList={medList} medOptionsList={medOptionsList} />
      <SymptomEntry onSave={addEntry} symptomList={symptomList} />

      <CurrentSymptoms entries={entries} onUpdate={updateEntry} />
      <CurrentMedications entries={entries} onUpdate={updateEntry} />
      <RecentFoods entries={entries} onDelete={handleDelete} />
			
			<MedicationsTable entries={entries} onUpdate={updateEntry} onDelete={handleDelete} />
			<SymptomsTable entries={entries} onUpdate={updateEntry} onDelete={handleDelete} />
			
			{/* ✅ Notes area */}
      <div ref={notesRef} style={{ marginTop: "2rem" }}>
        <h2>Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          style={{ width: "100%", padding: "0.5rem" }}
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
}

export default App;
