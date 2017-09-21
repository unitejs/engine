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
const engine_1 = require("../../../../dist/engine/engine");
const packageUtils_1 = require("../../../../dist/pipelineSteps/packageUtils");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("Engine", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerErrorSpy;
    let loggerInfoSpy;
    let loggerWarningSpy;
    let loggerBannerSpy;
    let uniteJson;
    let uniteJsonWritten;
    let packageJsonErrors;
    let spdxErrors;
    let fileWriteJsonErrors;
    let packageInfo;
    let failPackageAdd;
    let profileErrors;
    let profileExists;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };
        fileSystemStub = new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock();
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");
        uniteJson = undefined;
        packageJsonErrors = false;
        spdxErrors = false;
        fileWriteJsonErrors = false;
        packageInfo = undefined;
        uniteJsonWritten = undefined;
        failPackageAdd = false;
        profileExists = true;
        profileErrors = false;
        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            }
            else if (filename === "configure.json") {
                if (!profileExists) {
                    return false;
                }
                else if (profileErrors) {
                    throw (new Error("fail"));
                }
                else {
                    return originalFileExists(folder, filename);
                }
            }
            else {
                return originalFileExists(folder, filename);
            }
        }));
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "package.json") {
                return packageJsonErrors ? Promise.reject("Does not exist") : originalFileReadJson(folder, filename);
            }
            else if (filename === "spdx-full.json") {
                return spdxErrors ? Promise.reject("Does not exist") : originalFileReadJson(folder, filename);
            }
            else if (filename === "unite.json") {
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
        const execStub = sandbox.stub(packageUtils_1.PackageUtils, "exec");
        execStub.callsFake((logger, fileSystem, packageName, workingDirectory, args) => __awaiter(this, void 0, void 0, function* () {
            if (args[0] === "view") {
                if (packageInfo === null) {
                    return Promise.reject("package information");
                }
                else {
                    return Promise.resolve(packageInfo);
                }
            }
            else {
                return failPackageAdd ? Promise.reject("error") : Promise.resolve();
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
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "PlainApp",
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
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const obj = new fileSystem_mock_1.FileSystemMock();
        yield obj.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new engine_1.Engine(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    });
    describe("initialise", () => {
        it("can fail when missing package dependencies", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            packageJsonErrors = true;
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            const res = yield obj.initialise();
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies failed");
        }));
    });
    describe("version", () => {
        it("can fail when called before package dependencies", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            const res = obj.version();
            Chai.expect(res).to.be.equal("unknown");
        }));
        it("can succeed when package dependencies loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = obj.version();
            Chai.expect(/(\d*)\.(\d*)\.(\d*)/.test(res)).to.be.equal(true);
        }));
    });
    describe("command", () => {
        it("can call command as configure", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("configure", {
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
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: true,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can call as clientPackage", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{}";
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("clientPackage", {
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can call as platform", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can call as buildConfiguration", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("buildConfiguration", {
                operation: "add",
                configurationName: "bob",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can call with empty outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{}";
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can call with www outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{}";
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: "./test/unit/temp/www"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can call as unknown", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{}";
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("unknown", {});
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Error loading command module");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFJL0IsMkRBQXdEO0FBS3hELDhFQUEyRTtBQUMzRSx3REFBb0Q7QUFDcEQsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDZixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxhQUE2QixDQUFDO0lBQ2xDLElBQUksZ0JBQWdDLENBQUM7SUFDckMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksU0FBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFvQyxDQUFDO0lBQ3pDLElBQUksaUJBQTBCLENBQUM7SUFDL0IsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksbUJBQTRCLENBQUM7SUFDakMsSUFBSSxXQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBdUIsQ0FBQztJQUM1QixJQUFJLGFBQXNCLENBQUM7SUFDM0IsSUFBSSxhQUFzQixDQUFDO0lBRTNCLFVBQVUsQ0FBQztRQUNQLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDN0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQztRQUUvQixjQUFjLEdBQUcsSUFBSSxnREFBc0IsRUFBRSxDQUFDO1FBRTlDLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FB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QyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN0QixXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksZUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNuRCxNQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN2QixNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQU0sU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmUuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEVuZ2luZS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9kaXN0L2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvZW5naW5lL2VuZ2luZVwiO1xuaW1wb3J0IHsgSUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9pbnRlcmZhY2VzL0lCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9pbnRlcmZhY2VzL0lDbGllbnRQYWNrYWdlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUNvbmZpZ3VyZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9pbnRlcmZhY2VzL0lDb25maWd1cmVDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJUGxhdGZvcm1Db21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2Rpc3QvaW50ZXJmYWNlcy9JUGxhdGZvcm1Db21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9waXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlsc1wiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5pbXBvcnQgeyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL3JlYWRPbmx5RmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiRW5naW5lXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtU3R1YjogSUZpbGVTeXN0ZW07XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VySW5mb1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlcldhcm5pbmdTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJCYW5uZXJTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCB1bml0ZUpzb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgdW5pdGVKc29uV3JpdHRlbjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBwYWNrYWdlSnNvbkVycm9yczogYm9vbGVhbjtcbiAgICBsZXQgc3BkeEVycm9yczogYm9vbGVhbjtcbiAgICBsZXQgZmlsZVdyaXRlSnNvbkVycm9yczogYm9vbGVhbjtcbiAgICBsZXQgcGFja2FnZUluZm86IHN0cmluZztcbiAgICBsZXQgZmFpbFBhY2thZ2VBZGQ6IGJvb2xlYW47XG4gICAgbGV0IHByb2ZpbGVFcnJvcnM6IGJvb2xlYW47XG4gICAgbGV0IHByb2ZpbGVFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5iYW5uZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi53YXJuaW5nID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGZpbGVTeXN0ZW1TdHViID0gbmV3IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2soKTtcblxuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG4gICAgICAgIGxvZ2dlckluZm9TcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImluZm9cIik7XG4gICAgICAgIGxvZ2dlcldhcm5pbmdTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcIndhcm5pbmdcIik7XG4gICAgICAgIGxvZ2dlckJhbm5lclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiYmFubmVyXCIpO1xuXG4gICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgcGFja2FnZUpzb25FcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgc3BkeEVycm9ycyA9IGZhbHNlO1xuICAgICAgICBmaWxlV3JpdGVKc29uRXJyb3JzID0gZmFsc2U7XG4gICAgICAgIHBhY2thZ2VJbmZvID0gdW5kZWZpbmVkO1xuICAgICAgICB1bml0ZUpzb25Xcml0dGVuID0gdW5kZWZpbmVkO1xuICAgICAgICBmYWlsUGFja2FnZUFkZCA9IGZhbHNlO1xuICAgICAgICBwcm9maWxlRXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgcHJvZmlsZUVycm9ycyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZUV4aXN0cyA9IGZpbGVTeXN0ZW1TdHViLmZpbGVFeGlzdHM7XG4gICAgICAgIGNvbnN0IHN0dWJFeGlzdHMgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKTtcbiAgICAgICAgc3R1YkV4aXN0cy5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuaXRlSnNvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwiY29uZmlndXJlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIGlmICghcHJvZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9maWxlRXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IChuZXcgRXJyb3IoXCJmYWlsXCIpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVJlYWRKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRKc29uO1xuICAgICAgICBjb25zdCBzdHVicmVhZEpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpO1xuICAgICAgICBzdHVicmVhZEpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwicGFja2FnZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFja2FnZUpzb25FcnJvcnMgPyBQcm9taXNlLnJlamVjdChcIkRvZXMgbm90IGV4aXN0XCIpIDogb3JpZ2luYWxGaWxlUmVhZEpzb24oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcInNwZHgtZnVsbC5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BkeEVycm9ycyA/IFByb21pc2UucmVqZWN0KFwiRG9lcyBub3QgZXhpc3RcIikgOiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRlSnNvbiA9PT0gbnVsbCA/IFByb21pc2UucmVqZWN0KFwiZXJyXCIpIDogUHJvbWlzZS5yZXNvbHZlKHVuaXRlSnNvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVdyaXRlSnNvbiA9IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZUpzb247XG4gICAgICAgIGNvbnN0IHN0dWJXcml0ZUpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVdyaXRlSnNvblwiKTtcbiAgICAgICAgc3R1YldyaXRlSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUsIG9iaikgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVXcml0ZUpzb25FcnJvcnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRlSnNvbldyaXR0ZW4gPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlV3JpdGVKc29uKGZvbGRlciwgZmlsZW5hbWUsIG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBleGVjU3R1YiA9IHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKTtcbiAgICAgICAgZXhlY1N0dWIuY2FsbHNGYWtlKGFzeW5jIChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXJnc1swXSA9PT0gXCJ2aWV3XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFja2FnZUluZm8gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwicGFja2FnZSBpbmZvcm1hdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhY2thZ2VJbmZvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWlsUGFja2FnZUFkZCA/IFByb21pc2UucmVqZWN0KFwiZXJyb3JcIikgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdW5pdGVKc29uID0ge1xuICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgdGl0bGU6IFwiTXkgQXBwXCIsXG4gICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJZYXJuXCIsXG4gICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICB1bml0ZVZlcnNpb246IFwiMC4wLjBcIixcbiAgICAgICAgICAgIHNvdXJjZUV4dGVuc2lvbnM6IFtdLFxuICAgICAgICAgICAgdmlld0V4dGVuc2lvbnM6IFtdLFxuICAgICAgICAgICAgc3R5bGVFeHRlbnNpb246IFwiXCIsXG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGlyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlV2l0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYnVpbGRDb25maWd1cmF0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGxhdGZvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiaW5pdGlhbGlzZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBtaXNzaW5nIHBhY2thZ2UgZGVwZW5kZW5jaWVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHBhY2thZ2VKc29uRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZGVwZW5kZW5jaWVzIGZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInZlcnNpb25cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIGJlZm9yZSBwYWNrYWdlIGRlcGVuZGVuY2llc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IG9iai52ZXJzaW9uKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwidW5rbm93blwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIHBhY2thZ2UgZGVwZW5kZW5jaWVzIGxvYWRlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoudmVyc2lvbigpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoLyhcXGQqKVxcLihcXGQqKVxcLihcXGQqKS8udGVzdChyZXMpKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNvbW1hbmRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBjYWxsIGNvbW1hbmQgYXMgY29uZmlndXJlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb21tYW5kPElDb25maWd1cmVDb21tYW5kUGFyYW1zPihcImNvbmZpZ3VyZVwiLCB7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIk15IEFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNob3VsZCBwcm9iYWJseVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCBhcyBjbGllbnRQYWNrYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7fVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvbW1hbmQ8SUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zPihcImNsaWVudFBhY2thZ2VcIiwge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCBhcyBwbGF0Zm9ybVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29tbWFuZDxJUGxhdGZvcm1Db21tYW5kUGFyYW1zPihcInBsYXRmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBcIndlYlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCBhcyBidWlsZENvbmZpZ3VyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvbW1hbmQ8SUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXM+KFwiYnVpbGRDb25maWd1cmF0aW9uXCIsIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbk5hbWU6IFwiYm9iXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWluaWZ5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlbWFwczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCB3aXRoIGVtcHR5IG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb21tYW5kPElQbGF0Zm9ybUNvbW1hbmRQYXJhbXM+KFwicGxhdGZvcm1cIiwge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IFwid2ViXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCB3aXRoIHd3dyBvdXRwdXREaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInt9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29tbWFuZDxJUGxhdGZvcm1Db21tYW5kUGFyYW1zPihcInBsYXRmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBcIndlYlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wL3d3d1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNhbGwgYXMgdW5rbm93blwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb21tYW5kPGFueT4oXCJ1bmtub3duXCIsIHt9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiRXJyb3IgbG9hZGluZyBjb21tYW5kIG1vZHVsZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
