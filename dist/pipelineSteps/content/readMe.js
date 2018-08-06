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
class ReadMe extends pipelineStepBase_1.PipelineStepBase {
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.rootFolder, ReadMe.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                const lines = yield fileSystem.fileReadLines(engineVariables.engineAssetsFolder, ReadMe.FILENAMEROOT);
                if (engineVariables.meta && engineVariables.meta) {
                    lines[0] = `# ${engineVariables.meta.title}`;
                }
                return lines;
            }));
            if (ret === 0) {
                ret = yield _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, ReadMe.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                    const lines = yield fileSystem.fileReadLines(engineVariables.engineAssetsFolder, ReadMe.FILENAME);
                    if (engineVariables.meta && engineVariables.meta) {
                        lines[0] = `# ${engineVariables.meta.title}`;
                    }
                    return lines;
                }));
            }
            return ret;
        });
    }
}
ReadMe.FILENAMEROOT = "README-ROOT.md";
ReadMe.FILENAME = "README.md";
exports.ReadMe = ReadMe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcmVhZE1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsTUFBYSxNQUFPLFNBQVEsbUNBQWdCO0lBSTNCLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDNUosSUFBSSxHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxVQUFVLEVBQzFCLE1BQU0sQ0FBQyxRQUFRLEVBQ2YsZUFBZSxDQUFDLEtBQUssRUFDckIsYUFBYSxFQUNiLEdBQVMsRUFBRTtnQkFDN0MsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRXRHLElBQUksZUFBZSxDQUFDLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFO29CQUM5QyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNoRDtnQkFFRCxPQUFPLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO2dCQUNYLEdBQUcsR0FBRyxNQUFNLHlCQUFxQixZQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLGFBQWEsRUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFDZixlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFO29CQUN6QyxNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFbEcsSUFBSSxlQUFlLENBQUMsSUFBSSxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUU7d0JBQzlDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ2hEO29CQUVELE9BQU8sS0FBSyxDQUFDO2dCQUNqQixDQUFDLENBQUEsQ0FBQyxDQUFDO2FBQ047WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTs7QUF2Q3VCLG1CQUFZLEdBQVcsZ0JBQWdCLENBQUM7QUFDeEMsZUFBUSxHQUFXLFdBQVcsQ0FBQztBQUYzRCx3QkF5Q0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L3JlYWRNZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBSRUFETUUubWQuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFJlYWRNZSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FUk9PVDogc3RyaW5nID0gXCJSRUFETUUtUk9PVC5tZFwiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZJTEVOQU1FOiBzdHJpbmcgPSBcIlJFQURNRS5tZFwiO1xuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlTGluZXMobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnJvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhZE1lLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZExpbmVzKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFJlYWRNZS5GSUxFTkFNRVJPT1QpO1xuXG4gICAgICAgICAgICBpZiAoZW5naW5lVmFyaWFibGVzLm1ldGEgJiYgZW5naW5lVmFyaWFibGVzLm1ldGEpIHtcbiAgICAgICAgICAgICAgICBsaW5lc1swXSA9IGAjICR7ZW5naW5lVmFyaWFibGVzLm1ldGEudGl0bGV9YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlVG9nZ2xlTGluZXMobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhZE1lLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBSZWFkTWUuRklMRU5BTUUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZVZhcmlhYmxlcy5tZXRhICYmIGVuZ2luZVZhcmlhYmxlcy5tZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzWzBdID0gYCMgJHtlbmdpbmVWYXJpYWJsZXMubWV0YS50aXRsZX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
