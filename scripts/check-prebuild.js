#!/usr/bin/env node

/* eslint-disable import/no-commonjs */

const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const prebuildFolders = ['ios', 'android'];

const prebuildFoldersExist = prebuildFolders.some((folder) => {
  const folderPath = path.join(__dirname, '../example', folder);
  return fs.existsSync(folderPath);
});

if (!prebuildFoldersExist) {
  console.log(
    `[react-navigation] Native source code folders ${prebuildFolders.join(
      ', '
    )} does not exist.\n\n[react-navigation] Running 'npx expo prebuild'...\n\n`
  );

  cp.execSync('npx expo prebuild', {
    stdio: 'inherit',
  });
}

const podfilePath = path.join(__dirname, '../example/ios/Podfile');

const podfile = fs.readFileSync(podfilePath, 'utf8');
const podfileWithFlipperEnabled = podfile.replace(
  /#\s*use_flipper!/gm,
  'use_flipper!'
);

fs.writeFileSync(podfilePath, podfileWithFlipperEnabled);
