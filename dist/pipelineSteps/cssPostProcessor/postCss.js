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
const postCssConfiguration_1 = require("../../configuration/models/postcss/postCssConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PostCss extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.cssPost === "PostCss") {
                try {
                    _super("log").call(this, logger, display, "Generating .postcssrc.json", { rootFolder: engineVariables.rootFolder });
                    engineVariables.requiredDevDependencies.push("gulp-postcss");
                    engineVariables.requiredDevDependencies.push("postcss-import");
                    engineVariables.requiredDevDependencies.push("autoprefixer");
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.rootFolder, ".postcssrc.json");
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.rootFolder, ".postcssrc.json");
                        }
                    }
                    catch (err) {
                        _super("error").call(this, logger, display, "Loading existing .postcssrc.json failed", err, { rootFolder: engineVariables.rootFolder });
                        return 1;
                    }
                    const config = this.generateConfig(existing);
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, ".postcssrc.json", config);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating .postcssrc.json failed", err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }
            }
            else {
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.rootFolder, ".postcssrc.json");
                    if (exists) {
                        yield fileSystem.fileDelete(engineVariables.rootFolder, ".postcssrc.json");
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Deleting .postcssrc.json failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
    generateConfig(existing) {
        const config = existing || new postCssConfiguration_1.PostCssConfiguration();
        config.plugins = config.plugins || {};
        config.plugins["postcss-import"] = {};
        config.plugins.autoprefixer = {};
        return config;
    }
}
exports.PostCss = PostCss;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvY3NzUG9zdFByb2Nlc3Nvci9wb3N0Q3NzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILGtHQUErRjtBQUUvRixnRkFBNkU7QUFNN0UsYUFBcUIsU0FBUSwrQ0FBc0I7SUFDbEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFFckcsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDN0QsZUFBZSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUMvRCxlQUFlLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUU3RCxJQUFJLFFBQVEsQ0FBQztvQkFFYixJQUFJLENBQUM7d0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzt3QkFFMUYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUF1QixlQUFlLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7d0JBRWxILENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7d0JBQ3pILE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsQ0FBQztvQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUU3QyxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdEYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDbkgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQztvQkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUMxRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNULE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBQy9FLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtvQkFDckUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsUUFBMEM7UUFDN0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxJQUFJLElBQUksMkNBQW9CLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRWpDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKO0FBeERELDBCQXdEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
