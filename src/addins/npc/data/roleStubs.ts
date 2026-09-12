import type { PoolAllocation } from '../../../state/characterStore';

export interface RoleStubWeapon {
  sourceRow: number;
  materialSourceRow: number;
  fertigungSourceRow: number;
  anpassungSourceRow: number;
  schaftmaterialSourceRow: number;
  poolReferenz: string;
  pool: PoolAllocation;
}

export interface RoleStubFirearm {
  musketeSourceRow: number;
  musketeKaliber: number;
  pistoleSourceRow: number;
  pistoleKaliber: number;
  verarbeitungSourceRow: number;
  anpassungSourceRow: number;
}

export interface RoleStub {
  id: string;
  label: string;
  armorPackageId: string;
  talente: string[];
  /** WHK/Grundfertigkeit/Sonderfertigkeit/Nahkampf-Hauptwerte, in Kaufreihenfolge (Hauptfertigkeit
   *  vor Spezialisierung - siehe characterMutations.ts's setValue-Deckel). */
  fertigkeiten: Array<{ referenz: string; wert: number }>;
  weapons: RoleStubWeapon[];
  unbewaffnetPool: PoolAllocation;
  sskStufe: number;
  /**
   * Erhöhung über das artspezifische Minimum hinaus (Delta, kein absoluter Wert - die Minima
   * unterscheiden sich stark je Spezies, siehe Budgetgrundlage.md). Nutzer 2026-09-12: relevante
   * Eigenschaften "müssten ausgesteigert werden, um bessere LE und Kampfwerte zu erreichen" -
   * für einen Nahkämpfer typischerweise Konstitution/Stärke (beide fließen direkt in
   * le_brust/le_kopf/le_unterleib und die AT/PA-Basiswerte ein, siehe rules.json).
   */
  eigenschaftenSteigerung: Record<string, number>;
  /**
   * Attribute-Kategorie (att_glueck, att_vitalitaet, ...) - eigene, quadratisch teure Kosten-
   * formel (10×wert²+70×wert), unabhängig von Eigenschaften. Nutzer 2026-09-12: "Attribute
   * müssten für Schützen auf Glück steigern, für Nahkämpfer auf Vitalität mit Rest Glück" - att_
   * glueck speist Ausweichen (aw_off/def_normal), att_vitalitaet speist alle drei Lebensenergie-
   * Zonen plus Ausdauer/Alchemieresistenz/Gesundheit (siehe rules.json). Reihenfolge relevant:
   * erster Eintrag hat Priorität, der Rest bekommt, was vom Budget übrig bleibt.
   */
  attribute: Array<{ referenz: string; wert: number }>;
  /**
   * Feuerwaffen sind im Katalog durchgehend kulturell gebunden (Spalte "Volk", z.B.
   * "Goblinisch", "Orkisch", "Zwergisch") - anders als NK-Waffen gibt es keine einzige
   * Volk=ALLE-Feuerwaffe. Der Schluessel hier ist bewusst ein "Waffenkammer"-Label, keine
   * Spezies: welche Feuerwaffen ein NSC fuehrt, richtet sich nach der Ausstattung seines
   * tatsaechlichen Standorts, nicht (nur) nach seiner eigenen Spezies (Nutzer 2026-09-11: "ein
   * Ork im Zwergenland wird eine zwergische Waffe fuehren, da die Waffenkammer mit zwergischen
   * Waffen bestueckt wird"). generateFromRoleStub() waehlt per Default die zur Spezies passende
   * Waffenkammer, laesst sich aber per firearmSet-Parameter ueberschreiben.
   */
  firearmSets: Record<string, RoleStubFirearm>;
}

export const SPEZIES_SSK: Record<string, { kultur: string; sprache: string }> = {
  Goblins: { kultur: 'ssk_kultur_goblins', sprache: 'ssk_sprache_goblinisch' },
  Zwerge: { kultur: 'ssk_kultur_zwerge', sprache: 'ssk_sprache_zwergisch' },
  Orks: { kultur: 'ssk_kultur_orks', sprache: 'ssk_sprache_orkisch' },
  Trolle: { kultur: 'ssk_kultur_trolle', sprache: 'ssk_sprache_trollisch' },
};

/** Verarbeitung "Massenfabrikation" (sourceRow 37) und Anpassung "Von der Stange" (sourceRow 46)
 *  sind in src/data/equipment/fernkampf.json ohne Volk-Einschränkung hinterlegt und gelten daher
 *  für jede Spezies - anders als die Feuerwaffen-Basiszeilen selbst. */
