import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load("E:/Das Western Rollenspiel/LLM/NN Preisliste v1.2.xlsx"));
console.log((await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 8000 })).ndjson);
for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange().values;
  console.log(JSON.stringify({ sheet: sheet.name, rows: used.length, cols: Math.max(0, ...used.map((r) => r.length)), sample: used.slice(0, 25).map((r) => r.slice(0, 12)) }));
}
