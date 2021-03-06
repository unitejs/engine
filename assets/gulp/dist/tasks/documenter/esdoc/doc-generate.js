/**
 * Gulp tasks for producing esdoc documentation.
 */
const esdoc = require("esdoc");
const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const util = require("util");
const asyncUtil = require("../../util/async-util");
const display = require("../../util/display");
gulp.task("doc-generate", async () => {
    display.info("Generating", "ESDoc");
    const configFile = path.join(process.cwd(), ".esdoc.json");
    const configExists = await asyncUtil.fileExists(configFile);
    let config;
    if (configExists) {
        const configContent = await util.promisify(fs.readFile)(configFile);
        config = JSON.parse(configContent.toString());
    } else {
        config = {};
    }
    esdoc.default.generate(config, (result, cfg) => {
        display.log(result);
    });
});
// Generated by UniteJS
