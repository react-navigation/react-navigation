import { vol as mockVol } from 'memfs';
import addReactNativeGestureHandlerImport from '../utils/addReactNativeGestureHandlerImport';
import getLogger from '../utils/logger';

/**
 * Mocking fs
 */
jest.mock('fs', () => mockVol);

beforeAll(() => {
  getLogger().disable();
});

describe('index file found and contains no imports', () => {
  it('index.js exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.js': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.js');
  });

  it('App.jsx exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.jsx': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('App.jsx');
  });

  it('index.ts exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.ts');
  });

  it('App.tsx exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.tsx': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('App.tsx');
  });

  it('App.jsx and index.s (prioritizing index.ts)', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.jsx': 'import chwips from "chwips";\n',
          'index.js': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.js'); // prioritizing index.js
  });

  it('App.tsx and index.ts (prioritizing index.ts)', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.tsx': 'import chwips from "chwips";\n',
          'index.ts': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.ts'); // prioritizing index.ts
  });
});

describe('index file found and contains import statement', () => {
  it('index.js exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.js': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.js');
  });

  it('App.jsx exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.jsx': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('App.jsx');
  });

  it('index.ts exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.ts');
  });

  it('App.tsx exists', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.tsx': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('App.tsx');
  });

  it('App.jsx and index.s (prioritizing index.ts)', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.jsx': 'import "react-native-gesture-handler"\n',
          'index.js': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.js'); // prioritizing index.js
  });

  it('App.tsx and index.ts (prioritizing index.ts)', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.tsx': 'import "react-native-gesture-handler"\n',
          'index.ts': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } = addReactNativeGestureHandlerImport(
      '/testTmp/project'
    );
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.ts'); // prioritizing index.ts
  });
});

describe('Test quote type auto detection', () => {
  it('Single Quote', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': "import chwips from 'chwips'\n",
        },
      },
      '/testTmp'
    );

    addReactNativeGestureHandlerImport('/testTmp/project');

    const fileContent = mockVol.readFileSync(
      '/testTmp/project/index.ts'
    ) as string;
    const importStatement = (/import.*?react-native-gesture-handler./.exec(
      fileContent
    ) || [])[0];
    const quote = (/['"]/.exec(importStatement) || [])[0];
    expect(quote).toBe("'");
  });

  it('Double Quote', () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': 'import chwips from "chwips"\n',
        },
      },
      '/testTmp'
    );

    addReactNativeGestureHandlerImport('/testTmp/project');

    const fileContent = mockVol.readFileSync(
      '/testTmp/project/index.ts'
    ) as string;
    const importStatement = (/import.*?react-native-gesture-handler./.exec(
      fileContent
    ) || [])[0];
    const quote = (/['"]/.exec(importStatement) || [])[0];
    expect(quote).toBe('"');
  });
});
