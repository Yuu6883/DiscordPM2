const fs = require("fs");
const path = require("path");
const configPath = __dirname + "/bot-config.json";

let DefaultBotConfig = {
    Token: "",
    Owner: "",
    CommandFolder: path.resolve(__dirname + "/../../commands"),
}

if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(DefaultBotConfig, null, 4));
} else {
    let existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    DefaultBotConfig = Object.assign(DefaultBotConfig, existingConfig);
}

module.exports = DefaultBotConfig;
