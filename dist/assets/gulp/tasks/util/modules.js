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
            configContent.push('    baseUrl: baseUrl,');
            configContent.push('    paths: {');
            const preloadModules = [];
            createPaths(uniteConfiguration, clientModulesFolder, configContent, preloadModules);
            configContent.push('    }');
            configContent.push('});');
            if (preloadModules.length > 0) {
                configContent.push('var preloadModules = [' + preloadModules.join(',') + '];');
            }
        } else if (uniteConfiguration.moduleLoader === "SystemJS") {
            configContent.push('var baseUrl = window.location.origin + window.location.pathname.replace(\'' + indexFile + '\', \'\');');
            configContent.push('SystemJS.config({');
            configContent.push('    baseUrl: baseUrl,');
            configContent.push('    paths: {');
            const preloadModules = [];
            createPaths(uniteConfiguration, clientModulesFolder, configContent, preloadModules);
            configContent.push('    },');
            configContent.push('    packages: {');
            configContent.push('        \'\': {');
            configContent.push('            defaultExtension: \'js\'');
            configContent.push('        }');
            configContent.push('    }');
            configContent.push('});');
            if (preloadModules.length > 0) {
                configContent.push('var preloadModules = [' + preloadModules.join(',') + '];');
            }
        } else if (uniteConfiguration.moduleLoader === "Webpack") {
        }
    }

    fs.writeFile(filename, configContent.join(os.EOL), (err) => {
        if (err) {
            throw ("Unable to write " + filename);
        } else {
            callback();
        }
    });
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
    createModuleConfig: createModuleConfig
};