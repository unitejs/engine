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
    prerequisites(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.bundler === "SystemJSBuilder") {
                if (uniteConfiguration.moduleType !== "SystemJS") {
                    logger.error("You can only use SystemJS modules with SystemJSBuilder");
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["systemjs-builder"], uniteConfiguration.bundler === "SystemJSBuilder");
            return 0;
        });
    }
}
exports.SystemJsBuilder = SystemJsBuilder;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvc3lzdGVtSnNCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UscUJBQTZCLFNBQVEsK0NBQXNCO0lBQzFDLGFBQWEsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDOztZQUN2RCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDL0MsTUFBTSxDQUFDLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO29CQUN2RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssaUJBQWlCLENBQUMsQ0FBQztZQUU1RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRWIsQ0FBQztLQUFBO0NBQ0o7QUFwQkQsMENBb0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYnVuZGxlci9zeXN0ZW1Kc0J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
