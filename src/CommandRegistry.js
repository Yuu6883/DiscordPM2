const fs = require("fs");

module.exports = class CommandRegistry {
    
    /** @param {import("./Bot")} bot */
    constructor(bot) {
        this.bot = bot;
        this.registerAll(this.bot.config.Bot.CommandFolder);
    }

    get logger() { return this.bot.logger }

    /** @param {string} folder */
    registerAll(folder) {

        if (!fs.existsSync(folder)) {
            this.logger.onError(`Can't load module from folder ${folder}`);
        } else {

            let registered = 0;
            for (let file of fs.readdirSync(folder, "utf-8")) {
                if (this.register(`../commands/${file}`))
                    registered++;
            }

            this.logger.info(`Registered ${registered} commands`);
        }
    }

    /** @param {string} path */
    register(path) {

        try {
            delete require.cache[require.resolve(path)];
            const command = require(path);
            this.bot.commands.push(command);
            return true;

        } catch (_) {
            this.logger.onError(`Fail to load module at path: ${path}`);
            return false;
        }

    }
}