import type { Offense } from "../types";

interface ElementsChecklistProps {
  offense: Offense;
  /** Which element indexes are checked for this offense. */
  checked: boolean[];
  onToggle: (elementIndex: number) => void;
}

export default function ElementsChecklist({
  offense,
  checked,
  onToggle,
}: ElementsChecklistProps) {
  return (
    <section className="card checklist" aria-label="Elements checklist">
      <h2 className="checklist-heading">
        {offense.citation} — {offense.title}
      </h2>
      <p className="checklist-jurisdiction">
        Elements as formulated by: {offense.jurisdiction}
      </p>

      <ul className="element-list">
        {offense.elements.map((element, index) => {
          const inputId = `${offense.id}-element-${index}`;
          return (
            <li key={inputId} className="element-item">
              <input
                id={inputId}
                type="checkbox"
                className="element-checkbox"
                checked={checked[index] ?? false}
                onChange={() => onToggle(index)}
              />
              <label htmlFor={inputId} className="element-label">
                {element}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="checklist-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.print()}
        >
          Print checklist
        </button>
      </div>
    </section>
  );
}
