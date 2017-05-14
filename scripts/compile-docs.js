// This script handles the compilation and versioning of our website's documentation.
// - First, we take the current `edge.json` documentation and rename it to the current version
// found in package.json
// - Second, we build new `edge.json` documentation
// - Last, we re-build `docs/index.js`

/* eslint-disable flowtype/require-parameter-type */
const path = require('path');
const fs = require('fs');

const DOCS_DIR = 'docs';
const OUTPUT_DIR = `website${path.sep}docs`;

function VersionDocs() {
  // eslint-disable-next-line global-require
  const currentVersion = require('../package.json').version;
  const oldPath = `${OUTPUT_DIR}${path.sep}edge.json`;
  const newPath = `${OUTPUT_DIR}${path.sep}${currentVersion}.json`;
  fs.renameSync(oldPath, newPath);
}

// Returns an array of paths of every file in a directory.
// Does so by recursively crawling through the folder structure.
function getFilePaths(rootDirName) {
  const docsFilePaths = [];
  function crawlDirectory(dirName) {
    const dir = fs.readdirSync(dirName);
    dir.forEach((name) => {
      const stat = fs.statSync(path.join(dirName, name));
      if (stat.isDirectory()) {
        crawlDirectory(path.join(dirName, name));
      } else {
        docsFilePaths.push(path.join(dirName, name));
      }
    });
  }
  crawlDirectory(rootDirName);
  return docsFilePaths;
}

function formatFilePaths(filePaths) {
  return filePaths.map((file) => {
    const nameWithExt = file.split(`docs${path.sep}`)[1];
    const name = nameWithExt.split('.md')[0];
    return name;
  });
}

function buildDocsData(filePaths) {
  const mdData = {};
  filePaths.forEach((name) => {
    mdData[name] = fs.readFileSync(`docs${path.sep}${name}.md`, { encoding: 'utf8' });
  });
  return mdData;
}

function compileLatestDocs() {
  const docsFilePaths = getFilePaths(DOCS_DIR);
  const formattedFilePaths = formatFilePaths(docsFilePaths);
  const docsData = buildDocsData(formattedFilePaths);
  fs.writeFileSync(`${OUTPUT_DIR}${path.sep}edge.json`, JSON.stringify(docsData));
}


function rebuildDocsIndex() {
  // get all doc versions in OUTPUT_DIR
  const filePaths = fs.readdirSync(OUTPUT_DIR);
  const docFilePaths = filePaths.filter(filePath => filePath.endsWith('.json'));

  let newIndex = 'module.exports = {\n';
  docFilePaths.forEach((docFile) => {
    // Append to the file.
    const versionNumber = docFile.slice(0, -5);
    newIndex += `  '${versionNumber}': require('./${docFile}'),\n`;
  });
  newIndex += '};\n';

  fs.writeFileSync(`${OUTPUT_DIR}${path.sep}index.js`, newIndex);
}

VersionDocs();
compileLatestDocs();
rebuildDocsIndex();
