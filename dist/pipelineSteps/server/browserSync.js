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
class BrowserSync extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.server === "BrowserSync");
            if (uniteConfiguration.server === "BrowserSync") {
                try {
                    _super("log").call(this, logger, display, "Generating BrowserSync Configuration");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating BrowserSync configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.BrowserSync = BrowserSync;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3NlcnZlci9icm93c2VyU3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLGlCQUF5QixTQUFRLCtDQUFzQjtJQUN0QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsQ0FBQztZQUVuRyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDO29CQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFO29CQUVuRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7b0JBQ2pGLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFqQkQsa0NBaUJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2VydmVyL2Jyb3dzZXJTeW5jLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
