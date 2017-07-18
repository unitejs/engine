/**
 * Variables used by the engine.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
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

    private _requiredDevDependencies: string[];
    private _removedDevDependencies: string[];
    private _requiredDependencies: string[];
    private _removedDependencies: string[];

    constructor() {
        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredDependencies = [];
        this._removedDependencies = [];
    }

    public toggleDependencies(dependencies: string[], required: boolean, isDev: boolean): void {
        if (isDev) {
            if (required) {
                this._requiredDevDependencies = this._requiredDevDependencies.concat(dependencies);
            } else {
                this._removedDevDependencies = this._removedDevDependencies.concat(dependencies);
            }
        } else {
            if (required) {
                this._requiredDependencies = this._requiredDependencies.concat(dependencies);
            } else {
                this._removedDependencies = this._removedDependencies.concat(dependencies);
            }
        }
    }

    public optimiseDependencies(): void {
        this._requiredDependencies.forEach(requiredDependency => {
            const idx = this._requiredDevDependencies.indexOf(requiredDependency);
            if (idx > 0) {
                this._requiredDevDependencies.splice(idx, 1);
            }
        });
    }

    public buildDependencies(dependencies: { [id: string]: string}, isDev: boolean): void {
        const srcRemove = isDev ? this._removedDevDependencies : this._removedDependencies;
        srcRemove.forEach(dependency => {
            if (dependencies[dependency]) {
                delete dependencies[dependency];
            }
        });

        if (this.corePackageJson.peerDependencies) {
            const srcRequire = isDev ? this._requiredDevDependencies : this._requiredDependencies;

            srcRequire.sort();

            srcRequire.forEach(requiredDependency => {
                if (this.corePackageJson.peerDependencies[requiredDependency]) {
                    dependencies[requiredDependency] = this.corePackageJson.peerDependencies[requiredDependency];
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
