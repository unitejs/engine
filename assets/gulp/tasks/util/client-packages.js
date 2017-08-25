/**
 * Gulp utils for client packages.
 */
const path = require("path");

function getModuleIds (uniteConfig, includeModes) {
    const pathKeys = [];
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            if (pkg.main || pkg.mainMinified) {
                pathKeys.push(keys[i]);
            }
        }
    }

    return pathKeys;
}

function getFiles (uniteConfig, includeModes, isMinified) {
    const files = {};
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                const mainSplit = pkgMain.split("/");
                const main = mainSplit.pop();
                const location = mainSplit.join("/");
                if (pkg.isPackage) {
                    files[keys[i]] = path.join(`${uniteConfig.dirs.www.package}${keys[i]}/${location}`,
                        "**/*.{js,html,css}");
                } else {
                    files[keys[i]] = path.join(`${uniteConfig.dirs.www.package}${keys[i]}/${location}`, main);
                }
            }
        }
    }

    return files;
}

function getRequires (uniteConfig, includeModes, isMinified) {
    const requires = [];
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain && pkgMain !== "*") {
                requires.push(keys[i]);
            }
        }
    }

    return requires;
}

function getAssets (uniteConfig) {
    const assets = [];
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const clientAssets = uniteConfig.clientPackages[keys[i]].assets;
        if (clientAssets !== undefined && clientAssets !== null && clientAssets.length > 0) {
            const cas = clientAssets.split(",");
            cas.forEach((ca) => {
                assets.push(path.join(`${uniteConfig.dirs.www.package}${keys[i]}/`, ca));
            });
        }
    }

    return assets;
}

function buildModuleConfig (uniteConfig, includeModes, isMinified) {
    const moduleConfig = {
        "paths": {},
        "packages": [],
        "preload": [],
        "map": {},
        "loaders": {}
    };

    const isTest = includeModes.indexOf("test") >= 0;

    const keys = Object.keys(uniteConfig.clientPackages);
    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                if (pkgMain === "*") {
                    moduleConfig.paths[keys[i]] = `${uniteConfig.dirs.www.package}${keys[i]}`;
                } else {
                    const mainSplit = pkgMain.split("/");
                    const main = mainSplit.pop().replace(/(\.js)$/, "");
                    let location = mainSplit.join("/");

                    if (pkg.isPackage) {
                        moduleConfig.packages.push({
                            "name": keys[i],
                            "location": `${uniteConfig.dirs.www.package}${keys[i]}/${location}`,
                            main
                        });
                    } else {
                        location += location.length > 0 ? "/" : "";
                        moduleConfig.paths[keys[i]] = `${uniteConfig.dirs.www.package}${keys[i]}/${location}${main}`;
                    }

                    if (pkg.testingAdditions && isTest) {
                        const additionKeys = Object.keys(pkg.testingAdditions);
                        additionKeys.forEach(additionKey => {
                            moduleConfig.paths[additionKey] =
                                `${uniteConfig.dirs.www.package}${keys[i]}/${pkg.testingAdditions[additionKey]}`;
                        });
                    }

                    if (pkg.preload) {
                        moduleConfig.preload.push(keys[i]);
                    }
                }

                let loaderKey = keys[i];
                if (pkg.map) {
                    moduleConfig.map[pkg.map] = keys[i];
                    loaderKey = pkg.map;
                }

                if (pkg.loaders) {
                    pkg.loaders.forEach(loader => {
                        moduleConfig.loaders[loader] = loaderKey;
                    });
                }
            }
        }
    }

    return moduleConfig;
}

module.exports = {
    buildModuleConfig,
    getAssets,
    getFiles,
    getModuleIds,
    getRequires
};

/* Generated by UniteJS */
