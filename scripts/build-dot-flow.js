const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const sep = require('path').sep;

function fromDir(startPath: string, filter: string) {
  console.log('Starting from dir ' + startPath + sep);
  if (!fs.existsSync(startPath)) {
    return;
  }
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    const n = filename.indexOf('__tests__');
    if ((stat.isDirectory()) && (n === -1)) {
      fromDir(filename, filter);
    } else if (filename.indexOf(filter) >= 0) {
      console.log('-- found: ', filename);
      shell.cp('-R', filename, 'lib' + sep + filename.replace('src', '') + '.flow');

      console.log('-- found: ', filename);
      shell.cp('-R', filename, 'lib-rn' + sep + filename.replace('src', '') + '.flow');
    }
  }
}

fromDir('./src', '.js');
console.log('Done.');