/**
 * Gulp utils for build configuration.
 */
const buildConfigJson = require('../../build.config.json');

function getBuildConfig() {
   return buildConfigJson;
}

module.exports = {
    getBuildConfig: getBuildConfig
};