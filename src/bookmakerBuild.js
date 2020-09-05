const toml = require('@iarna/toml')
const fs = require('fs-extra')
const showdown = require('showdown').Converter()

function bookmakerUpdate() {
	// Read settings
	if (!fs.existsSync('settings.toml')) {
		console.log("Couldn't find a settings.toml :(")
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

function bookmakerBuild() {
	bookmakerUpdate();
}

function getSectionName(markdown_file) {
	let sectionName = markdown_file.replace(/^.*? /, ''); // Remove number from section name
	return sectionName.replace(/\..+$/, '');     // Remove extension from section name
}

module.exports = bookmakerBuild
