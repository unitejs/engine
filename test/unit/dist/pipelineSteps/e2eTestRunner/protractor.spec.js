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
 * Tests for Protractor.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const protractor_1 = require("../../../../../dist/pipelineSteps/e2eTestRunner/protractor");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("Protractor", () => {
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
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new protractor_1.Protractor();
        Chai.should().exist(obj);
    });
    describe("mainCondition", () => {
        it("can be called with not matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new protractor_1.Protractor();
            uniteConfigurationStub.e2eTestRunner = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        }));
        it("can be called with matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new protractor_1.Protractor();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        }));
    });
    describe("initialise", () => {
        it("can setup the engine configuration when mainCondition is not set", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new protractor_1.Protractor();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Protractor")).to.be.equal(undefined);
        }));
        it("can setup the engine configuration", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new protractor_1.Protractor();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Protractor")).not.to.be.equal(undefined);
        }));
    });
    describe("configure", () => {
        it("can be called with no configurations", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new protractor_1.Protractor();
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.protractor).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["webdriver-manager"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal("1.2.3");
        }));
        it("can be called with configurations", () => __awaiter(this, void 0, void 0, function* () {
            engineVariablesStub.setConfiguration("ESLint", { plugins: [], env: {} });
            const obj = new protractor_1.Protractor();
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("ESLint").env.protractor).to.be.equal(true);
        }));
        it("can be called with no configurations with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new protractor_1.Protractor();
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = {
                protractor: "1.2.3",
                "webdriver-manager": "1.2.3",
                "browser-sync": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.protractor).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["webdriver-manager"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal(undefined);
        }));
        it("can be called with configurations with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            engineVariablesStub.setConfiguration("ESLint", { env: { protractor: true } });
            const obj = new protractor_1.Protractor();
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        }));
    });
    describe("finalise", () => {
        it("can succeed writing", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new protractor_1.Protractor();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/", "protractor.conf.js");
            Chai.expect(exists).to.be.equal(true);
        }));
        it("can be called with no configurations with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            yield fileSystemMock.fileWriteText("./test/unit/temp/www/", "protractor.conf.js", "Generated by UniteJS");
            const obj = new protractor_1.Protractor();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/", "protractor.conf.js");
            Chai.expect(exists).to.be.equal(false);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9lMmVUZXN0UnVubmVyL3Byb3RyYWN0b3Iuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBSS9CLHlHQUFzRztBQUN0RywrRUFBNEU7QUFDNUUsMEZBQXVGO0FBQ3ZGLDJEQUF1RDtBQUV2RCxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLHNCQUEwQyxDQUFDO0lBQy9DLElBQUksbUJBQW9DLENBQUM7SUFFekMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFN0IsY0FBYyxHQUFHLElBQUksZ0NBQWMsRUFBRSxDQUFDO1FBQ3RDLHNCQUFzQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUNsRCxzQkFBc0IsQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBRXBELG1CQUFtQixHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQzVDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pFLG1CQUFtQixDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMs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LENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci9wcm90cmFjdG9yLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBQcm90cmFjdG9yLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgRXNMaW50Q29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFByb3RyYWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL3BpcGVsaW5lU3RlcHMvZTJlVGVzdFJ1bm5lci9wcm90cmFjdG9yXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi8uLi9maWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJQcm90cmFjdG9yXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtTW9jazogSUZpbGVTeXN0ZW07XG4gICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvblN0dWI6IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgZW5naW5lVmFyaWFibGVzU3R1YjogRW5naW5lVmFyaWFibGVzO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtTW9jayA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmUyZVRlc3RSdW5uZXIgPSBcIlByb3RyYWN0b3JcIjtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLnNldHVwRGlyZWN0b3JpZXMoZmlsZVN5c3RlbU1vY2ssIFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5maW5kRGVwZW5kZW5jeVZlcnNpb24gPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKFwiMS4yLjNcIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgUHJvdHJhY3RvcigpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm1haW5Db25kaXRpb25cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBub3QgbWF0Y2hpbmcgY29uZGl0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQcm90cmFjdG9yKCk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmUyZVRlc3RSdW5uZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoubWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBtYXRjaGluZyBjb25kaXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFByb3RyYWN0b3IoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImluaXRpYWxpc2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBzZXR1cCB0aGUgZW5naW5lIGNvbmZpZ3VyYXRpb24gd2hlbiBtYWluQ29uZGl0aW9uIGlzIG5vdCBzZXRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFByb3RyYWN0b3IoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uKFwiUHJvdHJhY3RvclwiKSkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc2V0dXAgdGhlIGVuZ2luZSBjb25maWd1cmF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQcm90cmFjdG9yKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uKFwiUHJvdHJhY3RvclwiKSkubm90LnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjb25maWd1cmVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBubyBjb25maWd1cmF0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUHJvdHJhY3RvcigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvbmZpZ3VyZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnByb3RyYWN0b3IpLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcIndlYmRyaXZlci1tYW5hZ2VyXCJdKS50by5iZS5lcXVhbChcIjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXNbXCJicm93c2VyLXN5bmNcIl0pLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGNvbmZpZ3VyYXRpb25zXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0Q29uZmlndXJhdGlvbihcIkVTTGludFwiLCB7IHBsdWdpbnM6IFtdLCBlbnY6IHt9IH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUHJvdHJhY3RvcigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvbmZpZ3VyZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmdldENvbmZpZ3VyYXRpb248RXNMaW50Q29uZmlndXJhdGlvbj4oXCJFU0xpbnRcIikuZW52LnByb3RyYWN0b3IpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBubyBjb25maWd1cmF0aW9ucyB3aXRoIGZhbHNlIG1haW5Db25kaXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFByb3RyYWN0b3IoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb25maWd1cmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvcjogXCIxLjIuM1wiLFxuICAgICAgICAgICAgICAgIFwid2ViZHJpdmVyLW1hbmFnZXJcIjogXCIxLjIuM1wiLFxuICAgICAgICAgICAgICAgIFwiYnJvd3Nlci1zeW5jXCI6IFwiMS4yLjNcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMucHJvdHJhY3RvcikudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW1wid2ViZHJpdmVyLW1hbmFnZXJcIl0pLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImJyb3dzZXItc3luY1wiXSkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggY29uZmlndXJhdGlvbnMgd2l0aCBmYWxzZSBtYWluQ29uZGl0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0Q29uZmlndXJhdGlvbihcIkVTTGludFwiLCB7IGVudjogIHsgcHJvdHJhY3RvcjogdHJ1ZX0gfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQcm90cmFjdG9yKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29uZmlndXJlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmluYWxpc2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdyaXRpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUHJvdHJhY3RvcigpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcblxuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiLCBcInByb3RyYWN0b3IuY29uZi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIGNvbmZpZ3VyYXRpb25zIHdpdGggZmFsc2UgbWFpbkNvbmRpdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9cIik7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvXCIsIFwicHJvdHJhY3Rvci5jb25mLmpzXCIsIFwiR2VuZXJhdGVkIGJ5IFVuaXRlSlNcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQcm90cmFjdG9yKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9cIiwgXCJwcm90cmFjdG9yLmNvbmYuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
