#!/usr/bin/env node

const toml = require('toml');
const fs = require('fs-extra');
let showdown = require('showdown');
showdown = new showdown.Converter();

// Read settings
let settings = toml.parse(fs.readFileSync('settings.toml'));

if (process.argv[2] === 'update' || process.argv[2] === 'build') {
	// Create content directory if don't exists
	if (!fs.existsSync('content/')) {
		fs.mkdirSync('content');
	}

	// Get files in content directory
	let files = [];
	fs.readdirSync('content/').forEach(file => {
		if (file.split('.').pop() === 'md') {
			let sectionName = file.replace(/^.*? /, ''); // Remove number from section name
			sectionName = sectionName.replace(/\..+$/, ''); // Remove extension from section name
			files.push({
				fileName: file,
				sectionName: sectionName,
				number: Number(file.match(/^\d*/)[0])
			});
		}
	});

	// Create file for section if don't exists
	for (let i = 0; i < settings.sections.length; i++) {
		if (!files.some(file => file.sectionName === settings.sections[i])) {
			fs.appendFileSync(`content/${i + 1}. ${settings.sections[i]}.md`, `# ${settings.sections[i]}`);
		}
	}

	// Rename file if sections order changed
	for (let i = 0; i < settings.sections.length; i++) {
		let file = files.filter(file => file.sectionName === settings.sections[i])[0];

		if (file) {
			if (file.number !== i + 1) {
				fs.renameSync(`content/${file.fileName}`, `content/${i + 1}. ${settings.sections[i]}.md`);
			}
		}
	}
}

if (process.argv[2] === 'build') {
	// Get process function from theme
	const proc = require(`${process.cwd()}/themes/${settings.theme}/process`);

	// Get sections
	let files = [];
	fs.readdirSync('content/').map(file => {
		if (file.split('.').pop() === 'md') {
			let sectionName = file.replace(/^.*? /, ''); // Remove number from section name
			sectionName = sectionName.replace(/\..+$/, ''); // Remove extension from section name
			files.push({
				sectionName: sectionName,
				sectionContent: showdown.makeHtml(fs.readFileSync('content/' + file).toString())
			});
		}
	});

	// Process them
	files = proc(files);

	// Write them to book/
	if (fs.existsSync('book/')) {
		deleteFolderRecursive('book');
	}

	fs.mkdirSync('book');

	for(let file of files) {
		fs.appendFileSync(`book/${file.fileName}`, file.fileContent);
	}

	// Copy public theme folder content to book/
	fs.copySync(`themes/${settings.theme}/public`, 'book');

	// Copy all stuff that isn't a makrdown file to book/
	let stuff = fs.readdirSync('content/');
	for (let path of stuff) {
		if (path.split('.').pop() !== 'md') {
			fs.copySync(`content/${path}`, `book/${path}`);
		}
	}
}

// From: https://stackoverflow.com/a/12761924
function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
