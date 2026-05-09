type Result =
  | { serializable: true }
  | {
      serializable: false;
      location: (string | number)[];
      reason: string;
    };

const checkSerializableWithoutCircularReference = (
  o: { [key: string]: any },
  seen: Set<any>,
  location: (string | number)[]
): Result => {
  if (
    o === undefined ||
    o === null ||
    typeof o === 'boolean' ||
    typeof o === 'number' ||
    typeof o === 'string'
  ) {
    return { serializable: true };
  }

  if (
    Object.prototype.toString.call(o) !== '[object Object]' &&
    !Array.isArray(o)
  ) {
    return {
      serializable: false,
      location: location.slice(),
      reason: typeof o === 'function' ? 'Function' : String(o),
    };
  }

  if (seen.has(o)) {
    return {
      serializable: false,
      reason: 'Circular reference',
      location: location.slice(),
    };
  }

  seen.add(o);

  if (Array.isArray(o)) {
    for (let i = 0; i < o.length; i++) {
      location.push(i);
      const childResult = checkSerializableWithoutCircularReference(
        o[i],
        seen,
        location
      );
      location.pop();

      if (!childResult.serializable) {
        seen.delete(o);
        return childResult;
      }
    }
  } else {
    for (const key in o) {
      location.push(key);
      const childResult = checkSerializableWithoutCircularReference(
        o[key],
        seen,
        location
      );
      location.pop();

      if (!childResult.serializable) {
        seen.delete(o);
        return childResult;
      }
    }
  }

  seen.delete(o);

  return { serializable: true };
};

export function checkSerializable(o: { [key: string]: any }) {
  return checkSerializableWithoutCircularReference(o, new Set<any>(), []);
}
