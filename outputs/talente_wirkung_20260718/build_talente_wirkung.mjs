import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workspace = "E:/Das Western Rollenspiel/LLM";
const npcPath = path.join(workspace, "NN NPC-Rechner 0.76.xlsx");
const wertePath = path.join(workspace, "werte 0.8-claude.xlsx");
const outputPath = path.join(workspace, "Talente-Wirkung-chatgpt.xlsx");
const workDir = path.join(workspace, "outputs/talente_wirkung_20260718");
const mode = process.argv[2] ?? "inspect";

await fs.mkdir(workDir, { recursive: true });
const npcWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(npcPath));
const werteWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(wertePath));

if (mode === "help_delete") {
  console.log(npcWorkbook.help("worksheet.*", { search: "delete|remove|copy", include: "index,examples,notes", maxChars: 6000 }).ndjson);
}

function columnName(index) {
  let n = index + 1;
  let result = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
}

if (mode === "inspect") {
  const talentSheet = npcWorkbook.worksheets.getItem("Talente");
  const talentUsed = talentSheet.getUsedRange();
  const talentValues = talentUsed?.values ?? [];
  const talentFormulas = talentUsed?.formulas ?? [];
  const werteSheet = werteWorkbook.worksheets.getItem("Werte");
  const werteValues = werteSheet.getUsedRange()?.values ?? [];
  const werteHeaders = (werteValues[0] ?? []).map((value) => String(value ?? "").trim());
  const categoryCol = werteHeaders.findIndex((header) => header.toLocaleLowerCase("de-DE") === "kategorie");
  const refCol = werteHeaders.findIndex((header) => header.toLocaleLowerCase("de-DE") === "referenz");
  const descriptionCol = werteHeaders.findIndex((header) => header.toLocaleLowerCase("de-DE") === "beschreibung");
  const parentCol = werteHeaders.findIndex((header) => header.toLocaleLowerCase("de-DE") === "parent");
  const flagCol = werteHeaders.findIndex((header) => header.toLocaleLowerCase("de-DE") === "flag");
  const costCol = werteHeaders.findIndex((header) => header.toLocaleLowerCase("de-DE") === "kosten");
  const talentReferences = werteValues.slice(1)
    .map((row, index) => ({
      excelRow: index + 2,
      reference: row[refCol] ?? null,
      category: row[categoryCol] ?? null,
      description: row[descriptionCol] ?? null,
      parent: row[parentCol] ?? null,
      flag: row[flagCol] ?? null,
      cost: row[costCol] ?? null,
      row,
    }))
    .filter((record) => record.category === "Talente" || String(record.reference ?? "").startsWith("talente_"));

  await fs.writeFile(path.join(workDir, "talente_source.json"), JSON.stringify({
    address: talentUsed?.address ?? null,
    values: talentValues,
    formulas: talentFormulas,
  }, null, 2), "utf8");
  await fs.writeFile(path.join(workDir, "werte_talente.json"), JSON.stringify({ headers: werteHeaders, records: talentReferences }, null, 2), "utf8");

  const rowCount = talentValues.length;
  const colCount = Math.max(0, ...talentValues.map((row) => row.length));
  for (let rowStart = 0; rowStart < rowCount; rowStart += 120) {
    const rowEnd = Math.min(rowCount, rowStart + 120);
    for (let colStart = 0; colStart < colCount; colStart += 12) {
      const colEnd = Math.min(colCount, colStart + 12);
      const range = `${columnName(colStart)}${rowStart + 1}:${columnName(colEnd - 1)}${rowEnd}`;
      const preview = await npcWorkbook.render({ sheetName: "Talente", range, scale: 0.9, format: "png" });
      await fs.writeFile(path.join(workDir, `source_Talente_r${rowStart + 1}-${rowEnd}_c${colStart + 1}-${colEnd}.png`), new Uint8Array(await preview.arrayBuffer()));
    }
  }

  const sourceSummary = await npcWorkbook.inspect({ kind: "sheet,table", sheetId: "Talente", range: talentUsed?.address ?? undefined, tableMaxRows: 12, tableMaxCols: 20, maxChars: 12000 });
  await fs.writeFile(path.join(workDir, "talente_source_summary.ndjson"), sourceSummary.ndjson, "utf8");
  console.log(JSON.stringify({
    npcSheets: npcWorkbook.worksheets.items.map((sheet) => sheet.name),
    talentAddress: talentUsed?.address ?? null,
    talentRows: rowCount,
    talentCols: colCount,
    talentFirstRows: talentValues.slice(0, 8),
    werteTalentReferences: talentReferences.length,
    werteTalentFirst: talentReferences.slice(0, 8),
  }, null, 2));
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/selbsbeherrschung/g, "selbstbeherrschung")
    .replace(/\bstufe\s*(\d+)\b/g, "stufe $1")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const left = [...a];
  const right = [...b];
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function similarity(a, b) {
  if (!a && !b) return 1;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length, 1);
}

