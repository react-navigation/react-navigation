#!/usr/bin/env node

/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

const prebuildFolders = ['ios', 'android'];

const notExist = prebuildFolders.some((folder) => {
  const folderPath = path.join(__dirname, '../example', folder);
  return !fs.existsSync(folderPath);
});

if (notExist) {
  const message = `Native source code folders ${prebuildFolders.join(
    ', '
  )} does not exist.\n\nRun 'npx expo prebuild' in 'example/' dir to generate them.`;
  console.log(message);
  process.exit(1);
}
