import type { NavigationState } from '@react-navigation/core';

export function getStateBreadcrumb(
  state: NavigationState,
  location: (string | number)[]
) {
  let breadcrumb = '';
  let pointer: Record<any, any> = state;
  let params = false;

  for (let i = 0; i < location.length; i++) {
    const curr = location[i];
    const prev = location[i - 1];

    if (curr == null) {
      continue;
    }

    pointer = pointer[curr];

    if (!params && curr === 'state') {
      continue;
    } else if (!params && curr === 'routes') {
      if (breadcrumb) {
        breadcrumb += ' > ';
      }
    } else if (!params && typeof curr === 'number' && prev === 'routes') {
      breadcrumb += pointer?.name;
    } else if (!params) {
      breadcrumb += ` > ${curr}`;
      params = true;
    } else {
      if (typeof curr === 'number' || /^[0-9]+$/.test(curr)) {
        breadcrumb += `[${curr}]`;
      } else if (/^[a-z$_]+$/i.test(curr)) {
        breadcrumb += `.${curr}`;
      } else {
        breadcrumb += `[${JSON.stringify(curr)}]`;
      }
    }
  }

  return breadcrumb;
}
