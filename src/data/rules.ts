// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.
// Quelle: Sheet "Werte" (-> rules.json). Enthaelt ALLE Kategorien; welche
// UI-Views welche Kategorien anzeigen, wird in src/views/*.ts entschieden.
import rulesJson from './rules.json';

export type Art = 'Wert' | 'Auswahl' | 'Formel' | 'Pool' | 'Fixwert' | 'Lookup';

export interface RuleEntry {
  referenz: string;
  kategorie: string;
  beschreibung?: string;
  abkuerzung?: string;
  info?: string;
  parent?: string;
  art: Art;
  formelRaw?: string;
  poolRaw?: string;
  flag?: string;
  grad?: string;
  kostenRaw?: string;
  verfuegbarkeit?: string;
  mindestTaw?: string;
  eigBonus?: string;
  wirkung?: string;
  sourceRow: number;
}

// Der generische Unbewaffnet-Pool ist kein gültiger Waffenpool. Unbewaffnet wird ausschließlich
// über die Spezialisierung nk_spez_unbewaffnet_unbewaffnet aufgelöst.
// GBE ist in der Arbeitsmappe auskommentiert. Zwei bestehende Kampf-Formeln verwenden den
// internen Wert weiterhin; deshalb bleibt er als nicht aus der Tabelle stammende Kompatibilitätsregel erhalten.
const GEWICHTSBELASTUNG_KOMPAT: RuleEntry = {
  referenz: 'gewichtsbelastung', kategorie: 'Charakterwerte', beschreibung: 'Gewichtsbelastung',
  abkuerzung: 'GBE', art: 'Formel', formelRaw: 'MAX(0;RBE)', sourceRow: 266,
};

const ZWEI_WAFFEN_REFERENZEN = new Set([
  'talente_kampf_mit_zwei_waffen_stufe_1',
  'talente_kampf_mit_zwei_waffen_stufe_2',
  'talente_kampf_mit_zwei_waffen_stufe_3',
  'talente_kampf_mit_zwei_waffen_stufe_4',
]);

function applyRuntimeRuleCorrections(rule: RuleEntry): RuleEntry {
  if (!ZWEI_WAFFEN_REFERENZEN.has(rule.referenz)) return rule;
  const zusatz = 'Waffen der Spezialisierung Schild sind ausgeschlossen. Die gemeinsame AT- und PA-WK kann niemals unter die höhere aktuelle Einzel-WK sinken. Bewaffnete und unbewaffnete Extra-Aktionen der Nebenhand verwenden den vollen Probenwert.';
  if (rule.wirkung?.includes(zusatz)) return rule;
  return { ...rule, wirkung: `${rule.wirkung ?? ''}\n${zusatz}`.trim() };
}

export const RULES = (rulesJson as unknown as RuleEntry[])
  .filter((rule) => rule.referenz !== 'nk_pool_unbewaffnet')
  .concat(GEWICHTSBELASTUNG_KOMPAT)
  .map(applyRuntimeRuleCorrections);

