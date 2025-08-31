import React, { useState } from "react";
import { analyzeFood } from "../services/chatgpt";
import { startSpeechRecognition } from "../services/speech";
import { localNow } from "../utils/dateutils.js";
import PopupSelectAndFill from "./PopupSelectAndFill";

export default function FoodEntry({ onSave, apiKey, foodList }) {
  const [text, setText] = useState("");
  const [time, setTime] = useState(localNow());
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoAdd, setAutoAdd] = useState(true); // ✅ checkbox state

  const isNotable = (s) =>
    s.histamineContentLowMedHigh === "Medium" ||
    s.histamineContentLowMedHigh === "High" ||
    s.histamineLiberator === "Yes" ||
    s.glutenContent === "Present" ||
    s.dyesOrAdditives === "Present" ||
    s.lactoseContent === "High" ||
    s.fodmapCategory === "High";

  const handleVoice = () => startSpeechRecognition(setText);

  const handleSubmit = async () => {
    if (!apiKey) {
      alert("Please set your API key first.");
      return;
    }

    // Case: analysis already done, autoAdd disabled → Save manually
    if (!autoAdd && analysis && !loading) {
      onSave({ type: "food", text, time, analysis });
      return;
    }

    // Otherwise: run analysis
    setLoading(true);
    try {
      const result = await analyzeFood(text, apiKey);
      setAnalysis(result);
      if (autoAdd) {
        onSave({ type: "food", text, time, analysis: result });
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const notable = analysis?.sensitivities?.filter(isNotable) || [];

  return (
    <div className="card">
      <h3>Food Entry</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your food..."
      />
      <br />
      <PopupSelectAndFill options={foodList} onSelect={setText} />
			<button onClick={(e) => setText("")}>Clear</button>
      <br />

      <button onClick={handleVoice}>🎤 Voice Input</button>
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* ✅ Checkbox for auto-add */}
      <label style={{ marginLeft: "1rem" }}>
        <input
          type="checkbox"
          checked={autoAdd}
          onChange={(e) => setAutoAdd(e.target.checked)}
        />{" "}
        Auto-add
      </label>

      <button onClick={handleSubmit} disabled={loading}>
        {loading
          ? "Analyzing..."
          : !autoAdd && analysis
          ? "Save"
          : "Analyze"}
      </button>

      {analysis && (
        <div style={{ marginTop: "1rem" }}>
          {notable.length > 0 ? (
            <ul>
              {notable.map((s, j) => (
                <li key={j}>
                  {s.ingredientName} →
                  {s.histamineContentLowMedHigh !== "Low" &&
                    ` Histamine: ${s.histamineContentLowMedHigh}`}
                  {s.histamineLiberator === "Yes" && " (Histamine Liberator)"}
                  {s.glutenContent === "Present" && " (Gluten)"}
                  {s.dyesOrAdditives === "Present" && " (Additives)"}
                  {s.lactoseContent === "High" && " (Lactose)"}
                  {s.fodmapCategory === "High" && " (High FODMAP)"}
                </li>
              ))}
            </ul>
          ) : (
            <div>No notable sensitivities</div>
          )}
        </div>
      )}
    </div>
  );
}
