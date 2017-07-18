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
class PlainApp extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.applicationFramework === "PlainApp") {
                let ret = yield this.generateApp(logger, display, fileSystem, uniteConfiguration, engineVariables);
                if (ret === 0) {
                    ret = yield this.generateE2eTest(logger, display, fileSystem, uniteConfiguration, engineVariables);
                    if (ret === 0) {
                        ret = yield this.generateUnitTest(logger, display, fileSystem, uniteConfiguration, engineVariables);
                        if (ret === 0) {
                            ret = yield this.generateCss(logger, display, fileSystem, uniteConfiguration, engineVariables);
                        }
                    }
                }
                return ret;
            }
            return 0;
        });
    }
    generateApp(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                uniteConfiguration.applicationFramework.toLowerCase() +
                "/src/" +
                uniteConfiguration.sourceLanguage.toLowerCase());
            try {
                _super("log").call(this, logger, display, "Generating Main in", { appSourceFolder: engineVariables.srcFolder });
                yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "main." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "main." + engineVariables.sourceLanguageExt);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating Main failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Generating EntryPoint in", { appSourceFolder: engineVariables.srcFolder });
                yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "entryPoint." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "entryPoint." + engineVariables.sourceLanguageExt);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating EntryPoint failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
            try {
                yield this.copyFile(logger, display, fileSystem, scaffoldFolder, "app." + engineVariables.sourceLanguageExt, engineVariables.srcFolder, "app." + engineVariables.sourceLanguageExt);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating App failed", err, { appSourceFolder: engineVariables.srcFolder });
                return 1;
            }
        });
    }
    generateUnitTest(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating unit test scaffold", { unitTestSrcFolder: engineVariables.unitTestSrcFolder });
                    const unitTestsScaffold = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                        uniteConfiguration.applicationFramework.toLowerCase() +
                        "/test/unit/src/sourceLanguage/" +
                        uniteConfiguration.sourceLanguage.toLowerCase() + "/" +
                        uniteConfiguration.unitTestFramework.toLowerCase() + "/");
                    const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                        uniteConfiguration.applicationFramework.toLowerCase() +
                        "/test/unit/src/moduleType/" +
                        uniteConfiguration.moduleType.toLowerCase() + "/");
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, "main.spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestSrcFolder, "main.spec." + engineVariables.sourceLanguageExt);
                    yield this.copyFile(logger, display, fileSystem, unitTestsScaffold, "app.spec." + engineVariables.sourceLanguageExt, engineVariables.unitTestSrcFolder, "app.spec." + engineVariables.sourceLanguageExt);
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
    generateE2eTest(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.e2eTestRunner !== "None") {
                try {
                    _super("log").call(this, logger, display, "Generating e2e test scaffold", { unitTestSrcFolder: engineVariables.e2eTestSrcFolder });
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
                    yield this.copyFile(logger, display, fileSystem, e2eTestsScaffold, "app.spec." + engineVariables.sourceLanguageExt, engineVariables.e2eTestSrcFolder, "app.spec." + engineVariables.sourceLanguageExt);
                    yield this.copyFile(logger, display, fileSystem, e2eTestsScaffoldRunner, "e2e-bootstrap.js", engineVariables.e2eTestFolder, "e2e-bootstrap.js");
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
                _super("log").call(this, logger, display, "Generating application css scaffold");
                const assetCssFolder = fileSystem.pathCombine(engineVariables.assetsDirectory, "appFramework/" +
                    uniteConfiguration.applicationFramework.toLowerCase() +
                    "/css/" +
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
exports.PlainApp = PlainApp;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3BsYWluQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxnRkFBNkU7QUFNN0UsY0FBc0IsU0FBUSwrQ0FBc0I7SUFDbkMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7O1lBQ3RKLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFbkcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztvQkFFbkcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUVwRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUNuRyxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1lB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LEVBQUUsZUFBZTtvQkFDZixrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUU7b0JBQ3JELE9BQU87b0JBQ1Asa0JBQWtCLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBRXhILGtCQUFjLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLFlBQVksRUFBRSxNQUFNLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFO2dCQUNoTCxrQkFBYyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbEwsa0JBQWMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLFFBQVEsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7Z0JBRXBMLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFwS0QsNEJBb0tDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvcGxhaW5BcHAuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
