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
 * Pipeline step to generate WebdriverIO configuration.
 */
const jsonHelper_1 = require("unitejs-framework/dist/helpers/jsonHelper");
const webdriverIoConfiguration_1 = require("../../configuration/models/webdriverIo/webdriverIoConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class WebdriverIo extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["webdriverio",
                "wdio-spec-reporter",
                "wdio-allure-reporter",
                "browser-sync",
                "selenium-standalone",
                "allure-commandline"], uniteConfiguration.e2eTestRunner === "WebdriverIO");
            engineVariables.toggleDevDependency(["wdio-jasmine-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Jasmine");
            engineVariables.toggleDevDependency(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Mocha-Chai");
            engineVariables.toggleDevDependency(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript");
            engineVariables.toggleDevDependency(["eslint-plugin-webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint");
            engineVariables.lintPlugins.webdriverio = uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint";
            engineVariables.lintEnv["webdriverio/wdio"] = uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.linter === "ESLint";
            if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwFolder, WebdriverIo.FILENAME);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${WebdriverIo.FILENAME}`);
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.wwwFolder, WebdriverIo.FILENAME, lines);
                    }
                    else {
                        _super("log").call(this, logger, display, `Skipping ${WebdriverIo.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${WebdriverIo.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.wwwFolder, WebdriverIo.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwFolder, engineVariables.reportsFolder));
        const webdriverConfiguration = new webdriverIoConfiguration_1.WebdriverIoConfiguration();
        webdriverConfiguration.baseUrl = "http://localhost:9000";
        webdriverConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwFolder, fileSystem.pathCombine(engineVariables.e2eTestDistFolder, "**/*.spec.js")))
        ];
        webdriverConfiguration.capabilities = [
            {
                browserName: "chrome"
            }
        ];
        webdriverConfiguration.sync = false;
        if (uniteConfiguration.e2eTestFramework === "Jasmine") {
            webdriverConfiguration.framework = "jasmine";
        }
        else if (uniteConfiguration.e2eTestFramework === "Mocha-Chai") {
            webdriverConfiguration.framework = "mocha";
        }
        webdriverConfiguration.reporters = ["spec", "allure"];
        webdriverConfiguration.reporterOptions = {
            allure: {
                outputDir: `${reportsFolder}/e2etemp/`
            }
        };
        const e2eBootstrap = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwFolder, fileSystem.pathCombine(engineVariables.e2eTestFolder, "e2e-bootstrap.js")));
        lines.push(`exports.config = ${jsonHelper_1.JsonHelper.codify(webdriverConfiguration)}`);
        lines.push(`exports.config.before = require('${e2eBootstrap}');`);
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
WebdriverIo.FILENAME = "wdio.conf.js";
exports.WebdriverIo = WebdriverIo;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsMEVBQXVFO0FBS3ZFLDhHQUEyRztBQUMzRyxnRkFBNkU7QUFHN0UsaUJBQXlCLFNBQVEsK0NBQXNCO0lBR3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsYUFBYTtnQkFDYixvQkFBb0I7Z0JBQ3BCLHNCQUFzQjtnQkFDdEIsY0FBYztnQkFDZCxxQkFBcUI7Z0JBQ3JCLG9CQUFvQixDQUFDLEVBQ3RCLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQztZQUV4RixlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDekssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQzFLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUM7WUFFdEssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsMkJBQTJCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztZQUVqSyxlQUFlLENB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QUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzlELHNCQUFzQixDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDL0MsQ0FBQztRQUNELHNCQUFzQixDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RCxzQkFBc0IsQ0FBQyxlQUFlLEdBQUc7WUFDckMsTUFBTSxFQUFFO2dCQUNKLFNBQVMsRUFBRSxHQUFHLGFBQWEsV0FBVzthQUN6QztTQUNKLENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3SyxLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFvQix1QkFBVSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1RSxLQUFLLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxZQUFZLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBNUVjLG9CQUFRLEdBQVcsY0FBYyxDQUFDO0FBRHJELGtDQThFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
