// Ort-Dropdown fuer besessene Artefakte (Nutzer-Ask 2026-09-16): reine Notiz, WELCHE Koerperzone
// ein Artefakt getragen wird (z.B. Ring am linken Ringfinger). KEINE Wirkungs-Logik hier - eine
// eventuelle "Artefakt wirkt nicht mehr, wenn die Zone verloren geht"-Regel baut der Nutzer separat
// in Foundry VTT (siehe project_nasus_foundry_vtt_handover.md). Liste abgeleitet aus den 7
// Haupt-Trefferzonen, ohne Unterpunkte an denen realistisch nichts getragen werden kann
// (Ellenbogen/Knie ausgeschlossen - keine ueblichen Trage-Slots) und ohne Finger-Aufschluesselung
// (Nutzer-Entscheidung: "Hand" reicht, keine Slot-Beschraenkung sowieso).
export interface ArtefaktOrt {
  value: string;
  label: string;
  gruppe: string;
}

export const ARTEFAKT_ORTE: ArtefaktOrt[] = [
  { value: 'kopf_auge', label: 'Auge', gruppe: 'Kopf' },
  { value: 'kopf_hals', label: 'Hals', gruppe: 'Kopf' },
  { value: 'kopf_zahnimplantat', label: 'Zahnimplantat', gruppe: 'Kopf' },
  { value: 'kopf_rest', label: 'Kopf (Rest)', gruppe: 'Kopf' },

  { value: 'brust_herz_lunge', label: 'Herz und/oder Lunge', gruppe: 'Brust' },
  { value: 'brust_schulter_links', label: 'Linkes Schultergelenk', gruppe: 'Brust' },
  { value: 'brust_schulter_rechts', label: 'Rechtes Schultergelenk', gruppe: 'Brust' },
  { value: 'brust_rest', label: 'Brust (Rest)', gruppe: 'Brust' },

  { value: 'unterleib_organ', label: 'Organ', gruppe: 'Unterleib' },
  { value: 'unterleib_rest', label: 'Unterleib (Rest)', gruppe: 'Unterleib' },

  { value: 'arm_rechts_hand', label: 'Rechte Hand', gruppe: 'Rechter Arm' },
  { value: 'arm_rechts_rest', label: 'Rechter Arm (Rest)', gruppe: 'Rechter Arm' },

  { value: 'arm_links_hand', label: 'Linke Hand', gruppe: 'Linker Arm' },
  { value: 'arm_links_rest', label: 'Linker Arm (Rest)', gruppe: 'Linker Arm' },

  { value: 'bein_rechts_fuss', label: 'Rechter Fuß', gruppe: 'Rechtes Bein' },
  { value: 'bein_rechts_rest', label: 'Rechtes Bein (Rest)', gruppe: 'Rechtes Bein' },

  { value: 'bein_links_fuss', label: 'Linker Fuß', gruppe: 'Linkes Bein' },
  { value: 'bein_links_rest', label: 'Linkes Bein (Rest)', gruppe: 'Linkes Bein' },
];

export function artefaktOrtLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return ARTEFAKT_ORTE.find((o) => o.value === value)?.label;
}
