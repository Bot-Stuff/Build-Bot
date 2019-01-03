const { readdirSync: readDirectory } = require('fs');
const { dirname: directoryName } = require('path');

module.exports = class extends Map {
	constructor(client, directory) {
		super();

		this.client = client;
		this.directory = `${directoryName(require.main.filename)}/${directory}`;
	}

	set(name, piece) {
		if (this.has(name)) this.delete(piece.name);
		super.set(name, piece);
	}

	delete(key) {
		if (this.has(key)) super.delete(key);
	}

	loadFiles() {
		this.clear();
		this.walkFiles(this.directory);
		return this.size;
	}

	walkFiles(directory = this.directory) {
		for (const fileName of readDirectory(directory)) {
			const [commandName, extension] = fileName.split('.');
			if (commandName && extension) {
				const filePath = `${directory}/${fileName}`;
				try {
					const command = new (require(filePath))(this.client);
					this.set(command);
					delete require.cache[filePath];
				} catch (error) {
					this.client.console.error(`Failed to load ${commandName} (${filePath}).\n${error.stack || error}`);
				}
			} else this.walkFiles(`${directory}/${fileName}`);
		}
	}
};
