/* global console */

const CONSOLE_FAIL_TYPES = ['error', 'warn'];

CONSOLE_FAIL_TYPES.forEach((type) => {
  console[type] = (message) => {
    throw new Error(`Unexpected console.${type}!\n\n${message}`);
  };
});
