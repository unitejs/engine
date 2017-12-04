/**
 * Gulp utils for client packages.
 */
import * as glob from "glob";
import * as path from "path";
import * as util from "util";
import { IModuleConfig } from "../../types/IModuleConfig";
import { IncludeMode } from "../../types/includeMode";
import { IUniteClientPackage } from "../../types/IUniteClientPackage";
import { IUniteConfiguration } from "../../types/IUniteConfiguration";
import * as regExUtil from "./regex-utils";

export function getModuleIds(uniteConfig: IUniteConfiguration, includeModes: IncludeMode[]): string[] {
    const moduleIds: string[] = [];

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

export function getPackageFiles(uniteConfig: IUniteConfiguration, pkg: IUniteClientPackage, isMinified: boolean): string[] {
    const files = [];

    const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

    if (pkgMain) {
        const mainSplit = pkgMain.split("/");
        let main = mainSplit.pop();
        const location = mainSplit.join("/");
        const pkgLocation = pkg.transpile && pkg.transpile.alias ? pkg.transpile.alias : pkg.name;
        if (pkg.isPackage) {
            files.push(path.join(
                `${uniteConfig.dirs.www.package}${pkgLocation}/${location}`,
                "**/*.{js,html,css}"
            ));
        } else if (main === "*" && pkg.mainLib) {
            for (let i = 0; i < pkg.mainLib.length; i++) {
                files.push(`./${path.join(
                    uniteConfig.dirs.www.package,
                    `${pkgLocation}/${location}${pkg.mainLib[i]}`
                )}`);
            }
        } else {
            if (main === "*") {
                main = "**/*.{js,html,css}";
            }
            files.push(path.join(`${uniteConfig.dirs.www.package}${pkgLocation}/${location}`, main));
        }
    }

    return files.map(regExUtil.toWebUrl);
}

export function getPackageAssets(uniteConfig: IUniteConfiguration, pkg: IUniteClientPackage): string[] {
    const files: string[] = [];

    const clientAssets = pkg.assets;
    if (clientAssets !== undefined && clientAssets !== null) {
        const pkgLocation = pkg.transpile && pkg.transpile.alias ? pkg.transpile.alias : pkg.name;
        clientAssets.forEach((ca) => {
            files.push(path.join(`${uniteConfig.dirs.www.package}${pkgLocation}/`, ca));
        });
    }

    return files.map(regExUtil.toWebUrl);
}

export function getPackageTestingAdditions(uniteConfig: IUniteConfiguration, pkg: IUniteClientPackage): string[] {
    const files: string[] = [];

    if (pkg.testingAdditions) {
        const pkgLocation = pkg.transpile && pkg.transpile.alias ? pkg.transpile.alias : pkg.name;
        Object.keys(pkg.testingAdditions).forEach(additionKey => {
            files.push(`./${path.join(
                uniteConfig.dirs.www.package,
                `${pkgLocation}/${pkg.testingAdditions[additionKey]}`
            )}`);
        });
    }

    return files.map(regExUtil.toWebUrl);
}

export function getDistFiles(uniteConfig: IUniteConfiguration, includeModes: IncludeMode[], isBundled: boolean, isMinified: boolean): string[] {
    let files: string[] = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];

        if (includeModes.indexOf(pkg.includeMode) >= 0) {
            if (!isBundled ||
                (isBundled && (pkg.scriptIncludeMode === "bundled" || pkg.scriptIncludeMode === "both"))) {

                files = files.concat(getPackageFiles(uniteConfig, pkg, isMinified));
            }
        }
    });

    return files.map(regExUtil.toWebUrl);
}

export function getRequires(uniteConfig: IUniteConfiguration, includeModes: IncludeMode[], isMinified: boolean): string[] {
    const requires: string[] = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0 &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain && pkgMain !== "*") {
                requires.push(pkg.name);
            }
        }
    });

    return requires;
}

