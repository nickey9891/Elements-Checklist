import type { Offense } from "../types";

/**
 * Normalizes a citation or search query so that trivially different
 * spellings compare equal. Steps, in order:
 *
 *   1. Lowercase everything.
 *   2. Replace the section symbol (§) and most punctuation with spaces.
 *   3. Collapse "u s c" (what "U.S.C." becomes after step 2) into "usc".
 *   4. Drop the filler words "usc", "section", "sec", and "title" —
 *      they never distinguish one offense from another.
 *   5. Collapse repeated whitespace and trim.
 *
 * Examples — all of these normalize to "18 1001":
 *   "18 U.S.C. § 1001"   "18 USC 1001"   "18 u.s.c 1001"
 *   "Title 18, Section 1001"
 */
export function normalizeSearch(input: string): string {
  return input
    .toLowerCase()
    .replace(/[§.,;:()\[\]"']/g, " ")
    .replace(/\bu\s+s\s+c\b/g, "usc")
    .replace(/\b(usc|section|sec|title)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** All searchable strings for one offense, pre-normalized. */
function searchKeys(offense: Offense): string[] {
  return [offense.citation, offense.title, ...offense.aliases].map(
    normalizeSearch
  );
}

/**
 * Returns offenses matching the query, best matches first.
 * Match quality, from strongest to weakest:
 *   3 — a key equals the query exactly
 *   2 — a key starts with the query (or the query starts with the key)
 *   1 — a key contains the query anywhere
 * Offenses with no match are excluded. If any exact match exists,
 * only exact matches are returned, so "1001" doesn't drag in partials.
 */
export function findOffenses(query: string, offenses: Offense[]): Offense[] {
  const q = normalizeSearch(query);
  if (q.length === 0) return [];

  const scored = offenses
    .map((offense) => {
      let score = 0;
      for (const key of searchKeys(offense)) {
        if (key === q) {
          score = Math.max(score, 3);
        } else if (key.startsWith(q) || q.startsWith(key)) {
          score = Math.max(score, 2);
        } else if (key.includes(q)) {
          score = Math.max(score, 1);
        }
      }
      return { offense, score };
    })
    .filter((entry) => entry.score > 0);

  const best = Math.max(0, ...scored.map((entry) => entry.score));
  const keep = best === 3 ? 3 : 1; // exact matches suppress partials
  return scored
    .filter((entry) => entry.score >= keep)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.offense);
}
