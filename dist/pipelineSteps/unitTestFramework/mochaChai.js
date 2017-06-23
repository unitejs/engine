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
            engineVariables.toggleDependencies(["mocha", "chai"], uniteConfiguration.unitTestFramework === "Mocha-Chai", true);
            engineVariables.toggleDependencies(["@types/mocha", "@types/chai"], uniteConfiguration.unitTestFramework === "Mocha-Chai" && uniteConfiguration.sourceLanguage === "TypeScript", true);
            if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
                try {
                    _super("log").call(this, logger, display, "Generating Mocha-Chai Configuration");
                    uniteConfiguration.clientPackages.chai = { version: "^3.5.0", main: "chai.js", preload: true, includeMode: "test" };
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvdW5pdFRlc3RGcmFtZXdvcmsvbW9jaGFDaGFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxnRkFBNkU7QUFNN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsaUJBQWlCLEtBQUssWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ILGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUV2TCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLENBQUM7b0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUscUNBQXFDLEVBQUU7b0JBRWxFLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUM7b0JBRXBILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtvQkFDaEYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXBCRCw4QkFvQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0VGVzdEZyYW1ld29yay9tb2NoYUNoYWkuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
