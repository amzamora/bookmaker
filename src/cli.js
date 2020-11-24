#!/usr/bin/env node

const bookmakerNew = require('./bookmakerNew')
const bookmakerBuild = require('./bookmakerBuild')
const bookmakerServe = require('./bookmakerServe')

// Main
// ----
if (process.argv.length < 3)          printUsage()
else if (process.argv[2] === 'new')   bookmakerNew()
else if (process.argv[2] === 'build') bookmakerBuild()
else if (process.argv[2] === 'serve') bookmakerServe()
else                                  printUsage()


// Functions
// ---------
function verifyArguments() {
    if (process.argv.length < 3) {
        printUsage()
    }
}

function printUsage() {
    console.log(
`${makeCyan('bookmaker init')}
    Initializes a new project.

${makeCyan('bookmaker build')}
    It builds the book.

${makeCyan('bookmaker serve')}
    It builds and serves continuosly.
`);
}

function makeCyan(str) {
    return '\x1b[36m' + str + '\x1b[0m';
}
