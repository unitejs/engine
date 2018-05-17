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
        sandbox = Sinon.createSandbox();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9wYWNrYWdlVXRpbHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsdUNBQXVDO0FBQ3ZDLCtCQUErQjtBQUcvQiw2RUFBMEU7QUFFMUUsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDMUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxhQUE2QixDQUFDO0lBQ2xDLElBQUksY0FBK0IsQ0FBQztJQUNwQyxJQUFJLGlCQUFzQixDQUFDO0lBRTNCLFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNoQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTdCLGNBQWMsR0FBZ0IsRUFBRSxDQUFDO1FBRWpDLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU5QyxpQkFBaUIsR0FBRztZQUNoQixNQUFNLEVBQUUsRUFBRTtZQUNWLE1BQU0sRUFBRSxFQUFFO1NBQ2IsQ0FBQztRQUNGLGlCQUFpQixDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFeEMsY0FBYyxDQUFDLE9B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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEdBQVMsRUFBRTtZQUN2QyxpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBTyxFQUFFLEVBQUU7Z0JBQzdDLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtvQkFDbEIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNmO1lBQ0wsQ0FBQyxDQUFDO1lBRUYsSUFBSTtnQkFDQSxNQUFNLDJCQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN4RjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN4QztRQUNMLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGFja2FnZVV0aWxzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBQYWNrYWdlVXRpbHMuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIGNoaWxkIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlsc1wiO1xuXG5kZXNjcmliZShcIlBhY2thZ2VVdGlsc1wiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbVN0dWI6IElGaWxlU3lzdGVtO1xuICAgIGxldCBsb2dnZXJJbmZvU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgY2hpbGRTcGF3blN0dWI6IFNpbm9uLlNpbm9uU3R1YjtcbiAgICBsZXQgY2hpbGRTcGF3blByb2Nlc3M6IGFueTtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uY3JlYXRlU2FuZGJveCgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IDxJRmlsZVN5c3RlbT57fTtcblxuICAgICAgICBjaGlsZFNwYXduU3R1YiA9IHNhbmRib3guc3R1YihjaGlsZCwgXCJzcGF3blwiKTtcblxuICAgICAgICBjaGlsZFNwYXduUHJvY2VzcyA9IHtcbiAgICAgICAgICAgIHN0ZG91dDoge30sXG4gICAgICAgICAgICBzdGRlcnI6IHt9XG4gICAgICAgIH07XG4gICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKCkgPT4geyB9O1xuICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5zdGRvdXQub24gPSAoKSA9PiB7IH07XG4gICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLnN0ZGVyci5vbiA9ICgpID0+IHsgfTtcblxuICAgICAgICBjaGlsZFNwYXduU3R1Yi5yZXR1cm5zKGNoaWxkU3Bhd25Qcm9jZXNzKTtcblxuICAgICAgICBsb2dnZXJJbmZvU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJpbmZvXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VVdGlscygpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImV4ZWNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBubyB3b3JraW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IGlzV2luID0gL153aW4vLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChgcGFja2FnZSR7aXNXaW4gPyBcIi5jbWRcIiA6IFwiXCJ9YCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChkYXRhKS50by5iZS5lcXVhbChcIlwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSB3b3JraW5nIGRpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlU3lzdGVtU3R1Yi5wYXRoQWJzb2x1dGUgPSAoKSA9PiBcIi9zb21lcGxhY2UvZm9vXCI7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIFwiZm9vXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChkYXRhKS50by5iZS5lcXVhbChcIlwiKTtcbiAgICAgICAgICAgIGNvbnN0IGlzV2luID0gL153aW4vLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChgcGFja2FnZSR7aXNXaW4gPyBcIi5jbWRcIiA6IFwiXCJ9YCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzJdLmN3ZCkudG8uYmUuZXF1YWwoXCIvc29tZXBsYWNlL2Zvb1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSB3b3JraW5nIGRpcmVjdG9yeSBhbmQgYXJnc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlU3lzdGVtU3R1Yi5wYXRoQWJzb2x1dGUgPSAoKSA9PiBcIi9zb21lcGxhY2UvZm9vXCI7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIFwiZm9vXCIsIFtcImFyZzFcIiwgXCJhcmcyXCJdKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgaXNXaW4gPSAvXndpbi8udGVzdChwcm9jZXNzLnBsYXRmb3JtKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMF0pLnRvLmJlLmVxdWFsKGBwYWNrYWdlJHtpc1dpbiA/IFwiLmNtZFwiIDogXCJcIn1gKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGNoaWxkU3Bhd25TdHViLmFyZ3NbMF1bMV0pLnRvLmNvbnRhaW4oXCJhcmcxXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY2hpbGRTcGF3blN0dWIuYXJnc1swXVsxXSkudG8uY29udGFpbihcImFyZzJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzJdLmN3ZCkudG8uYmUuZXF1YWwoXCIvc29tZXBsYWNlL2Zvb1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIG9uIG5vbiB3aW5kb3dzIHBsYXRmb3JtXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUGFja2FnZVV0aWxzLmlzV2luZG93cyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwicGFja2FnZVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChjaGlsZFNwYXduU3R1Yi5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChcInBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChkYXRhKS50by5iZS5lcXVhbChcIlwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIG9uIHdpbmRvd3MgcGxhdGZvcm1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBjYigwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBQYWNrYWdlVXRpbHMuaXNXaW5kb3dzID0gdHJ1ZTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoY2hpbGRTcGF3blN0dWIuYXJnc1swXVswXSkudG8uYmUuZXF1YWwoXCJwYWNrYWdlLmNtZFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwiXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgYW5kIGV4aXQgd2l0aCBjb2RlIDFcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBjYigxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXJyKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIGFuZCByZXR1cm4gZGF0YVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5zdGRvdXQub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoXCJ0aGlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJkYXRhXCIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZGF0YSkudG8uYmUuZXF1YWwoXCJ0aGlzaXNkYXRhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChcInRoaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMV1bMF0pLnRvLmJlLmVxdWFsKFwiaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMl1bMF0pLnRvLmJlLmVxdWFsKFwiZGF0YVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIGRhdGFcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBjYigwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Muc3Rkb3V0Lm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNiKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgY2IoXCJpc1wiKTtcbiAgICAgICAgICAgICAgICBjYihcImRhdGFcIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwicGFja2FnZVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChkYXRhKS50by5iZS5lcXVhbChcImlzZGF0YVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1swXVswXSkudG8uYmUuZXF1YWwoXCJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMV1bMF0pLnRvLmJlLmVxdWFsKFwiaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMl1bMF0pLnRvLmJlLmVxdWFsKFwiZGF0YVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIGFuZCBoYWQgZXJyb3IgYW5kIG90aGVyIGRhdGFcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Mub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBjYigwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Muc3RkZXJyLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNiKFwidGhpc1wiKTtcbiAgICAgICAgICAgICAgICBjYihcImlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiZXJyb3JcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2hpbGRTcGF3blByb2Nlc3Muc3Rkb3V0Lm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNiKFwidGhpc1wiKTtcbiAgICAgICAgICAgICAgICBjYihcImlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiZGF0YVwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGRhdGEpLnRvLmJlLmVxdWFsKFwidGhpc2lzZGF0YVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1swXVswXSkudG8uYmUuZXF1YWwoXCJ0aGlzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzFdWzBdKS50by5iZS5lcXVhbChcImlzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzJdWzBdKS50by5iZS5lcXVhbChcImRhdGFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbM11bMF0pLnRvLmJlLmVxdWFsKFwidGhpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1s0XVswXSkudG8uYmUuZXF1YWwoXCJpc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1s1XVswXSkudG8uYmUuZXF1YWwoXCJlcnJvclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIGFuZCBoYWQgdW5kZWZpbmVkIGVycm9yIGFuZCBvdGhlciBkYXRhXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLm9uID0gKG5hbWU6IHN0cmluZywgY2I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcImNsb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNoaWxkU3Bhd25Qcm9jZXNzLnN0ZGVyci5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjYih1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIGNiKFwiaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5zdGRvdXQub24gPSAobmFtZTogc3RyaW5nLCBjYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgY2IoXCJ0aGlzXCIpO1xuICAgICAgICAgICAgICAgIGNiKFwiaXNcIik7XG4gICAgICAgICAgICAgICAgY2IoXCJkYXRhXCIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcInBhY2thZ2VcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZGF0YSkudG8uYmUuZXF1YWwoXCJ0aGlzaXNkYXRhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzBdWzBdKS50by5iZS5lcXVhbChcInRoaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMV1bMF0pLnRvLmJlLmVxdWFsKFwiaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMl1bMF0pLnRvLmJlLmVxdWFsKFwiZGF0YVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1szXVswXSkudG8uYmUuZXF1YWwoXCJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbNF1bMF0pLnRvLmJlLmVxdWFsKFwiaXNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbNV1bMF0pLnRvLmJlLmVxdWFsKFwiZXJyb3JcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBzcGF3biBlcnJvclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZFNwYXduUHJvY2Vzcy5vbiA9IChuYW1lOiBzdHJpbmcsIGNiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJlcnJvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCJwYWNrYWdlXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVycikudG8uY29udGFpbihcImVycm9yXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
