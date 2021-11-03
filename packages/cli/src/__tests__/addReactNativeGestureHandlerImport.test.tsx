import { vol as mockVol } from 'memfs';

import addReactNativeGestureHandlerImport, {
  getAfterTrailingCommentsIndex,
  transformSource,
} from '../utils/addReactNativeGestureHandlerImport';
import getLogger from '../utils/logger';

/**
 * Mocking fs
 */
jest.mock('fs', () => mockVol);

beforeAll(() => {
  getLogger().disable();
});

/**
 * Files detections
 */
describe('index file found and contains no imports', () => {
  it('index.js exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.js': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.js');
  });

  it('App.jsx exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.jsx': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('App.jsx');
  });

  it('index.ts exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.ts');
  });

  it('App.tsx exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.tsx': 'import chwips from "chwips";\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('App.tsx');
  });

  it('App.jsx and index.s (prioritizing index.ts)', async () => {
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

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.js'); // prioritizing index.js
  });

  it('App.tsx and index.ts (prioritizing index.ts)', async () => {
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

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(true);
    expect(foundFile).toBe('index.ts'); // prioritizing index.ts
  });
});

describe('index file found and contains import statement', () => {
  it('index.js exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.js': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.js');
  });

  it('App.jsx exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.jsx': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('App.jsx');
  });

  it('index.ts exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.ts');
  });

  it('App.tsx exists', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'App.tsx': 'import "react-native-gesture-handler"\n',
        },
      },
      '/testTmp'
    );

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('App.tsx');
  });

  it('App.jsx and index.s (prioritizing index.ts)', async () => {
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

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.js'); // prioritizing index.js
  });

  it('App.tsx and index.ts (prioritizing index.ts)', async () => {
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

    const { didAddImport, foundFile } =
      await addReactNativeGestureHandlerImport('/testTmp/project');
    expect(didAddImport).toBe(false);
    expect(foundFile).toBe('index.ts'); // prioritizing index.ts
  });
});

describe('Test quote type auto detection', () => {
  it('Single Quote', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': "import chwips from 'chwips'\n",
        },
      },
      '/testTmp'
    );

    await addReactNativeGestureHandlerImport('/testTmp/project');

    const fileContent = mockVol.readFileSync(
      '/testTmp/project/index.ts'
    ) as string;
    const importStatement = (/import.*?react-native-gesture-handler./.exec(
      fileContent
    ) || [])[0];
    const quote = (/['"]/.exec(importStatement) || [])[0];
    expect(quote).toBe("'");
  });

  it('Double Quote', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      {
        project: {
          'index.ts': 'import chwips from "chwips"\n',
        },
      },
      '/testTmp'
    );

    await addReactNativeGestureHandlerImport('/testTmp/project');

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

/**
 * File transformation
 */
describe('Test file transformation', () => {
  const commentsBlocks = [
    '      // 156 some trailing comment',
    '  // Another trailing one',
    '/*A one liner star*/',
    '/*\n Multi liners two stars \n*/',
    '    /*another one with space */',
    '/**\n* @format\n*/',
  ];

  const sourceWithoutComments =
    `import { AppRegistry } from 'react-native'\n` +
    `import App from './src/App'\n` +
    `import { name as appName } from './app.json'\n` +
    `\n` +
    `AppRegistry.registerComponent(appName, () => App)\n`;

  describe('Index after trailing comments', () => {
    it('There is trailing comments', () => {
      const check = (commentBlock: string) => {
        const source = `${commentBlock}\n\n${sourceWithoutComments}`;
        const index = getAfterTrailingCommentsIndex(source);
        expect(index).toBe(commentBlock.length);
      };

      for (const commentBlock of commentsBlocks) {
        check(commentBlock);
      }

      check(commentsBlocks.join('\n'));
      check(commentsBlocks.join('\n\n'));
    });

    it('No trailing comments', () => {
      expect(getAfterTrailingCommentsIndex(sourceWithoutComments)).toBe(0);
    });
  });

  describe('Source transform', () => {
    const importExpression = `import 'react-native-gesture-handler'`;

    it('There is trailing comments', () => {
      const check = (commentBlock: string) => {
        const source = `${commentBlock}\n\n${sourceWithoutComments}`;
        const expectedOutSource = `${commentBlock}\n\n${importExpression}\n${sourceWithoutComments}`;
        const outSource = transformSource(source, importExpression);

        expect(outSource).toBe(expectedOutSource);
      };

      for (const commentBlock of commentsBlocks) {
        check(commentBlock);
      }

      check(commentsBlocks.join('\n'));
      check(commentsBlocks.join('\n\n'));
    });

    it('Trailing comments, no import, import in comment', () => {
      const check = (commentBlock: string) => {
        const _sourceWithoutComment =
          'const ok = "nice";\n// import power from';
        const source = `${commentBlock}\n\n${_sourceWithoutComment}`;
        const expectedOutSource = `${commentBlock}\n\n${importExpression}\n\n${_sourceWithoutComment}`;
        const outSource = transformSource(source, importExpression);

        expect(outSource).toBe(expectedOutSource);
      };

      for (const commentBlock of commentsBlocks) {
        check(commentBlock);
      }

      check(commentsBlocks.join('\n'));
      check(commentsBlocks.join('\n\n'));
    });

    it('No trailing comments', () => {
      const expectedOutSource = `${importExpression}\n${sourceWithoutComments}`;
      const outSource = transformSource(
        sourceWithoutComments,
        importExpression
      );
      expect(outSource).toBe(expectedOutSource);
    });
  });
});
