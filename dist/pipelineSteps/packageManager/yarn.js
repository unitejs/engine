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
class Yarn extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.packageManager === "Npm") {
                const gitIgnoreConfiguration = engineVariables.getConfiguration("GitIgnore");
                if (gitIgnoreConfiguration) {
                    gitIgnoreConfiguration.push("node_modules");
                }
            }
            return 0;
        });
    }
}
exports.Yarn = Yarn;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL3lhcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLGdGQUE2RTtBQUc3RSxVQUFrQixTQUFRLCtDQUFzQjtJQUMvQixPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBVyxXQUFXLENBQUMsQ0FBQztnQkFDdkYsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO29CQUN6QixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2hELENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBVkQsb0JBVUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wYWNrYWdlTWFuYWdlci95YXJuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIGZvciBZYXJuLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBZYXJuIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9PT0gXCJOcG1cIikge1xuICAgICAgICAgICAgY29uc3QgZ2l0SWdub3JlQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPHN0cmluZ1tdPihcIkdpdElnbm9yZVwiKTtcbiAgICAgICAgICAgIGlmIChnaXRJZ25vcmVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZ2l0SWdub3JlQ29uZmlndXJhdGlvbi5wdXNoKFwibm9kZV9tb2R1bGVzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
