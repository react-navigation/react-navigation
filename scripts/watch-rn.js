let shell = require('shelljs');
shell.mkdir('-p', 'lib-rn/views/');
shell.cp('-R', 'src/views/assets', 'lib/views/assets');
process.env.BABEL_ENV = 'publish-rn';
shell.exec('babel -w src -d lib-rn');
