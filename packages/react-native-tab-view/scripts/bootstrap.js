/* eslint-disable import/no-commonjs */

const path = require('path');
const child_process = require('child_process');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
  encoding: 'utf-8',
};

let result;

if (process.cwd() !== root || args.length) {
  result = child_process.spawnSync('yarn', args, options);
} else {
  result = child_process.spawnSync('yarn', ['bootstrap'], options);
}

process.exitCode = result.status;
