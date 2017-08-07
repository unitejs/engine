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
    generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);
            try {
                logger.info("Generating App Source in", { appSourceFolder: engineVariables.srcFolder });
                for (let file of files) {
                    if (file.indexOf("!") >= 0) {
                        file = file.replace("!", ".");
                    }
                    else {
                        file += `.${engineVariables.sourceLanguageExt}`;
                    }
                    yield this.copyFile(logger, fileSystem, scaffoldFolder, file, engineVariables.srcFolder, file);
                }
                return 0;
            }
            catch (err) {
                logger.error("Generating App Source failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, htmlFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/html/`);
            try {
                logger.info("Generating App HTML in", { appSourceFolder: engineVariables.srcFolder });
                for (const htmlFile of htmlFiles) {
                    yield this.copyFile(logger, fileSystem, scaffoldFolder, `${htmlFile}.html`, engineVariables.srcFolder, `${htmlFile}.html`);
                }
                return 0;
            }
            catch (err) {
                logger.error("Generating App HTML failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, cssFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/css/${uniteConfiguration.cssPre.toLowerCase()}/`);
            try {
                logger.info("Generating App CSS in", { appSourceFolder: engineVariables.srcFolder });
                for (const cssFile of cssFiles) {
                    yield this.copyFile(logger, fileSystem, scaffoldFolder, `${cssFile}.${engineVariables.styleLanguageExt}`, engineVariables.srcFolder, `${cssFile}.${engineVariables.styleLanguageExt}`);
                }
                return 0;
            }
            catch (err) {
                logger.error("Generating CSS HTML failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, specs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner !== "None") {
                try {
                    logger.info("Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    const unitTestsScaffold = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                        `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);
                    const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);
                    for (const spec of specs) {
                        yield this.copyFile(logger, fileSystem, unitTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.unitTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`);
                    }
                    yield this.copyFile(logger, fileSystem, unitTestsScaffoldModuleType, "unit-bootstrap.js", engineVariables.unitTestFolder, "unit-bootstrap.js");
                    return 0;
                }
                catch (err) {
                    logger.error("Generating application unit test failed", err, { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    return 1;
                }
            }
            else {
                return 0;
            }
        });
    }
    generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, specs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.e2eTestRunner !== "None") {
                try {
                    logger.info("Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
                    const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/test/e2e/src/e2eTestRunner/` +
                        `${uniteConfiguration.e2eTestRunner.toLowerCase()}/sourceLanguage/` +
                        `${uniteConfiguration.sourceLanguage.toLowerCase()}/${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);
                    const e2eTestsScaffoldRunner = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/` +
                        `test/e2e/e2eTestRunner/${uniteConfiguration.e2eTestRunner.toLowerCase()}`);
                    for (const spec of specs) {
                        yield this.copyFile(logger, fileSystem, e2eTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.e2eTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`);
                    }
                    yield this.copyFile(logger, fileSystem, e2eTestsScaffoldRunner, "e2e-bootstrap.js", engineVariables.e2eTestFolder, "e2e-bootstrap.js");
                    if (uniteConfiguration.sourceLanguage === "TypeScript") {
                        yield this.copyFile(logger, fileSystem, e2eTestsScaffoldRunner, "e2e-bootstrap.d.ts", engineVariables.e2eTestFolder, "e2e-bootstrap.d.ts");
                    }
                    return 0;
                }
                catch (err) {
                    logger.error("Generating application e2e test failed", err, { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
                    return 1;
                }
            }
            else {
                return 0;
            }
        });
    }
    generateCss(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info("Generating application css scaffold shared", { cssSrcFolder: engineVariables.cssSrcFolder });
                const assetCssFolder = fileSystem.pathCombine(engineVariables.packageAssetsDirectory, `appFramework/shared/css/${uniteConfiguration.cssPre.toLowerCase()}`);
                yield _super("copyFile").call(this, logger, fileSystem, assetCssFolder, `app.${engineVariables.styleLanguageExt}`, engineVariables.cssSrcFolder, `app.${engineVariables.styleLanguageExt}`);
                yield _super("copyFile").call(this, logger, fileSystem, assetCssFolder, `main.${engineVariables.styleLanguageExt}`, engineVariables.cssSrcFolder, `main.${engineVariables.styleLanguageExt}`);
                yield _super("copyFile").call(this, logger, fileSystem, assetCssFolder, `reset.${engineVariables.styleLanguageExt}`, engineVariables.cssSrcFolder, `reset.${engineVariables.styleLanguageExt}`);
                return 0;
            }
            catch (err) {
                logger.error("Generating application css failed", err);
                return 1;
            }
        });
    }
}
exports.SharedAppFramework = SharedAppFramework;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsZ0ZBQTZFO0FBRzdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7O1lBQzdDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUN0QyxnQkFBZ0Isa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLFFBQVEsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU5SyxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFFeEYsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxJQUFJLElBQUksZUFBZSxDQUFDLGlCQUFpQixFQUFFLENBQUM7b0JBQ3BELENBQUM7b0JBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQ2xCLGNBQWMsRUFDZCxJQUFJLEVBQ0osZUFBZSxDQUFDLFNBQVMsRUFDekIsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7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Q0QsTUFBTSxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFFMUcsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsMkJBQTJCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRTVKLE1BQU0sa0JBQWMsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2dCQUM3SyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLFFBQVEsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDL0ssTUFBTSxrQkFBYyxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBRWpMLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBdkxELGdEQXVMQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
