import {localNow, isToday, formatDisplayDate} from "../utils/dateutils";

export default function CurrentMedications({ entries, onUpdate }) {
  const ongoing = entries.filter(
										e => e.type === "medication" && isToday(e.time))
										.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="card">
      <h3>Current Medications</h3>
      {ongoing.map((m, i) => (
        <div key={i}>
          <b>{m.name}</b> ({m.dosage}) at {formatDisplayDate(m.time)}
        </div>
      ))}
    </div>
  );
}

