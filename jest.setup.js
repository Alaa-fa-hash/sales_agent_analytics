jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    getItem: jest.fn(async key => store[key] ?? null),
    setItem: jest.fn(async (key, value) => { store[key] = value; }),
    removeItem: jest.fn(async key => { delete store[key]; }),
    clear: jest.fn(async () => { store = {}; }),
  };
});

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  types: {
    allFiles: 'public.item',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  errorCodes: {
    OPERATION_CANCELED: 'OPERATION_CANCELED',
  },
  isErrorWithCode: jest.fn((error) => Boolean(error && error.code)),
}));

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
}));
