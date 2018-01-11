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
                const buildTasks = fileSystem.pathCombine(engineVariables.www.build, "/tasks/");
                if (mainCondition && _super("condition").call(this, uniteConfiguration.taskManager, "Gulp")) {
                    const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/dist/tasks/platform/");
                    ret = yield this.copyFile(logger, fileSystem, assetTasksPlatform, Docker.FILENAME, buildTasks, Docker.FILENAME, engineVariables.force, false, { "\\\"../util/": ["\"./util/"] });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0Esb0VBQWlFO0FBRWpFLFlBQW9CLFNBQVEsbUNBQWdCO0lBSWpDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sc0JBQWtCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUUzRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUVoRixFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRSxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7b0JBQ25ILEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUNsSCxFQUFFLGNBQWMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLEdBQUcsTUFBTSx3QkFBb0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0csQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixlQUFlLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLDRGQUE0RixDQUFDLENBQUM7Z0JBQ2hKLGVBQWUsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsc0VBQXNFLENBQUMsQ0FBQztZQUM5SCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTs7QUE1QnVCLGVBQVEsR0FBVyxRQUFRLENBQUM7QUFDNUIsZUFBUSxHQUFXLG9CQUFvQixDQUFDO0FBRnBFLHdCQThCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3BsYXRmb3JtL2RvY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBkb2NrZXIgcGxhdGZvcm0gY29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgRG9ja2VyIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUExBVEZPUk06IHN0cmluZyA9IFwiRG9ja2VyXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUU6IHN0cmluZyA9IFwicGxhdGZvcm0tZG9ja2VyLmpzXCI7XG5cbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpIDogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5vYmplY3RDb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnBsYXRmb3JtcywgRG9ja2VyLlBMQVRGT1JNKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHJldCA9IGF3YWl0IHN1cGVyLmZvbGRlckNyZWF0ZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy5wbGF0Zm9ybVJvb3RGb2xkZXIpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkVGFza3MgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYnVpbGQsIFwiL3Rhc2tzL1wiKTtcblxuICAgICAgICAgICAgaWYgKG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNzZXRUYXNrc1BsYXRmb3JtID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBcImd1bHAvZGlzdC90YXNrcy9wbGF0Zm9ybS9cIik7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0VGFza3NQbGF0Zm9ybSwgRG9ja2VyLkZJTEVOQU1FLCBidWlsZFRhc2tzLCBEb2NrZXIuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFwiXFxcXFxcXCIuLi91dGlsL1wiOiBbXCJcXFwiLi91dGlsL1wiXSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZmlsZURlbGV0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBidWlsZFRhc2tzLCBEb2NrZXIuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmFkZGl0aW9uYWxDb21wbGV0aW9uTWVzc2FnZXMucHVzaChcIk1ha2Ugc3VyZSB5b3UgaGF2ZSBkb2NrZXIgaW5zdGFsbGVkIGFuZCBydW5uaW5nIGJlZm9yZSB0cnlpbmcgdG8gcnVuIGFueSBvZiB0aGUgbmV3IHRhc2tzLlwiKTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5hZGRpdGlvbmFsQ29tcGxldGlvbk1lc3NhZ2VzLnB1c2goXCIgICBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL2luc3RhbGxhdGlvbi8gZm9yIG1vcmUgZGV0YWlsc1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIl19
