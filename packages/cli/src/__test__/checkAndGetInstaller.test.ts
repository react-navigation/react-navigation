import { vol } from 'memfs';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';

jest.mock('fs');

const defaultDirectoriesStructure = {
  projectRoot: {
    childDir: {
      childDir2: {
        'readme.md': 'test',
      },
    },
  },
};

it('No package.json', async () => {
  vol.reset();

  vol.fromNestedJSON(
    defaultDirectoriesStructure,
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe(null);
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe(null);
});

it('Package.json and expo', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'package.json': "{ dependencies: { expo: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe('expo');
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe('expo');
});
