// Ausweichen / Bewegung (immer sichtbar, reine Formel-Anzeige) - siehe kampf.ts-Dateikopf.

import { makeValueSource } from '../engine/characterSheet';
import { evalReferenz } from '../engine/rules';
import type { CharacterState } from '../state/characterStore';

export interface AusweichenRow {
  offAw: number;
  defAw: number;
  gutAw: number;
  meisterlichAw: number;
  ini: number;
  ausdauer: number;
  dauerlauf: number;
  sprinten: number;
  hochsprung: number;
  weitsprung: string;
}

export function buildAusweichenRow(character: CharacterState): AusweichenRow {
  const values = makeValueSource(character);
  const v = (referenz: string) => Math.round(Number(evalReferenz(referenz, values)));
  // Hochsprung rundet in rules.ts bereits auf 0,25 (Nutzer-Ask) statt auf ganze Zahlen - der
  // generische Math.round() hier wuerde das wieder auf eine Ganzzahl zurueckrunden (z.B. 0,75 -> 1),
  // also fuer diese eine Referenz den bereits korrekt gerundeten Rohwert unveraendert lassen.
  const vHochsprung = () => Number(evalReferenz('bewegung_f_hochsprung', values));
  return {
    offAw: v('aw_off_normal'),
    defAw: v('aw_def_normal'),
    gutAw: v('aw_gut'),
    meisterlichAw: v('aw_meisterlich'),
    ini: v('ini'),
    ausdauer: v('f_ausdauer'),
    dauerlauf: v('bewegung_f_dauerlauf'),
    sprinten: v('bewegung_f_sprinten'),
    hochsprung: vHochsprung(),
    weitsprung: `${v('bewegung_f_weitsprung_aus_dem_stand')}/${v('bewegung_f_weitsprung_kurzer_anlauf')}/${v('bewegung_f_weitsprung_optimaler_anlauf')}`,
  };
}

export function renderAusweichenBlock(row: AusweichenRow): string {
  return `
    <h3 class="bogen-section-heading">Ausweichen / Bewegung</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-ausweichen-table">
        <thead><tr>
          <th>n off AW</th><th>n def AW</th><th>g AW</th><th>m AW</th><th>Initiative</th>
          <th>Ausdauer</th><th>Dauerlauf (m/KR)</th><th>Sprinten (m/KR)</th>
          <th>Hochsprung (m)</th><th>Weitsprung (m)</th>
        </tr></thead>
        <tbody><tr>
          <td>${row.offAw}</td><td>${row.defAw}</td><td>${row.gutAw}</td><td>${row.meisterlichAw}</td>
          <td>${row.ini}</td><td>${row.ausdauer}</td><td>${row.dauerlauf}</td><td>${row.sprinten}</td>
          <td>${row.hochsprung}</td><td>${row.weitsprung}</td>
        </tr></tbody>
      </table>
    </div>`;
}
