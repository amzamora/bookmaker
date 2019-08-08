// Read settings.toml
const toml = require('toml');
const fs = require('fs');

let settings = toml.parse(fs.readFileSync('settings.toml'));

// If sections directory don't exists
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
		sectionName: sectionName
	});
});
console.log(files);

// Verify for change in section names
for (let i = 0; i < settings.index.length; i++) {
	if (files[i].sectionName !== settings.index[i]) { // If file does not match section
		if (!settings.index.includes(files[i].sectionName)) { // If the section wasn't moved
			// Change name of file

			// Change title

		}
	}
}

// Rename files if sections moved
for (let i = 0; i < settings.index.length; i++) {
	let file = 1;
	for (let j = 0; j < files.length; j++) {
		if (files[j].sectionName === settings.index[i]) {
			file = j;
			break
		}
	}

	if (file !== i) {
		fs.renameSync(`sections/${files[file].fileName}`, `sections/${i + 1}. ${settings.index[i]}.md`);
	}
}

// Create file if not exists
for (let i = 0; i < settings.index.length; i++) {
	// If files don't exists
	if (!fs.existsSync(`sections/${i + 1}. ${settings.index[i]}.md`)) {
		fs.appendFileSync(`sections/${i + 1}. ${settings.index[i]}.md`, `# ${settings.index[i]}`);
	} else {

	}
}
