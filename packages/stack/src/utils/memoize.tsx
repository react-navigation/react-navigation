export function memoize<Result, Deps extends readonly any[]>(
  callback: (...deps: Deps) => Result
) {
  let previous: Deps | undefined;
  let result: Result | undefined;

  return (...dependencies: Deps): Result => {
    let hasChanged = false;

    if (previous) {
      if (previous.length !== dependencies.length) {
        hasChanged = true;
      } else {
        for (let i = 0; i < previous.length; i++) {
          if (previous[i] !== dependencies[i]) {
            hasChanged = true;
            break;
          }
        }
      }
    } else {
      hasChanged = true;
    }

    previous = dependencies;

    if (hasChanged || result === undefined) {
      result = callback(...dependencies);
    }

    return result;
  };
}
