import { NavigationStackOptions } from '../types';

type Validation = {
  check: (o: NavigationStackOptions) => boolean;
  deprecated: string;
  updated: string;
};

let shownWarnings: string[] = [];

const validations: Validation[] = [
  {
    check: o => o.header === null,
    deprecated: 'header: null',
    updated: 'headerShown: false',
  },
  {
    check: o => o.header != null && typeof o.header !== 'function',
    deprecated: 'header: <SomeElement />',
    updated: 'header: () => <SomeElement />',
  },
  {
    check: o =>
      o.headerTitle !== undefined &&
      typeof o.header !== 'string' &&
      typeof o.header !== 'function',
    deprecated: 'headerTitle: <SomeElement />',
    updated: 'headerTitle: () => <SomeElement />',
  },
  ...['headerLeft', 'headerRight', 'headerBackground', 'backImage'].map(p => ({
    check: (o: any) => o[p] !== undefined && typeof o[p] !== 'function',
    deprecated: `${p}: <SomeElement />`,
    updated: `${p}: () => <SomeElement />`,
  })),
];

export default function validateDeprecatedOptions(
  options: NavigationStackOptions
) {
  const warnings: Validation[] = [];

  // Validate options to show warnings for deprecations
  validations.forEach(v => {
    if (shownWarnings.includes(v.deprecated)) {
      return;
    }

    if (v.check(options)) {
      warnings.push(v);
      shownWarnings.push(v.deprecated);
    }
  });

  if (warnings.length) {
    console.warn(
      `Deprecation in 'navigationOptions':\n${warnings
        .map(
          v =>
            `- '${v.deprecated}' will be removed in a future version. Use '${v.updated}' instead`
        )
        .join('\n')}`
    );
  }
}
