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
 * Tests for SharedAppFramework.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const sharedAppFramework_1 = require("../../../../dist/pipelineSteps/sharedAppFramework");
const fileSystem_mock_1 = require("../fileSystem.mock");
class TestSharedAppFramework extends sharedAppFramework_1.SharedAppFramework {
    constructor() {
        super();
        this.customUnitTests = false;
        this.appModuleName = "app";
        this.htmlFiles = ["app.html"];
        this.appCssFiles = ["child/child"];
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`${this.appModuleName}.js`], false);
            if (ret === 0) {
                ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint.js`], true);
            }
            if (ret === 0) {
                ret = yield _super("generateAppHtml").call(this, logger, fileSystem, uniteConfiguration, engineVariables, this.htmlFiles);
            }
            if (ret === 0) {
                ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, this.appCssFiles);
            }
            if (ret === 0) {
                ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app.spec.js"]);
            }
            if (ret === 0) {
                ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`${this.appModuleName}.spec.js`], !this.customUnitTests);
            }
            if (ret === 0) {
                ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
            }
            return ret;
        });
    }
}
describe("SharedAppFramework", () => {
    let sandbox;
    let loggerStub;
    let fileSystemMock;
    let uniteConfigurationStub;
    let engineVariablesStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        fileSystemMock = new fileSystem_mock_1.FileSystemMock();
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "Aurelia";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.bundler = "RequireJS";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "None";
        uniteConfigurationStub.clientPackages = {};
        uniteConfigurationStub.sourceExtensions = ["js"];
        uniteConfigurationStub.styleExtension = "css";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new TestSharedAppFramework();
        Chai.should().exist(obj);
    }));
    describe("finalise", () => {
        it("can fail with no source", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no html", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("html")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no app css", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("css")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no e2e tests", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no unit tests", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no css", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.indexOf("reset") >= 0) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/cssSrc/", "reset.css");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can succeed with no unit test runner", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            uniteConfigurationStub.unitTestRunner = "None";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can succeed with no e2e test runner", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            uniteConfigurationStub.e2eTestRunner = "None";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can succeed with custom unit tests", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            obj.appModuleName = "app.module";
            obj.htmlFiles = [];
            obj.appCssFiles = [];
            obj.customUnitTests = true;
            uniteConfigurationStub.applicationFramework = "Angular";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
        }));
        it("can succeed", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/cssSrc/", "reset.css");
            Chai.expect(exists).to.be.equal(true);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9zaGFyZWRBcHBGcmFtZXdvcmsuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHNHQUFtRztBQUNuRyw0RUFBeUU7QUFDekUseUZBQXNGO0FBQ3RGLHdEQUFvRDtBQUVwRCw0QkFBNkIsU0FBUSx1Q0FBa0I7SUFNbkQ7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDNUosSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXJJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pILENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLEdBQUcsTUFBTSx5QkFBcUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0csQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsR0FBRyxNQUFNLHdCQUFvQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoSCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxHQUFHLE1BQU0seUJBQXFCLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2hILENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pKLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLEdBQUcsTUFBTSxxQkFBaUIsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzNGLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0NBQ0o7QUFFRCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksc0JBQTBDLENBQUM7SUFDL0MsSUFBSSxtQkFBb0MsQ0FBQztJQUV6QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3QixjQUFjLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFDdEMsc0JBQXNCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ2xELHNCQUFzQixDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztRQUN4RCxzQkFBc0IsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQzFDLHNCQUFzQixDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDN0Msc0JBQXNCLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztRQUNoRCxzQkFBc0IsQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7UUFDckQsc0JBQXNCLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztRQUNwRCxzQkFBc0IsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7UUFDcEQsc0JBQXNCLENBQUMsY0FBYyxHQUFHLFlBQVksQ0FBQztRQUNyRCxzQkFBc0IsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3pDLHNCQUFzQixDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdEMsc0JBQXNCLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN4QyxzQkFBc0IsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQzNDLHNCQUFzQixDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsc0JBQXNCLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUU5QyxtQkFBbUIsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUM1QyxtQkFBbUIsQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7UUFDckQsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDekUsbUJBQW1CLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRixDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDakIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLE1BQU0sY0FBYyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUSxFQUFFO1FBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtRQUN0QixFQUFFLENBQUMseUJBQXlCLEVBQUUsR0FBUyxFQUFFO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBTyxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUU7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxnQ0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztZQUNMLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFLEdBQVMsRUFBRTtZQUNuQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQU8sYUFBYSxFQUFFLFFBQVEsRUFBRSxFQUFFO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUksZ0NBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3RFLENBQUM7WUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLDJCQUEyQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBUyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBTyxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUU7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxnQ0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztZQUNMLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLGlDQUFpQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFTLEVBQUU7WUFDeEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFPLGFBQWEsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDN0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxJQUFJLGdDQUFjLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO1lBQ0wsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUVILE1BQU0sR0FBRyxHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztZQUN6QyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsb0NBQW9DLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDOUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEdBQVMsRUFBRTtZQUN6QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQU8sYUFBYSxFQUFFLFFBQVEsRUFBRSxFQUFFO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQzt1QkFDekIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxnQ0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztZQUNMLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsb0NBQW9DLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLHFDQUFxQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQy9GLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxHQUFTLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFPLGFBQWEsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDN0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxnQ0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztZQUNMLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMscUNBQXFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLDhCQUE4QixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFTLEVBQUU7WUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO1lBQ3pDLHNCQUFzQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7WUFDL0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMscUNBQXFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDckcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLEdBQVMsRUFBRTtZQUNqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7WUFDekMsc0JBQXNCLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztZQUM5QyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxvQ0FBb0MsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNwRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsR0FBUyxFQUFFO1lBQ2hELE1BQU0sR0FBRyxHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztZQUN6QyxHQUFHLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztZQUNqQyxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNuQixHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUNyQixHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUMzQixzQkFBc0IsQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7WUFFeEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDN0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGFBQWEsRUFBRSxHQUFTLEVBQUU7WUFDekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLDhCQUE4QixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9zaGFyZWRBcHBGcmFtZXdvcmsuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFNoYXJlZEFwcEZyYW1ld29yay5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFNoYXJlZEFwcEZyYW1ld29yayB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvcGlwZWxpbmVTdGVwcy9zaGFyZWRBcHBGcmFtZXdvcmtcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL2ZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5jbGFzcyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrIGV4dGVuZHMgU2hhcmVkQXBwRnJhbWV3b3JrIHtcbiAgICBwdWJsaWMgY3VzdG9tVW5pdFRlc3RzOiBib29sZWFuO1xuICAgIHB1YmxpYyBhcHBNb2R1bGVOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGh0bWxGaWxlczogc3RyaW5nW107XG4gICAgcHVibGljIGFwcENzc0ZpbGVzOiBzdHJpbmdbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmN1c3RvbVVuaXRUZXN0cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFwcE1vZHVsZU5hbWUgPSBcImFwcFwiO1xuICAgICAgICB0aGlzLmh0bWxGaWxlcyA9IFtcImFwcC5odG1sXCJdO1xuICAgICAgICB0aGlzLmFwcENzc0ZpbGVzID0gW1wiY2hpbGQvY2hpbGRcIl07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQXBwU291cmNlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtgJHt0aGlzLmFwcE1vZHVsZU5hbWV9LmpzYF0sIGZhbHNlKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQXBwU291cmNlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtgZW50cnlQb2ludC5qc2BdLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQXBwSHRtbChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB0aGlzLmh0bWxGaWxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcENzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB0aGlzLmFwcENzc0ZpbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlRTJlVGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHAuc3BlYy5qc1wiXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVW5pdFRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2Ake3RoaXMuYXBwTW9kdWxlTmFtZX0uc3BlYy5qc2BdLCAhdGhpcy5jdXN0b21Vbml0VGVzdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cblxuZGVzY3JpYmUoXCJTaGFyZWRBcHBGcmFtZXdvcmtcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1Nb2NrOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGZpbGVTeXN0ZW1Nb2NrID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIgPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuYXBwbGljYXRpb25GcmFtZXdvcmsgPSBcIkF1cmVsaWFcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5tb2R1bGVUeXBlID0gXCJBTURcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5idW5kbGVyID0gXCJSZXF1aXJlSlNcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi51bml0VGVzdFJ1bm5lciA9IFwiS2FybWFcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi51bml0VGVzdEZyYW1ld29yayA9IFwiSmFzbWluZVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmUyZVRlc3RSdW5uZXIgPSBcIlByb3RyYWN0b3JcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lMmVUZXN0RnJhbWV3b3JrID0gXCJKYXNtaW5lXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuc291cmNlTGFuZ3VhZ2UgPSBcIkphdmFTY3JpcHRcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5saW50ZXIgPSBcIkVTTGludFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmNzc1ByZSA9IFwiQ3NzXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuY3NzUG9zdCA9IFwiTm9uZVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmNsaWVudFBhY2thZ2VzID0ge307XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuc291cmNlRXh0ZW5zaW9ucyA9IFtcImpzXCJdO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnN0eWxlRXh0ZW5zaW9uID0gXCJjc3NcIjtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmVuZ2luZUFzc2V0c0ZvbGRlciA9IFwiLi9hc3NldHMvXCI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtTW9jaywgXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmZpbmREZXBlbmRlbmN5VmVyc2lvbiA9IHNhbmRib3guc3R1YigpLnJldHVybnMoXCIxLjIuM1wiKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaW5hbGlzZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBzb3VyY2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlUmVhZFRleHRcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJqc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTeXN0ZW1Nb2NrKCkuZmlsZVJlYWRUZXh0KGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyYy9cIiwgXCJhcHAuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGh0bWxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlUmVhZFRleHRcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJodG1sXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZVN5c3RlbU1vY2soKS5maWxlUmVhZFRleHQoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFNoYXJlZEFwcEZyYW1ld29yaygpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyYy9cIiwgXCJhcHAuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyYy9cIiwgXCJhcHAuaHRtbFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8gYXBwIGNzc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVSZWFkVGV4dFwiKTtcbiAgICAgICAgICAgIHN0dWIuY2FsbHNGYWtlKGFzeW5jIChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5lbmRzV2l0aChcImNzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTeXN0ZW1Nb2NrKCkuZmlsZVJlYWRUZXh0KGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmh0bWxcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyYy9jaGlsZC9cIiwgXCJjaGlsZC5jc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGUyZSB0ZXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVSZWFkVGV4dFwiKTtcbiAgICAgICAgICAgIHN0dWIuY2FsbHNGYWtlKGFzeW5jIChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5lbmRzV2l0aChcInNwZWMuanNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWxlU3lzdGVtTW9jaygpLmZpbGVSZWFkVGV4dChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvc3JjL2NoaWxkL1wiLCBcImNoaWxkLmNzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC9lMmUvc3JjL1wiLCBcImFwcC5zcGVjLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyB1bml0IHRlc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRUZXh0XCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmVuZHNXaXRoKFwic3BlYy5qc1wiKVxuICAgICAgICAgICAgICAgICAgICAmJiBkaXJlY3RvcnlOYW1lLmluZGV4T2YoXCJ1bml0XCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWxlU3lzdGVtTW9jaygpLmZpbGVSZWFkVGV4dChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC9lMmUvc3JjL1wiLCBcImFwcC5zcGVjLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy90ZXN0L3VuaXQvc3JjL1wiLCBcImFwcC5zcGVjLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBjc3NcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlUmVhZFRleHRcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuaW5kZXhPZihcInJlc2V0XCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWxlU3lzdGVtTW9jaygpLmZpbGVSZWFkVGV4dChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC91bml0L3NyYy9cIiwgXCJhcHAuc3BlYy5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvY3NzU3JjL1wiLCBcInJlc2V0LmNzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggbm8gdW5pdCB0ZXN0IHJ1bm5lclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFNoYXJlZEFwcEZyYW1ld29yaygpO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi51bml0VGVzdFJ1bm5lciA9IFwiTm9uZVwiO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC91bml0L3NyYy9cIiwgXCJhcHAuc3BlYy5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggbm8gZTJlIHRlc3QgcnVubmVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmUyZVRlc3RSdW5uZXIgPSBcIk5vbmVcIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3Rlc3QvZTJlL3NyYy9cIiwgXCJhcHAuc3BlYy5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggY3VzdG9tIHVuaXQgdGVzdHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgICAgIG9iai5hcHBNb2R1bGVOYW1lID0gXCJhcHAubW9kdWxlXCI7XG4gICAgICAgICAgICBvYmouaHRtbEZpbGVzID0gW107XG4gICAgICAgICAgICBvYmouYXBwQ3NzRmlsZXMgPSBbXTtcbiAgICAgICAgICAgIG9iai5jdXN0b21Vbml0VGVzdHMgPSB0cnVlO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5hcHBsaWNhdGlvbkZyYW1ld29yayA9IFwiQW5ndWxhclwiO1xuXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLm1vZHVsZS5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L2Nzc1NyYy9cIiwgXCJyZXNldC5jc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
