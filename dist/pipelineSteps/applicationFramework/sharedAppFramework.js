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
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);
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
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/html/`);
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
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/css/${uniteConfiguration.cssPre.toLowerCase()}/`);
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
                    const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/shared/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                        `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);
                    const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);
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
                    const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/test/e2e/src/e2eTestRunner/` +
                        `${uniteConfiguration.e2eTestRunner.toLowerCase()}/sourceLanguage/` +
                        `${uniteConfiguration.sourceLanguage.toLowerCase()}/${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);
                    const e2eTestsScaffoldRunner = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/` +
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
                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, `appFramework/shared/css/${uniteConfiguration.cssPre.toLowerCase()}`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsZ0ZBQTZFO0FBRzdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsT0FBaUIsRUFDakIsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7OztZQUM3QyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQy9CLGdCQUFnQixrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTlLLElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBRXZHLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksSUFBSSxJQUFJLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUNwRCxDQUFDO29CQUNELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFDM0IsY0FBYyxFQUNkLElBQUksRUFDSixlQUFlLENBQUMsU0FBUyxFQUN6QixJ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QUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRWUsV0FBVyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUM3SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsNENBQTRDLEVBQUU7Z0JBRXpFLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSwyQkFBMkIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFckosTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2dCQUN0TCxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxRQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBQ3hMLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLFNBQVMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFFMUwsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtnQkFDdkUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTVMRCxnREE0TEMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9hcHBsaWNhdGlvbkZyYW1ld29yay9zaGFyZWRBcHBGcmFtZXdvcmsuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
