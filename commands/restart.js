/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^start .+/.test(message.content);
    },
    run: async function(message) {
        this.pm2.list((error, processList) => {
            if (error) {
                message.reply(`Error happened: ${error.message}`);
                this.logger.onError(error);
                return;
            }

            for(let ps of processList) {

            }
            
        });
    }
}