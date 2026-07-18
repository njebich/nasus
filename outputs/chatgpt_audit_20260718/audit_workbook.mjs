import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "E:/Das Western Rollenspiel/LLM/werte 0.8-claude.xlsx";
const outputDir = "E:/Das Western Rollenspiel/LLM/outputs/chatgpt_audit_20260718";
const mode = process.argv[2] ?? "inspect";

await fs.mkdir(outputDir, { recursive: true });
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

function safeName(name) {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}

function cellValue(value) {
  if (value instanceof Date) return value.toISOString();
  return value;
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
  const summary = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 20000,
    tableMaxRows: 8,
    tableMaxCols: 12,
    tableMaxCellChars: 120,
  });
  await fs.writeFile(path.join(outputDir, "workbook_summary.ndjson"), summary.ndjson, "utf8");

  const sheets = [];
  for (const sheet of workbook.worksheets.items) {
    const used = sheet.getUsedRange();
    const record = {
      name: sheet.name,
      address: used?.address ?? null,
      values: used?.values?.map((row) => row.map(cellValue)) ?? [],
      formulas: used?.formulas ?? [],
    };
    sheets.push(record);
  }
  await fs.writeFile(path.join(outputDir, "workbook_data.json"), JSON.stringify(sheets, null, 2), "utf8");
  for (const sheet of sheets) {
    const rowCount = sheet.values.length;
    const colCount = Math.max(0, ...sheet.values.map((row) => row.length));
    for (let rowStart = 0; rowStart < rowCount; rowStart += 250) {
      const rowEnd = Math.min(rowCount, rowStart + 250);
      for (let colStart = 0; colStart < colCount; colStart += 12) {
        const colEnd = Math.min(colCount, colStart + 12);
        const range = `${columnName(colStart)}${rowStart + 1}:${columnName(colEnd - 1)}${rowEnd}`;
        const preview = await workbook.render({
          sheetName: sheet.name,
          range,
          scale: 0.65,
          format: "png",
        });
        await fs.writeFile(
          path.join(outputDir, `preview_${safeName(sheet.name)}_r${rowStart + 1}-${rowEnd}_c${colStart + 1}-${colEnd}.png`),
          new Uint8Array(await preview.arrayBuffer()),
        );
      }
    }
  }
  console.log(JSON.stringify(sheets.map((s) => ({ name: s.name, address: s.address, rows: s.values.length, cols: Math.max(0, ...s.values.map((r) => r.length)) })), null, 2));
}

if (mode === "analyze") {
  const structures = [];
  const issues = [];
  for (const sheet of workbook.worksheets.items) {
    const used = sheet.getUsedRange();
    const values = used?.values ?? [];
    const formulas = used?.formulas ?? [];
    const headers = (values[0] ?? []).map((v) => String(v ?? "").trim());
    const normalizedHeaders = headers.map((v) => v.toLocaleLowerCase("de-DE"));
    const flagColumns = normalizedHeaders.flatMap((v, i) => v === "flag" ? [i] : []);
    structures.push({
      sheet: sheet.name,
      address: used?.address ?? null,
      headers,
      firstRows: values.slice(0, 5),
      flagColumns,
      populatedRows: values.filter((row) => row.some((v) => v !== null && v !== "")).length,
    });

    const seenHeaders = new Map();
    headers.forEach((header, index) => {
      if (!header) return;
      const key = header.toLocaleLowerCase("de-DE");
      if (seenHeaders.has(key)) {
        issues.push({ type: "duplicate_header", sheet: sheet.name, columns: [seenHeaders.get(key), index], header });
      } else {
        seenHeaders.set(key, index);
      }
    });

    for (let r = 0; r < values.length; r += 1) {
      for (let c = 0; c < (values[r]?.length ?? 0); c += 1) {
        const value = values[r][c];
        const formula = formulas[r]?.[c];
        if (typeof value === "string" && /#REF!|#DIV\/0!|#VALUE!|#NAME\?|#N\/A/i.test(value)) {
          issues.push({ type: "formula_error_value", sheet: sheet.name, row: r + 1, col: c + 1, value, formula });
        }
        if (typeof formula === "string" && /#REF!/i.test(formula)) {
          issues.push({ type: "broken_formula_reference", sheet: sheet.name, row: r + 1, col: c + 1, formula });
        }
      }
    }

    for (const keyHeader of ["referenz", "id"]) {
      const keyCol = normalizedHeaders.indexOf(keyHeader);
      if (keyCol < 0) continue;
      const seen = new Map();
      for (let r = 1; r < values.length; r += 1) {
        const raw = values[r]?.[keyCol];
        if (raw === null || raw === "") continue;
        const key = String(raw).trim();
        if (seen.has(key)) {
          issues.push({ type: "duplicate_key", sheet: sheet.name, header: headers[keyCol], key, rows: [seen.get(key) + 1, r + 1] });
        } else {
          seen.set(key, r);
        }
      }
    }
  }

  const errorScan = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, matchFormulas: true, maxResults: 500 },
    maxChars: 30000,
    summary: "formula error scan",
  });
  await fs.writeFile(path.join(outputDir, "structure_report.json"), JSON.stringify(structures, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "generic_issues.json"), JSON.stringify(issues, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "formula_error_scan.ndjson"), errorScan.ndjson, "utf8");
  console.log(JSON.stringify({
    flagSheets: structures.filter((s) => s.flagColumns.length).map((s) => ({ sheet: s.sheet, flagColumns: s.flagColumns.map((c) => c + 1) })),
    issueCounts: Object.fromEntries(Object.entries(Object.groupBy(issues, (i) => i.type)).map(([k, v]) => [k, v.length])),
    sheets: structures.map((s) => ({ sheet: s.sheet, headers: s.headers })),
  }, null, 2));
}

