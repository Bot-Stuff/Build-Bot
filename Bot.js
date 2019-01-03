const Bot = new (require('./structures/Client'))(require('./config'))
Bot.run();

process.on('uncaughtException', error => {
	Bot.console.error(`Uncaught Exception: ${error ? error.stack : 'Unknown'}`);
	process.exit(1);
});
