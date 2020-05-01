/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 restart .+/.test(message.content);
    },
    run: async function(message) {
        let name = message.content.slice(12).trim();

        if (~~name == name) name = ~~name;

        this.pm2.restart(name, error => {
            if (error) {
                message.reply(`Error: ${error.message}`);
            } else {
                message.reply(`Process **${name}** restarted!`);
            }
        });
    }
}