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
 * Tests for AppScaffold.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../../dist/engine/engineVariables");
const appScaffold_1 = require("../../../../../dist/pipelineSteps/scaffold/appScaffold");
const fileSystem_mock_1 = require("../../fileSystem.mock");
describe("AppScaffold", () => {
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
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new appScaffold_1.AppScaffold();
        Chai.should().exist(obj);
    });
    describe("finalise", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new appScaffold_1.AppScaffold();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.directoryExists("./test/unit/temp/www/src");
            Chai.expect(exists).to.be.equal(true);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9zY2FmZm9sZC9hcHBTY2FmZm9sZC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IseUdBQXNHO0FBQ3RHLCtFQUE0RTtBQUM1RSx1RkFBb0Y7QUFDcEYsMkRBQXVEO0FBRXZELFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksc0JBQTBDLENBQUM7SUFDL0MsSUFBSSxtQkFBb0MsQ0FBQztJQUV6QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3QixjQUFjLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFDdEMsc0JBQXNCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBRWxELG1CQUFtQixHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQzVDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNqQixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEIsTUFBTSxjQUFjLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsR0FBUyxFQUFFO1lBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO1lBQzlCLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsZUFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDaEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL2FwcFNjYWZmb2xkLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBBcHBTY2FmZm9sZC5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IEFwcFNjYWZmb2xkIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL2FwcFNjYWZmb2xkXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi8uLi9maWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJBcHBTY2FmZm9sZFwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbU1vY2s6IElGaWxlU3lzdGVtO1xuICAgIGxldCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IGVuZ2luZVZhcmlhYmxlc1N0dWI6IEVuZ2luZVZhcmlhYmxlcztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbU1vY2sgPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1YiA9IG5ldyBVbml0ZUNvbmZpZ3VyYXRpb24oKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLnNldHVwRGlyZWN0b3JpZXMoZmlsZVN5c3RlbU1vY2ssIFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBhd2FpdCBmaWxlU3lzdGVtTW9jay5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBBcHBTY2FmZm9sZCgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZpbmFsaXNlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBBcHBTY2FmZm9sZCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmRpcmVjdG9yeUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyY1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
