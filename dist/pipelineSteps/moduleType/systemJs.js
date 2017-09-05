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
class SystemJs extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "packageJson"),
            new pipelineKey_1.PipelineKey("content", "htmlTemplate"),
            new pipelineKey_1.PipelineKey("language", "javaScript"),
            new pipelineKey_1.PipelineKey("language", "typeScript")
        ];
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["systemjs"], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && _super("condition").call(this, uniteConfiguration.moduleType, "SystemJS"));
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", undefined, false, "both", "both", false, undefined, undefined, undefined, _super("condition").call(this, uniteConfiguration.moduleType, "SystemJS"));
            if (_super("condition").call(this, uniteConfiguration.moduleType, "SystemJS")) {
                try {
                    logger.info("Generating Module Loader Scaffold");
                    const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
                    if (typeScriptConfiguration) {
                        typeScriptConfiguration.compilerOptions.module = "system";
                    }
                    const babelConfiguration = engineVariables.getConfiguration("Babel");
                    if (babelConfiguration) {
                        const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "es2015");
                        if (foundPreset) {
                            foundPreset[1] = { modules: "systemjs" };
                        }
                        else {
                            babelConfiguration.presets.push(["es2015", { modules: "systemjs" }]);
                        }
                    }
                    uniteConfiguration.srcDistReplace = "(System.register)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
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
                    const htmlBundle = engineVariables.getConfiguration("HTMLBundle");
                    if (htmlBundle) {
                        htmlBundle.body.push("<script src=\"./dist/vendor-bundle.js{CACHEBUST}\"></script>");
                        htmlBundle.body.push("<script>{UNITECONFIG}</script>");
                        htmlBundle.body.push("<script src=\"./dist/app-bundle.js{CACHEBUST}\"></script>");
                    }
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Module Loader Scaffold failed", err);
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.SystemJs = SystemJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvc3lzdGVtSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVVBLDBEQUF1RDtBQUN2RCxvRUFBaUU7QUFFakUsY0FBc0IsU0FBUSxtQ0FBZ0I7SUFDbkMsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUM7WUFDbEQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDekMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUM7WUFDMUMsSUFBSSx5QkFBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7WUFDekMsSUFBSSx5QkFBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7U0FDNUMsQ0FBQztJQUNOLENBQUM7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxPQUFPLEtBQUssbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUU3SyxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLENBQUM7WUFFaEUsRUFBRSxDQUFDLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUVqRCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7b0JBQ3hHLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQzt3QkFDMUIsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7b0JBQzlELENBQUM7b0JBRUQsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXFCLE9BQU8sQ0FBQyxDQUFDO29CQUN6RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO3dCQUNwSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNkLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQzt3QkFDN0MsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekUsQ0FBQztvQkFDTCxDQUFDO29CQUVELGtCQUFrQixDQUFDLGNBQWMsR0FBRyxnQ0FBZ0MsQ0FBQztvQkFDckUsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO29CQUVuRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLGNBQWMsQ0FBQyxDQUFDO29CQUNqRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7d0JBQ2hGLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO3dCQUNoSCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO3dCQUNqRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO3dCQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO3dCQUN0RSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3hDLENBQUM7b0JBRUQsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUE0QixZQUFZLENBQUMsQ0FBQztvQkFDN0YsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDYixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO3dCQUNyRixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO3dCQUN2RCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDO29CQUN0RixDQUFDO29CQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUE3RUQsNEJBNkVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9zeXN0ZW1Kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBzeXN0ZW1qcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTeXN0ZW1KcyBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBpbmZsdWVuY2VzKCk6IFBpcGVsaW5lS2V5W10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcInBhY2thZ2VKc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImh0bWxUZW1wbGF0ZVwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImxhbmd1YWdlXCIsIFwiamF2YVNjcmlwdFwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImxhbmd1YWdlXCIsIFwidHlwZVNjcmlwdFwiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVEZXZEZXBlbmRlbmN5KFtcInN5c3RlbWpzXCJdLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJTeXN0ZW1KU1wiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInN5c3RlbWpzXCIsXG4gICAgICAgICAgICBcImRpc3Qvc3lzdGVtLnNyYy5qc1wiLFxuICAgICAgICAgICAgXCJkaXN0L3N5c3RlbS5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUsIFwiU3lzdGVtSlNcIikpO1xuXG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUsIFwiU3lzdGVtSlNcIikpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIE1vZHVsZSBMb2FkZXIgU2NhZmZvbGRcIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5tb2R1bGUgPSBcInN5c3RlbVwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJhYmVsQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCJCYWJlbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYmFiZWxDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUHJlc2V0ID0gYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMuZmluZChwcmVzZXQgPT4gQXJyYXkuaXNBcnJheShwcmVzZXQpICYmIHByZXNldC5sZW5ndGggPiAwICYmIHByZXNldFswXSA9PT0gXCJlczIwMTVcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFByZXNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRQcmVzZXRbMV0gPSB7IG1vZHVsZXM6IFwic3lzdGVtanNcIiB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMucHVzaChbXCJlczIwMTVcIiwgeyBtb2R1bGVzOiBcInN5c3RlbWpzXCIgfV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlID0gXCIoU3lzdGVtLnJlZ2lzdGVyKSo/KC4uXFwvc3JjXFwvKVwiO1xuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZVdpdGggPSBcIi4uL2Rpc3QvXCI7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBodG1sTm9CdW5kbGUgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uPihcIkhUTUxOb0J1bmRsZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaHRtbE5vQnVuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIlByb21pc2UuYWxsKHByZWxvYWRNb2R1bGVzLm1hcChmdW5jdGlvbihtb2R1bGUpIHsgcmV0dXJuIFN5c3RlbUpTLmltcG9ydChtb2R1bGUpOyB9KSlcIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgLnRoZW4oZnVuY3Rpb24oKSB7XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgICAgICB7VU5JVEVDT05GSUd9XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgICAgICBTeXN0ZW1KUy5pbXBvcnQoJ2Rpc3QvZW50cnlQb2ludCcpO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB9KTtcIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbEJ1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTEJ1bmRsZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaHRtbEJ1bmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvdmVuZG9yLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD57VU5JVEVDT05GSUd9PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJHZW5lcmF0aW5nIE1vZHVsZSBMb2FkZXIgU2NhZmZvbGQgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
