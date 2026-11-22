export const normalizeHeader = (v: unknown): string =>
  String(v ?? "")
    .trim()
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\.\:\;\,\*\(\)\[\]\-\_\+\/\\'"\?\؟\!\#\@\%\&]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

export const normalizeCode = (v: unknown): string => String(v ?? "").trim();

export const normalizeCostCenter = (v: unknown): string =>
  String(v ?? "")
    .trim()
    .replace(/^مركز\s+كلفة\s+/u, "")
    .replace(/^مركز\s+الكلفة\s+/u, "")
    .replace(/^cost\s+center\s+/i, "")
    .trim();
