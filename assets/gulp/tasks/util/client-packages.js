/**
 * Gulp utils for client packages.
 */
const path = require("path");
const glob = require("glob");
const util = require("util");

function getModuleIds (uniteConfig, includeModes) {
    const moduleIds = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0 &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            if (pkg.main || pkg.mainMinified) {
                moduleIds.push(pkg.name);
            }
        }
    });

    return moduleIds;
}

function getDistFiles (uniteConfig, includeModes, isBundled, isMinified) {
    const files = [];

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
                    const pkgLocation = pkg.transpileAlias || pkg.name;
                    if (pkg.isPackage) {
                        files.push(path.join(
                            `${uniteConfig.dirs.www.package}${pkgLocation}/${location}`,
                            "**/*.{js,html,css}"
                        ));
                    } else {
                        if (main === "*") {
                            main = "**/*.{js,html,css}";
                        }
                        files.push(path.join(`${uniteConfig.dirs.www.package}${pkgLocation}/${location}`, main));
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
        if (includeModes.indexOf(pkg.includeMode) >= 0 &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain && !pkgMain.endsWith("*")) {
                requires.push(pkg.name);
            }
        }
    });

    return requires;
}

async function getBundleVendorPackages (uniteConfig) {
    const vendorPackages = {};

    const globAsync = util.promisify(glob);

    const keys = Object.keys(uniteConfig.clientPackages);
    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];

        if ((pkg.includeMode === "app" || pkg.includeMode === "both") &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            const pkgMain = pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                const pkgLocation = pkg.transpileAlias || pkg.name;

                if (pkgMain.endsWith("*")) {
                    const files = await globAsync(path.join(
                        uniteConfig.dirs.www.package,
                        `${pkgLocation}/${pkgMain}*/*.js`
                    ));

                    files.forEach(file => {
                        const itemKey = file.replace(new RegExp(`(?:.*)${pkgLocation}(.*).js`), `${pkg.name}$1`);
                        vendorPackages[itemKey] = file;
                    });
                } else {
                    vendorPackages[pkg.name] = path.join(uniteConfig.dirs.www.package, `${pkg.name}/${pkgMain}`);
                }
            }
        }
    }

    return vendorPackages;
}

function getScriptIncludes (uniteConfig, isBundled) {
    const scriptIncludes = [];
    const scriptIncludes2 = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];

        if ((isBundled && (pkg.scriptIncludeMode === "bundled" || pkg.scriptIncludeMode === "both")) ||
            (!isBundled && (pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both"))) {
            const pkgLocation = pkg.transpileAlias || pkg.name;

            const main = isBundled && pkg.mainMinified ? pkg.mainMinified : pkg.main;
            const script = `./${path.join(uniteConfig.dirs.www.package, `${pkgLocation}/${main}`)
                .replace(/\\/g, "/")}`;

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
        const pkg = uniteConfig.clientPackages[key];
        const clientAssets = pkg.assets;
        if (clientAssets !== undefined && clientAssets !== null && clientAssets.length > 0) {
            const pkgLocation = pkg.transpileAlias || pkg.name;
            const cas = clientAssets.split(",");
            cas.forEach((ca) => {
                assets.push(path.join(`${uniteConfig.dirs.www.package}${pkgLocation}/`, ca));
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
        if (includeModes.indexOf(pkg.includeMode) >= 0 &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            let pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                const pkgLocation = pkg.transpileAlias || pkg.name;
                if (pkgMain.endsWith("*")) {
                    pkgMain = pkgMain.substring(0, pkgMain.length - 1);
                    if (pkgMain.length > 0) {
                        pkgMain = `/${pkgMain}`;
                    }
                    moduleConfig.map[pkg.name] = `${uniteConfig.dirs.www.package}${pkgLocation}${pkgMain}`;
                } else {
                    const mainSplit = pkgMain.split("/");
                    const main = mainSplit.pop().replace(/(\.js)$/, "");
                    let location = mainSplit.join("/");

                    if (pkg.isPackage) {
                        moduleConfig.packages.push({
                            "name": pkg.name,
                            "location": `${uniteConfig.dirs.www.package}${pkgLocation}/${location}`,
                            main
                        });
                    } else {
                        location += location.length > 0 ? "/" : "";
                        moduleConfig.paths[pkg.name] =
                            `${uniteConfig.dirs.www.package}${pkgLocation}/${location}${main}`;
                    }

                    if (pkg.testingAdditions && isTest) {
                        Object.keys(pkg.testingAdditions).forEach(additionKey => {
                            moduleConfig.paths[additionKey] =
                                `${uniteConfig.dirs.www.package}${pkgLocation}/${pkg.testingAdditions[additionKey]}`;
                        });
                    }

                    if (pkg.preload) {
                        moduleConfig.preload.push(pkg.name);
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
    getBundleVendorPackages,
    getDistFiles,
    getModuleIds,
    getRequires,
    getScriptIncludes,
    getTestPackages,
    getTypeMap
};

/* Generated by UniteJS */
