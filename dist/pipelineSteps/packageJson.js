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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsZ0dBQTZGO0FBRzdGLDZFQUEwRTtBQU0xRSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFDdEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLGlCQUFvQyxDQUFDO1lBRXpDLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO2dCQUU3SixpQkFBaUIsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQW9CLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDNUksQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7Z0JBQzNLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFFckcsTUFBTSxXQUFXLEdBQUcsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO2dCQUMvQyxXQUFXLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztnQkFDbEQsV0FBVyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQzlCLFdBQVcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQzdILFdBQVcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBRW5JLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDeEYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ2hILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sa0JBQWtCLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsb0JBQThCLEVBQUUsaUJBQW9DO1FBQy9ILE1BQU0sWUFBWSxHQUE2QixFQUFFLENBQUM7UUFFbEQsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO2dCQUU1QixvQkFBb0IsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pELFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUN0RixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEdBQUcsa0JBQWtCLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ3ZFLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN4QixDQUFDO0NBQ0o7QUFuREQsa0NBbURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
