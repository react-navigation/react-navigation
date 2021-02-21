// Object.fromEntries is not available in older iOS versions
export default function fromEntries<K extends string, V>(
  entries: (readonly [K, V])[]
) {
  return entries.reduce((acc, [k, v]) => {
    if (acc.hasOwnProperty(k)) {
      throw new Error(`A value for key '${k}' already exists in the object.`);
    }

    acc[k] = v;
    return acc;
  }, {} as Record<K, V>);
}
