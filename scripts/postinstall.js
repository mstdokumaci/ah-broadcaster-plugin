#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var localFile = path.normalize(__dirname + '/../config/channel.js');
var projectFile = path.normalize(process.cwd() + '/../../config/plugins/ah-broadcast-plugin.js');

if(!fs.existsSync(process.cwd() + '/../../config/plugins')) {
	try {
		fs.mkdirSync(process.cwd() + '/../../config/plugins');
	} catch (e) { }
}

if(!fs.existsSync(projectFile)){
	console.log("copying " + localFile + " to " + projectFile);
	fs.createReadStream(localFile).pipe(fs.createWriteStream(projectFile));
}
