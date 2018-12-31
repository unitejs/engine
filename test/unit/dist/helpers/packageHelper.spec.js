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
        sandbox = Sinon.createSandbox();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvaGVscGVycy9wYWNrYWdlSGVscGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQix5RUFBc0U7QUFDdEUsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBRWhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2hDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0IsY0FBYyxHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFTLEVBQUU7WUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0QsTUFBTSxHQUFHLEdBQUcsTUFBTSw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQVMsRUFBRTtZQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5RSxNQUFNLEdBQUcsR0FBRyxNQUFNLDZCQUFhLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBUyxFQUFFO1lBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sR0FBRyxHQUFHLE1BQU0sNkJBQWEsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNsSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImhlbHBlcnMvcGFja2FnZUhlbHBlci5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgUGFja2FnZSBIZWxwZXJcbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VIZWxwZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2hlbHBlcnMvcGFja2FnZUhlbHBlclwiO1xuaW1wb3J0IHsgUmVhZE9ubHlGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9yZWFkT25seUZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5kZXNjcmliZShcIlBhY2thZ2VIZWxwZXJcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uY3JlYXRlU2FuZGJveCgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImxvY2F0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGNoaWxkIHRoYXQgZXhpc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJkaXJlY3RvcnlFeGlzdHNcIikucmVzb2x2ZXModHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBQYWNrYWdlSGVscGVyLmxvY2F0ZShmaWxlU3lzdGVtU3R1YiwgbG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCJibGFoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5jb250YWluKFwiYmxhaFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGFyZW50IHRoYXQgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImRpcmVjdG9yeUV4aXN0c1wiKS5vblNlY29uZENhbGwoKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IFBhY2thZ2VIZWxwZXIubG9jYXRlKGZpbGVTeXN0ZW1TdHViLCBsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcImJsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmNvbnRhaW4oXCJibGFoXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2hlbiBwYXJlbnQgb3IgY2hpbGQgZG8gbm90IGV4aXN0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJkaXJlY3RvcnlFeGlzdHNcIikucmVzb2x2ZXMoZmFsc2UpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgUGFja2FnZUhlbHBlci5sb2NhdGUoZmlsZVN5c3RlbVN0dWIsIGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiYmxhaFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwobnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
