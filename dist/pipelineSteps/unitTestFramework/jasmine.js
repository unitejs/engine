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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Jasmine extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDependencies(["browser-sync"], uniteConfiguration.unitTestFramework === "Jasmine", true);
            engineVariables.toggleDependencies(["@types/jasmine"], uniteConfiguration.unitTestFramework === "Jasmine" && uniteConfiguration.sourceLanguage === "TypeScript", true);
            if (uniteConfiguration.unitTestFramework === "Jasmine") {
                try {
                    _super("log").call(this, logger, display, "Generating Jasmine Configuration");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating Jasmine Configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Jasmine = Jasmine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdFRlc3RGcmFtZXdvcmsvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBQ2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9HLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdkssRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGtDQUFrQyxFQUFFO29CQUUvRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7b0JBQzdFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsQkQsMEJBa0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdFRlc3RGcmFtZXdvcmsvamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
