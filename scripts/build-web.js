const shell = require('shelljs');

shell.mkdir('-p', 'lib/views/');
shell.cp('-R', 'src/views/assets', 'lib/views/assets');
process.env.BABEL_ENV = 'publish-web';
shell.exec('babel src -d lib');


