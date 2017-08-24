/**
 * Variables used by the engine.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";

export class EngineVariables {
    public engineRootFolder: string;
    public engineAssetsFolder: string;
    public enginePackageJson: PackageConfiguration;

    public rootFolder: string;
    public wwwRootFolder: string;
    public packagedRootFolder: string;

    public www: {
        srcFolder: string;
        distFolder: string;
        unitTestFolder: string;
        unitTestSrcFolder: string;
        unitTestDistFolder: string;
        cssSrcFolder: string;
        cssDistFolder: string;
        e2eTestFolder: string;
        e2eTestSrcFolder: string;
        e2eTestDistFolder: string;
        reportsFolder: string;
        packageFolder: string;
        buildFolder: string;

        assetsFolder: string;
        assetsSrcFolder: string;
    };

    public sourceLanguageExt: string;
    public styleLanguageExt: string;

    public license: ISpdxLicense;

    public packageManager: IPackageManager;

    private _configuration: { [id: string]: any };

    private _requiredDevDependencies: string[];
    private _removedDevDependencies: string[];
    private _requiredClientPackages: { [id: string]: UniteClientPackage };
    private _removedClientPackages: { [id: string]: UniteClientPackage };

    constructor() {
        this._configuration = {};

        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
    }

    public setConfiguration(name: string, config: any): void {
        this._configuration[name] = config;
    }

    public getConfiguration<T>(name: string): T {
        return <T>this._configuration[name];
    }

    public setupDirectories(fileSystem: IFileSystem, rootFolder: string) : void {
        this.rootFolder = rootFolder;
        this.wwwRootFolder = fileSystem.pathCombine(this.rootFolder, "www");
        this.packagedRootFolder = fileSystem.pathCombine(this.rootFolder, "packaged");
        this.www = {
            srcFolder: fileSystem.pathCombine(this.wwwRootFolder, "src"),
            distFolder: fileSystem.pathCombine(this.wwwRootFolder, "dist"),
            cssSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "cssSrc"),
            cssDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "css"),
            e2eTestFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e"),
            e2eTestSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/src"),
            e2eTestDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/dist"),
            unitTestFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit"),
            unitTestSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/src"),
            unitTestDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/dist"),
            reportsFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/reports"),
            assetsFolder: fileSystem.pathCombine(this.wwwRootFolder, "assets"),
            assetsSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "assetsSrc"),
            buildFolder: fileSystem.pathCombine(this.wwwRootFolder, "build"),
            packageFolder: fileSystem.pathCombine(this.wwwRootFolder, "node_modules")
        };
    }

    public toggleClientPackage(name: string,
                               main: string,
                               mainMinified: string,
                               preload: boolean,
                               includeMode: IncludeMode,
                               scriptInclude: boolean,
                               isPackage: boolean,
                               assets: string,
                               required: boolean): void {
        const clientPackage = new UniteClientPackage();
        clientPackage.includeMode = includeMode;
        clientPackage.preload = preload;
        clientPackage.main = main;
        clientPackage.mainMinified = mainMinified;
        clientPackage.isPackage = isPackage;
        clientPackage.version = this.findDependencyVersion(name);
        clientPackage.assets = assets;
        clientPackage.scriptInclude = scriptInclude;

        let opArr: { [id: string]: UniteClientPackage };
        if (required) {
            opArr = this._requiredClientPackages;
        } else {
            opArr = this._removedClientPackages;
        }

        opArr[name] = clientPackage;
    }

    public getTestClientPackages(): { [id: string] : UniteClientPackage } {
        const packages: { [id: string] : UniteClientPackage } = {};

        Object.keys(this._requiredClientPackages)
            .filter(key => this._requiredClientPackages[key].includeMode === "test" || this._requiredClientPackages[key].includeMode === "both")
            .forEach(key => {
                packages[key] = this._requiredClientPackages[key];
            });

        return packages;
    }

    public getAppClientPackages(): { [id: string] : UniteClientPackage } {
        const packages: { [id: string] : UniteClientPackage } = {};

        Object.keys(this._requiredClientPackages)
            .filter(key => this._requiredClientPackages[key].includeMode === "app" || this._requiredClientPackages[key].includeMode === "both")
            .forEach(key => {
                packages[key] = this._requiredClientPackages[key];
            });

        return packages;
    }

    public toggleDevDependency(dependencies: string[], required: boolean): void {
        let opArr: string[];
        if (required) {
            opArr = this._requiredDevDependencies;
        } else {
            opArr = this._removedDevDependencies;
        }

        dependencies.forEach(dep => {
            if (opArr.indexOf(dep) < 0) {
                opArr.push(dep);
            }
        });
    }

    public buildDependencies(uniteConfiguration: UniteConfiguration, packageJsonDependencies: { [id: string]: string }): void {
        for (const key in this._removedClientPackages) {
            if (packageJsonDependencies[key]) {
                delete packageJsonDependencies[key];
            }
        }

        const addedTestDependencies = [];
        const removedTestDependencies = [];
        for (const pkg in this._requiredClientPackages) {
            uniteConfiguration.clientPackages[pkg] = this._requiredClientPackages[pkg];
            if (this._requiredClientPackages[pkg].includeMode === "app" || this._requiredClientPackages[pkg].includeMode === "both") {
                packageJsonDependencies[pkg] = this._requiredClientPackages[pkg].version;

                const idx = this._requiredDevDependencies.indexOf(pkg);
                if (idx >= 0) {
                    this._requiredDevDependencies.splice(idx, 1);
                    removedTestDependencies.push(pkg);
                }
            } else {
                addedTestDependencies.push(pkg);
            }
        }
        this.toggleDevDependency(addedTestDependencies, true);
        this.toggleDevDependency(removedTestDependencies, false);
    }

    public buildDevDependencies(packageJsonDevDependencies: { [id: string]: string }): void {
        this._removedDevDependencies.forEach(dependency => {
            if (packageJsonDevDependencies[dependency]) {
                delete packageJsonDevDependencies[dependency];
            }
        });

        this._requiredDevDependencies.forEach(requiredDependency => {
            packageJsonDevDependencies[requiredDependency] = this.findDependencyVersion(requiredDependency);
        });
    }

    public findDependencyVersion(requiredDependency: string): string {
        if (this.enginePackageJson && this.enginePackageJson.peerDependencies) {
            if (this.enginePackageJson.peerDependencies[requiredDependency]) {
                return this.enginePackageJson.peerDependencies[requiredDependency];
            } else {
                throw new Error(`Missing Dependency '${requiredDependency}'`);
            }
        } else {
            throw new Error("Dependency Versions missing");
        }
    }
}
