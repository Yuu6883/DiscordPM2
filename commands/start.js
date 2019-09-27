/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^start .+/.test(message.content);
    },
    run: async function(message) {

    }
}