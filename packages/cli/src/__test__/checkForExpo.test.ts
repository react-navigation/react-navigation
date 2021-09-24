import isExpoADependency from '../utils/isExpoADependency';

it('expo in dependencies', async () => {
  const packageJson = {
    dependencies: {
      expo: '^42.0.3',
    },
  };

  const isADependency = isExpoADependency(JSON.stringify(packageJson, null, 4));

  expect(isADependency).toBe(true);
});

it('expo in devDependencies', async () => {
  const packageJson = {
    devDependencies: {
      expo: '^42.0.3',
    },
  };

  const isADependency = isExpoADependency(JSON.stringify(packageJson, null, 4));

  expect(isADependency).toBe(true);
});

it('expo is not a dependency', async () => {
  const packageJson = {
    devDependencies: {
      'react-navigation': '^6.0.0',
    },
  };

  const isADependency = isExpoADependency(JSON.stringify(packageJson, null, 4));

  expect(isADependency).toBe(false);
});
