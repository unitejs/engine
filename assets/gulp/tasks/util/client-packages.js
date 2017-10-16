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
                    let main = mainSplit.pop();
                    const location = mainSplit.join("/");
                    if (pkg.isPackage) {
                        files[key] = path.join(
                            `${uniteConfig.dirs.www.package}${key}/${location}`,
                            "**/*.{js,html,css}"
                        );
                    } else {
                        if (main === "*") {
                            main = "**/*.{js,html,css}";
                        }
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

function getScriptIncludes (uniteConfig, isBundled) {
    const scriptIncludes = [];
    const scriptIncludes2 = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];

        if ((isBundled && (pkg.scriptIncludeMode === "bundled" || pkg.scriptIncludeMode === "both")) ||
            (!isBundled && (pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both"))) {
            const main = (isBundled && pkg.mainMinified) ? pkg.mainMinified : pkg.main;
            const script = `./${path.join(uniteConfig.dirs.www.package, `${key}/${main}`).replace(/\\/g, "/")}`;

            if (pkg.isModuleLoader) {
                scriptIncludes2.push(script);
            } else {
                scriptIncludes.push(script);
            }
        }
    });

    return scriptIncludes.concat(scriptIncludes2);
}

function getTestPackages (uniteConfig) {
    const testPackages = {};

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];

        if (pkg.includeMode === "test" || pkg.includeMode === "both") {
            testPackages[key] = pkg;
        }
    });

    return testPackages;
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
    });

    return moduleConfig;
}

function getTypeMap (uniteConfig, type, isMinified) {
    const keys = Object.keys(uniteConfig.clientPackages);
    for (let i = 0; i < keys.length; i++) {
        const mapPkg = uniteConfig.clientPackages[keys[i]];
        if (mapPkg.map) {
            const moduleKey = mapPkg.map[type];

            if (moduleKey) {
                const modulePkg = uniteConfig.clientPackages[moduleKey];
                if (modulePkg) {
                    const pkgMain = isMinified && modulePkg.mainMinified ? modulePkg.mainMinified : modulePkg.main;

                    if (pkgMain) {
                        const pkgMainNoJs = pkgMain.replace(/(\.js)$/, "");
                        const pkgMainFullPath = `${uniteConfig.dirs.www.package}${moduleKey}/${pkgMainNoJs}`;
                        return pkgMainFullPath.replace(/^\.\//, "");
                    }
                }
            }
        }
    }

    return "";
}

module.exports = {
    buildModuleConfig,
    getAssets,
    getDistFiles,
    getModuleIds,
    getRequires,
    getScriptIncludes,
    getTestPackages,
    getTypeMap
};

/* Generated by UniteJS */
