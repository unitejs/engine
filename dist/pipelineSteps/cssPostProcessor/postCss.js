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
 * Pipeline step to generate handle postCss styling.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const postCssConfiguration_1 = require("../../configuration/models/postcss/postCssConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PostCss extends enginePipelineStepBase_1.EnginePipelineStepBase {
    preProcess(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.cssPost === "PostCss") {
                logger.info(`Initialising ${PostCss.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, PostCss.FILENAME);
                    if (exists) {
                        this._configuration = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, PostCss.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${PostCss.FILENAME} failed`, err);
                    return 1;
                }
                this.configDefaults(engineVariables);
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], uniteConfiguration.cssPost === "PostCss");
            if (uniteConfiguration.cssPost === "PostCss") {
                try {
                    logger.info(`Generating ${PostCss.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, ".postcssrc.json", this._configuration);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${PostCss.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, PostCss.FILENAME);
            }
        });
    }
    configDefaults(engineVariables) {
        const defaultConfiguration = new postCssConfiguration_1.PostCssConfiguration();
        defaultConfiguration.plugins = {};
        defaultConfiguration.plugins["postcss-import"] = {};
        defaultConfiguration.plugins.autoprefixer = {};
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("PostCss", this._configuration);
    }
}
PostCss.FILENAME = ".postcssrc.json";
exports.PostCss = PostCss;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFHM0Usa0dBQStGO0FBRS9GLGdGQUE2RTtBQUc3RSxhQUFxQixTQUFRLCtDQUFzQjtJQUtsQyxVQUFVLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3RJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBRTlGLElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzVGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXVCLGVBQWUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvSCxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixPQUFPLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUM7WUFFeEksRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUU1RixNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3RHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxPQUFPLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO29CQUN6RyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2RyxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLGVBQWdDO1FBQ25ELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO1FBRXhELG9CQUFvQixDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRS9DLElBQUksQ0FBQyxjQUFjLEdBQUcsMkJBQVksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBGLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7O0FBcERjLGdCQUFRLEdBQVcsaUJBQWlCLENBQUM7QUFEeEQsMEJBc0RDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzUG9zdFByb2Nlc3Nvci9wb3N0Q3NzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGhhbmRsZSBwb3N0Q3NzIHN0eWxpbmcuXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBvc3RDc3NDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Bvc3Rjc3MvcG9zdENzc0NvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3N0Q3NzIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwiLnBvc3Rjc3NyYy5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBQb3N0Q3NzQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBhc3luYyBwcmVQcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUG9zdCA9PT0gXCJQb3N0Q3NzXCIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBJbml0aWFsaXNpbmcgJHtQb3N0Q3NzLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVFeGlzdHMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFBvc3RDc3MuRklMRU5BTUUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBvc3RDc3NDb25maWd1cmF0aW9uPihlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgUG9zdENzcy5GSUxFTkFNRSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBSZWFkaW5nIGV4aXN0aW5nICR7UG9zdENzcy5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb25maWdEZWZhdWx0cyhlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicG9zdGNzc1wiLCBcInBvc3Rjc3MtaW1wb3J0XCIsIFwiYXV0b3ByZWZpeGVyXCIsIFwiY3NzbmFub1wiXSwgdW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QgPT09IFwiUG9zdENzc1wiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmNzc1Bvc3QgPT09IFwiUG9zdENzc1wiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7UG9zdENzcy5GSUxFTkFNRX1gLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUpzb24oZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIFwiLnBvc3Rjc3NyYy5qc29uXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7UG9zdENzcy5GSUxFTkFNRX0gZmFpbGVkYCwgZXJyLCB7IHd3d0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZGVsZXRlRmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBQb3N0Q3NzLkZJTEVOQU1FKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHMoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSBuZXcgUG9zdENzc0NvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zID0ge307XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnBsdWdpbnNbXCJwb3N0Y3NzLWltcG9ydFwiXSA9IHt9O1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5wbHVnaW5zLmF1dG9wcmVmaXhlciA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBPYmplY3RIZWxwZXIubWVyZ2UoZGVmYXVsdENvbmZpZ3VyYXRpb24sIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5zZXRDb25maWd1cmF0aW9uKFwiUG9zdENzc1wiLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG59XG4iXX0=
