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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super("folderCreate").call(this, logger, fileSystem, engineVariables.platformRootFolder);
            if (ret === 0) {
                const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
                if (mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp")) {
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                    ret = yield this.copyFile(logger, fileSystem, assetTasksPlatform, Docker.FILENAME, buildTasks, Docker.FILENAME, engineVariables.force);
                }
                else {
                    ret = yield _super("fileDeleteText").call(this, logger, fileSystem, buildTasks, Docker.FILENAME, engineVariables.force);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0Esb0VBQWlFO0FBRWpFLFlBQW9CLFNBQVEsbUNBQWdCO0lBSWpDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUUzRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUV0RixFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRSxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7b0JBQzlHLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0ksQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLEdBQUcsTUFBTSx3QkFBb0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0csQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixlQUFlLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLDRGQUE0RixDQUFDLENBQUM7Z0JBQ2hKLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsc0VBQXNFLENBQUMsQ0FBQztZQUM5SCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTs7QUEzQmMsZUFBUSxHQUFXLFFBQVEsQ0FBQztBQUM1QixlQUFRLEdBQVcsb0JBQW9CLENBQUM7QUFGM0Qsd0JBNkJDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGxhdGZvcm0vZG9ja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGRvY2tlciBwbGF0Zm9ybSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBEb2NrZXIgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBQTEFURk9STTogc3RyaW5nID0gXCJEb2NrZXJcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJwbGF0Zm9ybS1kb2NrZXIuanNcIjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcykgOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLm9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zLCBEb2NrZXIuUExBVEZPUk0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgc3VwZXIuZm9sZGVyQ3JlYXRlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnBsYXRmb3JtUm9vdEZvbGRlcik7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRUYXNrcyA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5idWlsZEZvbGRlciwgXCIvdGFza3MvXCIpO1xuXG4gICAgICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldFRhc2tzUGxhdGZvcm0gPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFwiZ3VscC90YXNrcy9wbGF0Zm9ybS9cIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0VGFza3NQbGF0Zm9ybSwgRG9ja2VyLkZJTEVOQU1FLCBidWlsZFRhc2tzLCBEb2NrZXIuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZpbGVEZWxldGVUZXh0KGxvZ2dlciwgZmlsZVN5c3RlbSwgYnVpbGRUYXNrcywgRG9ja2VyLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5hZGRpdGlvbmFsQ29tcGxldGlvbk1lc3NhZ2VzLnB1c2goXCJNYWtlIHN1cmUgeW91IGhhdmUgZG9ja2VyIGluc3RhbGxlZCBhbmQgcnVubmluZyBiZWZvcmUgdHJ5aW5nIHRvIHJ1biBhbnkgb2YgdGhlIG5ldyB0YXNrcy5cIik7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYWRkaXRpb25hbENvbXBsZXRpb25NZXNzYWdlcy5wdXNoKFwiICAgc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9pbnN0YWxsYXRpb24vIGZvciBtb3JlIGRldGFpbHNcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
