import path from 'path';
import fs from 'fs';
import getLogger from './logger';

const logger = getLogger();

const addReactNativeGestureHandlerImport = (rootDir: string): void => {
  logger.log(
    'Checking and trying to add react-native-gesture-handler package ...'
  );

  for (const indexFileName of ['index.ts', 'index.js', 'App.tsx', 'App.jsx']) {
    logger.log(`Check ${indexFileName} ...`);

    const filePath = path.resolve(rootDir, indexFileName);
    if (fs.existsSync(filePath)) {
      logger.log(`${indexFileName} Found!`);

      let indexFileContent = fs.readFileSync(filePath, 'utf8');

      if (!/import.*?react-native-gesture-handler.*/.test(indexFileContent)) {
        logger.log('No import was found!');
        const quote = (/['"]/.exec(indexFileContent) || ["'"])[0];
        const importExpression = `import ${quote}react-native-gesture-handler${quote}`;
        indexFileContent = `${importExpression}}\n${indexFileContent}`;
        fs.writeFileSync(filePath, indexFileContent, 'utf8');
        logger.log(
          `${importExpression} was added successfully to ${indexFileName}`
        );
      } else {
        logger.log('import already exists!');
      }
      return;
    }
  }
  logger.warn(
    'No index.(js|ts) or App.(js|ts) were found! (Import not added)!'
  );
};

export default addReactNativeGestureHandlerImport;
