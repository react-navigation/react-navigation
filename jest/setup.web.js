/* global require */

// Everything the bare Node environment owns: intrinsics, timers and the globals
// Jest installs. jsdom must not take these over.
const reserved = new Set(Object.getOwnPropertyNames(globalThis));

// Use a fresh JSDOM instance for each test to avoid leaking state between tests.
const install = () => {
  const { JSDOM } = require('jsdom');

  const dom = new JSDOM('<html><head></head><body></body></html>', {
    url: 'http://localhost/',
    // jsdom only defines `requestAnimationFrame` when this is enabled
    pretendToBeVisual: true,
  });

  for (const key of Object.getOwnPropertyNames(dom.window)) {
    if (!reserved.has(key)) {
      globalThis[key] = dom.window[key];
    }
  }

  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.location = dom.window.location;
  globalThis.history = dom.window.history;
  globalThis.navigator = dom.window.navigator;

  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // `screen` is bound to `document.body` when Testing Library is imported,
  // so point its queries at the new document
  const { getQueriesForElement, screen } = require('@testing-library/dom');

  Object.assign(screen, getQueriesForElement(dom.window.document.body));
};

install();

beforeEach(install);
