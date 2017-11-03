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
 * Tests for Less.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const less_1 = require("../../../../../dist/pipelineSteps/cssPre/less");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("Less", () => {
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
        uniteConfigurationStub.cssPre = "Less";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new less_1.Less();
        Chai.should().exist(obj);
    });
    describe("mainCondition", () => {
        it("can be called with not matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new less_1.Less();
            uniteConfigurationStub.cssPre = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        }));
        it("can be called with matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new less_1.Less();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        }));
    });
    describe("initialise", () => {
        it("can setup the engine configuration", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new less_1.Less();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.styleExtension).to.be.equal("less");
        }));
    });
    describe("configure", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new less_1.Less();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.less).to.be.equal("1.2.3");
        }));
        it("can be called with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new less_1.Less();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = { less: "1.2.3" };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.less).to.be.equal(undefined);
        }));
    });
    describe("finalise", () => {
        it("can fail if an exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "directoryCreate").throws("error");
            const obj = new less_1.Less();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can create dirs", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new less_1.Less();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.directoryExists("./test/unit/temp/www/less");
            Chai.expect(exists).to.be.equal(true);
        }));
        it("can delete dirs with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/less");
            const obj = new less_1.Less();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.directoryExists("./test/unit/temp/www/less");
            Chai.expect(exists).to.be.equal(false);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9jc3NQcmUvbGVzcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IseUdBQXNHO0FBQ3RHLCtFQUE0RTtBQUM1RSx1RUFBb0U7QUFDcEUsMkRBQXVEO0FBRXZELFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ2xCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLHNCQUEwQyxDQUFDO0lBQy9DLElBQUksbUJBQW9DLENBQUM7SUFFekMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELGNBQWMsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztRQUN0QyxzQkFBc0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDbEQsc0JBQXNCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUV2QyxtQkFBbUIsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUM1QyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN6RSxtQkFBbUIsQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUMsSUFBSSxF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LENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBUyxFQUFFO1lBQ3RELE1BQU0sY0FBYyxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBRWxFLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7WUFDdkIsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckcsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0csSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxlQUFlLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzUHJlL2xlc3Muc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIExlc3MuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBMZXNzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZS9sZXNzXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi8uLi9maWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJMZXNzXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGZpbGVTeXN0ZW1Nb2NrOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgZmlsZVN5c3RlbU1vY2sgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jc3NQcmUgPSBcIkxlc3NcIjtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLnNldHVwRGlyZWN0b3JpZXMoZmlsZVN5c3RlbU1vY2ssIFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5maW5kRGVwZW5kZW5jeVZlcnNpb24gPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKFwiMS4yLjNcIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgTGVzcygpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm1haW5Db25kaXRpb25cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBub3QgbWF0Y2hpbmcgY29uZGl0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBMZXNzKCk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmNzc1ByZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG1hdGNoaW5nIGNvbmRpdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgTGVzcygpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gb2JqLm1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJpbml0aWFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gc2V0dXAgdGhlIGVuZ2luZSBjb25maWd1cmF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBMZXNzKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uU3R1Yi5zdHlsZUV4dGVuc2lvbikudG8uYmUuZXF1YWwoXCJsZXNzXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiY29uZmlndXJlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBMZXNzKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29uZmlndXJlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMubGVzcykudG8uYmUuZXF1YWwoXCIxLjIuM1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZmFsc2UgbWFpbkNvbmRpdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgTGVzcygpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb25maWd1cmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7IGxlc3M6IFwiMS4yLjNcIn07XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLmxlc3MpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaW5hbGlzZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93blwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZGlyZWN0b3J5Q3JlYXRlXCIpLnRocm93cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IExlc3MoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkuY29udGFpbnMoXCJmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNyZWF0ZSBkaXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvd3d3L1wiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IExlc3MoKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9sZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZGVsZXRlIGRpcnMgd2l0aCBmYWxzZSBtYWluQ29uZGl0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXAvd3d3L2xlc3NcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBMZXNzKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9sZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
