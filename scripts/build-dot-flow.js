var path = require('path'), fs=require('fs'), shell = require('shelljs');
const sep = require('path').sep;

function fromDir(startPath,filter){

    console.log('Starting from dir '+startPath+sep);

    if (!fs.existsSync(startPath)){
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        var n    = filename.indexOf("__tests__");
        if ( (stat.isDirectory()) && (n===-1)) {
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            
            console.log('-- found: ',filename);
            shell.cp('-R', filename, 'lib'+sep+filename.replace('src','')+'.flow');

            console.log('-- found: ',filename);
            shell.cp('-R', filename, 'lib-rn'+sep+filename.replace('src','')+'.flow');

        };
    };
};

fromDir('./src','.js');
console.log('Done.');