// GENERIERT von scripts/extract_talente_maximum.py aus Talente-Wirkung-chatgpt.xlsx
// (ChatGPT-Analyse der Talente-Beschreibungen, abgeglichen mit rules.json) - nicht von
// Hand bearbeiten, stattdessen das Skript erneut laufen lassen. Nutzer 2026-07-18:
// Basiswerte fuer Fertigkeitsmaximum bestaetigt: Grundfertigkeit/Sonderfertigkeit=12,
// Nahkampf/Fernkampf/WHK/Spruchmagie=24, Attribute=7 (siehe engine/fertigkeitenGrenzen.ts).
// Jeder Eintrag ist ein TALENT, das bei Auswahl das Maximum EINER Referenz (zielReferenz),
// ALLER Referenzen einer Kategorie (zielKategorie, z.B. "alle Grundfertigkeiten") oder
// ALLER Referenzen mit gemeinsamem Praefix (zielPraefix, z.B. "spruchmagie_feuerbeschwoerung_"
// fuer eine Zauberschule) um den angegebenen Betrag erhoeht. Einige Eintraege sind manuelle
// Overrides (siehe MANUAL_MAXIMUM_OVERRIDES im Skript) - liefen in der Quelle unter einer
// anderen Wirkungsklasse oder hatten keine strukturierte Zielreferenz, wirken aber strukturell
// identisch zu den regulaer erfassten Fertigkeitsmaximum-Talenten: Charismatischer Fuehrer
// (nur gr_ueberzeugen, "Ueberreden" existiert nicht), PSI Psinetik + KI-Meister (KI/PSI-
// Basiswert=24, Nutzer 2026-07-18), Vorderlader Ladeschuetze.

export interface TalentMaximumBonus {
  talentReferenz: string;
  zielReferenz?: string;
  zielKategorie?: string;
  zielPraefix?: string;
  bonus: number;
}

