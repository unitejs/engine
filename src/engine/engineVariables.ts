/**
 * Variables used by the engine.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { UniteClientPackage } from "../configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { EngineVariablesHtml } from "./engineVariablesHtml";

export class EngineVariables {
    public coreFolder: string;

    public rootFolder: string;
    public srcFolder: string;
    public distFolder: string;
    public unitTestFolder: string;
    public unitTestSrcFolder: string;
    public unitTestDistFolder: string;
    public cssSrcFolder: string;
    public cssDistFolder: string;
    public e2eTestFolder: string;
    public e2eTestSrcFolder: string;
    public e2eTestDistFolder: string;
    public reportsFolder: string;
    public packageFolder: string;

    public gulpBuildFolder: string;
    public gulpTasksFolder: string;
    public gulpUtilFolder: string;

    public assetsDirectory: string;

    public sourceLanguageExt: string;
    public styleLanguageExt: string;

    public gitIgnore: string[];
    public license: ISpdxLicense;
    public htmlNoBundle: EngineVariablesHtml;
    public htmlBundle: EngineVariablesHtml;

    public packageManager: IPackageManager;

    public corePackageJson: PackageConfiguration;

    public protractorPlugins: { [id: string]: boolean };

    public lintFeatures: { [id: string]: { required: boolean, object: any } };
    public lintExtends: { [id: string]: boolean };
    public lintPlugins: { [id: string]: boolean };
    public lintEnv: { [id: string]: boolean };
    public lintGlobals: { [id: string]: boolean };

    public transpileProperties: { [id: string]: { required: boolean, object: any } };

    public transpilePresets: { [id: string]: boolean };

    private _requiredDevDependencies: string[];
    private _removedDevDependencies: string[];
    private _requiredClientPackages: { [id: string]: UniteClientPackage };
    private _removedClientPackages: { [id: string]: UniteClientPackage };

    constructor() {
        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
    }

    public toggleClientPackage(name: string,
                               main: string,
                               mainMinified: string,
                               preload: boolean,
                               includeMode: IncludeMode,
                               isPackage: boolean,
                               required: boolean): void {
        const clientPackage = new UniteClientPackage();
        clientPackage.includeMode = includeMode;
        clientPackage.preload = preload;
        clientPackage.main = main;
        clientPackage.mainMinified = mainMinified;
        clientPackage.isPackage = isPackage;
        clientPackage.version = this.findDependencyVersion(name);

        let opArr: { [id: string]: UniteClientPackage };
        if (required) {
            opArr = this._requiredClientPackages;
        } else {
            opArr = this._removedClientPackages;
        }

        opArr[name] = clientPackage;
    }

    public getTestClientPackages(): string[] {
        return Object.keys(this._requiredClientPackages).filter(key => this._requiredClientPackages[key].includeMode === "test" || this._requiredClientPackages[key].includeMode === "both");
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
            } else if (this._requiredClientPackages[pkg].includeMode === "test") {
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

        if (this.corePackageJson.peerDependencies) {
            this._requiredDevDependencies.forEach(requiredDependency => {
                if (this.corePackageJson.peerDependencies[requiredDependency]) {
                    packageJsonDevDependencies[requiredDependency] = this.corePackageJson.peerDependencies[requiredDependency];
                } else {
                    throw new Error("Missing Dependency '" + requiredDependency + "'");
                }
            });
        } else {
            throw new Error("Dependency Versions missing");
        }
    }

    public findDependencyVersion(requiredDependency: string): string {
        if (this.corePackageJson.peerDependencies) {
            if (this.corePackageJson.peerDependencies[requiredDependency]) {
                return this.corePackageJson.peerDependencies[requiredDependency];
            } else {
                throw new Error("Missing Dependency '" + requiredDependency + "'");
            }
        } else {
            throw new Error("Dependency Versions missing");
        }
    }
}
