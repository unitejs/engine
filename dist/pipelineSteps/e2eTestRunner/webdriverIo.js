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
const webdriverIoConfiguration_1 = require("../../configuration/models/webdriverIo/webdriverIoConfiguration");
const jsonHelper_1 = require("../../core/jsonHelper");
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
            if (uniteConfiguration.e2eTestRunner === "WebdriverIO") {
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, WebdriverIo.FILENAME);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${WebdriverIo.FILENAME}`);
                        const lines = [];
                        this.generateConfig(fileSystem, uniteConfiguration, engineVariables, lines);
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, WebdriverIo.FILENAME, lines);
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
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, WebdriverIo.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, lines) {
        const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, engineVariables.reportsFolder));
        const webdriverConfiguration = new webdriverIoConfiguration_1.WebdriverIoConfiguration();
        webdriverConfiguration.baseUrl = "http://localhost:9000";
        webdriverConfiguration.specs = [
            fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.e2eTestDistFolder, "**/*.spec.js")))
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
                outputDir: reportsFolder + "/e2etemp/"
            }
        };
        const e2eBootstrap = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.rootFolder, fileSystem.pathCombine(engineVariables.e2eTestFolder, "e2e-bootstrap.js")));
        lines.push("exports.config = " + jsonHelper_1.JsonHelper.codify(webdriverConfiguration));
        lines.push("exports.config.before = require('" + e2eBootstrap + "');");
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
WebdriverIo.FILENAME = "wdio.conf.js";
exports.WebdriverIo = WebdriverIo;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLDhHQUEyRztBQUMzRyxzREFBbUQ7QUFDbkQsZ0ZBQTZFO0FBTTdFLGlCQUF5QixTQUFRLCtDQUFzQjtJQUd0QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWE7Z0JBQ2Qsb0JBQW9CO2dCQUNwQixzQkFBc0I7Z0JBQ3RCLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixvQkFBb0IsQ0FBQyxFQUN0QixrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUM7WUFFdkYsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsd0JBQXdCLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQ3pLLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUMxSyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLElBQUksa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBRXRLLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUM7b0JBQ0QsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGdDQUE0QixZQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFNUgsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFFakUsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO3dCQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzVFLE1BQU0sVUFBVSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzdGLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBWSxXQUFXLENBQUMsUUFBUSxnQ0FBZ0MsRUFBRTtvQkFDakcsQ0FBQztvQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLFdBQVcsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUU7b0JBQy9FLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqSCxDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxLQUFlO1FBQ3JJLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFbkksTUFBTSxzQkFBc0IsR0FBRyxJQUFJLG1EQUF3QixFQUFFLENBQUM7UUFDOUQsc0JBQXNCLENBQUMsT0FBTyxHQUFHLHVCQUF1QixDQUFDO1FBQ3pELHNCQUFzQixDQUFDLEtBQUssR0FBRztZQUMzQixVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7U0FDM0osQ0FBQztRQUNGLHNCQUFzQixDQUFDLFlBQVksR0FBRztZQUNsQztnQkFDSSxXQUFXLEVBQUUsUUFBUTthQUN4QjtTQUNKLENBQUM7UUFDRixzQkFBc0IsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBRXBDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsc0JBQXNCLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUNqRCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDOUQsc0JBQXNCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUMvQyxDQUFDO1FBQ0Qsc0JBQXNCLENBQUMsU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELHNCQUFzQixDQUFDLGVBQWUsR0FBRztZQUNyQyxNQUFNLEVBQUU7Z0JBQ0osU0FBUyxFQUFFLGFBQWEsR0FBRyxXQUFXO2FBQ3pDO1NBQ0osQ0FBQztRQUVGLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlLLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1FBQzVFLEtBQUssQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEdBQUcsWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ3ZFLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7O0FBdkVjLG9CQUFRLEdBQVcsY0FBYyxDQUFDO0FBRHJELGtDQXlFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8uanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
