// Read settings.toml
const toml = require('toml');
const fs = require('fs');

let settings = toml.parse(fs.readFileSync('settings.toml'));

// If sections directory don't exists
if (!fs.existsSync('sections/')) {
	fs.mkdirSync('sections');
}

// Generate files if not exists
for (let i = 0; i < settings.index.length; i++) {
	// If files don't exists
	if (!fs.existsSync('sections/' + settings.index[i] + '.md')) {
		fs.appendFileSync('sections/' + (i + 1) + '. ' + settings.index[i] + '.md', '# ' + settings.index[i]);
	}
}
