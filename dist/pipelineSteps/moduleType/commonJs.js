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
class CommonJs extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            // We use SystemJS to load cjs modules for the unbundled version of the project and unit testing
            engineVariables.toggleDevDependency(["systemjs"], uniteConfiguration.unitTestRunner === "Karma" && uniteConfiguration.moduleType === "CommonJS");
            engineVariables.toggleClientPackage("systemjs", "dist/system.src.js", "dist/system.js", false, "both", true, false, undefined, uniteConfiguration.moduleType === "CommonJS");
            if (uniteConfiguration.moduleType === "CommonJS") {
                try {
                    logger.info("Generating Module Loader Scaffold");
                    const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
                    if (typeScriptConfiguration) {
                        typeScriptConfiguration.compilerOptions.module = "commonjs";
                    }
                    const babelConfiguration = engineVariables.getConfiguration("Babel");
                    if (babelConfiguration) {
                        const foundPreset = babelConfiguration.presets.find(preset => Array.isArray(preset) && preset.length > 0 && preset[0] === "es2015");
                        if (foundPreset) {
                            foundPreset[1] = { modules: "commonjs" };
                        }
                        else {
                            babelConfiguration.presets.push(["es2015", { modules: "commonjs" }]);
                        }
                    }
                    uniteConfiguration.srcDistReplace = "(require)*?(..\/src\/)";
                    uniteConfiguration.srcDistReplaceWith = "../dist/";
                    const htmlNoBundle = engineVariables.getConfiguration("HTMLNoBundle");
                    if (htmlNoBundle) {
                        htmlNoBundle.scriptIncludes.push("systemjs/dist/system.src.js");
                        htmlNoBundle.body.push("<script src=\"./dist/app-module-config.js\"></script>");
                        htmlNoBundle.body.push("<script>");
                        htmlNoBundle.body.push("Promise.all(window.preloadModules.map(function(module) { return SystemJS.import(module); }))");
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
exports.CommonJs = CommonJs;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvY29tbW9uSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLGdGQUE2RTtBQUc3RSxjQUFzQixTQUFRLCtDQUFzQjtJQUNuQyxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ25JLGdHQUFnRztZQUNoRyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQztZQUVqSixlQUFlLENBQUMsbUJBQW1CLENBQy9CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLEtBQUssRUFDTCxNQUFNLEVBQ04sSUFBSSxFQUNKLEtBQUssRUFDTCxTQUFTLEVBQ1Qsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDO1lBRWxELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUVqRCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7b0JBQ3hHLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQzt3QkFDMUIsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7b0JBQ2hFLENBQUM7b0JBRUQsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQXFCLE9BQU8sQ0FBQyxDQUFDO29CQUN6RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO3dCQUNwSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNkLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQzt3QkFDN0MsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekUsQ0FBQztvQkFDTCxDQUFDO29CQUVELGtCQUFrQixDQUFDLGNBQWMsR0FBRyx3QkFBd0IsQ0FBQztvQkFDN0Qsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO29CQUVuRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTRCLGNBQWMsQ0FBQyxDQUFDO29CQUNqRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNmLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7d0JBRWhFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7d0JBQ2hGLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4RkFBOEYsQ0FBQyxDQUFDO3dCQUN2SCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO3dCQUNqRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO3dCQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO3dCQUN0RSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3hDLENBQUM7b0JBRUQsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUE0QixZQUFZLENBQUMsQ0FBQztvQkFDN0YsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDYixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO3dCQUNyRixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO3dCQUN2RCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDO29CQUN0RixDQUFDO29CQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFuRUQsNEJBbUVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbW9kdWxlVHlwZS9jb21tb25Kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBjb21tb25qcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgQ29tbW9uSnMgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICAvLyBXZSB1c2UgU3lzdGVtSlMgdG8gbG9hZCBjanMgbW9kdWxlcyBmb3IgdGhlIHVuYnVuZGxlZCB2ZXJzaW9uIG9mIHRoZSBwcm9qZWN0IGFuZCB1bml0IHRlc3RpbmdcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wic3lzdGVtanNcIl0sIHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciA9PT0gXCJLYXJtYVwiICYmIHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkNvbW1vbkpTXCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJzeXN0ZW1qc1wiLFxuICAgICAgICAgICAgXCJkaXN0L3N5c3RlbS5zcmMuanNcIixcbiAgICAgICAgICAgIFwiZGlzdC9zeXN0ZW0uanNcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJDb21tb25KU1wiKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQ29tbW9uSlNcIikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgTW9kdWxlIExvYWRlciBTY2FmZm9sZFwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVTY3JpcHRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248VHlwZVNjcmlwdENvbmZpZ3VyYXRpb24+KFwiVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLm1vZHVsZSA9IFwiY29tbW9uanNcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBiYWJlbENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxCYWJlbENvbmZpZ3VyYXRpb24+KFwiQmFiZWxcIik7XG4gICAgICAgICAgICAgICAgaWYgKGJhYmVsQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZFByZXNldCA9IGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLmZpbmQocHJlc2V0ID0+IEFycmF5LmlzQXJyYXkocHJlc2V0KSAmJiBwcmVzZXQubGVuZ3RoID4gMCAmJiBwcmVzZXRbMF0gPT09IFwiZXMyMDE1XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kUHJlc2V0WzFdID0geyBtb2R1bGVzOiBcImNvbW1vbmpzXCIgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhYmVsQ29uZmlndXJhdGlvbi5wcmVzZXRzLnB1c2goW1wiZXMyMDE1XCIsIHsgbW9kdWxlczogXCJjb21tb25qc1wiIH1dKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZSA9IFwiKHJlcXVpcmUpKj8oLi5cXC9zcmNcXC8pXCI7XG4gICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLnNyY0Rpc3RSZXBsYWNlV2l0aCA9IFwiLi4vZGlzdC9cIjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGh0bWxOb0J1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTE5vQnVuZGxlXCIpO1xuICAgICAgICAgICAgICAgIGlmIChodG1sTm9CdW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLnNjcmlwdEluY2x1ZGVzLnB1c2goXCJzeXN0ZW1qcy9kaXN0L3N5c3RlbS5zcmMuanNcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLW1vZHVsZS1jb25maWcuanNcXFwiPjwvc2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiUHJvbWlzZS5hbGwod2luZG93LnByZWxvYWRNb2R1bGVzLm1hcChmdW5jdGlvbihtb2R1bGUpIHsgcmV0dXJuIFN5c3RlbUpTLmltcG9ydChtb2R1bGUpOyB9KSlcIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCIgICAgLnRoZW4oZnVuY3Rpb24oKSB7XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgICAgICB7VU5JVEVDT05GSUd9XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgICAgICBTeXN0ZW1KUy5pbXBvcnQoJ2Rpc3QvZW50cnlQb2ludCcpO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB9KTtcIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbEJ1bmRsZSA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEh0bWxUZW1wbGF0ZUNvbmZpZ3VyYXRpb24+KFwiSFRNTEJ1bmRsZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaHRtbEJ1bmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvdmVuZG9yLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD57VU5JVEVDT05GSUd9PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJHZW5lcmF0aW5nIE1vZHVsZSBMb2FkZXIgU2NhZmZvbGQgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
