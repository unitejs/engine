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
 * Pipeline step to generate babel configuration.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const babelConfiguration_1 = require("../../configuration/models/babel/babelConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Babel extends enginePipelineStepBase_1.EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                engineVariables.sourceLanguageExt = "js";
                logger.info(`Initialising ${Babel.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                if (!engineVariables.force) {
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, Babel.FILENAME);
                        if (exists) {
                            this._configuration = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, Babel.FILENAME);
                        }
                    }
                    catch (err) {
                        logger.error(`Reading existing ${Babel.FILENAME} failed`, err);
                        return 1;
                    }
                }
                this.configDefaults(engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript");
            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                try {
                    logger.info(`Generating ${Babel.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, Babel.FILENAME, this._configuration);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Babel.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Babel.FILENAME, engineVariables.force);
            }
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new babelConfiguration_1.BabelConfiguration();
        defaultConfiguration.presets = [];
        defaultConfiguration.plugins = [];
        defaultConfiguration.env = {};
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("Babel", this._configuration);
    }
}
Babel.FILENAME = ".babelrc";
exports.Babel = Babel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDhFQUEyRTtBQUczRSw0RkFBeUY7QUFFekYsZ0ZBQTZFO0FBRzdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBS2hDLFVBQVUsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDOztZQUNwRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckQsZUFBZSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztnQkFFekMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUU1RixFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMxRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNULElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFxQixlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDM0gsQ0FBQztvQkFDTCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMvRCxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNiLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBQ1ksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxFQUFFLHFCQUFxQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRS9ILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztvQkFFMUYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBRW5HLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxLQUFLLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUN2RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVILENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsZUFBZ0M7UUFDbkQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFFdEQsb0JBQW9CLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQyxvQkFBb0IsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLG9CQUFvQixDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7QUExRGMsY0FBUSxHQUFXLFVBQVUsQ0FBQztBQURqRCxzQkE0REMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9sYW5ndWFnZS9iYWJlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBiYWJlbCBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgQmFiZWwgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCIuYmFiZWxyY1wiO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogQmFiZWxDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZSA9PT0gXCJKYXZhU2NyaXB0XCIpIHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zb3VyY2VMYW5ndWFnZUV4dCA9IFwianNcIjtcblxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEluaXRpYWxpc2luZyAke0JhYmVsLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgaWYgKCFlbmdpbmVWYXJpYWJsZXMuZm9yY2UpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEJhYmVsLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPEJhYmVsQ29uZmlndXJhdGlvbj4oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEJhYmVsLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtCYWJlbC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcImJhYmVsLWNvcmVcIiwgXCJiYWJlbC1wcmVzZXQtZXMyMDE1XCJdLCB1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UgPT09IFwiSmF2YVNjcmlwdFwiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlID09PSBcIkphdmFTY3JpcHRcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgR2VuZXJhdGluZyAke0JhYmVsLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlSnNvbihlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgQmFiZWwuRklMRU5BTUUsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtCYWJlbC5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBCYWJlbC5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgQmFiZWxDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ucHJlc2V0cyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmVudiA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiQmFiZWxcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
