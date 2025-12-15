// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Provide a minimal CSS.supports stub for Highcharts maps in JSDOM
if (!global.CSS) {
  global.CSS = {};
}
if (typeof global.CSS.supports !== 'function') {
  global.CSS.supports = () => false;
}

// Mock @highcharts/react to avoid ESM/DOM issues in Jest
jest.mock('@highcharts/react', () => {
  const React = require('react');
  return {
    Chart: ({ children }) => React.createElement('div', null, children),
    setHighcharts: () => {}
  };
});
