/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

let validateFormat: (format?: string) => void = function() {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function(format?: string) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition: boolean, format?: string, ...args: any[]) {
  validateFormat(format);

  if (!condition) {
    let error: Error & { framesToPop?: number };
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
      );
    } else {
      let argIndex = 0;
      error = new Error(format.replace(/%s/g, () => args[argIndex++]));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

export default invariant;