if (mode === "analyze_werte") {
  const sheet = workbook.worksheets.getItem("Werte");
  const used = sheet.getUsedRange();
  const values = used.values ?? [];
  const headers = (values[0] ?? []).map((v) => String(v ?? "").trim());
  const headerIndex = new Map(headers.map((h, i) => [h.toLocaleLowerCase("de-DE"), i]));
  const col = (name) => headerIndex.get(name.toLocaleLowerCase("de-DE"));
  const rows = values.slice(1).map((cells, index) => ({ excelRow: index + 2, cells }));
  const populated = rows.filter(({ cells }) => cells.some((v) => v !== null && v !== ""));
  const valueAt = (row, name) => row.cells[col(name)] ?? null;
  const refSet = new Set(populated.map((r) => String(valueAt(r, "Referenz") ?? "").trim()).filter(Boolean));
  const descSet = new Set(populated.map((r) => String(valueAt(r, "Beschreibung") ?? "").trim()).filter(Boolean));
  const report = {
    headers,
    populatedRows: populated.length,
    existingFlags: [],
    categories: {},
    arts: {},
    findings: [],
    unresolvedParents: {},
    formulaIdentifierFrequencies: {},
    groupStats: {},
  };
  const addFinding = (finding) => report.findings.push(finding);
  const count = (object, key) => { object[key] = (object[key] ?? 0) + 1; };
  const exactRefs = new Map();
  const normalizedRefs = new Map();
  const normalizedRefLookup = new Map();
  const semanticKeys = new Map();
  const dependencies = new Map();
  const ignoredIdentifiers = new Set([
    "wenn", "und", "oder", "nicht", "summe", "max", "min", "abrunden", "aufrunden", "runden",
    "wert", "grad", "kreis", "stufe", "kosten", "pool", "aura", "magie", "asp", "ep", "sp", "tap",
  ]);
  const germanNormalize = (value) => value
    .toLocaleLowerCase("de-DE")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const existingRef of refSet) {
    const key = germanNormalize(existingRef);
    const matches = normalizedRefLookup.get(key) ?? [];
    matches.push(existingRef);
    normalizedRefLookup.set(key, matches);
  }

  for (const row of populated) {
    const ref = String(valueAt(row, "Referenz") ?? "").trim();
    const category = String(valueAt(row, "Kategorie") ?? "").trim();
    const description = String(valueAt(row, "Beschreibung") ?? "").trim();
    const art = String(valueAt(row, "Art") ?? "").trim();
    const parent = String(valueAt(row, "Parent") ?? "").trim();
    const grad = String(valueAt(row, "Grad") ?? "").trim();
    const flag = String(valueAt(row, "Flag") ?? "").trim();
    count(report.categories, category || "<leer>");
    count(report.arts, art || "<leer>");
    const groupKey = `${category} | ${art}`;
    report.groupStats[groupKey] ??= { rows: 0, fields: {} };
    report.groupStats[groupKey].rows += 1;
    for (const field of headers.filter(Boolean)) {
      if (String(valueAt(row, field) ?? "").trim()) count(report.groupStats[groupKey].fields, field);
    }
    if (flag) report.existingFlags.push({ row: row.excelRow, ref, flag });
    if (!ref) addFinding({ kind: "missing_reference", row: row.excelRow, ref, message: "Referenz fehlt in einer befüllten Zeile." });
    if (!category) addFinding({ kind: "missing_category", row: row.excelRow, ref, message: "Kategorie fehlt in einer befüllten Zeile." });
    if (!description) addFinding({ kind: "missing_description", row: row.excelRow, ref, message: "Beschreibung fehlt in einer befüllten Zeile." });
    if (!art) addFinding({ kind: "missing_art", row: row.excelRow, ref, message: "Art fehlt in einer befüllten Zeile." });
    if (art === "Formel" && !String(valueAt(row, "Formel") ?? "").trim()) addFinding({ kind: "formula_art_without_formula", row: row.excelRow, ref, message: "Art ist Formel, aber die Spalte Formel ist leer." });
    if (art === "Pool" && !String(valueAt(row, "Pool") ?? "").trim()) addFinding({ kind: "pool_art_without_pool", row: row.excelRow, ref, message: "Art ist Pool, aber die Spalte Pool ist leer." });
    if (art === "Wert" && String(valueAt(row, "Formel") ?? "").trim()) addFinding({ kind: "value_art_with_formula", row: row.excelRow, ref, message: "Art ist Wert, zugleich ist eine Formel eingetragen; alle anderen Wert-Zeilen im Blatt haben keine Formel." });
    if (ref && !/^[a-z0-9_&-]+$/.test(ref)) addFinding({ kind: "invalid_reference_format", row: row.excelRow, ref, message: "Referenz enthält Zeichen außerhalb des im Blatt verwendeten ID-Schemas." });
    if (ref) {
      if (exactRefs.has(ref)) addFinding({ kind: "duplicate_reference", row: row.excelRow, ref, otherRow: exactRefs.get(ref), message: `Referenz ist bereits in Zeile ${exactRefs.get(ref)} vorhanden.` });
      else exactRefs.set(ref, row.excelRow);
      const normalized = ref.toLocaleLowerCase("de-DE").replace(/[-&]+/g, "_").replace(/_+/g, "_");
      if (normalizedRefs.has(normalized) && normalizedRefs.get(normalized).ref !== ref) {
        addFinding({ kind: "near_duplicate_reference", row: row.excelRow, ref, otherRow: normalizedRefs.get(normalized).row, otherRef: normalizedRefs.get(normalized).ref, message: `Referenz kollidiert nach Normalisierung mit ${normalizedRefs.get(normalized).ref}.` });
      } else normalizedRefs.set(normalized, { row: row.excelRow, ref });
    }
    const semanticKey = [category, description, parent, art, grad].map((v) => v.toLocaleLowerCase("de-DE").trim()).join("|");
    if (description && semanticKeys.has(semanticKey)) {
      const other = semanticKeys.get(semanticKey);
      addFinding({ kind: "duplicate_semantic_key", row: row.excelRow, ref, otherRow: other.row, otherRef: other.ref, message: `Gleiche Kombination aus Kategorie, Beschreibung, Parent, Art und Grad wie Zeile ${other.row}.` });
    } else if (description) semanticKeys.set(semanticKey, { row: row.excelRow, ref });
    if (parent && !refSet.has(parent) && !descSet.has(parent)) count(report.unresolvedParents, parent);
    if (parent && !refSet.has(parent)) {
      const nearRefs = normalizedRefLookup.get(germanNormalize(parent)) ?? [];
      if (nearRefs.length === 1) addFinding({ kind: "parent_reference_spelling", row: row.excelRow, ref, parent, expected: nearRefs[0], message: `Parent ${parent} stimmt nur nach Normalisierung mit Referenz ${nearRefs[0]} überein.` });
    }
    if (category === "Spruchmagie" && /\D2$/.test(description) && /2$/.test(ref)) addFinding({ kind: "bare_version_suffix", row: row.excelRow, ref, message: "Beschreibung und Referenz tragen eine ungetrennte Endziffer 2; dies wirkt wie ein Import-/Dublettenmarker statt einer fachlichen Bezeichnung." });
    if (/selbsbeherrschung/i.test(`${ref} ${description}`)) addFinding({ kind: "spelling_selbstbeherrschung", row: row.excelRow, ref, message: "Selbsbeherrschung widerspricht der sonst im Blatt verwendeten Schreibweise Selbstbeherrschung." });
    if (/Stufe\d/.test(description) || /_stufe\d(?:_|$)/.test(ref)) addFinding({ kind: "stufe_separator", row: row.excelRow, ref, message: "Stufenbezeichnung bzw. Referenz fehlt der sonst durchgängig verwendete Trenner vor der Stufenzahl." });

    const dependencyFields = ["Formel", "Pool", "Mindest-TaW", "Eig-Bonus"];
    const rowDeps = new Set();
    for (const field of dependencyFields) {
      const text = String(valueAt(row, field) ?? "");
      const lowerText = text.toLocaleLowerCase("de-DE");
      const fieldDeps = new Set();
      let remainder = lowerText;
      for (const knownRef of [...refSet].sort((a, b) => b.length - a.length)) {
        const escaped = knownRef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const matcher = new RegExp(`(^|[^a-z0-9_])${escaped}($|[^a-z0-9_])`, "i");
        if (matcher.test(lowerText)) {
          rowDeps.add(knownRef);
          fieldDeps.add(knownRef);
        }
        remainder = remainder.replace(new RegExp(escaped, "gi"), " ");
      }
      if (["Pool", "Eig-Bonus"].includes(field) && text.trim() && fieldDeps.size === 0) {
        addFinding({ kind: "unresolved_direct_reference", row: row.excelRow, ref, field, value: text, message: `${field} enthält keine im Blatt vorhandene Referenz.` });
      }
      if (field === "Formel" && text) {
        const opens = [...text].filter((ch) => ch === "(").length;
        const closes = [...text].filter((ch) => ch === ")").length;
        if (opens !== closes) addFinding({ kind: "unbalanced_parentheses", row: row.excelRow, ref, formula: text, message: `Formel hat ${opens} öffnende und ${closes} schließende Klammern.` });
        for (const token of remainder.match(/[a-z][a-z0-9_]{2,}/g) ?? []) {
          if (!token.includes("_") || ignoredIdentifiers.has(token)) continue;
          addFinding({ kind: "unresolved_formula_token", row: row.excelRow, ref, token, formula: text, message: `Formel enthält den nicht auflösbaren ID-ähnlichen Ausdruck ${token}.` });
        }
      }
    }
    if (ref) dependencies.set(ref, rowDeps);
  }

  const visiting = new Set();
  const visited = new Set();
  const cycleKeys = new Set();
  function visit(ref, stack) {
    if (visiting.has(ref)) {
      const start = stack.indexOf(ref);
      const cycle = [...stack.slice(start), ref];
      const key = [...new Set(cycle)].sort().join("|");
      if (!cycleKeys.has(key)) {
        cycleKeys.add(key);
        for (const member of new Set(cycle)) {
          addFinding({ kind: "dependency_cycle", row: exactRefs.get(member), ref: member, cycle, message: `Zirkuläre Abhängigkeit: ${cycle.join(" -> ")}.` });
        }
      }
      return;
    }
    if (visited.has(ref)) return;
    visiting.add(ref);
    for (const dep of dependencies.get(ref) ?? []) visit(dep, [...stack, ref]);
    visiting.delete(ref);
    visited.add(ref);
  }
  for (const ref of dependencies.keys()) visit(ref, []);

  report.findingCounts = Object.fromEntries(Object.entries(Object.groupBy(report.findings, (f) => f.kind)).map(([k, v]) => [k, v.length]));
  await fs.writeFile(path.join(outputDir, "werte_analysis.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({
    populatedRows: report.populatedRows,
    existingFlagCount: report.existingFlags.length,
    categories: report.categories,
    arts: report.arts,
    findingCounts: report.findingCounts,
    unresolvedParents: report.unresolvedParents,
  }, null, 2));
}

