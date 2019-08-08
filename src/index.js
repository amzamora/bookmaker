// Read settings.toml
const toml = require('toml');
const fs = require('fs');

let settings = toml.parse(fs.readFileSync('settings.toml'));

// If sections directory don't exists create it
if (!fs.existsSync('sections/')) {
	fs.mkdirSync('sections');
}

// Get files in sections directory
let files = []
fs.readdirSync('sections/').forEach(file => {
	let sectionName = file.replace(/^.*? /, ''); // Remove number from name
	sectionName = sectionName.replace(/\..+$/, ''); // Remove extension from name
	files.push({
		fileName: file,
		sectionName: sectionName,
		number: Number(file.match(/^\d*/)[0])
	});
});

// Verify for change in section names and existance of files
for (let i = 0; i < settings.sections.length; i++) {
	if (!files.some(file => file.sectionName === settings.sections[i])) { // If file of section don't exists
		// Find if there is a file corresponding to the section number
		let file = files.filter(file => file.number === i + 1)[0];

		if (file === undefined) { // File don't exists
			fs.appendFileSync(`sections/${i + 1}. ${settings.sections[i]}.md`, `# ${settings.sections[i]}`);

		} else {
			// Change file name
			fs.renameSync(`sections/${file.fileName}`, `sections/${i + 1}. ${settings.sections[i]}.md`);

			// Change title in content
		}
	}
}

// Rename files if sections moved
for (let i = 0; i < settings.sections.length; i++) {
	let file = files.filter(file => file.sectionName === settings.sections[i])[0];

	if (file) {
		if (file.number !== i + 1) {
			fs.renameSync(`sections/${file.fileName}`, `sections/${i + 1}. ${settings.sections[i]}.md`);
		}
	}
}
