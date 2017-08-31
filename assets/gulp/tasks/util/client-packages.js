/**
 * Gulp utils for client packages.
 */
const path = require("path");

function getModuleIds (uniteConfig, includeModes) {
    const pathKeys = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            if (pkg.main || pkg.mainMinified) {
                pathKeys.push(key);
            }
        }
    });

    return pathKeys;
}

function getDistFiles (uniteConfig, includeModes, isBundled, isMinified) {
    const files = {};

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0) {
            if (!isBundled ||
                (isBundled && (pkg.scriptIncludeMode === "bundled" || pkg.scriptIncludeMode === "both"))) {
                const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

                if (pkgMain) {
                    const mainSplit = pkgMain.split("/");
                    const main = mainSplit.pop();
                    const location = mainSplit.join("/");
                    if (pkg.isPackage) {
                        files[key] = path.join(`${uniteConfig.dirs.www.package}${key}/${location}`,
                            "**/*.{js,html,css}");
                    } else {
                        files[key] = path.join(`${uniteConfig.dirs.www.package}${key}/${location}`, main);
                    }
                }
            }
        }
    });

    return files;
}

function getRequires (uniteConfig, includeModes, isMinified) {
    const requires = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain && pkgMain !== "*") {
                requires.push(key);
            }
        }
    });

    return requires;
}

function getAssets (uniteConfig) {
    const assets = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const clientAssets = uniteConfig.clientPackages[key].assets;
        if (clientAssets !== undefined && clientAssets !== null && clientAssets.length > 0) {
            const cas = clientAssets.split(";");
            cas.forEach((ca) => {
                assets.push(path.join(`${uniteConfig.dirs.www.package}${key}/`, ca));
            });
        }
    });

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

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0 && pkg.scriptIncludeMode === "none") {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                if (pkgMain === "*") {
                    moduleConfig.map[key] = `${uniteConfig.dirs.www.package}${key}`;
                } else {
                    const mainSplit = pkgMain.split("/");
                    const main = mainSplit.pop().replace(/(\.js)$/, "");
                    let location = mainSplit.join("/");

                    if (pkg.isPackage) {
                        moduleConfig.packages.push({
                            "name": key,
                            "location": `${uniteConfig.dirs.www.package}${key}/${location}`,
                            main
                        });
                    } else {
                        location += location.length > 0 ? "/" : "";
                        moduleConfig.paths[key] = `${uniteConfig.dirs.www.package}${key}/${location}${main}`;
                    }

                    if (pkg.testingAdditions && isTest) {
                        Object.keys(pkg.testingAdditions).forEach(additionKey => {
                            moduleConfig.paths[additionKey] =
                                `${uniteConfig.dirs.www.package}${key}/${pkg.testingAdditions[additionKey]}`;
                        });
                    }

                    if (pkg.preload) {
                        moduleConfig.preload.push(key);
                    }
                }

                if (pkg.map) {
                    Object.keys(pkg.map).forEach(mapKey => {
                        moduleConfig.map[mapKey] = pkg.map[mapKey];
                    });
                }

                if (pkg.loaders) {
                    Object.keys(pkg.loaders).forEach(loaderKey => {
                        moduleConfig.loaders[loaderKey] = pkg.loaders[loaderKey];
                    });
                }
            }
        }
    });

    return moduleConfig;
}

module.exports = {
    buildModuleConfig,
    getAssets,
    getDistFiles,
    getModuleIds,
    getRequires
};

/* Generated by UniteJS */
