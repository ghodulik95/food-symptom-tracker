// services/storage.js
const DB_NAME = "app-storage";
const STORE_NAME = "appdata";

async function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function initDataFile() {
  await getDB(); // ensures DB exists
  return true;
}

export async function loadData() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const req = store.get("data");

    req.onsuccess = () => {
      if (req.result !== undefined) {
        console.log("📂 Loaded from IndexedDB:", req.result);
        resolve(req.result);
      } else {
        console.log("📂 No record found, returning defaults");
        resolve({ apiKey: "", entries: [] });
      }
    };

    req.onerror = () => {
      console.error("❌ loadData failed:", req.error);
      reject(req.error);
    };
  });
}

export async function saveData(data) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const safeData = {
      apiKey: data.apiKey || "",
      entries: Array.isArray(data.entries) ? data.entries : [],
			notes: data.notes || "",
    };

    const req = store.put(safeData, "data");

    req.onsuccess = () => {
      console.log("✅ Saved to IndexedDB:", safeData);
      resolve();
    };
    req.onerror = () => {
      console.error("❌ saveData failed:", req.error);
      reject(req.error);
    };
  });
}

// Download current DB contents as JSON
export async function exportData() {
  const data = await loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "food-symptom-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Upload a JSON backup file and restore it into IndexedDB
export async function importData(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  await saveData(data);
  return data; // so App can update state
}
