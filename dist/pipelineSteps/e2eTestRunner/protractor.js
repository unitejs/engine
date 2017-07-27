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
            engineVariables.lintEnv.protractor = uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.linter === "ESLint";
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
        for (const key in engineVariables.protractorPlugins) {
            const pluginPath = "node_modules/" + key;
            if (engineVariables.protractorPlugins[key]) {
                let exists = false;
                protractorConfiguration.plugins.forEach(plugin => {
                    if (plugin.path === pluginPath) {
                        exists = true;
                    }
                });
                if (!exists) {
                    protractorConfiguration.plugins.push({ path: pluginPath });
                }
            }
            else {
                protractorConfiguration.plugins.forEach((plugin, index) => {
                    if (plugin.path === pluginPath) {
                        protractorConfiguration.plugins.splice(index, 1);
                    }
                });
            }
        }
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
                },
                timeout: 10000
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwyR0FBd0c7QUFFeEcsc0RBQW1EO0FBQ25ELGdGQUE2RTtBQU03RSxnQkFBd0IsU0FBUSwrQ0FBc0I7SUFHckMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3ZILGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1DQUFtQyxFQUFFLHVCQUF1QixDQUFDLEVBQzlGLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDNUcsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMseUJBQXlCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRTVLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFcEssZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDO1lBRWpJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUM7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
