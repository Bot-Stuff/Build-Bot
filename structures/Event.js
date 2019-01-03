module.exports = class {
	constructor(client, options) {
		this.client = client;
		this.enabled = options.enabled;
		this.name = options.name;
	}

	_run(event) {
		if (this.enabled) this.run(event);
	}

	reload() {
		this.client.events.loadFiles();
	}
};
