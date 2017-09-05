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
class Amd extends pipelineStepBase_1.PipelineStepBase {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL21vZHVsZVR5cGUvYW1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQSwwREFBdUQ7QUFDdkQsb0VBQWlFO0FBRWpFLFNBQWlCLFNBQVEsbUNBQWdCO0lBQzlCLFVBQVU7UUFDYixNQUFNLENBQUM7WUFDSCxJQUFJLHlCQUFXLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDO1lBQ2xELElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO1lBQ3pDLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDO1lBQzFDLElBQUkseUJBQVcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDO1lBQ3pDLElBQUkseUJBQVcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDO1NBQzVDLENBQUM7SUFDTixDQUFDO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxLQUFLLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFekssZUFBZSxDQUFDLG1CQUFtQixDQUMvQixXQUFXLEVBQ1gsWUFBWSxFQUNaLFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBRTNELEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxDQUFDO29CQUNELE1B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SjtBQTlFRCxrQkE4RUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9tb2R1bGVUeXBlL2FtZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBjb25maWd1cmF0aW9uIGZvciBhbWQgbW9kdWxlcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvYmFiZWwvYmFiZWxDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL2h0bWxUZW1wbGF0ZS9odG1sVGVtcGxhdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBUeXBlU2NyaXB0Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy90eXBlU2NyaXB0L3R5cGVTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBBbWQgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgaW5mbHVlbmNlcygpOiBQaXBlbGluZUtleVtdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNvbnRlbnRcIiwgXCJwYWNrYWdlSnNvblwiKSxcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZUtleShcImNvbnRlbnRcIiwgXCJodG1sVGVtcGxhdGVcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJsYW5ndWFnZVwiLCBcImphdmFTY3JpcHRcIiksXG4gICAgICAgICAgICBuZXcgUGlwZWxpbmVLZXkoXCJsYW5ndWFnZVwiLCBcInR5cGVTY3JpcHRcIilcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJyZXF1aXJlanNcIl0sIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIsIFwiS2FybWFcIikgJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLCBcIkFNRFwiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInJlcXVpcmVqc1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJBTURcIikpO1xuXG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUsIFwiQU1EXCIpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBNb2R1bGUgTG9hZGVyIFNjYWZmb2xkXCIsIHt9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVTY3JpcHRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248VHlwZVNjcmlwdENvbmZpZ3VyYXRpb24+KFwiVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLm1vZHVsZSA9IFwiYW1kXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYmFiZWxDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248QmFiZWxDb25maWd1cmF0aW9uPihcIkJhYmVsXCIpO1xuICAgICAgICAgICAgICAgIGlmIChiYWJlbENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRQcmVzZXQgPSBiYWJlbENvbmZpZ3VyYXRpb24ucHJlc2V0cy5maW5kKHByZXNldCA9PiBBcnJheS5pc0FycmF5KHByZXNldCkgJiYgcHJlc2V0Lmxlbmd0aCA+IDAgJiYgcHJlc2V0WzBdID09PSBcImVzMjAxNVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFByZXNldFsxXSA9IHsgbW9kdWxlczogXCJhbWRcIiB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFiZWxDb25maWd1cmF0aW9uLnByZXNldHMucHVzaChbXCJlczIwMTVcIiwgeyBtb2R1bGVzOiBcImFtZFwiIH1dKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5zcmNEaXN0UmVwbGFjZSA9IFwiKGRlZmluZSkqPyguLlxcL3NyY1xcLylcIjtcbiAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uc3JjRGlzdFJlcGxhY2VXaXRoID0gXCIuLi9kaXN0L1wiO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbE5vQnVuZGxlID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248SHRtbFRlbXBsYXRlQ29uZmlndXJhdGlvbj4oXCJIVE1MTm9CdW5kbGVcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaHRtbE5vQnVuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0IHNyYz1cXFwiLi9kaXN0L2FwcC1tb2R1bGUtY29uZmlnLmpzXFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxOb0J1bmRsZS5ib2R5LnB1c2goXCI8c2NyaXB0PlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcInJlcXVpcmUocHJlbG9hZE1vZHVsZXMsIGZ1bmN0aW9uKCkge1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaHRtbE5vQnVuZGxlLmJvZHkucHVzaChcIiAgICB7VU5JVEVDT05GSUd9XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiICAgIHJlcXVpcmUoWydkaXN0L2VudHJ5UG9pbnQnXSk7XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwifSk7XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sTm9CdW5kbGUuYm9keS5wdXNoKFwiPC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGh0bWxCdW5kbGUgPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxIdG1sVGVtcGxhdGVDb25maWd1cmF0aW9uPihcIkhUTUxCdW5kbGVcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaHRtbEJ1bmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvdmVuZG9yLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxCdW5kbGUuYm9keS5wdXNoKFwiPHNjcmlwdD57VU5JVEVDT05GSUd9PC9zY3JpcHQ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBodG1sQnVuZGxlLmJvZHkucHVzaChcIjxzY3JpcHQgc3JjPVxcXCIuL2Rpc3QvYXBwLWJ1bmRsZS5qc3tDQUNIRUJVU1R9XFxcIj48L3NjcmlwdD5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJHZW5lcmF0aW5nIE1vZHVsZSBMb2FkZXIgU2NhZmZvbGQgZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19
