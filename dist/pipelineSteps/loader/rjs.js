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
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class RJS extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson"),
            new pipelineKey_1.PipelineKey("content", "htmlTemplate")
        ];
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const bundledLoaderCond = _super("condition").call(this, uniteConfiguration.bundledLoader, "RJS");
            const notBundledLoaderCond = _super("condition").call(this, uniteConfiguration.notBundledLoader, "RJS");
            let scriptIncludeMode;
            if (notBundledLoaderCond && bundledLoaderCond) {
                scriptIncludeMode = "both";
            }
            else if (notBundledLoaderCond) {
                scriptIncludeMode = "notBundled";
            }
            else if (bundledLoaderCond) {
                scriptIncludeMode = "bundled";
            }
            else {
                scriptIncludeMode = "none";
            }
            engineVariables.toggleClientPackage("requirejs", "require.js", undefined, undefined, false, "both", scriptIncludeMode, false, undefined, undefined, undefined, true, bundledLoaderCond || notBundledLoaderCond);
            if (notBundledLoaderCond) {
                const htmlNoBundle = engineVariables.getConfiguration("HTMLNoBundle");
                if (htmlNoBundle) {
                    htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    htmlNoBundle.body.push("<script>");
                    htmlNoBundle.body.push("require(preloadModules, function() {");
                    htmlNoBundle.body.push("    {UNITECONFIG}");
                    htmlNoBundle.body.push("    require(['dist/entryPoint']);");
                    htmlNoBundle.body.push("});");
                    htmlNoBundle.body.push("</script>");
                }
            }
            return 0;
        });
    }
}
exports.RJS = RJS;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xvYWRlci9yanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLDBEQUF1RDtBQUN2RCxvRUFBaUU7QUFFakUsU0FBaUIsU0FBUSxtQ0FBZ0I7SUFDOUIsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUM7WUFDbEQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDekMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUM7U0FDN0MsQ0FBQztJQUNOLENBQUM7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxNQUFNLGlCQUFpQixHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25GLE1BQU0sb0JBQW9CLEdBQUcsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV6RixJQUFJLGlCQUFvQyxDQUFDO1lBRXpDLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDNUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDO1lBQy9CLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixpQkFBaUIsR0FBRyxZQUFZLENBQUM7WUFDckMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osaUJBQWlCLEdBQUcsTUFBTSxDQUFDO1lBQy9CLENBQUM7WUFFRCxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxZQUFZLEVBQ1osU0FBUyxFQUNULFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxFQUNKLGlCQUFpQixJQUFJLG9CQUFvQixDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLGNBQWMsQ0FBQyxDQUFDO2dCQUVqRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ2hGLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO29CQUMvRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUM1QyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUM1RCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUIsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBeERELGtCQXdEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xvYWRlci9yanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgY29uZmlndXJhdGlvbiBmb3IgcmVxdWlyZWpzIG9wdGltaXplci5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBTY3JpcHRJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9zY3JpcHRJbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgUkpTIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGluZmx1ZW5jZXMoKTogUGlwZWxpbmVLZXlbXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjb250ZW50XCIsIFwicGFja2FnZUpzb25cIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJjb250ZW50XCIsIFwiaHRtbFRlbXBsYXRlXCIpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgYnVuZGxlZExvYWRlckNvbmQgPSBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZWRMb2FkZXIsIFwiUkpTXCIpO1xuICAgICAgICBjb25zdCBub3RCdW5kbGVkTG9hZGVyQ29uZCA9IHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubm90QnVuZGxlZExvYWRlciwgXCJSSlNcIik7XG5cbiAgICAgICAgbGV0IHNjcmlwdEluY2x1ZGVNb2RlOiBTY3JpcHRJbmNsdWRlTW9kZTtcblxuICAgICAgICBpZiAobm90QnVuZGxlZExvYWRlckNvbmQgJiYgYnVuZGxlZExvYWRlckNvbmQpIHtcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlID0gXCJib3RoXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobm90QnVuZGxlZExvYWRlckNvbmQpIHtcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlID0gXCJub3RCdW5kbGVkXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoYnVuZGxlZExvYWRlckNvbmQpIHtcbiAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlID0gXCJidW5kbGVkXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwibm9uZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInJlcXVpcmVqc1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGUsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBidW5kbGVkTG9hZGVyQ29uZCB8fCBub3RCdW5kbGVkTG9hZGVyQ29uZCk7XG5cbiAgICAgICAgaWYgKG5vdEJ1bmRsZWRMb2FkZXJDb25kKSB7XG4gICAgICAgICAgICBjb25zdCBodG1sTm9CdW5kbGUgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uPihcIkhUTUxOb0J1bmRsZVwiKTtcblxuICAgICAgICAgICAgaWYgKGh0bWxOb0J1bmRsZSkge1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJyZXF1aXJlKHByZWxvYWRNb2R1bGVzLCBmdW5jdGlvbigpIHtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB7VU5JVEVDT05GSUd9XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgcmVxdWlyZShbJ2Rpc3QvZW50cnlQb2ludCddKTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIn0pO1wiKTtcbiAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
