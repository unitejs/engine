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
/**
 * Pipeline step to generate Protractor configuration.
 */
const protractorConfiguration_1 = require("../../configuration/models/protractor/protractorConfiguration");
const jsonHelper_1 = require("../../core/jsonHelper");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Protractor extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "browser-sync"], uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Jasmine");
            engineVariables.toggleDevDependency(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["@types/protractor"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.sourceLanguage === "TypeScript");
            if (uniteConfiguration.e2eTestRunner === "Protractor") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, Protractor.FILENAME);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${Protractor.FILENAME}`);
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, Protractor.FILENAME, lines);
                    }
                    else {
                        _super("log").call(this, logger, display, `Skipping ${Protractor.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${Protractor.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, Protractor.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, engineVariables.reportsFolder));
        const protractorConfiguration = new protractorConfiguration_1.ProtractorConfiguration();
        protractorConfiguration.baseUrl = "http://localhost:9000";
        protractorConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.e2eTestDistFolder, "**/*.spec.js")))
        ];
        protractorConfiguration.capabilities = {
            browserName: "chrome"
        };
        protractorConfiguration.plugins = [{
                path: "test/e2e/e2e-bootstrap.js"
            }];
        protractorConfiguration.plugins = protractorConfiguration.plugins.concat(engineVariables.protractorPlugins.map(protractorPlugin => {
            return {
                path: "node_modules/" + protractorPlugin
            };
        }));
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');");
            lines.push("const SpecReporter = require('jasmine-spec-reporter').SpecReporter;");
            protractorConfiguration.framework = "jasmine";
            protractorConfiguration.jasmineNodeOpts = {
                showColors: true
            };
        }
        else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            protractorConfiguration.framework = "mocha";
            protractorConfiguration.mochaOpts = {
                reporter: "mochawesome-screenshots",
                reporterOptions: {
                    reportDir: reportsFolder + "/e2e/",
                    reportName: "index",
                    takePassedScreenshot: true
                }
            };
        }
        lines.push("exports.config = " + jsonHelper_1.JsonHelper.codify(protractorConfiguration) + ";");
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("exports.config.onPrepare = () => {");
            lines.push("    jasmine.getEnv().clearReporters();");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new Jasmine2HtmlReporter({");
            lines.push("            savePath: '" + reportsFolder + "/e2e/',");
            lines.push("            fileName: 'index'");
            lines.push("        })");
            lines.push("    );");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new SpecReporter({");
            lines.push("            displayStacktrace: 'all'");
            lines.push("        })");
            lines.push("    );");
            lines.push("};");
        }
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
Protractor.FILENAME = "protractor.conf.js";
exports.Protractor = Protractor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwyR0FBd0c7QUFFeEcsc0RBQW1EO0FBQ25ELGdGQUE2RTtBQU03RSxnQkFBd0IsU0FBUSwrQ0FBc0I7SUFHckMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3ZILGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1DQUFtQyxFQUFFLHVCQUF1QixDQUFDLEVBQzlGLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDNUcsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMseUJBQXlCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRTVLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFcEssRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQztvQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUUz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QUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDOUQsdUJBQXVCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUM1Qyx1QkFBdUIsQ0FBQyxTQUFTLEdBQUc7Z0JBQ2hDLFFBQVEsRUFBRSx5QkFBeUI7Z0JBQ25DLGVBQWUsRUFBRTtvQkFDYixTQUFTLEVBQUUsYUFBYSxHQUFHLE9BQU87b0JBQ2xDLFVBQVUsRUFBRSxPQUFPO29CQUNuQixvQkFBb0IsRUFBRSxJQUFJO2lCQUM3QjthQUNKLENBQUM7UUFDTixDQUFDO1FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRW5GLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ2pELEtBQUssQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUNyRCxLQUFLLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDaEQsS0FBSyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ2pELEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQ2xFLEtBQUssQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN6QyxLQUFLLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDbkQsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBaEdjLG1CQUFRLEdBQVcsb0JBQW9CLENBQUM7QUFEM0QsZ0NBa0dDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci9wcm90cmFjdG9yLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
