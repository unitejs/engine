/**
 * Gulp utils for SystemJS module configuration.
 */
const os = require("os");
const clientPackages = require("./client-packages");

function create (uniteConfig, includeModes, isBundle) {
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, false);

    if (isBundle && moduleConfig.paths.systemjs) {
        moduleConfig.paths.systemjs = `${moduleConfig.paths.systemjs}-production`;
    }

    const sjsPackages = {};
    sjsPackages[""] = {"defaultExtension": "js"};
    moduleConfig.packages.forEach((pkg) => {
        moduleConfig.paths[pkg.name] = pkg.location;
        sjsPackages[pkg.name] = {
            "main": pkg.main
        };
    });

    const sjsConfig = {
        "paths": moduleConfig.paths,
        "packages": sjsPackages,
        "map": {
            "text": "systemjs-plugin-text"
        },
        "meta": {
            "*.html": {
                "loader": "text"
            },
            "*.css": {
                "loader": "css"
            }
        }
    };

    const jsonConfig = JSON.stringify(sjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");

    let config = `SystemJS.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;

    return config;
}

module.exports = {
    create
};

/* Generated by UniteJS */