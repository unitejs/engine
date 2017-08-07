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
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
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
                        logger.info(`Generating ${WebdriverIo.FILENAME}`);
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.wwwFolder, WebdriverIo.FILENAME, lines);
                    }
                    else {
                        logger.info(`Skipping ${WebdriverIo.FILENAME} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${WebdriverIo.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwFolder, WebdriverIo.FILENAME);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsMEVBQXVFO0FBSXZFLDhHQUEyRztBQUMzRyxnRkFBNkU7QUFHN0UsaUJBQXlCLFNBQVEsK0NBQXNCO0lBR3RDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWE7Z0JBQ2Isb0JBQW9CO2dCQUNwQixzQkFBc0I7Z0JBQ3RCLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixvQkFBb0IsQ0FBQyxFQUN0QixrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUM7WUFFeEYsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsd0JBQXdCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQ3pLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMxSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRXRLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7WUFFakssZUFBZSxDQUFDLFdBQVcsQ0FB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SyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzlELHNCQUFzQixDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDL0MsQ0FBQztRQUNELHNCQUFzQixDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RCxzQkFBc0IsQ0FBQyxlQUFlLEdBQUc7WUFDckMsTUFBTSxFQUFFO2dCQUNKLFNBQVMsRUFBRSxHQUFHLGFBQWEsV0FBVzthQUN6QztTQUNKLENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3SyxLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFvQix1QkFBVSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1RSxLQUFLLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxZQUFZLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBNUVjLG9CQUFRLEdBQVcsY0FBYyxDQUFDO0FBRHJELGtDQThFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
