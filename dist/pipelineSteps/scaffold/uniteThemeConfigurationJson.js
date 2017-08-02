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
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, `Generating ${UniteThemeConfigurationJson.FILENAME}`);
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.assetsSourceFolder, "theme/");
                let existing;
                try {
                    const exists = yield fileSystem.fileExists(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                    if (exists) {
                        existing = yield fileSystem.fileReadJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Reading existing ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                    return 1;
                }
                const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                yield fileSystem.fileWriteJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME, config);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, `Generating ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                return 1;
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        const config = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        config.metaDescription = uniteConfiguration.title;
        config.metaKeywords = uniteConfiguration.title.split(" ");
        config.metaAuthor = "";
        config.metaHeaders = [];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsMkdBQXdHO0FBQ3hHLGdGQUE2RTtBQUc3RSxpQ0FBeUMsU0FBUSwrQ0FBc0I7SUFHdEQsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFFakYsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFL0YsSUFBSSxRQUFRLENBQUM7Z0JBQ2IsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUEwQixpQkFBaUIsRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0gsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLDJCQUEyQixDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRTtvQkFDckcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFaEcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsMkJBQTJCLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUMvRixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsUUFBNkM7UUFDbkssTUFBTSxNQUFNLEdBQUcsSUFBSSxpREFBdUIsRUFBRSxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxlQUFlLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxZQUFZLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNuQyxNQUFNLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7QUE3Q2Msb0NBQVEsR0FBVyxrQkFBa0IsQ0FBQztBQUR6RCxrRUErQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
