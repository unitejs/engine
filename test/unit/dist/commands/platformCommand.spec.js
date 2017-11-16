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
 * Tests for Platform Command.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const platformCommand_1 = require("../../../../dist/commands/platformCommand");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("PlatformCommand", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerErrorSpy;
    let loggerBannerSpy;
    let uniteJson;
    let uniteJsonWritten;
    let fileWriteJsonErrors;
    let enginePeerPackages;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };
        fileSystemStub = new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock();
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");
        uniteJson = undefined;
        fileWriteJsonErrors = false;
        uniteJsonWritten = undefined;
        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            }
            else {
                return originalFileExists(folder, filename);
            }
        }));
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            }
            else {
                return originalFileReadJson(folder, filename);
            }
        }));
        const originalFileWriteJson = fileSystemStub.fileWriteJson;
        const stubWriteJson = sandbox.stub(fileSystemStub, "fileWriteJson");
        stubWriteJson.callsFake((folder, filename, obj) => __awaiter(this, void 0, void 0, function* () {
            if (fileWriteJsonErrors) {
                return Promise.reject("error");
            }
            else {
                if (filename === "unite.json") {
                    uniteJsonWritten = obj;
                    return Promise.resolve();
                }
                else {
                    return originalFileWriteJson(folder, filename, obj);
                }
            }
        }));
        uniteJson = {
            packageName: "my-package",
            title: "My App",
            license: "MIT",
            sourceLanguage: "JavaScript",
            moduleType: "AMD",
            bundler: "RequireJS",
            unitTestRunner: "Karma",
            unitTestFramework: "Jasmine",
            unitTestEngine: "PhantomJS",
            e2eTestRunner: "Protractor",
            e2eTestFramework: "MochaChai",
            cssPre: "Sass",
            cssPost: "None",
            cssLinter: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "PlainApp",
            ides: ["VSCode"],
            uniteVersion: "0.0.0",
            sourceExtensions: [],
            viewExtensions: [],
            styleExtension: "",
            clientPackages: undefined,
            dirs: undefined,
            srcDistReplace: undefined,
            srcDistReplaceWith: undefined,
            buildConfigurations: undefined,
            platforms: undefined
        };
        enginePeerPackages = yield fileSystemStub.fileReadJson(fileSystemStub.pathCombine(__dirname, "../../../../assets/"), "peerPackages.json");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const obj = new fileSystem_mock_1.FileSystemMock();
        yield obj.directoryDelete("./test/unit/temp");
    }));
    describe("platform add", () => {
        it("can fail when calling with no unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                platformName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        }));
        it("can fail when calling with undefined operation", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                platformName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        }));
        it("can fail when calling with undefined platformName", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                platformName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("platformName");
        }));
        it("can fail when calling with undefined packageManager", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            uniteJson.packageManager = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail if pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            fileWriteJsonErrors = true;
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can succeed when calling with platformName Web", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.Web).not.to.be.equal(undefined);
        }));
        it("can succeed when calling with platformName Electron", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                platformName: "Electron",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.Electron).not.to.be.equal(undefined);
        }));
    });
    describe("platform remove", () => {
        it("can fail when calling with no unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                platformName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        }));
        it("can fail when calling with undefined operation", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                platformName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        }));
        it("can fail when calling with undefined platformName", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                platformName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("platformName");
        }));
        it("can fail if pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            fileWriteJsonErrors = true;
            uniteJson.platforms = { Web: {} };
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can fail when platformName does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("has not");
        }));
        it("can succeed when calling with platformName Web", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.platforms = { Web: {} };
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.myconfig).to.be.equal(undefined);
        }));
        it("can succeed when calling with platformName Electron", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.platforms = { Electron: {} };
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                platformName: "Electron",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.myconfig).to.be.equal(undefined);
        }));
        it("can succeed when calling all params", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.platforms = { Web: {} };
            const obj = new platformCommand_1.PlatformCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                platformName: "Web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.myconfig).to.be.equal(undefined);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvcGxhdGZvcm1Db21tYW5kLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQiw4RUFBMkU7QUFFM0Usd0RBQW9EO0FBQ3BELHdFQUFvRTtBQUVwRSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksY0FBOEIsQ0FBQztJQUNuQyxJQUFJLGVBQStCLENBQUM7SUFDcEMsSUFBSSxTQUE2QixDQUFDO0lBQ2xDLElBQUksZ0JBQW9DLENBQUM7SUFDekMsSUFBSSxtQkFBNEIsQ0FBQztJQUNqQyxJQUFJLGtCQUEyQyxDQUFDO0lBRWhELFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQixjQUFjLEdBQUcsSUFBSSxnREFBc0IsRUFBRSxDQUFDO1FBRTlDLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxlQUFlLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7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SUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29tbWFuZHMvcGxhdGZvcm1Db21tYW5kLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBQbGF0Zm9ybSBDb21tYW5kLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGxhdGZvcm1Db21tYW5kIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9wbGF0Zm9ybUNvbW1hbmRcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9maWxlU3lzdGVtLm1vY2tcIjtcbmltcG9ydCB7IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vcmVhZE9ubHlGaWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJQbGF0Zm9ybUNvbW1hbmRcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJCYW5uZXJTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCB1bml0ZUpzb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgdW5pdGVKc29uV3JpdHRlbjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBmaWxlV3JpdGVKc29uRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBlbmdpbmVQZWVyUGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmd9O1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCk7XG5cbiAgICAgICAgbG9nZ2VyRXJyb3JTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImVycm9yXCIpO1xuICAgICAgICBsb2dnZXJCYW5uZXJTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImJhbm5lclwiKTtcblxuICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgdW5pdGVKc29uV3JpdHRlbiA9IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVFeGlzdHMgPSBmaWxlU3lzdGVtU3R1Yi5maWxlRXhpc3RzO1xuICAgICAgICBjb25zdCBzdHViRXhpc3RzID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIik7XG4gICAgICAgIHN0dWJFeGlzdHMuY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVSZWFkSnNvbiA9IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjtcbiAgICAgICAgY29uc3Qgc3R1YnJlYWRKc29uID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKTtcbiAgICAgICAgc3R1YnJlYWRKc29uLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bml0ZUpzb24gPT09IG51bGwgPyBQcm9taXNlLnJlamVjdChcImVyclwiKSA6IFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlUmVhZEpzb24oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVXcml0ZUpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVKc29uO1xuICAgICAgICBjb25zdCBzdHViV3JpdGVKc29uID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVXcml0ZUpzb25cIik7XG4gICAgICAgIHN0dWJXcml0ZUpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lLCBvYmopID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlV3JpdGVKc29uRXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgICAgICB1bml0ZUpzb25Xcml0dGVuID0gb2JqO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVdyaXRlSnNvbihmb2xkZXIsIGZpbGVuYW1lLCBvYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdW5pdGVKc29uID0ge1xuICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgdGl0bGU6IFwiTXkgQXBwXCIsXG4gICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiWWFyblwiLFxuICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgdW5pdGVWZXJzaW9uOiBcIjAuMC4wXCIsXG4gICAgICAgICAgICBzb3VyY2VFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHZpZXdFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHN0eWxlRXh0ZW5zaW9uOiBcIlwiLFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRpcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZVdpdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJ1aWxkQ29uZmlndXJhdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBsYXRmb3JtczogdW5kZWZpbmVkXG4gICAgICAgIH07XG5cbiAgICAgICAgZW5naW5lUGVlclBhY2thZ2VzID0gYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRKc29uPHsgW2lkOiBzdHJpbmcgXTogc3RyaW5nfT4oZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL2Fzc2V0cy9cIiksIFwicGVlclBhY2thZ2VzLmpzb25cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwbGF0Zm9ybSBhZGRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIG5vIHVuaXRlLmpzb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJubyB1bml0ZS5qc29uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBvcGVyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJvcGVyYXRpb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBsYXRmb3JtTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGxhdGZvcm1Db21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwbGF0Zm9ybU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQbGF0Zm9ybUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wYWNrYWdlTWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IFwiV2ViXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTWFuYWdlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBwaXBlbGluZSBzdGVwIGZhaWxzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSB0cnVlO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGxhdGZvcm1Db21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBcIldlYlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGluZyB3aXRoIHBsYXRmb3JtTmFtZSBXZWJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBsYXRmb3JtTmFtZTogXCJXZWJcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5wbGF0Zm9ybXMuV2ViKS5ub3QudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCBwbGF0Zm9ybU5hbWUgRWxlY3Ryb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBsYXRmb3JtTmFtZTogXCJFbGVjdHJvblwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnBsYXRmb3Jtcy5FbGVjdHJvbikubm90LnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJwbGF0Zm9ybSByZW1vdmVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIG5vIHVuaXRlLmpzb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJubyB1bml0ZS5qc29uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBvcGVyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJvcGVyYXRpb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBsYXRmb3JtTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGxhdGZvcm1Db21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwbGF0Zm9ybU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGlwZWxpbmUgc3RlcCBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlV3JpdGVKc29uRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wbGF0Zm9ybXMgPSB7IFdlYjoge30gfTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHBsYXRmb3JtTmFtZTogXCJXZWJcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBsYXRmb3JtTmFtZSBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGxhdGZvcm1Db21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBcIldlYlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiaGFzIG5vdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCBwbGF0Zm9ybU5hbWUgV2ViXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wbGF0Zm9ybXMgPSB7IFdlYjoge30gfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQbGF0Zm9ybUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IFwiV2ViXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4ucGxhdGZvcm1zLm15Y29uZmlnKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGluZyB3aXRoIHBsYXRmb3JtTmFtZSBFbGVjdHJvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24ucGxhdGZvcm1zID0geyBFbGVjdHJvbjoge30gfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQbGF0Zm9ybUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IFwiRWxlY3Ryb25cIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5wbGF0Zm9ybXMubXljb25maWcpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsaW5nIGFsbCBwYXJhbXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLnBsYXRmb3JtcyA9IHsgV2ViOiB7fSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBsYXRmb3JtQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHBsYXRmb3JtTmFtZTogXCJXZWJcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5wbGF0Zm9ybXMubXljb25maWcpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
