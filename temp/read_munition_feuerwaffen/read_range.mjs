import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "E:\\Das Western Rollenspiel\\LLM\\werte 0.8-claude.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Munition-Feuerwaffen");
const range = sheet.getRange("A1:D39");

console.log(JSON.stringify({
  workbook: inputPath,
  sheet: "Munition-Feuerwaffen",
  range: "A1:D39",
  values: range.values,
  formulas: range.formulas,
}, null, 2));
