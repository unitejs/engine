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
 * Tests for PackageUtils.
 */
const Chai = require("chai");
const child = require("child_process");
const Sinon = require("sinon");
const packageUtils_1 = require("../../../../dist/pipelineSteps/packageUtils");
describe("PackageUtils", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerInfoSpy;
    let childSpawnStub;
    let childSpawnProcess;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        fileSystemStub = {};
        childSpawnStub = sandbox.stub(child, "spawn");
        childSpawnProcess = {
            stdout: {},
            stderr: {}
        };
        childSpawnProcess.on = () => { };
        childSpawnProcess.stdout.on = () => { };
        childSpawnProcess.stderr.on = () => { };
        childSpawnStub.returns(childSpawnProcess);
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
    }));
    it("can be created", () => {
        const obj = new packageUtils_1.PackageUtils();
        Chai.should().exist(obj);
    });
    describe("exec", () => {
        it("can be called with no working directory", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            const isWin = /^win/.test(process.platform);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal(`package${isWin ? ".cmd" : ""}`);
            Chai.expect(data).to.be.equal("");
        }));
        it("can be called with a working directory", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemStub.pathAbsolute = () => "/someplace/foo";
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", "foo", undefined);
            Chai.expect(data).to.be.equal("");
            const isWin = /^win/.test(process.platform);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal(`package${isWin ? ".cmd" : ""}`);
            Chai.expect(childSpawnStub.args[0][2].cwd).to.be.equal("/someplace/foo");
        }));
        it("can be called with a working directory and args", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemStub.pathAbsolute = () => "/someplace/foo";
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", "foo", ["arg1", "arg2"]);
            Chai.expect(data).to.be.equal("");
            const isWin = /^win/.test(process.platform);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal(`package${isWin ? ".cmd" : ""}`);
            Chai.expect(childSpawnStub.args[0][1]).to.contain("arg1");
            Chai.expect(childSpawnStub.args[0][1]).to.contain("arg2");
            Chai.expect(childSpawnStub.args[0][2].cwd).to.be.equal("/someplace/foo");
        }));
        it("can be called on non windows platform", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            packageUtils_1.PackageUtils.isWindows = false;
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal("package");
            Chai.expect(data).to.be.equal("");
        }));
        it("can be called on windows platform", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            packageUtils_1.PackageUtils.isWindows = true;
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(childSpawnStub.args[0][0]).to.be.equal("package.cmd");
            Chai.expect(data).to.be.equal("");
        }));
        it("can be called and exit with code 1", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(1);
                }
            };
            try {
                yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            }
            catch (err) {
                Chai.expect(err).to.be.equal(1);
            }
        }));
        it("can be called and return data", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stdout.on = (name, cb) => {
                cb("this");
                cb("is");
                cb("data");
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("thisisdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
        }));
        it("can be called with undefined data", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stdout.on = (name, cb) => {
                cb(undefined);
                cb("is");
                cb("data");
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("isdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
        }));
        it("can be called and had error and other data", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stderr.on = (name, cb) => {
                cb("this");
                cb("is");
                cb("error");
            };
            childSpawnProcess.stdout.on = (name, cb) => {
                cb("this");
                cb("is");
                cb("data");
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("thisisdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
            Chai.expect(loggerInfoSpy.args[3][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[4][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[5][0]).to.be.equal("error");
        }));
        it("can be called and had undefined error and other data", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "close") {
                    cb(0);
                }
            };
            childSpawnProcess.stderr.on = (name, cb) => {
                cb(undefined);
                cb("is");
                cb("error");
            };
            childSpawnProcess.stdout.on = (name, cb) => {
                cb("this");
                cb("is");
                cb("data");
            };
            const data = yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            Chai.expect(data).to.be.equal("thisisdata");
            Chai.expect(loggerInfoSpy.args[0][0]).to.be.equal("this");
            Chai.expect(loggerInfoSpy.args[1][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[2][0]).to.be.equal("data");
            Chai.expect(loggerInfoSpy.args[3][0]).to.be.equal("");
            Chai.expect(loggerInfoSpy.args[4][0]).to.be.equal("is");
            Chai.expect(loggerInfoSpy.args[5][0]).to.be.equal("error");
        }));
        it("can fail with spawn error", () => __awaiter(this, void 0, void 0, function* () {
            childSpawnProcess.on = (name, cb) => {
                if (name === "error") {
                    cb("error");
                }
            };
            try {
                yield packageUtils_1.PackageUtils.exec(loggerStub, fileSystemStub, "package", undefined, undefined);
            }
            catch (err) {
                Chai.expect(err).to.contain("error");
            }
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9wYWNrYWdlVXRpbHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsdUNBQXVDO0FBQ3ZDLCtCQUErQjtBQUcvQiw2RUFBMEU7QUFFMUUsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDMUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxhQUE2QixDQUFDO0lBQ2xDLElBQUksY0FBK0IsQ0FBQztJQUNwQyxJQUFJLGlCQUFzQixDQUFDO0lBRTNCLFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3QixjQUFjLEdBQWdCLEVBQUUsQ0FBQztRQUVqQyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFOUMsaUJBQWlCLEdBQUc7WUFDaEIsTUFBTSxFQUFFLEVBQUU7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNiLENBQUM7UUFDRixpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXhDLGNB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SSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxHQUFTLEVBQUU7WUFDdkMsaUJBQWlCLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQU8sRUFBRSxFQUFFO2dCQUM3QyxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7b0JBQ2xCLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDZjtZQUNMLENBQUMsQ0FBQztZQUVGLElBQUk7Z0JBQ0EsTUFBTSwyQkFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDeEY7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDeEM7UUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlscy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgUGFja2FnZVV0aWxzLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBjaGlsZCBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VVdGlscyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvcGlwZWxpbmVTdGVwcy9wYWNrYWdlVXRpbHNcIjtcblxuZGVzY3JpYmUoXCJQYWNrYWdlVXRpbHNcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VySW5mb1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGNoaWxkU3Bhd25TdHViOiBTaW5vbi5TaW5vblN0dWI7XG4gICAgbGV0IGNoaWxkU3Bhd25Qcm9jZXNzOiBhbnk7XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGZpbGVTeXN0ZW1TdHViID0gPElGaWxlU3lzdGVtPnt9O1xuXG4gICAgICAgIGNoaWxkU3Bhd25TdHViID0gc2FuZGJveC5zdHViKGNoaWxkLCBcInNwYXduXCIpO1xuXG4gICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzID0ge1xuICAgICAgICAgICAgc3Rkb3V0OiB7fSxcbiAgICAgICAgICAgIHN0ZGVycjoge31cbiAgICAgICAgfTtcbiAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAoKSA9PiB7IH07XG4gICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLnN0ZG91dC5vbiA9ICgpID0+IHsgfTtcbiAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Muc3RkZXJyLm9uID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGNoaWxkU3Bhd25TdHViLnJldHVybnMoY2hpbGRTcGF3blByb2Nlc3MpO1xuXG4gICAgICAgIGxvZ2dlckluZm9TcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImluZm9cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZVV0aWxzKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZXhlY1wiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHdvcmtpbmcgZGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgaXNXaW4gPSAvXndpbi8udGVzdChwcm9jZXNzLnBsYXRmb3JtKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMF0pLnRvLmJlLmVxdWFsKGBwYWNrYWdlJHtpc1dpbiA/IFwiLmNtZFwiIDogXCJcIn1gKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwiXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIHdvcmtpbmcgZGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLnBhdGhBYnNvbHV0ZSA9ICgpID0+IFwiL3NvbWVwbGFjZS9mb29cIjtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgXCJmb29cIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgaXNXaW4gPSAvXndpbi8udGVzdChwcm9jZXNzLnBsYXRmb3JtKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMF0pLnRvLmJlLmVxdWFsKGBwYWNrYWdlJHtpc1dpbiA/IFwiLmNtZFwiIDogXCJcIn1gKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMl0uY3dkKS50by5iZS5lcXVhbChcIi9zb21lcGxhY2UvZm9vXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIHdvcmtpbmcgZGlyZWN0b3J5IGFuZCBhcmdzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLnBhdGhBYnNvbHV0ZSA9ICgpID0+IFwiL3NvbWVwbGFjZS9mb29cIjtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgXCJmb29cIiwgW1wiYXJnMVwiLCBcImFyZzJcIl0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZGF0YSkudG8uYmUuZXF1YWwoXCJcIik7XG4gICAgICAgICAgICBjb25zdCBpc1dpbiA9IC9ed2luLy50ZXN0KHByb2Nlc3MucGxhdGZvcm0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY2hpbGRTcGF3blN0dWIuYXJnc1swXVswXSkudG8uYmUuZXF1YWwoYHBhY2thZ2Uke2lzV2luID8gXCIuY21kXCIgOiBcIlwifWApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY2hpbGRTcGF3blN0dWIuYXJnc1swXVsxXSkudG8uY29udGFpbihcImFyZzFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzFdKS50by5jb250YWluKFwiYXJnMlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMl0uY3dkKS50by5iZS5lcXVhbChcIi9zb21lcGxhY2UvZm9vXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgb24gbm9uIHdpbmRvd3MgcGxhdGZvcm1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBjYigwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBQYWNrYWdlVXRpbHMuaXNXaW5kb3dzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMF0pLnRvLmJlLmVxdWFsKFwicGFja2FnZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwiXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgb24gd2luZG93cyBwbGF0Zm9ybVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFBhY2thZ2VVdGlscy5pc1dpbmRvd3MgPSB0cnVlO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwicGFja2FnZVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChcInBhY2thZ2UuY21kXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZGF0YSkudG8uYmUuZXF1YWwoXCJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCBhbmQgZXhpdCB3aXRoIGNvZGUgMVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwicGFja2FnZVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBDaGFpLmV4cGVjdChlcnIpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgYW5kIHJldHVybiBkYXRhXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLnN0ZG91dC5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjYihcInRoaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJpc1wiKTtcbiAgICAgICAgICAgICAgICBjYihcImRhdGFcIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwicGFja2FnZVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChkYXRhKS50by5iZS5lcXVhbChcInRoaXNpc2RhdGFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMF1bMF0pLnRvLmJlLmVxdWFsKFwidGhpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkudG8uYmUuZXF1YWwoXCJpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1syXVswXSkudG8uYmUuZXF1YWwoXCJkYXRhXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgZGF0YVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5zdGRvdXQub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY2IodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBjYihcImlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiZGF0YVwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwiaXNkYXRhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChcIlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkudG8uYmUuZXF1YWwoXCJpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1syXVswXSkudG8uYmUuZXF1YWwoXCJkYXRhXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgYW5kIGhhZCBlcnJvciBhbmQgb3RoZXIgZGF0YVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5zdGRlcnIub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoXCJ0aGlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5zdGRvdXQub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoXCJ0aGlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJkYXRhXCIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZGF0YSkudG8uYmUuZXF1YWwoXCJ0aGlzaXNkYXRhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChcInRoaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMV1bMF0pLnRvLmJlLmVxdWFsKFwiaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMl1bMF0pLnRvLmJlLmVxdWFsKFwiZGF0YVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1szXVswXSkudG8uYmUuZXF1YWwoXCJ0aGlzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzRdWzBdKS50by5iZS5lcXVhbChcImlzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzVdWzBdKS50by5iZS5lcXVhbChcImVycm9yXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgYW5kIGhhZCB1bmRlZmluZWQgZXJyb3IgYW5kIG90aGVyIGRhdGFcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBjYigwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Muc3RkZXJyLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNiKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgY2IoXCJpc1wiKTtcbiAgICAgICAgICAgICAgICBjYihcImVycm9yXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLnN0ZG91dC5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjYihcInRoaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJpc1wiKTtcbiAgICAgICAgICAgICAgICBjYihcImRhdGFcIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwicGFja2FnZVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChkYXRhKS50by5iZS5lcXVhbChcInRoaXNpc2RhdGFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMF1bMF0pLnRvLmJlLmVxdWFsKFwidGhpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1sxXVswXSkudG8uYmUuZXF1YWwoXCJpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1syXVswXSkudG8uYmUuZXF1YWwoXCJkYXRhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzNdWzBdKS50by5iZS5lcXVhbChcIlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1s0XVswXSkudG8uYmUuZXF1YWwoXCJpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1s1XVswXSkudG8uYmUuZXF1YWwoXCJlcnJvclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIHNwYXduIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImVycm9yXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyKS50by5jb250YWluKFwiZXJyb3JcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
