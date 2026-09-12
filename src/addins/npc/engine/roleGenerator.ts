import { createCharacter, type CharacterState, type PoolAllocation } from '../../../state/characterStore';
import {
  setValue, addSelection, buyWeapon, setWaffenPoolAllocation, buyFeuerwaffe, buyFeuerwaffenMunition, BudgetError,
} from '../../../state/characterMutations';
import { computeSheet } from '../../../engine/characterSheet';
import { GESINNUNG_TRAITS } from '../../../data/gesinnung';
import { applyNpcArmorPackage } from './ruestungspakete';
import { SPEZIES_SSK, type RoleStub } from '../data/roleStubs';

const POOL_FIELD_BY_LABEL: Record<string, keyof PoolAllocation> = {
  nAT: 'nat', nPA: 'npa', gAT: 'gat', gPA: 'gpa', mAT: 'mat', mPA: 'mpa',
};
/** Ziel-Priorität beim Kürzen, wenn die Gesamtsumme das Budget überschreitet: zuerst
 *  meisterlich, dann gut, zuletzt normal einsparen (normale Werte sind die verlässliche Basis). */
const SHRINK_ORDER: Array<keyof PoolAllocation> = ['mpa', 'mat', 'gpa', 'gat', 'npa', 'nat'];

/**
 * Verteilt Pool-Punkte auf eine Waffe/Unbewaffnet-Zeile und passt eine gewünschte Zuteilung
 * automatisch an die tatsächlichen, von Spezies/Attributen/Hauptfertigkeit abhängigen Obergrenzen
 * an (n/g/m-Feldgrenzen und Gesamtbudget) - ein pauschal aus einer Referenz übernommener Split
 * passt nicht für jede Spezies gleichermaßen. Reduziert iterativ anhand der von
 * setWaffenPoolAllocation geworfenen Fehlermeldungen, bis eine gültige Zuteilung gefunden ist.
 */
