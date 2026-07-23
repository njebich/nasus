// Spruchmagie-Lern-/Steigern-Gates (Nutzer 2026-07-20/21, siehe Memory project_spruchmagie_regeln.md
// Punkte 1-10 fuer die vollstaendige Regelherleitung). Bewusst nur UI-Ebene (analog
// kiBaumGating.ts/ladeschuetzeGating.ts) - keine Durchsetzung in characterMutations.ts's setValue.
//
// Zwei unabhaengige Gates, beide muessen bei jedem "+"-Klick erfuellt sein:
// 1. canLearnSpell: ist dieser Zaubergrad ueberhaupt erreichbar? Basis-Cap = Attribut Weisheit
//    (att_weisheit, Formel kreis+1). Grad===Weisheit+1 ist NUR erreichbar, solange ein
//    Hauszauber-Slot frei ist (Slot-Anzahl = Stufenfunktion ueber in Talentgruppe "Magier"
//    investierte TaP, siehe HAUSZAUBER_SLOT_SCHWELLEN) - Slots sind schulen-uebergreifend frei
//    waehlbar, "verbraucht" wird ein Slot implizit durch jeden gelernten (TaW>0) Zauber mit
//    Grad===Weisheit+1 (keine explizite Zuordnung noetig: sobald Weisheit steigt, verschiebt
//    sich die Grenze nach oben und ein alter Hauszauber wird automatisch zu einem normalen
//    Zauber - "da man nicht zuruecksteigern kann, ist der Zauber sowieso locked", Nutzer-Zitat).
// 2. canIncreaseSpell: Aura>0 UND Magie>0 (Nutzer 2026-07-21, analog KI/PSI-Wurzel-Gate, gilt
//    hier aber fuer JEDEN Zauber jeder Schule/jedes Grades, da Spruchmagie keinen einzelnen
//    Baum-Wurzelknoten hat) UND Mindestintelligenz (aus spruchmagieDetails.minInt) UND
//    (Grad===1 ODER ein gelernter Zauber derselben Schule mit Grad-1 (direkter Vorgaenger, nicht
//    irgendein niedrigerer Grad) auf TaW>=10 - Regel-Kette, Nutzer 2026-07-24: "single Grad 1
//    TaW>=10 allows all Grad 2 [...] single Grad 2 TaW>=10 allows all grad 3").

import type { ComputedSheet } from './characterSheet';
import type { RuleEntry } from '../data/rules';
import { SPRUCHMAGIE_DETAILS } from '../data/spruchmagieDetails';

const MAGIER_TALENTGRUPPE = 'Magier';
const SPRUCHMAGIE_KATEGORIE = 'Spruchmagie';

// Hoechster ueberschrittener Schwellenwert gilt (keine Aufsummierung), hartes Maximum 7 - siehe
// Memory project_spruchmagie_regeln.md Punkt 8. Absteigend sortiert fuer die erste-Treffer-Suche.
const HAUSZAUBER_SLOT_SCHWELLEN: ReadonlyArray<readonly [tap: number, slots: number]> = [
  [359, 7], [280, 6], [210, 5], [130, 4], [72, 3], [36, 2], [12, 1],
];

function getMagierTapSpent(sheet: ComputedSheet): number {
  return (sheet.byKategorie['Talente'] ?? [])
    .filter((r) => r.rule.parent === MAGIER_TALENTGRUPPE)
    .reduce((sum, r) => {
      const kosten = (r.currentValue ?? 0) > 0
        ? r.kostenCurrent
        : (r.selected && r.kostenSelect !== undefined ? r.kostenSelect : undefined);
      return sum + (kosten ?? 0);
    }, 0);
}

export function getHauszauberSlots(sheet: ComputedSheet): number {
  const tap = getMagierTapSpent(sheet);
  const treffer = HAUSZAUBER_SLOT_SCHWELLEN.find(([schwelle]) => tap >= schwelle);
  return treffer ? treffer[1] : 0;
}

export function getMaxLernbarerGrad(sheet: ComputedSheet): number {
  const row = (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === 'att_weisheit');
  return Number(row?.computedValue ?? 0);
}

function spruchmagieRows(sheet: ComputedSheet) {
  return sheet.byKategorie[SPRUCHMAGIE_KATEGORIE] ?? [];
}

