// Rechnet Vorschläge mit dem bestehenden Clientmodell; verändert keine Referenzcharaktere.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const target = (name) => new URL(`../docs/${name}`, import.meta.url);
const draft = JSON.parse(readFileSync(new URL('../data/ruestungspakete.draft.json', import.meta.url), 'utf8'));
const server = await createServer({
  root, configFile: false, appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
});

try {
  const load = (path) => server.ssrLoadModule(`/src/${path}.ts`);
  const { NPC_TEMPLATES } = await load('addins/npc/data/npcTemplates');
  const { computeSheet, makeValueSource } = await load('engine/characterSheet');
  const { evalReferenz } = await load('engine/rules');
  const { composeArmor, computeRbe } = await load('engine/armorComposition');
  const { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } = await load('data/equipment/armor');
  const { getFertigkeitBaseMax } = await load('engine/fertigkeitenGrenzen');
  const { getTalentMaximumBonus } = await load('engine/talenteMaximum');
  const { equipRuestung, setValue } = await load('state/characterMutations');
  const { buildNahkampfRows } = await load('views/kampf');
  const original = JSON.stringify(NPC_TEMPLATES);
  const zones = ['kopf', 'torso', 'arme', 'beine'];
  const rmRef = 'sf_ruestungsmanoever';
  const number = (value) => Number(value.toFixed(6));
  const fmt = (value) => number(value).toLocaleString('de-DE', { maximumFractionDigits: 6 });
  const getRow = (rows, name) => {
    const found = rows.filter((row) => row.name === name);
    assert.equal(found.length, 1, `Katalogeintrag nicht eindeutig: ${name}`);
    return found[0];
  };
  function inspect(character) {
    const source = makeValueSource(character);
    const kon = Number(evalReferenz('eig_k_konstitution', source));
    const staerke = Number(evalReferenz('eig_k_staerke', source));
    const rm = Number(evalReferenz(rmRef, source));
    const rh = source.getRhGesamt();
    const raw = computeRbe(rh, kon, staerke, rm);
    const be = Number(evalReferenz('gewichtsbelastung', source));
    assert(Number.isFinite(raw) && raw >= 0);
    assert.equal(be, Math.ceil(raw), 'Gerundete Modell-BE muss zur Roh-RBE passen');
    const sheet = computeSheet(character);
    return {
      rh, kon, staerke, rm, rbe: raw, be,
      rs: Object.fromEntries(zones.map((zone) => [zone, source.getRsGruppe(zone)])),
      rmMaximum: getFertigkeitBaseMax('Sonderfertigkeit') + getTalentMaximumBonus(character, rmRef, 'Sonderfertigkeit'),
      sp: { gesamt: sheet.spTotal, ausgaben: sheet.spSpent, rest: sheet.spRemaining },
      tap: { gesamt: sheet.tapTotal, ausgaben: sheet.tapSpent, rest: sheet.tapRemaining },
      geld: { gesamt: sheet.dublonenTotal, ausgaben: sheet.dublonenSpent, rest: sheet.dublonenRemaining },
      fehler: sheet.validationIssues,
      ungueltigeNahkampfpools: buildNahkampfRows(character, sheet).filter((row) => !row.poolValid).map((row) => row.label),
    };
  }

  const pakete = draft.pakete.map((paket) => {
    const slots = {};
    const teile = paket.teile.map((part) => {
      const basis = getRow(RUESTUNG_BASIS, part.basis);
      const verarbeitung = getRow(RUESTUNG_VERARBEITUNG, part.verarbeitung);
      const anpassung = getRow(RUESTUNG_ANPASSUNG, part.anpassung);
      const stats = composeArmor(basis, verarbeitung, anpassung);
      const lage = Number(basis.Lage);
      for (const zone of part.zonen) {
        assert(zones.includes(zone));
        const key = `${zone}:${lage}`;
        assert(!slots[key], `Doppelter Slot ${key}`);
        slots[key] = {
          basisSourceRow: basis.sourceRow, verarbeitungSourceRow: verarbeitung.sourceRow,
          anpassungSourceRow: anpassung.sourceRow, computedPriceSnapshot: stats.preis,
          computedStatsSnapshot: { rs: stats.rs, rh: stats.rh, verfuegbarkeitNw: stats.verfuegbarkeitNw, verfuegbarkeitAw: stats.verfuegbarkeitAw },
        };
      }
      return { ...part, lage, basisSourceRow: basis.sourceRow, verarbeitungSourceRow: verarbeitung.sourceRow, anpassungSourceRow: anpassung.sourceRow, ...stats };
    });
    for (const zone of zones) for (const lage of [1, 2]) assert(slots[`${zone}:${lage}`]);
    return { id: paket.id, name: paket.name, teile, slots,
      preis: teile.reduce((sum, part) => sum + part.preis * part.zonen.length, 0),
      rh: teile.reduce((sum, part) => sum + part.rh * part.zonen.length, 0),
    };
  });

  for (const template of NPC_TEMPLATES) for (const slot of Object.values(template.character.ruestungSlots)) {
    const stats = composeArmor(
      RUESTUNG_BASIS.find((row) => row.sourceRow === slot.basisSourceRow),
      RUESTUNG_VERARBEITUNG.find((row) => row.sourceRow === slot.verarbeitungSourceRow),
      RUESTUNG_ANPASSUNG.find((row) => row.sourceRow === slot.anpassungSourceRow),
    );
    assert.equal(slot.computedPriceSnapshot, stats.preis, 'Referenzpreis weicht vom aktuellen Katalog ab');
    assert.equal(slot.computedStatsSnapshot.rh, stats.rh, 'Referenz-RH weicht vom aktuellen Katalog ab');
    assert.equal(slot.computedStatsSnapshot.rs, stats.rs, 'Referenz-RS weicht vom aktuellen Katalog ab');
  }
  const referenzen = NPC_TEMPLATES.map((template) => ({ id: template.id, name: template.label, ...inspect(template.character) }));
  const gegenproben = [];
  for (const paket of pakete) for (const template of NPC_TEMPLATES) {
    const vorher = referenzen.find((entry) => entry.id === template.id);
    const candidate = structuredClone(template.character);
    // Analysezustand: Budgetüberschreitungen werden gemessen, weder ausgeblendet noch finanziert.
    candidate.ruestungSlots = structuredClone(paket.slots);
    let minimalRm = 0;
    while (computeRbe(paket.rh, vorher.kon, vorher.staerke, minimalRm) > 0) minimalRm++;
    candidate.values[rmRef] = Math.max(vorher.rm, minimalRm);
    const nachher = inspect(candidate);
    assert.equal(nachher.rbe, 0);
    if (minimalRm > 0) assert(computeRbe(paket.rh, vorher.kon, vorher.staerke, minimalRm - 1) > 0);
    const welt = candidate.herkunftSnapshot?.welt;
    const verfuegbarkeit = Math.max(...paket.teile.map((part) => welt === 'AW' ? part.verfuegbarkeitAw : part.verfuegbarkeitNw));
    const kaufbar = verfuegbarkeit < 5; // Vorschläge sollen ohne Altcharakter-Ausnahme funktionieren.
    const budgetOk = nachher.sp.rest >= 0 && nachher.tap.rest >= 0 && nachher.geld.rest >= 0;
    const sonstigeFehler = nachher.fehler.filter((issue) => !['SP-Budget', 'TaP-Budget', 'Dublonen-Budget'].includes(issue.source));
    const regelOk = nachher.rm <= nachher.rmMaximum && sonstigeFehler.length === 0 && nachher.ungueltigeNahkampfpools.length === 0;
    let mutationsGeprueft = false;
    if (budgetOk && regelOk && kaufbar) {
      let actual = structuredClone(template.character);
      actual.ruestungSlots = {};
      actual = setValue(actual, rmRef, candidate.values[rmRef]);
      for (const [key, slot] of Object.entries(paket.slots)) {
        const [zone, lage] = key.split(':');
        actual = equipRuestung(actual, zone, Number(lage), slot.basisSourceRow, slot.verarbeitungSourceRow, slot.anpassungSourceRow);
      }
      assert.deepEqual(inspect(actual), nachher);
      assert.deepEqual(inspect(JSON.parse(JSON.stringify(actual))), nachher);
      mutationsGeprueft = true;
    }
    gegenproben.push({ paket: paket.id, referenz: template.id, minimalRm, vorher, nachher,
      mehrSp: nachher.sp.ausgaben - vorher.sp.ausgaben,
      mehrGeld: number(nachher.geld.ausgaben - vorher.geld.ausgaben),
      budgetOk, regelOk, kaufbar, mutationsGeprueft,
    });
  }
  // Optionaler Lage-4-Kopfschutz: eigener Gegencheck, kein stilles Ergänzen der Grundpakete.
  const helmBasis = getRow(RUESTUNG_BASIS, 'Lederpanzer');
  const helmVerarbeitung = getRow(RUESTUNG_VERARBEITUNG, 'Gesellenarbeit');
  const helmAnpassung = getRow(RUESTUNG_ANPASSUNG, 'von der Stange');
  const helmStats = composeArmor(helmBasis, helmVerarbeitung, helmAnpassung);
  const kopfschutz = [];
  for (const paket of pakete.filter((entry) => entry.id.startsWith('nahkaempfer'))) {
    const template = NPC_TEMPLATES.find((entry) => entry.id === 'nahkaempfer');
    const candidate = structuredClone(template.character);
    candidate.ruestungSlots = structuredClone(paket.slots);
    candidate.ruestungSlots['kopf:4'] = {
      basisSourceRow: helmBasis.sourceRow, verarbeitungSourceRow: helmVerarbeitung.sourceRow,
      anpassungSourceRow: helmAnpassung.sourceRow, computedPriceSnapshot: helmStats.preis,
      computedStatsSnapshot: { rs: helmStats.rs, rh: helmStats.rh, verfuegbarkeitNw: helmStats.verfuegbarkeitNw, verfuegbarkeitAw: helmStats.verfuegbarkeitAw },
    };
    const vorAusbildung = inspect(candidate);
    while (inspect(candidate).rbe > 0) candidate.values[rmRef]++;
    const nachAusbildung = inspect(candidate);
    assert.equal(nachAusbildung.be, 0);
    kopfschutz.push({ paket: paket.id, referenz: template.id, teil: 'Lederpanzer am Kopf, Gesellenarbeit, von der Stange',
      preis: helmStats.preis, rh: helmStats.rh, vorAusbildung, nachAusbildung });
  }
  assert.equal(JSON.stringify(NPC_TEMPLATES), original);
  const bericht = { status: draft.status, pakete, referenzen, gegenproben, kopfschutz };
  writeFileSync(target('Ruestungspakete-Pruefdaten.json'), `${JSON.stringify(bericht, null, 2)}\n`);

  const lines = [
    '# Rüstungspakete: konkrete Ausarbeitung und Modellprüfung', '',
    'Reproduzierbar mit `node src/addins/npc/scripts/ruestungspakete.mjs`. Quelle: aktive Rüstungskataloge und bestehende Clientberechnung. Die Pakete sind Vorschläge zur Umsetzung der bestätigten Abdeckung; Material, Güte und Anpassung wurden für diese Gegenprobe gewählt.', '',
    'Alle Pakete enthalten Stoff und Leder auf Kopf, Torso, Armen und Beinen. Arme und Beine werden entsprechend dem Modell jeweils als gemeinsame TZ-Gruppe berechnet, nicht pro Gliedmaße doppelt. RS in der Tabelle sind Gruppenwerte; die bestehende Trefferzonenregel für halben Schutz bzw. ungeschützte Augen bleibt bestehen.', '',
    'Gesellenarbeit ist reguläre Verarbeitung. Leichte Stoffrüstung von der Stange erreicht bereits Mindest-RH 1; zusätzliche Anpassung hätte hier keinen RH-Nutzen. Leichte Lederrüstung und Eisenkette werden im Hauptvorschlag angepasst, um Mindest-RH 2 bzw. 3 zu erreichen. Meisterarbeit erhöht RS, senkt laut Katalog aber nicht die RH. Lederpanzer erreicht bereits von der Stange Mindest-RH 4.', '',
    '## Ausstattung und Preise', '',
    '| Paket | Rüstungskosten D | RH gesamt | RS Kopf / Torso / Arme / Beine |', '|---|---:|---:|---|',
    ...pakete.map((paket) => {
      const row = gegenproben.find((entry) => entry.paket === paket.id);
      return `| ${paket.name} | ${fmt(paket.preis)} | ${paket.rh} | ${zones.map((zone) => row.nachher.rs[zone]).join(' / ')} |`;
    }), '',
    ...pakete.flatMap((paket) => [
      `### ${paket.name}`, '',
      '| Lage | Katalogteil | TZ-Gruppen | Verarbeitung / Anpassung | RS / RH je Gruppe | Preis je Gruppe D | Summe D |',
      '|---:|---|---|---|---|---:|---:|',
      ...paket.teile.map((part) => `| ${part.lage} | ${part.basis} | ${part.zonen.join(', ')} | ${part.verarbeitung} / ${part.anpassung} | ${part.rs} / ${part.rh} | ${fmt(part.preis)} | ${fmt(part.preis * part.zonen.length)} |`), '',
    ]),
    '## Vollständige Gegenproben', '',
    'Die sechs vollständigen Goblin-Referenzen dienen als unveränderte Vergleichsgrundlage. Für den Handwerker wird insbesondere der Bauer als körperliche und finanzielle Zivilistenreferenz geprüft; er wird dadurch nicht zu einem fertig ausgebildeten Handwerker. Es gibt bislang keine vollständige Handwerkerreferenz. Die Ergebnisse sind nicht ungeprüft auf andere Völker übertragbar.', '',
    'Nur die Rüstung wird in einer Kopie ersetzt; Rüstungsmanöver wird bei Bedarf bis zum kleinsten ganzzahligen Null-RBE-Wert erhöht. Höhere vorhandene Ausbildung bleibt erhalten. Eigenschaften, Talente, Berufs- und Waffenfertigkeiten, übrige Ausrüstung und Budgets bleiben unverändert. Sämtliche Kosten werden vollständig neu berechnet. Die Geldprüfung bezieht sich auf die gespeicherten Referenzen einschließlich ihrer bisherigen Kleidung; eine erneute Ergänzung der Grundkleidung ist hier nicht enthalten.', '',
    '| Paket | Referenz | RM mindestens / eingesetzt / Maximum | Mehr-SP | Geldrest D | SP-Rest | BE aus Rüstung | Gesamtprüfung |',
    '|---|---|---|---:|---:|---:|---:|---|',
    ...gegenproben.map((entry) => `| ${entry.paket} | ${entry.referenz} | ${entry.minimalRm} / ${entry.nachher.rm} / ${entry.nachher.rmMaximum} | ${fmt(entry.mehrSp)} | ${fmt(entry.nachher.geld.rest)} | ${fmt(entry.nachher.sp.rest)} | ${entry.nachher.be} | ${entry.mutationsGeprueft ? 'Bestanden' : [!entry.budgetOk ? 'Budget reicht nicht' : '', !entry.regelOk ? 'Regel-/Maximumprüfung nicht bestanden' : '', !entry.kaufbar ? 'Nicht regulär kaufbar' : ''].filter(Boolean).join('; ')} |`), '',
    'Negative Reste sind Finanzierungslücken, kein erlaubtes Startbudget. Eine reine Null-RBE-Probe mit Budget- oder Talentüberschreitung ist kein fertiger Charakter. Bestandene Varianten wurden zusätzlich über die echten Kauf-/Steigerungsfunktionen aufgebaut und nach JSON-Rücklesen erneut berechnet. Referenzen und gespeicherte Charaktere wurden nicht verändert.', '',
    '## Ergebnis für die beiden Grundpakete', '',
    ...gegenproben.filter((entry) => (entry.referenz === 'bauer' && entry.paket === 'handwerker') || (entry.referenz === 'nahkaempfer' && entry.paket.startsWith('nahkaempfer'))).map((entry) => {
      const paket = pakete.find((item) => item.id === entry.paket);
      const fehlendesGeld = Math.ceil(Math.max(0, -entry.nachher.geld.rest) * 100) / 100;
      return `- **${paket.name}**, geprüft auf ${entry.referenz}: ${fmt(paket.preis)} D Rüstung, Rüstungsmanöver mindestens ${entry.minimalRm}. ${entry.mutationsGeprueft ? `Passt ohne zusätzliche SP/TaP ins vorhandene Budget; ${fmt(Math.floor(entry.nachher.geld.rest * 100) / 100)} D bleiben übrig.` : `Bei sonst unveränderter Referenz fehlen ${fmt(Math.max(0, -entry.nachher.sp.rest))} SP und ${fmt(fehlendesGeld)} D (auf Cent aufgerundet).`}`;
    }), '',
    'Das Handwerkerpaket benötigt bei Konstitution 13/Stärke 15 insgesamt Rüstungsmanöver 4 = 36 SP. Beim neu aufgebauten Berufsbaustein sind diese 36 SP und 240 D vor der übrigen Ausstattung zu reservieren. Der bestehende Bauer hat bereits 27 SP in Rüstungsmanöver bezahlt; daher beträgt seine zusätzliche Lücke 9 SP. Das ist noch kein Nachweis eines vollständig finanzierten neuen Handwerkers.', '',
    'Die günstigere Handwerkervariante spart 48 D Anschaffung, benötigt aber vier zusätzliche Punkte Rüstungsmanöver (= 36 SP mehr als das angepasste Paket). Das ist ein konkreter Geld-/Ausbildungs-Kompromiss, keine pauschal bessere Variante.', '',
    '## Optionaler Kopfschutz für den Nahkämpfer', '',
    'Zusätzlich ein Lederpanzer am Kopf, Gesellenarbeit, von der Stange: 148 D, RS +4 am Kopf und RH +4. Gegenprobe auf dem bestehenden Nahkämpfer mit Konstitution 13/Stärke 17 und Rüstungsmanöver 14:', '',
    '| Grundpaket | RH mit Kopfschutz | BE mit bisheriger Ausbildung | RM für BE 0 | Vorhandenes RM-Maximum | Zusätzliche SP für RM |',
    '|---|---:|---:|---:|---:|---:|',
    ...kopfschutz.map((entry) => `| ${entry.paket} | ${entry.vorAusbildung.rh} | ${entry.vorAusbildung.be} | ${entry.nachAusbildung.rm} | ${entry.nachAusbildung.rmMaximum} | ${(entry.nachAusbildung.rm - entry.vorAusbildung.rm) * 9} |`), '',
    'Beide Kopfvarianten überschreiten das vorhandene Rüstungsmanöver-Maximum 16. Neben den SP wären weitere passende Talentfreischaltungen und deren TaP einzuplanen. Die theoretisch errechneten Null-BE-Zustände sind deshalb nicht als bestanden ausgewiesen. Der optionale Kopfschutz wird nicht in das budgetgeprüfte Grundpaket aufgenommen.', '',
    '## Bekannte Grenzen', '',
    '- Geprüft sind Rüstung, RBE-Rundung, vollständige SP-/TaP-/Geldberechnung, Rüstungsmanöver-Maximum, Katalogverfügbarkeit, zentrale Validierung und die bestehende Nahkampfpoolprüfung. Dies ist keine vollständige erneute Prüfung aller Waffen-/Magieinteraktionen der historischen Charaktere.',
    '- Die zentrale Berechnung meldet weiterhin die bereits vorhandene, nicht ausführbare Textformel `ep_verbraucht`. Die hier verwendeten SP-Ausgaben werden separat durch `computeSheet` berechnet. Die Gegenprobe behauptet keine Fehlerfreiheit aller Modellformeln.',
    '- Noch keine automatische Rüstungsvergabe im Assistenten. Die Daten sind wiederverwendbare Paketvorschläge und enthalten keine neue Regelberechnung.', '',
  ];
  writeFileSync(target('Ruestungspakete-Pruefung.md'), `${lines.join('\n').trimEnd()}\n`);
  console.log(JSON.stringify({ pakete: pakete.map(({ id, preis, rh }) => ({ id, preis, rh })),
    hauptproben: gegenproben.filter((entry) => (entry.referenz === 'bauer' && entry.paket.startsWith('handwerker')) || (entry.referenz === 'nahkaempfer' && entry.paket.startsWith('nahkaempfer'))).map((entry) => ({ paket: entry.paket, referenz: entry.referenz, minimalRm: entry.minimalRm, mehrSp: entry.mehrSp, geldrest: number(entry.nachher.geld.rest), be: entry.nachher.be, bestanden: entry.mutationsGeprueft })),
    gegenproben: gegenproben.length, bestanden: gegenproben.filter((entry) => entry.mutationsGeprueft).length,
  }, null, 2));
} finally {
  await server.close();
}
