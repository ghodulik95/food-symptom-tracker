export function toLocalDateTimeString(date) {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export function localNow() {
	return toLocalDateTimeString(new Date());
}

export function isToday(dateString) {
  const input = new Date(dateString);
  if (isNaN(input)) return false; // invalid date

  const now = new Date();

  return (
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth() &&
    input.getDate() === now.getDate()
  );
}

export function formatDisplayDate(dateString) {
	if (!dateString) {
		return null;
	}
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    month: "long",   // "August"
    day: "numeric",  // "29"
    hour: "numeric", // "5"
    minute: "2-digit", // "02"
    hour12: true     // AM/PM
  });
}