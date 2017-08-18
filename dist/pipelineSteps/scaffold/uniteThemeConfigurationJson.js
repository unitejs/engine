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
 * Pipeline step to generate unite-theme.json.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const uniteThemeConfiguration_1 = require("../../configuration/models/uniteTheme/uniteThemeConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class UniteThemeConfigurationJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Generating ${UniteThemeConfigurationJson.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");
                let existing;
                try {
                    const exists = yield fileSystem.fileExists(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                    if (exists) {
                        existing = yield fileSystem.fileReadJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                    return 1;
                }
                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                yield fileSystem.fileWriteJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME, config);
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                return 1;
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        let config = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        config.metaDescription = uniteConfiguration.title;
        config.metaKeywords = uniteConfiguration.title.split(" ");
        config.metaAuthor = "";
        config.customHeaders = [];
        config.themeHeaders = [];
        config.backgroundColor = "#339933";
        config.themeColor = "#339933";
        config = objectHelper_1.ObjectHelper.merge(config, existing);
        return config;
    }
}
UniteThemeConfigurationJson.FILENAME = "unite-theme.json";
exports.UniteThemeConfigurationJson = UniteThemeConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFJM0UsMkdBQXdHO0FBQ3hHLGdGQUE2RTtBQUc3RSxpQ0FBeUMsU0FBUSwrQ0FBc0I7SUFHdEQsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDO2dCQUUvRyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRWhHLElBQUksUUFBUSxDQUFDO2dCQUNiLElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3BHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBMEIsaUJBQWlCLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9ILENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLDJCQUEyQixDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNyRixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUVoRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLDJCQUEyQixDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMvRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsUUFBNkM7UUFDbkssSUFBSSxNQUFNLEdBQUcsSUFBSSxpREFBdUIsRUFBRSxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxlQUFlLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxZQUFZLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNuQyxNQUFNLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUU5QixNQUFNLEdBQUcsMkJBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7QUEzQ2Msb0NBQVEsR0FBVyxrQkFBa0IsQ0FBQztBQUR6RCxrRUE2Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgdW5pdGUtdGhlbWUuanNvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbiBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInVuaXRlLXRoZW1lLmpzb25cIjtcblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke1VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXJ9KTtcblxuICAgICAgICAgICAgY29uc3Qgc291cmNlVGhlbWVGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyLCBcInRoZW1lL1wiKTtcblxuICAgICAgICAgICAgbGV0IGV4aXN0aW5nO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoc291cmNlVGhlbWVGb2xkZXIsIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5GSUxFTkFNRSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICBleGlzdGluZyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFVuaXRlVGhlbWVDb25maWd1cmF0aW9uPihzb3VyY2VUaGVtZUZvbGRlciwgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGV4aXN0aW5nKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlSnNvbihzb3VyY2VUaGVtZUZvbGRlciwgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FLCBjb25maWcpO1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVDb25maWcoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgZXhpc3Rpbmc6IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkKTogVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24ge1xuICAgICAgICBsZXQgY29uZmlnID0gbmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgY29uZmlnLm1ldGFEZXNjcmlwdGlvbiA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgY29uZmlnLm1ldGFLZXl3b3JkcyA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZS5zcGxpdChcIiBcIik7XG4gICAgICAgIGNvbmZpZy5tZXRhQXV0aG9yID0gXCJcIjtcbiAgICAgICAgY29uZmlnLmN1c3RvbUhlYWRlcnMgPSBbXTtcbiAgICAgICAgY29uZmlnLnRoZW1lSGVhZGVycyA9IFtdO1xuICAgICAgICBjb25maWcuYmFja2dyb3VuZENvbG9yID0gXCIjMzM5OTMzXCI7XG4gICAgICAgIGNvbmZpZy50aGVtZUNvbG9yID0gXCIjMzM5OTMzXCI7XG5cbiAgICAgICAgY29uZmlnID0gT2JqZWN0SGVscGVyLm1lcmdlKGNvbmZpZywgZXhpc3RpbmcpO1xuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufVxuIl19