if (mode === "analyze_mapping") {
  const source = JSON.parse(await fs.readFile(path.join(workDir, "talente_source.json"), "utf8"));
  const werte = JSON.parse(await fs.readFile(path.join(workDir, "werte_talente.json"), "utf8"));
  const sourceRows = source.values.slice(1, 145)
    .map((row, index) => ({ sourceRow: index + 2, category: row[0] ?? null, name: row[1] ?? null, cost: row[2] ?? null, selected: row[4] ?? null, description: row[5] ?? null }))
    .filter((row) => row.category && row.name);
  const valueRows = werte.records.map((row) => ({
    ...row,
    normalizedName: normalizeText(row.description),
    normalizedParent: normalizeText(row.parent),
  }));
  const aliases = new Map([
    [normalizeText("Gefahreninstinkt"), normalizeText("Gefahrensinn")],
  ]);

  const mappings = [];
  for (const sourceRow of sourceRows) {
    const normalizedName = normalizeText(sourceRow.name);
    const normalizedCategory = normalizeText(sourceRow.category);
    const exactName = valueRows.filter((candidate) => candidate.normalizedName === normalizedName);
    const exactNameAndParent = exactName.filter((candidate) => candidate.normalizedParent === normalizedCategory);
    let chosen = null;
    let status = "nicht zugeordnet";
    let confidence = 0;
    let reason = "";
    if (exactNameAndParent.length === 1) {
      [chosen] = exactNameAndParent;
      status = "exakt Name+Kategorie";
      confidence = 1;
      reason = "Normalisierter Name und Parent stimmen überein.";
    } else if (exactName.length === 1) {
      [chosen] = exactName;
      status = "exakt Name";
      confidence = 0.97;
      reason = "Normalisierter Name ist eindeutig; Parent/Kategorie weicht ab oder fehlt.";
    } else {
      const alias = aliases.get(normalizedName);
      const aliasMatches = alias ? valueRows.filter((candidate) => candidate.normalizedName === alias && candidate.normalizedParent === normalizedCategory) : [];
      if (aliasMatches.length === 1) {
        [chosen] = aliasMatches;
        status = "Alias";
        confidence = 0.95;
        reason = "Explizite bekannte Namensvariante.";
      }
    }

    const ranked = valueRows
      .map((candidate) => {
        const nameScore = similarity(normalizedName, candidate.normalizedName);
        const parentBonus = candidate.normalizedParent === normalizedCategory ? 0.08 : 0;
        return { candidate, score: Math.min(1, nameScore + parentBonus), nameScore };
      })
      .sort((a, b) => b.score - a.score);
    if (!chosen && ranked[0]?.nameScore >= 0.86 && ranked[0].score - (ranked[1]?.score ?? 0) >= 0.06) {
      chosen = ranked[0].candidate;
      status = "fuzzy eindeutig";
      confidence = Math.round(ranked[0].score * 1000) / 1000;
      reason = "Eindeutig bester normalisierter Namensmatch; manuell prüfen.";
    }
    mappings.push({
      ...sourceRow,
      normalizedName,
      normalizedCategory,
      status,
      confidence,
      reason,
      match: chosen ? {
        excelRow: chosen.excelRow,
        reference: chosen.reference,
        name: chosen.description,
        parent: chosen.parent,
        cost: chosen.cost,
        flag: chosen.flag,
      } : null,
      candidates: ranked.slice(0, 5).map(({ candidate, score, nameScore }) => ({
        reference: candidate.reference,
        name: candidate.description,
        parent: candidate.parent,
        cost: candidate.cost,
        score: Math.round(score * 1000) / 1000,
        nameScore: Math.round(nameScore * 1000) / 1000,
      })),
    });
  }
  await fs.writeFile(path.join(workDir, "mapping_candidates.json"), JSON.stringify(mappings, null, 2), "utf8");
  const counts = Object.fromEntries(Object.entries(Object.groupBy(mappings, (mapping) => mapping.status)).map(([key, group]) => [key, group.length]));
  console.log(JSON.stringify({
    rows: mappings.length,
    counts,
    unresolved: mappings.filter((mapping) => !mapping.match),
    fuzzy: mappings.filter((mapping) => mapping.status === "fuzzy eindeutig"),
    costMismatches: mappings.filter((mapping) => mapping.match && Number(mapping.cost) !== Number(mapping.match.cost)).map((mapping) => ({ sourceRow: mapping.sourceRow, name: mapping.name, sourceCost: mapping.cost, reference: mapping.match.reference, werteCost: mapping.match.cost })),
  }, null, 2));
}

if (mode === "copy_test") {
  const sourceSheet = npcWorkbook.worksheets.getItem("Talente");
  const sourceRange = sourceSheet.getRange("A1:Q155");
  const testWorkbook = Workbook.create();
  const testSheet = testWorkbook.worksheets.add("Talente");
  testSheet.getRange("A1:Q155").copyFrom(sourceRange, "all");
  const testExport = await SpreadsheetFile.exportXlsx(testWorkbook);
  const testPath = path.join(workDir, "copy_test.xlsx");
  await testExport.save(testPath);
  const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(testPath));
  const reopenedRange = reopened.worksheets.getItem("Talente").getRange("A1:Q155");
  console.log(JSON.stringify({
    testPath,
    firstRows: reopenedRange.values.slice(0, 4),
    formulas: reopenedRange.formulas.flatMap((row, r) => row.flatMap((formula, c) => formula ? [{ row: r + 1, col: c + 1, formula }] : [])).slice(0, 12),
  }, null, 2));
}

