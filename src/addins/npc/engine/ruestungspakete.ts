import draft from '../data/ruestungspakete.draft.json';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG, type GenericRow } from '../../../data/equipment/armor';
import { composeArmor, computeRbe } from '../../../engine/armorComposition';
import { makeValueSource } from '../../../engine/characterSheet';
import { evalReferenz } from '../../../engine/rules';
import { getFertigkeitBaseMax } from '../../../engine/fertigkeitenGrenzen';
import { getTalentMaximumBonus } from '../../../engine/talenteMaximum';
import type { CharacterState, RuestungSlotEntry } from '../../../state/characterStore';
import type { RsGruppe } from '../../../data/trefferzonen';

export const NPC_ARMOR_PACKAGES = draft.pakete;
const ZONES: RsGruppe[] = ['kopf', 'torso', 'arme', 'beine'];
const RM = 'sf_ruestungsmanoever';
export type NpcArmorOverrides = Record<string, { basisSourceRow?: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>;

function catalogRow(rows: GenericRow[], name: string): GenericRow {
  const row = rows.find((entry) => entry.name === name);
  if (!row) throw new Error(`Rüstungseintrag „${name}“ fehlt im Katalog.`);
  return row;
}

function composeSlot(basisName: string, verarbeitungName: string, anpassungName: string) {
  const basis = catalogRow(RUESTUNG_BASIS, basisName);
  const verarbeitung = catalogRow(RUESTUNG_VERARBEITUNG, verarbeitungName);
  const anpassung = catalogRow(RUESTUNG_ANPASSUNG, anpassungName);
  const stats = composeArmor(basis, verarbeitung, anpassung);
  const slot: RuestungSlotEntry = {
    basisSourceRow: basis.sourceRow,
    verarbeitungSourceRow: verarbeitung.sourceRow,
    anpassungSourceRow: anpassung.sourceRow,
    computedPriceSnapshot: stats.preis,
    computedStatsSnapshot: { rs: stats.rs, rh: stats.rh, verfuegbarkeitNw: stats.verfuegbarkeitNw, verfuegbarkeitAw: stats.verfuegbarkeitAw },
  };
  return { lage: Number(basis.Lage), slot };
}

export function inspectNpcArmor(character: CharacterState) {
  const source = makeValueSource(character);
  const kon = Number(evalReferenz('eig_k_konstitution', source));
  const staerke = Number(evalReferenz('eig_k_staerke', source));
  const rm = Number(evalReferenz(RM, source));
  const rh = source.getRhGesamt!();
  const rbe = computeRbe(rh, kon, staerke, rm);
  const maxBe = character.npcArmorMaxBe ?? 3;
  let minimumRm = 0;
  // Den vorhandenen Modellrechner bis zur ersten tatsächlich behinderungsfreien Stufe prüfen.
  while (minimumRm <= Math.ceil(rh) && computeRbe(rh, kon, staerke, minimumRm) > maxBe) minimumRm++;
  const maximumRm = getFertigkeitBaseMax('Sonderfertigkeit')! + getTalentMaximumBonus(character, RM, 'Sonderfertigkeit');
  const requiredAttributeContribution = Math.max(0, rh - maximumRm - 6 * maxBe);
  return {
    kon, staerke, requiredAttributeContribution, attributeContribution: (kon / 5 + staerke) / 2,
    requiredStrengthAtCurrentKon: Math.max(0, Math.ceil(2 * requiredAttributeContribution - kon / 5)),
    maxBe, rh, rbe, be: Number(evalReferenz('gewichtsbelastung', source)), rm, minimumRm,
    maximumRm: getFertigkeitBaseMax('Sonderfertigkeit')! + getTalentMaximumBonus(character, RM, 'Sonderfertigkeit'),
    preis: Object.values(character.ruestungSlots).reduce((sum, slot) => sum + slot.computedPriceSnapshot, 0),
    zonen: ZONES.map((zone) => ({ zone, rs: source.getRsGruppe!(zone), lagen: Object.keys(character.ruestungSlots)
      .filter((key) => key.startsWith(`${zone}:`)).map((key) => Number(key.split(':')[1])).sort() })),
  };
}

/** Reine Vorschau: Finanzierungslücken bleiben sichtbar, Budgets/Talente werden nicht erweitert. */
export function applyNpcArmorPackage(character: CharacterState, packageId: string, kopfschutz = false, overrides: NpcArmorOverrides = {}): CharacterState {
  const paket = NPC_ARMOR_PACKAGES.find((entry) => entry.id === packageId);
  if (packageId && !paket) throw new Error('Bitte ein vorhandenes Rüstungspaket wählen.');
  const candidate = structuredClone(character);
  if (paket) {
    candidate.ruestungSlots = {};
    candidate.npcArmorMaxBe ??= 3;
  }
  for (const part of paket?.teile ?? []) {
    const { lage, slot } = composeSlot(part.basis, part.verarbeitung, part.anpassung);
    for (const zone of part.zonen) {
      if (!ZONES.includes(zone as RsGruppe)) throw new Error(`Unbekannte Rüstungszone „${zone}“.`);
      candidate.ruestungSlots[`${zone}:${lage}`] = structuredClone(slot);
    }
  }
  if (kopfschutz && paket && !candidate.ruestungSlots['kopf:4']) {
    candidate.ruestungSlots['kopf:4'] = composeSlot('Lederpanzer', 'Gesellenarbeit', 'von der Stange').slot;
  }
  for (const [key, override] of Object.entries(overrides)) {
    const previous = candidate.ruestungSlots[key];
    if (!previous) throw new Error(`Rüstungsplatz „${key}“ ist nicht belegt.`);
    const basis = RUESTUNG_BASIS.find((row) => row.sourceRow === (override.basisSourceRow ?? previous.basisSourceRow));
    const verarbeitung = RUESTUNG_VERARBEITUNG.find((row) => row.sourceRow === override.verarbeitungSourceRow);
    const anpassung = RUESTUNG_ANPASSUNG.find((row) => row.sourceRow === override.anpassungSourceRow);
    if (!basis || Number(basis.Lage) !== Number(key.split(':')[1]) || !verarbeitung || !anpassung) throw new Error('Die gewählte Rüstungskombination existiert nicht.');
    if (packageId === 'vollgeruestet' && !['angepasst', 'perfekt angepasst'].includes(anpassung.name)) throw new Error('Vollgerüstet benötigt jedes Teil angepasst oder perfekt angepasst.');
    candidate.ruestungSlots[key] = composeSlot(basis.name, verarbeitung.name, anpassung.name).slot;
  }
  const previousRm = candidate.values[RM] ?? 0;
  candidate.values[RM] = packageId === 'vollgeruestet'
    ? Math.max(previousRm, inspectNpcArmor(candidate).maximumRm)
    : Math.max(previousRm, inspectNpcArmor(candidate).minimumRm);
  candidate.notes += `\nRüstung: ${paket?.name ?? 'Vorlagenrüstung mit geänderten Teilen/Fertigung/Anpassung'}${kopfschutz && paket ? '; zusätzlicher Lederpanzer am Kopf' : ''}.`
    + ` Rüstungsmanöver ${previousRm} → ${candidate.values[RM]}; Ziel: höchstens ${candidate.npcArmorMaxBe ?? 3} BE aus Rüstung.`;
  return candidate;
}