const FEUERWAFFEN_VERARBEITUNG_MASSENFAB = 37;
const FEUERWAFFEN_ANPASSUNG_VON_DER_STANGE = 46;

/**
 * Wache-Rollen-Stub (Nutzer 2026-09-11, erster spezies-unabhaengiger Rollen-Generator-Baustein).
 * Fertigkeits-/Ausruestungsinhalt uebernommen aus der handgebauten Goblin-Wachmann-Referenz
 * (data/npc/wachmann.json) - Attribute/SSK kommen spezies-abhaengig aus dem Generator selbst.
 *
 * Mehrere Hauptfertigkeiten (nk_stangenwaffen, whk_rechtskunde, whk_ermittlung, whk_ueberleben,
 * fk_feuerwaffen) auf den Wert ihrer hoechsten Spezialisierung statt der Referenz-Werte
 * angehoben: die Referenz hatte durchgehend Spezialisierungen ueber der eigenen Hauptfertigkeit -
 * das verletzt den in setValue() durchgesetzten Deckel "Spezialisierung <= Hauptfertigkeit" und
 * liesse sich nur per direktem JSON-Import, nicht per echter Mutation, erzeugen. Der Generator
 * baut ausschliesslich ueber echte Mutationsfunktionen (siehe engine/roleGenerator.ts), daher
 * hier korrigiert.
 */
export const WACHE_STUB: RoleStub = {
  id: 'wache',
  label: 'Wache',
  armorPackageId: 'nahkaempfer-lederpanzer',
  sskStufe: 3,
  talente: [
    'talente_ruestungsmanoever_stufe_1',
    'talente_fernkampfgeschick_stufe_1',
    'talente_vorderlader_ladeschuetze_stufe1',
    'talente_schnell_ziehen_muskete',
  ],
  fertigkeiten: [
    { referenz: 'whk_rechtskunde', wert: 8 },
    { referenz: 'whk_spez_rechtskunde_strafrecht', wert: 8 },
    { referenz: 'whk_spez_rechtskunde_buergerrecht', wert: 4 },
    { referenz: 'whk_ermittlung', wert: 8 },
    { referenz: 'whk_spez_ermittlung_observation', wert: 8 },
    { referenz: 'whk_spez_ermittlung_spurenlesen', wert: 4 },
    { referenz: 'whk_spez_ermittlung_verhoer', wert: 4 },
    { referenz: 'whk_administration', wert: 5 },
    { referenz: 'whk_ueberleben', wert: 6 },
    { referenz: 'whk_spez_ueberleben_stadt', wert: 6 },
    { referenz: 'whk_militaertheorie', wert: 4 },
    { referenz: 'gr_einschuechtern', wert: 5 },
    { referenz: 'gr_menschenkenntnis', wert: 7 },
    { referenz: 'gr_orientierung', wert: 6 },
    { referenz: 'gr_koerperbeherrschung', wert: 6 },
    { referenz: 'gr_laufen', wert: 5 },
    { referenz: 'gr_klettern', wert: 2 },
    { referenz: 'gr_faehrtensuche', wert: 3 },
    { referenz: 'gr_schaetzen', wert: 3 },
    { referenz: 'gr_schwimmen', wert: 2 },
    { referenz: 'gr_springen', wert: 2 },
    { referenz: 'gr_ueberzeugen', wert: 4 },
    { referenz: 'gr_werfen', wert: 3 },
    { referenz: 'sf_ausdauer', wert: 7 },
    { referenz: 'sf_ausweichen', wert: 4 },
    { referenz: 'sf_gefahreninstinkt', wert: 8 },
    { referenz: 'sf_selbstbeherrschung', wert: 7 },
    { referenz: 'sf_tragen', wert: 8 },
    { referenz: 'nk_unbewaffnet', wert: 4 },
    { referenz: 'nk_spez_unbewaffnet_unbewaffnet', wert: 4 },
    { referenz: 'nk_stangenwaffen', wert: 23 },
    { referenz: 'nk_spez_stangenwaffen_speere', wert: 12 },
    { referenz: 'nk_spez_stangenwaffen_staebe', wert: 23 },
    { referenz: 'fk_feuerwaffen', wert: 10 },
    { referenz: 'fk_spez_feuerwaffen_musketen', wert: 10 },
    { referenz: 'fk_spez_feuerwaffen_pistolen', wert: 10 },
    { referenz: 'sf_ladeschuetze_vorderlader', wert: 12 },
  ],
  weapons: [
    {
      sourceRow: 183, materialSourceRow: 2, fertigungSourceRow: 4, anpassungSourceRow: 2, schaftmaterialSourceRow: 2,
      poolReferenz: 'nk_pool_stangenwaffen_speere', pool: { nat: 6, npa: 6, gat: 0, gpa: 0, mat: 0, mpa: 0 },
    },
    {
      sourceRow: 188, materialSourceRow: 2, fertigungSourceRow: 4, anpassungSourceRow: 2, schaftmaterialSourceRow: 2,
      poolReferenz: 'nk_pool_stangenwaffen_staebe', pool: { nat: 7, npa: 8, gat: 4, gpa: 4, mat: 0, mpa: 0 },
    },
  ],
  unbewaffnetPool: { nat: 2, npa: 2, gat: 0, gpa: 0, mat: 0, mpa: 0 },
  // Kreis 1 ist der "durchschnittliche Erwachsene" (NSC-Vorlagen-Doc) - artspezifisches Minimum
  // reicht hier, keine zusätzliche Eigenschafts-/Attribut-Investition.
  eigenschaftenSteigerung: {},
  attribute: [],
  // Jede Zeile ist per bewusster Auswahl auf eine für Neu-NSCs tatsächlich käufliche Kombination
  // geprüft: Verfügbarkeit unter der Kaufsperre VERFUEGBARKEIT_SPERRE_AB=5 (characterMutations.ts),
  // Vorderlader (gemeinsame Ladeschütze-Sonderfertigkeit), Mindeststärke von keiner Zielspezies
  // gerissen. Für "Orkisch" gibt es dafür KEINE Kombination im Katalog - jede orkische Feuerwaffe
  // hat Verfügbarkeit ≥5 und ist für einen frischen NSC gar nicht kaufbar; ein Ork bräuchte also
  // ohnehin eine fremde Waffenkammer.
  firearmSets: {
    Goblinisch: {
      musketeSourceRow: 33, musketeKaliber: 16, pistoleSourceRow: 47, pistoleKaliber: 16,
      verarbeitungSourceRow: FEUERWAFFEN_VERARBEITUNG_MASSENFAB, anpassungSourceRow: FEUERWAFFEN_ANPASSUNG_VON_DER_STANGE,
    },
    Zwergisch: {
      musketeSourceRow: 82, musketeKaliber: 17, pistoleSourceRow: 85, pistoleKaliber: 17,
      verarbeitungSourceRow: FEUERWAFFEN_VERARBEITUNG_MASSENFAB, anpassungSourceRow: FEUERWAFFEN_ANPASSUNG_VON_DER_STANGE,
    },
    // Trolle/Orks: im Katalog existiert keine trollische Feuerwaffe und keine kaufbare orkische
    // (siehe oben) - Standardzuordnung in generateFromRoleStub() faellt fuer diese Spezies daher
    // bewusst auf "kein Feuerwaffen-Set" zurueck, sofern kein firearmSet explizit uebergeben wird.
  },
};

