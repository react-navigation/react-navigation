export default function isSerializable(o: { [key: string]: any }): boolean {
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

  if (Array.isArray(o)) {
    for (const it of o) {
      if (!isSerializable(it)) {
        return false;
      }
    }
  } else {
    for (const key in o) {
      if (!isSerializable(o[key])) {
        return false;
      }
    }
  }

  return true;
}
