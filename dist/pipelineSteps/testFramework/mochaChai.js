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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Generating Mocha-Chai Configuration");
            engineVariables.toggleDevDependency(["mocha"], uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai")
                && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleClientPackage("chai", "chai.js", undefined, true, "test", false, uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.lintEnv.mocha = uniteConfiguration.linter === "ESLint" && (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            return 0;
        });
    }
}
exports.MochaChai = MochaChai;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3Rlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxNQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFFbkQsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQzlKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsRUFDL0IsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssWUFBWSxDQUFDO21CQUMzRyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFNUYsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFJLEVBQ0osTUFBTSxFQUNOLEtBQUssRUFDTCxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFbkgsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUUxTCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUF0QkQsOEJBc0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdGVzdEZyYW1ld29yay9tb2NoYUNoYWkuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
