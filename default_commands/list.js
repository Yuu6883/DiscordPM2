const Table = require("../util/Table");
const Time = require("../util/Time");

/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 (list|ls|status)$/.test(message.content);
    },
    run: async function(message) {

        const processList = await this.getProcessList();
        const embed = this.embed("Process List");

        if (processList.length > 10) {
            embed.setDescription(`There're more than 10 processes, not showing: **` + 
                `${processList.slice(10).map(p => p.name).join("**, **")}**`);
            processList = processList.slice(10);
        }

        processList.forEach((ps, i) => {

            console.log(ps);
            let tbl = {
                name: ps.name,
                pid:  ps.pid,
                mem: (ps.monit.memory / 1024 / 1024).toFixed(1) + " MB",
                cpu:    (ps.monit.cpu * 100).toFixed(2),
                uptime:   Time.short(Date.now() - ps.pm2_env.pm_uptime),
                status:   ps.pm2_env.status
            };

            embed.addField(`Process ${i + 1}`, "```prolog\n" + Table(tbl) + "\n```");
        });
        
        if (processList.length)
            message.reply(embed);
        else
            message.reply("**no PM2 process running**");

    }
}