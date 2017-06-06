/**
 * Gulp utils for modules.
 */
const os = require('os');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');

function createModuleConfig(filename, indexFile, uniteConfiguration, clientModulesFolder, callback) {
    let configContent = [];
    configContent.push('/**');
    configContent.push(' * Module Configuration');

    if (uniteConfiguration) {
        if (uniteConfiguration.moduleLoader === "RequireJS") {
            configContent.push(' * RequireJS');
        } else if (uniteConfiguration.moduleLoader === "SystemJS") {
            configContent.push(' * SystemJS');
        }
    }    
    configContent.push(' */');
    if (uniteConfiguration) {
        if (uniteConfiguration.moduleLoader === "RequireJS") {
            configContent.push('var baseUrl = window.location.origin + window.location.pathname.replace(\'' + indexFile + '\', \'\');');
            configContent.push('require.config({');
            configContent.push('    baseUrl: baseUrl');
            configContent.push('});');
        } else if (uniteConfiguration.moduleLoader === "SystemJS") {
            configContent.push('var baseUrl = window.location.origin + window.location.pathname.replace(\'' + indexFile + '\', \'\');');
            configContent.push('SystemJS.config({');
            configContent.push('    baseUrl: baseUrl,');
            configContent.push('    packages: {');
            configContent.push('        \'\': {');
            configContent.push('            defaultExtension: \'js\'');
            configContent.push('        }');
            configContent.push('    }');
            configContent.push('});');
        }
    }    

    fs.writeFile(filename, configContent.join(os.EOL), (err) => {
        if (err) {
            throw("Unable to write " + filename);
        } else {
            callback();
        }
    });
}

module.exports = {
    createModuleConfig: createModuleConfig
};