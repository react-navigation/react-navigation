type Success = { serializable: true };

type Failure = {
  serializable: false;
  location: (string | number)[];
  reason: string;
};

type Result = Success | Failure;

const SERIALIZABLE: Success = { serializable: true };

const isPlainObject = (o: object): o is Record<string, unknown> => {
  const prototype = Object.getPrototypeOf(o);

  return (
    prototype === null ||
    prototype === Object.prototype ||
    Object.getPrototypeOf(prototype) === null
  );
};

const isSerializablePrimitive = (o: unknown) =>
  typeof o === 'boolean' ||
  typeof o === 'string' ||
  (typeof o === 'number' && Number.isFinite(o) && !Object.is(o, -0));

const checkValue = (o: unknown, ancestors: object[]): Failure | undefined => {
  switch (typeof o) {
    case 'boolean':
    case 'string':
      return undefined;

    case 'number':
      if (Number.isFinite(o) && !Object.is(o, -0)) {
        return undefined;
      }

      return {
        serializable: false,
        location: [],
        reason: Object.is(o, -0) ? 'Negative zero' : String(o),
      };

    case 'function':
      return {
        serializable: false,
        location: [],
        reason: 'Function',
      };

    case 'bigint':
      return {
        serializable: false,
        location: [],
        reason: 'BigInt',
      };

    case 'undefined':
      return {
        serializable: false,
        location: [],
        reason: 'Undefined',
      };

    case 'object':
      if (o === null) {
        return undefined;
      }

      break;

    default:
      return {
        serializable: false,
        location: [],
        reason: String(o),
      };
  }

  const isArray = Array.isArray(o);
  const isPlainArray =
    isArray &&
    (Object.getPrototypeOf(o) === Array.prototype ||
      Array.isArray(Object.getPrototypeOf(o)));

  if ((isArray && !isPlainArray) || (!isArray && !isPlainObject(o))) {
    const objectType = Object.prototype.toString.call(o).slice(8, -1);
    let reason = objectType;

    if (isArray) {
      reason = 'Array subclass';
    } else if (objectType === 'Object') {
      reason = 'Object with a custom prototype';
    }

    return {
      serializable: false,
      location: [],
      reason,
    };
  }

  if (ancestors.includes(o)) {
    return {
      serializable: false,
      reason: 'Circular reference',
      location: [],
    };
  }

  ancestors.push(o);

  if (isArray) {
    const keys = Object.keys(o);

    const isClean =
      keys.length === o.length &&
      (o.length === 0 || keys[o.length - 1] === String(o.length - 1));

    if (isClean) {
      const symbols = Object.getOwnPropertySymbols(o);

      if (symbols.length > 0) {
        return {
          serializable: false,
          location: [String(symbols[0])],
          reason: 'Extra array property',
        };
      }
    } else {
      const names = Object.getOwnPropertyNames(o);
      const symbols = Object.getOwnPropertySymbols(o);

      if (names.length + symbols.length > o.length + 1) {
        for (const key of names) {
          if (key === 'length') {
            continue;
          }

          const index = Number(key);

          if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= o.length ||
            String(index) !== key
          ) {
            return {
              serializable: false,
              location: [key],
              reason: 'Extra array property',
            };
          }
        }

        if (symbols.length > 0) {
          return {
            serializable: false,
            location: [String(symbols[0])],
            reason: 'Extra array property',
          };
        }
      }
    }

    for (let i = 0; i < o.length; i++) {
      if (!isClean && !Object.hasOwn(o, i)) {
        return {
          serializable: false,
          location: [i],
          reason: 'Sparse array',
        };
      }

      const value = o[i];

      if (value === null || isSerializablePrimitive(value)) {
        continue;
      }

      const childResult = checkValue(value, ancestors);

      if (childResult) {
        childResult.location.push(i);
        return childResult;
      }
    }
  } else {
    const keys = Object.keys(o);
    const names = Object.getOwnPropertyNames(o);

    if (keys.length !== names.length) {
      for (const key of names) {
        if (!Object.prototype.propertyIsEnumerable.call(o, key)) {
          return {
            serializable: false,
            location: [key],
            reason: 'Non-enumerable property',
          };
        }
      }
    }

    const symbols = Object.getOwnPropertySymbols(o);

    if (symbols.length > 0) {
      return {
        serializable: false,
        location: [String(symbols[0])],
        reason: 'Symbol key',
      };
    }

    for (const key of keys) {
      const value = o[key];

      if (value == null || isSerializablePrimitive(value)) {
        continue;
      }

      const childResult = checkValue(value, ancestors);

      if (childResult) {
        childResult.location.push(key);
        return childResult;
      }
    }
  }

  ancestors.pop();

  return undefined;
};

export function checkSerializable(o: unknown): Result {
  const result = checkValue(o, []);

  if (!result) {
    return SERIALIZABLE;
  }

  result.location.reverse();

  return result;
}
