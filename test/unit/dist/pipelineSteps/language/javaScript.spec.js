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
 * Tests for JavaScript.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const babelConfiguration_1 = require("../../../../../dist/configuration/models/babel/babelConfiguration");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const javaScript_1 = require("../../../../../dist/pipelineSteps/language/javaScript");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("JavaScript", () => {
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
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new javaScript_1.JavaScript();
        Chai.should().exist(obj);
    }));
    describe("initialise", () => {
        it("can fail when exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "fileExists").throws("error");
            const obj = new javaScript_1.JavaScript();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can not setup the engine configuration if not JavaScript", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new javaScript_1.JavaScript();
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Babel")).to.be.equal(undefined);
        }));
        it("can setup the engine configuration", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new javaScript_1.JavaScript();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Babel")).to.be.deep.equal({
                presets: [],
                plugins: [],
                env: {}
            });
        }));
        it("can setup the engine configuration from existing", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ plugins: ["my-plugin"] });
            const obj = new javaScript_1.JavaScript();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Babel")).to.be.deep.equal({
                presets: [],
                plugins: ["my-plugin"],
                env: {}
            });
        }));
        it("can setup the engine configuration from existing not forced", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ plugins: ["my-plugin"] });
            engineVariablesStub.force = true;
            const obj = new javaScript_1.JavaScript();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Babel")).to.be.deep.equal({
                presets: [],
                plugins: [],
                env: {}
            });
        }));
    });
    describe("process", () => {
        it("can fail if an exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "fileWriteJson").throws("error");
            const obj = new javaScript_1.JavaScript();
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can delete file if not JavaScript", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileExists").returns(false);
            const obj = new javaScript_1.JavaScript();
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.called).to.be.equal(true);
            const packageJsonDevDependencies = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["babel-core"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["babel-preset-es2015"]).to.be.equal(undefined);
        }));
        it("can write file", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new javaScript_1.JavaScript();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");
            const json = yield fileSystemMock.fileReadJson("./test/unit/temp/www/", ".babelrc");
            Chai.expect(json.presets).to.be.deep.equal([]);
            const packageJsonDevDependencies = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["babel-core"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["babel-preset-es2015"]).to.be.equal("1.2.3");
        }));
        it("can combine with existing file", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const initjson = new babelConfiguration_1.BabelConfiguration();
            initjson.presets = ["preset1", "preset2"];
            yield fileSystemMock.fileWriteJson("./test/unit/temp/www/", ".babelrc", initjson);
            const obj = new javaScript_1.JavaScript();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = yield obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[1][0]).contains("Generating");
            const json = yield fileSystemMock.fileReadJson("./test/unit/temp/www/", ".babelrc");
            Chai.expect(json.presets).to.be.deep.equal(["preset1", "preset2"]);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9sYW5ndWFnZS9qYXZhU2NyaXB0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQiwwR0FBdUc7QUFDdkcsMEdBQXVHO0FBQ3ZHLGdGQUE2RTtBQUM3RSxzRkFBbUY7QUFDbkYsMkRBQXVEO0FBRXZELFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDbkIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGFBQTZCLENBQUM7SUFDbEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLHNCQUEwQyxDQUFDO0lBQy9DLElBQUksbUJBQW9DLENBQUM7SUFFekMsVUFBVSxDQUFDO1FBQ1AsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDN0IsYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxjQUFjLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFDdEMsc0JBQXNCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ2xELHNCQUFzQixDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUM7UUFFckQsbUJBQW1CLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDNUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFF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LENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xhbmd1YWdlL2phdmFTY3JpcHQuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEphdmFTY3JpcHQuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBCYWJlbENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZGlzdC9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9kaXN0L2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgSmF2YVNjcmlwdCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9kaXN0L3BpcGVsaW5lU3RlcHMvbGFuZ3VhZ2UvamF2YVNjcmlwdFwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiSmF2YVNjcmlwdFwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgbG9nZ2VySW5mb1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgZmlsZVN5c3RlbU1vY2s6IElGaWxlU3lzdGVtO1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IGVuZ2luZVZhcmlhYmxlc1N0dWI6IEVuZ2luZVZhcmlhYmxlcztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlckluZm9TcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImluZm9cIik7XG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcblxuICAgICAgICBmaWxlU3lzdGVtTW9jayA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnNvdXJjZUxhbmd1YWdlID0gXCJKYXZhU2NyaXB0XCI7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1YiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5zZXR1cERpcmVjdG9yaWVzKGZpbGVTeXN0ZW1Nb2NrLCBcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuZmluZERlcGVuZGVuY3lWZXJzaW9uID0gc2FuZGJveC5zdHViKCkucmV0dXJucyhcIjEuMi4zXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEphdmFTY3JpcHQoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJpbml0aWFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGV4Y2VwdGlvbiBpcyB0aHJvd25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVFeGlzdHNcIikudGhyb3dzKFwiZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBKYXZhU2NyaXB0KCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkuY29udGFpbnMoXCJmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIG5vdCBzZXR1cCB0aGUgZW5naW5lIGNvbmZpZ3VyYXRpb24gaWYgbm90IEphdmFTY3JpcHRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEphdmFTY3JpcHQoKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuc291cmNlTGFuZ3VhZ2UgPSBcIlR5cGVTY3JpcHRcIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmdldENvbmZpZ3VyYXRpb24oXCJCYWJlbFwiKSkudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc2V0dXAgdGhlIGVuZ2luZSBjb25maWd1cmF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBKYXZhU2NyaXB0KCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uKFwiQmFiZWxcIikpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIHByZXNldHM6IFtdLFxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtdLFxuICAgICAgICAgICAgICAgIGVudjoge31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzZXR1cCB0aGUgZW5naW5lIGNvbmZpZ3VyYXRpb24gZnJvbSBleGlzdGluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzID0gc2FuZGJveC5zdHViKCkub25GaXJzdENhbGwoKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1Nb2NrLmZpbGVSZWFkSnNvbiA9IHNhbmRib3guc3R1YigpLnJlc29sdmVzKHsgcGx1Z2luczogWyBcIm15LXBsdWdpblwiXSB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBKYXZhU2NyaXB0KCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uKFwiQmFiZWxcIikpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIHByZXNldHM6IFtdLFxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtcIm15LXBsdWdpblwiXSxcbiAgICAgICAgICAgICAgICBlbnY6IHt9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc2V0dXAgdGhlIGVuZ2luZSBjb25maWd1cmF0aW9uIGZyb20gZXhpc3Rpbmcgbm90IGZvcmNlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzID0gc2FuZGJveC5zdHViKCkub25GaXJzdENhbGwoKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1Nb2NrLmZpbGVSZWFkSnNvbiA9IHNhbmRib3guc3R1YigpLnJlc29sdmVzKHsgcGx1Z2luczogWyBcIm15LXBsdWdpblwiXSB9KTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuZm9yY2UgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEphdmFTY3JpcHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmdldENvbmZpZ3VyYXRpb24oXCJCYWJlbFwiKSkudG8uYmUuZGVlcC5lcXVhbCh7XG4gICAgICAgICAgICAgICAgcHJlc2V0czogW10sXG4gICAgICAgICAgICAgICAgcGx1Z2luczogW10sXG4gICAgICAgICAgICAgICAgZW52OiB7fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwcm9jZXNzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlV3JpdGVKc29uXCIpLnRocm93cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEphdmFTY3JpcHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS5jb250YWlucyhcImZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZGVsZXRlIGZpbGUgaWYgbm90IEphdmFTY3JpcHRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlRXhpc3RzXCIpLnJldHVybnMoZmFsc2UpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEphdmFTY3JpcHQoKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuc291cmNlTGFuZ3VhZ2UgPSBcIlR5cGVTY3JpcHRcIjtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5wcm9jZXNzKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChzdHViLmNhbGxlZCkudG8uYmUuZXF1YWwodHJ1ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImJhYmVsLWNvcmVcIl0pLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImJhYmVsLXByZXNldC1lczIwMTVcIl0pLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHdyaXRlIGZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgSmF2YVNjcmlwdCgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkuY29udGFpbnMoXCJHZW5lcmF0aW5nXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZVJlYWRKc29uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9cIiwgXCIuYmFiZWxyY1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGpzb24ucHJlc2V0cykudG8uYmUuZGVlcC5lcXVhbChbXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImJhYmVsLWNvcmVcIl0pLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tcImJhYmVsLXByZXNldC1lczIwMTVcIl0pLnRvLmJlLmVxdWFsKFwiMS4yLjNcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbWJpbmUgd2l0aCBleGlzdGluZyBmaWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGluaXRqc29uID0gbmV3IEJhYmVsQ29uZmlndXJhdGlvbigpO1xuICAgICAgICAgICAgaW5pdGpzb24ucHJlc2V0cyA9IFsgXCJwcmVzZXQxXCIsIFwicHJlc2V0MlwiIF07XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlV3JpdGVKc29uKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvXCIsIFwiLmJhYmVscmNcIiwgaW5pdGpzb24pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgSmF2YVNjcmlwdCgpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnByb2Nlc3MobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkuY29udGFpbnMoXCJHZW5lcmF0aW5nXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZVJlYWRKc29uPEJhYmVsQ29uZmlndXJhdGlvbj4oXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9cIiwgXCIuYmFiZWxyY1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGpzb24ucHJlc2V0cykudG8uYmUuZGVlcC5lcXVhbChbXCJwcmVzZXQxXCIsIFwicHJlc2V0MlwiXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=