export const TALENT_MAXIMUM_BONUSES: TalentMaximumBonus[] = [
  {
    "talentReferenz": "talente_alchemieresistenz_stufe_1",
    "zielReferenz": "sf_alchemieresistenz",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_alchemieresistenz_stufe_2",
    "zielReferenz": "sf_alchemieresistenz",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_attributs_maximum_erhoehen__aura",
    "zielReferenz": "att_aura",
    "bonus": 1
  },
  {
    "talentReferenz": "talente_attributs_maximum_erhoehen__glueck",
    "zielReferenz": "att_glueck",
    "bonus": 1
  },
  {
    "talentReferenz": "talente_attributs_maximum_erhoehen__karma",
    "zielReferenz": "att_karma",
    "bonus": 1
  },
  {
    "talentReferenz": "talente_attributs_maximum_erhoehen__magie",
    "zielReferenz": "att_magie",
    "bonus": 1
  },
  {
    "talentReferenz": "talente_attributs_maximum_erhoehen__vitalitaet",
    "zielReferenz": "att_vitalitaet",
    "bonus": 1
  },
  {
    "talentReferenz": "talente_ausdauer_stufe_1",
    "zielReferenz": "sf_ausdauer",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ausdauer_stufe_2",
    "zielReferenz": "sf_ausdauer",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_ausdauer_stufe_3",
    "zielReferenz": "sf_ausdauer",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_ausweichen_stufe_1",
    "zielReferenz": "sf_ausweichen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ausweichen_stufe_2",
    "zielReferenz": "sf_ausweichen",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_charismatischer_fuehrer",
    "zielReferenz": "gr_ueberzeugen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_athletik",
    "zielReferenz": "eig_k_athletik",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_ausstrahlung",
    "zielReferenz": "eig_k_ausstrahlung",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_geschicklichkeit",
    "zielReferenz": "eig_k_geschicklichkeit",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_intelligenz",
    "zielReferenz": "eig_g_intelligenz",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_konstitution",
    "zielReferenz": "eig_k_konstitution",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_mut",
    "zielReferenz": "eig_g_mut",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_schnelligkeit",
    "zielReferenz": "eig_k_schnelligkeit",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_sinnesschaerfe",
    "zielReferenz": "eig_g_sinneschaerfe",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_staerke",
    "zielReferenz": "eig_k_staerke",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_eigenschaften_erhoehen_willenskraft",
    "zielReferenz": "eig_g_willenskraft",
    "bonus": 5
  },
  {
    "talentReferenz": "talente_fliehen_stufe_1",
    "zielReferenz": "sf_fliehen",
    "bonus": 4
  },
  {
    "talentReferenz": "talente_fliehen_stufe_2",
    "zielReferenz": "sf_fliehen",
    "bonus": 8
  },
  {
    "talentReferenz": "talente_fliehen_stufe_3",
    "zielReferenz": "sf_fliehen",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_gefahrensinn",
    "zielReferenz": "sf_gefahreninstinkt",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_grundfertigkeiten_stufe_1",
    "zielKategorie": "Grundfertigkeit",
    "bonus": 2
  },
  {
    "talentReferenz": "talente_grundfertigkeiten_stufe_2",
    "zielKategorie": "Grundfertigkeit",
    "bonus": 4
  },
  {
    "talentReferenz": "talente_grundfertigkeiten_stufe_3",
    "zielKategorie": "Grundfertigkeit",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_grundfertigkeiten_stufe_4",
    "zielKategorie": "Grundfertigkeit",
    "bonus": 8
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_boegen",
    "zielReferenz": "fk_boegen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_hiebwaffen",
    "zielReferenz": "nk_hiebwaffen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_klingenwaffen",
    "zielReferenz": "nk_klingenwaffen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_schusswaffen",
    "zielReferenz": "fk_schusswaffen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_stangenwaffen",
    "zielReferenz": "nk_stangenwaffen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_stichwaffen",
    "zielReferenz": "nk_stichwaffen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_kampffertigkeit_erhoehen_unbewaffnet",
    "zielReferenz": "nk_unbewaffnet",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ki_meister",
    "zielKategorie": "KI",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_ki_mentale_kapazitaet_stufe_1",
    "zielReferenz": "sf_mentale_kapazitaet",
    "bonus": 4
  },
  {
    "talentReferenz": "talente_ki_mentale_kapazitaet_stufe_2",
    "zielReferenz": "sf_mentale_kapazitaet",
    "bonus": 8
  },
  {
    "talentReferenz": "talente_ki_mentale_kapazitaet_stufe_3",
    "zielReferenz": "sf_mentale_kapazitaet",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_konzentration_stufe_1",
    "zielReferenz": "ki_konzentration",
    "bonus": 4
  },
  {
    "talentReferenz": "talente_konzentration_stufe_2",
    "zielReferenz": "ki_konzentration",
    "bonus": 8
  },
  {
    "talentReferenz": "talente_konzentration_stufe_3",
    "zielReferenz": "ki_konzentration",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_ladeschuetze_armbrust",
    "zielReferenz": "sf_ladeschuetze_armbrust",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_blasrohr",
    "zielReferenz": "sf_ladeschuetze_blasrohr",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_bogen",
    "zielReferenz": "sf_ladeschuetze_bogen",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_kanone",
    "zielReferenz": "sf_ladeschuetze_kanone",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_patrone",
    "zielReferenz": "sf_ladeschuetze_patrone",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_rune",
    "zielReferenz": "sf_ladeschuetze_rune",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_schleuder",
    "zielReferenz": "sf_ladeschuetze_schleuder",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_ladeschuetze_wurfmesser",
    "zielReferenz": "sf_ladeschuetze_wurfmesser",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_antimagie_magus",
    "zielPraefix": "spruchmagie_antimagie_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_beherrschungs_magus",
    "zielPraefix": "spruchmagie_beherrschung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_erdbeschwoerungs_magus",
    "zielPraefix": "spruchmagie_erdbeschwoerung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_feuerbeschwoerungs_magus",
    "zielPraefix": "spruchmagie_feuerbeschwoerung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_heilungs_magus",
    "zielPraefix": "spruchmagie_heilung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_hellsicht_magus",
    "zielPraefix": "spruchmagie_hellsicht_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_illusions_magus",
    "zielPraefix": "spruchmagie_illusion_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_luftbeschwoerungs_magus",
    "zielPraefix": "spruchmagie_luftbeschwoerung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_magiebeschwoerungs_magus",
    "zielPraefix": "spruchmagie_magiebeschwoerung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_veraenderungs_magus",
    "zielPraefix": "spruchmagie_veraenderung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_verzauberungs_magus",
    "zielPraefix": "spruchmagie_verzauberung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_1_wasserbeschwoerungs_magus",
    "zielPraefix": "spruchmagie_wasserbeschwoerung_",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_magus_stufe_2_antimagies_grossmagus",
    "zielPraefix": "spruchmagie_antimagie_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_beherrschungs_grossmagus",
    "zielPraefix": "spruchmagie_beherrschung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_erdbeschwoerungs_grossmagus",
    "zielPraefix": "spruchmagie_erdbeschwoerung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_feuerbeschwoerungs_grossmagus",
    "zielPraefix": "spruchmagie_feuerbeschwoerung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_heilungs_grossmagus",
    "zielPraefix": "spruchmagie_heilung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_hellsicht_grossmagus",
    "zielPraefix": "spruchmagie_hellsicht_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_illusions_grossmagus",
    "zielPraefix": "spruchmagie_illusion_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_luftbeschwoerungs_grossmagus",
    "zielPraefix": "spruchmagie_luftbeschwoerung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_magiebeschwoerungs_grossmagus",
    "zielPraefix": "spruchmagie_magiebeschwoerung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_veraenderungs_grossmagus",
    "zielPraefix": "spruchmagie_veraenderung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_verzauberungs_grossmagus",
    "zielPraefix": "spruchmagie_verzauberung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_2_wasserbeschwoerungs_grossmagus",
    "zielPraefix": "spruchmagie_wasserbeschwoerung_",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_magus_stufe_3_antimagies_erzmagus",
    "zielPraefix": "spruchmagie_antimagie_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_beherrschungs_erzmagus",
    "zielPraefix": "spruchmagie_beherrschung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_erdbeschwoerungs_erzmagus",
    "zielPraefix": "spruchmagie_erdbeschwoerung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_feuerbeschwoerungs_erzmagus",
    "zielPraefix": "spruchmagie_feuerbeschwoerung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_heilungs_erzmagus",
    "zielPraefix": "spruchmagie_heilung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_hellsicht_erzmagus",
    "zielPraefix": "spruchmagie_hellsicht_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_illusions_erzmagus",
    "zielPraefix": "spruchmagie_illusion_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_luftbeschwoerungs_erzmagus",
    "zielPraefix": "spruchmagie_luftbeschwoerung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_magiebeschwoerungs_erzmagus",
    "zielPraefix": "spruchmagie_magiebeschwoerung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_veraenderungs_erzmagus",
    "zielPraefix": "spruchmagie_veraenderung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_verzauberungs_erzmagus",
    "zielPraefix": "spruchmagie_verzauberung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_magus_stufe_3_wasserbeschwoerungs_erzmagus",
    "zielPraefix": "spruchmagie_wasserbeschwoerung_",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_mana_meditation_stufe_1",
    "zielReferenz": "sf_meditation",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_mana_meditation_stufe_2",
    "zielReferenz": "sf_meditation",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_mana_meditation_stufe_3",
    "zielReferenz": "sf_meditation",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_mana_talent_stufe_1",
    "zielReferenz": "sf_mana_talent",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_mana_talent_stufe_2",
    "zielReferenz": "sf_mana_talent",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_mana_talent_stufe_3",
    "zielReferenz": "sf_mana_talent",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_mana_talent_stufe_4",
    "zielReferenz": "sf_mana_talent",
    "bonus": 24
  },
  {
    "talentReferenz": "talente_psi_psinetik_stufe_1",
    "zielKategorie": "PSI",
    "bonus": 6
  },
  {
    "talentReferenz": "talente_psi_psinetik_stufe_2",
    "zielKategorie": "PSI",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_psi_psinetik_stufe_3",
    "zielKategorie": "PSI",
    "bonus": 18
  },
  {
    "talentReferenz": "talente_ruestungsmanoever_stufe_1",
    "zielReferenz": "sf_ruestungsmanoever",
    "bonus": 4
  },
  {
    "talentReferenz": "talente_ruestungsmanoever_stufe_2",
    "zielReferenz": "sf_ruestungsmanoever",
    "bonus": 8
  },
  {
    "talentReferenz": "talente_ruestungsmanoever_stufe_3",
    "zielReferenz": "sf_ruestungsmanoever",
    "bonus": 12
  },
  {
    "talentReferenz": "talente_selbstbeherrschung_stufe_1",
    "zielReferenz": "sf_selbstbeherrschung",
    "bonus": 7
  },
  {
    "talentReferenz": "talente_selbstbeherrschung_stufe_2",
    "zielReferenz": "sf_selbstbeherrschung",
    "bonus": 14
  },
  {
    "talentReferenz": "talente_selbstbeherrschung_stufe_3",
    "zielReferenz": "sf_selbstbeherrschung",
    "bonus": 20
  },
  {
    "talentReferenz": "talente_vorderlader_ladeschuetze_stufe1",
    "zielReferenz": "sf_ladeschuetze_vorderlader",
    "bonus": 7
  },
  {
    "talentReferenz": "talente_vorderlader_ladeschuetze_stufe2",
    "zielReferenz": "sf_ladeschuetze_vorderlader",
    "bonus": 15
  },
  {
    "talentReferenz": "talente_whk_stufe_1",
    "zielKategorie": "WHK",
    "bonus": 3
  },
  {
    "talentReferenz": "talente_whk_stufe_2",
    "zielKategorie": "WHK",
    "bonus": 6
  }
];
