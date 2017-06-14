/**
 * Gulp utils for unite configuration.
 */
const path = require('path');
const uniteConfigJson = require('../../../unite.json');

function getUniteConfig() {
   return uniteConfigJson;
}

function createPaths(uniteConfiguration, clientModulesFolder, configContent, preloadModules) {
    if (uniteConfiguration.clientPackages) {
        const keys = Object.keys(uniteConfiguration.clientPackages);
        for (var i = 0; i < keys.length; i++) {
            const packageJson = require(path.join("../../../", clientModulesFolder, keys[i], "package.json"));
            if (packageJson && packageJson.main) {
                const sep = i < keys.length - 1 ? ',' : '';
                const filename = packageJson.main.replace('.js', '');
                const fullPath = './' + path.join(clientModulesFolder, keys[i], filename);
                configContent.push('        \'' + keys[i] + '\': \'' + fullPath.replace(/\\/g, '/') + '\'' + sep);
                if (uniteConfiguration.clientPackages[keys[i]].preload) {
                    preloadModules.push('\'' + keys[i] + '\'');
                }
            }
        }
    }
}

module.exports = {
    getUniteConfig: getUniteConfig,
    createPaths: createPaths
};