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
class Webpack extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["webpack", "source-map-loader", "uglifyjs-webpack-plugin"], uniteConfiguration.bundler === "Webpack");
            if (uniteConfiguration.bundler === "Webpack") {
                try {
                    if (uniteConfiguration.moduleType !== "CommonJS") {
                        throw new Error("You can only use CommonJS modules with Webpack");
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
exports.Webpack = Webpack;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvd2VicGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsZ0ZBQTZFO0FBRzdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBQ2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFFLHlCQUF5QixDQUFDLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBRTNJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLENBQUM7b0JBQ0YsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztvQkFDdEUsQ0FBQztvQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7b0JBQzdFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsQkQsMEJBa0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYnVuZGxlci93ZWJwYWNrLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
