const { Console } = require('console');

module.exports = class extends Console {
	constructor() {
		super(process.stdout, process.stderr);
	}

	get timestamp() {
		return new Date().toLocaleString();
	}

	log(...data) {
		super.log(`\u001b[44m${this.timestamp}\u001b[49m \u001b[m${data}\u001b[m`);
	}

	warn(...data) {
		super.log(`\u001b[103;30m${this.timestamp}\u001b[49;39m ${data}`);
	}

	error(...data) {
		super.log(`\u001b[41m${this.timestamp}\u001b[49m ${data}`);
	}

	debug(...data) {
		super.log(`\u001b[45m${this.timestamp()}\u001b[49m ${data}`);
	}
};
