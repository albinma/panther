// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// https://github.com/pacocoursey/next-themes/issues/21
let localStorageMock;

beforeAll(() => {
  // Create a mock of the window.matchMedia function
  global.matchMedia = jest.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  // Create mocks of localStorage getItem and setItem functions
  global.Storage.prototype.getItem = jest.fn((key) => localStorageMock[key]);
  global.Storage.prototype.setItem = jest.fn((key, value) => {
    localStorageMock[key] = value;
  });
});

beforeEach(() => {
  // Clear the localStorage-mock
  localStorageMock = {};
});
