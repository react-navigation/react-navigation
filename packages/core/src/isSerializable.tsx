const isSerializableWithoutCircularReference = (
  o: { [key: string]: any },
  seen: Set<any>
): boolean => {
  if (
    o === undefined ||
    o === null ||
    typeof o === 'boolean' ||
    typeof o === 'number' ||
    typeof o === 'string'
  ) {
    return true;
  }

  if (
    Object.prototype.toString.call(o) !== '[object Object]' &&
    !Array.isArray(o)
  ) {
    return false;
  }

  if (seen.has(o)) {
    return false;
  }

  seen.add(o);

  if (Array.isArray(o)) {
    for (const it of o) {
      if (!isSerializableWithoutCircularReference(it, new Set<any>(seen))) {
        return false;
      }
    }
  } else {
    for (const key in o) {
      if (!isSerializableWithoutCircularReference(o[key], new Set<any>(seen))) {
        return false;
      }
    }
  }

  return true;
};

export default function isSerializable(o: { [key: string]: any }) {
  return isSerializableWithoutCircularReference(o, new Set<any>());
}
