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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcmVhZE1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsWUFBb0IsU0FBUSxtQ0FBZ0I7SUFJM0IsUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM1SixJQUFJLEdBQUcsR0FBRyxNQUFNLHlCQUFxQixZQUFDLE1BQU0sRUFDTixVQUFVLEVBQ1YsZUFBZSxDQUFDLFVBQVUsRUFDMUIsTUFBTSxDQUFDLFFBQVEsRUFDZixlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUyxFQUFFO2dCQUM3QyxNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFdEcsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDL0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDakQsQ0FBQztnQkFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLE1BQU0sQ0FBQyxRQUFRLEVBQ2YsZUFBZSxDQUFDLEtBQUssRUFDckIsYUFBYSxFQUNiLEdBQVMsRUFBRTtvQkFDekMsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRWxHLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQy9DLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2pELENBQUM7b0JBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBOztBQXZDYyxtQkFBWSxHQUFXLGdCQUFnQixDQUFDO0FBQ3hDLGVBQVEsR0FBVyxXQUFXLENBQUM7QUFGbEQsd0JBeUNDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9yZWFkTWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgUkVBRE1FLm1kLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBSZWFkTWUgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRVJPT1Q6IHN0cmluZyA9IFwiUkVBRE1FLVJPT1QubWRcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJSRUFETUUubWRcIjtcblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZVRvZ2dsZUxpbmVzKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5yb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWRNZS5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBSZWFkTWUuRklMRU5BTUVST09UKTtcblxuICAgICAgICAgICAgaWYgKGVuZ2luZVZhcmlhYmxlcy5tZXRhICYmIGVuZ2luZVZhcmlhYmxlcy5tZXRhKSB7XG4gICAgICAgICAgICAgICAgbGluZXNbMF0gPSBgIyAke2VuZ2luZVZhcmlhYmxlcy5tZXRhLnRpdGxlfWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZVRvZ2dsZUxpbmVzKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWRNZS5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBhd2FpdCBmaWxlU3lzdGVtLmZpbGVSZWFkTGluZXMoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgUmVhZE1lLkZJTEVOQU1FKTtcblxuICAgICAgICAgICAgICAgIGlmIChlbmdpbmVWYXJpYWJsZXMubWV0YSAmJiBlbmdpbmVWYXJpYWJsZXMubWV0YSkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lc1swXSA9IGAjICR7ZW5naW5lVmFyaWFibGVzLm1ldGEudGl0bGV9YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIl19
