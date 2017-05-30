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
const uniteModuleLoader_1 = require("../configuration/models/unite/uniteModuleLoader");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GenerateModuleLoaderScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating Module Loader Scaffold", {});
                switch (engineVariables.uniteModuleLoader) {
                    case uniteModuleLoader_1.UniteModuleLoader.RequireJS:
                        uniteConfiguration.dependencies.requirejs = "^2.3.3";
                        break;
                    default: break;
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating Module Loader Scaffold failed", err, { outputDirectory: uniteConfiguration.outputDirectory });
                return 1;
            }
        });
    }
}
exports.GenerateModuleLoaderScaffold = GenerateModuleLoaderScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ2VuZXJhdGVNb2R1bGVMb2FkZXJTY2FmZm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsdUZBQW9GO0FBQ3BGLDZFQUEwRTtBQU0xRSxrQ0FBMEMsU0FBUSwrQ0FBc0I7SUFDdkQsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsRUFBRyxFQUFFO2dCQUVyRSxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxLQUFLLHFDQUFpQixDQUFDLFNBQVM7d0JBQUUsa0JBQWtCLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7d0JBQUMsS0FBSyxDQUFDO29CQUM5RixTQUFTLEtBQUssQ0FBQztnQkFDbkIsQ0FBQztnQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsMENBQTBDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUN2SSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBaEJELG9FQWdCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2dlbmVyYXRlTW9kdWxlTG9hZGVyU2NhZmZvbGQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
