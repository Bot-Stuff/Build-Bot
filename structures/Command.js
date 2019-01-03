module.exports = class Command {
	constructor(client, options = {}) {
		this.client = client;
		this.name = options.name;
		this.aliases = options.aliases || [];
		this.description = options.description || false;
		this.category = options.category || 'General';
		this.usage = options.usage || null;
		this.extendedDescription = options.extendedDescription || false;
		this.cooldown = 'cooldown' in options ? options.cooldown * 1000 : 0;
		this.log = options.log || false;
		this.loadingMessage = options.loadingMessage || false;
		this.hidden = options.hidden || false;
		this.requiredRank = options.requiredRank || 0;
		this.groupOnly = options.groupOnly || false;
		this.permissionLevel = options.permissionLevel || 'User';
	}

	reloadAll() {
		this.client.loadCommands();
	}
};
