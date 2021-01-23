interface BaseCommand {
    verify: (this: import("./src/Bot"), message: import("discord.js").Message) => Promise<boolean>;
    run: (this: import("./src/Bot"), message: import("discord.js").Message) => Promise<boolean>;
};