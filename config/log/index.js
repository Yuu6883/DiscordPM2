const fs = require("fs");
const configPath = __dirname + "/log-config.json";

let DefaultSettings = {
    showingConsole: {
        PRINT: true,
        FILE: false,
        DEBUG: false,
        ACCESS: false,
        INFO: true,
        WARN: true,
        ERROR: true,
        FATAL: true,
        TEST: true,
    },
    showingFile: {
        PRINT: true,
        FILE: true,
        DEBUG: true,
        ACCESS: true,
        INFO: true,
        WARN: true,
        ERROR: true,
        FATAL: true,
        TEST: true
    },
    fileLogDirectory: "../logs/",
    fileLogSaveOld: true
};

if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(DefaultSettings, null, 4));
} else {
    let existingConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    DefaultSettings = Object.assign(DefaultSettings, existingConfig);
}

module.exports = DefaultSettings;
