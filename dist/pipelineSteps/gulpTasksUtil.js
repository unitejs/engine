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
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GulpTasksUtil extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp tasks utils in", { gulpUtilFolder: engineVariables.gulpUtilFolder });
                engineVariables.requiredDevDependencies.push("gulp-util");
                engineVariables.requiredDevDependencies.push("gulp-rename");
                engineVariables.requiredDevDependencies.push("gulp-replace");
                const assetUtils = fileSystem.directoryPathCombine(engineVariables.assetsDirectory, "gulp/tasks/util/");
                yield this.copyFile(logger, display, fileSystem, assetUtils, "build-config.js", engineVariables.gulpUtilFolder, "build-config.js");
                yield this.copyFile(logger, display, fileSystem, assetUtils, "display.js", engineVariables.gulpUtilFolder, "display.js");
                yield this.copyFile(logger, display, fileSystem, assetUtils, "modules.js", engineVariables.gulpUtilFolder, "modules.js");
                yield this.copyFile(logger, display, fileSystem, assetUtils, "template.js", engineVariables.gulpUtilFolder, "template.js");
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp tasks utils failed", err, { gulpUtilFolder: engineVariables.gulpUtilFolder });
                return 1;
            }
        });
    }
}
exports.GulpTasksUtil = GulpTasksUtil;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscFRhc2tzVXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsNkVBQTBFO0FBTTFFLG1CQUEyQixTQUFRLCtDQUFzQjtJQUN4QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBRWpILGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzFELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzVELGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBRTdELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRXhHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVuSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUV6SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUV6SCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUUzSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDNUgsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQXpCRCxzQ0F5QkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9ndWxwVGFza3NVdGlsLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
