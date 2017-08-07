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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsMkdBQXdHO0FBQ3hHLGdGQUE2RTtBQUc3RSxpQ0FBeUMsU0FBUSwrQ0FBc0I7SUFHdEQsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDO2dCQUUvRyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFbkcsSUFBSSxRQUFRLENBQUM7Z0JBQ2IsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUEwQixpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0gsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsMkJBQTJCLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3JGLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlGLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRWhHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsMkJBQTJCLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQy9FLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxRQUE2QztRQUNuSyxNQUFNLE1BQU0sR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFFN0MsTUFBTSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDbEQsTUFBTSxDQUFDLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBRTlCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztBQTdDYyxvQ0FBUSxHQUFXLGtCQUFrQixDQUFDO0FBRHpELGtFQStDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
