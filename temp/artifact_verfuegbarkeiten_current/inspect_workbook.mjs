import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = "E:/Das Western Rollenspiel/LLM";
const inputPath = path.join(root, "Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx");
const previewDir = path.join(root, "temp/artifact_verfuegbarkeiten_current/previews");
await fs.mkdir(previewDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheets = JSON.parse((await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 12000 })).ndjson.trim().split("\n").map(JSON.parse).find((x) => x.type === "sheetCollection")?.json ?? "[]");

const audit = workbook.worksheets.getItem("Audit Ausrüstung");
const used = audit.getUsedRange();
const values = used.values;
const headerRow = values.findIndex((row) => String(row[0] ?? "") === "Familie");
if (headerRow < 0) throw new Error("Audit header row not found");
const headers = values[headerRow].map((v) => String(v ?? ""));
const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
const counts = {};
const openPreisliste = [];
for (let r = headerRow + 1; r < values.length; r++) {
  const row = values[r];
  const familie = String(row[idx["Familie"]] ?? "");
  const statusV = String(row[idx["Status Verfügbarkeit"]] ?? "");
  const statusVolk = String(row[idx["Status Völker"]] ?? "");
  const key = `${familie}|${statusV}|${statusVolk}`;
  counts[key] = (counts[key] ?? 0) + 1;
  if (familie === "Preisliste" && statusV === "OFFEN") {
    openPreisliste.push({ excelRow: r + 1, row });
  }
}

const keyRange = await workbook.inspect({
  kind: "table",
  range: "'Audit Ausrüstung'!A1:L18",
  include: "values,formulas",
  tableMaxRows: 18,
  tableMaxCols: 12,
  maxChars: 16000,
});
const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "formula error scan",
  maxChars: 12000,
});

function colName(index) {
  let n = index + 1;
  let out = "";
  while (n > 0) {
    n--;
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26);
  }
  return out;
}

const rendered = [];
for (let i = 0; i < workbook.worksheets.items.length; i++) {
  const sheet = workbook.worksheets.getItemAt(i);
  const sheetValues = sheet.getUsedRange().values;
  const rowCount = Math.max(1, sheetValues.length);
  const colCount = Math.max(1, ...sheetValues.map((r) => r.length));
  const cappedRows = Math.min(rowCount, 70);
  const cappedCols = Math.min(colCount, 20);
  const range = `A1:${colName(cappedCols - 1)}${cappedRows}`;
  const preview = await workbook.render({ sheetName: sheet.name, range, scale: 0.7, format: "png" });
  const safe = `${String(i + 1).padStart(2, "0")}-${sheet.name.replace(/[<>:"/\\|?*]/g, "-")}.png`;
  await fs.writeFile(path.join(previewDir, safe), new Uint8Array(await preview.arrayBuffer()));
  rendered.push({ sheet: sheet.name, usedRows: rowCount, usedCols: colCount, range, file: safe });
}

for (const [label, range] of [["audit-middle", "A900:L970"], ["audit-end", "A1980:L2070"]]) {
  const preview = await workbook.render({ sheetName: "Audit Ausrüstung", range, scale: 0.9, format: "png" });
  const safe = `${label}.png`;
  await fs.writeFile(path.join(previewDir, safe), new Uint8Array(await preview.arrayBuffer()));
  rendered.push({ sheet: "Audit Ausrüstung", range, file: safe });
}

console.log(JSON.stringify({
  sheetNames: workbook.worksheets.items.map((s) => s.name),
  auditUsedRows: values.length,
  auditUsedCols: headers.length,
  auditHeaderRow: headerRow + 1,
  headers,
  counts,
  openPreislisteCount: openPreisliste.length,
  firstOpenPreisliste: openPreisliste.slice(0, 8).map(({ excelRow, row }) => ({ excelRow, values: row.slice(0, 12) })),
  keyRange: keyRange.ndjson,
  formulaErrors: formulaErrors.ndjson,
  previewDir,
  rendered,
}, null, 2));