function effect(targetType, target, operation, value = null, unit = null) {
  return { targetType, target, targetReference: null, operation, value, unit };
}

function deriveEffects(name, description) {
  const text = String(description ?? "").trim();
  const result = {
    effectClass: "Komplexer Regeltext",
    effects: [],
    condition: "",
    stacking: "",
    implementation: `Setze folgende Regel um: ${text}`,
    portStatus: "manuell modellieren",
    note: "Wirkung ist nicht verlustfrei als einfacher Zahlenmodifikator darstellbar.",
  };
  let match;

  match = text.match(/Erhöht das Maximum der Sonderfertigkeit\s+["“]([^"”]+)["”]\s+um\s+(\d+)\s+Punkte/i);
  if (match) {
    result.effectClass = "Fertigkeitsmaximum";
    result.effects = [effect("Sonderfertigkeit", match[1], "Erhöhe Maximum", Number(match[2]), "Punkte")];
    result.implementation = `Erhöhe das Maximum der Ziel-Sonderfertigkeit um ${match[2]} Punkte.`;
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Das Attributs-Maximum wird um\s+(\d+)\s+erhöht/i);
  if (match) {
    const target = String(name).split(/\s+/).at(-1);
    result.effectClass = "Attributsmaximum";
    result.effects = [effect("Attribut", target, "Erhöhe Maximum", Number(match[1]), "Punkte")];
    result.implementation = `Erhöhe das Attributsmaximum ${target} um ${match[1]} Punkte.`;
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Erhöht das Maximum der Eigenschaft um\s+(\d+)\s+Punkte/i);
  if (match) {
    const target = String(name).split(":").slice(1).join(":").trim();
    result.effectClass = "Eigenschaftsmaximum";
    result.effects = [effect("Eigenschaft", target, "Erhöhe Maximum", Number(match[1]), "Punkte")];
    result.implementation = `Erhöhe das Eigenschaftsmaximum ${target} um ${match[1]} Punkte.`;
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Erhöht das Maximum der Kampffertigkeit um\s+(\d+)\s+Punkte/i);
  if (match) {
    const target = String(name).split(":").slice(1).join(":").trim();
    result.effectClass = "Kampffertigkeitsmaximum";
    result.effects = [effect("Kampffertigkeit", target, "Erhöhe Maximum", Number(match[1]), "Punkte")];
    result.implementation = `Erhöhe das Kampffertigkeitsmaximum ${target} um ${match[1]} Punkte.`;
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Erhöht das Maximum aller KI-Fähigkeiten um\s*\+?(\d+)/i);
  if (match) {
    result.effectClass = "KI-Fähigkeitsmaximum";
    result.effects = [effect("Fertigkeitsgruppe", "alle KI-Fähigkeiten", "Erhöhe Maximum", Number(match[1]), "Punkte")];
    result.implementation = `Erhöhe das Maximum aller KI-Fähigkeiten um ${match[1]} Punkte.`;
    result.portStatus = "strukturiert";
    result.note = "Gruppenwirkung muss auf alle KI-Fähigkeitsreferenzen angewandt werden.";
    return result;
  }

  match = text.match(/Zaubermaximum\s*\+(\d+)\s+für eine Schule/i);
  if (match) {
    result.effectClass = "Zauberschulmaximum";
    result.effects = [effect("Zauberschule", "[Schule]", "Erhöhe Maximum", Number(match[1]), "Punkte")];
    result.condition = "Einmal je Zauberschule kaufbar; konkrete Schule folgt aus der Werte-Referenz.";
    result.stacking = "Stufen 1–3 bauen fachlich aufeinander auf; kumulative Auslegung prüfen.";
    result.implementation = `Erhöhe das Zaubermaximum der in der Talent-Referenz codierten Schule um ${match[1]} Punkte.`;
    result.portStatus = "strukturiert – 1:n";
    result.note = "Eine Quellzeile repräsentiert zwölf schulkonkrete Werte-Referenzen.";
    return result;
  }

  const maximumMatch = text.match(/(.{2,70}?)\s+Fertigkeitsmaximum\s*\+(\d+)/i)
    ?? text.match(/(Grundfertigkeitenmaximum)\s*\+(\d+)/i)
    ?? text.match(/(Wissens[,\- ]+Handwerks[,\- ]+Kulturfertigkeitenmaximum)\s*\+(\d+)/i);
  if (maximumMatch) {
    let target = maximumMatch[1].replace(/maximum$/i, "").trim();
    target = target.replace(/^Gute\s+/i, "").trim();
    const targetType = /Grundfertigkeiten/i.test(target)
      ? "Fertigkeitsgruppe"
      : /Wissens|Handwerks|Kultur/i.test(target)
        ? "Fertigkeitsgruppe"
        : "Fertigkeit";
    result.effectClass = "Fertigkeitsmaximum";
    result.effects = [effect(targetType, target, "Erhöhe Maximum", Number(maximumMatch[2]), "Punkte")];
    result.implementation = `Erhöhe das Fertigkeitsmaximum ${target} um ${maximumMatch[2]} Punkte.`;
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Erhöht die natürliche Mana Regeneration um\s+(\d+)%\s*\(faktor\s*([\d,.]+)\)/i);
  if (match) {
    result.effectClass = "Regeneration";
    result.effects = [effect("Charakterwert", "Mana-Regeneration", "Multipliziere", Number(match[2].replace(",", ".")), "Faktor")];
    result.implementation = `Multipliziere die natürliche Mana-Regeneration mit Faktor ${match[2]}.`;
    result.portStatus = "strukturiert";
    result.note = `${match[1]} % laut Beschreibung.`;
    return result;
  }

  match = text.match(/Trefferschwelle.*?um\s+(\d+).*?Selbstbeherrschung um\s+(\d+).*?Gesundheit um\s+(\d+)/i);
  if (match) {
    result.effectClass = "Charakterwertmodifikator";
    result.effects = [
      effect("Charakterwert", "Trefferschwelle", "Addiere", Number(match[1]), "Punkte"),
      effect("Charakterwert", "Selbstbeherrschung", "Addiere", Number(match[2]), "Punkte"),
      effect("Charakterwert", "Gesundheit", "Addiere", Number(match[3]), "Punkte"),
    ];
    result.implementation = "Erhöhe Trefferschwelle, Selbstbeherrschung und Gesundheit um die angegebenen Punkte.";
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Selbstbeherrschung.*?erhöht sich um\s+(\d+).*?Gesundheit um\s+(\d+)/i);
  if (match) {
    result.effectClass = "Charakterwertmodifikator";
    result.effects = [
      effect("Charakterwert", "Selbstbeherrschung", "Addiere", Number(match[1]), "Punkte"),
      effect("Charakterwert", "Gesundheit", "Addiere", Number(match[2]), "Punkte"),
    ];
    result.implementation = "Erhöhe Selbstbeherrschung und Gesundheit um die angegebenen Punkte.";
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/alle\s+nAT([+-]\d+)\s+und\s+nPA([+-]\d+)/i);
  if (match) {
    result.effectClass = "Kampfstilmodifikator";
    result.effects = [
      effect("Kampfwert", "nAT", "Addiere", Number(match[1]), "Punkte"),
      effect("Kampfwert", "nPA", "Addiere", Number(match[2]), "Punkte"),
    ];
    result.condition = "Gilt für alle nAT/nPA im betreffenden Kampfstil.";
    result.implementation = `Addiere ${match[1]} auf nAT und ${match[2]} auf nPA.`;
    result.portStatus = "strukturiert";
    result.note = "";
    return result;
  }

  match = text.match(/Verringert den FK-Modifikator.*?um\s+(\d+)/i);
  if (match) {
    result.effectClass = "Fernkampfmodifikator";
    result.effects = [effect("Modifikator", "FK-Modifikator laut Beschreibung", "Verringere Malus", Number(match[1]), "Punkte")];
    result.condition = text.match(/für\s+"([^"]+)"/i)?.[1] ?? "Siehe Originalbeschreibung";
    result.implementation = `Verringere den betroffenen FK-Malus um ${match[1]} Punkte.`;
    result.portStatus = "teilstrukturiert";
    result.note = "Konkrete Modifikator-ID muss beim Port festgelegt werden.";
    return result;
  }

  if (/Verändert den FK-Modifikator/i.test(text) || /Verändert die Zielen-Modifikatoren/i.test(text)) {
    result.effectClass = "Fernkampfmodifikator";
    result.effects = [effect("Modifikator", "FK-/Zielen-Modifikator laut Beschreibung", "Setze/ändere Staffel", null, null)];
    result.condition = "Siehe Originalbeschreibung";
    result.implementation = `Setze folgende Modifikatorregel um: ${text}`;
    result.portStatus = "teilstrukturiert";
    result.note = "Staffelwerte und konkrete Modifikator-ID manuell modellieren.";
    return result;
  }

  if (/Zaubervorbereitungsdauer|Zaubereiverkürzungen/i.test(text)) {
    result.effectClass = "Zauberzeitmodifikator";
    result.effects = [effect("Zeit", "Zaubervorbereitungsdauer", "Wende Stufenstaffel an", null, "Verhältnis")];
    result.condition = "Abhängig von Zauberstufe 1–3; nicht kumulativ laut Beschreibung.";
    result.stacking = "Nicht kumulativ mit anderen Stufen dieses Vorteils.";
    result.implementation = `Wende folgende Zeitregel an: ${text}`;
    result.portStatus = "teilstrukturiert";
    result.note = "Verhältnisstaffel aus Beschreibung als eigene Tabelle/Regel abbilden.";
    return result;
  }

  if (/Gute .*Probe|höchstmögliche Gute|automatisch geschenkte Punkte/i.test(text)) {
    result.effectClass = "Probenregel";
    result.effects = [effect("Probe", String(name).replace(/\s+Stufe\s+\d+$/i, ""), "Ändere Gute-/Geschenkt-Regel", null, null)];
    result.implementation = `Setze folgende Probenregel um: ${text}`;
    result.portStatus = "teilstrukturiert";
    result.note = "Probenformel aus dem Regeltext ableiten; keine einfache additive Wirkung.";
    return result;
  }

  if (/^Ermöglicht|^Erlaubt|\bermöglicht\b|\berlaubt\b/i.test(text)) {
    result.effectClass = "Freischaltung/Manöver";
    result.effects = [effect("Regeloption", String(name), "Schalte frei", true, "Boolesch")];
    result.condition = "Siehe Originalbeschreibung";
    result.implementation = `Schalte die Regeloption gemäß folgender Regel frei: ${text}`;
    result.portStatus = "teilstrukturiert";
    result.note = "Regeloption benötigt eine eigene Implementierungslogik.";
    return result;
  }

  if (/Erhöht|Verringert|Verändert|verdoppelt|halbiert/i.test(text)) {
    result.effectClass = "Modifikator – komplex";
    result.effects = [effect("Regelwert", "aus Beschreibung abzuleiten", "Modifiziere", null, null)];
    result.implementation = `Setze folgende Modifikatorregel um: ${text}`;
    result.portStatus = "teilstrukturiert";
    result.note = "Richtung ist erkennbar, Ziel/Formel muss manuell präzisiert werden.";
    return result;
  }

  return result;
}

