import AsyncStorage from '@react-native-async-storage/async-storage';
import { getManualShortNames, saveManualShortName, clearAllOverrides } from '../src/storage/appStorage';

beforeEach(async () => { await AsyncStorage.clear(); });

test('saves and reads manual short names', async () => {
  await saveManualShortName('0002', 'كيكتي ذهبي');
  const map = await getManualShortNames();
  expect(map['0002']).toBe('كيكتي ذهبي');
});

test('empty name removes the override', async () => {
  await saveManualShortName('0002', 'كيكتي ذهبي');
  await saveManualShortName('0002', '');
  const map = await getManualShortNames();
  expect(map['0002']).toBeUndefined();
});

test('trims whitespace when saving', async () => {
  await saveManualShortName('0002', '   كيكتي ذهبي   ');
  const map = await getManualShortNames();
  expect(map['0002']).toBe('كيكتي ذهبي');
});

test('clearAllOverrides wipes everything', async () => {
  await saveManualShortName('0002', 'A');
  await saveManualShortName('0007', 'B');
  await clearAllOverrides();
  expect(await getManualShortNames()).toEqual({});
});
