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
class PostCssNone extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["cssnano", "gulp-cssnano"], uniteConfiguration.cssPost === "None");
            return 0;
        });
    }
}
exports.PostCssNone = PostCssNone;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1Bvc3RQcm9jZXNzb3IvcG9zdENzc05vbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGdGQUE2RTtBQU03RSxpQkFBeUIsU0FBUSwrQ0FBc0I7SUFDdEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFeEcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBTkQsa0NBTUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQb3N0UHJvY2Vzc29yL3Bvc3RDc3NOb25lLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
