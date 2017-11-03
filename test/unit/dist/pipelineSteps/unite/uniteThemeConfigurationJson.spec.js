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
 * Tests for UniteThemeConfigurationJson.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const uniteThemeConfigurationJson_1 = require("../../../../../dist/pipelineSteps/unite/uniteThemeConfigurationJson");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("UniteThemeConfigurationJson", () => {
    let sandbox;
    let loggerStub;
    let loggerErrorSpy;
    let fileSystemMock;
    let uniteConfigurationStub;
    let engineVariablesStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        fileSystemMock = new fileSystem_mock_1.FileSystemMock();
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        uniteConfigurationStub.title = "This Is My Title";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson();
        Chai.should().exist(obj);
    });
    describe("intitialise", () => {
        it("can fail when exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemMock.fileExists = sandbox.stub().throws("error");
            const obj = new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("UniteTheme")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can succeed when file does not exist and empty title", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemMock.fileExists = sandbox.stub().resolves(false);
            uniteConfigurationStub.title = undefined;
            const obj = new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("UniteTheme").themeColor).to.be.equal("#339933");
        }));
        it("can succeed when file does exist", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ themeColor: "#112211" });
            const obj = new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("UniteTheme").themeColor).to.be.equal("#112211");
            Chai.expect(engineVariablesStub.getConfiguration("UniteTheme").metaDescription).to.be.equal("This Is My Title");
            Chai.expect(engineVariablesStub.getConfiguration("UniteTheme").metaKeywords).to.be.deep.equal(["This", "Is", "My", "Title"]);
        }));
    });
    describe("finalise", () => {
        it("can fail writing", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "fileWriteJson").rejects("error");
            const obj = new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can succeed writing", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileWriteJson").resolves();
            const obj = new uniteThemeConfigurationJson_1.UniteThemeConfigurationJson();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.called).to.be.equal(true);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy91bml0ZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHlHQUFzRztBQUV0RywrRUFBNEU7QUFDNUUsb0hBQWlIO0FBQ2pILDJEQUF1RDtBQUV2RCxRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLHNCQUEwQyxDQUFDO0lBQy9DLElBQUksbUJBQW9DLENBQUM7SUFFekMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELGNBQWMsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztRQUN0QyxzQkFBc0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDbEQsc0JBQXNCLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO1FBRWxELG1CQUFtQixHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQzVDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFD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QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsR0FBUyxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RFLE1BQU0sR0FBRyxHQUFHLElBQUkseURBQTJCLEVBQUUsQ0FBQztZQUM5QyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdGUvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlVGhlbWUvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRlL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvblwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGZpbGVTeXN0ZW1Nb2NrOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgZmlsZVN5c3RlbU1vY2sgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi50aXRsZSA9IFwiVGhpcyBJcyBNeSBUaXRsZVwiO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtTW9jaywgXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbigpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImludGl0aWFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGV4Y2VwdGlvbiBpcyB0aHJvd25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyA9IHNhbmRib3guc3R1YigpLnRocm93cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGVuZ2luZVZhcmlhYmxlc1N0dWIuZ2V0Q29uZmlndXJhdGlvbihcIlVuaXRlVGhlbWVcIikpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS5jb250YWlucyhcImZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGZpbGUgZG9lcyBub3QgZXhpc3QgYW5kIGVtcHR5IHRpdGxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMgPSBzYW5kYm94LnN0dWIoKS5yZXNvbHZlcyhmYWxzZSk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnRpdGxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGVuZ2luZVZhcmlhYmxlc1N0dWIuZ2V0Q29uZmlndXJhdGlvbjxVbml0ZVRoZW1lQ29uZmlndXJhdGlvbj4oXCJVbml0ZVRoZW1lXCIpLnRoZW1lQ29sb3IpLnRvLmJlLmVxdWFsKFwiIzMzOTkzM1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGZpbGUgZG9lcyBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzID0gc2FuZGJveC5zdHViKCkub25GaXJzdENhbGwoKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1Nb2NrLmZpbGVSZWFkSnNvbiA9IHNhbmRib3guc3R1YigpLnJlc29sdmVzKHsgdGhlbWVDb2xvcjogXCIjMTEyMjExXCIgfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uPFVuaXRlVGhlbWVDb25maWd1cmF0aW9uPihcIlVuaXRlVGhlbWVcIikudGhlbWVDb2xvcikudG8uYmUuZXF1YWwoXCIjMTEyMjExXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZW5naW5lVmFyaWFibGVzU3R1Yi5nZXRDb25maWd1cmF0aW9uPFVuaXRlVGhlbWVDb25maWd1cmF0aW9uPihcIlVuaXRlVGhlbWVcIikubWV0YURlc2NyaXB0aW9uKS50by5iZS5lcXVhbChcIlRoaXMgSXMgTXkgVGl0bGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChlbmdpbmVWYXJpYWJsZXNTdHViLmdldENvbmZpZ3VyYXRpb248VW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24+KFwiVW5pdGVUaGVtZVwiKS5tZXRhS2V5d29yZHMpLnRvLmJlLmRlZXAuZXF1YWwoW1wiVGhpc1wiLCBcIklzXCIsIFwiTXlcIiwgXCJUaXRsZVwiXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaW5hbGlzZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd3JpdGluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVdyaXRlSnNvblwiKS5yZWplY3RzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLmNvbnRhaW5zKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdyaXRpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlV3JpdGVKc29uXCIpLnJlc29sdmVzKCk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcblxuICAgICAgICAgICAgQ2hhaS5leHBlY3Qoc3R1Yi5jYWxsZWQpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
