const error = console.error;

console.error = (...args) =>
  // Supress error messages regarding error boundary in tests
  /Consider adding an error boundary to your tree to customize error handling behavior/m.test(
    args[0]
  )
    ? void 0
    : error(...args);
