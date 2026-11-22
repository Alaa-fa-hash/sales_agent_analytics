import { extractMaterialGuideFromMovements, getDisplayShortName, applyOverrides } from '../src/domain/materialGuide';
import { extractShortMaterialName } from '../src/domain/materialName';
import { MovementRow, MaterialGuideItem } from '../src/domain/types';

const makeRow = (code: string, name: string): MovementRow => ({
  id: `t-${code}-${Math.random()}`, date: null, invoiceNo: 'X', customerName: '',
  materialCode: code, materialNameRaw: name,
  materialShortName: extractShortMaterialName(name),
  agentNameRaw: '', agentName: '', regionName: '',
  movementType: 'sale', quantity: 1, unit: 'طرد',
  unitPrice: 1000, totalValue: 1000,
  note: '', purchaseClass: 'regular', sourceRowNumber: 0,
});

test('extracts unique materials by code', () => {
  const guide = extractMaterialGuideFromMovements([
    makeRow('0002', 'الصوص * كيكتي (حليب محشي شوكولا سائلة 9 × 12 ق )'),
    makeRow('0002', 'الصوص * كيكتي نسخة ثانية'),
    makeRow('0007', 'شوكولا دونيستا محشي ( 9 × 12 ق )'),
  ]);
  expect(guide).toHaveLength(2);
  expect(guide.find(g => g.materialCode === '0002')).toBeTruthy();
  expect(guide.find(g => g.materialCode === '0007')).toBeTruthy();
});

test('preserves leading zeros in material code', () => {
  const guide = extractMaterialGuideFromMovements([makeRow('0002', 'X')]);
  expect(guide[0].materialCode).toBe('0002');
});

test('sorts by material code ascending', () => {
  const guide = extractMaterialGuideFromMovements([
    makeRow('0007', 'A'), makeRow('0002', 'B'), makeRow('06488', 'C'),
  ]);
  expect(guide.map(g => g.materialCode)).toEqual(['0002', '0007', '06488']);
});

test('extractShortMaterialName picks word after star', () => {
  expect(extractShortMaterialName('الصوص * كيكتي (حليب محشي شوكولا سائلة 9 × 12 ق )')).toBe('كيكتي');
  expect(extractShortMaterialName('شوكولا دونيستا محشي ( 9 × 12 ق )')).toBe('دونيستا');
});

test('getDisplayShortName prefers manual override', () => {
  const item: MaterialGuideItem = {
    materialCode: '0002', materialNameRaw: 'X', autoShortName: 'كيكتي', lastUpdated: 0,
  };
  expect(getDisplayShortName(item, { '0002': 'كيكتي ذهبي' })).toBe('كيكتي ذهبي');
  expect(getDisplayShortName(item, {})).toBe('كيكتي');
});

test('applyOverrides merges manual names', () => {
  const guide = [{ materialCode: '0002', materialNameRaw: 'X', autoShortName: 'كيكتي', lastUpdated: 0 }];
  const result = applyOverrides(guide, { '0002': 'كيكتي ذهبي' });
  expect(result[0].manualShortName).toBe('كيكتي ذهبي');
});
