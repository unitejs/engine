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
class MochaChai extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDependencies(["mocha", "chai"], uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai", true);
            engineVariables.toggleDependencies(["@types/mocha", "@types/chai"], (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai")
                && uniteConfiguration.sourceLanguage === "TypeScript", true);
            if (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
                try {
                    _super("log").call(this, logger, display, "Generating Mocha-Chai Configuration");
                    uniteConfiguration.clientPackages.chai = { version: engineVariables.findDependencyVersion("chai"), main: "chai.js", preload: true, includeMode: "test" };
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating Mocha-Chai Configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.MochaChai = MochaChai;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxnRkFBNkU7QUFNN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzSyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLEVBQy9CLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQzttQkFDMUcsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksRUFDdkQsSUFBSSxDQUFDLENBQUM7WUFFekMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hILElBQUksQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRTtvQkFFbEUsa0JBQWtCLENBQUMsY0FBYyxDQUFDLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQztvQkFFekosTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNENBQTRDLEVBQUUsR0FBRyxFQUFFO29CQUNoRixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBdkJELDhCQXVCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
