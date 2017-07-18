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
            engineVariables.toggleDependencies(["webdriverio",
                "wdio-spec-reporter",
                "wdio-allure-reporter",
                "browser-sync",
                "selenium-standalone",
                "allure-commandline"], uniteConfiguration.e2eTestRunner === "WebdriverIO", true);
            engineVariables.toggleDependencies(["wdio-jasmine-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Jasmine", true);
            engineVariables.toggleDependencies(["wdio-mocha-framework"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.e2eTestFramework === "Mocha-Chai", true);
            engineVariables.toggleDependencies(["@types/webdriverio"], uniteConfiguration.e2eTestRunner === "WebdriverIO" && uniteConfiguration.sourceLanguage === "TypeScript", true);
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
        webdriverConfiguration.sync = true;
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
        lines.push("exports.config = " + jsonHelper_1.JsonHelper.codify(webdriverConfiguration));
        lines.push(super.wrapGeneratedMarker("/* ", " */"));
    }
}
WebdriverIo.FILENAME = "wdio.conf.js";
exports.WebdriverIo = WebdriverIo;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2UyZVRlc3RSdW5uZXIvd2ViZHJpdmVySW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLDhHQUEyRztBQUMzRyxzREFBbUQ7QUFDbkQsZ0ZBQTZFO0FBTTdFLGlCQUF5QixTQUFRLCtDQUFzQjtJQUd0QyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWE7Z0JBQ2Isb0JBQW9CO2dCQUNwQixzQkFBc0I7Z0JBQ3RCLGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixvQkFBb0IsQ0FBQyxFQUN0QixrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxFQUNsRCxJQUFJLENBQUMsQ0FBQztZQUV6QyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGFBQWEsS0FBSyxhQUFhLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlLLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0ssZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssYUFBYSxJQUFJLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFM0ssRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQztvQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUU1SCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUVqRSxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7d0JBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDNUUsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDN0YsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLFdBQVcsQ0FBQyxRQUFRLGdDQUFnQyxFQUFFO29CQUNqRyxDQUFDO29CQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsV0FBVyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRTtvQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pILENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLEtBQWU7UUFDckksTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUVuSSxNQUFNLHNCQUFzQixHQUFHLElBQUksbURBQXdCLEVBQUUsQ0FBQztRQUM5RCxzQkFBc0IsQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUM7UUFDekQsc0JBQXNCLENBQUMsS0FBSyxHQUFHO1lBQzNCLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztTQUMzSixDQUFDO1FBQ0Ysc0JBQXNCLENBQUMsWUFBWSxHQUFHO1lBQ2xDO2dCQUNJLFdBQVcsRUFBRSxRQUFRO2FBQ3hCO1NBQ0osQ0FBQztRQUNGLHNCQUFzQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbkMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwRCxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ2pELENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5RCxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQy9DLENBQUM7UUFDRCxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEQsc0JBQXNCLENBQUMsZUFBZSxHQUFHO1lBQ3JDLE1BQU0sRUFBRTtnQkFDSixTQUFTLEVBQUUsYUFBYSxHQUFHLFdBQVc7YUFDekM7U0FDSixDQUFDO1FBRUYsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDNUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQzs7QUFyRWMsb0JBQVEsR0FBVyxjQUFjLENBQUM7QUFEckQsa0NBdUVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci93ZWJkcml2ZXJJby5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
