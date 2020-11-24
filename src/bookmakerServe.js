const chokidar = require('chokidar')
const liveServer = require('live-server')
const fs = require('fs-extra')
const bookmakerBuild = require('./bookmakerBuild')

function bookmakerServe() {
    bookmakerBuild();

    const watcher_themes = chokidar.watch('themes', {ignored: /^\./, persistent: true})
      .on('change', function(path) {
          bookmakerBuild()
      })
      .on('error', function(error) {console.error('Error happened', error)})

    const watcher_content = chokidar.watch('content', {ignored: /^\./, persistent: true})
      .on('change', function(path) {
          bookmakerBuild()
      })
      .on('error', function(error) {console.error('Error happened', error)})

    console.log('Serving book at http://127.0.0.1:3000');
    liveServer.start({
        port: 3000,
        root: 'book',
        wait: 1000,
        logLevel: 0
    });
}

module.exports = bookmakerServe
