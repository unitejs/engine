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
 * Tests for Stylus.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const stylus_1 = require("../../../../../dist/pipelineSteps/cssPre/stylus");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("Stylus", () => {
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
        uniteConfigurationStub.cssPre = "Stylus";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new stylus_1.Stylus();
        Chai.should().exist(obj);
    });
    describe("mainCondition", () => {
        it("can be called with not matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new stylus_1.Stylus();
            uniteConfigurationStub.cssPre = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        }));
        it("can be called with matching condition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new stylus_1.Stylus();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        }));
    });
    describe("initialise", () => {
        it("can setup the engine configuration", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new stylus_1.Stylus();
            const res = yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.styleExtension).to.be.equal("styl");
        }));
    });
    describe("configure", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new stylus_1.Stylus();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.stylus).to.be.equal("1.2.3");
        }));
        it("can be called with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new stylus_1.Stylus();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            const res = yield obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const packageJsonDevDependencies = { stylus: "1.2.3" };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.stylus).to.be.equal(undefined);
        }));
    });
    describe("finalise", () => {
        it("can fail if an exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemMock, "directoryCreate").throws("error");
            const obj = new stylus_1.Stylus();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        }));
        it("can create dirs", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new stylus_1.Stylus();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.directoryExists("./test/unit/temp/www/stylus");
            Chai.expect(exists).to.be.equal(true);
        }));
        it("can delete dirs with false mainCondition", () => __awaiter(this, void 0, void 0, function* () {
            yield fileSystemMock.directoryCreate("./test/unit/temp/www/stylus");
            const obj = new stylus_1.Stylus();
            yield obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.directoryExists("./test/unit/temp/www/stylus");
            Chai.expect(exists).to.be.equal(false);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9jc3NQcmUvc3R5bHVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQix5R0FBc0c7QUFDdEcsK0VBQTRFO0FBQzVFLDJFQUF3RTtBQUN4RSwyREFBdUQ7QUFFdkQsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDcEIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksc0JBQTBDLENBQUM7SUFDL0MsSUFBSSxtQkFBb0MsQ0FBQztJQUV6QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFbEQsY0FBYyxHQUFHLElBQUksZ0NBQWMsRUFBRSxDQUFDO1FBQ3RDLHNCQUFzQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUNsRCxzQkFBc0IsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBRXpDLG1CQUFtQixHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQzVDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pFLG1CQUFtQixDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxJQUFJ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QUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFTLEVBQUU7WUFDdEQsTUFBTSxjQUFjLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFFcEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUN6QixNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyRyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhDLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jc3NQcmUvc3R5bHVzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBTdHlsdXMuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBTdHlsdXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL3BpcGVsaW5lU3RlcHMvY3NzUHJlL3N0eWx1c1wiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiU3R5bHVzXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGZpbGVTeXN0ZW1Nb2NrOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG5cbiAgICAgICAgZmlsZVN5c3RlbU1vY2sgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jc3NQcmUgPSBcIlN0eWx1c1wiO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtTW9jaywgXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmZpbmREZXBlbmRlbmN5VmVyc2lvbiA9IHNhbmRib3guc3R1YigpLnJldHVybnMoXCIxLjIuM1wiKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBTdHlsdXMoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJtYWluQ29uZGl0aW9uXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm90IG1hdGNoaW5nIGNvbmRpdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgU3R5bHVzKCk7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmNzc1ByZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG1hdGNoaW5nIGNvbmRpdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgU3R5bHVzKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoubWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImluaXRpYWxpc2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBzZXR1cCB0aGUgZW5naW5lIGNvbmZpZ3VyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFN0eWx1cygpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlQ29uZmlndXJhdGlvblN0dWIuc3R5bGVFeHRlbnNpb24pLnRvLmJlLmVxdWFsKFwic3R5bFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNvbmZpZ3VyZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgU3R5bHVzKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29uZmlndXJlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIuYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXMuc3R5bHVzKS50by5iZS5lcXVhbChcIjEuMi4zXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBmYWxzZSBtYWluQ29uZGl0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBTdHlsdXMoKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29uZmlndXJlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0geyBzdHlsdXM6IFwiMS4yLjNcIn07XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLmJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzLnN0eWx1cykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbmFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJkaXJlY3RvcnlDcmVhdGVcIikudGhyb3dzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgU3R5bHVzKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLmNvbnRhaW5zKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBjcmVhdGUgZGlyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlDcmVhdGUoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBTdHlsdXMoKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zdHlsdXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBkZWxldGUgZGlycyB3aXRoIGZhbHNlIG1haW5Db25kaXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5Q3JlYXRlKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvc3R5bHVzXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgU3R5bHVzKCk7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuXG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zdHlsdXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
