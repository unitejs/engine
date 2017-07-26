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
class SharedAppFramework extends enginePipelineStepBase_1.EnginePipelineStepBase {
    generateAppSource(logger, display, fileSystem, uniteConfiguration, engineVariables, files) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                uniteConfiguration.applicationFramework.toLowerCase() +
                "/src/" +
                uniteConfiguration.sourceLanguage.toLowerCase());
            try {
                _super("log").call(this, logger, display, "Generating App Source in", { appSourceFolder: engineVariables.srcFolder });
                for (let file of files) {
                    if (file.indexOf("!") >= 0) {
                        file = file.replace("!", ".");
                    }
                    else {
                        file += "." + engineVariables.sourceLanguageExt;
                    }
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, file, engineVariables.srcFolder, file);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App Source failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateAppHtml(logger, display, fileSystem, uniteConfiguration, engineVariables, htmlFiles) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                uniteConfiguration.applicationFramework.toLowerCase() +
                "/src/html/");
            try {
                _super("log").call(this, logger, display, "Generating App HTML in", { appSourceFolder: engineVariables.srcFolder });
                for (const htmlFile of htmlFiles) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, htmlFile + ".html", engineVariables.srcFolder, htmlFile + ".html");
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App HTML failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateAppCss(logger, display, fileSystem, uniteConfiguration, engineVariables, cssFiles) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                uniteConfiguration.applicationFramework.toLowerCase() +
                "/src/css/" + uniteConfiguration.cssPre.toLowerCase() + "/");
            try {
                _super("log").call(this, logger, display, "Generating App CSS in", { appSourceFolder: engineVariables.srcFolder });
                for (const cssFile of cssFiles) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, cssFile + "." + engineVariables.styleLanguageExt, engineVariables.srcFolder, cssFile + "." + engineVariables.styleLanguageExt);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating CSS HTML failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateUnitTest(logger, display, fileSystem, uniteConfiguration, engineVariables, specs) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                        "shared" +
                        "/test/unit/src/sourceLanguage/" +
                        uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                        uniteConfiguration.unitTestFramework.toLowerCase() + "/");
                    const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/shared/test/unit/moduleType/" +
                        uniteConfiguration.moduleType.toLowerCase() + "/");
                    for (const spec of specs) {
                        yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, spec + ".spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestSrcFolder, spec + ".spec." + engineVariables.sourceLanguageExt);
                    }
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffoldModuleType, "unit-bootstrap.js", engineVariables.unitTestFolder, "unit-bootstrap.js");
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating application unit test failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    return 1;
                }
            }
            else {
                return 0;
            }
        });
    }
    generateE2eTest(logger, display, fileSystem, uniteConfiguration, engineVariables, specs) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.e2eTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
                    const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                        uniteConfiguration.applicationFramework.toLowerCase() +
                        "/test/e2e/src/e2eTestRunner/" +
                        uniteConfiguration.e2eTestRunner.toLowerCase() + "/" +
                        "/sourceLanguage/" +
                        uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                        uniteConfiguration.e2eTestFramework.toLowerCase() + "/");
                    const e2eTestsScaffoldRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                        uniteConfiguration.applicationFramework.toLowerCase() +
                        "/test/e2e/e2eTestRunner/" +
                        uniteConfiguration.e2eTestRunner.toLowerCase());
                    for (const spec of specs) {
                        yield this.copyFile(logger, display, fileSystem, e2eTestsScaffold, spec + ".spec." + engineVariables.sourceLanguageExt, engineVariables.e2eTestSrcFolder, spec + ".spec." + engineVariables.sourceLanguageExt);
                    }
                    yield this.copyFile(logger, display, fileSystem, e2eTestsScaffoldRunner, "e2e-bootstrap.js", engineVariables.e2eTestFolder, "e2e-bootstrap.js");
                    if (uniteConfiguration.sourceLanguage === "TypeScript") {
                        yield this.copyFile(logger, display, fileSystem, e2eTestsScaffoldRunner, "e2e-bootstrap.d.ts", engineVariables.e2eTestFolder, "e2e-bootstrap.d.ts");
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, "Generating application e2e test failed", err, { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
                    return 1;
                }
            }
            else {
                return 0;
            }
        });
    }
    generateCss(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating application css scaffold shared");
                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/shared/css/" +
                    uniteConfiguration.cssPre.toLowerCase());
                _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "app." + engineVariables.styleLanguageExt, engineVariables.cssSrcFolder, "app." + engineVariables.styleLanguageExt);
                _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "main." + engineVariables.styleLanguageExt, engineVariables.cssSrcFolder, "main." + engineVariables.styleLanguageExt);
                _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, "reset." + engineVariables.styleLanguageExt, engineVariables.cssSrcFolder, "reset." + engineVariables.styleLanguageExt);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating application css failed", err);
                return 1;
            }
        });
    }
}
exports.SharedAppFramework = SharedAppFramework;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsT0FBaUIsRUFDakIsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7OztZQUM3QyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZTtnQkFDZixrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JELE9BQU87Z0JBQ1Asa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFFaEksSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFFdkcsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxJQUFJLEdBQUcsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUM7b0JBQ3BELENBQUM7b0JBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUMzQixjQUFjLEVBQ2QsSUFBSSxFQUNKLGVBQWUsQ0FBQyxTQUFT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LENBQUM7b0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsd0NBQXdDLEVBQUUsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7b0JBQ3JJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVlLFdBQVcsQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDN0osSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDRDQUE0QyxFQUFFO2dCQUV6RSxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsMEJBQTBCO29CQUNyRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFFN0Msa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2hMLGtCQUFjLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxPQUFPLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFO2dCQUNsTCxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFFcEwsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtnQkFDdkUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTVNRCxnREE0TUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9hcHBsaWNhdGlvbkZyYW1ld29yay9zaGFyZWRBcHBGcmFtZXdvcmsuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
