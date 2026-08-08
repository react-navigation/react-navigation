export type PatternPart = {
  segment: string;
  param?: string;
  regex?: string;
  optional?: boolean;
  repeat?: 'zero-or-more' | 'one-or-more';
};

/**
 * Parse a path into an array of parts with information about each segment.
 */
export function getPatternParts(path: string): PatternPart[] {
  const parts: PatternPart[] = [];

  let current: PatternPart = { segment: '' };

  let isRegex = false;
  let isParam = false;
  let hasRepeat = false;
  let isEscaped = false;
  let isInCharClass = false;
  let regexInnerParens = 0;

  // One extra iteration to add the last character
  for (let i = 0; i <= path.length; i++) {
    const char = path[i];

    if (char != null) {
      current.segment += char;
    }

    if (char === ':') {
      // The segment must start with a colon if it's a param
      if (current.segment === ':') {
        isParam = true;
      } else if (!isRegex) {
        throw new Error(
          `Encountered ':' in the middle of a segment in path: ${path}`
        );
      }
    } else if (char === '(' && !isEscaped && !isInCharClass) {
      if (isParam) {
        if (isRegex) {
          // The '(' is part of the regex if we're already inside one
          regexInnerParens++;
        } else {
          isRegex = true;
        }
      } else {
        throw new Error(
          `Encountered '(' without preceding ':' in path: ${path}`
        );
      }
    } else if (char === ')' && !isEscaped && !isInCharClass) {
      if (isParam && isRegex) {
        if (regexInnerParens) {
          // The ')' is part of the regex if we're already inside one
          regexInnerParens--;
        } else {
          current.regex += char;
          isRegex = false;
          isParam = false;
        }
      } else {
        throw new Error(
          `Encountered ')' without preceding '(' in path: ${path}`
        );
      }
    } else if (char === '?' && !isRegex) {
      if (current.param) {
        isParam = false;

        current.optional = true;
      } else {
        throw new Error(
          `Encountered '?' without preceding ':' in path: ${path}`
        );
      }
    } else if (
      current.param &&
      !isRegex &&
      (char === '*' || char === '+') &&
      (path[i + 1] == null ||
        path[i + 1] === '/' ||
        path[i + 1] === '?' ||
        path[i + 1] === '*' ||
        path[i + 1] === '+')
    ) {
      if (
        current.optional ||
        (path[i + 1] !== undefined && path[i + 1] !== '/')
      ) {
        throw new Error(`Cannot combine path param modifiers in path: ${path}`);
      }

      isParam = false;

      current.repeat = char === '*' ? 'zero-or-more' : 'one-or-more';
      hasRepeat = true;
    } else if (char == null || (char === '/' && !isRegex)) {
      isParam = false;

      // Remove trailing slash from segment
      current.segment = current.segment.replace(/\/$/, '');

      if (current.segment === '') {
        continue;
      }

      if (current.param) {
        current.param = current.param.replace(/^:/, '');
      }

      if (current.regex) {
        current.regex = current.regex.replace(/^\(/, '').replace(/\)$/, '');
      }

      parts.push(current);

      if (char == null) {
        break;
      }

      current = { segment: '' };
    }

    if (isRegex) {
      current.regex = current.regex || '';
      current.regex += char;

      // Track escapes and character classes so parens inside them are not special
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === '[') {
        isInCharClass = true;
      } else if (char === ']') {
        isInCharClass = false;
      }
    }

    if (isParam && !isRegex) {
      current.param = current.param || '';
      current.param += char;
    }
  }

  if (isRegex) {
    throw new Error(`Could not find closing ')' in path: ${path}`);
  }

  const params = parts.map((part) => part.param).filter(Boolean);

  for (const [index, param] of params.entries()) {
    if (params.indexOf(param) !== index) {
      throw new Error(`Duplicate param name '${param}' found in path: ${path}`);
    }
  }

  if (hasRepeat) {
    validateRepeatedParts(parts, path);
  }

  return parts;
}

function validateRepeatedParts(parts: PatternPart[], path: string) {
  let variablePart: PatternPart | undefined;

  for (const part of parts) {
    if (!part.param && part.segment !== '*') {
      variablePart = undefined;
      continue;
    }

    if (!part.repeat && !part.optional && part.segment !== '*') {
      continue;
    }

    if (variablePart && (variablePart.repeat || part.repeat)) {
      throw new Error(
        `A repeated param must be separated from optional, repeated, or wildcard segments by a static segment: ${path}`
      );
    }

    variablePart = part;
  }
}

export function combinePatternParts<T extends PatternPart>(
  parentParts: T[],
  parts: T[],
  exact = false
): T[] {
  const combined = exact ? parts : [...parentParts, ...parts];

  if (combined.some((part) => part.repeat)) {
    validateRepeatedParts(
      combined,
      combined.map((part) => part.segment).join('/')
    );
  }

  return combined;
}
