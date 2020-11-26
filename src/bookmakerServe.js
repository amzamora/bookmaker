const chokidar = require('chokidar')
const liveServer = require('live-server')
const fs = require('fs-extra')
const bookmakerBuild = require('./bookmakerBuild')

function bookmakerServe() {
	bookmakerBuild();

	const watcher_themes = chokidar.watch('themes', {ignored: /^\./, persistent: true})
		.on('change', (path) => bookmakerBuild())
		.on('error', (error) => console.error('Error happened', error))

	const watcher_content = chokidar.watch('content', {ignored: /^\./, persistent: true})
		.on('change', (path) => bookmakerBuild())
		.on('error', (error) => console.error('Error happened', error))

	fs.watchFile('settings.toml', (curr, prev) => bookmakerBuild())

	console.log('Serving book at http://127.0.0.1:3000');
	liveServer.start({
		port: 3000,
		root: 'book',
		wait: 1000,
		logLevel: 2
	});
}

module.exports = bookmakerServe
