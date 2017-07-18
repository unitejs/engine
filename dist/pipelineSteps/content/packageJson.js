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
const packageConfiguration_1 = require("../../configuration/models/packages/packageConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PackageJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let existingPackageJson;
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.rootFolder, PackageJson.FILENAME);
                    if (exists) {
                        _super("log").call(this, logger, display, `Loading existing ${PackageJson.FILENAME}`, { core: engineVariables.rootFolder, dependenciesFile: PackageJson.FILENAME });
                        existingPackageJson = yield fileSystem.fileReadJson(engineVariables.rootFolder, PackageJson.FILENAME);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Loading existing ${PackageJson.FILENAME} failed`, err, { core: engineVariables.rootFolder, dependenciesFile: PackageJson.FILENAME });
                    return 1;
                }
                _super("log").call(this, logger, display, `Generating ${PackageJson.FILENAME} in`, { rootFolder: engineVariables.rootFolder });
                const packageJson = existingPackageJson || new packageConfiguration_1.PackageConfiguration();
                packageJson.name = uniteConfiguration.packageName;
                packageJson.version = packageJson.version || "0.0.1";
                packageJson.license = uniteConfiguration.license;
                packageJson.devDependencies = packageJson.devDependencies || {};
                packageJson.dependencies = packageJson.dependencies || {};
                engineVariables.optimiseDependencies();
                engineVariables.buildDependencies(packageJson.devDependencies, true);
                engineVariables.buildDependencies(packageJson.dependencies, false);
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
                packageJson.dependencies = this.sortDependencies(packageJson.dependencies);
                packageJson.devDependencies = this.sortDependencies(packageJson.devDependencies);
                yield fileSystem.fileWriteJson(engineVariables.rootFolder, PackageJson.FILENAME, packageJson);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, `Generating ${PackageJson.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                return 1;
            }
        });
    }
    sortDependencies(dependencies) {
        const newDependencies = {};
        const keys = Object.keys(dependencies);
        keys.sort();
        keys.forEach(key => {
            newDependencies[key] = dependencies[key];
        });
        return newDependencies;
    }
}
PackageJson.FILENAME = "package.json";
exports.PackageJson = PackageJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsbUdBQWdHO0FBRWhHLGdGQUE2RTtBQU03RSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFHdEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsSUFBSSxtQkFBcUQsQ0FBQztnQkFDMUQsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFN0YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUVySixtQkFBbUIsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXVCLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoSSxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsV0FBVyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDbkssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsV0FBVyxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFFaEgsTUFBTSxXQUFXLEdBQUcsbUJBQW1CLElBQUksSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO2dCQUN0RSxXQUFXLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztnQkFDbEQsV0FBVyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztnQkFDckQsV0FBVyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pELFdBQVcsQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7Z0JBQ2hFLFdBQVcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7Z0JBRTFELGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2dCQUN2QyxlQUFlLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDckUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRW5FLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEtBQUssS0FBSyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDaEksV0FBVyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUNuRixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ3ZFLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDdEYsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsV0FBVyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMzRSxXQUFXLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRWpGLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQzlGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLFdBQVcsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUMzSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGdCQUFnQixDQUFDLFlBQXNDO1FBQzNELE1BQU0sZUFBZSxHQUE2QixFQUFFLENBQUM7UUFDckQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7WUFDWixlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUzQixDQUFDOztBQTlEYyxvQkFBUSxHQUFXLGNBQWMsQ0FBQztBQURyRCxrQ0FnRUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L3BhY2thZ2VKc29uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
