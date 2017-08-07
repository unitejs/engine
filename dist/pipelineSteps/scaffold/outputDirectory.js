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
class OutputDirectory extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info("Creating Root Directory", { rootFolder: engineVariables.rootFolder });
                yield fileSystem.directoryCreate(engineVariables.rootFolder);
            }
            catch (err) {
                logger.error("Creating Root Directory failed", err, { wwwFolder: engineVariables.rootFolder });
                return 1;
            }
            try {
                logger.info("Creating WWW Directory", { wwwFolder: engineVariables.wwwFolder });
                yield fileSystem.directoryCreate(engineVariables.wwwFolder);
                return 0;
            }
            catch (err) {
                logger.error("Creating WWW Directory failed", err, { wwwFolder: engineVariables.wwwFolder });
                return 1;
            }
        });
    }
}
exports.OutputDirectory = OutputDirectory;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL291dHB1dERpcmVjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsZ0ZBQTZFO0FBRzdFLHFCQUE2QixTQUFRLCtDQUFzQjtJQUMxQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQzdGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFuQkQsMENBbUJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2NhZmZvbGQvb3V0cHV0RGlyZWN0b3J5LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
