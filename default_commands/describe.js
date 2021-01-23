const Table = require("../util/Table");
const Time = require("../util/Time");

/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 describe .+/.test(message.content);
    },
    run: async function(message) {
        let name = message.content.slice(13).trim();

        if (~~name == name) name = ~~name;

        this.pm2.describe(name, (error, ls) => {

            let ps = ls[0];

            if (error)
                return void message.reply(`Error: ${error.message}`);

            if (!ps) {
                return void message.reply(`Can't find process "**${name}**"`);
            }

            let tbl = {
                name: ps.name,
                pid:  ps.pid,
                mem: (ps.monit.memory / 1024 / 1024).toFixed(1) + " MB",
                cpu: (ps.monit.cpu).toFixed(1) + "%",
                uptime:   Time.short(Date.now() - ps.pm2_env.pm_uptime),
                status:   ps.pm2_env.status,
                instance: ps.pm2_env.instances
            }
            
            let embed = this.embed(`Process ${name}`)
                .setDescription("```yaml\n" + Table(tbl) + "\n```")
            
            message.reply(embed);
        });
    }
}