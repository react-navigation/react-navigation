#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packages = path.join(__dirname, '..', 'packages');

const invalid = [];

fs.readdirSync(packages).forEach((name) => {
  const dir = path.join(packages, name);

  if (fs.statSync(path.join(packages, name)).isDirectory()) {
    const pak = JSON.parse(
      fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
    );

    if (pak.types && !fs.existsSync(path.join(dir, pak.types))) {
      invalid.push(pak);
    }
  }
});

if (invalid.length) {
  console.log(
    'Found invalid path to type definitions in the following packages:\n',
    invalid.map((p) => `- ${p.name} (${p.types})`).join('\n')
  );
}
