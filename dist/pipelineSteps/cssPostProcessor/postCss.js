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
            engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], uniteConfiguration.cssPost === "PostCss");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCxrR0FBK0Y7QUFFL0YsZ0ZBQTZFO0FBTTdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBR2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUM7WUFFeEksRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBRXpHLElBQUksUUFBUSxDQUFDO29CQUViLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRXpGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBdUIsZUFBZSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRWpILENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixPQUFPLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTt3QkFDN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDYixDQUFDO29CQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRTdDLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUN0RixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLE9BQU8sQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO29CQUN2SCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLE1BQU0sb0JBQWdCLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0csQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxRQUEwQztRQUM3RCxNQUFNLE1BQU0sR0FBRyxRQUFRLElBQUksSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFakMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztBQTVDYyxnQkFBUSxHQUFXLGlCQUFpQixDQUFDO0FBRHhELDBCQThDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
