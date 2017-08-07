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
class UnitTestScaffold extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner !== "None") {
                try {
                    logger.info("Creating Unit Test Directory", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.unitTestSrcFolder);
                }
                catch (err) {
                    logger.error("Creating Unit Test Directory failed", err, { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.UnitTestScaffold = UnitTestScaffold;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRUZXN0U2NhZmZvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxzQkFBOEIsU0FBUSwrQ0FBc0I7SUFDM0MsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztvQkFDMUcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDNUUsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7b0JBQ3ZILE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFkRCw0Q0FjQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL3VuaXRUZXN0U2NhZmZvbGQuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
