export default function DataInputOptionalDropdown({ name, setName, options, placeholder }) {
  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        list="medication-options"
      />
      <datalist id="medication-options">
        {options.map((opt, i) => (
          <option key={i} value={opt} />
        ))}
      </datalist>
    </>
  );
}