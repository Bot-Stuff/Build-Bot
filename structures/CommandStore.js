module.exports = class extends require('./Store') {
	constructor(client) {
		super(client, 'commands');

		this.aliases = new Map();
	}

	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	set(command) {
		super.set(command.name.toLowerCase(), command);
		for (const aliase of command.aliases) this.aliases.set(aliase, command);
	}

	delete(command) {
		if (this.get(command)) {
			super.delete(command);
			if (command.aliases.length) for (const aliase of command.aliases) this.aliases.delete(aliase);
		}
	}

	clear() {
		super.clear();
		this.aliases.clear();
	}
};
