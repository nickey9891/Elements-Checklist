import type { Offense } from "../types";

interface SearchResultsProps {
  results: Offense[];
  onSelect: (offense: Offense) => void;
}

export default function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <section className="card" aria-label="Matching offenses">
      <h2 className="card-heading">
        {results.length} matching offenses — select one
      </h2>
      <ul className="result-list">
        {results.map((offense) => (
          <li key={offense.id}>
            <button
              type="button"
              className="result-item"
              onClick={() => onSelect(offense)}
            >
              <span className="result-citation">{offense.citation}</span>
              <span className="result-title">{offense.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
