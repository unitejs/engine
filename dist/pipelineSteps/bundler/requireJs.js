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
class RequireJs extends enginePipelineStepBase_1.EnginePipelineStepBase {
    prerequisites(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.bundler === "RequireJS") {
                if (uniteConfiguration.moduleType !== "AMD") {
                    _super("error").call(this, logger, display, "You can only use AMD modules with RequireJS");
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.bundler === "RequireJS");
            return 0;
        });
    }
}
exports.RequireJs = RequireJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2J1bmRsZXIvcmVxdWlyZUpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxnRkFBNkU7QUFHN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsYUFBYSxDQUFDLE1BQWUsRUFDZixPQUFpQixFQUNqQixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0M7OztZQUN2RCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzFDLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDZDQUE2QyxFQUFFO29CQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUM7WUFFL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBcEJELDhCQW9CQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2J1bmRsZXIvcmVxdWlyZUpzLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