function resolveTargetReference(effectRecord, allValues) {
  if (!effectRecord?.target || effectRecord.target.startsWith("[")) return null;
  const explicitTargets = new Map([
    ["fertigkeit|mentale kapazitaet", "sf_mentale_kapazitaet"],
    ["kampffertigkeit|boegen", "fk_boegen"],
    ["fertigkeit|selbstbeherrschung", "sf_selbstbeherrschung"],
    ["fertigkeit|mana meditation", "sf_meditation"],
    ["fertigkeit|mana talentwert", "sf_mana_talent"],
  ]);
  const explicitKey = `${normalizeText(effectRecord.targetType)}|${normalizeText(effectRecord.target)}`;
  if (explicitTargets.has(explicitKey)) return explicitTargets.get(explicitKey);
  const typeCategories = {
    Attribut: ["Attribute"],
    Eigenschaft: ["Eigenschaft"],
    Sonderfertigkeit: ["Sonderfertigkeit"],
    Charakterwert: ["Charakterwerte"],
    Kampffertigkeit: ["Nahkampf", "Fernkampf", "Grundfertigkeit"],
  };
  const targetNormalized = normalizeText(effectRecord.target.replace(/^alle\s+/i, ""));
  const categories = typeCategories[effectRecord.targetType] ?? null;
  let candidates = allValues.filter((record) => normalizeText(record.description) === targetNormalized);
  if (categories) candidates = candidates.filter((record) => categories.includes(record.category));
  if (candidates.length === 1) return candidates[0].reference;
  const fallbackPool = categories ? allValues.filter((record) => categories.includes(record.category)) : allValues;
  const ranked = fallbackPool
    .map((record) => ({ record, score: similarity(targetNormalized, normalizeText(record.description)) }))
    .sort((a, b) => b.score - a.score);
  if (ranked[0]?.score >= 0.88 && ranked[0].score - (ranked[1]?.score ?? 0) >= 0.05) return ranked[0].record.reference;
  return null;
}

