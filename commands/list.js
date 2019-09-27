const { RichEmbed } = require("discord.js");

/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 list .+/.test(message.content);
    },
    run: async function(message) {
        this.pm2.list((error, processList) => {
            if (error) {
                message.reply(`Error happened: ${error.message}`);
                this.logger.onError(error);
                return;
            }

            let embed = new RichEmbed()
                .setTitle("Process List")
                .setTimestamp()
                .setDescription(processList.map((ps, index) => 
                    `Process ${index + 1}\n**\`Name: ${ps.name}, PID: ${ps.pid}, ` + 
                    `Memory: ${Math.round(ps.monit.memory / 1024 / 1024).toFixed(1)}` +
                    `CPU Usage: ${(ps.monit.cpu * 100).toFixed(1)}%\`**`
                ).join("\n"));
            
            await message.reply(embed);
        });

    }
}