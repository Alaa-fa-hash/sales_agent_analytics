export const roundCash = (value: number, unit = 1000): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value / unit) * unit;
};

export const invoiceCount = (rows: { invoiceNo: string }[]): number =>
  new Set(rows.map(row => row.invoiceNo).filter(Boolean)).size;
