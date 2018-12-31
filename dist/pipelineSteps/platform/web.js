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
class Web extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.objectCondition(uniteConfiguration.platforms, Web.PLATFORM);
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition }
        });
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["archiver"], mainCondition && _super.condition.call(this, uniteConfiguration.taskManager, "Gulp"));
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            condition: { get: () => super.condition },
            fileDeleteText: { get: () => super.fileDeleteText }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.build, "/tasks/");
            if (mainCondition && _super.condition.call(this, uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/dist/tasks/platform/");
                return this.copyFile(logger, fileSystem, assetTasksPlatform, Web.FILENAME, buildTasks, Web.FILENAME, engineVariables.force, false, { "\\\"../util/": ["\"./util/"] });
            }
            else {
                return _super.fileDeleteText.call(this, logger, fileSystem, buildTasks, Web.FILENAME, engineVariables.force);
            }
        });
    }
}
Web.PLATFORM = "Web";
Web.FILENAME = "platform-web.js";
exports.Web = Web;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BsYXRmb3JtL3dlYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0Esb0VBQWlFO0FBRWpFLE1BQWEsR0FBSSxTQUFRLG1DQUFnQjtJQUk5QixhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsT0FBTyxLQUFLLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7OztZQUM3SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxhQUFhLElBQUksT0FBTSxTQUFTLFlBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFNUgsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7Ozs7O1lBQzVKLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDaEYsSUFBSSxhQUFhLElBQUksT0FBTSxTQUFTLFlBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUMxRSxNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7Z0JBQ25ILE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQzVHLEVBQUUsY0FBYyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNEO2lCQUFNO2dCQUNILE9BQU8sT0FBTSxjQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFO2FBQ3BHO1FBQ0wsQ0FBQztLQUFBOztBQXRCdUIsWUFBUSxHQUFXLEtBQUssQ0FBQztBQUN6QixZQUFRLEdBQVcsaUJBQWlCLENBQUM7QUFGakUsa0JBd0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGxhdGZvcm0vd2ViLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHdlYiBwbGF0Zm9ybSBjb25maWd1cmF0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWIgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQTEFURk9STTogc3RyaW5nID0gXCJXZWJcIjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRTogc3RyaW5nID0gXCJwbGF0Zm9ybS13ZWIuanNcIjtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcykgOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLm9iamVjdENvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ucGxhdGZvcm1zLCBXZWIuUExBVEZPUk0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiYXJjaGl2ZXJcIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi50YXNrTWFuYWdlciwgXCJHdWxwXCIpKTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgYnVpbGRUYXNrcyA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5idWlsZCwgXCIvdGFza3MvXCIpO1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnRhc2tNYW5hZ2VyLCBcIkd1bHBcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0VGFza3NQbGF0Zm9ybSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgXCJndWxwL2Rpc3QvdGFza3MvcGxhdGZvcm0vXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldFRhc2tzUGxhdGZvcm0sIFdlYi5GSUxFTkFNRSwgYnVpbGRUYXNrcywgV2ViLkZJTEVOQU1FLCBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcIlxcXFxcXFwiLi4vdXRpbC9cIjogW1wiXFxcIi4vdXRpbC9cIl0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZmlsZURlbGV0ZVRleHQobG9nZ2VyLCBmaWxlU3lzdGVtLCBidWlsZFRhc2tzLCBXZWIuRklMRU5BTUUsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
