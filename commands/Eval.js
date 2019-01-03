const { inspect } = require('util');
const Stopwatch = require('../util/Stopwatch');
const fetch = require('node-fetch');

const stringReplace = String.fromCharCode(8203);

module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			name: 'Eval',
			description: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
            aliases: ['evaluate', 'ev'],
            log: true,
			extendedDescription: `The eval command evaluates code as-in, any error thrown from it will be handled.\n
It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.
The --silent flag will make it output nothing.
The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.
The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword.
The --showHidden flag will enable the showHidden option in util.inspect.
If the output is too large, it'll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission.`,
			category: 'Bot Owner',
			requiredRank: 10,
			usage: 'Eval code'
		});
	}

	async run({ message, reply }, input) {
		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type;

		let code = input.join(' ');
		const stopwatch = new Stopwatch();
		try {
			if (message.flags.async) code = `(async () => {\n${code}\n})();`;
			result = eval(code);
			syncTime = stopwatch.toString();
			type = typeof result;
			if ((result instanceof Promise) || (Boolean(result) && typeof input.then === 'function' && typeof input.catch === 'function')) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (!type) type = typeof result;
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: message.flags.includes('depth') ? parseInt(message.flags.depth) || 0 : 0,
				showHidden: Boolean(message.flags.showHidden)
			});
        }
        
        if (result.length > 2000) result = await this.upload(Math.floor(Math.random() * 10) % 2 == 0 ? 'del.dog' : 'hastebin', result);

		reply(`${success ? 'Output:' : 'Error:'}\n${result.replace(/`/g, `\`${stringReplace}`)
			.replace(/@/g, `@${stringReplace}`)}\nType: ${type}\nTime:${asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`}`);
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
        catch {
            this.upload('hastebin', logs, true);
        }
    }
};
