// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.
// Quelle: die per SVERWEIS referenzierten Lookup-Sheets (-> lookups.json).
import lookupsJson from './lookups.json';

export type LookupRow = Record<string, string>;

export const LOOKUP_TABLES = lookupsJson as unknown as Record<string, LookupRow[]>;
