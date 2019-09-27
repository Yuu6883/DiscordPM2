/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 start .+/.test(message.content);
    },
    run: async function(message) {

    }
}