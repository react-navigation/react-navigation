/* global console */

const error = console.error;
const warn = console.warn;

console.error = (...args) =>
  // Suppress error messages regarding error boundary in tests
  /(Consider adding an error boundary to your tree to customize error handling behavior|React will try to recreate this component tree from scratch using the error boundary you provided|Error boundaries should implement getDerivedStateFromError)/m.test(
    args[0]
  ) ||
  (args[1] === 'LogBoxStateSubscription' &&
    /An update to %s inside a test was not wrapped in act/m.test(args[0]))
    ? void 0
    : error(...args);

console.warn = (...args) =>
  /InteractionManager has been deprecated and will be removed in a future release/m.test(
    args[0]
  )
    ? void 0
    : warn(...args);
