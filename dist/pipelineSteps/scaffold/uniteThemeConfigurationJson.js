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
                logger.info(`Generating ${UniteThemeConfigurationJson.FILENAME}`, { wwwFolder: engineVariables.wwwFolder });
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.assetsSourceFolder, "theme/");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsMkdBQXdHO0FBQ3hHLGdGQUE2RTtBQUc3RSxpQ0FBeUMsU0FBUSwrQ0FBc0I7SUFHdEQsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO2dCQUUzRyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUvRixJQUFJLFFBQVEsQ0FBQztnQkFDYixJQUFJLENBQUM7b0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNULFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQTBCLGlCQUFpQixFQUFFLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvSCxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQiwyQkFBMkIsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFaEcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYywyQkFBMkIsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLFFBQTZDO1FBQ25LLE1BQU0sTUFBTSxHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztRQUU3QyxNQUFNLENBQUMsZUFBZSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztRQUNsRCxNQUFNLENBQUMsWUFBWSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDekIsTUFBTSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7UUFDbkMsTUFBTSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFFOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7O0FBN0NjLG9DQUFRLEdBQVcsa0JBQWtCLENBQUM7QUFEekQsa0VBK0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2NhZmZvbGQvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