function fitPoolAllocation(
  character: CharacterState, poolReferenz: string, equipmentId: string, desired: PoolAllocation,
): CharacterState {
  let allocation: PoolAllocation = { ...desired };
  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      return setWaffenPoolAllocation(character, poolReferenz, equipmentId, allocation);
    } catch (error) {
      if (!(error instanceof BudgetError)) throw error;
      const capMatch = /^(nAT|nPA|gAT|gPA|mAT|mPA) ueberschreitet die Obergrenze \(max ([\d.,]+)/.exec(error.message);
      if (capMatch) {
        const field = POOL_FIELD_BY_LABEL[capMatch[1]];
        const max = Math.floor(Number(capMatch[2].replace(',', '.')));
        if (allocation[field] <= max) throw error;
        allocation = { ...allocation, [field]: max };
        continue;
      }
      const budgetMatch = /Nicht genug Pool-Punkte: benoetigt ([\d.,]+), verfuegbar ([\d.,]+)/.exec(error.message);
      if (budgetMatch) {
        let over = Math.ceil(Number(budgetMatch[1].replace(',', '.')) - Number(budgetMatch[2].replace(',', '.')));
        const next = { ...allocation };
        for (const field of SHRINK_ORDER) {
          if (over <= 0) break;
          const reduceBy = Math.min(next[field], over);
          next[field] -= reduceBy;
          over -= reduceBy;
        }
        if (over > 0) throw error;
        allocation = next;
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Pool-Zuteilung für '${poolReferenz}' konvergiert nicht (nach 25 Versuchen).`);
}

/**
 * Setzt einen Eigenschafts-/Attributwert und reduziert ihn automatisch, falls das SP-Budget nicht
 * reicht (Attribute kosten quadratisch - 10×wert²+70×wert -, das lässt sich beim Stub-Autoring
 * nicht immer exakt vorausrechnen). Degradiert sichtbar niedriger, statt das Budget zu sprengen
 * oder den ganzen Generator abzubrechen.
 */
function fitValue(character: CharacterState, referenz: string, wert: number): CharacterState {
  const floor = character.values[referenz] ?? 0;
  for (let target = wert; target > floor; target--) {
    try {
      return setValue(character, referenz, target);
    } catch (error) {
      if (!(error instanceof BudgetError)) throw error;
    }
  }
  return character;
}

/**
 * Erste Stufe/EP jedes Kreis, aus der bestehenden EP-Stufe-Kreis-Tabelle
 * (src/data/lookups.json, siehe Budgetgrundlage.md "SP-Budget je Kreis (NSC)").
 * ep_gesamt hierauf zu setzen liefert automatisch den korrekten Kreis UND das dazugehoerige
 * SP-Budget aus derselben Tabelle - keine eigene NSC-SP-Formel noetig (Nutzer-Korrektur
 * 2026-09-11: eine zuvor entworfene eigene SP-Kurve war ein Missverstaendnis).
 */
const KREIS_START_EP: Record<string, number> = {
  '0': 0, '1': 20, '2': 200, '3': 700, '4': 1750, '5': 3550, '6': 6300, '7': 10250,
};
/**
 * "Kreis N+" (Nutzer-Korrektur 2026-09-11) ist die MITTLERE Stufe des Kreis-Stufenbereichs, nicht
 * die letzte - jeder Kreis n umfasst genau 2n+1 Stufen (0:1, 1:3, 2:5, 3:7, 4:9, 5:11, 6:13,
 * 7:15 - Kreisgrenzen direkt aus der EP-Stufe-Kreis-Tabelle abgezaehlt), die Mitte ist damit immer
 * ein ganzzahliger Stufenwert. Kreis 0+ hat keine Entsprechung (Kreis 0 hat nur eine Stufe) und
 * bleibt hier bewusst aussen vor - siehe stattdessen die 80%/90%-Planungswerte in Budgetgrundlage.md.
 */
const KREIS_MID_EP: Record<string, number> = {
  '1': 60, '2': 400, '3': 1150, '4': 2550, '5': 4800, '6': 8100, '7': 12700,
};

export interface RoleGenerationResult {
  character: CharacterState;
  issues: string[];
  spSpent: number;
  spTotal: number;
  tapSpent: number;
  tapTotal: number;
  dublonenSpent: number;
  dublonenTotal: number;
}

/**
 * Baut einen NSC ausschliesslich ueber echte Mutationsfunktionen (setValue/addSelection/
 * buyWeapon/setWaffenPoolAllocation/applyNpcArmorPackage) auf - dieselben Funktionen, die auch
 * die UI verwendet. Damit ist das Ergebnis tatsaechlich "regelkonform" im Sinne der bestehenden
 * Validierung, nicht nur eine plausibel aussehende JSON-Struktur.
 */
/** Spezies -> Name ihrer "Heimat"-Waffenkammer in RoleStub.firearmSets (Default, falls kein
 *  firearmSet explizit übergeben wird - siehe RoleStub.firearmSets-Kommentar in roleStubs.ts). */
const HEIMAT_WAFFENKAMMER: Record<string, string> = {
  Goblins: 'Goblinisch', Zwerge: 'Zwergisch', Orks: 'Orkisch', Trolle: 'Trollisch',
};

/** kreis: "0".."7" (erste Stufe des Kreis) oder "1+".."7+" (mittlere Stufe, siehe KREIS_MID_EP). */
export function generateFromRoleStub(
  spezies: string, kreis: string, stub: RoleStub, options: { firearmSet?: string } = {},
): RoleGenerationResult {
  const ssk = SPEZIES_SSK[spezies];
  if (!ssk) throw new Error(`Keine SSK-Zuordnung für Spezies „${spezies}“ hinterlegt (roleStubs.ts).`);
  const ep = kreis.endsWith('+') ? KREIS_MID_EP[kreis.slice(0, -1)] : KREIS_START_EP[kreis];
  if (ep === undefined) throw new Error(`Kein Startwert für Kreis ${kreis} hinterlegt.`);

  let character = createCharacter(`${stub.label} (${spezies})`, { spezies }, 'normal', false, 'NSC');
  character = setValue(character, 'ep_gesamt', ep);
  character = setValue(character, ssk.kultur, stub.sskStufe);
  character = setValue(character, ssk.sprache, stub.sskStufe);

  // eigenschaftenSteigerung ist ein Delta über dem artspezifischen Minimum (das createCharacter
  // oben schon gesetzt hat), kein absoluter Wert - Minima unterscheiden sich stark je Spezies.
  // Bewusst NICHT "Eigenschaftsbonus" genannt (Nutzer-Korrektur 2026-09-12): das ist ein
  // bestehender Regel-Term (siehe src/data/rules-jsonl/eigenschaftsbonus.jsonl - der aus dem
  // Eigenschaftswert abgeleitete Bonus für Proben) und meint etwas anderes als dieses Stub-Feld.
  for (const [referenz, delta] of Object.entries(stub.eigenschaftenSteigerung)) {
    const basis = character.values[referenz] ?? 0;
    character = fitValue(character, referenz, basis + delta);
  }

  for (const { referenz, wert } of stub.fertigkeiten) {
    character = setValue(character, referenz, wert);
  }
  for (const talent of stub.talente) {
    character = addSelection(character, talent);
  }
  // Attribute (att_glueck/att_vitalitaet/...) nach den regulären Fertigkeiten, in der im Stub
  // hinterlegten Prioritätsreihenfolge - der erste Eintrag bekommt zuerst, was vom Budget übrig
  // bleibt (siehe RoleStub.attribute-Kommentar in roleStubs.ts).
  for (const { referenz, wert } of stub.attribute) {
    character = fitValue(character, referenz, wert);
  }

  for (const weapon of stub.weapons) {
    character = buyWeapon(
      character, weapon.sourceRow, weapon.materialSourceRow, weapon.fertigungSourceRow,
      weapon.anpassungSourceRow, weapon.schaftmaterialSourceRow,
    );
    const equipmentId = character.equipment[character.equipment.length - 1].id;
    character = fitPoolAllocation(character, weapon.poolReferenz, equipmentId, weapon.pool);
  }
  character = fitPoolAllocation(character, 'nk_pool_unbewaffnet_unbewaffnet', 'unbewaffnet', stub.unbewaffnetPool);

  // Feuerwaffen kommen aus der Waffenkammer des Standorts, nicht zwingend aus der Heimatkultur
  // der eigenen Spezies (siehe RoleStub.firearmSets) - Default ist die eigene Heimat-Waffenkammer,
  // per firearmSet explizit überschreibbar (z.B. ein Ork, dessen Garnison zwergisch bestückt ist).
  const firearmSetName = options.firearmSet ?? HEIMAT_WAFFENKAMMER[spezies];
  const firearms = firearmSetName ? stub.firearmSets[firearmSetName] : undefined;
  if (firearms) {
    character = buyFeuerwaffe(character, firearms.musketeSourceRow, {
      verarbeitungSourceRow: firearms.verarbeitungSourceRow, anpassungSourceRow: firearms.anpassungSourceRow,
    });
    character = buyFeuerwaffe(character, firearms.pistoleSourceRow, {
      verarbeitungSourceRow: firearms.verarbeitungSourceRow, anpassungSourceRow: firearms.anpassungSourceRow,
    });
    character = buyFeuerwaffenMunition(character, 'papierpatrone_vl', firearms.musketeKaliber, 100);
    if (firearms.pistoleKaliber !== firearms.musketeKaliber) {
      character = buyFeuerwaffenMunition(character, 'papierpatrone_vl', firearms.pistoleKaliber, 100);
    }
  }

  character = applyNpcArmorPackage(character, stub.armorPackageId);

  for (const trait of GESINNUNG_TRAITS) character.gesinnung[trait.key] = 0;

  const sheet = computeSheet(character);
  const issues = sheet.validationIssues.map((issue) => `${issue.source}: ${issue.message}`);
  return {
    character, issues,
    spSpent: sheet.spSpent, spTotal: sheet.spTotal,
    tapSpent: sheet.tapSpent, tapTotal: sheet.tapTotal,
    dublonenSpent: sheet.dublonenSpent, dublonenTotal: sheet.dublonenTotal,
  };
}
