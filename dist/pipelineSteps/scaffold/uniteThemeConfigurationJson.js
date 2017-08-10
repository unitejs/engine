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
const uniteThemeConfiguration_1 = require("../../configuration/models/uniteTheme/uniteThemeConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class UniteThemeConfigurationJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Generating ${UniteThemeConfigurationJson.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSourceFolder, "theme/");
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
        const config = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        config.metaDescription = uniteConfiguration.title;
        config.metaKeywords = uniteConfiguration.title.split(" ");
        config.metaAuthor = "";
        config.customHeaders = [];
        config.themeHeaders = [];
        config.backgroundColor = "#339933";
        config.themeColor = "#339933";
        if (existing) {
            Object.assign(config, existing);
        }
        return config;
    }
}
UniteThemeConfigurationJson.FILENAME = "unite-theme.json";
exports.UniteThemeConfigurationJson = UniteThemeConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsMkdBQXdHO0FBQ3hHLGdGQUE2RTtBQUc3RSxpQ0FBeUMsU0FBUSwrQ0FBc0I7SUFHdEQsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDO2dCQUUvRyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFbkcsSUFBSSxRQUFRLENBQUM7Z0JBQ2IsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUEwQixpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0gsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsMkJBQTJCLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3JGLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlGLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRWhHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsMkJBQTJCLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQy9FLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxRQUE2QztRQUNuSyxNQUFNLE1BQU0sR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFFN0MsTUFBTSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDbEQsTUFBTSxDQUFDLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBRTlCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztBQTdDYyxvQ0FBUSxHQUFXLGtCQUFrQixDQUFDO0FBRHpELGtFQStDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSB1bml0ZS10aGVtZS5qc29uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlVGhlbWUvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24gZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJ1bml0ZS10aGVtZS5qc29uXCI7XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRoZW1lRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NvdXJjZUZvbGRlciwgXCJ0aGVtZS9cIik7XG5cbiAgICAgICAgICAgIGxldCBleGlzdGluZztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKHNvdXJjZVRoZW1lRm9sZGVyLCBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxVbml0ZVRoZW1lQ29uZmlndXJhdGlvbj4oc291cmNlVGhlbWVGb2xkZXIsIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5GSUxFTkFNRSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7VW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBleGlzdGluZyk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oc291cmNlVGhlbWVGb2xkZXIsIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5GSUxFTkFNRSwgY29uZmlnKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7VW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlQ29uZmlnKGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIGV4aXN0aW5nOiBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCk6IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgY29uZmlnLm1ldGFEZXNjcmlwdGlvbiA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgY29uZmlnLm1ldGFLZXl3b3JkcyA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZS5zcGxpdChcIiBcIik7XG4gICAgICAgIGNvbmZpZy5tZXRhQXV0aG9yID0gXCJcIjtcbiAgICAgICAgY29uZmlnLmN1c3RvbUhlYWRlcnMgPSBbXTtcbiAgICAgICAgY29uZmlnLnRoZW1lSGVhZGVycyA9IFtdO1xuICAgICAgICBjb25maWcuYmFja2dyb3VuZENvbG9yID0gXCIjMzM5OTMzXCI7XG4gICAgICAgIGNvbmZpZy50aGVtZUNvbG9yID0gXCIjMzM5OTMzXCI7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGNvbmZpZywgZXhpc3RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59XG4iXX0=
