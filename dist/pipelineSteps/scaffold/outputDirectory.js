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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class OutputDirectory extends pipelineStepBase_1.PipelineStepBase {
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.rootFolder, engineVariables.force, mainCondition);
            if (ret === 0) {
                ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.wwwRootFolder, engineVariables.force, mainCondition);
                if (ret === 0) {
                    ret = yield _super("folderToggle").call(this, logger, fileSystem, engineVariables.packagedRootFolder, engineVariables.force, mainCondition);
                }
            }
            return ret;
        });
    }
}
exports.OutputDirectory = OutputDirectory;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL291dHB1dERpcmVjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0Esb0VBQWlFO0FBRWpFLHFCQUE2QixTQUFRLG1DQUFnQjtJQUNwQyxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFekgsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBRXhILEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLEdBQUcsR0FBRyxNQUFNLHNCQUFrQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ2pJLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNKO0FBZEQsMENBY0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9zY2FmZm9sZC9vdXRwdXREaXJlY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gY3JlYXRlIG91dHB1dCBkaXJlY3RvcnkuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIE91dHB1dERpcmVjdG9yeSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyVG9nZ2xlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnJvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyVG9nZ2xlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgbWFpbkNvbmRpdGlvbik7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJUb2dnbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMucGFja2FnZWRSb290Rm9sZGVyLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