if (mode === "build") {
  const source = JSON.parse(await fs.readFile(path.join(workDir, "talente_source.json"), "utf8"));
  const mappings = JSON.parse(await fs.readFile(path.join(workDir, "mapping_candidates.json"), "utf8"));
  const werteSheet = werteWorkbook.worksheets.getItem("Werte");
  const werteValues = werteSheet.getUsedRange()?.values ?? [];
  const werteHeaders = (werteValues[0] ?? []).map((value) => String(value ?? "").trim().toLocaleLowerCase("de-DE"));
  const wi = (name) => werteHeaders.indexOf(name.toLocaleLowerCase("de-DE"));
  const allValueRecords = werteValues.slice(1).map((row, index) => ({
    excelRow: index + 2,
    reference: row[wi("Referenz")] ?? null,
    category: row[wi("Kategorie")] ?? null,
    description: row[wi("Beschreibung")] ?? null,
    parent: row[wi("Parent")] ?? null,
    cost: row[wi("Kosten")] ?? null,
  })).filter((record) => record.reference);

  const genericMap = new Map([
    ["Magus [Schule] Stufe 1", allValueRecords.filter((record) => /^Magus Stufe 1:/i.test(String(record.description)))],
    ["Großmagus [Schule] Stufe 2", allValueRecords.filter((record) => /^Magus Stufe 2:/i.test(String(record.description)))],
    ["Erzmagus [Schule] Stufe 3", allValueRecords.filter((record) => /^Magus Stufe 3:/i.test(String(record.description)))],
  ]);

  const outputWorkbook = Workbook.create();
  const outputSheet = outputWorkbook.worksheets.add("Talente");
  outputSheet.getRange("A1:Q155").copyFrom(npcWorkbook.worksheets.getItem("Talente").getRange("A1:Q155"), "all");
  const sourceWidths = [16, 42, 18, 10, 12, 110, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
  sourceWidths.forEach((width, index) => { outputSheet.getRangeByIndexes(0, index, 155, 1).format.columnWidth = width; });
  outputSheet.getRange("A1:F1").format.font = { bold: true };
  outputSheet.getRange("A2:A145").format.font = { bold: true };
  outputSheet.getRange("C2:D147").format.horizontalAlignment = "right";
  outputSheet.getRange("E2:E145").format.horizontalAlignment = "center";
  outputSheet.getRange("F2:F145").format.verticalAlignment = "top";

  const headers = [
    "Werte-Referenz(en)", "Referenzanzahl", "Zuordnungsstatus", "Zuordnungssicherheit", "Werte-Zeile(n)", "Werte-Name(n)", "Werte-Parent", "Werte-Kosten", "Kostenabgleich", "Wirkungsklasse",
    "Wirkung 1 – Zieltyp", "Wirkung 1 – Ziel", "Wirkung 1 – Zielreferenz", "Wirkung 1 – Imperativ", "Wirkung 1 – Wert", "Wirkung 1 – Einheit",
    "Wirkung 2 – Zieltyp", "Wirkung 2 – Ziel", "Wirkung 2 – Zielreferenz", "Wirkung 2 – Imperativ", "Wirkung 2 – Wert", "Wirkung 2 – Einheit",
    "Wirkung 3 – Zieltyp", "Wirkung 3 – Ziel", "Wirkung 3 – Zielreferenz", "Wirkung 3 – Imperativ", "Wirkung 3 – Wert", "Wirkung 3 – Einheit",
    "Bedingung / Auslöser", "Stufen-/Kumulierungslogik", "Imperative Implementierungsanweisung", "Portierungsstatus", "Prüfhinweis",
  ];
  const startCol = 17;
  const endCol = startCol + headers.length - 1;
  outputSheet.getRangeByIndexes(0, startCol, 1, headers.length).values = [headers];

  const rows = [];
  const audit = [];
  for (const mapping of mappings) {
    let matches = mapping.match ? [mapping.match] : [];
    let mappingStatus = mapping.status;
    let confidence = mapping.confidence;
    let mappingNote = mapping.reason;
    if (genericMap.has(mapping.name)) {
      matches = genericMap.get(mapping.name).map((record) => ({
        excelRow: record.excelRow,
        reference: record.reference,
        name: record.description,
        parent: record.parent,
        cost: record.cost,
        flag: null,
      }));
      mappingStatus = "1:n Schulvarianten";
      confidence = 1;
      mappingNote = "Generische NPC-Zeile wird auf zwölf schulkonkrete Werte-Referenzen abgebildet.";
    }
    const derived = deriveEffects(mapping.name, mapping.description);
    for (const item of derived.effects) item.targetReference = resolveTargetReference(item, allValueRecords);
    const effects = [...derived.effects];
    while (effects.length < 3) effects.push({ targetType: null, target: null, targetReference: null, operation: null, value: null, unit: null });
    const costs = [...new Set(matches.map((match) => match.cost).filter((value) => value !== null && value !== ""))];
    const costCheck = matches.length === 0
      ? "nicht prüfbar"
      : costs.every((value) => Number(value) === Number(mapping.cost))
        ? "OK"
        : `abweichend: ${costs.join(", ")}`;
    const unresolvedTargets = derived.effects.filter((item) => item.target && !item.targetReference && !["Fertigkeitsgruppe", "Zauberschule", "Modifikator", "Zeit", "Probe", "Regeloption", "Regelwert", "Kampfwert"].includes(item.targetType));
    const notes = [mappingNote, derived.note];
    if (!matches.length) notes.push("Keine Werte-Referenz zugeordnet.");
    if (unresolvedTargets.length) notes.push(`Zielreferenz offen: ${unresolvedTargets.map((item) => item.target).join(", ")}.`);
    rows.push([
      matches.map((match) => match.reference).join("\n"),
      matches.length,
      mappingStatus,
      confidence,
      matches.map((match) => match.excelRow).join("\n"),
      matches.map((match) => match.name).join("\n"),
      [...new Set(matches.map((match) => match.parent).filter(Boolean))].join("\n"),
      costs.join("\n"),
      costCheck,
      derived.effectClass,
      ...effects.flatMap((item) => [item.targetType, item.target, item.targetReference, item.operation, item.value, item.unit]),
      derived.condition,
      derived.stacking,
      derived.implementation,
      matches.length ? derived.portStatus : "Zuordnung offen",
      notes.filter(Boolean).join(" "),
    ]);
    audit.push({ sourceRow: mapping.sourceRow, name: mapping.name, matches, derived, costCheck, unresolvedTargets });
  }
  outputSheet.getRangeByIndexes(1, startCol, rows.length, headers.length).values = rows;

  const headerRange = outputSheet.getRangeByIndexes(0, startCol, 1, headers.length);
  headerRange.format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
    verticalAlignment: "center",
    horizontalAlignment: "center",
    borders: { preset: "all", style: "thin", color: "#B4C7E7" },
  };
  headerRange.format.rowHeight = 42;
  const dataRange = outputSheet.getRangeByIndexes(1, startCol, rows.length, headers.length);
  dataRange.format = {
    wrapText: true,
    verticalAlignment: "top",
    borders: { insideHorizontal: { style: "thin", color: "#D9E2F3" } },
  };
  outputSheet.getRangeByIndexes(1, startCol + 1, rows.length, 1).format.numberFormat = "0";
  outputSheet.getRangeByIndexes(1, startCol + 3, rows.length, 1).format.numberFormat = "0%";
  outputSheet.getRangeByIndexes(1, startCol + 8, rows.length, 1).conditionalFormats.add("containsText", { text: "OK", format: { fill: "#E2F0D9", font: { color: "#375623" } } });
  outputSheet.getRangeByIndexes(1, startCol + headers.indexOf("Portierungsstatus"), rows.length, 1).conditionalFormats.add("containsText", { text: "manuell", format: { fill: "#FFF2CC", font: { color: "#7F6000" } } });
  outputSheet.getRangeByIndexes(1, startCol + headers.indexOf("Portierungsstatus"), rows.length, 1).conditionalFormats.add("containsText", { text: "strukturiert", format: { fill: "#E2F0D9", font: { color: "#375623" } } });

  const widths = [42, 12, 22, 16, 16, 42, 18, 14, 18, 24,
    18, 26, 30, 24, 12, 14,
    18, 26, 30, 24, 12, 14,
    18, 26, 30, 24, 12, 14,
    42, 38, 70, 24, 55];
  widths.forEach((width, index) => { outputSheet.getRangeByIndexes(0, startCol + index, rows.length + 1, 1).format.columnWidth = width; });
  outputSheet.freezePanes.freezeRows(1);
  outputSheet.freezePanes.freezeColumns(2);

  const exported = await SpreadsheetFile.exportXlsx(outputWorkbook);
  await exported.save(outputPath);
  await fs.writeFile(path.join(workDir, "talente_wirkung_audit.json"), JSON.stringify(audit, null, 2), "utf8");
  console.log(JSON.stringify({
    outputPath,
    rows: rows.length,
    mappedOneToOne: audit.filter((item) => item.matches.length === 1).length,
    mappedOneToMany: audit.filter((item) => item.matches.length > 1).length,
    unmapped: audit.filter((item) => item.matches.length === 0).length,
    effectClasses: Object.fromEntries(Object.entries(Object.groupBy(audit, (item) => item.derived.effectClass)).map(([key, group]) => [key, group.length])),
    portStatuses: Object.fromEntries(Object.entries(Object.groupBy(audit, (item) => item.derived.portStatus)).map(([key, group]) => [key, group.length])),
    unresolvedTargets: audit.filter((item) => item.unresolvedTargets.length).map((item) => ({ sourceRow: item.sourceRow, name: item.name, targets: item.unresolvedTargets.map((target) => target.target) })),
  }, null, 2));
}

