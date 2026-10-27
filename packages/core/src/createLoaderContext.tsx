const getValue = Symbol('getValue');
const setValue = Symbol('setValue');

export type LoaderContextToken<T> = {
  [getValue]: (scope: object) => T;
  [setValue]: (scope: object, value: T) => void;
};

export type LoaderContext = {
  get: <T>(context: LoaderContextToken<T>) => T;
};

export type LoaderContextInitializer = (context: {
  set: <T>(context: LoaderContextToken<T>, value: NoInfer<T>) => void;
}) => void;

/**
 * Create a typed context token for values provided to loaders.
 */
export function createLoaderContext<T>(): LoaderContextToken<T> {
  const values = new WeakMap<object, { value: T }>();

  return {
    [getValue](scope) {
      const entry = values.get(scope);

      if (entry === undefined) {
        throw new Error(
          "Couldn't find a value for the loader context. Provide it with 'ctx.set' in the 'loaderContext' callback on NavigationContainer or the 'context' callback passed to the loader."
        );
      }

      return entry.value;
    },
    [setValue](scope, value) {
      values.set(scope, { value });
    },
  };
}

export function initializeLoaderContext(
  initialize: LoaderContextInitializer | undefined
): LoaderContext {
  const scope = {};

  initialize?.({
    set(context, value) {
      context[setValue](scope, value);
    },
  });

  return {
    get(context) {
      return context[getValue](scope);
    },
  };
}
