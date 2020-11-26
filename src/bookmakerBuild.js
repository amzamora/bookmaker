const toml = require('@iarna/toml')
const fs = require('fs-extra')
let showdown = require('showdown')
showdown = new showdown.Converter()

function bookmakerBuild() {
	bookmakerUpdate()

	// Read settings
	const settings = toml.parse(fs.readFileSync('settings.toml'))

	// Read sections and convert its content to html
	let sections = fs.readdirSync('content')
		.filter((file) => file.split('.').pop() === 'md' && isInSections(settings.sections, file))
		.map((file) => ({
			name: getSectionName(file),
			content: showdown.makeHtml(fs.readFileSync('content/' + file).toString()),
			number: Number(file.match(/^\d*/)[0])
		}))
	sections = sections.sort((a, b) => (a.number > b.number) ? 1 : -1) // Sort files (Not always in order)
	sections = sections.map((section) => ({
		name: section.name,
		content: section.content
	}))

	// Get process function from theme and process them
	const proc = require(`${process.cwd()}/themes/${settings.theme}/process`)
	processedFiles = proc(sections)

	// Write them to book folder
	if (fs.existsSync('book/')) {
		let files = fs.readdirSync('book');
		for (let file of files) {
			if (fs.lstatSync('book/' + file).isDirectory()) {
				deleteFolderRecursive('book/' + file)
			} else {
				fs.unlinkSync('book/' + file);
			}
		}
	} else {
		fs.mkdirSync('book');
	}

	for(let file of processedFiles) {
		fs.appendFileSync(`book/${file.name}`, file.content);
	}

	// Copy assets folder from theme to book folder
	fs.copySync(`themes/${settings.theme}/assets`, 'book');

	// Copy all stuff that isn't a makrdown file to book folder
	let stuff = fs.readdirSync('content/');
	for (let path of stuff) {
		if (path.split('.').pop() !== 'md') {
			fs.copySync(`content/${path}`, `book/${path}`);
		}
	}
}

function bookmakerUpdate() {
	// Read settings
	if (!fs.existsSync('settings.toml')) {
		console.log("Couldn't find settings.toml :(")
		process.exit(1)
	}
	const settings = toml.parse(fs.readFileSync('settings.toml'))

	// Create content directory if don't exists
	if (!fs.existsSync('content/')) {
		fs.mkdirSync('content')
	}

	// Read files in content directory
	const markdownFiles = fs.readdirSync('content/')
		.filter((file) => file.split('.').pop() == 'md')
		.map((file) => ({
			fileName: file,
			sectionName: getSectionName(file),
			number: Number(file.match(/^\d*/)[0])
		}))

	// Rename sections if name changed

	// Create section if don't exists
	for (let [i, section] of settings.sections.entries()) {
		if (!markdownFiles.some((file) => file.sectionName === section)) {
			fs.appendFileSync(`content/${i + 1}. ${section}.md`, `# ${section}`);
		}
	}

	// Rename file if sections order changed
	for (let [i, section] of settings.sections.entries()) {
		const file = markdownFiles.filter((file) => file.sectionName === section)[0]

		// Rename file if position
		if (file && file.number != i + 1) {
			fs.renameSync(`content/${file.fileName}`, `content/${i + 1}. ${settings.sections[i]}.md`)
		}
	}
}

function getSectionName(markdown_file) {
	let sectionName = markdown_file.replace(/^.*? /, ''); // Remove number from section name
	return sectionName.replace(/\..+$/, '');     // Remove extension from section name
}

function isInSections(sections, markdown_file) {
	return sections.filter((section) => getSectionName(markdown_file) === section)[0] !== undefined
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

module.exports = bookmakerBuild
