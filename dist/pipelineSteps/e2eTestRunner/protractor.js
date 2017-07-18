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
            engineVariables.toggleDependencies(["protractor", "browser-sync"], uniteConfiguration.e2eTestRunner === "Protractor", true);
            engineVariables.toggleDependencies(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Jasmine", true);
            engineVariables.toggleDependencies(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Mocha-Chai", true);
            engineVariables.toggleDependencies(["@types/protractor"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.sourceLanguage === "TypeScript", true);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwyR0FBd0c7QUFFeEcsc0RBQW1EO0FBQ25ELGdGQUE2RTtBQU03RSxnQkFBd0IsU0FBUSwrQ0FBc0I7SUFHckMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1SCxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxtQ0FBbUMsRUFBRSx1QkFBdUIsQ0FBQyxFQUM3RixrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsRUFDdEcsSUFBSSxDQUFDLENBQUM7WUFDVixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWpMLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXpLLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMs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b0JBQ2IsU0FBUyxFQUFFLGFBQWEsR0FBRyxPQUFPO29CQUNsQyxVQUFVLEVBQUUsT0FBTztvQkFDbkIsb0JBQW9CLEVBQUUsSUFBSTtpQkFDN0I7YUFDSixDQUFDO1FBQ04sQ0FBQztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVuRixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNqRCxLQUFLLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7WUFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ2hELEtBQUssQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNqRCxLQUFLLENBQUMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUNsRSxLQUFLLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDekMsS0FBSyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLENBQUM7UUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQTFGYyxtQkFBUSxHQUFXLG9CQUFvQixDQUFDO0FBRDNELGdDQTRGQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
