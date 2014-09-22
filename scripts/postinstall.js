#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var localFile = path.normalize(__dirname + '/../config/channel.js');
var projectPath = path.normalize(process.cwd() + '/../../config/plugins');
var projectFile = path.normalize(process.cwd() + '/../../config/plugins/ah-broadcast-plugin.js');

if(!fs.existsSync(process.cwd() + '/../../config/plugins')) {
	fs.mkdirSync(process.cwd() + '/../../config/plugins');
}

if(!fs.existsSync(projectFile)){
	console.log("copying " + localFile + " to " + projectFile);

	try {
		fs.mkdirSync(projectPath);
	} catch (e) { }

	fs.createReadStream(localFile).pipe(fs.createWriteStream(projectFile));
}
