type QueryValue = string | null | (string | null)[];

// Match complete UTF-8 sequences so malformed input can be decoded partially
// without repeatedly splitting and retrying an arbitrarily long byte sequence.
const ENCODED_UTF8 = new RegExp(
  [
    '%[0-7][\\dA-F]',
    '%(?:C[2-9A-F]|D[\\dA-F])%[89AB][\\dA-F]',
    '%E0%[AB][\\dA-F]%[89AB][\\dA-F]',
    '%E[1-9A-CEF](?:%[89AB][\\dA-F]){2}',
    '%ED%[89][\\dA-F]%[89AB][\\dA-F]',
    '%F0%[9AB][\\dA-F](?:%[89AB][\\dA-F]){2}',
    '%F[1-3](?:%[89AB][\\dA-F]){3}',
    '%F4%8[\\dA-F](?:%[89AB][\\dA-F]){2}',
  ].join('|'),
  'gi'
);

const decode = (value: string) => {
  if (!value.includes('%')) {
    return value;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value.replace(ENCODED_UTF8, (sequence) =>
      decodeURIComponent(sequence)
    );
  }
};

const encode = (value: string) => {
  if (/^[A-Za-z0-9_.~-]*$/.test(value)) {
    return value;
  }

  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
};

export function parse(query: string): Record<string, QueryValue> {
  const params: Record<string, QueryValue> = Object.create(null);

  query = query.trim().replace(/^[?#&]/, '');

  let start = 0;

  while (start < query.length) {
    if (query[start] === '&') {
      start++;
      continue;
    }

    const end = query.indexOf('&', start);
    const index = end === -1 ? query.length : end;
    const part = query.slice(start, index).replace(/\+/g, ' ');
    const separator = part.indexOf('=');
    const key = decode(separator === -1 ? part : part.slice(0, separator));
    const value = separator === -1 ? null : decode(part.slice(separator + 1));
    const previous = params[key];

    if (previous === undefined) {
      params[key] = value;
    } else if (Array.isArray(previous)) {
      previous.push(value);
    } else {
      params[key] = [previous, value];
    }

    start = index + 1;
  }

  return params;
}

export function stringify(
  params: Record<string, string | string[] | null>
): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      let encodedKey: string | undefined;

      value.forEach((item) => {
        encodedKey ??= encode(key);

        parts.push(`${encodedKey}=${encode(item)}`);
      });

      continue;
    }

    const encodedKey = encode(key);

    if (value === null) {
      if (encodedKey) {
        parts.push(encodedKey);
      }
    } else {
      parts.push(`${encodedKey}=${encode(value)}`);
    }
  }

  return parts.join('&');
}
