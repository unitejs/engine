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
    prerequisites(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.bundler === "Webpack") {
                if (uniteConfiguration.moduleType !== "CommonJS") {
                    _super("error").call(this, logger, display, "You can only use CommonJS modules with Webpack");
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["webpack", "source-map-loader", "uglifyjs-webpack-plugin"], uniteConfiguration.bundler === "Webpack");
            return 0;
        });
    }
}
exports.Webpack = Webpack;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvd2VicGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsZ0ZBQTZFO0FBRzdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBQ2xDLGFBQWEsQ0FBQyxNQUFlLEVBQ2YsT0FBaUIsRUFDakIsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDOzs7WUFDdkQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxnREFBZ0QsRUFBRTtvQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFFLHlCQUF5QixDQUFDLEVBQUUsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBRTNJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXBCRCwwQkFvQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9idW5kbGVyL3dlYnBhY2suanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
