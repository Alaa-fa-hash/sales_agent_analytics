export type MovementType = "sale" | "return" | "purchase" | "unknown";
export type PurchaseClass = "regular" | "gift" | "unknown";

export interface MovementRow {
  id: string;
  date: Date | null;
  invoiceNo: string;
  customerName: string;
  materialCode: string;
  materialNameRaw: string;
  materialShortName: string;
  agentNameRaw: string;
  agentName: string;
  regionName: string;
  movementType: MovementType;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  note: string;
  purchaseClass: PurchaseClass;
  sourceRowNumber: number;
}

export interface MaterialGuideItem {
  materialCode: string;
  materialNameRaw: string;
  autoShortName: string;
  manualShortName?: string;
  lastUpdated: number;
}

export interface ImportPreview {
  headers: string[];
  rows: string[][];
}

export interface ImportResult {
  movements: MovementRow[];
  columnMap: Record<string, number>;
  headerRowIndex: number;
  missingRequired: string[];
  optionalMissing: string[];
  preview: ImportPreview;
}
