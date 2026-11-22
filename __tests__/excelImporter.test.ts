import * as XLSX from "xlsx-js-style";
import { importMovementsFromAOA, importMovementsFromExcel } from "../src/domain/excelImporter";
import { normalizeAgentName } from "../src/utils/normalize";

function binaryWorkbook(rows: unknown[][]): string {
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "الحركة");
  return XLSX.write(book, { type: "binary", bookType: "xlsx" });
}

describe("excelImporter", () => {
  it("imports valid rows and preserves a leading-zero material code", () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["التاريخ", "الفاتورة", "اسم الزبون", "رمز المادة", "اسم المادة", "الكمية", "السعر", "القيمة", "مركز الكلفة", "المنطقة"],
      ["2026-10-01", "مبيع: 1", "زبون", "0002", "الصوص * كيكتي (علبة)", -2, 335000, -670000, "مندوب 1", "يلدا"],
    ]));
    expect(result.missingRequired).toEqual([]);
    expect(result.movements[0].materialCode).toBe("0002");
    expect(result.movements[0].materialShortName).toBe("كيكتي");
  });

  it('recognizes "Customer Name"', () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["التاريخ", "الفاتورة", "Customer Name", "كود الصنف", "الكمية"],
      ["2026-10-01", "sale 2", "Customer", "06488", 3],
    ]));
    expect(result.movements[0].customerName).toBe("Customer");
  });

  it("detects header row in row 3", () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["عنوان التقرير"], [], ["التاريخ", "الفاتورة", "اسم الزبون", "رمز المادة", "الكمية"],
      ["2026-10-01", "sale 2", "Customer", "06488", 3],
    ]));
    expect(result.headerRowIndex).toBe(2);
    expect(result.movements[0].materialCode).toBe("06488");
  });

  it("reports missing required columns", () => {
    const result = importMovementsFromExcel(binaryWorkbook([["التاريخ", "الفاتورة", "رمز المادة"], ["2026-10-01", "1", "0002"]]));
    expect(result.missingRequired).toContain("الكمية");
  });

  it('recognizes "اسم  الزبون" with double space', () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["التاريخ", "الفاتورة", "اسم  الزبون", "رمز المادة", "الكمية"],
      ["2026-10-01", "1", "زبون", "0002", 1],
    ]));
    expect(result.columnMap.customerName).toBe(2);
  });

  it('recognizes "أسم الزبون" (hamza above alef)', () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["التاريخ", "الفاتورة", "أسم الزبون", "رمز المادة", "الكمية"],
      ["2026-10-01", "1", "زبون", "0002", 1],
    ]));
    expect(result.columnMap.customerName).toBe(2);
  });

  it('recognizes "فاتوره" (haa instead of taa marbuta)', () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["التاريخ", "فاتوره", "رمز المادة", "الكمية"],
      ["2026-10-01", "1", "0002", 1],
    ]));
    expect(result.columnMap.invoiceNo).toBe(1);
  });

  it('strips "مركز كلفة " prefix from the agent name', () => {
    const result = importMovementsFromExcel(binaryWorkbook([
      ["التاريخ", "الفاتورة", "رمز المادة", "الكمية", "مركز الكلفة"],
      ["2026-10-01", "1", "0002", 1, "مركز كلفة بهجت نقاوة"],
    ]));
    expect(result.movements[0].agentNameRaw).toBe("مركز كلفة بهجت نقاوة");
    expect(result.movements[0].agentName).toBe("بهجت نقاوة");
  });

  it("splits agentNameRaw and normalizes agentName", () => {
    const result = importMovementsFromAOA([
      ["التاريخ", "الفاتورة", "اسم الزبون", "رمز المادة", "الكمية", "مركز الكلفة"],
      ["2026-09-15", "مبيع: 1", "زبون أ", "0002", "-1", "مركز كلفة بهجت نقاوة"],
    ]);
    expect(result.movements[0].agentNameRaw).toBe("مركز كلفة بهجت نقاوة");
    expect(result.movements[0].agentName).toBe("بهجت نقاوة");
  });

  it("explicit agent column takes precedence over the agent alias", () => {
    const result = importMovementsFromAOA([
      ["التاريخ", "الفاتورة", "اسم الزبون", "رمز المادة", "الكمية", "المندوب", "مركز الكلفة"],
      ["2026-09-15", "مبيع: 1", "زبون أ", "0002", "-1", "أحمد", "مركز كلفة بهجت نقاوة"],
    ]);
    expect(result.movements[0].agentName).toBe("أحمد");
  });

  it("normalizeAgentName handles edge cases", () => {
    expect(normalizeAgentName("")).toBe("");
    expect(normalizeAgentName("   ")).toBe("");
    expect(normalizeAgentName("مركز كلفة بهجت نقاوة")).toBe("بهجت نقاوة");
    expect(normalizeAgentName("مركز كلفه ابي خليل")).toBe("ابي خليل");
    expect(normalizeAgentName("مركز الكلفة بهجت")).toBe("مركز الكلفة بهجت");
    expect(normalizeAgentName("cost center John")).toBe("John");
    expect(normalizeAgentName("بهجت نقاوة")).toBe("بهجت نقاوة");
  });
});