// Codegen-Warnungen (siehe Konsolen-Ausgabe beim Generieren):
// - Zeile 2: Referenz '#spruchmagie_erdbeschwoerung_1_splitterwand' mit '#' auskommentiert - uebersprungen
// - Zeile 3: Referenz '#spruchmagie_erdbeschwoerung_2_splitterstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 4: Referenz '#spruchmagie_erdbeschwoerung_3_steinschlag' mit '#' auskommentiert - uebersprungen
// - Zeile 5: Referenz '#spruchmagie_erdbeschwoerung_4_grosse_splitterwand' mit '#' auskommentiert - uebersprungen
// - Zeile 6: Referenz '#spruchmagie_erdbeschwoerung_5_grosse_splitteraura' mit '#' auskommentiert - uebersprungen
// - Zeile 7: Referenz '#spruchmagie_erdbeschwoerung_5_grosser_steinschuss' mit '#' auskommentiert - uebersprungen
// - Zeile 8: Referenz '#spruchmagie_erdbeschwoerung_5_splittersturm' mit '#' auskommentiert - uebersprungen
// - Zeile 9: Referenz '#spruchmagie_erdbeschwoerung_6_grosser_splitterstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 10: Referenz '#spruchmagie_erdbeschwoerung_6_grosser_steinschlag' mit '#' auskommentiert - uebersprungen
// - Zeile 11: Referenz '#spruchmagie_erdbeschwoerung_7_grosser_splittersturm' mit '#' auskommentiert - uebersprungen
// - Zeile 12: Referenz '#spruchmagie_feuerbeschwoerung_1_flammenwand' mit '#' auskommentiert - uebersprungen
// - Zeile 13: Referenz '#spruchmagie_feuerbeschwoerung_2_flammenaura' mit '#' auskommentiert - uebersprungen
// - Zeile 14: Referenz '#spruchmagie_feuerbeschwoerung_2_flammenstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 15: Referenz '#spruchmagie_feuerbeschwoerung_3_feuerblitz' mit '#' auskommentiert - uebersprungen
// - Zeile 16: Referenz '#spruchmagie_feuerbeschwoerung_4_grosse_flammenwand' mit '#' auskommentiert - uebersprungen
// - Zeile 17: Referenz '#spruchmagie_feuerbeschwoerung_5_flammenmeer' mit '#' auskommentiert - uebersprungen
// - Zeile 18: Referenz '#spruchmagie_feuerbeschwoerung_5_grosse_flammenaura' mit '#' auskommentiert - uebersprungen
// - Zeile 19: Referenz '#spruchmagie_feuerbeschwoerung_5_grosser_feuerpfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 20: Referenz '#spruchmagie_feuerbeschwoerung_6_grosser_feuerblitz' mit '#' auskommentiert - uebersprungen
// - Zeile 21: Referenz '#spruchmagie_feuerbeschwoerung_6_grosser_flammenstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 22: Referenz '#spruchmagie_feuerbeschwoerung_7_inferno' mit '#' auskommentiert - uebersprungen
// - Zeile 23: Referenz '#spruchmagie_luftbeschwoerung_1_sturmwand' mit '#' auskommentiert - uebersprungen
// - Zeile 24: Referenz '#spruchmagie_luftbeschwoerung_2_sturmaura' mit '#' auskommentiert - uebersprungen
// - Zeile 25: Referenz '#spruchmagie_luftbeschwoerung_2_sturmstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 26: Referenz '#spruchmagie_luftbeschwoerung_3_sturmblitz' mit '#' auskommentiert - uebersprungen
// - Zeile 27: Referenz '#spruchmagie_luftbeschwoerung_4_grosse_sturmwand' mit '#' auskommentiert - uebersprungen
// - Zeile 28: Referenz '#spruchmagie_luftbeschwoerung_5_grosse_sturmaura' mit '#' auskommentiert - uebersprungen
// - Zeile 29: Referenz '#spruchmagie_luftbeschwoerung_5_grosser_sturmpfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 30: Referenz '#spruchmagie_luftbeschwoerung_5_tornado' mit '#' auskommentiert - uebersprungen
// - Zeile 31: Referenz '#spruchmagie_luftbeschwoerung_6_grosser_sturmblitz' mit '#' auskommentiert - uebersprungen
// - Zeile 32: Referenz '#spruchmagie_luftbeschwoerung_6_grosser_sturmstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 33: Referenz '#spruchmagie_luftbeschwoerung_7_grosser_tornado' mit '#' auskommentiert - uebersprungen
// - Zeile 34: Referenz '#spruchmagie_magiebeschwoerung_1_wand_aus_magie' mit '#' auskommentiert - uebersprungen
// - Zeile 35: Referenz '#spruchmagie_magiebeschwoerung_2_magische_aura' mit '#' auskommentiert - uebersprungen
// - Zeile 36: Referenz '#spruchmagie_magiebeschwoerung_2_magischer_strahl' mit '#' auskommentiert - uebersprungen
// - Zeile 37: Referenz '#spruchmagie_magiebeschwoerung_3_magische_entladung' mit '#' auskommentiert - uebersprungen
// - Zeile 38: Referenz '#spruchmagie_magiebeschwoerung_4_grosse_wand_aus_magie' mit '#' auskommentiert - uebersprungen
// - Zeile 39: Referenz '#spruchmagie_magiebeschwoerung_5_grosse_magische_aura' mit '#' auskommentiert - uebersprungen
// - Zeile 40: Referenz '#spruchmagie_magiebeschwoerung_5_grosses_magisches_geschoss' mit '#' auskommentiert - uebersprungen
// - Zeile 41: Referenz '#spruchmagie_magiebeschwoerung_5_statisches_feld' mit '#' auskommentiert - uebersprungen
// - Zeile 42: Referenz '#spruchmagie_magiebeschwoerung_6_grosse_magische_entladung' mit '#' auskommentiert - uebersprungen
// - Zeile 43: Referenz '#spruchmagie_magiebeschwoerung_6_grosser_magischer_strahl' mit '#' auskommentiert - uebersprungen
// - Zeile 44: Referenz '#spruchmagie_magiebeschwoerung_7_grosses_statisches_feld' mit '#' auskommentiert - uebersprungen
// - Zeile 45: Referenz '#spruchmagie_wasserbeschwoerung_1_frostwand' mit '#' auskommentiert - uebersprungen
// - Zeile 46: Referenz '#spruchmagie_wasserbeschwoerung_2_eisstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 47: Referenz '#spruchmagie_wasserbeschwoerung_3_eisblitz' mit '#' auskommentiert - uebersprungen
// - Zeile 48: Referenz '#spruchmagie_wasserbeschwoerung_4_grosse_frostwand' mit '#' auskommentiert - uebersprungen
// - Zeile 49: Referenz '#spruchmagie_wasserbeschwoerung_5_blizzard' mit '#' auskommentiert - uebersprungen
// - Zeile 50: Referenz '#spruchmagie_wasserbeschwoerung_5_grosse_eisaura' mit '#' auskommentiert - uebersprungen
// - Zeile 51: Referenz '#spruchmagie_wasserbeschwoerung_5_grosser_frostbolzen' mit '#' auskommentiert - uebersprungen
// - Zeile 52: Referenz '#spruchmagie_wasserbeschwoerung_6_grosser_eisblitz' mit '#' auskommentiert - uebersprungen
// - Zeile 53: Referenz '#spruchmagie_wasserbeschwoerung_6_grosser_eisstrahl' mit '#' auskommentiert - uebersprungen
// - Zeile 54: Referenz '#spruchmagie_wasserbeschwoerung_7_grosser_blizzard' mit '#' auskommentiert - uebersprungen
// - Zeile 55: Referenz '#spruchmagie_erdbeschwoerung_2_splitter_aura' mit '#' auskommentiert - uebersprungen
// - Zeile 56: Referenz '#spruchmagie_erdbeschwoerung_3_erd_klinge' mit '#' auskommentiert - uebersprungen
// - Zeile 57: Referenz '#spruchmagie_erdbeschwoerung_3_splitter_pfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 58: Referenz '#spruchmagie_erdbeschwoerung_7_grosse_steinschuss_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 59: Referenz '#spruchmagie_feuerbeschwoerung_3_feuer_klinge' mit '#' auskommentiert - uebersprungen
// - Zeile 60: Referenz '#spruchmagie_feuerbeschwoerung_3_flammen_pfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 61: Referenz '#spruchmagie_feuerbeschwoerung_7_grosse_feuerpfeil_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 62: Referenz '#spruchmagie_luftbeschwoerung_3_luft_klinge' mit '#' auskommentiert - uebersprungen
// - Zeile 63: Referenz '#spruchmagie_luftbeschwoerung_3_sturm_pfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 64: Referenz '#spruchmagie_luftbeschwoerung_7_grosse_sturmpfeil_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 65: Referenz '#spruchmagie_magiebeschwoerung_3_blitz_klinge' mit '#' auskommentiert - uebersprungen
// - Zeile 66: Referenz '#spruchmagie_magiebeschwoerung_3_schock_pfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 67: Referenz '#spruchmagie_magiebeschwoerung_7_grosse_magische_geschoss_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 68: Referenz '#spruchmagie_wasserbeschwoerung_2_eis_aura' mit '#' auskommentiert - uebersprungen
// - Zeile 69: Referenz '#spruchmagie_wasserbeschwoerung_3_frost_klinge' mit '#' auskommentiert - uebersprungen
// - Zeile 70: Referenz '#spruchmagie_wasserbeschwoerung_3_frost_pfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 71: Referenz '#spruchmagie_wasserbeschwoerung_7_grosse_frostbolzen_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 78: Referenz '#spruchmagie_beherrschung_4_einschlaefern' mit '#' auskommentiert - uebersprungen
// - Zeile 79: Referenz '#spruchmagie_beherrschung_7_maechtige_f_daemonen_herrschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 80: Referenz '#spruchmagie_beherrschung_5_massen_besaenftigung' mit '#' auskommentiert - uebersprungen
// - Zeile 81: Referenz '#spruchmagie_beherrschung_3_schmerzt_unterdruecken' mit '#' auskommentiert - uebersprungen
// - Zeile 82: Referenz '#spruchmagie_beherrschung_2_zoegern' mit '#' auskommentiert - uebersprungen
// - Zeile 181: Referenz '#sf_ladeschuetze_schleuder' mit '#' auskommentiert - uebersprungen
// - Zeile 196: Referenz '#att_essenz' mit '#' auskommentiert - uebersprungen
// - Zeile 240: Referenz '#ki_ki_faehigkeiten' mit '#' auskommentiert - uebersprungen
// - Zeile 266: Referenz '#gewichtsbelastung' mit '#' auskommentiert - uebersprungen
// - Zeile 270: Referenz '#spruchmagie_erdbeschwoerung_3_steinkugel_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 271: Referenz '#spruchmagie_erdbeschwoerung_3_steinkugel_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 272: Referenz '#spruchmagie_erdbeschwoerung_4_steinschuss_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 273: Referenz '#spruchmagie_erdbeschwoerung_4_steinschuss_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 274: Referenz '#spruchmagie_erdbeschwoerung_6_grosse_steinkugel_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 275: Referenz '#spruchmagie_erdbeschwoerung_6_grosse_steinkugel_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 276: Referenz '#spruchmagie_feuerbeschwoerung_3_feuerball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 277: Referenz '#spruchmagie_feuerbeschwoerung_3_feuerball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 278: Referenz '#spruchmagie_feuerbeschwoerung_4_feuerpfeil_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 279: Referenz '#spruchmagie_feuerbeschwoerung_4_feuerpfeil_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 280: Referenz '#spruchmagie_feuerbeschwoerung_6_grosse_feuerball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 281: Referenz '#spruchmagie_feuerbeschwoerung_6_grosse_feuerball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 282: Referenz '#spruchmagie_luftbeschwoerung_3_sturmball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 283: Referenz '#spruchmagie_luftbeschwoerung_3_sturmball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 284: Referenz '#spruchmagie_luftbeschwoerung_4_sturmpfeil_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 285: Referenz '#spruchmagie_luftbeschwoerung_4_sturmpfeil_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 286: Referenz '#spruchmagie_luftbeschwoerung_6_grosse_sturmball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 287: Referenz '#spruchmagie_luftbeschwoerung_6_grosse_sturmball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 288: Referenz '#spruchmagie_magiebeschwoerung_3_magische_ball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 289: Referenz '#spruchmagie_magiebeschwoerung_3_magische_ball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 290: Referenz '#spruchmagie_magiebeschwoerung_4_magische_geschoss_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 291: Referenz '#spruchmagie_magiebeschwoerung_4_magische_geschoss_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 292: Referenz '#spruchmagie_magiebeschwoerung_6_grosse_magische_ball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 293: Referenz '#spruchmagie_magiebeschwoerung_6_grosse_magische_ball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 294: Referenz '#spruchmagie_verzauberung_2_mana_fernspende' mit '#' auskommentiert - uebersprungen
// - Zeile 295: Referenz '#spruchmagie_verzauberung_3_blitz_klinge_v' mit '#' auskommentiert - uebersprungen
// - Zeile 296: Referenz '#spruchmagie_verzauberung_3_erd_klinge_v' mit '#' auskommentiert - uebersprungen
// - Zeile 297: Referenz '#spruchmagie_verzauberung_3_feuer_klinge_v' mit '#' auskommentiert - uebersprungen
// - Zeile 298: Referenz '#spruchmagie_verzauberung_3_flammen_pfeil_v' mit '#' auskommentiert - uebersprungen
// - Zeile 299: Referenz '#spruchmagie_verzauberung_3_frost_klinge_v' mit '#' auskommentiert - uebersprungen
// - Zeile 300: Referenz '#spruchmagie_verzauberung_3_frost_pfeil_v' mit '#' auskommentiert - uebersprungen
// - Zeile 301: Referenz '#spruchmagie_verzauberung_3_luft_klinge_v' mit '#' auskommentiert - uebersprungen
// - Zeile 302: Referenz '#spruchmagie_verzauberung_3_schock_pfeil_v' mit '#' auskommentiert - uebersprungen
// - Zeile 303: Referenz '#spruchmagie_verzauberung_3_splitter_pfeil_v' mit '#' auskommentiert - uebersprungen
// - Zeile 304: Referenz '#spruchmagie_verzauberung_3_sturm_pfeil_v' mit '#' auskommentiert - uebersprungen
// - Zeile 305: Referenz '#spruchmagie_wasserbeschwoerung_3_eisball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 306: Referenz '#spruchmagie_wasserbeschwoerung_3_eisball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 307: Referenz '#spruchmagie_wasserbeschwoerung_4_frostbolzen_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 308: Referenz '#spruchmagie_wasserbeschwoerung_4_frostbolzen_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 309: Referenz '#spruchmagie_wasserbeschwoerung_6_grosse_eisball_salve' mit '#' auskommentiert - uebersprungen
// - Zeile 310: Referenz '#spruchmagie_wasserbeschwoerung_6_grosse_eisball_salve_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 311: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_massen_aufmerksamkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 312: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_massen_beruhigung' mit '#' auskommentiert - uebersprungen
// - Zeile 313: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_massen_entscheidungshilfe' mit '#' auskommentiert - uebersprungen
// - Zeile 314: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_massen_verwirrung' mit '#' auskommentiert - uebersprungen
// - Zeile 315: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_massen_angst' mit '#' auskommentiert - uebersprungen
// - Zeile 316: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_massen_konfusion' mit '#' auskommentiert - uebersprungen
// - Zeile 317: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_menschen_befehl' mit '#' auskommentiert - uebersprungen
// - Zeile 318: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_massen_tierbefehl' mit '#' auskommentiert - uebersprungen
// - Zeile 319: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_massen_wut' mit '#' auskommentiert - uebersprungen
// - Zeile 320: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_massen_zwang' mit '#' auskommentiert - uebersprungen
// - Zeile 321: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_massen_feindschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 322: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_massen_gier' mit '#' auskommentiert - uebersprungen
// - Zeile 323: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_massen_zonenzwang' mit '#' auskommentiert - uebersprungen
// - Zeile 324: Referenz '#spruchmagie_z_beherrschung_entwicklung_7_massen_paralyse' mit '#' auskommentiert - uebersprungen
// - Zeile 325: Referenz '#spruchmagie_z_beherrschung_entwicklung_7_massen_sinneseinschraenkung' mit '#' auskommentiert - uebersprungen
// - Zeile 531: Referenz '#spruchmagie_antimagie_1_artefakt_analysieren' mit '#' auskommentiert - uebersprungen
// - Zeile 532: Referenz '#spruchmagie_antimagie_1_magische_wand' mit '#' auskommentiert - uebersprungen
// - Zeile 533: Referenz '#spruchmagie_antimagie_2_artefakt_stoeren' mit '#' auskommentiert - uebersprungen
// - Zeile 534: Referenz '#spruchmagie_antimagie_2_bipolare_schere' mit '#' auskommentiert - uebersprungen
// - Zeile 535: Referenz '#spruchmagie_antimagie_2_magische_kuppel' mit '#' auskommentiert - uebersprungen
// - Zeile 536: Referenz '#spruchmagie_antimagie_2_magische_reinigung' mit '#' auskommentiert - uebersprungen
// - Zeile 537: Referenz '#spruchmagie_antimagie_3_magische_barriere' mit '#' auskommentiert - uebersprungen
// - Zeile 538: Referenz '#spruchmagie_antimagie_3_magischer_schild' mit '#' auskommentiert - uebersprungen
// - Zeile 539: Referenz '#spruchmagie_antimagie_3_schule_erschweren_antimagie' mit '#' auskommentiert - uebersprungen
// - Zeile 540: Referenz '#spruchmagie_antimagie_3_schule_erschweren_beherrschung' mit '#' auskommentiert - uebersprungen
// - Zeile 541: Referenz '#spruchmagie_antimagie_3_schule_erschweren_erdbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 542: Referenz '#spruchmagie_antimagie_3_schule_erschweren_feuerbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 543: Referenz '#spruchmagie_antimagie_3_schule_erschweren_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 544: Referenz '#spruchmagie_antimagie_3_schule_erschweren_hellsicht' mit '#' auskommentiert - uebersprungen
// - Zeile 545: Referenz '#spruchmagie_antimagie_3_schule_erschweren_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 546: Referenz '#spruchmagie_antimagie_3_schule_erschweren_luftbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 547: Referenz '#spruchmagie_antimagie_3_schule_erschweren_magiebeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 548: Referenz '#spruchmagie_antimagie_3_schule_erschweren_veraenderung' mit '#' auskommentiert - uebersprungen
// - Zeile 549: Referenz '#spruchmagie_antimagie_3_schule_erschweren_verzauberung' mit '#' auskommentiert - uebersprungen
// - Zeile 550: Referenz '#spruchmagie_antimagie_3_schule_erschweren_wasserbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 551: Referenz '#spruchmagie_antimagie_4_magische_bresche' mit '#' auskommentiert - uebersprungen
// - Zeile 552: Referenz '#spruchmagie_antimagie_4_mobile_barriere' mit '#' auskommentiert - uebersprungen
// - Zeile 553: Referenz '#spruchmagie_antimagie_5_aura_verhuellen' mit '#' auskommentiert - uebersprungen
// - Zeile 554: Referenz '#spruchmagie_antimagie_5_korpi_ignorieren' mit '#' auskommentiert - uebersprungen
// - Zeile 555: Referenz '#spruchmagie_antimagie_5_schule_hemmen_antimagie' mit '#' auskommentiert - uebersprungen
// - Zeile 556: Referenz '#spruchmagie_antimagie_5_schule_hemmen_beherrschung' mit '#' auskommentiert - uebersprungen
// - Zeile 557: Referenz '#spruchmagie_antimagie_5_schule_hemmen_erdbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 558: Referenz '#spruchmagie_antimagie_5_schule_hemmen_feuerbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 559: Referenz '#spruchmagie_antimagie_5_schule_hemmen_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 560: Referenz '#spruchmagie_antimagie_5_schule_hemmen_hellsicht' mit '#' auskommentiert - uebersprungen
// - Zeile 561: Referenz '#spruchmagie_antimagie_5_schule_hemmen_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 562: Referenz '#spruchmagie_antimagie_5_schule_hemmen_luftbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 563: Referenz '#spruchmagie_antimagie_5_schule_hemmen_magiebeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 564: Referenz '#spruchmagie_antimagie_5_schule_hemmen_veraenderung' mit '#' auskommentiert - uebersprungen
// - Zeile 565: Referenz '#spruchmagie_antimagie_5_schule_hemmen_verzauberung' mit '#' auskommentiert - uebersprungen
// - Zeile 566: Referenz '#spruchmagie_antimagie_5_schule_hemmen_wasserbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 567: Referenz '#spruchmagie_antimagie_5_schutz' mit '#' auskommentiert - uebersprungen
// - Zeile 568: Referenz '#spruchmagie_antimagie_6_antimagisches_feld' mit '#' auskommentiert - uebersprungen
// - Zeile 569: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_antimagie' mit '#' auskommentiert - uebersprungen
// - Zeile 570: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_beherrschung' mit '#' auskommentiert - uebersprungen
// - Zeile 571: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_erdbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 572: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_feuerbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 573: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 574: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_hellsicht' mit '#' auskommentiert - uebersprungen
// - Zeile 575: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 576: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_luftbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 577: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_magiebeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 578: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_verzauberung' mit '#' auskommentiert - uebersprungen
// - Zeile 579: Referenz '#spruchmagie_antimagie_6_schutz_vor_schule_wasserbeschwoerung' mit '#' auskommentiert - uebersprungen
// - Zeile 580: Referenz '#spruchmagie_antimagie_6_subjektives_manaloch' mit '#' auskommentiert - uebersprungen
// - Zeile 581: Referenz '#spruchmagie_antimagie_7_aura_entkernen' mit '#' auskommentiert - uebersprungen
// - Zeile 582: Referenz '#spruchmagie_antimagie_7_manaloch' mit '#' auskommentiert - uebersprungen
// - Zeile 583: Referenz '#spruchmagie_antimagie_7_spiegeltrick' mit '#' auskommentiert - uebersprungen
// - Zeile 584: Referenz '#spruchmagie_beherrschung_1_ermutigen' mit '#' auskommentiert - uebersprungen
// - Zeile 585: Referenz '#spruchmagie_beherrschung_1_freundschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 586: Referenz '#spruchmagie_beherrschung_1_respekt_einfloessen' mit '#' auskommentiert - uebersprungen
// - Zeile 587: Referenz '#spruchmagie_beherrschung_1_tiere_befehligen' mit '#' auskommentiert - uebersprungen
// - Zeile 588: Referenz '#spruchmagie_beherrschung_2_besaenftigen' mit '#' auskommentiert - uebersprungen
// - Zeile 589: Referenz '#spruchmagie_beherrschung_2_entmutigen' mit '#' auskommentiert - uebersprungen
// - Zeile 590: Referenz '#spruchmagie_beherrschung_2_lachanfall' mit '#' auskommentiert - uebersprungen
// - Zeile 591: Referenz '#spruchmagie_beherrschung_2_stumm' mit '#' auskommentiert - uebersprungen
// - Zeile 592: Referenz '#spruchmagie_beherrschung_2_traurigkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 593: Referenz '#spruchmagie_beherrschung_3_elementare_befehligen' mit '#' auskommentiert - uebersprungen
// - Zeile 594: Referenz '#spruchmagie_beherrschung_3_herrschaft_ueber_tiere' mit '#' auskommentiert - uebersprungen
// - Zeile 595: Referenz '#spruchmagie_beherrschung_3_konfus' mit '#' auskommentiert - uebersprungen
// - Zeile 596: Referenz '#spruchmagie_beherrschung_3_tick_verursachen' mit '#' auskommentiert - uebersprungen
// - Zeile 597: Referenz '#spruchmagie_beherrschung_3_zorn' mit '#' auskommentiert - uebersprungen
// - Zeile 598: Referenz '#spruchmagie_beherrschung_4_aufmerksamkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 599: Referenz '#spruchmagie_beherrschung_4_berserker' mit '#' auskommentiert - uebersprungen
// - Zeile 600: Referenz '#spruchmagie_beherrschung_4_freie_daemonen_befehligen' mit '#' auskommentiert - uebersprungen
// - Zeile 601: Referenz '#spruchmagie_beherrschung_4_furcht' mit '#' auskommentiert - uebersprungen
// - Zeile 602: Referenz '#spruchmagie_beherrschung_4_verwirrung' mit '#' auskommentiert - uebersprungen
// - Zeile 603: Referenz '#spruchmagie_beherrschung_5_herrschaft_ueber_elementare' mit '#' auskommentiert - uebersprungen
// - Zeile 604: Referenz '#spruchmagie_beherrschung_5_massenfurcht' mit '#' auskommentiert - uebersprungen
// - Zeile 605: Referenz '#spruchmagie_beherrschung_5_paralyse' mit '#' auskommentiert - uebersprungen
// - Zeile 606: Referenz '#spruchmagie_beherrschung_6_herrschaft_ueber_freie_daemonen' mit '#' auskommentiert - uebersprungen
// - Zeile 607: Referenz '#spruchmagie_beherrschung_6_maechtige_tierherrschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 608: Referenz '#spruchmagie_beherrschung_6_totale_kontrolle' mit '#' auskommentiert - uebersprungen
// - Zeile 609: Referenz '#spruchmagie_beherrschung_6_totale_tier_kontrolle' mit '#' auskommentiert - uebersprungen
// - Zeile 610: Referenz '#spruchmagie_beherrschung_7_maechtige_elementar_herrschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 611: Referenz '#spruchmagie_beherrschung_7_massen_raserei' mit '#' auskommentiert - uebersprungen
// - Zeile 612: Referenz '#spruchmagie_beherrschung_7_menschen_befehligen' mit '#' auskommentiert - uebersprungen
// - Zeile 613: Referenz '#spruchmagie_erdbeschwoerung_1_steinfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 614: Referenz '#spruchmagie_erdbeschwoerung_1_steinfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 615: Referenz '#spruchmagie_erdbeschwoerung_1_steinkugel' mit '#' auskommentiert - uebersprungen
// - Zeile 616: Referenz '#spruchmagie_erdbeschwoerung_1_steinkugel_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 617: Referenz '#spruchmagie_erdbeschwoerung_2_steinschuss' mit '#' auskommentiert - uebersprungen
// - Zeile 618: Referenz '#spruchmagie_erdbeschwoerung_2_steinschuss_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 619: Referenz '#spruchmagie_erdbeschwoerung_3_grosse_steinfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 620: Referenz '#spruchmagie_erdbeschwoerung_3_grosse_steinfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 621: Referenz '#spruchmagie_erdbeschwoerung_4_grosse_steinkugel' mit '#' auskommentiert - uebersprungen
// - Zeile 622: Referenz '#spruchmagie_erdbeschwoerung_4_grosse_steinkugel_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 623: Referenz '#spruchmagie_feuerbeschwoerung_1_feuerball' mit '#' auskommentiert - uebersprungen
// - Zeile 624: Referenz '#spruchmagie_feuerbeschwoerung_1_feuerball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 625: Referenz '#spruchmagie_feuerbeschwoerung_1_flammenfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 626: Referenz '#spruchmagie_feuerbeschwoerung_1_flammenfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 627: Referenz '#spruchmagie_feuerbeschwoerung_2_feuerpfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 628: Referenz '#spruchmagie_feuerbeschwoerung_2_feuerpfeil_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 629: Referenz '#spruchmagie_feuerbeschwoerung_3_grosse_flammenfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 630: Referenz '#spruchmagie_feuerbeschwoerung_3_grosse_flammenfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 631: Referenz '#spruchmagie_feuerbeschwoerung_4_grosser_feuerball' mit '#' auskommentiert - uebersprungen
// - Zeile 632: Referenz '#spruchmagie_feuerbeschwoerung_4_grosser_feuerball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 633: Referenz '#spruchmagie_heilung_1_ruhiger_schlaf' mit '#' auskommentiert - uebersprungen
// - Zeile 634: Referenz '#spruchmagie_heilung_1_schmerz_unterdruecken' mit '#' auskommentiert - uebersprungen
// - Zeile 635: Referenz '#spruchmagie_heilung_1_wunden_schliessen' mit '#' auskommentiert - uebersprungen
// - Zeile 636: Referenz '#spruchmagie_heilung_1_zwang_unterdruecken' mit '#' auskommentiert - uebersprungen
// - Zeile 637: Referenz '#spruchmagie_heilung_2_ausdauer_wiederherstellen' mit '#' auskommentiert - uebersprungen
// - Zeile 638: Referenz '#spruchmagie_heilung_2_entzug_lindern' mit '#' auskommentiert - uebersprungen
// - Zeile 639: Referenz '#spruchmagie_heilung_2_kleine_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 640: Referenz '#spruchmagie_heilung_2_schlaf_der_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 641: Referenz '#spruchmagie_heilung_3_gift_lindern' mit '#' auskommentiert - uebersprungen
// - Zeile 642: Referenz '#spruchmagie_heilung_3_koma_der_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 643: Referenz '#spruchmagie_heilung_3_krankheit_heilen' mit '#' auskommentiert - uebersprungen
// - Zeile 644: Referenz '#spruchmagie_heilung_3_mittlere_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 645: Referenz '#spruchmagie_heilung_4_defibrillator' mit '#' auskommentiert - uebersprungen
// - Zeile 646: Referenz '#spruchmagie_heilung_4_entseuchung' mit '#' auskommentiert - uebersprungen
// - Zeile 647: Referenz '#spruchmagie_heilung_4_gesundheit_wiederherstellen' mit '#' auskommentiert - uebersprungen
// - Zeile 648: Referenz '#spruchmagie_heilung_4_grosse_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 649: Referenz '#spruchmagie_heilung_4_kleine_fernheilung' mit '#' auskommentiert - uebersprungen
// - Zeile 650: Referenz '#spruchmagie_heilung_5_gliedmassen_nachwachsen_lassen' mit '#' auskommentiert - uebersprungen
// - Zeile 651: Referenz '#spruchmagie_heilung_5_grosser_gesundheit_wiederherstellen' mit '#' auskommentiert - uebersprungen
// - Zeile 652: Referenz '#spruchmagie_heilung_5_maechtige_heilung' mit '#' auskommentiert - uebersprungen
// - Zeile 653: Referenz '#spruchmagie_heilung_5_mittlere_fernheilung' mit '#' auskommentiert - uebersprungen
// - Zeile 654: Referenz '#spruchmagie_heilung_5_selbstbeherrschung_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 655: Referenz '#spruchmagie_heilung_6_gesundheit_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 656: Referenz '#spruchmagie_heilung_6_grosse_fernheilung' mit '#' auskommentiert - uebersprungen
// - Zeile 657: Referenz '#spruchmagie_heilung_6_maechtige_entseuchung' mit '#' auskommentiert - uebersprungen
// - Zeile 658: Referenz '#spruchmagie_heilung_6_magische_krankheit_heilen' mit '#' auskommentiert - uebersprungen
// - Zeile 659: Referenz '#spruchmagie_heilung_6_regeneration_im_kampf' mit '#' auskommentiert - uebersprungen
// - Zeile 660: Referenz '#spruchmagie_heilung_6_tod_verzoegern' mit '#' auskommentiert - uebersprungen
// - Zeile 661: Referenz '#spruchmagie_heilung_7_maechtige_fernheilung' mit '#' auskommentiert - uebersprungen
// - Zeile 662: Referenz '#spruchmagie_heilung_7_totale_regeneration' mit '#' auskommentiert - uebersprungen
// - Zeile 663: Referenz '#spruchmagie_heilung_7_trefferschwelle_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 664: Referenz '#spruchmagie_heilung_7_wiederbelebung' mit '#' auskommentiert - uebersprungen
// - Zeile 665: Referenz '#spruchmagie_hellsicht_1_artefakt_erkennen' mit '#' auskommentiert - uebersprungen
// - Zeile 666: Referenz '#spruchmagie_hellsicht_1_daemmerungssicht' mit '#' auskommentiert - uebersprungen
// - Zeile 667: Referenz '#spruchmagie_hellsicht_2_durchblick' mit '#' auskommentiert - uebersprungen
// - Zeile 668: Referenz '#spruchmagie_hellsicht_2_infrarotsicht' mit '#' auskommentiert - uebersprungen
// - Zeile 669: Referenz '#spruchmagie_hellsicht_3_astralsicht' mit '#' auskommentiert - uebersprungen
// - Zeile 670: Referenz '#spruchmagie_hellsicht_3_blick_aufs_wesen' mit '#' auskommentiert - uebersprungen
// - Zeile 671: Referenz '#spruchmagie_hellsicht_4_aura_analysieren' mit '#' auskommentiert - uebersprungen
// - Zeile 672: Referenz '#spruchmagie_hellsicht_4_blick_durch_fremde_augen' mit '#' auskommentiert - uebersprungen
// - Zeile 673: Referenz '#spruchmagie_hellsicht_5_blick_in_die_gedanken' mit '#' auskommentiert - uebersprungen
// - Zeile 674: Referenz '#spruchmagie_hellsicht_6_kampfmaschine' mit '#' auskommentiert - uebersprungen
// - Zeile 675: Referenz '#spruchmagie_hellsicht_7_blick_in_die_zukunft' mit '#' auskommentiert - uebersprungen
// - Zeile 676: Referenz '#spruchmagie_illusion_1_funkentanz' mit '#' auskommentiert - uebersprungen
// - Zeile 677: Referenz '#spruchmagie_illusion_1_licht' mit '#' auskommentiert - uebersprungen
// - Zeile 678: Referenz '#spruchmagie_illusion_1_magische_schriftzeichen' mit '#' auskommentiert - uebersprungen
// - Zeile 679: Referenz '#spruchmagie_illusion_1_magische_verkleidung' mit '#' auskommentiert - uebersprungen
// - Zeile 680: Referenz '#spruchmagie_illusion_2_blitzlicht' mit '#' auskommentiert - uebersprungen
// - Zeile 681: Referenz '#spruchmagie_illusion_2_geraeuschillusion' mit '#' auskommentiert - uebersprungen
// - Zeile 682: Referenz '#spruchmagie_illusion_2_nebelwand' mit '#' auskommentiert - uebersprungen
// - Zeile 683: Referenz '#spruchmagie_illusion_2_stimme_veraendern' mit '#' auskommentiert - uebersprungen
// - Zeile 684: Referenz '#spruchmagie_illusion_2_zweites_gesicht' mit '#' auskommentiert - uebersprungen
// - Zeile 685: Referenz '#spruchmagie_illusion_3_dunkelheit' mit '#' auskommentiert - uebersprungen
// - Zeile 686: Referenz '#spruchmagie_illusion_3_durchsichtiger_gegenstand' mit '#' auskommentiert - uebersprungen
// - Zeile 687: Referenz '#spruchmagie_illusion_3_trugbild_der_haesslichkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 688: Referenz '#spruchmagie_illusion_3_unbewegte_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 689: Referenz '#spruchmagie_illusion_4_grosser_funkentanz' mit '#' auskommentiert - uebersprungen
// - Zeile 690: Referenz '#spruchmagie_illusion_4_nebel' mit '#' auskommentiert - uebersprungen
// - Zeile 691: Referenz '#spruchmagie_illusion_4_unsichtbarer_gegenstand' mit '#' auskommentiert - uebersprungen
// - Zeile 692: Referenz '#spruchmagie_illusion_5_bewegte_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 693: Referenz '#spruchmagie_illusion_5_chamaeleon' mit '#' auskommentiert - uebersprungen
// - Zeile 694: Referenz '#spruchmagie_illusion_5_vollsensorische_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 695: Referenz '#spruchmagie_illusion_6_magischer_nebel' mit '#' auskommentiert - uebersprungen
// - Zeile 696: Referenz '#spruchmagie_illusion_6_unauffindbarkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 697: Referenz '#spruchmagie_illusion_6_unsichtbarkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 698: Referenz '#spruchmagie_illusion_7_bewegte_vollsensorische_illusion' mit '#' auskommentiert - uebersprungen
// - Zeile 699: Referenz '#spruchmagie_luftbeschwoerung_1_sturmball' mit '#' auskommentiert - uebersprungen
// - Zeile 700: Referenz '#spruchmagie_luftbeschwoerung_1_sturmball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 701: Referenz '#spruchmagie_luftbeschwoerung_1_sturmfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 702: Referenz '#spruchmagie_luftbeschwoerung_1_sturmfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 703: Referenz '#spruchmagie_luftbeschwoerung_2_sturmpfeil' mit '#' auskommentiert - uebersprungen
// - Zeile 704: Referenz '#spruchmagie_luftbeschwoerung_2_sturmpfeil_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 705: Referenz '#spruchmagie_luftbeschwoerung_3_grosse_sturmfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 706: Referenz '#spruchmagie_luftbeschwoerung_3_grosse_sturmfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 707: Referenz '#spruchmagie_luftbeschwoerung_4_grosser_sturmball' mit '#' auskommentiert - uebersprungen
// - Zeile 708: Referenz '#spruchmagie_luftbeschwoerung_4_grosser_sturmball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 709: Referenz '#spruchmagie_magiebeschwoerung_1_magische_faust' mit '#' auskommentiert - uebersprungen
// - Zeile 710: Referenz '#spruchmagie_magiebeschwoerung_1_magische_faust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 711: Referenz '#spruchmagie_magiebeschwoerung_1_magischer_ball' mit '#' auskommentiert - uebersprungen
// - Zeile 712: Referenz '#spruchmagie_magiebeschwoerung_1_magischer_ball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 713: Referenz '#spruchmagie_magiebeschwoerung_2_magisches_geschoss' mit '#' auskommentiert - uebersprungen
// - Zeile 714: Referenz '#spruchmagie_magiebeschwoerung_2_magisches_geschoss_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 715: Referenz '#spruchmagie_magiebeschwoerung_3_grosse_magische_faust' mit '#' auskommentiert - uebersprungen
// - Zeile 716: Referenz '#spruchmagie_magiebeschwoerung_3_grosse_magische_faust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 717: Referenz '#spruchmagie_magiebeschwoerung_4_grosser_magischer_ball' mit '#' auskommentiert - uebersprungen
// - Zeile 718: Referenz '#spruchmagie_magiebeschwoerung_4_grosser_magischer_ball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 719: Referenz '#spruchmagie_veraenderung_1_in_nahrung_verwandeln' mit '#' auskommentiert - uebersprungen
// - Zeile 720: Referenz '#spruchmagie_veraenderung_1_magisches_makeover' mit '#' auskommentiert - uebersprungen
// - Zeile 721: Referenz '#spruchmagie_veraenderung_1_wasserwandeln' mit '#' auskommentiert - uebersprungen
// - Zeile 722: Referenz '#spruchmagie_veraenderung_2_blankwaffe_erschaffen' mit '#' auskommentiert - uebersprungen
// - Zeile 723: Referenz '#spruchmagie_veraenderung_2_material_erweichen' mit '#' auskommentiert - uebersprungen
// - Zeile 724: Referenz '#spruchmagie_veraenderung_2_material_schwaechen' mit '#' auskommentiert - uebersprungen
// - Zeile 725: Referenz '#spruchmagie_veraenderung_2_mechanik_schmieren' mit '#' auskommentiert - uebersprungen
// - Zeile 726: Referenz '#spruchmagie_veraenderung_3_gegenstand_fixieren' mit '#' auskommentiert - uebersprungen
// - Zeile 727: Referenz '#spruchmagie_veraenderung_3_in_pflanze_verwandeln' mit '#' auskommentiert - uebersprungen
// - Zeile 728: Referenz '#spruchmagie_veraenderung_3_material_verhaerten' mit '#' auskommentiert - uebersprungen
// - Zeile 729: Referenz '#spruchmagie_veraenderung_3_material_verstaerken' mit '#' auskommentiert - uebersprungen
// - Zeile 730: Referenz '#spruchmagie_veraenderung_3_temperatur_veraendern' mit '#' auskommentiert - uebersprungen
// - Zeile 731: Referenz '#spruchmagie_veraenderung_4_gift_neutralisieren' mit '#' auskommentiert - uebersprungen
// - Zeile 732: Referenz '#spruchmagie_veraenderung_4_material_stabilisieren_konservieren' mit '#' auskommentiert - uebersprungen
// - Zeile 733: Referenz '#spruchmagie_veraenderung_4_mechanik_blockieren' mit '#' auskommentiert - uebersprungen
// - Zeile 734: Referenz '#spruchmagie_veraenderung_4_ruestung_verstaerken' mit '#' auskommentiert - uebersprungen
// - Zeile 735: Referenz '#spruchmagie_veraenderung_4_verwandlung_in_[element]' mit '#' auskommentiert - uebersprungen
// - Zeile 736: Referenz '#spruchmagie_veraenderung_5_magnetismus' mit '#' auskommentiert - uebersprungen
// - Zeile 737: Referenz '#spruchmagie_veraenderung_5_ruestung_schwaechen' mit '#' auskommentiert - uebersprungen
// - Zeile 738: Referenz '#spruchmagie_veraenderung_5_schwerkraft_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 739: Referenz '#spruchmagie_veraenderung_6_unbelebte_materie_zerstoeren' mit '#' auskommentiert - uebersprungen
// - Zeile 740: Referenz '#spruchmagie_veraenderung_6_weg_aus_licht' mit '#' auskommentiert - uebersprungen
// - Zeile 741: Referenz '#spruchmagie_veraenderung_6_wettermeisterschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 742: Referenz '#spruchmagie_veraenderung_7_fleisch_zu_stein' mit '#' auskommentiert - uebersprungen
// - Zeile 743: Referenz '#spruchmagie_veraenderung_7_materie_zerstoeren' mit '#' auskommentiert - uebersprungen
// - Zeile 744: Referenz '#spruchmagie_veraenderung_7_stillstand' mit '#' auskommentiert - uebersprungen
// - Zeile 745: Referenz '#spruchmagie_verzauberung_1_ausstrahlung_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 746: Referenz '#spruchmagie_verzauberung_1_grundfertigkeit_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 747: Referenz '#spruchmagie_verzauberung_1_kleine_telekinese' mit '#' auskommentiert - uebersprungen
// - Zeile 748: Referenz '#spruchmagie_verzauberung_1_manaspende' mit '#' auskommentiert - uebersprungen
// - Zeile 749: Referenz '#spruchmagie_verzauberung_1_whk_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 750: Referenz '#spruchmagie_verzauberung_2_explosionsfalle' mit '#' auskommentiert - uebersprungen
// - Zeile 751: Referenz '#spruchmagie_verzauberung_2_kiemen' mit '#' auskommentiert - uebersprungen
// - Zeile 752: Referenz '#spruchmagie_verzauberung_2_koerperliche_eigenschaft_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 753: Referenz '#spruchmagie_verzauberung_2_leben_einhauchen' mit '#' auskommentiert - uebersprungen
// - Zeile 754: Referenz '#spruchmagie_verzauberung_3_beschleuniger' mit '#' auskommentiert - uebersprungen
// - Zeile 755: Referenz '#spruchmagie_verzauberung_3_einmaliges_artefakt_erschaffen' mit '#' auskommentiert - uebersprungen
// - Zeile 756: Referenz '#spruchmagie_verzauberung_3_geistesbund' mit '#' auskommentiert - uebersprungen
// - Zeile 757: Referenz '#spruchmagie_verzauberung_3_geistige_eigenschaft_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 758: Referenz '#spruchmagie_verzauberung_3_haesslichkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 759: Referenz '#spruchmagie_verzauberung_3_koerperliche_eigenschaft_senken' mit '#' auskommentiert - uebersprungen
// - Zeile 760: Referenz '#spruchmagie_verzauberung_3_sinne_verbessern' mit '#' auskommentiert - uebersprungen
// - Zeile 761: Referenz '#spruchmagie_verzauberung_3_unbelebtes_teleportieren' mit '#' auskommentiert - uebersprungen
// - Zeile 762: Referenz '#spruchmagie_verzauberung_4_eigenschaften_erhoehen' mit '#' auskommentiert - uebersprungen
// - Zeile 763: Referenz '#spruchmagie_verzauberung_4_geistige_eigenschaft_senken' mit '#' auskommentiert - uebersprungen
// - Zeile 764: Referenz '#spruchmagie_verzauberung_4_golem_diener' mit '#' auskommentiert - uebersprungen
// - Zeile 765: Referenz '#spruchmagie_verzauberung_4_grosse_telekinese' mit '#' auskommentiert - uebersprungen
// - Zeile 766: Referenz '#spruchmagie_verzauberung_4_in_[tier]_verwandeln' mit '#' auskommentiert - uebersprungen
// - Zeile 767: Referenz '#spruchmagie_verzauberung_4_verlangsamen' mit '#' auskommentiert - uebersprungen
// - Zeile 768: Referenz '#spruchmagie_verzauberung_4_wachstum_beeinflussen' mit '#' auskommentiert - uebersprungen
// - Zeile 769: Referenz '#spruchmagie_verzauberung_5_gecko' mit '#' auskommentiert - uebersprungen
// - Zeile 770: Referenz '#spruchmagie_verzauberung_5_golem_kaempfer' mit '#' auskommentiert - uebersprungen
// - Zeile 771: Referenz '#spruchmagie_verzauberung_5_mechanismus_antreiben' mit '#' auskommentiert - uebersprungen
// - Zeile 772: Referenz '#spruchmagie_verzauberung_5_nebelleib' mit '#' auskommentiert - uebersprungen
// - Zeile 773: Referenz '#spruchmagie_verzauberung_5_permanentes_artefakt_erschaffen' mit '#' auskommentiert - uebersprungen
// - Zeile 774: Referenz '#spruchmagie_verzauberung_5_schwaeche' mit '#' auskommentiert - uebersprungen
// - Zeile 775: Referenz '#spruchmagie_verzauberung_5_verwandlung' mit '#' auskommentiert - uebersprungen
// - Zeile 776: Referenz '#spruchmagie_verzauberung_5_warp' mit '#' auskommentiert - uebersprungen
// - Zeile 777: Referenz '#spruchmagie_verzauberung_6_dummheit' mit '#' auskommentiert - uebersprungen
// - Zeile 778: Referenz '#spruchmagie_verzauberung_6_eisenhaut' mit '#' auskommentiert - uebersprungen
// - Zeile 779: Referenz '#spruchmagie_verzauberung_6_last_des_alters' mit '#' auskommentiert - uebersprungen
// - Zeile 780: Referenz '#spruchmagie_verzauberung_7_grosser_golem' mit '#' auskommentiert - uebersprungen
// - Zeile 781: Referenz '#spruchmagie_verzauberung_7_krueppel' mit '#' auskommentiert - uebersprungen
// - Zeile 782: Referenz '#spruchmagie_verzauberung_7_leib_aus_[element]' mit '#' auskommentiert - uebersprungen
// - Zeile 783: Referenz '#spruchmagie_verzauberung_7_tod_nn' mit '#' auskommentiert - uebersprungen
// - Zeile 784: Referenz '#spruchmagie_verzauberung_7_tod_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 785: Referenz '#spruchmagie_verzauberung_7_verjuengung' mit '#' auskommentiert - uebersprungen
// - Zeile 786: Referenz '#spruchmagie_wasserbeschwoerung_1_eisball' mit '#' auskommentiert - uebersprungen
// - Zeile 787: Referenz '#spruchmagie_wasserbeschwoerung_1_eisball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 788: Referenz '#spruchmagie_wasserbeschwoerung_1_frostfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 789: Referenz '#spruchmagie_wasserbeschwoerung_1_frostfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 790: Referenz '#spruchmagie_wasserbeschwoerung_2_frostbolzen' mit '#' auskommentiert - uebersprungen
// - Zeile 791: Referenz '#spruchmagie_wasserbeschwoerung_2_frostbolzen_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 792: Referenz '#spruchmagie_wasserbeschwoerung_3_grosse_frostfaust' mit '#' auskommentiert - uebersprungen
// - Zeile 793: Referenz '#spruchmagie_wasserbeschwoerung_3_grosse_frostfaust_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 794: Referenz '#spruchmagie_wasserbeschwoerung_4_grosser_eisball' mit '#' auskommentiert - uebersprungen
// - Zeile 795: Referenz '#spruchmagie_wasserbeschwoerung_4_grosser_eisball_nr' mit '#' auskommentiert - uebersprungen
// - Zeile 796: Referenz '#spruchmagie_z_beherrschung_entwicklung_1_aufmerksamkeit2' mit '#' auskommentiert - uebersprungen
// - Zeile 797: Referenz '#spruchmagie_z_beherrschung_entwicklung_1_beruhigung' mit '#' auskommentiert - uebersprungen
// - Zeile 798: Referenz '#spruchmagie_z_beherrschung_entwicklung_1_entscheidungshilfe' mit '#' auskommentiert - uebersprungen
// - Zeile 799: Referenz '#spruchmagie_z_beherrschung_entwicklung_1_tierkontrolle' mit '#' auskommentiert - uebersprungen
// - Zeile 800: Referenz '#spruchmagie_z_beherrschung_entwicklung_1_verwirrung2' mit '#' auskommentiert - uebersprungen
// - Zeile 801: Referenz '#spruchmagie_z_beherrschung_entwicklung_2_angst' mit '#' auskommentiert - uebersprungen
// - Zeile 802: Referenz '#spruchmagie_z_beherrschung_entwicklung_2_flucht' mit '#' auskommentiert - uebersprungen
// - Zeile 803: Referenz '#spruchmagie_z_beherrschung_entwicklung_2_harmlos' mit '#' auskommentiert - uebersprungen
// - Zeile 804: Referenz '#spruchmagie_z_beherrschung_entwicklung_2_konfus2' mit '#' auskommentiert - uebersprungen
// - Zeile 805: Referenz '#spruchmagie_z_beherrschung_entwicklung_2_tierfreundschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 806: Referenz '#spruchmagie_z_beherrschung_entwicklung_2_wut' mit '#' auskommentiert - uebersprungen
// - Zeile 807: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_feindschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 808: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_fremde_zungen' mit '#' auskommentiert - uebersprungen
// - Zeile 809: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_insektenruf' mit '#' auskommentiert - uebersprungen
// - Zeile 810: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_konzentration_stoeren' mit '#' auskommentiert - uebersprungen
// - Zeile 811: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_schmerz' mit '#' auskommentiert - uebersprungen
// - Zeile 812: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_schmerzfrei' mit '#' auskommentiert - uebersprungen
// - Zeile 813: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_tierbefehl' mit '#' auskommentiert - uebersprungen
// - Zeile 814: Referenz '#spruchmagie_z_beherrschung_entwicklung_3_zwang' mit '#' auskommentiert - uebersprungen
// - Zeile 815: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_freundschaft2' mit '#' auskommentiert - uebersprungen
// - Zeile 816: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_gier' mit '#' auskommentiert - uebersprungen
// - Zeile 817: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_grosse_harmlosigkeit' mit '#' auskommentiert - uebersprungen
// - Zeile 818: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_grosse_tierfreundschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 819: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_massenflucht' mit '#' auskommentiert - uebersprungen
// - Zeile 820: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_mimose' mit '#' auskommentiert - uebersprungen
// - Zeile 821: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_stumm2' mit '#' auskommentiert - uebersprungen
// - Zeile 822: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_tiere_rufen' mit '#' auskommentiert - uebersprungen
// - Zeile 823: Referenz '#spruchmagie_z_beherrschung_entwicklung_4_zonenzwang' mit '#' auskommentiert - uebersprungen
// - Zeile 824: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_babel' mit '#' auskommentiert - uebersprungen
// - Zeile 825: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_freien_elementar_beherrschen' mit '#' auskommentiert - uebersprungen
// - Zeile 826: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_menschen_rufen' mit '#' auskommentiert - uebersprungen
// - Zeile 827: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_schwere_glieder' mit '#' auskommentiert - uebersprungen
// - Zeile 828: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_sinneseinschraenkung' mit '#' auskommentiert - uebersprungen
// - Zeile 829: Referenz '#spruchmagie_z_beherrschung_entwicklung_5_tierherrschaft' mit '#' auskommentiert - uebersprungen
// - Zeile 830: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_atemnot' mit '#' auskommentiert - uebersprungen
// - Zeile 831: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_herrschaft_ueber_menschen' mit '#' auskommentiert - uebersprungen
// - Zeile 832: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_massen_befehligen' mit '#' auskommentiert - uebersprungen
// - Zeile 833: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_paralyse2' mit '#' auskommentiert - uebersprungen
// - Zeile 834: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_schlaf' mit '#' auskommentiert - uebersprungen
// - Zeile 835: Referenz '#spruchmagie_z_beherrschung_entwicklung_6_stille_masse' mit '#' auskommentiert - uebersprungen
// - Zeile 836: Referenz '#spruchmagie_z_beherrschung_entwicklung_7_backstreet_boy' mit '#' auskommentiert - uebersprungen
// - Zeile 837: Referenz '#spruchmagie_z_beherrschung_entwicklung_7_neues_leben' mit '#' auskommentiert - uebersprungen
// - Zeile 838: Referenz '#spruchmagie_z_beherrschung_entwicklung_7_totale_kontrolle2' mit '#' auskommentiert - uebersprungen
// - Zeile 913: Referenz '#talente_ladeschuetze_schleuder' mit '#' auskommentiert - uebersprungen
// - Zeile 988: Referenz '#vn_anfaelligkeit_gegen_verzauberung_1' mit '#' auskommentiert - uebersprungen
// - Zeile 989: Referenz '#vn_anfaelligkeit_gegen_verzauberung_2' mit '#' auskommentiert - uebersprungen
// - Zeile 1132: Referenz '#vn_unempfindlichkeit_gegen_alchemie' mit '#' auskommentiert - uebersprungen
