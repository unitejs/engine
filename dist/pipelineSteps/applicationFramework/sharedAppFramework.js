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
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);
            try {
                _super("log").call(this, logger, display, "Generating App Source in", { appSourceFolder: engineVariables.srcFolder });
                for (let file of files) {
                    if (file.indexOf("!") >= 0) {
                        file = file.replace("!", ".");
                    }
                    else {
                        file += `.${engineVariables.sourceLanguageExt}`;
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
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/html/`);
            try {
                _super("log").call(this, logger, display, "Generating App HTML in", { appSourceFolder: engineVariables.srcFolder });
                for (const htmlFile of htmlFiles) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, `${htmlFile}.html`, engineVariables.srcFolder, `${htmlFile}.html`);
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
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/css/${uniteConfiguration.cssPre.toLowerCase()}/`);
            try {
                _super("log").call(this, logger, display, "Generating App CSS in", { appSourceFolder: engineVariables.srcFolder });
                for (const cssFile of cssFiles) {
                    yield this.copyFile(logger, display, fileSystem, scaffoldFolder, `${cssFile}.${engineVariables.styleLanguageExt}`, engineVariables.srcFolder, `${cssFile}.${engineVariables.styleLanguageExt}`);
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
                    const unitTestsScaffold = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                        `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);
                    const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);
                    for (const spec of specs) {
                        yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.unitTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`);
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
                    const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/test/e2e/src/e2eTestRunner/` +
                        `${uniteConfiguration.e2eTestRunner.toLowerCase()}/sourceLanguage/` +
                        `${uniteConfiguration.sourceLanguage.toLowerCase()}/${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);
                    const e2eTestsScaffoldRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/` +
                        `test/e2e/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}`);
                    for (const spec of specs) {
                        yield this.copyFile(logger, display, fileSystem, e2eTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.e2eTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`);
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
                const assetCssFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/css/${uniteConfiguration.cssPre.toLowerCase()}`);
                yield _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, `app.${engineVariables.styleLanguageExt}`, engineVariables.cssSrcFolder, `app.${engineVariables.styleLanguageExt}`);
                yield _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, `main.${engineVariables.styleLanguageExt}`, engineVariables.cssSrcFolder, `main.${engineVariables.styleLanguageExt}`);
                yield _super("copyFile").call(this, logger, display, fileSystem, assetCssFolder, `reset.${engineVariables.styleLanguageExt}`, engineVariables.cssSrcFolder, `reset.${engineVariables.styleLanguageExt}`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsZ0ZBQTZFO0FBRzdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsT0FBaUIsRUFDakIsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7OztZQUM3QyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFDdEMsZ0JBQWdCLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxRQUFRLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFOUssSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFFdkcsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxJQUFJLElBQUksZUFBZSxDQUFDLGlCQUFpQixFQUFFLENBQUM7b0JBQ3BELENBQUM7b0JBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUMzQixjQUFjLEVBQ2QsSUFBSSxFQUNKLGVBQWUsQ0FBQyxTQUFTLEVBQ3pC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O29CQUNySSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFZSxXQUFXLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQzdKLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSw0Q0FBNEMsRUFBRTtnQkFFekUsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsMkJBQTJCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRTVKLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLE9BQU8sZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDdEwsTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2dCQUN4TCxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBRTFMLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUE1TEQsZ0RBNExDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvc2hhcmVkQXBwRnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
