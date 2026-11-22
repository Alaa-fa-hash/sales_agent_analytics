import { MovementRow, MaterialGuideItem } from './types';
import { extractShortMaterialName } from './materialName';
import { normalizeCode } from '../utils/normalize';

export function extractMaterialGuideFromMovements(rows: MovementRow[]): MaterialGuideItem[] {
  const map = new Map<string, MaterialGuideItem>();

  for (const row of rows) {
    const code = normalizeCode(row.materialCode);
    if (!code || map.has(code)) continue;

    map.set(code, {
      materialCode: code,
      materialNameRaw: row.materialNameRaw,
      autoShortName: extractShortMaterialName(row.materialNameRaw),
      lastUpdated: Date.now(),
    });
  }

  return Array.from(map.values()).sort((a, b) => a.materialCode.localeCompare(b.materialCode));
}

export function getDisplayShortName(
  item: MaterialGuideItem,
  overrides: Record<string, string>,
): string {
  return overrides[item.materialCode]?.trim() || item.autoShortName;
}

export function applyOverrides(
  guide: MaterialGuideItem[],
  overrides: Record<string, string>,
): MaterialGuideItem[] {
  return guide.map(item => ({
    ...item,
    manualShortName: overrides[item.materialCode]?.trim() || undefined,
  }));
}
