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
            engineVariables.toggleDevDependency(["jasmine-core"], uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine");
            engineVariables.toggleDevDependency(["@types/jasmine"], (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine")
                && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.lintEnv.jasmine = uniteConfiguration.linter === "ESLint" && (uniteConfiguration.unitTestFramework === "Jasmine" || uniteConfiguration.e2eTestFramework === "Jasmine");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsZ0ZBQTZFO0FBRzdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBQ2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQy9KLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQ2xCLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQzttQkFDdEcsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRTNGLGVBQWUsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUM7WUFFdEwsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFHLElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRTtvQkFFL0QsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsR0FBRyxFQUFFO29CQUM3RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBdEJELDBCQXNCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
