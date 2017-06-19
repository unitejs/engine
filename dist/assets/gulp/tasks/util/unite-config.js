/**
 * Gulp utils for unite configuration.
 */
const path = require('path');
const uniteConfigJson = require('../../../unite.json');

function getUniteConfig() {
   return uniteConfigJson;
}

module.exports = {
    getUniteConfig: getUniteConfig
};