const Client = require('telegraf');

const permissionLevels = require('../util/permissionLevels');

module.exports = class extends Client {
    constructor({ token = process.env.BOT_TOKEN, prefixes } ) {
        super(token);

        this.prefixes = prefixes;
        this.console = new (require('../util/Console'))();
        this.commands = new (require('./CommandStore'))(this);
        this.events = new (require('./EventStore'))(this);
    }

    run() {
            this.console.log(`Loaded a total of ${this.commands.loadFiles()} and ${this.events.loadFiles()} events commands!`);

            this.startPolling();
        }

        getUserLevel(message, permissionLevel = 0) {
            for (const level of permissionLevels) if (level.check(message)) permissionLevel = level;
            return permissionLevel;
        }
    };