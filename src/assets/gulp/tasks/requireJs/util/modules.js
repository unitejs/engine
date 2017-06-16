/**
 * Gulp utils for modules.
 */
const os = require('os');
const fs = require('fs');
const uniteConfig = require('./unite-config');

function createModuleConfig(filename, indexFile, uniteConfiguration, clientModulesFolder, callback) {
    let configContent = [];

    configContent.push('/**');
    configContent.push(' * Module Configuration');
    configContent.push(' * RequireJS');
    configContent.push(' */');

    configContent.push('var baseUrl = window.location.origin + window.location.pathname.replace(\'' + indexFile + '\', \'\');');
    configContent.push('require.config({');
    configContent.push('    baseUrl: baseUrl,');
    configContent.push('    paths: {');
    const preloadModules = [];
    uniteConfig.createPaths(uniteConfiguration, clientModulesFolder, configContent, preloadModules);
    configContent.push('    }');
    configContent.push('});');
    
    configContent.push('var preloadModules = [' + preloadModules.join(',') + '];');

    fs.writeFile(filename, configContent.join(os.EOL), (err) => {
        if (err) {
            throw ("Unable to write " + filename);
        } else {
            callback();
        }
    });
}

module.exports = {
    createModuleConfig: createModuleConfig
};