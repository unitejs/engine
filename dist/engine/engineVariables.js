"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniteClientPackage_1 = require("../configuration/models/unite/uniteClientPackage");
class EngineVariables {
    constructor() {
        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
    }
    toggleClientPackage(name, location, main, preload, includeMode, isPackage, required) {
        const clientPackage = new uniteClientPackage_1.UniteClientPackage();
        clientPackage.includeMode = includeMode;
        clientPackage.preload = preload;
        clientPackage.location = location;
        clientPackage.main = main;
        clientPackage.isPackage = isPackage;
        clientPackage.version = this.findDependencyVersion(name);
        let opArr;
        if (required) {
            opArr = this._requiredClientPackages;
        }
        else {
            opArr = this._removedClientPackages;
        }
        opArr[name] = clientPackage;
    }
    toggleDevDependency(dependencies, required) {
        let opArr;
        if (required) {
            opArr = this._requiredDevDependencies;
        }
        else {
            opArr = this._removedDevDependencies;
        }
        dependencies.forEach(dep => {
            if (opArr.indexOf(dep) < 0) {
                opArr.push(dep);
            }
        });
    }
    buildDependencies(uniteConfiguration, packageJsonDependencies) {
        for (const key in this._removedClientPackages) {
            if (packageJsonDependencies[key]) {
                delete packageJsonDependencies[key];
            }
        }
        const addedTestDependencies = [];
        const removedTestDependencies = [];
        for (const pkg in this._requiredClientPackages) {
            if (this._requiredClientPackages[pkg].includeMode === "app" || this._requiredClientPackages[pkg].includeMode === "both") {
                packageJsonDependencies[pkg] = this._requiredClientPackages[pkg].version;
                uniteConfiguration.clientPackages[pkg] = this._requiredClientPackages[pkg];
                const idx = this._requiredDevDependencies.indexOf(pkg);
                if (idx >= 0) {
                    this._requiredDevDependencies.splice(idx, 1);
                    removedTestDependencies.push(pkg);
                }
            }
            else if (this._requiredClientPackages[pkg].includeMode === "test") {
                addedTestDependencies.push(pkg);
            }
        }
        this.toggleDevDependency(addedTestDependencies, true);
        this.toggleDevDependency(removedTestDependencies, false);
    }
    buildDevDependencies(packageJsonDevDependencies) {
        this._removedDevDependencies.forEach(dependency => {
            if (packageJsonDevDependencies[dependency]) {
                delete packageJsonDevDependencies[dependency];
            }
        });
        if (this.corePackageJson.peerDependencies) {
            this._requiredDevDependencies.forEach(requiredDependency => {
                if (this.corePackageJson.peerDependencies[requiredDependency]) {
                    packageJsonDevDependencies[requiredDependency] = this.corePackageJson.peerDependencies[requiredDependency];
                }
                else {
                    throw new Error("Missing Dependency '" + requiredDependency + "'");
                }
            });
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
    findDependencyVersion(requiredDependency) {
        if (this.corePackageJson.peerDependencies) {
            if (this.corePackageJson.peerDependencies[requiredDependency]) {
                return this.corePackageJson.peerDependencies[requiredDependency];
            }
            else {
                throw new Error("Missing Dependency '" + requiredDependency + "'");
            }
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
}
exports.EngineVariables = EngineVariables;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEseUZBQXNGO0FBS3RGO0lBMENJO1FBQ0ksSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRU0sbUJBQW1CLENBQUMsSUFBWSxFQUNaLFFBQWdCLEVBQ2hCLElBQVksRUFDWixPQUFnQixFQUNoQixXQUF3QixFQUN4QixTQUFrQixFQUNsQixRQUFpQjtRQUN4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDL0MsYUFBYSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDeEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDaEMsYUFBYSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDbEMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDMUIsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDcEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekQsSUFBSSxLQUEyQyxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxLQUFLLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFDeEMsQ0FBQztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUM7SUFDaEMsQ0FBQztJQUVNLG1CQUFtQixDQUFDLFlBQXNC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
