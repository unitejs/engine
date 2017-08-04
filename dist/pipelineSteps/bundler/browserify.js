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
class Browserify extends enginePipelineStepBase_1.EnginePipelineStepBase {
    prerequisites(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.bundler === "Browserify") {
                if (uniteConfiguration.moduleType !== "CommonJS") {
                    _super("error").call(this, logger, display, "You can only use CommonJS modules with Browserify");
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["browserify"], uniteConfiguration.bundler === "Browserify");
            return 0;
        });
    }
}
exports.Browserify = Browserify;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvYnJvd3NlcmlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsZ0ZBQTZFO0FBRzdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUNyQyxhQUFhLENBQUMsTUFBZSxFQUNmLE9BQWlCLEVBQ2pCLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7O1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDL0MsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbURBQW1ELEVBQUU7b0JBQ2xGLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUMsQ0FBQztZQUVqRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFwQkQsZ0NBb0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYnVuZGxlci9icm93c2VyaWZ5LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
