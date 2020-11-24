const fs = require('fs-extra')

function bookmakerNew() {
    // Makes content folder if it doesnt exists
    if (!fs.existsSync('content/')) {
        fs.mkdirSync('content');
    }


}

module.exports = bookmakerNew
