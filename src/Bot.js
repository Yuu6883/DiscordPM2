const { Client, MessageEmbed } = require("discord.js");
const path = require("path");
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

        /** @type {Object<string, import("discord.js").TextChannel>} */
        this.logPipes = {};
        /** @type {Array<{channel: import("discord.js").TextChannel, message: string}>} */
        this.pendingLogs = [];
    }

    init() {
        this.registry.registerAll(path.resolve(__dirname, "..", "default_commands"))
        this.registry.registerAll(path.resolve(__dirname, "..", "commands"))
        if (this.config.Bot.Token)
            this.login(this.config.Bot.Token);
    }

    get config() { return Config }

    get pm2() { return pm2 }

    async ready() {
        this.logger.info(`Bot logged in as ${this.user.username}#${this.user.discriminator}`);

        await new Promise((resolve, reject) => {
            pm2.connect(error => error ? reject(error) : resolve());
        }).catch(_ => this.logger.onError("Failed to connect to pm2"));
        this.logger.info("Connected to pm2");

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

        this.on("error", e => this.logger.onError(e));

        await new Promise(resolve => {
            pm2.launchBus((err, bus) => {
                if (err) {
                    this.logger.warn("Failed to open pm2 message bus");
                    this.logger.onError(err);
                    return resolve();
                }

                bus.on("log:out", packet => {
                    if (process.env.pm_id == packet.process.pm_id) return;
                    if (this.logPipes[packet.process.name.toUpperCase()]) {
                        this.pendingLogs.push({ channel: this.logPipes[packet.process.name.toUpperCase()], message: packet.data });
                    }
                });

                bus.on("log:err", packet => {
                    if (process.env.pm_id == packet.process.pm_id) return;
                    if (this.logPipes[packet.process.name.toUpperCase()]) {
                        this.pendingLogs.push({ channel: this.logPipes[packet.process.name.toUpperCase()], message: packet.data });
                    }
                });

                this.logger.info("Message bus opened from pm2");
                resolve();
            });
        });

        const wrapper = async () => {
            await this.flushProcessLogs();
            this.logTimeout = this.setTimeout(wrapper, 1000);
        };
        wrapper();
    }

    async flushProcessLogs() {

        /** @type {Map<import("discord.js").TextChannel, string>} */
        let map = new Map();

        for (let { channel, message } of this.pendingLogs)
            map.set(channel, map.has(channel) ? map.get(channel) + "\n" + message : message);
        
        // clear logs
        this.pendingLogs = [];

        for (let [ channel, message ] of map) {
            let string = "";
            let lines = message.split("\n");
            for (let line of lines) {
                line = line.trim().replace(/`/g, "");
                if (!line.length) continue;
                // too long, send it rn
                if (line.length + string.length > 1900) {
                    await channel.send(`\`\`\`md\n${string}\n\`\`\``);
                    string = "";
                } else string += line + "\n";
            }
            // flush last segment
            if (string.trim().length) {
                await channel.send(`\`\`\`md\n${string}\n\`\`\``);
            }
        }
    }

    embed(title) {
        return new MessageEmbed()
            .setTitle(title)
            .setColor("AQUA")
            .setThumbnail(this.user.displayAvatarURL)
            .setTimestamp();
    }

    /** @returns {Promise<import("pm2").ProcessDescription[]>} */
    async getProcessList() {
        return new Promise((resolve, reject) => {
            this.pm2.list((error, processList) => {
                error ? reject(error) : resolve(processList);
            });
        });
    }

    async exit() {
        this.clearTimeout(this.logTimeout);

        await this.destroy();
        this.logger.info("Discord bot destroyed");

        pm2.disconnect();
        this.logger.info("Disconnected from pm2");
    }
}
