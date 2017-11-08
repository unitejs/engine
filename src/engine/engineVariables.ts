/**
 * Variables used by the engine.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { EngineVariablesMeta } from "./engineVariablesMeta";

export class EngineVariables {
    public meta: EngineVariablesMeta;
    public force: boolean;
    public engineRootFolder: string;
    public engineAssetsFolder: string;
    public engineVersion: string;
    public engineDependencies: { [id: string]: string };

    public rootFolder: string;
    public wwwRootFolder: string;
    public packagedRootFolder: string;
    public platformRootFolder: string;

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
        configurationFolder: string;

        assetsFolder: string;
        assetsSrcFolder: string;
    };

    public buildTranspileInclude: string[];
    public buildTranspilePreBuild: string[];
    public buildTranspilePostBuild: string[];

    public syntheticImport: string;
    public moduleId: string;

    public packageManager: IPackageManager;

    private _configuration: { [id: string]: any };

    private _requiredDevDependencies: string[];
    private _removedDevDependencies: string[];
    private _requiredClientPackages: { [id: string]: UniteClientPackage };
    private _removedClientPackages: { [id: string]: UniteClientPackage };
    private _existingClientPackages: { [id: string]: UniteClientPackage };

    constructor() {
        this._configuration = {};

        this.syntheticImport = "";
        this.moduleId = "";

        this.buildTranspileInclude = [];
        this.buildTranspilePreBuild = [];
        this.buildTranspilePostBuild = [];

        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
        this._existingClientPackages = {};
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
        this.platformRootFolder = fileSystem.pathCombine(this.rootFolder, "platform");
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
            packageFolder: fileSystem.pathCombine(this.wwwRootFolder, "node_modules"),
            configurationFolder: fileSystem.pathCombine(this.wwwRootFolder, "configuration")
        };
    }

    public initialisePackages(clientPackages: { [id: string]: UniteClientPackage }): void {
        this._existingClientPackages = clientPackages;
    }

    public toggleClientPackage(key: string, clientPackage: UniteClientPackage, required: boolean): void {
        if (required) {
            this.addClientPackage(key, clientPackage);
        } else {
            this.removeClientPackage(key, clientPackage);
        }
    }

    public addClientPackage(key: string, clientPackage: UniteClientPackage): void {
        if (!clientPackage.version) {
            clientPackage.version = this.findDependencyVersion(clientPackage.name);
        }
        this._requiredClientPackages[key] = clientPackage;
    }

    public removeClientPackage(key: string, clientPackage: UniteClientPackage): void {
        this._removedClientPackages[key] = clientPackage;
    }

    public toggleDevDependency(dependencies: string[], required: boolean): void {
        if (required) {
            this.addDevDependency(dependencies);
        } else {
            this.removeDevDependency(dependencies);
        }
    }

    public addDevDependency(dependencies: string[]): void {
        dependencies.forEach(dep => {
            if (this._requiredDevDependencies.indexOf(dep) < 0) {
                this._requiredDevDependencies.push(dep);
            }
        });
    }

    public removeDevDependency(dependencies: string[]): void {
        dependencies.forEach(dep => {
            if (this._removedDevDependencies.indexOf(dep) < 0) {
                this._removedDevDependencies.push(dep);
            }
        });
    }

    public buildDependencies(uniteConfiguration: UniteConfiguration, packageJsonDependencies: { [id: string]: string }): void {
        for (const key in this._removedClientPackages) {
            const pkg = this._removedClientPackages[key];

            if (packageJsonDependencies[pkg.name]) {
                delete packageJsonDependencies[pkg.name];
            }

            if (this._existingClientPackages[key] &&
                !this._existingClientPackages[key].hasOverrides) {
                delete this._existingClientPackages[key];
            }
        }

        for (const key in this._existingClientPackages) {
            const pkg = this._existingClientPackages[key];

            if (pkg.hasOverrides || !this._requiredClientPackages[key]) {
                this._requiredClientPackages[key] = pkg;
            }
        }

        const addedTestDependencies = [];
        const removedTestDependencies = [];
        for (const key in this._requiredClientPackages) {
            const pkg = this._requiredClientPackages[key];

            uniteConfiguration.clientPackages[key] = pkg;
            if (pkg.includeMode === "app" || pkg.includeMode === "both") {
                packageJsonDependencies[pkg.name] = pkg.version;

                const idx = this._requiredDevDependencies.indexOf(pkg.name);
                if (idx >= 0) {
                    this._requiredDevDependencies.splice(idx, 1);
                    removedTestDependencies.push(pkg.name);
                }
            } else {
                addedTestDependencies.push(pkg.name);
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
        if (this.engineDependencies) {
            if (this.engineDependencies[requiredDependency]) {
                return this.engineDependencies[requiredDependency];
            } else {
                throw new Error(`Missing Dependency '${requiredDependency}'`);
            }
        } else {
            throw new Error("Dependency Versions missing");
        }
    }
}