function getGelernteHauszauberCount(sheet: ComputedSheet, weisheit: number): number {
  const hauszauberGrad = weisheit + 1;
  return spruchmagieRows(sheet).filter(
    (r) => (r.currentValue ?? 0) > 0 && Number(r.rule.grad) === hauszauberGrad,
  ).length;
}

export interface GateResult {
  allowed: boolean;
  reason?: string;
}

/** Gate 1 (Regel 5-10): ist dieser Zaubergrad ueberhaupt erreichbar (Weisheit-Cap +
 *  Hauszauber-Bypass)? Ein bereits gelernter Hauszauber bleibt immer erlaubt, auch wenn
 *  inzwischen alle Slots durch andere Zauber belegt sind (kein rueckwirkendes Sperren). */
export function canLearnSpell(sheet: ComputedSheet, rule: RuleEntry): GateResult {
  const grad = Number(rule.grad ?? 0);
  const weisheit = getMaxLernbarerGrad(sheet);
  if (grad <= weisheit) return { allowed: true };

  const bereitsGelernt = (spruchmagieRows(sheet).find((r) => r.rule.referenz === rule.referenz)?.currentValue ?? 0) > 0;
  if (bereitsGelernt) return { allowed: true };

  if (grad === weisheit + 1) {
    const slots = getHauszauberSlots(sheet);
    const belegt = getGelernteHauszauberCount(sheet, weisheit);
    if (belegt < slots) return { allowed: true };
    return { allowed: false, reason: `Kein Hauszauber-Slot frei (${belegt}/${slots} belegt, Weisheit ${weisheit})` };
  }

  return { allowed: false, reason: `Grad ${grad} liegt ueber Weisheit+1 (${weisheit + 1})` };
}

function attributCurrentValue(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

/** Gate 2 (Regel 1): Aura>0 UND Magie>0 (Nutzer 2026-07-21, analog KI/PSI-Wurzel-Gate) UND
 *  Mindestintelligenz UND (Grad 1 ODER gradniedrigerer Zauber derselben Schule auf TaW>=10).
 *  Gilt fuer jede Steigerung, nicht nur den ersten Lernpunkt - anders als KI/PSI (nur die
 *  Wurzeln) gibt es in Spruchmagie keinen einzelnen Baum-Wurzelknoten, daher gilt das Aura/
 *  Magie-Gate hier direkt fuer jeden einzelnen Zauber jeder Schule/jedes Grades.
 *  Prueft alle drei Teilbedingungen unabhaengig (kein frueher return) und sammelt JEDE nicht
 *  erfuellte in `reason`, statt nur die erste gefundene zu melden (Nutzer 2026-07-24: Tooltip
 *  auf dem "+"-Button soll alle Sperrgruende gleichzeitig zeigen). */
export function canIncreaseSpell(sheet: ComputedSheet, rule: RuleEntry): GateResult {
  const aura = attributCurrentValue(sheet, 'att_aura');
  const magie = attributCurrentValue(sheet, 'att_magie');
  const grad = Number(rule.grad ?? 0);
  const minInt = Number(SPRUCHMAGIE_DETAILS[rule.referenz]?.minInt ?? 0);
  const intelligenz = (sheet.byKategorie['Eigenschaft'] ?? []).find(
    (r) => r.rule.referenz === 'eig_g_intelligenz',
  )?.currentValue ?? 0;

  const gruende: string[] = [];
  if (aura <= 0 || magie <= 0) {
    gruende.push(`Aura > 0 (aktuell ${aura}) UND Magie > 0 (aktuell ${magie})`);
  }
  if (intelligenz < minInt) {
    gruende.push(`Intelligenz ${minInt} (aktuell ${intelligenz})`);
  }
  if (grad > 1) {
    const hatVorstufe = spruchmagieRows(sheet).some(
      (r) => r.rule.parent === rule.parent && Number(r.rule.grad) === grad - 1 && (r.currentValue ?? 0) >= 10,
    );
    if (!hatVorstufe) {
      gruende.push(`einen Grad-${grad - 1}-${rule.parent}-Zauber auf TaW 10`);
    }
  }

  if (gruende.length === 0) return { allowed: true };
  return { allowed: false, reason: `Benötigt: ${gruende.join(' UND ')}` };
}
