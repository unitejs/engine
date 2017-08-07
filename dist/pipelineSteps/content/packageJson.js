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
const packageConfiguration_1 = require("../../configuration/models/packages/packageConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PackageJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let existingPackageJson;
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, PackageJson.FILENAME);
                    if (exists) {
                        logger.info(`Loading existing ${PackageJson.FILENAME}`, { core: engineVariables.wwwRootFolder, dependenciesFile: PackageJson.FILENAME });
                        existingPackageJson = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, PackageJson.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Loading existing ${PackageJson.FILENAME} failed`, err, { core: engineVariables.wwwRootFolder, dependenciesFile: PackageJson.FILENAME });
                    return 1;
                }
                logger.info(`Generating ${PackageJson.FILENAME} in`, { wwwFolder: engineVariables.wwwRootFolder });
                const packageJson = existingPackageJson || new packageConfiguration_1.PackageConfiguration();
                packageJson.name = uniteConfiguration.packageName;
                packageJson.version = packageJson.version || "0.0.1";
                packageJson.license = uniteConfiguration.license;
                packageJson.devDependencies = packageJson.devDependencies || {};
                packageJson.dependencies = packageJson.dependencies || {};
                packageJson.engines = { node: ">=8.0.0" };
                engineVariables.buildDependencies(uniteConfiguration, packageJson.dependencies);
                engineVariables.buildDevDependencies(packageJson.devDependencies);
                packageJson.dependencies = this.sortDependencies(packageJson.dependencies);
                packageJson.devDependencies = this.sortDependencies(packageJson.devDependencies);
                yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, PackageJson.FILENAME, packageJson);
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${PackageJson.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBLG1HQUFnRztBQUVoRyxnRkFBNkU7QUFHN0UsaUJBQXlCLFNBQVEsK0NBQXNCO0lBR3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELElBQUksbUJBQXFELENBQUM7Z0JBQzFELElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRWhHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBRXpJLG1CQUFtQixHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBdUIsZUFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25JLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLFdBQVcsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDdEosTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxXQUFXLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBRW5HLE1BQU0sV0FBVyxHQUFHLG1CQUFtQixJQUFJLElBQUksMkNBQW9CLEVBQUUsQ0FBQztnQkFDdEUsV0FBVyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xELFdBQVcsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7Z0JBQ3JELFdBQVcsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxXQUFXLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO2dCQUNoRSxXQUFXLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO2dCQUMxRCxXQUFXLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDO2dCQUUxQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoRixlQUFlLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUVsRSxXQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNFLFdBQVcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFakYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDakcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxXQUFXLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGdCQUFnQixDQUFDLFlBQXNDO1FBQzNELE1BQU0sZUFBZSxHQUE2QixFQUFFLENBQUM7UUFDckQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7WUFDWixlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUzQixDQUFDOztBQXBEYyxvQkFBUSxHQUFXLGNBQWMsQ0FBQztBQURyRCxrQ0FzREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L3BhY2thZ2VKc29uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
