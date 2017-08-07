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
const postCssConfiguration_1 = require("../../configuration/models/postcss/postCssConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class PostCss extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["postcss", "postcss-import", "autoprefixer", "cssnano"], uniteConfiguration.cssPost === "PostCss");
            if (uniteConfiguration.cssPost === "PostCss") {
                try {
                    logger.info(`Generating ${PostCss.FILENAME}`, { wwwFolder: engineVariables.wwwFolder });
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwFolder, PostCss.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.wwwFolder, PostCss.FILENAME);
                        }
                    }
                    catch (err) {
                        logger.error(`Loading existing ${PostCss.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                        return 1;
                    }
                    const config = this.generateConfig(existing);
                    yield fileSystem.fileWriteJson(engineVariables.wwwFolder, ".postcssrc.json", config);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${PostCss.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwFolder, PostCss.FILENAME);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0Esa0dBQStGO0FBRS9GLGdGQUE2RTtBQUc3RSxhQUFxQixTQUFRLCtDQUFzQjtJQUdsQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQztZQUV4SSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBRXhGLElBQUksUUFBUSxDQUFDO29CQUViLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRXhGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBdUIsZUFBZSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRWhILENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7d0JBQzNHLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsQ0FBQztvQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUU3QyxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDckYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLE9BQU8sQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7b0JBQ3JHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25HLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsUUFBMEM7UUFDN0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxJQUFJLElBQUksMkNBQW9CLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRWpDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7QUE1Q2MsZ0JBQVEsR0FBVyxpQkFBaUIsQ0FBQztBQUR4RCwwQkE4Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQb3N0UHJvY2Vzc29yL3Bvc3RDc3MuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
