import * as XLSX from "xlsx-js-style";
import { FIELD_ALIASES, FIELD_LABELS, REQUIRED_FIELDS } from "./constants";
import { extractShortMaterialName } from "./materialName";
import { ImportResult, MovementRow } from "./types";
import { parseExcelDate } from "../utils/dates";
import { normalizeAgentName, normalizeCode, normalizeHeader } from "../utils/normalize";
import { parseNumber } from "../utils/numbers";

const PREPARED: Record<string, string[]> = Object.fromEntries(
  Object.entries(FIELD_ALIASES).map(([key, aliases]) => [key, aliases.map(normalizeHeader)]),
);

function detectHeaderRow(rows: unknown[][]) {
  for (let r = 0; r < Math.min(10, rows.length); r += 1) {
    const row = rows[r] || [];
    const map: Record<string, number> = {};
    const used = new Set<number>();
    for (const field of Object.keys(PREPARED)) {
      for (let c = 0; c < row.length; c += 1) {
        if (used.has(c)) continue;
        const normalized = normalizeHeader(row[c]);
        if (normalized && PREPARED[field].includes(normalized)) {
          map[field] = c;
          used.add(c);
          break;
        }
      }
    }
    const found = REQUIRED_FIELDS.filter(field => map[field] != null).length;
    if (found >= 3) return { rowIndex: r, columnMap: map };
  }
  return null;
}

function detectMovementType(invoiceNo: string): MovementRow["movementType"] {
  const text = invoiceNo.toLowerCase();
  if (text.includes("مبيع") || text.includes("sale")) return "sale";
  if (text.includes("مرتجع") || text.includes("return")) return "return";
  if (text.includes("شراء") || text.includes("purchase")) return "purchase";
  return "unknown";
}

function detectPurchaseClass(materialName: string, invoiceNo: string): MovementRow["purchaseClass"] {
  const text = `${materialName} ${invoiceNo}`;
  if (text.includes("هديه") || text.includes("هدية") || text.includes("gift")) return "gift";
  if (text.includes("شراء") || text.includes("نظامي") || text.includes("regular")) return "regular";
  return "unknown";
}

function parseMovementsFromRows(rows: unknown[][]): ImportResult {
  const header = detectHeaderRow(rows);
  if (!header) throw new Error("لم يتم التعرف على صف العناوين ضمن أول 10 صفوف.");

  const dataRows = rows.slice(header.rowIndex + 1);
  const movements: MovementRow[] = [];
  dataRows.forEach((row, index) => {
    if (!row || row.every(cell => cell === "" || cell == null)) return;
    const code = normalizeCode(row[header.columnMap.materialCode]);
    if (!code) return;
    const name = String(row[header.columnMap.materialName] ?? "").trim();
    const invoiceNo = String(row[header.columnMap.invoiceNo] ?? "").trim();
    const rawAgent = String(row[header.columnMap.agentName] ?? "").trim();
    movements.push({
      id: `mv-${index + 1}`,
      date: parseExcelDate(row[header.columnMap.date]),
      invoiceNo,
      customerName: String(row[header.columnMap.customerName] ?? "").trim(),
      materialCode: code,
      materialNameRaw: name,
      materialShortName: extractShortMaterialName(name),
      agentNameRaw: rawAgent,
      agentName: normalizeAgentName(rawAgent),
      regionName: String(row[header.columnMap.regionName] ?? "").trim(),
      movementType: detectMovementType(invoiceNo),
      quantity: parseNumber(row[header.columnMap.quantity]),
      unit: String(row[header.columnMap.unit] ?? "").trim(),
      unitPrice: parseNumber(row[header.columnMap.unitPrice]),
      totalValue: parseNumber(row[header.columnMap.totalValue]),
      note: "",
      purchaseClass: detectPurchaseClass(name, invoiceNo),
      sourceRowNumber: header.rowIndex + index + 2,
    });
  });

  const missingRequired = REQUIRED_FIELDS.filter(field => header.columnMap[field] == null).map(field => FIELD_LABELS[field]);
  const optionalMissing = Object.keys(FIELD_ALIASES)
    .filter(field => !REQUIRED_FIELDS.includes(field as (typeof REQUIRED_FIELDS)[number]) && header.columnMap[field] == null)
    .map(field => FIELD_LABELS[field]);
  const headers = (rows[header.rowIndex] || []).map(cell => String(cell ?? ""));
  const preview = dataRows.filter(row => row.some(cell => cell !== "" && cell != null)).slice(0, 5).map(row => headers.map((_, i) => String(row[i] ?? "")));

  return { movements, columnMap: header.columnMap, headerRowIndex: header.rowIndex, missingRequired, optionalMissing, preview: { headers, rows: preview } };
}

export function importMovementsFromAOA(rows: unknown[][]): ImportResult {
  return parseMovementsFromRows(rows);
}

export function importMovementsFromExcel(binary: string, inputType: "binary" | "base64" = "binary"): ImportResult {
  const workbook = XLSX.read(binary, { type: inputType, cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });
  return parseMovementsFromRows(rows);
}
