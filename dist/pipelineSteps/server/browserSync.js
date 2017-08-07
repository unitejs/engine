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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["browser-sync"], uniteConfiguration.server === "BrowserSync");
            if (uniteConfiguration.server === "BrowserSync") {
                try {
                    logger.info("Generating BrowserSync Configuration", { wwwFolder: engineVariables.wwwFolder });
                    return 0;
                }
                catch (err) {
                    logger.error("Generating BrowserSync configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.BrowserSync = BrowserSync;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NlcnZlci9icm93c2VyU3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsZ0ZBQTZFO0FBRzdFLGlCQUF5QixTQUFRLCtDQUFzQjtJQUN0QyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsQ0FBQztZQUVuRyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0NBQXNDLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7b0JBRTdGLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFqQkQsa0NBaUJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2VydmVyL2Jyb3dzZXJTeW5jLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
