const ROOT_VALIDATION_LIST = [
  '- path (string)',
  '- initialRouteName (string)',
  '- screens (object)',
].join('\n');

const NESTED_VALIDATION_LIST = [
  ROOT_VALIDATION_LIST,
  '- alias (array)',
  '- exact (boolean)',
  '- stringify (object)',
  '- parse (object)',
  '- shared (boolean)',
].join('\n');

const getValidationType = (key: string, root: boolean) => {
  switch (key) {
    case 'path':
    case 'initialRouteName':
      return 'string';
    case 'screens':
      return 'object';
    case 'alias':
      return root ? undefined : 'array';
    case 'exact':
    case 'shared':
      return root ? undefined : 'boolean';
    case 'stringify':
    case 'parse':
      return root ? undefined : 'object';
    default:
      return undefined;
  }
};

export function validatePathConfig(config: unknown, root = true) {
  if (typeof config !== 'object' || config === null) {
    throw new Error(
      `Expected the configuration to be an object, but got ${JSON.stringify(
        config
      )}.`
    );
  }

  const pathConfig = config as Record<string, unknown>;

  let validationErrors: string[] | undefined;

  for (const key in pathConfig) {
    const type = getValidationType(key, root);

    if (type === undefined) {
      (validationErrors ??= []).push(`- ${key} (extraneous)`);
      continue;
    }

    const value = pathConfig[key];

    if (value === undefined) {
      continue;
    }

    if (type === 'array') {
      if (!Array.isArray(value)) {
        (validationErrors ??= []).push(
          `- ${key} (expected 'Array', got '${typeof value}')`
        );
      }
    } else if (typeof value !== type) {
      (validationErrors ??= []).push(
        `- ${key} (expected '${type}', got '${typeof value}')`
      );
    }
  }

  if (validationErrors) {
    throw new Error(
      `Found invalid properties in the configuration:\n${validationErrors.join(
        '\n'
      )}\n\nYou can only specify the following properties:\n${
        root ? ROOT_VALIDATION_LIST : NESTED_VALIDATION_LIST
      }\n\nIf you want to specify configuration for screens, you need to specify them under a 'screens' property.\n\nSee https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration.`
    );
  }

  const path = pathConfig.path;

  if (
    root &&
    'path' in pathConfig &&
    typeof path === 'string' &&
    path.includes(':')
  ) {
    throw new Error(
      `Found invalid path '${path}'. The 'path' in the top-level configuration cannot contain patterns for params.`
    );
  }

  const screens = pathConfig.screens;

  if (screens && typeof screens === 'object') {
    const screenConfig = screens as Record<string, unknown>;

    for (const name in screenConfig) {
      const value = screenConfig[name];

      if (typeof value !== 'string') {
        validatePathConfig(value, false);
      }
    }
  }
}
