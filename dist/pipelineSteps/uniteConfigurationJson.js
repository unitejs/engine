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
class UniteConfigurationJson extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating unite.json in", { outputDirectory: uniteConfiguration.outputDirectory });
                yield fileSystem.fileWriteJson(uniteConfiguration.outputDirectory, "unite.json", uniteConfiguration);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating unite.json failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        });
    }
}
exports.UniteConfigurationJson = UniteConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdGVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsNkVBQTBFO0FBTTFFLDRCQUFvQyxTQUFRLCtDQUFzQjtJQUNqRCxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDaEgsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDckcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDM0gsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQVhELHdEQVdDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdGVDb25maWd1cmF0aW9uSnNvbi5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
