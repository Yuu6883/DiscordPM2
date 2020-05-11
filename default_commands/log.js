/** @type {BaseCommand} */
module.exports = {
    verify: async function(message) {
        return /^pm2 log .+/.test(message.content);
    },
    run: async function(message) {
        let tokens = message.content.split(/ /g);
        const channels = [...message.mentions.channels.values()];
        tokens = tokens.filter(t => !channels.some(ch => t.includes(ch.id)));
        let name = tokens.slice(2).join(" ").trim().toUpperCase();

        /** @type {import("discord.js").TextChannel} */
        let outputChannel = channels[0] || message.channel;

        let processes = await this.getProcessList();
        if (!processes.some(p => p.name.toUpperCase() == name)) {
            await message.reply( `Can't find process \`${name}\``);
            return;
        }

        if (this.logPipes[name]) {
            if (this.logPipes[name] == outputChannel) {
                await message.reply(`Already piping output from process \`${name}\` to <#${outputChannel.id}>`);
                return;
            } else {
                await message.reply(`Changing process \`${name}\` output channel from <#${this.logPipes[name]}> to <#${outputChannel.id}>`);
                this.logPipes[name] = outputChannel;
                return;
            }
        } else {
            await message.reply(`Piping process \`${name}\` output to <#${outputChannel.id}>`);
            this.logPipes[name] = outputChannel;
            return;
        }
    }
}