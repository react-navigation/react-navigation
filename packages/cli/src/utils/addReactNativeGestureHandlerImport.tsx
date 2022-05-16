import fs from 'fs';
import os from 'os';
import path from 'path';

import getLogger from './logger';
import { TextStyle } from './textStyle';

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
    `${TextStyle.stepStart}Checking and trying to add react-native-gesture-handler package ...${TextStyle.reset}`
  );

  for (const indexFileName of ['index.ts', 'index.js', 'App.tsx', 'App.jsx']) {
    logger.log(
      `Check ${TextStyle.highlight}${indexFileName}${TextStyle.reset} ...`
    );

    const filePath = path.resolve(rootDir, indexFileName);
    if (fs.existsSync(filePath)) {
      result.foundFile = indexFileName;

      logger.log(
        `${TextStyle.highlight}${indexFileName} ${TextStyle.green}Found!${TextStyle.reset}`
      );

      let indexFileContent = fs.readFileSync(filePath, 'utf8');

      if (!/import.*?react-native-gesture-handler.*/.test(indexFileContent)) {
        allowAutoImportPrompt = allowAutoImportPrompt || (() => true);
        logger.log(
          `${TextStyle.highlight}No import was found!${TextStyle.reset}`
        );

        /**
         * Inverting because we inverted the enabled with disabled to make Yep go on a one move (UX)
         */
        if (await allowAutoImportPrompt()) {
          const quote = (/['"]/.exec(indexFileContent) || ["'"])[0];
          const useSemicolon = indexFileContent.includes(';');
          const importExpression = `import ${quote}react-native-gesture-handler${quote}${
            useSemicolon ? ';' : ''
          }`;
          indexFileContent = transformSource(
            indexFileContent,
            importExpression
          );
          fs.writeFileSync(filePath, indexFileContent, 'utf8');
          logger.log(
            `${TextStyle.highlight}${importExpression} ${TextStyle.success}was added successfully to ${TextStyle.highlight}${indexFileName}`
          );
          result.didAddImport = true;
        }
      } else {
        logger.log(
          `${TextStyle.highlight}import already exists!${TextStyle.reset}`
        );
      }
      return result;
    }
  }
  logger.warn(
    `${TextStyle.failed}No index.(js|ts) or App.(js|ts) were found! (Import not added)!`
  );
  return result;
};

export const transformSource = (
  source: string,
  importExpression: string
): string => {
  const EOL = os.EOL;
  const afterTrailingCommentsIndex = getAfterTrailingCommentsIndex(source);

  const importMatch = /^[^\S\r\n]*?import .*$/gm.exec(
    source.slice(afterTrailingCommentsIndex)
  );

  if (importMatch) {
    const importIndex = afterTrailingCommentsIndex + importMatch.index;
    return (
      source.slice(0, importIndex) +
      `${importExpression}${EOL}` +
      source.slice(importIndex)
    );
  } else {
    const beforeExpression =
      afterTrailingCommentsIndex === 0 ? '' : `${EOL}${EOL}`;
    const afterExpression = afterTrailingCommentsIndex === 0 ? EOL : '';

    return (
      source.slice(0, afterTrailingCommentsIndex) +
      `${beforeExpression}${importExpression}${afterExpression}` +
      source.slice(afterTrailingCommentsIndex)
    );
  }
};

export const getAfterTrailingCommentsIndex = (source: string): number => {
  const matchTrailingCommentsRegex =
    /^(?:[\s\n\r]*?(?:\/\*[\s\S]*?\*\/|\/\/.*))*/g;

  const result = matchTrailingCommentsRegex.exec(source);
  let index = 0;

  if (result) index = result[0].length;

  return index;
};

export default addReactNativeGestureHandlerImport;
