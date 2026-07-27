import { useState, type FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (value.trim().length > 0) {
      onSearch(value);
    }
  }

  function handleClear() {
    setValue("");
    onClear();
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label className="search-label" htmlFor="statute-search">
        Statute or offense name
      </label>
      <input
        id="statute-search"
        className="search-input"
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="18 U.S.C. § 1001 · 18 USC 951 · Wire Fraud · Conspiracy"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="search-actions">
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}
