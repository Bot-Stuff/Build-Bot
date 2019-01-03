module.exports = class extends require('./Store') {
	constructor(client) {
		super(client, 'events');
	}

	set(event) {
		super.set(event.name, event);
		this.client.on(event.name, event.run.bind(event));
	}

	delete(name) {
		const event = this.get(name);
		if (event) {
			this.client.removeListenner(event.name);
			super.delete(event.name);
		}
	}

	clear() {
		for (const event of this.keys()) this.delete(event);
	}
};