if (mode === "inspect_targets") {
  const sheet = werteWorkbook.worksheets.getItem("Werte");
  const values = sheet.getUsedRange()?.values ?? [];
  const headers = (values[0] ?? []).map((value) => String(value ?? "").trim().toLocaleLowerCase("de-DE"));
  const idx = (name) => headers.indexOf(name.toLocaleLowerCase("de-DE"));
  const terms = ["mentale kapaz", "bögen", "boegen", "selbstbeherr", "meditation", "regeneration", "mana talent"];
  const matches = values.slice(1).map((row, index) => ({
    row: index + 2,
    reference: row[idx("Referenz")],
    category: row[idx("Kategorie")],
    description: row[idx("Beschreibung")],
    art: row[idx("Art")],
  })).filter((record) => terms.some((term) => normalizeText(`${record.reference} ${record.description}`).includes(normalizeText(term))));
  console.log(JSON.stringify(matches, null, 2));
}

if (mode === "verify") {
  const outputWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
  const sheetNames = outputWorkbook.worksheets.items.map((sheet) => sheet.name);
  if (sheetNames.length !== 1 || sheetNames[0] !== "Talente") throw new Error(`Unerwartete Blätter: ${sheetNames.join(", ")}`);
  const sourceSheet = npcWorkbook.worksheets.getItem("Talente");
  const outputSheet = outputWorkbook.worksheets.getItem("Talente");
  const sourceValues = sourceSheet.getRange("A1:Q155").values;
  const outputValues = outputSheet.getRange("A1:Q155").values;
  const sourceFormulas = sourceSheet.getRange("A1:Q155").formulas;
  const outputFormulas = outputSheet.getRange("A1:Q155").formulas;
  const sourceDifferences = [];
  for (let r = 0; r < 155; r += 1) {
    for (let c = 0; c < 17; c += 1) {
      const sourceFormula = sourceFormulas[r]?.[c] ?? null;
      const outputFormula = outputFormulas[r]?.[c] ?? null;
      if (sourceFormula !== outputFormula) sourceDifferences.push({ row: r + 1, col: c + 1, kind: "formula", sourceFormula, outputFormula });
      if (!sourceFormula && !outputFormula) {
        const sourceValue = sourceValues[r]?.[c] ?? null;
        const outputValue = outputValues[r]?.[c] ?? null;
        if (sourceValue !== outputValue) sourceDifferences.push({ row: r + 1, col: c + 1, kind: "value", sourceValue, outputValue });
      }
    }
  }
  if (sourceDifferences.length) {
    await fs.writeFile(path.join(workDir, "source_copy_differences.json"), JSON.stringify(sourceDifferences, null, 2), "utf8");
    throw new Error(`Der kopierte Quellbereich weist ${sourceDifferences.length} unerlaubte Abweichungen auf.`);
  }

  const used = outputSheet.getUsedRange();
  const values = used.values ?? [];
  const headers = (values[0] ?? []).map((value) => String(value ?? "").trim());
  const header = (name) => headers.indexOf(name);
  const referenceCol = header("Werte-Referenz(en)");
  const countCol = header("Referenzanzahl");
  const effectClassCol = header("Wirkungsklasse");
  const portStatusCol = header("Portierungsstatus");
  const targetReferenceCols = [header("Wirkung 1 – Zielreferenz"), header("Wirkung 2 – Zielreferenz"), header("Wirkung 3 – Zielreferenz")];
  const imperativeCols = [header("Wirkung 1 – Imperativ"), header("Wirkung 2 – Imperativ"), header("Wirkung 3 – Imperativ")];
  const implementationCol = header("Imperative Implementierungsanweisung");
  const requiredHeaders = [referenceCol, countCol, effectClassCol, portStatusCol, implementationCol, ...targetReferenceCols, ...imperativeCols];
  if (requiredHeaders.some((colIndex) => colIndex < 0)) throw new Error("Mindestens eine erforderliche Struktur- oder Imperativspalte fehlt.");
  const obsoleteOperations = new Set([
    "Maximum addieren", "multiplizieren", "addieren", "Malus verringern", "setzen/Staffel ändern",
    "Stufenstaffel anwenden", "Gute-/Geschenkt-Regel ändern", "freischalten", "modifizieren",
  ]);
  const imperativeStart = /^(Erhöhe|Setze|Wende|Multipliziere|Verringere|Addiere|Schalte|Modifiziere)\b/;
  const werteRefs = new Set(werteWorkbook.worksheets.getItem("Werte").getUsedRange().values.slice(1).map((row) => row[0]).filter(Boolean));
  const validationErrors = [];
  for (let r = 1; r <= 144; r += 1) {
    const row = values[r] ?? [];
    const refs = String(row[referenceCol] ?? "").split(/\r?\n/).filter(Boolean);
    if (!refs.length) validationErrors.push({ row: r + 1, issue: "keine Werte-Referenz" });
    if (Number(row[countCol]) !== refs.length) validationErrors.push({ row: r + 1, issue: "Referenzanzahl stimmt nicht" });
    for (const ref of refs) if (!werteRefs.has(ref)) validationErrors.push({ row: r + 1, issue: `unbekannte Werte-Referenz ${ref}` });
    if (!row[effectClassCol]) validationErrors.push({ row: r + 1, issue: "Wirkungsklasse fehlt" });
    if (!row[portStatusCol]) validationErrors.push({ row: r + 1, issue: "Portierungsstatus fehlt" });
    for (const colIndex of imperativeCols) {
      const operation = String(row[colIndex] ?? "").trim();
      if (obsoleteOperations.has(operation)) validationErrors.push({ row: r + 1, issue: `veraltete nicht-imperative Operation ${operation}` });
    }
    const implementation = String(row[implementationCol] ?? "").trim();
    if (!implementation) validationErrors.push({ row: r + 1, issue: "imperative Implementierungsanweisung fehlt" });
    else if (!imperativeStart.test(implementation)) validationErrors.push({ row: r + 1, issue: `Implementierungsanweisung ist nicht imperativ: ${implementation}` });
    for (const colIndex of targetReferenceCols) {
      const targetRef = row[colIndex];
      if (targetRef && !werteRefs.has(targetRef)) validationErrors.push({ row: r + 1, issue: `unbekannte Zielreferenz ${targetRef}` });
    }
  }
  if (validationErrors.length) {
    await fs.writeFile(path.join(workDir, "verification_errors.json"), JSON.stringify(validationErrors, null, 2), "utf8");
    throw new Error(`Validierungsfehler: ${validationErrors.length}`);
  }

  const errorScan = await outputWorkbook.inspect({
    kind: "match",
    sheetId: "Talente",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, matchFormulas: true, maxResults: 300 },
    maxChars: 12000,
  });
  await fs.writeFile(path.join(workDir, "final_formula_error_scan.ndjson"), errorScan.ndjson, "utf8");

  const ranges = [
    "A1:Q80", "R1:AC80", "AD1:AO80", "AP1:AX80",
    "A81:Q155", "R81:AC155", "AD81:AO155", "AP81:AX155",
  ];
  for (const range of ranges) {
    const preview = await outputWorkbook.render({ sheetName: "Talente", range, scale: 0.75, format: "png" });
    await fs.writeFile(path.join(workDir, `final_${range.replace(":", "-")}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
  console.log(JSON.stringify({
    outputPath,
    sheetNames,
    usedRange: used.address,
    sourceRegionPreserved: true,
    validatedTalentRows: 144,
    validationErrors: 0,
    formulaErrorScan: errorScan.ndjson,
  }, null, 2));
}
