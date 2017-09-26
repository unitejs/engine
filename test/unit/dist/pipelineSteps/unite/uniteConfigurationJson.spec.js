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
 * Tests for UniteConfigurationJson.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const packageConfiguration_1 = require("../../../../../dist/configuration/models/packages/packageConfiguration");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const uniteConfigurationJson_1 = require("../../../../../dist/pipelineSteps/unite/uniteConfigurationJson");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("UniteConfigurationJson", () => {
    let sandbox;
    let loggerStub;
    let loggerInfoSpy;
    let loggerErrorSpy;
    let fileSystemMock;
    let uniteConfigurationStub;
    let engineVariablesStub;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        fileSystemMock = new fileSystem_mock_1.FileSystemMock();
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        uniteConfigurationStub.unitTestRunner = "None";
        uniteConfigurationStub.e2eTestRunner = "None";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        yield fileSystemMock.directoryCreate("./test/unit/temp");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new uniteConfigurationJson_1.UniteConfigurationJson();
        Chai.should().exist(obj);
    });
    describe("finalise", () => {
        it("can succeed", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new uniteConfigurationJson_1.UniteConfigurationJson();
            engineVariablesStub.enginePackageJson = new packageConfiguration_1.PackageConfiguration();
            engineVariablesStub.enginePackageJson.version = "1.2.3";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const json = yield fileSystemMock.fileReadJson("./test/unit/temp/", "unite.json");
            Chai.expect(json.uniteVersion).to.be.equal("1.2.3");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25Kc29uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQixpSEFBOEc7QUFDOUcsMEdBQXVHO0FBQ3ZHLGdGQUE2RTtBQUM3RSwyR0FBd0c7QUFDeEcsMkRBQXVEO0FBRXZELFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtJQUMvQixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksYUFBNkIsQ0FBQztJQUNsQyxJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksc0JBQTBDLENBQUM7SUFDL0MsSUFBSSxtQkFBb0MsQ0FBQztJQUV6QyxVQUFVLENBQUM7UUFDUCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQztRQUM3QixhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEQsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELGNBQWMsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztRQUN0QyxzQkFBc0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDbEQsc0JBQXNCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUMvQyxzQkFBc0IsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBRTlDLG1CQUFtQixHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQzVDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sY0FBYyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUM7UUFDTixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEIsTUFBTSxjQUFjLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNqQixNQUFNLEdBQUcsR0FBRyxJQUFJLCtDQUFzQixFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDakIsRUFBRSxDQUFDLGFBQWEsRUFBRTtZQUNkLE1BQU0sR0FBRyxHQUFHLElBQUksK0NBQXNCLEVBQUUsQ0FBQztZQUN6QyxtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLDJDQUFvQixFQUFFLENBQUM7WUFDbkUsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN4RCxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhDLE1BQU0sSUFBSSxHQUFHLE1BQU0sY0FBYyxDQUFDLFlBQVksQ0FBcUIsbUJBQW1CLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDdEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25Kc29uLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZGlzdC9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2Rpc3QvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb25Kc29uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2Rpc3QvcGlwZWxpbmVTdGVwcy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi8uLi9maWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJVbml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBsb2dnZXJJbmZvU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBmaWxlU3lzdGVtTW9jazogSUZpbGVTeXN0ZW07XG4gICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvblN0dWI6IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgZW5naW5lVmFyaWFibGVzU3R1YjogRW5naW5lVmFyaWFibGVzO1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VySW5mb1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiaW5mb1wiKTtcbiAgICAgICAgbG9nZ2VyRXJyb3JTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImVycm9yXCIpO1xuXG4gICAgICAgIGZpbGVTeXN0ZW1Nb2NrID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIgPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudW5pdFRlc3RSdW5uZXIgPSBcIk5vbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lMmVUZXN0UnVubmVyID0gXCJOb25lXCI7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1YiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5zZXR1cERpcmVjdG9yaWVzKGZpbGVTeXN0ZW1Nb2NrLCBcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uSnNvbigpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbmFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uSnNvbigpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5lbmdpbmVQYWNrYWdlSnNvbiA9IG5ldyBQYWNrYWdlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5lbmdpbmVQYWNrYWdlSnNvbi52ZXJzaW9uID0gXCIxLjIuM1wiO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlUmVhZEpzb248VW5pdGVDb25maWd1cmF0aW9uPihcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwidW5pdGUuanNvblwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGpzb24udW5pdGVWZXJzaW9uKS50by5iZS5lcXVhbChcIjEuMi4zXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
