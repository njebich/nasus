// Hand kuratierte Zuordnung Volk -> Kulturfertigkeit + waehlbare Sprachdialekte.
// Quelle: Sheet "Voelker-Maxima" (11 Voelker) + "Bekannte Sprachen" aus "NN Sprachen 0.11.docx".
// NICHT generiert (anders als src/data/*) - die xlsx hat keine explizite Volk<->Sprache-Tabelle,
// das ist reine UI-Kuratierung fuer den kostenlosen Muttersprache/Kultur-Grant bei Erschaffung
// (siehe characterMutations.ts setFreieSpracheUndKultur, mit Nutzer 2026-07-17 geklaert:
// freie Wahl, nicht zwingend an die eingetragene Spezies gekoppelt).
//
// Sprachstufe-Kosten/Kulturstufe-Kosten haben 5 Stufen (0=Keine Kenntnis...4=Akademisches
// Niveau); der kostenlose Grant setzt Sprache auf Stufe 3 (Muttersprache) und Kultur auf
// Stufe 3 (Vaterland) - siehe characterSheet.ts.
export const MUTTERSPRACHE_STUFE = 3;
export const VATERLAND_STUFE = 3;

export interface SpracheOption {
  referenz: string;
  label: string;
}

export interface VolkOption {
  kulturReferenz: string;
  label: string;
  spracheOptionen: SpracheOption[];
}

export const VOELKER: VolkOption[] = [
  {
    kulturReferenz: 'whk_kultur_dalkini',
    label: 'Dalkini',
    // Datenlage uneinheitlich (Insel-Dalkin/Insel-Dalkinisch wirken redundant) - alle drei
    // bleiben waehlbar statt dass ich eine davon als "falsch" aussortiere.
    spracheOptionen: [
      { referenz: 'whk_sprache_insel_dalkin', label: 'Insel-Dalkin' },
      { referenz: 'whk_sprache_insel_dalkinisch', label: 'Insel-Dalkinisch' },
      { referenz: 'whk_sprache_reichs_dalkin', label: 'Reichs-Dalkin' },
    ],
  },
  { kulturReferenz: 'whk_kultur_draw', label: 'Draw', spracheOptionen: [
    { referenz: 'whk_sprache_drow', label: 'Drow' },
  ] },
  { kulturReferenz: 'whk_kultur_elfen', label: 'Elfen', spracheOptionen: [
    { referenz: 'whk_sprache_elfisch', label: 'Elfisch' },
  ] },
  { kulturReferenz: 'whk_kultur_gnome', label: 'Gnome', spracheOptionen: [
    { referenz: 'whk_sprache_gnomisch', label: 'Gnomisch' },
  ] },
  { kulturReferenz: 'whk_kultur_goblins', label: 'Goblins', spracheOptionen: [
    { referenz: 'whk_sprache_goblinisch', label: 'Goblinisch' },
  ] },
  {
    kulturReferenz: 'whk_kultur_indianer',
    label: 'Indianer',
    // 4 benannte Dialekte laut Regeldokument + 8 nummerierte Bestandsdaten aus der xlsx, die im
    // Dokument nicht erwaehnt sind (vermutlich aeltere/parallele Dialekt-Bezeichnung) - alle
    // bleiben waehlbar statt dass ich eine Auswahl treffe.
    spracheOptionen: [
      { referenz: 'whk_sprache_straitmor_indianisch', label: 'Straitmor-Indianisch' },
      { referenz: 'whk_sprache_doxmox_indianisch', label: 'Doxmox-Indianisch' },
      { referenz: 'whk_sprache_pakagee_indianisch', label: 'Pakagee-Indianisch' },
      { referenz: 'whk_sprache_sindyala_indianisch', label: 'Sindyala-Indianisch' },
      { referenz: 'whk_sprache_indianisch_5', label: 'Indianisch 5' },
      { referenz: 'whk_sprache_indianisch_6', label: 'Indianisch 6' },
      { referenz: 'whk_sprache_indianisch_7', label: 'Indianisch 7' },
      { referenz: 'whk_sprache_indianisch_8', label: 'Indianisch 8' },
      { referenz: 'whk_sprache_indianisch_9', label: 'Indianisch 9' },
      { referenz: 'whk_sprache_indianisch_10', label: 'Indianisch 10' },
      { referenz: 'whk_sprache_indianisch_11', label: 'Indianisch 11' },
      { referenz: 'whk_sprache_indianisch_12', label: 'Indianisch 12' },
    ],
  },
  { kulturReferenz: 'whk_kultur_katzen', label: 'Katzen', spracheOptionen: [
    { referenz: 'whk_sprache_felinisch', label: 'Felinisch' },
  ] },
  { kulturReferenz: 'whk_kultur_orks', label: 'Orks', spracheOptionen: [
    { referenz: 'whk_sprache_orkisch', label: 'Orkisch' },
  ] },
  { kulturReferenz: 'whk_kultur_trolle', label: 'Trolle', spracheOptionen: [
    { referenz: 'whk_sprache_trollisch', label: 'Trollisch' },
  ] },
  // Nutzer 2026-07-17: Zentauren teilen sich die Sprache mit den Zwergen, haben aber eine
  // eigene Kultur.
  { kulturReferenz: 'whk_kultur_zentauren', label: 'Zentauren', spracheOptionen: [
    { referenz: 'whk_sprache_zwergisch', label: 'Zwergisch' },
  ] },
  { kulturReferenz: 'whk_kultur_zwerge', label: 'Zwerge', spracheOptionen: [
    { referenz: 'whk_sprache_zwergisch', label: 'Zwergisch' },
  ] },
];
