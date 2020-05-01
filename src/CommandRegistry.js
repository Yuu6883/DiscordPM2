const fs = require("fs");
const path = require("path");

module.exports = class CommandRegistry {
    
    /** @param {import("./Bot")} bot */
    constructor(bot) {
        /** @type {string[]} */
        this.disabledCommands = [];
        this.bot = bot;
    }

    get logger() { return this.bot.logger }

    /** @param {string} name */
    disable(name) {
        name = name.replace(".js", "");
        this.disabledCommands.push(name);
    }

    /** @param {string} folder */
    registerAll(folder) {

        if (!fs.existsSync(folder)) {
            this.logger.onError(`Can't load module from folder ${folder}`);
        } else {

            let registered = 0;
            for (let file of fs.readdirSync(folder, "utf-8")) {
                if (this.register(path.resolve(folder, file)))
                    registered++;
            }
            let root = path.resolve(__dirname, "..");
            this.logger.info(`Registered ${registered} commands from ${folder.replace(root, "")}`);
        }
    }

    /** @param {string} path */
    register(path) {

        if (!path || this.disabledCommands.some(n => path.includes(`${n}.js`)))
            return false;

        try {
            delete require.cache[require.resolve(path)];
            const command = require(path);
            this.bot.commands.push(command);
            return true;

        } catch (_) {
            this.logger.onError(`Fail to load module at path: ${path}`, _);
            return false;
        }

    }
}