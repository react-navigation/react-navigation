export const isPlainObject = (value: unknown): value is object => {
  if (typeof value === 'object' && value !== null) {
    return Object.getPrototypeOf(value) === Object.prototype;
  }

  return false;
};

export const deepFreeze = <T,>(object: T): Readonly<T> => {
  // We only freeze in development to catch issues early
  // Don't freeze in production to avoid unnecessary performance overhead
  if (process.env.NODE_ENV === 'production') {
    return object;
  }

  if (Object.isFrozen(object)) {
    return object;
  }

  if (!isPlainObject(object) && !Array.isArray(object)) {
    return object;
  }

  // Freeze properties before freezing self
  for (const key in object) {
    if (Object.getOwnPropertyDescriptor(object, key)?.configurable) {
      const value = object[key];

      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
