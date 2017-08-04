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
    toggleClientPackage(name, main, mainMinified, preload, includeMode, isPackage, required) {
        const clientPackage = new uniteClientPackage_1.UniteClientPackage();
        clientPackage.includeMode = includeMode;
        clientPackage.preload = preload;
        clientPackage.main = main;
        clientPackage.mainMinified = mainMinified;
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
    getTestClientPackages() {
        return Object.keys(this._requiredClientPackages).filter(key => this._requiredClientPackages[key].includeMode === "test" || this._requiredClientPackages[key].includeMode === "both");
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
            uniteConfiguration.clientPackages[pkg] = this._requiredClientPackages[pkg];
            if (this._requiredClientPackages[pkg].includeMode === "app" || this._requiredClientPackages[pkg].includeMode === "both") {
                packageJsonDependencies[pkg] = this._requiredClientPackages[pkg].version;
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
                    throw new Error(`Missing Dependency '${requiredDependency}'`);
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
                throw new Error(`Missing Dependency '${requiredDependency}'`);
            }
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
}
exports.EngineVariables = EngineVariables;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEseUZBQXNGO0FBS3RGO0lBd0RJO1FBQ0ksSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRU0sbUJBQW1CLENBQUMsSUFBWSxFQUNaLElBQVksRUFDWixZQUFvQixFQUNwQixPQUFnQixFQUNoQixXQUF3QixFQUN4QixTQUFrQixFQUNsQixRQUFpQjtRQUN4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDL0MsYUFBYSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDeEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDaEMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDMUIsYUFBYSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDMUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDcEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekQsSUFBSSxLQUEyQyxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxLQUFLLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDO1FBQ3pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFDeEMsQ0FBQztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUM7SUFDaEMsQ0FBQztJQUVNLHFCQUFxQjtRQUN4QixN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SUFFTSxvQkFBb0IsQ0FBQywwQkFBb0Q7UUFDNUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsT0FBTywwQkFBMEIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLGtCQUFrQjtnQkFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUQsMEJBQTBCLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQy9HLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRSxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7SUFFTSxxQkFBcUIsQ0FBQyxrQkFBMEI7UUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNyRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQXJLRCwwQ0FxS0MiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
