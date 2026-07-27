import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import ElementsChecklist from "./components/ElementsChecklist";
import { findOffenses } from "./utilities/normalizeSearch";
import offensesData from "./data/federalOffenses.json";
import type { Offense } from "./types";

const offenses = offensesData as Offense[];

type View =
  | { kind: "idle" }
  | { kind: "not-found" }
  | { kind: "results"; results: Offense[] }
  | { kind: "checklist"; offense: Offense };

export default function App() {
  const [view, setView] = useState<View>({ kind: "idle" });
  // Checkbox state, keyed by offense id, kept for the life of the page
  // so re-running a search doesn't wipe a checklist in progress.
  const [checkedByOffense, setCheckedByOffense] = useState<
    Record<string, boolean[]>
  >({});

  function handleSearch(query: string) {
    const results = findOffenses(query, offenses);
    if (results.length === 0) {
      setView({ kind: "not-found" });
    } else if (results.length === 1) {
      setView({ kind: "checklist", offense: results[0] });
    } else {
      setView({ kind: "results", results });
    }
  }

  function handleClear() {
    setView({ kind: "idle" });
    setCheckedByOffense({});
  }

  function handleToggle(offense: Offense, elementIndex: number) {
    setCheckedByOffense((previous) => {
      const current =
        previous[offense.id] ?? new Array(offense.elements.length).fill(false);
      const next = [...current];
      next[elementIndex] = !next[elementIndex];
      return { ...previous, [offense.id]: next };
    });
  }

  return (
    <div className="page">
      <header className="masthead">
        <p className="masthead-eyebrow">Legal reference</p>
        <h1 className="masthead-title">Federal Violation Elements Checklist</h1>
      </header>

      <main className="content">
        <SearchBar onSearch={handleSearch} onClear={handleClear} />

        {view.kind === "not-found" && (
          <p className="not-found" role="status">
            Violation not found in the current database.
          </p>
        )}

        {view.kind === "results" && (
          <SearchResults
            results={view.results}
            onSelect={(offense) => setView({ kind: "checklist", offense })}
          />
        )}

        {view.kind === "checklist" && (
          <ElementsChecklist
            offense={view.offense}
            checked={
              checkedByOffense[view.offense.id] ??
              new Array(view.offense.elements.length).fill(false)
            }
            onToggle={(index) => handleToggle(view.offense, index)}
          />
        )}
      </main>

      <footer className="disclaimer">
        This tool is a legal-reference aid and does not replace review of the
        current statute, controlling case law, applicable pattern jury
        instructions, or guidance from a prosecutor.
      </footer>
    </div>
  );
}
