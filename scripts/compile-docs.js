const fs = require('fs');
const join = require('path').join;
const sep = require('path').sep;

const files = [];
function crawl(location: string) {
  const dir = fs.readdirSync(location);
  dir.map(function(name, index) {
    const stat = fs.statSync(join(location, name));
    if (stat.isDirectory()) {
      crawl(join(location, name));
    } else {
      files.push(join(location, name));
    }
  });
}
crawl('docs');

const names = files.map(function (file) {
  const nameWithExt = file.split('docs'+sep)[1];
  const name = nameWithExt.split('.md')[0];
  return name;
});

const mdData = {};

names.map(function (name) {
  mdData[name] = fs.readFileSync('docs' + sep + name + '.md', { encoding: 'utf8' });
});

fs.writeFileSync('website' + sep + 'docs-dist.json', JSON.stringify(mdData));
//testsdfsdfsssss