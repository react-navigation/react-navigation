import fs from 'fs';
import path from 'path';

import getLogger from './logger';

const logger = getLogger();

interface IAddReactNativeGestureHandlerImportReturn {
  foundFile: string | null;
  didAddImport: boolean;
}

const addReactNativeGestureHandlerImport = async (
  rootDir: string,
  allowAutoImportPrompt?: () => Promise<boolean> | boolean
): Promise<IAddReactNativeGestureHandlerImportReturn> => {
  const result: IAddReactNativeGestureHandlerImportReturn = {
    foundFile: null,
    didAddImport: false,
  };

  logger.log(
    'Checking and trying to add react-native-gesture-handler package ...'
  );

  for (const indexFileName of ['index.ts', 'index.js', 'App.tsx', 'App.jsx']) {
    logger.log(`Check ${indexFileName} ...`);

    const filePath = path.resolve(rootDir, indexFileName);
    if (fs.existsSync(filePath)) {
      result.foundFile = indexFileName;

      logger.log(`${indexFileName} Found!`);

      let indexFileContent = fs.readFileSync(filePath, 'utf8');

      if (!/import.*?react-native-gesture-handler.*/.test(indexFileContent)) {
        allowAutoImportPrompt = allowAutoImportPrompt || (() => true);
        logger.log('No import was found!');

        /**
         * Inverting because we inverted the enabled with disabled to make Yep go on a one move (UX)
         */
        if (await allowAutoImportPrompt()) {
          const quote = (/['"]/.exec(indexFileContent) || ["'"])[0];
          const importExpression = `import ${quote}react-native-gesture-handler${quote}`;
          indexFileContent = `${importExpression}\n${indexFileContent}`;
          fs.writeFileSync(filePath, indexFileContent, 'utf8');
          logger.log(
            `${importExpression} was added successfully to ${indexFileName}`
          );
          result.didAddImport = true;
        }
      } else {
        logger.log('import already exists!');
      }
      return result;
    }
  }
  logger.warn(
    'No index.(js|ts) or App.(js|ts) were found! (Import not added)!'
  );
  return result;
};

export default addReactNativeGestureHandlerImport;
