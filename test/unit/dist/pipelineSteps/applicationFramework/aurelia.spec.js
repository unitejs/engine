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
 * Tests for Aurelia.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const aurelia_1 = require("../../../../../dist/pipelineSteps/applicationFramework/aurelia");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("Aurelia", () => {
    let sandbox;
    let loggerStub;
    let loggerInfoSpy;
    let loggerErrorSpy;
    let fileSystemMock;
    let uniteConfigurationStub;
    let engineVariablesStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
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
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.sourceLanguageExt = "js";
        engineVariablesStub.styleLanguageExt = "css";
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.createDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new aurelia_1.Aurelia();
        Chai.should().exist(obj);
    }));
    describe("prerequisites", () => {
        it("can be called with application framework not matching", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            uniteConfigurationStub.applicationFramework = "PlainApp";
            const res = yield obj.prerequisites(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        }));
        it("can be called with application framework matching but failing bundler", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            uniteConfigurationStub.bundler = "Browserify";
            const res = yield obj.prerequisites(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not currently support");
        }));
        it("can be called with application framework matching and working bundler", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.prerequisites(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        }));
    });
    describe("process", () => {
        it("can be called with application framework not matching", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            uniteConfigurationStub.applicationFramework = "PlainApp";
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.e2ePlugins["aurelia-protractor-plugin"]).to.be.equal(false);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-aurelia-webdriver-plugin"]).to.be.equal(false);
        }));
        it("can be called with application framework matching", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.e2ePlugins["aurelia-protractor-plugin"]).to.be.equal(true);
            Chai.expect(engineVariablesStub.e2ePlugins["unitejs-aurelia-webdriver-plugin"]).to.be.equal(false);
        }));
        it("can be called with AMD module type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            uniteConfigurationStub.moduleType = "AMD";
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDependencies = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            Chai.expect(uniteConfigurationStub.clientPackages["aurelia-bootstrapper"].main).to.be.equal("dist/amd/aurelia-bootstrapper.js");
            Chai.expect(packageJsonDependencies["aurelia-bootstrapper"]).to.be.equal("1.2.3");
        }));
        it("can be called with CommonJS module type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            uniteConfigurationStub.moduleType = "CommonJS";
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDependencies = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            Chai.expect(uniteConfigurationStub.clientPackages["aurelia-bootstrapper"].main).to.be.equal("dist/commonjs/aurelia-bootstrapper.js");
            Chai.expect(packageJsonDependencies["aurelia-bootstrapper"]).to.be.equal("1.2.3");
        }));
        it("can be called with SystemJS module type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new aurelia_1.Aurelia();
            uniteConfigurationStub.moduleType = "SystemJS";
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDependencies = {};
            engineVariablesStub.buildDependencies(uniteConfigurationStub, packageJsonDependencies);
            Chai.expect(uniteConfigurationStub.clientPackages["aurelia-bootstrapper"].main).to.be.equal("dist/system/aurelia-bootstrapper.js");
            Chai.expect(packageJsonDependencies["aurelia-bootstrapper"]).to.be.equal("1.2.3");
        }));
        it("can fail with no source", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            }));
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no html", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("html")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            }));
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no css", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("css")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            }));
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no e2e tests", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            }));
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no unit tests", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            }));
            const obj = new aurelia_1.Aurelia();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9hcHBsaWNhdGlvbkZyYW1ld29yay9hdXJlbGlhLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQiwwR0FBdUc7QUFDdkcsZ0ZBQTZFO0FBQzdFLDRGQUF5RjtBQUN6RiwyREFBdUQ7QUFFdkQsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNoQixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksYUFBNkIsQ0FBQztJQUNsQyxJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksc0JBQTBDLENBQUM7SUFDL0MsSUFBSSxtQkFBb0MsQ0FBQztJQUV6QyxVQUFVLENBQUM7UUFDUCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQztRQUM3QixhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEQsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELGNBQWMsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztRQUN0QyxzQkFBc0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDbEQsc0JBQXNCLENBQUMsb0JBQW9CLEdBQUcsU0FBUyxDQUFDO1FBQ3hELHNCQUFzQixDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDMUMsc0JBQXNCLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztRQUM3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QkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxnQ0FBYyxFQUFFLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEUsQ0FBQztZQUNMLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLG9DQUFvQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxxQ0FBcUMsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMvRixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvYXVyZWxpYS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgQXVyZWxpYS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9kaXN0L2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgQXVyZWxpYSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9kaXN0L3BpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvYXVyZWxpYVwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiQXVyZWxpYVwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgbG9nZ2VySW5mb1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgZmlsZVN5c3RlbU1vY2s6IElGaWxlU3lzdGVtO1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IGVuZ2luZVZhcmlhYmxlc1N0dWI6IEVuZ2luZVZhcmlhYmxlcztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlckluZm9TcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImluZm9cIik7XG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcblxuICAgICAgICBmaWxlU3lzdGVtTW9jayA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gXCJBdXJlbGlhXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIubW9kdWxlVHlwZSA9IFwiQU1EXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuYnVuZGxlciA9IFwiUmVxdWlyZUpTXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudW5pdFRlc3RSdW5uZXIgPSBcIkthcm1hXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudW5pdFRlc3RGcmFtZXdvcmsgPSBcIkphc21pbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lMmVUZXN0UnVubmVyID0gXCJQcm90cmFjdG9yXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuZTJlVGVzdEZyYW1ld29yayA9IFwiSmFzbWluZVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnNvdXJjZUxhbmd1YWdlID0gXCJKYXZhU2NyaXB0XCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIubGludGVyID0gXCJFU0xpbnRcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jc3NQcmUgPSBcIkNzc1wiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmNzc1Bvc3QgPSBcIk5vbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jbGllbnRQYWNrYWdlcyA9IHt9O1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc291cmNlTGFuZ3VhZ2VFeHQgPSBcImpzXCI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc3R5bGVMYW5ndWFnZUV4dCA9IFwiY3NzXCI7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuZW5naW5lQXNzZXRzRm9sZGVyID0gXCIuL2Fzc2V0cy9cIjtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5jcmVhdGVEaXJlY3RvcmllcyhmaWxlU3lzdGVtTW9jaywgXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmZpbmREZXBlbmRlbmN5VmVyc2lvbiA9IHNhbmRib3guc3R1YigpLnJldHVybnMoXCIxLjIuM1wiKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBBdXJlbGlhKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicHJlcmVxdWlzaXRlc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGFwcGxpY2F0aW9uIGZyYW1ld29yayBub3QgbWF0Y2hpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEF1cmVsaWEoKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuYXBwbGljYXRpb25GcmFtZXdvcmsgPSBcIlBsYWluQXBwXCI7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucHJlcmVxdWlzaXRlcyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhcHBsaWNhdGlvbiBmcmFtZXdvcmsgbWF0Y2hpbmcgYnV0IGZhaWxpbmcgYnVuZGxlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5idW5kbGVyID0gXCJCcm93c2VyaWZ5XCI7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucHJlcmVxdWlzaXRlcyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm5vdCBjdXJyZW50bHkgc3VwcG9ydFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYXBwbGljYXRpb24gZnJhbWV3b3JrIG1hdGNoaW5nIGFuZCB3b3JraW5nIGJ1bmRsZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEF1cmVsaWEoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcmVyZXF1aXNpdGVzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwcm9jZXNzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYXBwbGljYXRpb24gZnJhbWV3b3JrIG5vdCBtYXRjaGluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5hcHBsaWNhdGlvbkZyYW1ld29yayA9IFwiUGxhaW5BcHBcIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmUyZVBsdWdpbnNbXCJhdXJlbGlhLXByb3RyYWN0b3ItcGx1Z2luXCJdKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmUyZVBsdWdpbnNbXCJ1bml0ZWpzLWF1cmVsaWEtd2ViZHJpdmVyLXBsdWdpblwiXSkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhcHBsaWNhdGlvbiBmcmFtZXdvcmsgbWF0Y2hpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEF1cmVsaWEoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmUyZVBsdWdpbnNbXCJhdXJlbGlhLXByb3RyYWN0b3ItcGx1Z2luXCJdKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGVuZ2luZVZhcmlhYmxlc1N0dWIuZTJlUGx1Z2luc1tcInVuaXRlanMtYXVyZWxpYS13ZWJkcml2ZXItcGx1Z2luXCJdKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIEFNRCBtb2R1bGUgdHlwZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5tb2R1bGVUeXBlID0gXCJBTURcIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuY2xpZW50UGFja2FnZXNbXCJhdXJlbGlhLWJvb3RzdHJhcHBlclwiXS5tYWluKS50by5iZS5lcXVhbChcImRpc3QvYW1kL2F1cmVsaWEtYm9vdHN0cmFwcGVyLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXBlbmRlbmNpZXNbXCJhdXJlbGlhLWJvb3RzdHJhcHBlclwiXSkudG8uYmUuZXF1YWwoXCIxLjIuM1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggQ29tbW9uSlMgbW9kdWxlIHR5cGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEF1cmVsaWEoKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIubW9kdWxlVHlwZSA9IFwiQ29tbW9uSlNcIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmJ1aWxkRGVwZW5kZW5jaWVzKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuY2xpZW50UGFja2FnZXNbXCJhdXJlbGlhLWJvb3RzdHJhcHBlclwiXS5tYWluKS50by5iZS5lcXVhbChcImRpc3QvY29tbW9uanMvYXVyZWxpYS1ib290c3RyYXBwZXIuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llc1tcImF1cmVsaWEtYm9vdHN0cmFwcGVyXCJdKS50by5iZS5lcXVhbChcIjEuMi4zXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBTeXN0ZW1KUyBtb2R1bGUgdHlwZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5tb2R1bGVUeXBlID0gXCJTeXN0ZW1KU1wiO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uU3R1YiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jbGllbnRQYWNrYWdlc1tcImF1cmVsaWEtYm9vdHN0cmFwcGVyXCJdLm1haW4pLnRvLmJlLmVxdWFsKFwiZGlzdC9zeXN0ZW0vYXVyZWxpYS1ib290c3RyYXBwZXIuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRlcGVuZGVuY2llc1tcImF1cmVsaWEtYm9vdHN0cmFwcGVyXCJdKS50by5iZS5lcXVhbChcIjEuMi4zXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8gc291cmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRCaW5hcnlcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJqc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTeXN0ZW1Nb2NrKCkuZmlsZVJlYWRCaW5hcnkoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBodG1sXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRCaW5hcnlcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJodG1sXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZVN5c3RlbU1vY2soKS5maWxlUmVhZEJpbmFyeShkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBBdXJlbGlhKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucHJvY2Vzcyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmh0bWxcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGNzc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVSZWFkQmluYXJ5XCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmVuZHNXaXRoKFwiY3NzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZVN5c3RlbU1vY2soKS5maWxlUmVhZEJpbmFyeShkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBBdXJlbGlhKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucHJvY2Vzcyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmh0bWxcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyYy9jaGlsZC9cIiwgXCJjaGlsZC5jc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGUyZSB0ZXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVSZWFkQmluYXJ5XCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmVuZHNXaXRoKFwic3BlYy5qc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTeXN0ZW1Nb2NrKCkuZmlsZVJlYWRCaW5hcnkoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvc3JjL2NoaWxkL1wiLCBcImNoaWxkLmNzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC9lMmUvc3JjL1wiLCBcImFwcC5zcGVjLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyB1bml0IHRlc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRCaW5hcnlcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJzcGVjLmpzXCIpXG4gICAgICAgICAgICAgICAgICAgICYmIGRpcmVjdG9yeU5hbWUuaW5kZXhPZihcInVuaXRcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTeXN0ZW1Nb2NrKCkuZmlsZVJlYWRCaW5hcnkoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQXVyZWxpYSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC9lMmUvc3JjL1wiLCBcImFwcC5zcGVjLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy90ZXN0L3VuaXQvc3JjL1wiLCBcImFwcC5zcGVjLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
