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
            engineVariables.toggleDependencies(["jasmine-core"], uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine", true);
            engineVariables.toggleDependencies(["@types/jasmine"], (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine")
                && uniteConfiguration.sourceLanguage === "TypeScript", true);
            if (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine") {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBQ2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwSyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUNsQixDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUM7bUJBQ3JHLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLEVBQ3RELElBQUksQ0FBQyxDQUFDO1lBRXpDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMxRyxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUU7b0JBRS9ELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtvQkFDN0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXJCRCwwQkFxQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy90ZXN0RnJhbWV3b3JrL2phc21pbmUuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
