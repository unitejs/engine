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
class Amd extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["requirejs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "AMD");
            engineVariables.toggleClientPackage("requirejs", "require.js", undefined, undefined, false, "both", "both", false, undefined, undefined, undefined, uniteConfiguration.moduleType === "AMD");
            if (uniteConfiguration.moduleType === "AMD") {
                try {
                    logger.info("Generating Module Loader Scaffold", {});
                    const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
                    if (typeScriptConfiguration) {
                        typeScriptConfiguration.compilerOptions.module = "amd";
                    }
                    const babelConfiguration = engineVariables.getConfiguration("Babel");
                    if (babelConfiguration) {
                        const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "es2015");
                        if (foundPreset) {
                            foundPreset[1] = { modules: "amd" };
                        }
                        else {
                            babelConfiguration.presets.push(["es2015", { modules: "amd" }]);
                        }
                    }
                    uniteConfiguration.srcDistReplace = "(define)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
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
exports.Amd = Amd;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFTQSxnRkFBNkU7QUFHN0UsU0FBaUIsU0FBUSwrQ0FBc0I7SUFDOUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUU3SSxlQUFlLENBQUMsbUJBQW1CLENBQy9CLFdBQVcsRUFDWCxZQUFZLEVBQ1osU0FBUyxFQUNULFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1Qsa0JBQWtCLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBRTdDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFFckQsTUFBTSx1QkFBdUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTBCLFlBQVksQ0FBQyxDQUFDO29CQUN4RyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7d0JBQzFCLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUMzRCxDQUFDO29CQUVELE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFxQixPQUFPLENBQUMsQ0FBQztvQkFDekYsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQzt3QkFDcEksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDZCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7d0JBQ3hDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3BFLENBQUM7b0JBQ0wsQ0FBQztvQkFFRCxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsdUJBQXVCLENBQUM7b0JBQzVELGtCQUFrQixDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztvQkFFbkQsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUE0QixjQUFjLENBQUMsQ0FBQztvQkFFakcsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDZixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO3dCQUNoRixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDbkMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQzt3QkFDL0QsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDNUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQzt3QkFDNUQsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzlCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN4QyxDQUFDO29CQUVELE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBNEIsWUFBWSxDQUFDLENBQUM7b0JBRTdGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsOERBQThELENBQUMsQ0FBQzt3QkFDckYsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzt3QkFDdkQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQztvQkFDdEYsQ0FBQztvQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM5RCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtDQUNKO0FBcEVELGtCQW9FQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIGNvbmZpZ3VyYXRpb24gZm9yIGFtZCBtb2R1bGVzLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEJhYmVsQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvaHRtbFRlbXBsYXRlL2h0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFR5cGVTY3JpcHRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3R5cGVTY3JpcHQvdHlwZVNjcmlwdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBBbWQgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJyZXF1aXJlanNcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwicmVxdWlyZWpzXCIsXG4gICAgICAgICAgICBcInJlcXVpcmUuanNcIixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQU1EXCIpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJBTURcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9kdWxlIExvYWRlciBTY2FmZm9sZFwiLCB7fSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5tb2R1bGUgPSBcImFtZFwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJhYmVsQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCJCYWJlbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYmFiZWxDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUHJlc2V0ID0gYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMuZmluZChwcmVzZXQgPT4gQXJyYXkuaXNBcnJheShwcmVzZXQpICYmIHByZXNldC5sZW5ndGggPiAwICYmIHByZXNldFswXSA9PT0gXCJlczIwMTVcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFByZXNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRQcmVzZXRbMV0gPSB7IG1vZHVsZXM6IFwiYW1kXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLnB1c2goW1wiZXMyMDE1XCIsIHsgbW9kdWxlczogXCJhbWRcIiB9XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2UgPSBcIihkZWZpbmUpKj8oLi5cXC9zcmNcXC8pXCI7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlV2l0aCA9IFwiLi4vZGlzdC9cIjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGh0bWxOb0J1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTE5vQnVuZGxlXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGh0bWxOb0J1bmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtbW9kdWxlLWNvbmZpZy5qc1xcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJyZXF1aXJlKHByZWxvYWRNb2R1bGVzLCBmdW5jdGlvbigpIHtcIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAge1VOSVRFQ09ORklHfVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICByZXF1aXJlKFsnZGlzdC9lbnRyeVBvaW50J10pO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIn0pO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBodG1sQnVuZGxlID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248SHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbj4oXCJIVE1MQnVuZGxlXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGh0bWxCdW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L3ZlbmRvci1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+e1VOSVRFQ09ORklHfTwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiR2VuZXJhdGluZyBNb2R1bGUgTG9hZGVyIFNjYWZmb2xkIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
