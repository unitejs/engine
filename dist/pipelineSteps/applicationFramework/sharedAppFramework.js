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
                for (const file of files) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, file + "." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, file + "." + engineVariables.sourceLanguageExt);
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
                        uniteConfiguration.applicationFramework.toLowerCase() +
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsZ0ZBQTZFO0FBTTdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsT0FBaUIsRUFDakIsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7OztZQUM3QyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsZUFBZTtnQkFDZixrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JELE9BQU87Z0JBQ1Asa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFFaEksSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFFdkcsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUMzQixjQUFjLEVBQ2QsSUFBSSxHQUFHLEdBQUcsR0FBRyxlQUFlLENBQUMsaUJBQWlCLEVBQzlDLGVBQWUsQ0FBQyxTQUFTLEVBQ3pCLElBQUksR0FBRyxHQUFHLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3hFLENBQUM7Z0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEdBQUcsRUFB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QkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRWUsV0FBVyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUM3SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNENBQTRDLEVBQUU7Z0JBRXpFLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSwwQkFBMEI7b0JBQ3JHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUU3QyxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDaEwsa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLE9BQU8sR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2xMLGtCQUFjLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxRQUFRLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFO2dCQUVwTCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO2dCQUN2RSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBdk1ELGdEQXVNQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
