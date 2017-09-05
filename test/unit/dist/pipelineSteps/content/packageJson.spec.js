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
 * Tests for PackageJson.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const packageConfiguration_1 = require("../../../../../dist/configuration/models/packages/packageConfiguration");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const packageJson_1 = require("../../../../../dist/pipelineSteps/content/packageJson");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("PackageJson", () => {
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
        uniteConfigurationStub.packageName = "test";
        uniteConfigurationStub.license = "MIT";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new packageJson_1.PackageJson();
        Chai.should().exist(obj);
    });
    describe("influences", () => {
        it("can be called and return influences", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageJson_1.PackageJson();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(0);
        }));
    });
    describe("initialise", () => {
        it("can fail when exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "fileExists").throws("error");
            const obj = new packageJson_1.PackageJson();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can setup the engine configuration", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageJson_1.PackageJson();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("PackageJson")).to.be.deep.equal({
                name: "test",
                version: "0.0.1",
                license: "MIT",
                devDependencies: {},
                dependencies: {},
                engines: { node: ">=8.0.0" }
            });
        }));
    });
    describe("process", () => {
        it("can fail if an exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageJson_1.PackageJson();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can write file", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new packageJson_1.PackageJson();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");
            const json = yield fileSystemMock.fileReadJson("./test/unit/temp/www/", "package.json");
            Chai.expect(json.name).to.be.equal("test");
            Chai.expect(json.version).to.be.equal("0.0.1");
            Chai.expect(json.dependencies).to.be.deep.equal({});
            Chai.expect(json.devDependencies).to.be.deep.equal({});
            Chai.expect(json.engines).to.be.deep.equal({ node: ">=8.0.0" });
        }));
        it("can combine with existing file", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const initjson = new packageConfiguration_1.PackageConfiguration();
            initjson.name = "fred";
            initjson.version = "1.0.0";
            initjson.dependencies = { "my-package": "1.0.1", "a-package": "1.0.1" };
            initjson.devDependencies = { "dev-package": "2.0.2", "a-dev-package": "2.0.2" };
            initjson.engines = { "my-engine": "3.0.0" };
            yield fileSystemMock.fileWriteJson("./test/unit/temp/www/", "package.json", initjson);
            const obj = new packageJson_1.PackageJson();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");
            const json = yield fileSystemMock.fileReadJson("./test/unit/temp/www/", "package.json");
            Chai.expect(json.name).to.be.equal("fred");
            Chai.expect(json.version).to.be.equal("1.0.0");
            Chai.expect(json.dependencies).to.be.deep.equal({ "my-package": "1.0.1", "a-package": "1.0.1" });
            Chai.expect(json.devDependencies).to.be.deep.equal({ "a-dev-package": "2.0.2", "dev-package": "2.0.2" });
            Chai.expect(json.engines).to.be.deep.equal({ "my-engine": "3.0.0", node: ">=8.0.0" });
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9jb250ZW50L3BhY2thZ2VKc29uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQixpSEFBOEc7QUFDOUcsMEdBQXVHO0FBQ3ZHLGdGQUE2RTtBQUM3RSx1RkFBb0Y7QUFDcEYsMkRBQXVEO0FBRXZELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDcEIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGFBQTZCLENBQUM7SUFDbEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLHNCQUEwQyxDQUFDO0lBQy9DLElBQUksbUJBQW9DLENBQUM7SUFFekMsVUFBVSxDQUFDO1FBQ1AsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDN0IsYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxjQUFjLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFDdEMsc0JBQXNCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ2xELHNCQUFzQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDNUMsc0JBQXNCLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUV2QyxtQkFBbUIsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztR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Q0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDekcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvcGFja2FnZUpzb24uc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFBhY2thZ2VKc29uLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZGlzdC9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2Rpc3QvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQYWNrYWdlSnNvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9kaXN0L3BpcGVsaW5lU3RlcHMvY29udGVudC9wYWNrYWdlSnNvblwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiUGFja2FnZUpzb25cIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGxvZ2dlckluZm9TcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGZpbGVTeXN0ZW1Nb2NrOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJJbmZvU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJpbmZvXCIpO1xuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgZmlsZVN5c3RlbU1vY2sgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5wYWNrYWdlTmFtZSA9IFwidGVzdFwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmxpY2Vuc2UgPSBcIk1JVFwiO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtTW9jaywgXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VKc29uKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiaW5mbHVlbmNlc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCBhbmQgcmV0dXJuIGluZmx1ZW5jZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VKc29uKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmouaW5mbHVlbmNlcygpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzLmxlbmd0aCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJpbml0aWFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGV4Y2VwdGlvbiBpcyB0aHJvd25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVFeGlzdHNcIikudGhyb3dzKFwiZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlSnNvbigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLmNvbnRhaW5zKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzZXR1cCB0aGUgZW5naW5lIGNvbmZpZ3VyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VKc29uKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uKFwiUGFja2FnZUpzb25cIikpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwidGVzdFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IFwiMC4wLjFcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIGRldkRlcGVuZGVuY2llczoge30sXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiB7fSxcbiAgICAgICAgICAgICAgICBlbmdpbmVzOiB7IG5vZGU6IFwiPj04LjAuMFwiIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicHJvY2Vzc1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93blwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS5jb250YWlucyhcImZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gd3JpdGUgZmlsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlSnNvbigpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkuY29udGFpbnMoXCJHZW5lcmF0aW5nXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZVJlYWRKc29uPFBhY2thZ2VDb25maWd1cmF0aW9uPihcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGpzb24ubmFtZSkudG8uYmUuZXF1YWwoXCJ0ZXN0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi52ZXJzaW9uKS50by5iZS5lcXVhbChcIjAuMC4xXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi5kZXBlbmRlbmNpZXMpLnRvLmJlLmRlZXAuZXF1YWwoe30pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi5kZXZEZXBlbmRlbmNpZXMpLnRvLmJlLmRlZXAuZXF1YWwoe30pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi5lbmdpbmVzKS50by5iZS5kZWVwLmVxdWFsKHsgbm9kZTogXCI+PTguMC4wXCIgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbWJpbmUgd2l0aCBleGlzdGluZyBmaWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRqc29uID0gbmV3IFBhY2thZ2VDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICBpbml0anNvbi5uYW1lID0gXCJmcmVkXCI7XG4gICAgICAgICAgICBpbml0anNvbi52ZXJzaW9uID0gXCIxLjAuMFwiO1xuICAgICAgICAgICAgaW5pdGpzb24uZGVwZW5kZW5jaWVzID0geyBcIm15LXBhY2thZ2VcIjogXCIxLjAuMVwiLCBcImEtcGFja2FnZVwiOiBcIjEuMC4xXCIgfTtcbiAgICAgICAgICAgIGluaXRqc29uLmRldkRlcGVuZGVuY2llcyA9IHsgXCJkZXYtcGFja2FnZVwiOiBcIjIuMC4yXCIsIFwiYS1kZXYtcGFja2FnZVwiOiBcIjIuMC4yXCIgfTtcbiAgICAgICAgICAgIGluaXRqc29uLmVuZ2luZXMgPSB7IFwibXktZW5naW5lXCI6IFwiMy4wLjBcIiB9O1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZVdyaXRlSnNvbihcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiLCBcInBhY2thZ2UuanNvblwiLCBpbml0anNvbik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlSnNvbigpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkuY29udGFpbnMoXCJHZW5lcmF0aW5nXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZVJlYWRKc29uPFBhY2thZ2VDb25maWd1cmF0aW9uPihcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGpzb24ubmFtZSkudG8uYmUuZXF1YWwoXCJmcmVkXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi52ZXJzaW9uKS50by5iZS5lcXVhbChcIjEuMC4wXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi5kZXBlbmRlbmNpZXMpLnRvLmJlLmRlZXAuZXF1YWwoeyBcIm15LXBhY2thZ2VcIjogXCIxLjAuMVwiLCBcImEtcGFja2FnZVwiOiBcIjEuMC4xXCIgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChqc29uLmRldkRlcGVuZGVuY2llcykudG8uYmUuZGVlcC5lcXVhbCh7IFwiYS1kZXYtcGFja2FnZVwiOiBcIjIuMC4yXCIsIFwiZGV2LXBhY2thZ2VcIjogXCIyLjAuMlwiIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoanNvbi5lbmdpbmVzKS50by5iZS5kZWVwLmVxdWFsKHsgXCJteS1lbmdpbmVcIjogXCIzLjAuMFwiLCBub2RlOiBcIj49OC4wLjBcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
