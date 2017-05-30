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
 * Pipeline step to generate package.json.
 */
const packageConfiguration_1 = require("../configuration/models/packages/packageConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GeneratePackageJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating package.json in", { outputDirectory: uniteConfiguration.outputDirectory });
                const packageJson = new packageConfiguration_1.PackageConfiguration();
                packageJson.name = uniteConfiguration.name;
                packageJson.version = "0.0.1";
                packageJson.devDependencies = uniteConfiguration.devDependencies;
                yield fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "package.json", packageJson);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating package.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        });
    }
}
exports.GeneratePackageJson = GeneratePackageJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVQYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCxnR0FBNkY7QUFFN0YsNkVBQTBFO0FBTTFFLHlCQUFpQyxTQUFRLCtDQUFzQjtJQUM5QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDbEgsTUFBTSxXQUFXLEdBQUcsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO2dCQUMvQyxXQUFXLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQztnQkFDM0MsV0FBVyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQzlCLFdBQVcsQ0FBQyxlQUFlLEdBQUcsa0JBQWtCLENBQUMsZUFBZSxDQUFDO2dCQUVqRSxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDaEcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDN0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQWhCRCxrREFnQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9nZW5lcmF0ZVBhY2thZ2VKc29uLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
