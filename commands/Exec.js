const Stopwatch = require('../util/Stopwatch');
const { exec } = require('child_process');
const fetch = require('node-fetch');

module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			name: 'Exec',
			description: 'Executes a new process, very dangerous.',
            usage: 'exec <expression>',
            log: true,
			aliases: ['shell'],
			category: 'Bot Owner',
			extended: 'This will spawn a child process and execute the given command.',
			requiredRank: 10
		});
	}

	async run({ reply }, input) {
		const stopwatch = new Stopwatch();
		exec(`${input.join(' ')}`, async (error, stdout) => {
            const result = error || stdout;
            if (result.length > 2000) result = await this.upload(Math.floor(Math.random() * 10) % 2 == 0 ? 'del.dog' : 'hastebin', result);
			reply(`${result}\nTime: ${stopwatch.toString()}`);
		});
    }
    
    async upload(to, logs, dontLoop) {
        if (dontLoop) {
            return `The output was too long, and failed to upload on both Deldog and Hastebin`;
        }
        try {
            const key = await fetch(`https://${to}/documents`, { method: 'POST', body: logs })
            .then(response => response.json())
            .then(body => body.key).catch(console.log);
            return `The output was too long, uploaded on ${to}: https://${to}/${key}`;
        }
        catch (e) {
            this.upload('hastebin', logs, true);
        }
    }
};
