/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 reload .+/.test(message.content);
    },
    run: async function(message) {
        let name = message.content.slice(11).trim();

        if (~~name == name) name = ~~name;

        this.pm2.reload(name, error => {
            if (error) {
                message.reply(`Error: ${error.message}`);
            } else {
                message.reply(`Process **${name}** reloaded!`);
            }
        })
    }
}