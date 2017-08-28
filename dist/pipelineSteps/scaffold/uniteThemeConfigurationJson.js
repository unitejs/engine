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
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Initialising Unite Theme Config");
            const sourceThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");
            if (!engineVariables.force) {
                try {
                    const exists = yield fileSystem.fileExists(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                    if (exists) {
                        this._configuration = yield fileSystem.fileReadJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                    return 1;
                }
            }
            this.configDefaults(uniteConfiguration, engineVariables);
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Generating ${UniteThemeConfigurationJson.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                const sourceThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");
                yield fileSystem.fileWriteJson(sourceThemeFolder, UniteThemeConfigurationJson.FILENAME, this._configuration);
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${UniteThemeConfigurationJson.FILENAME} failed`, err);
                return 1;
            }
        });
    }
    configDefaults(uniteConfiguration, engineVariables) {
        const defaultConfiguration = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        if (uniteConfiguration.title) {
            defaultConfiguration.metaDescription = uniteConfiguration.title;
            defaultConfiguration.metaKeywords = uniteConfiguration.title.split(" ");
        }
        defaultConfiguration.metaAuthor = "";
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.themeHeaders = [];
        defaultConfiguration.backgroundColor = "#339933";
        defaultConfiguration.themeColor = "#339933";
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
UniteThemeConfigurationJson.FILENAME = "unite-theme.json";
exports.UniteThemeConfigurationJson = UniteThemeConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFJM0UsMkdBQXdHO0FBQ3hHLGdGQUE2RTtBQUc3RSxpQ0FBeUMsU0FBUSwrQ0FBc0I7SUFLdEQsVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUN0SSxNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7WUFFL0MsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWhHLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3BHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQTBCLGlCQUFpQixFQUFFLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMxSSxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQiwyQkFBMkIsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFDLENBQUMsQ0FBQztnQkFFL0csTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUVoRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFFN0csTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYywyQkFBMkIsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDM0YsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFFM0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMzQixvQkFBb0IsQ0FBQyxlQUFlLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDO1lBQ2hFLG9CQUFvQixDQUFDLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFDRCxvQkFBb0IsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JDLG9CQUFvQixDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEMsb0JBQW9CLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QyxvQkFBb0IsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2pELG9CQUFvQixDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFFNUMsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7QUF6RGMsb0NBQVEsR0FBVyxrQkFBa0IsQ0FBQztBQUR6RCxrRUEyREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9zY2FmZm9sZC91bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgdW5pdGUtdGhlbWUuanNvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbiBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInVuaXRlLXRoZW1lLmpzb25cIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJJbml0aWFsaXNpbmcgVW5pdGUgVGhlbWUgQ29uZmlnXCIpO1xuXG4gICAgICAgIGNvbnN0IHNvdXJjZVRoZW1lRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyY0ZvbGRlciwgXCJ0aGVtZS9cIik7XG5cbiAgICAgICAgaWYgKCFlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlRXhpc3RzKHNvdXJjZVRoZW1lRm9sZGVyLCBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFVuaXRlVGhlbWVDb25maWd1cmF0aW9uPihzb3VyY2VUaGVtZUZvbGRlciwgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRoZW1lRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyY0ZvbGRlciwgXCJ0aGVtZS9cIik7XG5cbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlSnNvbihzb3VyY2VUaGVtZUZvbGRlciwgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7VW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1ldGFEZXNjcmlwdGlvbiA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1ldGFLZXl3b3JkcyA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZS5zcGxpdChcIiBcIik7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubWV0YUF1dGhvciA9IFwiXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmN1c3RvbUhlYWRlcnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udGhlbWVIZWFkZXJzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhY2tncm91bmRDb2xvciA9IFwiIzMzOTkzM1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50aGVtZUNvbG9yID0gXCIjMzM5OTMzXCI7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJVbml0ZVRoZW1lXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
