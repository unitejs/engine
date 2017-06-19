"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pipeline step to generate package.json.
 */
const packageConfiguration_1 = require("../configuration/models/packages/packageConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class PackageJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let uniteDependencies;
            try {
                _super("log").call(this, logger, display, "Loading dependencies", { assetsDirectory: engineVariables.assetsDirectory, dependenciesFile: engineVariables.dependenciesFile });
                uniteDependencies = yield fileSystem.fileReadJson(engineVariables.assetsDirectory, engineVariables.dependenciesFile);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Loading dependencies failed", err, { assetsDirectory: engineVariables.assetsDirectory, dependenciesFile: engineVariables.dependenciesFile });
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Generating package.json in", { rootFolder: engineVariables.rootFolder });
                const packageJson = new packageConfiguration_1.PackageConfiguration();
                packageJson.name = uniteConfiguration.packageName;
                packageJson.version = "0.0.1";
                packageJson.dependencies = this.lookupDependencies(logger, display, engineVariables.requiredDependencies, uniteDependencies);
                packageJson.devDependencies = this.lookupDependencies(logger, display, engineVariables.requiredDevDependencies, uniteDependencies);
                if (uniteConfiguration.clientPackages) {
                    for (const pkg in uniteConfiguration.clientPackages) {
                        if (uniteConfiguration.clientPackages[pkg].includeMode === "app" || uniteConfiguration.clientPackages[pkg].includeMode === "both") {
                            packageJson.dependencies[pkg] = uniteConfiguration.clientPackages[pkg].version;
                        }
                        else if (uniteConfiguration.clientPackages[pkg].includeMode === "test") {
                            packageJson.devDependencies[pkg] = uniteConfiguration.clientPackages[pkg].version;
                        }
                    }
                }
                yield fileSystem.fileWriteJson(engineVariables.rootFolder, "package.json", packageJson);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating package.json failed", err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        });
    }
    lookupDependencies(logger, display, requiredDependencies, uniteDependencies) {
        const dependencies = {};
        if (requiredDependencies) {
            if (uniteDependencies && uniteDependencies.versions) {
                requiredDependencies.sort();
                requiredDependencies.forEach(requiredDependency => {
                    if (uniteDependencies.versions[requiredDependency]) {
                        dependencies[requiredDependency] = uniteDependencies.versions[requiredDependency];
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
        return dependencies;
    }
}
exports.PackageJson = PackageJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsZ0dBQTZGO0FBRzdGLDZFQUEwRTtBQU0xRSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFDdEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLGlCQUFvQyxDQUFDO1lBRXpDLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO2dCQUU3SixpQkFBaUIsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQW9CLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDNUksQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7Z0JBQzNLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFFckcsTUFBTSxXQUFXLEdBQUcsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO2dCQUMvQyxXQUFXLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztnQkFDbEQsV0FBVyxD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
