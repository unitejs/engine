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
 * Tests for Engine.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const pipelineStepBase_1 = require("../../../../dist/engine/pipelineStepBase");
const fileSystem_mock_1 = require("../fileSystem.mock");
class TestPipelineStep extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [];
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(0);
        });
    }
}
describe("PipelineStepBase", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let uniteConfigurationStub;
    let engineVariablesStub;
    let loggerInfoSpy;
    let loggerErrorSpy;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        fileSystemStub = new fileSystem_mock_1.FileSystemMock();
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        engineVariablesStub = new engineVariables_1.EngineVariables();
        yield fileSystemStub.directoryCreate("./test/unit/temp");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemStub.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new TestPipelineStep();
        Chai.should().exist(obj);
    });
    describe("initialise", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            const res = yield obj.initialise(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        }));
    });
    describe("process", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            const res = yield obj.process(loggerStub, fileSystemStub, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        }));
    });
    describe("copyFile", () => {
        it("can be called when sourceFile does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            const res = yield obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("exist");
        }));
        it("can be called when destFile does not exist and destFolder does exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = yield obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = yield fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        }));
        it("can be called when destFile does not exist and destFolder does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            const res = yield obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/sub/", "destFile.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = yield fileSystemStub.fileReadText("./test/unit/temp/sub/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        }));
        it("can be called when destFile does exist with no marker", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "destFile.txt", "bar-foo");
            const res = yield obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Skipping");
            const newContent = yield fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("bar-foo");
        }));
        it("can be called when destFile does exist with marker", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "sourceFile.txt", "foo-bar");
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "destFile.txt", "bar-foo\nGenerated by UniteJS");
            const res = yield obj.copyFile(loggerStub, fileSystemStub, "./test/unit/temp/", "sourceFile.txt", "./test/unit/temp/", "destFile.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Copying");
            const newContent = yield fileSystemStub.fileReadText("./test/unit/temp/", "destFile.txt");
            Chai.expect(newContent).to.contain("foo-bar");
        }));
    });
    describe("deleteFile", () => {
        it("can be called when file does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            const res = yield obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
        }));
        it("can be called when file exists with no marker", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = yield obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Skipping");
        }));
        it("can be called when file exists with a marker", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = yield obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).to.contain("Deleting");
        }));
        it("can fail when file exists but it throws an error", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            sandbox.stub(fileSystemStub, "fileDelete").rejects("error");
            const res = yield obj.deleteFile(loggerStub, fileSystemStub, "./test/unit/temp/", "file.txt", false);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
    });
    describe("wrapGeneratedMarker", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            const res = obj.wrapGeneratedMarker("before", "after");
            Chai.expect(res).to.be.equal("beforeGenerated by UniteJSafter");
        }));
    });
    describe("fileHasGeneratedMarker", () => {
        it("can be called when file does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            const res = yield obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("FileNotExist");
        }));
        it("can be called when file does exist with no marker", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar");
            const res = yield obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("NoMarker");
        }));
        it("can be called when file does exist with a marker", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS");
            const res = yield obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("HasMarker");
        }));
        it("can be called when file does exist with a marker not on the last line", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS\n\n\n");
            const res = yield obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("HasMarker");
        }));
        it("can be called when file throws an error", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestPipelineStep();
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            yield fileSystemStub.fileWriteText("./test/unit/temp/", "file.txt", "foo-bar\nGenerated by UniteJS\n\n\n");
            const res = yield obj.fileHasGeneratedMarker(fileSystemStub, "./test/unit/temp/", "file.txt");
            Chai.expect(res).to.be.equal("FileNotExist");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL3BpcGVsaW5lU3RlcEJhc2Uuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHVHQUFvRztBQUNwRyw2RUFBMEU7QUFFMUUsK0VBQTRFO0FBQzVFLHdEQUFvRDtBQUVwRCxzQkFBdUIsU0FBUSxtQ0FBZ0I7SUFDcEMsVUFBVTtRQUNiLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNuSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO0tBQUE7Q0FDSjtBQUVELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUN6QixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLHNCQUEwQyxDQUFDO0lBQy9DLElBQUksbUJBQW9DLENBQUM7SUFDekMsSUFBSSxhQUE2QixDQUFDO0lBQ2xDLElBQUksY0FBOEIsQ0FBQztJQUVuQyxVQUFVLENBQUM7UUFDUCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQztRQUU3QixhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEQsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxELGNBQWMsR0FBRyxJ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QUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZW5naW5lL3BpcGVsaW5lU3RlcEJhc2Uuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEVuZ2luZS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9kaXN0L2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5cbmNsYXNzIFRlc3RQaXBlbGluZVN0ZXAgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwdWJsaWMgaW5mbHVlbmNlcygpOiBQaXBlbGluZUtleVtdIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoMCk7XG4gICAgfVxufVxuXG5kZXNjcmliZShcIlBpcGVsaW5lU3RlcEJhc2VcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG4gICAgbGV0IGxvZ2dlckluZm9TcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGxvZ2dlckluZm9TcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImluZm9cIik7XG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIgPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUNyZWF0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgYXdhaXQgZmlsZVN5c3RlbVN0dWIuZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFBpcGVsaW5lU3RlcCgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImluaXRpYWxpc2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbml0aWFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwcm9jZXNzXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0UGlwZWxpbmVTdGVwKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucHJvY2Vzcyhsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiY29weUZpbGVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2hlbiBzb3VyY2VGaWxlIGRvZXMgbm90IGV4aXN0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0UGlwZWxpbmVTdGVwKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29weUZpbGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJzb3VyY2VGaWxlLnR4dFwiLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZGVzdEZpbGUudHh0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZXhpc3RcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aGVuIGRlc3RGaWxlIGRvZXMgbm90IGV4aXN0IGFuZCBkZXN0Rm9sZGVyIGRvZXMgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcInNvdXJjZUZpbGUudHh0XCIsIFwiZm9vLWJhclwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb3B5RmlsZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcInNvdXJjZUZpbGUudHh0XCIsIFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJkZXN0RmlsZS50eHRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIkNvcHlpbmdcIik7XG4gICAgICAgICAgICBjb25zdCBuZXdDb250ZW50ID0gYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJkZXN0RmlsZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChuZXdDb250ZW50KS50by5jb250YWluKFwiZm9vLWJhclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdoZW4gZGVzdEZpbGUgZG9lcyBub3QgZXhpc3QgYW5kIGRlc3RGb2xkZXIgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcInNvdXJjZUZpbGUudHh0XCIsIFwiZm9vLWJhclwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb3B5RmlsZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcInNvdXJjZUZpbGUudHh0XCIsIFwiLi90ZXN0L3VuaXQvdGVtcC9zdWIvXCIsIFwiZGVzdEZpbGUudHh0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJJbmZvU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJDb3B5aW5nXCIpO1xuICAgICAgICAgICAgY29uc3QgbmV3Q29udGVudCA9IGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkVGV4dChcIi4vdGVzdC91bml0L3RlbXAvc3ViL1wiLCBcImRlc3RGaWxlLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG5ld0NvbnRlbnQpLnRvLmNvbnRhaW4oXCJmb28tYmFyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2hlbiBkZXN0RmlsZSBkb2VzIGV4aXN0IHdpdGggbm8gbWFya2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0UGlwZWxpbmVTdGVwKCk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJzb3VyY2VGaWxlLnR4dFwiLCBcImZvby1iYXJcIik7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJkZXN0RmlsZS50eHRcIiwgXCJiYXItZm9vXCIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvcHlGaWxlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwic291cmNlRmlsZS50eHRcIiwgXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImRlc3RGaWxlLnR4dFwiLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU2tpcHBpbmdcIik7XG4gICAgICAgICAgICBjb25zdCBuZXdDb250ZW50ID0gYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJkZXN0RmlsZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChuZXdDb250ZW50KS50by5jb250YWluKFwiYmFyLWZvb1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdoZW4gZGVzdEZpbGUgZG9lcyBleGlzdCB3aXRoIG1hcmtlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFBpcGVsaW5lU3RlcCgpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwic291cmNlRmlsZS50eHRcIiwgXCJmb28tYmFyXCIpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZGVzdEZpbGUudHh0XCIsIFwiYmFyLWZvb1xcbkdlbmVyYXRlZCBieSBVbml0ZUpTXCIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvcHlGaWxlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwic291cmNlRmlsZS50eHRcIiwgXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImRlc3RGaWxlLnR4dFwiLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VySW5mb1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiQ29weWluZ1wiKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZFRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImRlc3RGaWxlLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KG5ld0NvbnRlbnQpLnRvLmNvbnRhaW4oXCJmb28tYmFyXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZGVsZXRlRmlsZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aGVuIGZpbGUgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5kZWxldGVGaWxlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdoZW4gZmlsZSBleGlzdHMgd2l0aCBubyBtYXJrZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImZpbGUudHh0XCIsIFwiZm9vLWJhclwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5kZWxldGVGaWxlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlNraXBwaW5nXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2hlbiBmaWxlIGV4aXN0cyB3aXRoIGEgbWFya2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0UGlwZWxpbmVTdGVwKCk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJmaWxlLnR4dFwiLCBcImZvby1iYXJcXG5HZW5lcmF0ZWQgYnkgVW5pdGVKU1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5kZWxldGVGaWxlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckluZm9TcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIkRlbGV0aW5nXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gZmlsZSBleGlzdHMgYnV0IGl0IHRocm93cyBhbiBlcnJvclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFBpcGVsaW5lU3RlcCgpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIiwgXCJmb28tYmFyXFxuR2VuZXJhdGVkIGJ5IFVuaXRlSlNcIik7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZURlbGV0ZVwiKS5yZWplY3RzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZGVsZXRlRmlsZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImZpbGUudHh0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwid3JhcEdlbmVyYXRlZE1hcmtlclwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFBpcGVsaW5lU3RlcCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gb2JqLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCJiZWZvcmVcIiwgXCJhZnRlclwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoXCJiZWZvcmVHZW5lcmF0ZWQgYnkgVW5pdGVKU2FmdGVyXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsZUhhc0dlbmVyYXRlZE1hcmtlclwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aGVuIGZpbGUgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwiRmlsZU5vdEV4aXN0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2hlbiBmaWxlIGRvZXMgZXhpc3Qgd2l0aCBubyBtYXJrZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImZpbGUudHh0XCIsIFwiZm9vLWJhclwiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwiTm9NYXJrZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aGVuIGZpbGUgZG9lcyBleGlzdCB3aXRoIGEgbWFya2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0UGlwZWxpbmVTdGVwKCk7XG4gICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVUZXh0KFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJmaWxlLnR4dFwiLCBcImZvby1iYXJcXG5HZW5lcmF0ZWQgYnkgVW5pdGVKU1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW1TdHViLCBcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwiSGFzTWFya2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2hlbiBmaWxlIGRvZXMgZXhpc3Qgd2l0aCBhIG1hcmtlciBub3Qgb24gdGhlIGxhc3QgbGluZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFBpcGVsaW5lU3RlcCgpO1xuICAgICAgICAgICAgYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlVGV4dChcIi4vdGVzdC91bml0L3RlbXAvXCIsIFwiZmlsZS50eHRcIiwgXCJmb28tYmFyXFxuR2VuZXJhdGVkIGJ5IFVuaXRlSlNcXG5cXG5cXG5cIik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmlsZUhhc0dlbmVyYXRlZE1hcmtlcihmaWxlU3lzdGVtU3R1YiwgXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImZpbGUudHh0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChcIkhhc01hcmtlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdoZW4gZmlsZSB0aHJvd3MgYW4gZXJyb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RQaXBlbGluZVN0ZXAoKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlamVjdHMoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZVRleHQoXCIuL3Rlc3QvdW5pdC90ZW1wL1wiLCBcImZpbGUudHh0XCIsIFwiZm9vLWJhclxcbkdlbmVyYXRlZCBieSBVbml0ZUpTXFxuXFxuXFxuXCIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbVN0dWIsIFwiLi90ZXN0L3VuaXQvdGVtcC9cIiwgXCJmaWxlLnR4dFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoXCJGaWxlTm90RXhpc3RcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=