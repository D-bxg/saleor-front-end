var fs = require('fs');
var path = require('path');

console.log('Rename started');
fs.readdir(__dirname, function(err, files) {
	if(err) {
		console.error(err);
		return;
	}

	var count = 0;
	files.forEach(function(file) {
		var filePath = path.normalize(__dirname + '/' + file);
		fs.stat(filePath, function(err, stat) {
			if(stat.isFile()) {
				if(/^.*-.*svg$/.test(file)) {
					console.log(file);
					var f = file.replace(/^.*-/, 'bio_instruments_');
					var newPath = path.normalize(__dirname + '/' + f);
					fs.rename(filePath, newPath, function(){});
				}
			}
		});
	});
	// console.log(count);
});

console.log('Rename finished');