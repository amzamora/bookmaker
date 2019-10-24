#!/usr/bin/env node

// Read settings
const toml = require('toml');
const fs = require('fs');

let settings = toml.parse(fs.readFileSync('settings.toml'));

if (process.argv[2] === 'update' || process.argv[2] === 'build') {
	// Create sections directory if don't exists
	if (!fs.existsSync('sections/')) {
		fs.mkdirSync('sections');
	}

	// Get files in sections directory
	let files = []
	fs.readdirSync('sections/').forEach(file => {
		let sectionName = file.replace(/^.*? /, ''); // Remove number from section name
		sectionName = sectionName.replace(/\..+$/, ''); // Remove extension from section name
		files.push({
			fileName: file,
			sectionName: sectionName,
			number: Number(file.match(/^\d*/)[0])
		});
	});

	// Create file for section if don't exists
	for (let i = 0; i < settings.sections.length; i++) {
		if (!files.some(file => file.sectionName === settings.sections[i])) {
			fs.appendFileSync(`sections/${i + 1}. ${settings.sections[i]}.md`, `# ${settings.sections[i]}`);
		}
	}

	// Rename file if sections order changed
	for (let i = 0; i < settings.sections.length; i++) {
		let file = files.filter(file => file.sectionName === settings.sections[i])[0];

		if (file) {
			if (file.number !== i + 1) {
				fs.renameSync(`sections/${file.fileName}`, `sections/${i + 1}. ${settings.sections[i]}.md`);
			}
		}
	}
}

if (process.argv[2] === 'build') {
	// Get build function from theme
	const build = require(`${process.cwd()}/themes/${settings.theme}/build`);
	build(['HOla', 'hu']);
}
