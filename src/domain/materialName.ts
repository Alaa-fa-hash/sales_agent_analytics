export function extractShortMaterialName(raw: string): string {
  if (!raw) return "";
  let value = raw.replace(/\([^)]*\)/g, "").trim();
  if (value.includes("*")) {
    const parts = value.split("*").map(p => p.trim()).filter(Boolean);
    value = parts[parts.length - 1];
  }
  const stopWords = ["الصوص", "صوص", "شوكولا", "بسكوت", "كيك", "علبه", "نظاميه", "فابي", "قطعه", "اصابع"];
  const words = value.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 1);
  return words[0] || raw.split(/\s+/)[0] || "ماده";
}
