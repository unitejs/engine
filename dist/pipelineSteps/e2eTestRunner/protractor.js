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
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const protractorConfiguration_1 = require("../../configuration/models/protractor/protractorConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Protractor extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["protractor", "browser-sync"], uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Jasmine");
            engineVariables.toggleDevDependency(["mochawesome-screenshots"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["@types/protractor"], uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.lintEnv.protractor = uniteConfiguration.e2eTestRunner === "Protractor" && uniteConfiguration.linter === "ESLint";
            if (uniteConfiguration.e2eTestRunner === "Protractor") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
                    if (hasGeneratedMarker) {
                        logger.info(`Generating ${Protractor.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, Protractor.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${Protractor.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Protractor.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Protractor.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reportsFolder));
        const protractorConfiguration = new protractorConfiguration_1.ProtractorConfiguration();
        protractorConfiguration.baseUrl = "http://localhost:9000";
        protractorConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.e2eTestDistFolder, "**/*.spec.js")))
        ];
        protractorConfiguration.capabilities = {
            browserName: "chrome"
        };
        protractorConfiguration.plugins = [{
                path: "test/e2e/e2e-bootstrap.js"
            }];
        for (const key in engineVariables.protractorPlugins) {
            const pluginPath = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, key)));
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
                    reportDir: `${reportsFolder}/e2e/`,
                    reportName: "index",
                    takePassedScreenshot: true
                },
                timeout: 10000
            };
        }
        lines.push(`exports.config = ${jsonHelper_1.JsonHelper.codify(protractorConfiguration)};`);
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            lines.push("exports.config.onPrepare = () => {");
            lines.push("    jasmine.getEnv().clearReporters();");
            lines.push("    jasmine.getEnv().addReporter(");
            lines.push("        new Jasmine2HtmlReporter({");
            lines.push(`            savePath: '${reportsFolder}/e2e/',`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCwwRUFBdUU7QUFHdkUsMkdBQXdHO0FBRXhHLGdGQUE2RTtBQUc3RSxnQkFBd0IsU0FBUSwrQ0FBc0I7SUFHckMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUN2SCxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxtQ0FBbUMsRUFBRSx1QkFBdUIsQ0FBQyxFQUM5RCxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQzVJLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUU1SyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRXBLLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxZQUFZLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztZQUVqSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDO29CQUNELE1B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TyxDQUFDO1lBQzVDLHVCQUF1QixDQUFDLFNBQVMsR0FBRztnQkFDaEMsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsZUFBZSxFQUFFO29CQUNiLFNBQVMsRUFBRSxHQUFHLGFBQWEsT0FBTztvQkFDbEMsVUFBVSxFQUFFLE9BQU87b0JBQ25CLG9CQUFvQixFQUFFLElBQUk7aUJBQzdCO2dCQUNELE9BQU8sRUFBRSxLQUFLO2FBQ2pCLENBQUM7UUFDTixDQUFDO1FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsdUJBQVUsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFOUUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwRCxLQUFLLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDakQsS0FBSyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3JELEtBQUssQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDakQsS0FBSyxDQUFDLElBQUksQ0FBQywwQkFBMEIsYUFBYSxTQUFTLENBQUMsQ0FBQztZQUM3RCxLQUFLLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFDekMsS0FBSyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLENBQUM7UUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDOztBQWxIYyxtQkFBUSxHQUFXLG9CQUFvQixDQUFDO0FBRDNELGdDQW9IQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvcHJvdHJhY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
