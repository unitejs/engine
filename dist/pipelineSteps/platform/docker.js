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
class Docker extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.objectCondition(uniteConfiguration.platforms, Docker.PLATFORM);
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            folderCreate: { get: () => super.folderCreate },
            condition: { get: () => super.condition },
            fileDeleteText: { get: () => super.fileDeleteText }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super.folderCreate.call(this, logger, fileSystem, engineVariables.platformRootFolder);
            if (ret === 0) {
                const buildTasks = fileSystem.pathCombine(engineVariables.www.build, "/tasks/");
                if (mainCondition && _super.condition.call(this, uniteConfiguration.taskManager, "Gulp")) {
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/dist/tasks/platform/");
                    ret = yield this.copyFile(logger, fileSystem, assetTasksPlatform, Docker.FILENAME, buildTasks, Docker.FILENAME, engineVariables.force, false, { "\\\"../util/": ["\"./util/"] });
                }
                else {
                    ret = yield _super.fileDeleteText.call(this, logger, fileSystem, buildTasks, Docker.FILENAME, engineVariables.force);
                }
            }
            if (mainCondition) {
                engineVariables.additionalCompletionMessages.push("Make sure you have docker installed and running before trying to run any of the new tasks.");
                engineVariables.additionalCompletionMessages.push("   see https://docs.docker.com/engine/installation/ for more details");
            }
            return ret;
        });
    }
}
Docker.PLATFORM = "Docker";
Docker.FILENAME = "platform-docker.js";
exports.Docker = Docker;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0Esb0VBQWlFO0FBRWpFLE1BQWEsTUFBTyxTQUFRLG1DQUFnQjtJQUlqQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7Ozs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sT0FBTSxZQUFZLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUUzRixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7Z0JBQ1gsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFaEYsSUFBSSxhQUFhLElBQUksT0FBTSxTQUFTLFlBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUMxRSxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7b0JBQ25ILEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUNsSCxFQUFFLGNBQWMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBQ0gsR0FBRyxHQUFHLE1BQU0sT0FBTSxjQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzVHO2FBQ0o7WUFFRCxJQUFJLGFBQWEsRUFBRTtnQkFDZixlQUFlLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLDRGQUE0RixDQUFDLENBQUM7Z0JBQ2hKLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsc0VBQXNFLENBQUMsQ0FBQzthQUM3SDtZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBOztBQTVCdUIsZUFBUSxHQUFXLFFBQVEsQ0FBQztBQUM1QixlQUFRLEdBQVcsb0JBQW9CLENBQUM7QUFGcEUsd0JBOEJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGxhdGZvcm0vZG9ja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGRvY2tlciBwbGF0Zm9ybSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBEb2NrZXIgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQTEFURk9STTogc3RyaW5nID0gXCJEb2NrZXJcIjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRTogc3RyaW5nID0gXCJwbGF0Zm9ybS1kb2NrZXIuanNcIjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcykgOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLm9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zLCBEb2NrZXIuUExBVEZPUk0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyQ3JlYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnBsYXRmb3JtUm9vdEZvbGRlcik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRUYXNrcyA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5idWlsZCwgXCIvdGFza3MvXCIpO1xuXG4gICAgICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldFRhc2tzUGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC9kaXN0L3Rhc2tzL3BsYXRmb3JtL1wiKTtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYXNzZXRUYXNrc1BsYXRmb3JtLCBEb2NrZXIuRklMRU5BTUUsIGJ1aWxkVGFza3MsIERvY2tlci5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXCJcXFxcXFxcIi4uL3V0aWwvXCI6IFtcIlxcXCIuL3V0aWwvXCJdIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5maWxlRGVsZXRlVGV4dChsb2dnZXIsIGZpbGVTeXN0ZW0sIGJ1aWxkVGFza3MsIERvY2tlci5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYWRkaXRpb25hbENvbXBsZXRpb25NZXNzYWdlcy5wdXNoKFwiTWFrZSBzdXJlIHlvdSBoYXZlIGRvY2tlciBpbnN0YWxsZWQgYW5kIHJ1bm5pbmcgYmVmb3JlIHRyeWluZyB0byBydW4gYW55IG9mIHRoZSBuZXcgdGFza3MuXCIpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmFkZGl0aW9uYWxDb21wbGV0aW9uTWVzc2FnZXMucHVzaChcIiAgIHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvaW5zdGFsbGF0aW9uLyBmb3IgbW9yZSBkZXRhaWxzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
