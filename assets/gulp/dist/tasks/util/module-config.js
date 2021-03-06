/**
 * Gulp utils for module configuration.
 */
const os = require("os");
const clientPackages = require("./client-packages");
const regExUtils = require("./regex-utils");

function createRequireConfig(uniteConfig, moduleConfig, mapBase) {
    for (const key in moduleConfig.paths) {
        moduleConfig.paths[key] = regExUtils.replaceLeadingSlash(moduleConfig.paths[key], "");
    }
    for (const key in moduleConfig.map) {
        moduleConfig.map[key] = regExUtils.replaceLeadingSlash(moduleConfig.map[key], "");
    }
    const rjsConfig = {
        baseUrl: mapBase,
        paths: moduleConfig.paths,
        packages: moduleConfig.packages,
        map: {
            "*": {}
        }
    };
    Object.keys(moduleConfig.map).forEach(key => {
        rjsConfig.map["*"][key] = moduleConfig.map[key];
    });
    return rjsConfig;
}

function createRequireJS(uniteConfig, includeModes, isBundle, mapBase) {
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, isBundle);
    const rjsConfig = createRequireConfig(uniteConfig, moduleConfig, mapBase);
    const jsonConfig = JSON.stringify(rjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");
    let config = `require.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;
    return config;
}

function createSystemConfig(uniteConfig, moduleConfig, mapBase) {
    let format = null;
    const moduleTypeLower = uniteConfig.moduleType.toLowerCase();
    if (moduleTypeLower === "amd") {
        format = "amd";
    } else if (moduleTypeLower === "commonjs") {
        format = "cjs";
    } else if (moduleTypeLower === "systemjs") {
        format = "system";
    }
    const sjsConfig = {
        baseURL: mapBase,
        transpiler: "unitejs-systemjs-plugin-babel",
        paths: moduleConfig.paths,
        packages: {},
        map: {},
        meta: {
            "dist/*.js": {
                format
            },
            "dist/app-module-config.js": {
                format: "global"
            }
        }
    };
    sjsConfig.packages[""] = {
        defaultExtension: "js"
    };
    Object.keys(moduleConfig.paths).forEach(key => {
        moduleConfig.paths[key] = regExUtils.stripLeadingSlash(moduleConfig.paths[key]);
        if (moduleConfig.paths[key].endsWith(".mjs")) {
            sjsConfig.packages[key] = {
                defaultExtension: ""
            };
        }
    });
    Object.keys(moduleConfig.map).forEach(key => {
        moduleConfig.map[key] = regExUtils.replaceLeadingSlash(moduleConfig.map[key], mapBase);
        if (moduleConfig.paths[moduleConfig.map[key]]) {
            const distKey = `dist/*/${moduleConfig.paths[moduleConfig.map[key]]}.js`;
            sjsConfig.meta[distKey] = {
                format: "global"
            };
        }
    });
    moduleConfig.packages.forEach((pkg) => {
        moduleConfig.paths[pkg.name] = regExUtils.replaceLeadingSlash(pkg.location, "");
        if (pkg.main) {
            if (pkg.mainLib) {
                pkg.mainLib.forEach(childPackage => {
                    sjsConfig.packages[`${pkg.name}/${childPackage}`] = {
                        main: pkg.main
                    };
                });
            }
            sjsConfig.packages[pkg.name] = {
                main: pkg.main
            };
        }
    });
    Object.keys(moduleConfig.map).forEach(key => {
        sjsConfig.map[key] = moduleConfig.map[key];
    });
    Object.keys(moduleConfig.loaders).forEach(key => {
        sjsConfig.meta[key] = {
            loader: moduleConfig.loaders[key]
        };
    });
    return sjsConfig;
}

function createSystemJS(uniteConfig, includeModes, isBundle, mapBase) {
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, isBundle);
    const sjsConfig = createSystemConfig(uniteConfig, moduleConfig, mapBase);
    const jsonConfig = JSON.stringify(sjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");
    let config = `SystemJS.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;
    return config;
}
exports.createSystemJS = createSystemJS;

function create(uniteConfig, includeModes, isBundle, mapBase) {
    let loader = null;
    const bundlerLower = uniteConfig.bundler.toLowerCase();
    if (bundlerLower === "requirejs") {
        loader = "rjs";
    } else if ((isBundle && bundlerLower === "systemjsbuilder") ||
        (!isBundle && (bundlerLower === "browserify" ||
            bundlerLower === "systemjsbuilder" ||
            bundlerLower === "webpack"))) {
        loader = "sjs";
    }
    if (loader === "rjs") {
        return createRequireJS(uniteConfig, includeModes, isBundle, mapBase);
    } else if (loader === "sjs") {
        return createSystemJS(uniteConfig, includeModes, isBundle, mapBase);
    }
    return "";
}
exports.create = create;
// Generated by UniteJS
