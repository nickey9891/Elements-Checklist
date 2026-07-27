# Federal Violation Elements Checklist

A standalone, mobile-friendly reference app. Enter a federal criminal statute
or offense name; get a checklist of every element the government must prove
beyond a reasonable doubt. Nothing else — no penalties, defenses, or evidence
notes by design.

Stack: React + TypeScript + Vite, plain CSS, local JSON database. No API,
no server, no paid services.

## Running it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). On your phone on
the same Wi-Fi network, run `npm run dev -- --host` and open the network URL
it prints.

A production build is included in `dist/` — you can open those files from any
static server without building anything.

## Adding a new statute

1. Open `src/data/federalOffenses.json`.
2. Copy an existing entry and edit it. Every field is required:

```json
{
  "id": "18-1621",
  "citation": "18 U.S.C. § 1621",
  "title": "Perjury",
  "jurisdiction": "Fifth Circuit",
  "aliases": ["18 USC 1621", "1621", "Perjury"],
  "elements": [
    "First element, verified verbatim against the source.",
    "Second element."
  ],
  "source": "Fifth Circuit Pattern Jury Instructions (Criminal Cases) (2019), Perjury.",
  "lastVerified": "2026-07-26"
}
```

3. Rules of the road:
   - **Do not populate an entry unless the elements are verified** against a
     pattern jury instruction, controlling case law, or the statute itself.
   - `id` must be unique — it keys the checkbox state.
   - If a statute has multiple offenses (e.g., § 1030), pin the entry to a
     specific subsection in `citation` and `title`.
   - If circuits formulate the elements differently, add **separate entries**
     with different `jurisdiction` values (e.g., `"18-1001-5th"` and
     `"18-1001-9th"`). Never merge conflicting versions.
4. Save. The dev server hot-reloads; for production, run `npm run build`.

## Deploying as a simple website

The app is fully static. `vite.config.ts` sets `base: "./"`, so the build
works from any folder or sub-path.

**GitHub Pages (matches your existing setup):**

```bash
npm run build
```

Copy the contents of `dist/` into a repo (e.g., `elements-checklist`), push,
and enable Pages on the main branch in the repo settings. It will be live at
`https://<username>.github.io/elements-checklist/`.

**Netlify / Cloudflare Pages:** point the project at this folder, build
command `npm run build`, output directory `dist`.

**Any web server:** upload the contents of `dist/` to any static host.

## How search normalization works

Both the user's query and every stored search key (citation, title, aliases)
pass through the same function, `normalizeSearch()` in
`src/utilities/normalizeSearch.ts`:

1. Lowercase everything.
2. Replace the section symbol (§) and punctuation (periods, commas,
   parentheses, etc.) with spaces.
3. Collapse `u s c` — what "U.S.C." becomes after step 2 — into `usc`.
4. Drop the filler tokens `usc`, `section`, `sec`, and `title`, since they
   never distinguish one offense from another.
5. Collapse repeated spaces and trim.

So `18 U.S.C. § 1001`, `18 USC 1001`, `18 u.s.c 1001`, and
`Title 18, Section 1001` all normalize to `18 1001` and hit the same record.

Matching then scores each offense: exact match (3) beats prefix match (2)
beats substring match (1). If any exact match exists, partial matches are
suppressed — so `1001` goes straight to § 1001 instead of listing everything
containing those digits. One match renders the checklist directly; several
matches render a pick list; zero matches shows
"Violation not found in the current database." The app never generates
elements for a statute that isn't in the database.

## Project layout

```
src/
  components/
    SearchBar.tsx          search field + Search / Clear buttons
    SearchResults.tsx      pick list when several offenses match
    ElementsChecklist.tsx  the checklist result + Print button
  data/
    federalOffenses.json   the verified offense database
  utilities/
    normalizeSearch.ts     normalization + matching
  types.ts                 the Offense record shape
  App.tsx                  state and layout
  main.tsx                 entry point
  styles.css               all styling, including print styles
```

## Scope notes

- Checkbox selections persist while the page is open (including when you
  search for a different statute and come back). **Clear** resets everything.
- **Print checklist** hides the search UI and prints only the citation,
  offense name, and elements.
- The disclaimer at the bottom of the page is intentionally outside the
  checklist card and excluded from printing.
