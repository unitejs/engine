/**
 * Gulp utils for config.
 */
const display = require("./display");
const fs = require("fs");
const path = require("path");
const util = require("util");
const asyncUtil = require("./async-util");

async function create (uniteConfig, buildConfiguration, packageJson) {
    const rootConfig = {
        "config": { },
        "configName": buildConfiguration.name,
        "packageVersion": packageJson.version,
        "uniteVersion": uniteConfig.uniteVersion
    };

    const readFileAsync = util.promisify(fs.readFile);

    const baseFilename = path.join(uniteConfig.dirs.www.configuration, "base.json");
    const baseExists = await asyncUtil.fileExists(baseFilename);
    if (baseExists) {
        try {
            const baseContents = await readFileAsync(baseFilename);

            const objBaseConfig = JSON.parse(baseContents);

            Object.assign(rootConfig.config, objBaseConfig);

        } catch (err) {
            display.error(`Reading ${baseFilename} failed`, err);
            process.exit(1);
        }
    }

    const configFilename = path.join(uniteConfig.dirs.www.configuration, `${rootConfig.configName}.json`);
    const configExists = await asyncUtil.fileExists(configFilename);
    if (configExists) {
        try {
            const configContents = await readFileAsync(configFilename);

            const objConfig = JSON.parse(configContents);

            Object.assign(rootConfig.config, objConfig);

        } catch (err) {
            display.error(`Reading ${configFilename} failed`, err);
            process.exit(1);
        }
    }

    return rootConfig;
}

module.exports = {
    create
};

/* Generated by UniteJS */
