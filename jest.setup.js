jest.mock('react-native-document-picker', () => ({
  __esModule: true,
  default: {
    pickSingle: jest.fn(),
    isCancel: jest.fn(() => false),
    types: { xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  },
}));

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
}));