export async function getBundleVendorPackages(uniteConfig: IUniteConfiguration):
    Promise<{ [id: string]: { file: string; isMinified: boolean; useExact: boolean } }> {
    const vendorPackages: { [id: string]: { file: string; isMinified: boolean; useExact: boolean } } = {};

    const globAsync = util.promisify<string, string[]>(glob);

    const keys = Object.keys(uniteConfig.clientPackages);
    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];

        if ((pkg.includeMode === "app" || pkg.includeMode === "both") &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            const pkgMain = pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                const pkgLocation = pkg.transpile && pkg.transpile.alias ? pkg.transpile.alias : pkg.name;

                if (pkgMain === "*") {
                    let files: string[] = [];
                    if (pkg.mainLib) {
                        for (let j = 0; j < pkg.mainLib.length; j++) {
                            files = files.concat(await globAsync(path.join(
                                uniteConfig.dirs.www.package,
                                `${pkgLocation}/${pkg.mainLib[j]}`
                            )));
                        }
                    } else {
                        files = await globAsync(path.join(
                            uniteConfig.dirs.www.package,
                            `${pkgLocation}/${pkgMain}*/*.js`
                        ));
                    }

                    files.forEach(file => {
                        const itemKey = file.replace(new RegExp(`(?:.*)${pkgLocation}(.*).js`), `${pkg.name}$1`);
                        vendorPackages[itemKey] = {
                            file,
                            isMinified: Boolean(pkg.mainMinified),
                            useExact: true
                        };
                    });
                } else {
                    vendorPackages[pkg.name] = {
                        file: path.join(uniteConfig.dirs.www.package, `${pkg.name}/${pkgMain}`),
                        isMinified: Boolean(pkg.mainMinified),
                        useExact: false
                    };
                }
            }
        }
    }

    return vendorPackages;
}

export function getScriptIncludes(uniteConfig: IUniteConfiguration, isBundled: boolean): string[] {
    const scriptIncludes: string[] = [];
    const scriptIncludes2: string[] = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];

        if ((isBundled && (pkg.scriptIncludeMode === "bundled" || pkg.scriptIncludeMode === "both")) ||
            (!isBundled && (pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both"))) {
            const pkgLocation = pkg.transpile && pkg.transpile.alias ? pkg.transpile.alias : pkg.name;

            const main = isBundled && pkg.mainMinified ? pkg.mainMinified : pkg.main;
            const script = `./${path.join(uniteConfig.dirs.www.package, `${pkgLocation}/${main}`)}`;

            if (pkg.isModuleLoader) {
                scriptIncludes2.push(script);
            } else {
                scriptIncludes.push(script);
            }
        }
    });

    return scriptIncludes.concat(scriptIncludes2).map(regExUtil.toWebUrl);
}

export function getTestPackages(uniteConfig: IUniteConfiguration): { [id: string]: IUniteClientPackage } {
    const testPackages: { [id: string]: IUniteClientPackage } = {};

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];

        if (pkg.includeMode === "test" || pkg.includeMode === "both") {
            testPackages[key] = pkg;
        }
    });

    return testPackages;
}

export function getAssets(uniteConfig: IUniteConfiguration): string[] {
    let assets: string[] = [];

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        assets = assets.concat(getPackageAssets(uniteConfig, pkg));
    });

    return assets;
}

export function buildModuleConfig(uniteConfig: IUniteConfiguration, includeModes: IncludeMode[], isMinified: boolean): IModuleConfig {
    const moduleConfig: IModuleConfig = {
        paths: {},
        packages: [],
        preload: [],
        map: {},
        loaders: {}
    };

    const isTest = includeModes.indexOf("test") >= 0;

    Object.keys(uniteConfig.clientPackages).forEach(key => {
        const pkg = uniteConfig.clientPackages[key];
        if (includeModes.indexOf(pkg.includeMode) >= 0 &&
            (!pkg.scriptIncludeMode || pkg.scriptIncludeMode === "none")) {
            const pkgMain = isMinified && pkg.mainMinified ? pkg.mainMinified : pkg.main;

            if (pkgMain) {
                const pkgLocation = pkg.transpile && pkg.transpile.alias ? pkg.transpile.alias : pkg.name;

                if (pkgMain === "*") {
                    moduleConfig.map[pkg.name] = `${uniteConfig.dirs.www.package}${pkgLocation}`;
                } else {
                    const mainSplit = pkgMain.split("/");
                    const main = regExUtil.stripJsExtension(mainSplit.pop());
                    let location = mainSplit.join("/");

                    if (pkg.isPackage) {
                        moduleConfig.packages.push({
                            name: pkg.name,
                            location: `${uniteConfig.dirs.www.package}${pkgLocation}/${location}`,
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

export function getTypeMap(uniteConfig: IUniteConfiguration, type: string, isMinified: boolean): string {
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
                        const pkgMainNoJs = regExUtil.stripJsExtension(pkgMain);
                        const pkgMainFullPath = `${uniteConfig.dirs.www.package}${moduleKey}/${pkgMainNoJs}`;
                        return regExUtil.stripLeadingSlash(pkgMainFullPath);
                    }
                }
            }
        }
    }

    return "";
}

// Generated by UniteJS
