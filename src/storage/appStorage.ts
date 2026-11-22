import AsyncStorage from '@react-native-async-storage/async-storage';

const OVERRIDES_KEY = '@material_guide_overrides_v1';

export const getManualShortNames = async (): Promise<Record<string, string>> => {
  const raw = await AsyncStorage.getItem(OVERRIDES_KEY);
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.entries(parsed).reduce<Record<string, string>>((map, [code, name]) => {
      if (typeof name === 'string' && name.trim()) map[code] = name;
      return map;
    }, {});
  } catch {
    return {};
  }
};

export const saveManualShortName = async (code: string, name: string): Promise<void> => {
  const normalizedCode = code.trim();
  if (!normalizedCode) return;

  const map = await getManualShortNames();
  const trimmed = name.trim();
  if (trimmed) map[normalizedCode] = trimmed;
  else delete map[normalizedCode];
  await AsyncStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
};

export const clearAllOverrides = async (): Promise<void> => {
  await AsyncStorage.removeItem(OVERRIDES_KEY);
};
