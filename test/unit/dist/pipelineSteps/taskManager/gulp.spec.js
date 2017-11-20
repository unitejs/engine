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
 * Tests for Gulp.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const gulp_1 = require("../../../../../dist/pipelineSteps/taskManager/gulp");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("Gulp", () => {
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
        uniteConfigurationStub.taskManager = "Gulp";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.bundler = "RequireJS";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "PostCss";
        uniteConfigurationStub.cssLinter = "StyleLint";
        uniteConfigurationStub.documentor = "ESDoc";
        uniteConfigurationStub.server = "BrowserSync";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new gulp_1.Gulp();
        Chai.should().exist(obj);
    });
    describe("mainCondition", () => {
        it("can be called with not matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new gulp_1.Gulp();
            uniteConfigurationStub.taskManager = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        }));
        it("can be called with matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new gulp_1.Gulp();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        }));
    });
    describe("intitialise", () => {
        it("can succeed", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new gulp_1.Gulp();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        }));
    });
    describe("configure", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new gulp_1.Gulp();
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.gulp).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.del).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["gulp-util"]).to.be.equal("1.2.3");
        }));
        it("can be called with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new gulp_1.Gulp();
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = {
                gulp: "1.2.3",
                del: "1.2.3",
                "browser-sync": "1.2.3",
                "gulp-util": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.gulp).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["gulp-util"]).to.be.equal(undefined);
        }));
    });
    describe("finalise", () => {
        it("can be called with so that files are deleted", () => __awaiter(this, void 0, void 0, function* () {
            uniteConfigurationStub.unitTestRunner = "None";
            const obj = new gulp_1.Gulp();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        }));
        it("can be called with failing file operations", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "fileWriteText").rejects();
            const obj = new gulp_1.Gulp();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        }));
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new gulp_1.Gulp();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        }));
        it("can be called with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/build/tasks");
            yield fileSystemMock.fileWriteText("./test/unit/temp/build/tasks", "build.js", "Generated by UniteJS");
            const obj = new gulp_1.Gulp();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/build/tasks", "build.js");
            Chai.expect(exists).to.be.equal(false);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy90YXNrTWFuYWdlci9ndWxwLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQix5R0FBc0c7QUFDdEcsK0VBQTRFO0FBQzVFLDRFQUF5RTtBQUN6RSwyREFBdUQ7QUFFdkQsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDbEIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxzQkFBMEMsQ0FBQztJQUMvQyxJQUFJLG1CQUFvQyxDQUFDO0lBRXpDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztRQUN0QyxzQkFBc0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDbEQsc0JBQXNCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUM1QyxzQkFBc0IsQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO1FBQ2hELHNCQUFzQixDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDcEQsc0JBQXNCLENBQUMsY0FBYyxHQUFHLFlBQVksQ0FBQztRQUNyRCxzQkFBc0IsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBQzdDLHNCQUFzQixDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDMUMsc0JBQXNCLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUN6QyxzQkFBc0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RDLHNCQUFzQixDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7UUFDM0Msc0JBQXNCLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztRQUMvQyxzQkFBc0IsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzVDLHNCQUFzQixDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7UUFFOUMsbUJBQW1CLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDNUMsbUJBQW1CLENBQUMsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO1FBQ3JELG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pFLG1CQUFtQixDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixNQUFNLGNBQWMsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBUyxFQUFFO1lBQ3ZELE1BQU0sR0FBRyxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7WUFDdkIsc0JBQXNCLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUMvQyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDM0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQVMsRUFBRTtZQUNuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxhQUFhLEVBQUUsR0FBUyxFQUFFO1lBQ3pCLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7WUFDdkIsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN2QixFQUFFLENBQUMsZUFBZSxFQUFFLEdBQVMsRUFBRTtZQUMzQixNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9HLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEMsTUFBTSwwQkFBMEIsR0FBNkIsRUFBRSxDQUFDO1lBQ2hFLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFTLEVBQUU7WUFDcEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUN2QixNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoSCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhDLE1BQU0sMEJBQTBCLEdBQTZCO2dCQUN6RCxJQUFJLEVBQUUsT0FBTztnQkFDYixHQUFHLEVBQUUsT0FBTztnQkFDWixjQUFjLEVBQUUsT0FBTztnQkFDdkIsV0FBVyxFQUFFLE9BQU87YUFDdkIsQ0FBQztZQUNGLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7UUFDdEIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQVMsRUFBRTtZQUMxRCxzQkFBc0IsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDO1lBQy9DLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7WUFDdkIsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEcsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQVMsRUFBRTtZQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4RCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BHLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxlQUFlLEVBQUUsR0FBUyxFQUFFO1lBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7WUFDdkIsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEcsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLEdBQVMsRUFBRTtZQUNwRCxNQUFNLGNBQWMsQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUNyRSxNQUFNLGNBQWMsQ0FBQyxhQUFhLENBQUMsOEJBQThCLEVBQUUsVUFBVSxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFFdkcsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUN2QixNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhDLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxrQ0FBa0MsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMvRixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdGFza01hbmFnZXIvZ3VscC5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgR3VscC5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IEd1bHAgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL3BpcGVsaW5lU3RlcHMvdGFza01hbmFnZXIvZ3VscFwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiR3VscFwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbU1vY2s6IElGaWxlU3lzdGVtO1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IGVuZ2luZVZhcmlhYmxlc1N0dWI6IEVuZ2luZVZhcmlhYmxlcztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbU1vY2sgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi50YXNrTWFuYWdlciA9IFwiR3VscFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnVuaXRUZXN0UnVubmVyID0gXCJLYXJtYVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmUyZVRlc3RSdW5uZXIgPSBcIlByb3RyYWN0b3JcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5zb3VyY2VMYW5ndWFnZSA9IFwiSmF2YVNjcmlwdFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmJ1bmRsZXIgPSBcIlJlcXVpcmVKU1wiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLm1vZHVsZVR5cGUgPSBcIkFNRFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmxpbnRlciA9IFwiRVNMaW50XCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuY3NzUHJlID0gXCJDc3NcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jc3NQb3N0ID0gXCJQb3N0Q3NzXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuY3NzTGludGVyID0gXCJTdHlsZUxpbnRcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5kb2N1bWVudG9yID0gXCJFU0RvY1wiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnNlcnZlciA9IFwiQnJvd3NlclN5bmNcIjtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmVuZ2luZUFzc2V0c0ZvbGRlciA9IFwiLi9hc3NldHMvXCI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtTW9jaywgXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmZpbmREZXBlbmRlbmN5VmVyc2lvbiA9IHNhbmRib3guc3R1YigpLnJldHVybnMoXCIxLjIuM1wiKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBHdWxwKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwibWFpbkNvbmRpdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vdCBtYXRjaGluZyBjb25kaXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEd1bHAoKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudGFza01hbmFnZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoubWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBtYXRjaGluZyBjb25kaXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEd1bHAoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImludGl0aWFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR3VscCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNvbmZpZ3VyZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR3VscCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvbmZpZ3VyZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLmd1bHApLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5kZWwpLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImJyb3dzZXItc3luY1wiXSkudG8uYmUuZXF1YWwoXCIxLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW1wiZ3VscC11dGlsXCJdKS50by5iZS5lcXVhbChcIjEuMi4zXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBmYWxzZSBtYWluQ29uZGl0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBHdWxwKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29uZmlndXJlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAgICAgICAgICAgICAgIGd1bHA6IFwiMS4yLjNcIixcbiAgICAgICAgICAgICAgICBkZWw6IFwiMS4yLjNcIixcbiAgICAgICAgICAgICAgICBcImJyb3dzZXItc3luY1wiOiBcIjEuMi4zXCIsXG4gICAgICAgICAgICAgICAgXCJndWxwLXV0aWxcIjogXCIxLjIuM1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5idWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llcy5ndWxwKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMuZGVsKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXNbXCJicm93c2VyLXN5bmNcIl0pLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImd1bHAtdXRpbFwiXSkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbmFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggc28gdGhhdCBmaWxlcyBhcmUgZGVsZXRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnVuaXRUZXN0UnVubmVyID0gXCJOb25lXCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR3VscCgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGZhaWxpbmcgZmlsZSBvcGVyYXRpb25zXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlV3JpdGVUZXh0XCIpLnJlamVjdHMoKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBHdWxwKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBHdWxwKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZmFsc2UgbWFpbkNvbmRpdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL2J1aWxkL3Rhc2tzXCIpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvYnVpbGQvdGFza3NcIiwgXCJidWlsZC5qc1wiLCBcIkdlbmVyYXRlZCBieSBVbml0ZUpTXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR3VscCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvYnVpbGQvdGFza3NcIiwgXCJidWlsZC5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
