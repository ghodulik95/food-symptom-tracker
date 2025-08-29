export default function RecentFoods({ entries }) {
  const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000);
  const recent = entries.filter(
    (e) => e.type === "food" && new Date(e.time) > cutoff
  );

  const isNotable = (s) => {
		console.log(s);
    return (
      s.histamineContentLowMedHigh === "Medium" ||
      s.histamineContentLowMedHigh === "High" ||
      s.histamineLiberator === "Yes" ||
      s.glutenContent === "Present" ||
      s.dyesOrAdditives === "Present" ||
      s.lactoseContent === "High" ||
      s.fodmapCategory === "High"
    );
  };

  return (
    <div className="card">
      <h3>Recent Foods (last 36h)</h3>
      {recent.map((f, i) => {
        const notable =
          f.analysis?.sensitivities?.filter(isNotable) || [];
				const techniques = f.analysis?.likelyPreparationTechniques || [];

        return (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <b>{f.text}</b> at {f.time}
						{/* Preparation techniques */}
            {techniques.length > 0 && (
              <div style={{ marginTop: "0.25rem" }}>
                <i>Preparation:</i> {techniques.join(", ")}
              </div>
            )}
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
        );
      })}
    </div>
  );
}
