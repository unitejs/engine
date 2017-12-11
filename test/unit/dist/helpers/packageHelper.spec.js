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
 * Tests for Package Helper
 */
const Chai = require("chai");
const Sinon = require("sinon");
const packageHelper_1 = require("../../../../dist/helpers/packageHelper");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("PackageHelper", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };
        fileSystemStub = new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock();
    });
    describe("locate", () => {
        it("can be called with child that exists", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "directoryExists").resolves(true);
            const res = yield packageHelper_1.PackageHelper.locate(fileSystemStub, loggerStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "blah");
            Chai.expect(res).to.contain("blah");
        }));
        it("can be called with parent that does not exist", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "directoryExists").onSecondCall().resolves(true);
            const res = yield packageHelper_1.PackageHelper.locate(fileSystemStub, loggerStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "blah");
            Chai.expect(res).to.contain("blah");
        }));
        it("can be called when parent or child do not exist", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "directoryExists").resolves(false);
            const res = yield packageHelper_1.PackageHelper.locate(fileSystemStub, loggerStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "blah");
            Chai.expect(res).to.be.equal(null);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvaGVscGVycy9wYWNrYWdlSGVscGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQix5RUFBc0U7QUFDdEUsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBRWhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLGNBQWMsR0FBRyxJQUFJLGdEQUFzQixFQUFFLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUNwQixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBUyxFQUFFO1lBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9ELE1BQU0sR0FBRyxHQUFHLE1BQU0sNkJBQWEsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNsSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFTLEVBQUU7WUFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUUsTUFBTSxHQUFHLEdBQUcsTUFBTSw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQVMsRUFBRTtZQUM3RCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRSxNQUFNLEdBQUcsR0FBRyxNQUFNLDZCQUFhLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJoZWxwZXJzL3BhY2thZ2VIZWxwZXIuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFBhY2thZ2UgSGVscGVyXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlSGVscGVyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9oZWxwZXJzL3BhY2thZ2VIZWxwZXJcIjtcbmltcG9ydCB7IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vcmVhZE9ubHlGaWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJQYWNrYWdlSGVscGVyXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtU3R1YjogSUZpbGVTeXN0ZW07XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5iYW5uZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi53YXJuaW5nID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGZpbGVTeXN0ZW1TdHViID0gbmV3IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2soKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwibG9jYXRlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggY2hpbGQgdGhhdCBleGlzdHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImRpcmVjdG9yeUV4aXN0c1wiKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IFBhY2thZ2VIZWxwZXIubG9jYXRlKGZpbGVTeXN0ZW1TdHViLCBsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcImJsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmNvbnRhaW4oXCJibGFoXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXJlbnQgdGhhdCBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZGlyZWN0b3J5RXhpc3RzXCIpLm9uU2Vjb25kQ2FsbCgpLnJlc29sdmVzKHRydWUpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgUGFja2FnZUhlbHBlci5sb2NhdGUoZmlsZVN5c3RlbVN0dWIsIGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiYmxhaFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uY29udGFpbihcImJsYWhcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aGVuIHBhcmVudCBvciBjaGlsZCBkbyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImRpcmVjdG9yeUV4aXN0c1wiKS5yZXNvbHZlcyhmYWxzZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBQYWNrYWdlSGVscGVyLmxvY2F0ZShmaWxlU3lzdGVtU3R1YiwgbG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCJibGFoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChudWxsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
