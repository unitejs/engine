/**
 * Gulp utils for unite configuration.
 */
const uniteConfigJson = require('../../../unite.json');

function getUniteConfig() {
   return uniteConfigJson;
}

module.exports = {
    getUniteConfig: getUniteConfig
};