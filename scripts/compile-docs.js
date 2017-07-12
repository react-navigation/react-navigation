const path = require('path');
var fs = require('fs');
var join = require('path').join;

var files = [];
function crawl(location) {
  var dir = fs.readdirSync(location);
  dir.map(function(name, index) {
    var stat = fs.statSync(join(location, name));
    if (stat.isDirectory()) {
      crawl(join(location, name));
    } else if (name[0] !== '.') {
      files.push(join(location, name));
    }
  });
}
crawl('docs');

var names = files.map(function(file) {
  const nameWithExt = file.split('docs' + path.sep)[1];
  const name = nameWithExt.split('.md')[0];
  return name;
});

var mdData = {};

names.map(function(name) {
  mdData[name] = fs.readFileSync('docs' + path.sep + name + '.md', {
    encoding: 'utf8',
  });
});

fs.writeFileSync(
  'website' + path.sep + 'docs-dist.json',
  JSON.stringify(mdData)
);
