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
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["browserify"], uniteConfiguration.bundler === "Browserify");
            if (uniteConfiguration.bundler === "Browserify") {
                try {
                    if (uniteConfiguration.moduleType !== "CommonJS") {
                        throw new Error("You can only use CommonJS modules with Browserify");
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating Bundler configuration failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Browserify = Browserify;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvYnJvd3NlcmlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLGdCQUF3QixTQUFRLCtDQUFzQjtJQUNyQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUMsQ0FBQztZQUVqRyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDO29CQUNGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7b0JBQ3pFLENBQUM7b0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1osZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsR0FBRyxFQUFFO29CQUM3RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLENBQUM7WUFDTixDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBbEJELGdDQWtCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2J1bmRsZXIvYnJvd3NlcmlmeS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
