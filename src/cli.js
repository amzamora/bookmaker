#!/usr/bin/env node

const bookmakerNew = require('./bookmakerNew')
const bookmakerBuild = require('./bookmakerBuild')

// Main
// ----

// Verify arguments
verifyArguments()

// Do stuff according ot the arguments
if (process.argv[2] === 'new') bookmakerNew();
else if (process.argv[2] === 'build') bookmakerBuild();


// Functions
// ---------
function verifyArguments() {
	if (process.argv.length < 3	) {
		printUsage()
	}
}

function printUsage() {
	console.log(
`
${makeCyan('bookmaker init')}
    Initializes a new project.

${makeCyan('bookmaker build')}
    It builds the the book.
`);
}

function makeCyan(str) {
	return '\x1b[36m' + str + '\x1b[0m';
}
