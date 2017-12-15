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
    public noCreateSource: boolean;

    public engineRootFolder: string;
    public engineAssetsFolder: string;
    public engineVersion: string;
    public engineDependencies: { [id: string]: string };

    public rootFolder: string;
    public wwwRootFolder: string;
    public packagedRootFolder: string;
    public platformRootFolder: string;
    public docsRootFolder: string;

    public www: {
        [id: string]: string;
        src: string;
        dist: string;
        unitRoot: string;
        unit: string;
        unitDist: string;
        css: string;
        cssDist: string;
        e2eRoot: string;
        e2e: string;
        e2eDist: string;
        reports: string;
        package: string;
        build: string;
        configuration: string;

        assets: string;
        assetsSrc: string;
    };

    public buildTranspileInclude: string[];
    public buildTranspilePreBuild: string[];
    public buildTranspilePostBuild: string[];

    public syntheticImport: string;
    public moduleId: string;

    public packageManager: IPackageManager;
    public additionalCompletionMessages: string[];

    private _configuration: { [id: string]: any };

    private _requiredDevDependencies: { [id: string]: UniteClientPackage };
    private _removedDevDependencies: { [id: string]: UniteClientPackage };
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

        this._requiredDevDependencies = {};
        this._removedDevDependencies = {};
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
        this._existingClientPackages = {};

        this.additionalCompletionMessages = [];
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
        this.docsRootFolder = fileSystem.pathCombine(this.rootFolder, "docs");
        this.www = {
            src: fileSystem.pathCombine(this.wwwRootFolder, "src"),
            dist: fileSystem.pathCombine(this.wwwRootFolder, "dist"),
            css: fileSystem.pathCombine(this.wwwRootFolder, "cssSrc"),
            cssDist: fileSystem.pathCombine(this.wwwRootFolder, "css"),
            e2eRoot: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e"),
            e2e: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/src"),
            e2eDist: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/dist"),
            unitRoot: fileSystem.pathCombine(this.wwwRootFolder, "test/unit"),
            unit: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/src"),
            unitDist: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/dist"),
            reports: fileSystem.pathCombine(this.wwwRootFolder, "test/reports"),
            assets: fileSystem.pathCombine(this.wwwRootFolder, "assets"),
            assetsSrc: fileSystem.pathCombine(this.wwwRootFolder, "assetsSrc"),
            build: fileSystem.pathCombine(this.wwwRootFolder, "build"),
            package: fileSystem.pathCombine(this.wwwRootFolder, "node_modules"),
            configuration: fileSystem.pathCombine(this.wwwRootFolder, "configuration")
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
            const clientPackage = new UniteClientPackage();
            clientPackage.name = dep;
            this._requiredDevDependencies[dep] = clientPackage;
        });
    }

    public removeDevDependency(dependencies: string[]): void {
        dependencies.forEach(dep => {
            const clientPackage = new UniteClientPackage();
            clientPackage.name = dep;
            this._removedDevDependencies[dep] = clientPackage;
        });
    }

    public addVersionedDevDependency(dependency: string, version: string): void {
        const clientPackage = new UniteClientPackage();
        clientPackage.name = dependency;
        clientPackage.version = version;
        this._requiredDevDependencies[dependency] = clientPackage;
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

        const addedDevDependencies = [];
        const removedDevDependencies = [];
        for (const key in this._requiredClientPackages) {
            const pkg = this._requiredClientPackages[key];

            uniteConfiguration.clientPackages[key] = pkg;
            if (pkg.includeMode === undefined || pkg.includeMode === "app" || pkg.includeMode === "both") {
                packageJsonDependencies[pkg.name] = pkg.version;

                if (this._requiredDevDependencies[pkg.name]) {
                    delete this._requiredDevDependencies[pkg.name];
                }
                removedDevDependencies.push(pkg.name);
            } else {
                addedDevDependencies.push(pkg.name);
            }
        }
        this.toggleDevDependency(addedDevDependencies, true);
        this.toggleDevDependency(removedDevDependencies, false);
    }

    public buildDevDependencies(packageJsonDevDependencies: { [id: string]: string }): void {
        Object.keys(this._removedDevDependencies).forEach(dependency => {
            if (packageJsonDevDependencies[dependency]) {
                delete packageJsonDevDependencies[dependency];
            }
        });

        Object.keys(this._requiredDevDependencies).forEach(requiredDependency => {
            if (this._requiredDevDependencies[requiredDependency].version) {
                packageJsonDevDependencies[requiredDependency] = this._requiredDevDependencies[requiredDependency].version;
            } else {
                packageJsonDevDependencies[requiredDependency] = this.findDependencyVersion(requiredDependency);
            }
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
