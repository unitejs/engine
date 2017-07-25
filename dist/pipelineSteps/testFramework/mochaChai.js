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
            _super("log").call(this, logger, display, "Generating Mocha-Chai Configuration");
            engineVariables.toggleDevDependency(["mocha"], uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai")
                && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleClientPackage("chai", "", "chai.js", true, "test", false, uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            return 0;
        });
    }
}
exports.MochaChai = MochaChai;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxnRkFBNkU7QUFNN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRTtZQUVsRSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDOUosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxFQUNoQyxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUM7bUJBQzFHLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUU1RixlQUFlLENBQUMsbUJBQW1CLENBQy9CLE1BQU0sRUFDTixFQUFFLEVBQ0YsU0FBUyxFQUNULElBQUksRUFDSixNQUFNLEVBQ04sS0FBSyxFQUNMLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUVuSCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFwQkQsOEJBb0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdGVzdEZyYW1ld29yay9tb2NoYUNoYWkuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
