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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["requirejs"], _super("condition").call(this, uniteConfiguration.unitTestRunner, "Karma") && _super("condition").call(this, uniteConfiguration.moduleType, "AMD"));
            engineVariables.toggleClientPackage("requirejs", "require.js", undefined, undefined, false, "both", "both", false, undefined, undefined, undefined, _super("condition").call(this, uniteConfiguration.moduleType, "AMD"));
            if (_super("condition").call(this, uniteConfiguration.moduleType, "AMD")) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFTQSxnRkFBNkU7QUFHN0UsU0FBaUIsU0FBUSwrQ0FBc0I7SUFDOUIsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxLQUFLLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFekssZUFBZSxDQUFDLG1CQUFtQixDQUMvQixXQUFXLEVBQ1gsWUFBWSxFQUNaLFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBRTNELEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRXJELE1BQU0sdUJBQXVCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEwQixZQUFZLENBQUMsQ0FBQztvQkFDeEcsRUFBRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO3dCQUMxQix1QkFBdUIsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDM0QsQ0FBQztvQkFFRCxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBcUIsT0FBTyxDQUFDLENBQUM7b0JBQ3pGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQzt3QkFDckIsTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUM7d0JBQ3BJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7NEJBQ2QsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUN4QyxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNwRSxDQUFDO29CQUNMLENBQUM7b0JBRUQsa0JBQWtCLENBQUMsY0FBYyxHQUFHLHVCQUF1QixDQUFDO29CQUM1RCxrQkFBa0IsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUM7b0JBRW5ELE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBNEIsY0FBYyxDQUFDLENBQUM7b0JBRWpHLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ2YsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQzt3QkFDaEYsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQ25DLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7d0JBQy9ELFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQzVDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7d0JBQzVELFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM5QixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDeEMsQ0FBQztvQkFFRCxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLFlBQVksQ0FBQyxDQUFDO29CQUU3RixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNiLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7d0JBQ3JGLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7d0JBQ3ZELFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBQ3RGLENBQUM7b0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDOUQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDSjtBQXBFRCxrQkFvRUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2FtZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBhbWQgbW9kdWxlcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgQW1kIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wicmVxdWlyZWpzXCJdLCBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIkthcm1hXCIpICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJBTURcIikpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJyZXF1aXJlanNcIixcbiAgICAgICAgICAgIFwicmVxdWlyZS5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUsIFwiQU1EXCIpKTtcblxuICAgICAgICBpZiAoc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLCBcIkFNRFwiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9kdWxlIExvYWRlciBTY2FmZm9sZFwiLCB7fSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucy5tb2R1bGUgPSBcImFtZFwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJhYmVsQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCJCYWJlbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYmFiZWxDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kUHJlc2V0ID0gYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMuZmluZChwcmVzZXQgPT4gQXJyYXkuaXNBcnJheShwcmVzZXQpICYmIHByZXNldC5sZW5ndGggPiAwICYmIHByZXNldFswXSA9PT0gXCJlczIwMTVcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFByZXNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRQcmVzZXRbMV0gPSB7IG1vZHVsZXM6IFwiYW1kXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLnB1c2goW1wiZXMyMDE1XCIsIHsgbW9kdWxlczogXCJhbWRcIiB9XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2UgPSBcIihkZWZpbmUpKj8oLi5cXC9zcmNcXC8pXCI7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlV2l0aCA9IFwiLi4vZGlzdC9cIjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGh0bWxOb0J1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTE5vQnVuZGxlXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGh0bWxOb0J1bmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdCBzcmM9XFxcIi4vZGlzdC9hcHAtbW9kdWxlLWNvbmZpZy5qc1xcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCJyZXF1aXJlKHByZWxvYWRNb2R1bGVzLCBmdW5jdGlvbigpIHtcIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAge1VOSVRFQ09ORklHfVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICByZXF1aXJlKFsnZGlzdC9lbnRyeVBvaW50J10pO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIn0pO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBodG1sQnVuZGxlID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248SHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbj4oXCJIVE1MQnVuZGxlXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGh0bWxCdW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L3ZlbmRvci1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+e1VOSVRFQ09ORklHfTwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbEJ1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1idW5kbGUuanN7Q0FDSEVCVVNUfVxcXCI+PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFwiR2VuZXJhdGluZyBNb2R1bGUgTG9hZGVyIFNjYWZmb2xkIGZhaWxlZFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
