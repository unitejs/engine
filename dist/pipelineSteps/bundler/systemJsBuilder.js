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
class SystemJsBuilder extends enginePipelineStepBase_1.EnginePipelineStepBase {
    prerequisites(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.bundler === "SystemJSBuilder") {
                if (uniteConfiguration.moduleType !== "SystemJS") {
                    _super("error").call(this, logger, display, "You can only use SystemJS modules with SystemJSBuilder");
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["systemjs-builder"], uniteConfiguration.bundler === "SystemJSBuilder");
            return 0;
        });
    }
}
exports.SystemJsBuilder = SystemJsBuilder;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvc3lzdGVtSnNCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0UscUJBQTZCLFNBQVEsK0NBQXNCO0lBQzFDLGFBQWEsQ0FBQyxNQUFlLEVBQ2YsT0FBaUIsRUFDakIsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDOzs7WUFDdkQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDbkQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHdEQUF3RCxFQUFFO29CQUN2RixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxpQkFBaUIsQ0FBQyxDQUFDO1lBRTVHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFYixDQUFDO0tBQUE7Q0FDSjtBQXJCRCwwQ0FxQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9idW5kbGVyL3N5c3RlbUpzQnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
