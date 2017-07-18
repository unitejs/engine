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
            engineVariables.toggleDependencies(["postcss", "postcss-import", "autoprefixer", "cssnano"], uniteConfiguration.cssPost === "PostCss", true);
            if (uniteConfiguration.cssPost === "PostCss") {
                try {
                    _super("log").call(this, logger, display, `Generating ${PostCss.FILENAME}`, { rootFolder: engineVariables.rootFolder });
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.rootFolder, PostCss.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.rootFolder, PostCss.FILENAME);
                        }
                    }
                    catch (err) {
                        _super("error").call(this, logger, display, `Loading existing ${PostCss.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                        return 1;
                    }
                    const config = this.generateConfig(existing);
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, ".postcssrc.json", config);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${PostCss.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, PostCss.FILENAME);
            }
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
PostCss.FILENAME = ".postcssrc.json";
exports.PostCss = PostCss;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCxrR0FBK0Y7QUFFL0YsZ0ZBQTZFO0FBTTdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBR2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTdJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUV6RyxJQUFJLFFBQVEsQ0FBQztvQkFFYixJQUFJLENBQUM7d0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUV6RixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNULFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQXVCLGVBQWUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUVqSCxDQUFDO29CQUNMLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsT0FBTyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7d0JBQzdILE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsQ0FBQztvQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUU3QyxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdEYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxPQUFPLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDdkgsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdHLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsUUFBMEM7UUFDN0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxJQUFJLElBQUksMkNBQW9CLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRWpDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7QUE1Q2MsZ0JBQVEsR0FBVyxpQkFBaUIsQ0FBQztBQUR4RCwwQkE4Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQb3N0UHJvY2Vzc29yL3Bvc3RDc3MuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
