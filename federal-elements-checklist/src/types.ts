export interface Offense {
  /** Stable unique key, e.g. "18-1001". Used for checkbox state. */
  id: string;
  /** Display citation, e.g. "18 U.S.C. § 1001(a)(2)". */
  citation: string;
  /** Offense name shown next to the citation. */
  title: string;
  /**
   * Whose formulation of the elements this entry follows, e.g.
   * "Fifth Circuit" or "General (statutory text)". Add parallel entries
   * with different jurisdiction values when circuits conflict — never
   * merge conflicting formulations into one checklist.
   */
  jurisdiction: string;
  /** Search terms in addition to citation and title. */
  aliases: string[];
  /** Each element the government must prove beyond a reasonable doubt. */
  elements: string[];
  /** Authority used to verify the elements. */
  source: string;
  /** ISO date the elements were last checked against the source. */
  lastVerified: string;
}
