const { Client } = require("discord.js");
const pm2 = require("pm2");

const CommandRegistry = require("./CommandRegistry");
const Logger = require("../util/Logger");
const Config = require("../config");

module.exports = class Bot extends Client {

    /** @param {import("discord.js").ClientOptions} options */
    constructor(options) {
        super(options);
        this.on("ready", this.ready.bind(this));

        /** @type {BaseCommand[]} */
        this.commands = [];
        this.logger = new Logger();
        this.registry = new CommandRegistry(this);

        if (this.config.Bot.Token)
            this.login(this.config.Bot.Token);
    }

    get config() { return Config }

    get pm2() { return pm2 }

    async ready() {
        this.logger.info(`Bot logged in as ${this.user.username}#${this.user.discriminator}`);

        this.on("message", async message => {

            if (message.author.id != this.config.Bot.Owner) return;
            
            for (let command of this.commands) {

                if (command.verify) {
                    let verified = await command.verify.bind(this)(message);

                    if (verified && command.run) {
                        try {
                            await command.run.bind(this)(message);
                        } catch (_) {
                            this.logger.onError(_);
                        }
                    }
                }
            }
        });

        await new Promise((resolve, reject) => {
            pm2.connect(error => error ? reject(error) : resolve());
        }).catch(_ => this.logger.onError("Failed to connect to pm2"));
    }

    async exit() {
        await this.destroy();
        this.logger.info("Discord bot destroyed");

        pm2.disconnect();
        this.logger.info("Disconnected from pm2");

    }
}
