import React, { useState, useEffect } from "react";
import { toLocalDateTimeString, localNow } from "../utils/dateutils";

export default function CurrentSymptoms({ entries, onUpdate }) {
  const ongoing = entries.filter(e => e.type === "symptom" && !e.end);

  const [endTimes, setEndTimes] = useState({});

  useEffect(() => {
    setEndTimes(prev => {
      const next = { ...prev };
      let changed = false;

      ongoing.forEach((s, i) => {
        const key = s.id || i;
        if (!next[key]) {
          const startDate = new Date(s.start);
          const threeHoursLater = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
          const now = new Date();
          const defaultEnd = toLocalDateTimeString(
							now < threeHoursLater 
							? now 
							: threeHoursLater
					    );
          next[key] = defaultEnd;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [ongoing]);

  return (
    <div className="card">
      <h3>Current Symptoms</h3>
      {ongoing.map((s, i) => {
        const key = s.id || i;
        return (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <b>{s.symptom}</b> (Intensity {s.intensity}) since {s.start}
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => {
                  const newEnd = localNow();
                  onUpdate({ ...s, end: newEnd });
                }}
              >
                End Now
              </button>
              <input
                type="datetime-local"
                value={endTimes[key] || ""}
                onChange={(e) =>
                  setEndTimes(prev => ({ ...prev, [key]: e.target.value }))
                }
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
              />
              <button
                onClick={() => {
                  if (endTimes[key]) {
                    onUpdate({ ...s, end: endTimes[key] });
                  }
                }}
              >
                Set End Time
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
