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
class GeneratePackageJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
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
                _super("log").call(this, logger, display, "Generating package.json in", { outputDirectory: uniteConfiguration.outputDirectory });
                const packageJson = new packageConfiguration_1.PackageConfiguration();
                packageJson.name = uniteConfiguration.packageName;
                packageJson.version = "0.0.1";
                packageJson.dependencies = this.lookupDependencies(logger, display, engineVariables.requiredDependencies, uniteDependencies);
                packageJson.devDependencies = this.lookupDependencies(logger, display, engineVariables.requiredDevDependencies, uniteDependencies);
                yield fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "package.json", packageJson);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating package.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
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
exports.GeneratePackageJson = GeneratePackageJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVQYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCxnR0FBNkY7QUFHN0YsNkVBQTBFO0FBTTFFLHlCQUFpQyxTQUFRLCtDQUFzQjtJQUM5QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksaUJBQW9DLENBQUM7WUFFekMsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7Z0JBRTdKLGlCQUFpQixHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBb0IsZUFBZSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM1SSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDM0ssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBRWxILE1BQU0sV0FBVyxHQUFHLElBQUksMkNBQW9CLEVBQUUsQ0FBQztnQkFDL0MsV0FBVyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xELFdBQVcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUM5QixXQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUM3SCxXQUFXLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVuSSxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDaEcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxrQkFBa0IsQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxvQkFBOEIsRUFBRSxpQkFBb0M7UUFDL0gsTUFBTSxZQUFZLEdBQTZCLEVBQUUsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsaUJBQWlCLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRTVCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxrQkFBa0I7b0JBQzNDLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakQsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ3RGLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDdkUsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQW5ERCxrREFtREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZVBhY2thZ2VKc29uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
