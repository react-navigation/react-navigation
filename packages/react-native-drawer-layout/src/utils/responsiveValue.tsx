type Comparison = '>=' | '<=' | '>' | '<';

type MediaCondition =
  | `width ${Comparison} ${number}`
  | `height ${Comparison} ${number}`
  | `orientation: ${'portrait' | 'landscape'}`;

export type ResponsiveMediaQuery = `media (${MediaCondition})`;

/**
 * A value that can change based on the dimensions of the screen.
 * It can be a plain value, or an object with media queries as keys:
 *
 * ```js
 * {
 *   'media (width >= 1024)': 'permanent',
 *   'else': 'front',
 * }
 * ```
 *
 * The queries are evaluated in order and the value for the first matching
 * query is used. The `else` value is used when no queries match.
 */
export type ResponsiveValue<T> = T | ResponsiveValueMap<T>;

type ResponsiveValueMap<T> = {
  [query in ResponsiveMediaQuery]?: T;
} & {
  else: T;
};

const CONDITION_PATTERN =
  /^media \((width|height) (>=|<=|>|<) (\d+(?:\.\d+)?)\)$/;

const ORIENTATION_PATTERN = /^media \(orientation: (portrait|landscape)\)$/;

const isResponsiveMediaQuery = (query: string): query is ResponsiveMediaQuery =>
  query !== 'else';

const invalidMediaQuery = (query: string) =>
  new Error(
    `Invalid media query: '${query}'. Queries must have the syntax 'media (width >= 1024)', 'media (height < 600)' or 'media (orientation: landscape)'.`
  );

const matchesMediaQuery = (
  query: string,
  layout: { width: number; height: number }
): boolean => {
  const condition = query.match(CONDITION_PATTERN);

  if (condition) {
    const [, dimension, operator, threshold] = condition;
    const size = dimension === 'width' ? layout.width : layout.height;
    const limit = Number(threshold);

    switch (operator) {
      case '>=':
        return size >= limit;
      case '<=':
        return size <= limit;
      case '>':
        return size > limit;
      case '<':
        return size < limit;
      default:
        return false;
    }
  }

  const orientation = query.match(ORIENTATION_PATTERN);

  if (orientation) {
    const isPortrait = layout.height >= layout.width;

    return orientation[1] === 'portrait' ? isPortrait : !isPortrait;
  }

  throw invalidMediaQuery(query);
};

/**
 * Convert a media query to the equivalent CSS media query for web.
 * Numbers are treated as `px` values.
 */
export const toCSSMediaQuery = (query: ResponsiveMediaQuery): string => {
  const condition = query.match(CONDITION_PATTERN);

  if (condition) {
    const [, dimension, operator, threshold] = condition;

    return `(${dimension} ${operator} ${threshold}px)`;
  }

  const orientation = query.match(ORIENTATION_PATTERN);

  if (orientation) {
    return `(orientation: ${orientation[1]})`;
  }

  throw invalidMediaQuery(query);
};

/**
 * Get the list of branches for a responsive value in the order they
 * should be evaluated. The last branch has a `null` query and contains
 * the fallback value.
 */
export function getResponsiveValueBranches<T extends string | number | boolean>(
  value: ResponsiveValue<T>
): { query: ResponsiveMediaQuery | null; value: T }[] {
  if (typeof value !== 'object' || value == null) {
    return [{ query: null, value }];
  }

  const branches: { query: ResponsiveMediaQuery | null; value: T }[] = [];

  for (const query of Object.keys(value)) {
    if (isResponsiveMediaQuery(query)) {
      const matched = value[query];

      if (matched !== undefined) {
        branches.push({ query, value: matched });
      }
    }
  }

  branches.push({ query: null, value: value.else });

  return branches;
}

/**
 * Resolve a responsive value to a plain value based on the given layout.
 * The fallback value is returned when the layout is `null`, e.g. during
 * server rendering when the dimensions of the screen are not known.
 */
export function getResponsiveValue<T extends string | number | boolean>(
  value: ResponsiveValue<T>,
  layout: { width: number; height: number } | null
): T {
  if (typeof value !== 'object' || value == null) {
    return value;
  }

  if (layout != null) {
    for (const query of Object.keys(value)) {
      if (isResponsiveMediaQuery(query) && matchesMediaQuery(query, layout)) {
        const matched = value[query];

        if (matched !== undefined) {
          return matched;
        }
      }
    }
  }

  return value.else;
}
