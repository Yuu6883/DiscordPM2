interface BaseCommand {
    verify: (this: import("./src/Bot"), message: import("discord.js").Message) => Promise<boolean>;
    run: (this: import("./src/Bot"), message: import("discord.js").Message) => Promise<boolean>;
};

interface ProcessInfo {
    name:   string;
    pid:    number;
    pm_id:  number;
    monit: {
        memory: number;
        cpu:    number;
    },
    pm2_env: { [prop: string]: string|number|Object };
}