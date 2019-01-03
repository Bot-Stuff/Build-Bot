module.exports = class extends require('../structures/Event') {
	constructor(Bot) {
		super(Bot, { name: 'commandError' });
	}

	async run(error, message) {
		if (Object.keys(error).length === 0) return;
		this.Bot.console.log(error);
		await message.reply([{ type: 'text', text: 'Pardon user, seems like something broke.' }]);
	}
};
