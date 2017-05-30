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
 * Pipeline step to generate gulp tasks for build.
 */
const buildConfiguration_1 = require("../configuration/models/build/buildConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GenerateGulpBuildConfiguration extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp build.config.json in", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                const buildConfiguration = new buildConfiguration_1.BuildConfiguration();
                buildConfiguration.srcFolder = "./src/";
                buildConfiguration.distFolder = "./dist/";
                yield fileSystem.fileWriteJson(engineVariables.gulpBuildFolder, "build.config.json", buildConfiguration);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp build.config.json failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }
        });
    }
}
exports.GenerateGulpBuildConfiguration = GenerateGulpBuildConfiguration;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVHdWxwQnVpbGRDb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlGQUFzRjtBQUV0Riw2RUFBMEU7QUFNMUUsb0NBQTRDLFNBQVEsK0NBQXNCO0lBQ3pELE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFFekgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7Z0JBRXBELGtCQUFrQixDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3hDLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7Z0JBRTFDLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRXpHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwwQ0FBMEMsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNwSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBbEJELHdFQWtCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2dlbmVyYXRlR3VscEJ1aWxkQ29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
