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
                engineVariables.buildDependencies(uniteConfiguration, packageJson.dependencies);
                engineVariables.buildDevDependencies(packageJson.devDependencies);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsbUdBQWdHO0FBRWhHLGdGQUE2RTtBQU03RSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFHdEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsSUFBSSxtQkFBcUQsQ0FBQztnQkFDMUQsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFN0YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUVySixtQkFBbUIsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXVCLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoSSxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsV0FBVyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDbkssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsV0FBVyxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFFaEgsTUFBTSxXQUFXLEdBQUcsbUJBQW1CLElBQUksSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO2dCQUN0RSxXQUFXLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztnQkFDbEQsV0FBVyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztnQkFDckQsV0FBVyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pELFdBQVcsQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7Z0JBQ2hFLFdBQVcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7Z0JBRTFELGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2hGLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRWxFLFdBQVcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDM0UsV0FBVyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUVqRixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUM5RixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxXQUFXLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDM0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxnQkFBZ0IsQ0FBQyxZQUFzQztRQUMzRCxNQUFNLGVBQWUsR0FBNkIsRUFBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO1lBQ1osZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFM0IsQ0FBQzs7QUFuRGMsb0JBQVEsR0FBVyxjQUFjLENBQUM7QUFEckQsa0NBcURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9wYWNrYWdlSnNvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
