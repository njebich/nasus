// Trefferzonentabelle (W30-Trefferwurf -> Koerperzone), handkuratiert aus
// "NN Meisterscreen S1 v0.31.docx" (Tabelle "Treffertabelle v2") - kein xlsx-Codegen, da diese
// Tabelle nicht im Werte-Sheet steht. Wurf 0/30 ("Streiftreffer") ist bewusst NICHT enthalten -
// ein Streiftreffer hat laut Dokument keine eigene Trefferzone (pauschal W6 Schaden ohne
// Zonen-Bezug), daher auch keinen Ruestungswert aus dieser Tabelle.
//
// rsGruppe verweist auf eine der 4 Ruestungs-Gruppen (rs_kopf/rs_torso/rs_arme/rs_beine in
// rules.ts) - Regelkorrektur Nutzer 2026-07-17: "Standard-Ruestungen gelten fuer TZ-Gruppen
// Kopf; Arme (links+rechts) inkl. Haende; Torso inkl. Unterleib; Beine inkl. Fuesse, exkl.
// Unterleib." `null` = diese Zone kann strukturell NIE durch ein Ruestungsteil geschuetzt werden
// (nur Augen - Nutzer 2026-07-17: "augen nie RS durch Ruestung-Regel", ausdruecklich KEINE
// pauschale "RS=0"-Zahl, sondern eine grundsaetzliche Nicht-Schuetzbarkeit).
//
// halbeRs = true fuer Zonen, die nur die HALBE RS ihrer Gruppe bekommen. Korrigiert 2026-07-17
// anhand der Legende einer anderen Dokument-Version: "Hals, Schultergelenk, Ellenbogen, Haende,
// Knie und Fuesse werden nur mit halbem RS geschuetzt" - meine erste Fassung hatte Hand/Fuss
// faelschlich auf volle RS gesetzt (unbestaetigte Annahme, die ich faelschlich als vom Nutzer
// bestaetigt hingestellt hatte). Alle anderen Zonen bekommen die volle RS ihrer Gruppe.
// Mehrdeutige Zuordnungen wurden explizit mit dem Nutzer geklaert: Huefte->Beine,
// Schultergelenk->Arme, Hals->Kopf (trotz "K"-Markierung im Dokument, die dort NICHT halbe RS
// bedeutet, sondern einen unabhaengigen Schadens-/Gesundheitsproben-Effekt).
export type RsGruppe = 'kopf' | 'torso' | 'arme' | 'beine';

export interface TrefferzoneEntry {
  wurf: number;
  name: string;
  rsGruppe: RsGruppe | null;
  halbeRs: boolean;
}

export const TREFFERZONEN: TrefferzoneEntry[] = [
  { wurf: 1, name: 'Kopf', rsGruppe: 'kopf', halbeRs: false },
  { wurf: 2, name: 'Brust Mitte', rsGruppe: 'torso', halbeRs: false },
  { wurf: 3, name: 'L. Schulter', rsGruppe: 'arme', halbeRs: false },
  { wurf: 4, name: 'R. Schulter', rsGruppe: 'arme', halbeRs: false },
  { wurf: 5, name: 'L. Oberarm', rsGruppe: 'arme', halbeRs: false },
  { wurf: 6, name: 'R. Oberarm', rsGruppe: 'arme', halbeRs: false },
  { wurf: 7, name: 'L. Oberschenkel', rsGruppe: 'beine', halbeRs: false },
  { wurf: 8, name: 'R. Oberschenkel', rsGruppe: 'beine', halbeRs: false },
  { wurf: 9, name: 'L. Bauch', rsGruppe: 'torso', halbeRs: false },
  { wurf: 10, name: 'R. Bauch', rsGruppe: 'torso', halbeRs: false },
  { wurf: 11, name: 'L. Unterarm', rsGruppe: 'arme', halbeRs: false },
  { wurf: 12, name: 'R. Unterarm', rsGruppe: 'arme', halbeRs: false },
  { wurf: 13, name: 'Magen', rsGruppe: 'torso', halbeRs: false },
  { wurf: 14, name: 'Hüfte', rsGruppe: 'beine', halbeRs: false },
  { wurf: 15, name: 'L. Unterschenkel', rsGruppe: 'beine', halbeRs: false },
  { wurf: 16, name: 'R. Unterschenkel', rsGruppe: 'beine', halbeRs: false },
  { wurf: 17, name: 'Knie', rsGruppe: 'beine', halbeRs: true },
  { wurf: 18, name: 'Hand', rsGruppe: 'arme', halbeRs: true },
  { wurf: 19, name: 'L. Brustkorb', rsGruppe: 'torso', halbeRs: false },
  { wurf: 20, name: 'R. Brustkorb', rsGruppe: 'torso', halbeRs: false },
  { wurf: 21, name: 'Hals', rsGruppe: 'kopf', halbeRs: true },
  { wurf: 22, name: 'Ellenbogen', rsGruppe: 'arme', halbeRs: true },
  { wurf: 23, name: 'Arm', rsGruppe: 'arme', halbeRs: false },
  { wurf: 24, name: 'Fuß', rsGruppe: 'beine', halbeRs: true },
  { wurf: 25, name: 'Schultergelenk', rsGruppe: 'arme', halbeRs: true },
  { wurf: 26, name: 'Unterleib (Organ)', rsGruppe: 'torso', halbeRs: false },
  { wurf: 27, name: 'Brust (Lunge)', rsGruppe: 'torso', halbeRs: false },
  { wurf: 28, name: 'Herz', rsGruppe: 'torso', halbeRs: false },
  { wurf: 29, name: 'Augen', rsGruppe: null, halbeRs: false },
];
