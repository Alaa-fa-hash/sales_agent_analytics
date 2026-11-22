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
