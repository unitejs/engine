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
class SJS extends pipelineStepBase_1.PipelineStepBase {
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
            const bundledLoaderCond = _super("condition").call(this, uniteConfiguration.bundledLoader, "SJS");
            const notBundledLoaderCond = _super("condition").call(this, uniteConfiguration.notBundledLoader, "SJS");
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
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", undefined, false, "both", scriptIncludeMode, false, undefined, undefined, undefined, true, bundledLoaderCond || notBundledLoaderCond);
            if (notBundledLoaderCond) {
                const htmlNoBundle = engineVariables.getConfiguration("HTMLNoBundle");
                if (htmlNoBundle) {
                    htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                    htmlNoBundle.body.push("<script>");
                    htmlNoBundle.body.push("Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))");
                    htmlNoBundle.body.push("    .then(function() {");
                    htmlNoBundle.body.push("        {UNITECONFIG}");
                    htmlNoBundle.body.push("        SystemJS.import('dist/entryPoint');");
                    htmlNoBundle.body.push("    });");
                    htmlNoBundle.body.push("</script>");
                }
            }
            return 0;
        });
    }
}
exports.SJS = SJS;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xvYWRlci9zanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLDBEQUF1RDtBQUN2RCxvRUFBaUU7QUFFakUsU0FBaUIsU0FBUSxtQ0FBZ0I7SUFDOUIsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUM7WUFDbEQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDekMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUM7U0FDN0MsQ0FBQztJQUNOLENBQUM7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxNQUFNLGlCQUFpQixHQUFHLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25GLE1BQU0sb0JBQW9CLEdBQUcsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV6RixJQUFJLGlCQUFvQyxDQUFDO1lBRXpDLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDNUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDO1lBQy9CLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixpQkFBaUIsR0FBRyxZQUFZLENBQUM7WUFDckMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osaUJBQWlCLEdBQUcsTUFBTSxDQUFDO1lBQy9CLENBQUM7WUFFRCxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxFQUNKLGlCQUFpQixJQUFJLG9CQUFvQixDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQ2hGLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO29CQUNoSCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO29CQUNqRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO29CQUN0RSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBeERELGtCQXdEQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xvYWRlci9zanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgY29uZmlndXJhdGlvbiBmb3IgY29tbW9uanMuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgSHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9odG1sVGVtcGxhdGUvaHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgU2NyaXB0SW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvc2NyaXB0SW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFNKUyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBpbmZsdWVuY2VzKCk6IFBpcGVsaW5lS2V5W10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInBhY2thZ2VKc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImh0bWxUZW1wbGF0ZVwiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZWRMb2FkZXJDb25kID0gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVkTG9hZGVyLCBcIlNKU1wiKTtcbiAgICAgICAgY29uc3Qgbm90QnVuZGxlZExvYWRlckNvbmQgPSBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLm5vdEJ1bmRsZWRMb2FkZXIsIFwiU0pTXCIpO1xuXG4gICAgICAgIGxldCBzY3JpcHRJbmNsdWRlTW9kZTogU2NyaXB0SW5jbHVkZU1vZGU7XG5cbiAgICAgICAgaWYgKG5vdEJ1bmRsZWRMb2FkZXJDb25kICYmIGJ1bmRsZWRMb2FkZXJDb25kKSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwiYm90aFwiO1xuICAgICAgICB9IGVsc2UgaWYgKG5vdEJ1bmRsZWRMb2FkZXJDb25kKSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwibm90QnVuZGxlZFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1bmRsZWRMb2FkZXJDb25kKSB7XG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSA9IFwiYnVuZGxlZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGUgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJzeXN0ZW1qc1wiLFxuICAgICAgICAgICAgXCJkaXN0L3N5c3RlbS5zcmMuanNcIixcbiAgICAgICAgICAgIFwiZGlzdC9zeXN0ZW0uanNcIixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIGJ1bmRsZWRMb2FkZXJDb25kIHx8IG5vdEJ1bmRsZWRMb2FkZXJDb25kKTtcblxuICAgICAgICBpZiAobm90QnVuZGxlZExvYWRlckNvbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGh0bWxOb0J1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTE5vQnVuZGxlXCIpO1xuICAgICAgICAgICAgaWYgKGh0bWxOb0J1bmRsZSkge1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJQcm9taXNlLmFsbChwcmVsb2FkTW9kdWxlcy5tYXAoZnVuY3Rpb24obW9kdWxlKSB7IHJldHVybiBTeXN0ZW1KUy5pbXBvcnQobW9kdWxlKTsgfSkpXCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgLnRoZW4oZnVuY3Rpb24oKSB7XCIpO1xuICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgICAgIHtVTklURUNPTkZJR31cIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICAgICAgU3lzdGVtSlMuaW1wb3J0KCdkaXN0L2VudHJ5UG9pbnQnKTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB9KTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
