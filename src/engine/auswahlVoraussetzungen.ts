import { RULES, type RuleEntry } from '../data/rules';
import type { CharacterState } from '../state/characterStore';

function flagValue(rule: RuleEntry, name: string): string | undefined {
  const prefix = `${name.toUpperCase()}=`;
  return rule.flag?.split('|')
    .map((part) => part.trim())
    .find((part) => part.toUpperCase().startsWith(prefix))
    ?.slice(prefix.length).trim();
}

export function getVoraussetzungReferenz(rule: RuleEntry): string | undefined {
  const value = flagValue(rule, 'VORAUSSETZUNG');
  return value && /^vn_[a-z0-9_]+$/i.test(value) ? value.toLowerCase() : undefined;
}

function wert(character: CharacterState, referenz: string): number {
  return character.values[referenz.toLowerCase()] ?? 0;
}

function voraussetzungLabel(referenz: string): string {
  return RULES.find((rule) => rule.referenz.toLowerCase() === referenz)?.beschreibung ?? referenz;
}

/** Wertet die redaktionell gepflegten VORAUSSETZUNG-Flags der Vor-/Nachteile aus. */
export function getAuswahlSperrgrund(rule: RuleEntry, character: CharacterState): string | undefined {
  const requirement = flagValue(rule, 'VORAUSSETZUNG');
  if (!requirement) return undefined;

  const directReference = getVoraussetzungReferenz(rule);
  if (directReference && (character.selections[directReference] ?? 0) <= 0) {
    return `Erfordert zuerst „${voraussetzungLabel(directReference)}“`;
  }

  if (/^Magie\s+0$/i.test(requirement) && wert(character, 'att_magie') !== 0) {
    return 'Erfordert Magie 0';
  }
  if (/^Aura\s+1$/i.test(requirement) && wert(character, 'att_aura') < 1) {
    return 'Erfordert Aura 1';
  }

  const ausComparison = /^AUS\s*(<=|>=)\s*(\d+)$/i.exec(requirement);
  if (ausComparison) {
    const current = wert(character, 'eig_k_ausstrahlung');
    const limit = Number(ausComparison[2]);
    const fulfilled = ausComparison[1] === '<=' ? current <= limit : current >= limit;
    if (!fulfilled) return `Erfordert AUS ${ausComparison[1]} ${limit}`;
  }

  if (/^AUS\s+15;\s*INT\s+15;\s*\[Sprache\]\s+1$/i.test(requirement)) {
    if (wert(character, 'eig_k_ausstrahlung') < 15) return 'Erfordert AUS 15';
    if (wert(character, 'eig_g_intelligenz') < 15) return 'Erfordert INT 15';
    const hasLanguage = Object.entries(character.values)
      .some(([reference, value]) => reference.startsWith('ssk_sprache_') && value >= 1);
    if (!hasLanguage) return 'Erfordert Grundkenntnisse in mindestens einer Sprache (Stufe 1)';
  }

  return undefined;
}

export function getWertSperrgrund(rule: RuleEntry, character: CharacterState): string | undefined {
  const advantageReference = flagValue(rule, 'VORAUSSETZUNG_VORTEIL')?.toLowerCase();
  if (!advantageReference || (character.selections[advantageReference] ?? 0) > 0) return undefined;
  return `Erfordert den Vorteil „${voraussetzungLabel(advantageReference)}“`;
}

export function getAuswahlKosten(rule: RuleEntry, character: CharacterState, normalCost: number): number {
  const blindCost = Number(flagValue(rule, 'KOSTEN_MIT_BLINDHEIT'));
  if (Number.isFinite(blindCost) && (character.selections.vn_sicht_blindheit ?? 0) > 0) return blindCost;
  return normalCost;
}

export function getExklusivgruppe(rule: RuleEntry): string | undefined {
  const match = rule.flag?.match(/(?:^|\|)\s*(EXKLUSIV_(?:KURZ|WEIT)SICHTIGKEIT)=([^|]+)/i);
  return match ? `${match[1].toUpperCase()}=${match[2].trim().toLowerCase()}` : undefined;
}

export function getFreigeschalteteWertReferenz(rule: RuleEntry): string | undefined {
  return flagValue(rule, 'SCHALTET_GRUNDFERTIGKEIT_FREI')?.toLowerCase();
}

/** Entfernt rekursiv Auswahlen, deren direkte Vorteils-Voraussetzung nicht mehr vorhanden ist. */
export function removeAbhaengigeAuswahlen(character: CharacterState): void {
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of RULES) {
      const key = rule.referenz.toLowerCase();
      if ((character.selections[key] ?? 0) <= 0) continue;
      const prerequisite = getVoraussetzungReferenz(rule);
      if (prerequisite && (character.selections[prerequisite] ?? 0) <= 0) {
        delete character.selections[key];
        const unlockedValue = getFreigeschalteteWertReferenz(rule);
        if (unlockedValue) delete character.values[unlockedValue];
        changed = true;
      }
    }
  }
}