/**
 * Hauptmann-Rollen-Stub (Nutzer 2026-09-11): Führungs-Ausbaustufe auf derselben Rollen-Basis wie
 * Wache - "Rang als eigene Achse, orthogonal zur Rolle", wie besprochen. Gleiche Rüstung/
 * Waffenfamilie/Waffenkammer-Logik wie WACHE_STUB, aber mit dem größeren Kreis-3+-Budget
 * (7.550 statt 6.420 SP) in Führungskompetenz und Kampfausbau investiert: laut NSC-Vorlagen-Doc
 * "braucht ein Hauptmann zusätzlich Überzeugen, Einschüchtern und Taktik".
 */
export const HAUPTMANN_STUB: RoleStub = {
  id: 'hauptmann',
  label: 'Hauptmann',
  armorPackageId: WACHE_STUB.armorPackageId,
  sskStufe: WACHE_STUB.sskStufe,
  talente: WACHE_STUB.talente,
  fertigkeiten: [
    { referenz: 'whk_rechtskunde', wert: 8 },
    { referenz: 'whk_spez_rechtskunde_strafrecht', wert: 8 },
    { referenz: 'whk_spez_rechtskunde_buergerrecht', wert: 4 },
    { referenz: 'whk_ermittlung', wert: 8 },
    { referenz: 'whk_spez_ermittlung_observation', wert: 8 },
    { referenz: 'whk_spez_ermittlung_spurenlesen', wert: 4 },
    { referenz: 'whk_spez_ermittlung_verhoer', wert: 4 },
    { referenz: 'whk_administration', wert: 5 },
    { referenz: 'whk_ueberleben', wert: 6 },
    { referenz: 'whk_spez_ueberleben_stadt', wert: 6 },
    // Führungskompetenz (NSC-Vorlagen-Doc "Ein Hauptmann braucht zusätzlich Überzeugen,
    // Einschüchtern und Taktik"): whk_militaertheorie samt Taktik-Spezialisierung sowie
    // gr_ueberzeugen/gr_einschuechtern deutlich über dem Wache-Niveau.
    { referenz: 'whk_militaertheorie', wert: 12 },
    { referenz: 'whk_spez_militaertheorie_taktik', wert: 12 },
    { referenz: 'gr_einschuechtern', wert: 12 },
    { referenz: 'gr_menschenkenntnis', wert: 7 },
    { referenz: 'gr_orientierung', wert: 6 },
    { referenz: 'gr_koerperbeherrschung', wert: 6 },
    { referenz: 'gr_laufen', wert: 5 },
    { referenz: 'gr_klettern', wert: 2 },
    { referenz: 'gr_faehrtensuche', wert: 3 },
    { referenz: 'gr_schaetzen', wert: 3 },
    { referenz: 'gr_schwimmen', wert: 2 },
    { referenz: 'gr_springen', wert: 2 },
    { referenz: 'gr_ueberzeugen', wert: 12 },
    { referenz: 'gr_werfen', wert: 3 },
    { referenz: 'sf_ausdauer', wert: 7 },
    { referenz: 'sf_ausweichen', wert: 4 },
    { referenz: 'sf_gefahreninstinkt', wert: 8 },
    { referenz: 'sf_selbstbeherrschung', wert: 7 },
    { referenz: 'sf_tragen', wert: 8 },
    { referenz: 'nk_unbewaffnet', wert: 4 },
    { referenz: 'nk_spez_unbewaffnet_unbewaffnet', wert: 4 },
    // Stangenwaffen bis nahe an das Fertigkeitsmaximum (24, siehe fertigkeitenGrenzen.ts) - der
    // Hauptmann führt seinen Speer/Stab spürbar besser als eine einfache Wache.
    { referenz: 'nk_stangenwaffen', wert: 24 },
    { referenz: 'nk_spez_stangenwaffen_speere', wert: 24 },
    { referenz: 'nk_spez_stangenwaffen_staebe', wert: 24 },
    { referenz: 'fk_feuerwaffen', wert: 14 },
    { referenz: 'fk_spez_feuerwaffen_musketen', wert: 14 },
    { referenz: 'fk_spez_feuerwaffen_pistolen', wert: 14 },
    { referenz: 'sf_ladeschuetze_vorderlader', wert: 12 },
  ],
  weapons: [
    {
      sourceRow: 183, materialSourceRow: 2, fertigungSourceRow: 4, anpassungSourceRow: 2, schaftmaterialSourceRow: 2,
      poolReferenz: 'nk_pool_stangenwaffen_speere', pool: { nat: 10, npa: 10, gat: 6, gpa: 6, mat: 2, mpa: 2 },
    },
    {
      sourceRow: 188, materialSourceRow: 2, fertigungSourceRow: 4, anpassungSourceRow: 2, schaftmaterialSourceRow: 2,
      poolReferenz: 'nk_pool_stangenwaffen_staebe', pool: { nat: 12, npa: 12, gat: 8, gpa: 8, mat: 4, mpa: 4 },
    },
  ],
  unbewaffnetPool: WACHE_STUB.unbewaffnetPool,
  // Nahkämpfer-Archetyp (Nutzer 2026-09-12): Konstitution/Stärke über das Artminimum hinaus, weil
  // beide direkt in le_brust/le_kopf/le_unterleib und die AT/PA-Basiswerte einfließen (rules.json).
  eigenschaftenSteigerung: { eig_k_konstitution: 4, eig_k_staerke: 4 },
  // Vitalität zuerst (speist alle drei LE-Zonen, Ausdauer, Gesundheit, Alchemieresistenz - "für
  // Nahkämpfer auf Vitalität"), Rest ins Glück (Ausweichen). Werte so gewählt, dass sie ins
  // verbleibende Kreis-3+-Budget passen (10×wert²+70×wert pro Attribut, deutlich teurer als
  // Eigenschaften) - siehe generateFromRoleStub()'s Prioritäts-Reihenfolge.
  attribute: [
    { referenz: 'att_vitalitaet', wert: 6 },
    { referenz: 'att_glueck', wert: 2 },
  ],
  firearmSets: WACHE_STUB.firearmSets,
};