if (mode === "edit_werte") {
  const analysis = JSON.parse(await fs.readFile(path.join(outputDir, "werte_analysis.json"), "utf8"));
  const acceptedKinds = new Set([
    "pool_art_without_pool",
    "value_art_with_formula",
    "invalid_reference_format",
    "parent_reference_spelling",
    "bare_version_suffix",
    "spelling_selbstbeherrschung",
    "stufe_separator",
  ]);
  const sheet = workbook.worksheets.getItem("Werte");
  const before = sheet.getUsedRange().values.map((row) => [...row]);
  const findingsByRow = new Map();
  for (const finding of analysis.findings.filter((f) => acceptedKinds.has(f.kind))) {
    const messages = findingsByRow.get(finding.row) ?? [];
    let message;
    switch (finding.kind) {
      case "pool_art_without_pool":
        message = "Art=Pool, aber die Spalte Pool ist leer; der Eintrag kann keinen Pool bilden.";
        break;
      case "value_art_with_formula":
        message = "Art=Wert trotz befüllter Formel; alle übrigen Wert-Zeilen führen keine Formel. Prüfen, ob Art=Formel gemeint ist oder die Formel entfallen soll.";
        break;
      case "invalid_reference_format":
        message = "Referenz enthält Sonderzeichen außerhalb des sonst verwendeten technischen ID-Schemas; auf eine stabile ID aus Kleinbuchstaben, Ziffern und Trennzeichen prüfen.";
        break;
      case "parent_reference_spelling":
        message = `Parent ${finding.parent} stimmt nicht exakt mit der vorhandenen Referenz ${finding.expected} überein.`;
        break;
      case "bare_version_suffix":
        message = "Beschreibung und Referenz tragen eine ungetrennte Endziffer 2; prüfen, ob dies ein unbeabsichtigter Import-/Dublettenmarker ist.";
        break;
      case "spelling_selbstbeherrschung":
        message = "„Selbsbeherrschung“ widerspricht der sonst verwendeten Schreibweise „Selbstbeherrschung“.";
        break;
      case "stufe_separator":
        message = "Vor der Stufenzahl fehlt in Bezeichnung bzw. Referenz der sonst durchgängig verwendete Trenner.";
        break;
      default:
        message = finding.message;
    }
    if (!messages.includes(message)) messages.push(message);
    findingsByRow.set(finding.row, messages);
  }

  const changes = [];
  for (const [excelRow, messages] of [...findingsByRow.entries()].sort((a, b) => a[0] - b[0])) {
    const cell = sheet.getRange(`J${excelRow}`);
    const original = String(cell.values?.[0]?.[0] ?? "");
    const remarks = messages.map((message) => `chatgpt: ${message}`).join("\n");
    const updated = original ? `${original}\n${remarks}` : remarks;
    cell.values = [[updated]];
    changes.push({ row: excelRow, ref: before[excelRow - 1]?.[0] ?? null, originalFlag: original, added: remarks, updatedFlag: updated });
  }

  const after = sheet.getUsedRange().values;
  const unintended = [];
  const targetRows = new Set(changes.map((change) => change.row - 1));
  for (let r = 0; r < Math.max(before.length, after.length); r += 1) {
    for (let c = 0; c < Math.max(before[r]?.length ?? 0, after[r]?.length ?? 0); c += 1) {
      const oldValue = before[r]?.[c] ?? null;
      const newValue = after[r]?.[c] ?? null;
      if (oldValue === newValue) continue;
      if (c === 9 && targetRows.has(r)) continue;
      unintended.push({ row: r + 1, col: c + 1, oldValue, newValue });
    }
  }
  if (unintended.length) throw new Error(`Unbeabsichtigte Änderungen erkannt: ${JSON.stringify(unintended.slice(0, 10))}`);

  const outputPath = path.join(outputDir, "werte 0.8-claude_chatgpt-geprueft.xlsx");
  const exported = await SpreadsheetFile.exportXlsx(workbook);
  await exported.save(outputPath);
  await fs.writeFile(path.join(outputDir, "werte_changes.json"), JSON.stringify(changes, null, 2), "utf8");

  const verifyInput = await FileBlob.load(outputPath);
  const verifyWorkbook = await SpreadsheetFile.importXlsx(verifyInput);
  const verifySheet = verifyWorkbook.worksheets.getItem("Werte");
  for (const change of changes) {
    const value = String(verifySheet.getRange(`J${change.row}`).values?.[0]?.[0] ?? "");
    if (value !== change.updatedFlag) throw new Error(`Verifikation fehlgeschlagen für Werte!J${change.row}`);
  }
  const errorScan = await verifyWorkbook.inspect({
    kind: "match",
    sheetId: "Werte",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, matchFormulas: true, maxResults: 300 },
    maxChars: 12000,
  });
  await fs.writeFile(path.join(outputDir, "werte_final_formula_error_scan.ndjson"), errorScan.ndjson, "utf8");

  const qaRanges = ["A65:Q80", "A240:Q255", "A460:Q505", "A688:Q700", "A968:Q1030", "A1031:Q1080", "A1188:Q1210", "A1318:Q1330"];
  for (const range of qaRanges) {
    const preview = await verifyWorkbook.render({ sheetName: "Werte", range, scale: 1.2, format: "png" });
    await fs.writeFile(path.join(outputDir, `qa_werte_${range.replace(":", "-")}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
  console.log(JSON.stringify({ outputPath, changedRows: changes.length, remarkCount: [...findingsByRow.values()].reduce((sum, messages) => sum + messages.length, 0), rows: changes.map((change) => change.row), formulaErrorScan: errorScan.ndjson }, null, 2));
}

if (mode === "verify_werte") {
  const outputPath = path.join(outputDir, "werte 0.8-claude_chatgpt-geprueft.xlsx");
  const changes = JSON.parse(await fs.readFile(path.join(outputDir, "werte_changes.json"), "utf8"));
  const allowed = new Map(changes.map((change) => [`Werte!${change.row}:10`, change.updatedFlag]));
  const outputBlob = await FileBlob.load(outputPath);
  const outputWorkbook = await SpreadsheetFile.importXlsx(outputBlob);
  const differences = [];
  const originalNames = workbook.worksheets.items.map((sheet) => sheet.name);
  const outputNames = outputWorkbook.worksheets.items.map((sheet) => sheet.name);
  if (JSON.stringify(originalNames) !== JSON.stringify(outputNames)) {
    differences.push({ kind: "sheet_names", originalNames, outputNames });
  }
  for (const sheetName of originalNames) {
    const originalSheet = workbook.worksheets.getItem(sheetName);
    const outputSheet = outputWorkbook.worksheets.getItem(sheetName);
    const originalRange = originalSheet.getUsedRange();
    const outputRange = outputSheet.getUsedRange();
    const originalValues = originalRange?.values ?? [];
    const outputValues = outputRange?.values ?? [];
    const originalFormulas = originalRange?.formulas ?? [];
    const outputFormulas = outputRange?.formulas ?? [];
    const maxRows = Math.max(originalValues.length, outputValues.length, originalFormulas.length, outputFormulas.length);
    for (let r = 0; r < maxRows; r += 1) {
      const maxCols = Math.max(originalValues[r]?.length ?? 0, outputValues[r]?.length ?? 0, originalFormulas[r]?.length ?? 0, outputFormulas[r]?.length ?? 0);
      for (let c = 0; c < maxCols; c += 1) {
        const oldValue = originalValues[r]?.[c] ?? null;
        const newValue = outputValues[r]?.[c] ?? null;
        if (oldValue !== newValue) {
          const key = `${sheetName}!${r + 1}:${c + 1}`;
          if (!(allowed.has(key) && allowed.get(key) === String(newValue ?? ""))) {
            differences.push({ kind: "value", sheet: sheetName, row: r + 1, col: c + 1, oldValue, newValue });
          }
        }
        const oldFormula = originalFormulas[r]?.[c] ?? null;
        const newFormula = outputFormulas[r]?.[c] ?? null;
        if (oldFormula !== newFormula) differences.push({ kind: "formula", sheet: sheetName, row: r + 1, col: c + 1, oldFormula, newFormula });
      }
    }
  }
  if (differences.length) {
    await fs.writeFile(path.join(outputDir, "werte_unintended_differences.json"), JSON.stringify(differences, null, 2), "utf8");
    throw new Error(`Unerlaubte Unterschiede nach Export: ${differences.length}`);
  }
  console.log(JSON.stringify({ verified: true, allowedValueChanges: changes.length, unintendedDifferences: 0, sheetsCompared: originalNames.length }, null, 2));
}
