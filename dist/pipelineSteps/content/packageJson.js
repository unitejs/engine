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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBLG1HQUFnRztBQUVoRyxnRkFBNkU7QUFHN0UsaUJBQXlCLFNBQVEsK0NBQXNCO0lBR3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELElBQUksbUJBQXFELENBQUM7Z0JBQzFELElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRWhHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBRXpJLG1CQUFtQixHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBdUIsZUFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25JLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLFdBQVcsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDdEosTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxXQUFXLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBRW5HLE1BQU0sV0FBVyxHQUFHLG1CQUFtQixJQUFJLElBQUksMkNBQW9CLEVBQUUsQ0FBQztnQkFDdEUsV0FBVyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xELFdBQVcsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7Z0JBQ3JELFdBQVcsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxXQUFXLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO2dCQUNoRSxXQUFXLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO2dCQUMxRCxXQUFXLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDO2dCQUUxQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoRixlQUFlLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUVsRSxXQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNFLFdBQVcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFakYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDakcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxXQUFXLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGdCQUFnQixDQUFDLFlBQXNDO1FBQzNELE1BQU0sZUFBZSxHQUE2QixFQUFFLENBQUM7UUFDckQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7WUFDWixlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUzQixDQUFDOztBQXBEYyxvQkFBUSxHQUFXLGNBQWMsQ0FBQztBQURyRCxrQ0FzREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L3BhY2thZ2VKc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHBhY2thZ2UuanNvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VKc29uIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwicGFja2FnZS5qc29uXCI7XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUGFja2FnZUpzb246IFBhY2thZ2VDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFBhY2thZ2VKc29uLkZJTEVOQU1FKTtcblxuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYExvYWRpbmcgZXhpc3RpbmcgJHtQYWNrYWdlSnNvbi5GSUxFTkFNRX1gLCB7IGNvcmU6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBQYWNrYWdlSnNvbi5GSUxFTkFNRSB9KTtcblxuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1BhY2thZ2VKc29uID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248UGFja2FnZUNvbmZpZ3VyYXRpb24+KGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBQYWNrYWdlSnNvbi5GSUxFTkFNRSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBMb2FkaW5nIGV4aXN0aW5nICR7UGFja2FnZUpzb24uRklMRU5BTUV9IGZhaWxlZGAsIGVyciwgeyBjb3JlOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZGVwZW5kZW5jaWVzRmlsZTogUGFja2FnZUpzb24uRklMRU5BTUUgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7UGFja2FnZUpzb24uRklMRU5BTUV9IGluYCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IGV4aXN0aW5nUGFja2FnZUpzb24gfHwgbmV3IFBhY2thZ2VDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbi5uYW1lID0gdW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VOYW1lO1xuICAgICAgICAgICAgcGFja2FnZUpzb24udmVyc2lvbiA9IHBhY2thZ2VKc29uLnZlcnNpb24gfHwgXCIwLjAuMVwiO1xuICAgICAgICAgICAgcGFja2FnZUpzb24ubGljZW5zZSA9IHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlO1xuICAgICAgICAgICAgcGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzID0gcGFja2FnZUpzb24uZGV2RGVwZW5kZW5jaWVzIHx8IHt9O1xuICAgICAgICAgICAgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzID0gcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzIHx8IHt9O1xuICAgICAgICAgICAgcGFja2FnZUpzb24uZW5naW5lcyA9IHsgbm9kZTogXCI+PTguMC4wXCIgfTtcblxuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgICAgICBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgPSB0aGlzLnNvcnREZXBlbmRlbmNpZXMocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIHBhY2thZ2VKc29uLmRldkRlcGVuZGVuY2llcyA9IHRoaXMuc29ydERlcGVuZGVuY2llcyhwYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFBhY2thZ2VKc29uLkZJTEVOQU1FLCBwYWNrYWdlSnNvbik7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtQYWNrYWdlSnNvbi5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc29ydERlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGNvbnN0IG5ld0RlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpO1xuICAgICAgICBrZXlzLnNvcnQoKTtcbiAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBuZXdEZXBlbmRlbmNpZXNba2V5XSA9IGRlcGVuZGVuY2llc1trZXldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3RGVwZW5kZW5jaWVzO1xuXG4gICAgfVxufVxuIl19
