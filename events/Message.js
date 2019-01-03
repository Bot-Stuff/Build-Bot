module.exports = class extends require('../structures/Event') {
	constructor(client) {
		super(client, { name: 'message', enabled: true });

		this.ratelimits = new Map(); // TODO
	}

	async run(content) {
		const { message, from: author, reply } = content;
		if (message.text) {
			let prefix = false;
			for (const currentPrefiex of this.client.prefixes) if (new RegExp(`^${currentPrefiex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i').test(message.text)) prefix = currentPrefiex;
			if (prefix === false) return;
			message.flags = [];
			const input = message.text.slice(prefix.length).trim().split(/ +/g);
			const command = this.client.commands.get(input.shift().toLowerCase());
			if (command) {
				author.permissionLevel = this.client.getUserLevel(content);
				if (author.permissionLevel.rank < command.requiredRank) return reply(`❌ ${author.username}, ${author.permissionLevel.name}s can't use this command.`);
				while (input[0] && input[0][0] === '-') message.flags.push(input.shift().slice(1)); try {
					if (command.log) this.client.console.log(`${author.username} (${author.id}) used the ${command.name} command!`)
					command.run(content, input);
				} catch (error) {
					reply(`⚠️ ${author.username}, something went wrong while running the ${command.name} command. Developers have been informed, please try again later.`);
				}
			}
		}
	}
};
