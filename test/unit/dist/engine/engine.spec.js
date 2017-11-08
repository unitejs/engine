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
    let loggerWarningSpy;
    let loggerBannerSpy;
    let uniteJson;
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
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");
        uniteJson = undefined;
        packageJsonErrors = false;
        spdxErrors = false;
        fileWriteJsonErrors = false;
        packageInfo = undefined;
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
                return originalFileWriteJson(folder, filename, obj);
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
        it("can fail when node version is too low", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(process, "version").value("v7.0.0");
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            const res = yield obj.initialise();
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("higher is required");
        }));
        it("can succeed when node version is 8 or higher", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(process, "version").value("v8.0.0");
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            const res = yield obj.initialise();
            Chai.expect(res).to.be.equal(0);
        }));
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
                shortName: undefined,
                description: undefined,
                organization: undefined,
                keywords: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
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
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSources: undefined,
                transpileModules: undefined,
                transpileStripExt: undefined,
                transpileTransforms: undefined,
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
                pwa: undefined,
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
        it("can call with www/src outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            packageInfo = "{}";
            const obj = new engine_1.Engine(loggerStub, fileSystemStub);
            yield obj.initialise();
            const res = yield obj.command("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: "./test/unit/temp/www/src"
            });
            Chai.expect(res).to.be.equal(1);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFJL0IsMERBQXVEO0FBS3ZELDZFQUEwRTtBQUMxRSx3REFBb0Q7QUFDcEQsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksY0FBOEIsQ0FBQztJQUNuQyxJQUFJLGdCQUFnQyxDQUFDO0lBQ3JDLElBQUksZUFBK0IsQ0FBQztJQUNwQyxJQUFJLFNBQTZCLENBQUM7SUFDbEMsSUFBSSxpQkFBMEIsQ0FBQztJQUMvQixJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxtQkFBNEIsQ0FBQztJQUNqQyxJQUFJLFdBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUF1QixDQUFDO0lBQzVCLElBQUksYUFBc0IsQ0FBQztJQUMzQixJQUFJLGFBQXNCLENBQUM7SUFFM0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0IsY0FBYyxHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FBQztRQUU5QyxjQUFjLEdB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LEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEdBQVMsRUFBRTtZQUNqQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksZUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNuRCxNQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN2QixNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQU0sU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmUuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEVuZ2luZS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9lbmdpbmVcIjtcbmltcG9ydCB7IElCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9pbnRlcmZhY2VzL0lCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2ludGVyZmFjZXMvSUNsaWVudFBhY2thZ2VDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJQ29uZmlndXJlQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlcy9JQ29uZmlndXJlQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSVBsYXRmb3JtQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlcy9JUGxhdGZvcm1Db21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL3BpcGVsaW5lU3RlcHMvcGFja2FnZVV0aWxzXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9maWxlU3lzdGVtLm1vY2tcIjtcbmltcG9ydCB7IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vcmVhZE9ubHlGaWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJFbmdpbmVcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJXYXJuaW5nU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyQmFubmVyU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgdW5pdGVKc29uOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHBhY2thZ2VKc29uRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBzcGR4RXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBmaWxlV3JpdGVKc29uRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBwYWNrYWdlSW5mbzogc3RyaW5nO1xuICAgIGxldCBmYWlsUGFja2FnZUFkZDogYm9vbGVhbjtcbiAgICBsZXQgcHJvZmlsZUVycm9yczogYm9vbGVhbjtcbiAgICBsZXQgcHJvZmlsZUV4aXN0czogYm9vbGVhbjtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmJhbm5lciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLndhcm5pbmcgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcbiAgICAgICAgbG9nZ2VyV2FybmluZ1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwid2FybmluZ1wiKTtcbiAgICAgICAgbG9nZ2VyQmFubmVyU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJiYW5uZXJcIik7XG5cbiAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICBwYWNrYWdlSnNvbkVycm9ycyA9IGZhbHNlO1xuICAgICAgICBzcGR4RXJyb3JzID0gZmFsc2U7XG4gICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgcGFja2FnZUluZm8gPSB1bmRlZmluZWQ7XG4gICAgICAgIGZhaWxQYWNrYWdlQWRkID0gZmFsc2U7XG4gICAgICAgIHByb2ZpbGVFeGlzdHMgPSB0cnVlO1xuICAgICAgICBwcm9maWxlRXJyb3JzID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXhpc3RzID0gZmlsZVN5c3RlbVN0dWIuZmlsZUV4aXN0cztcbiAgICAgICAgY29uc3Qgc3R1YkV4aXN0cyA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpO1xuICAgICAgICBzdHViRXhpc3RzLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxlbmFtZSA9PT0gXCJjb25maWd1cmUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9maWxlRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2ZpbGVFcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgKG5ldyBFcnJvcihcImZhaWxcIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlUmVhZEpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb247XG4gICAgICAgIGNvbnN0IHN0dWJyZWFkSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIik7XG4gICAgICAgIHN0dWJyZWFkSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJwYWNrYWdlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYWNrYWdlSnNvbkVycm9ycyA/IFByb21pc2UucmVqZWN0KFwiRG9lcyBub3QgZXhpc3RcIikgOiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwic3BkeC1mdWxsLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzcGR4RXJyb3JzID8gUHJvbWlzZS5yZWplY3QoXCJEb2VzIG5vdCBleGlzdFwiKSA6IG9yaWdpbmFsRmlsZVJlYWRKc29uKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pdGVKc29uID09PSBudWxsID8gUHJvbWlzZS5yZWplY3QoXCJlcnJcIikgOiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVJlYWRKc29uKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlV3JpdGVKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlSnNvbjtcbiAgICAgICAgY29uc3Qgc3R1YldyaXRlSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlV3JpdGVKc29uXCIpO1xuICAgICAgICBzdHViV3JpdGVKc29uLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSwgb2JqKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVdyaXRlSnNvbkVycm9ycykge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVXcml0ZUpzb24oZm9sZGVyLCBmaWxlbmFtZSwgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZXhlY1N0dWIgPSBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIik7XG4gICAgICAgIGV4ZWNTdHViLmNhbGxzRmFrZShhc3luYyAobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcGFja2FnZU5hbWU6IHN0cmluZywgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFyZ3NbMF0gPT09IFwidmlld1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhY2thZ2VJbmZvID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcInBhY2thZ2UgaW5mb3JtYXRpb25cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYWNrYWdlSW5mbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFpbFBhY2thZ2VBZGQgPyBQcm9taXNlLnJlamVjdChcImVycm9yXCIpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVuaXRlSnNvbiA9IHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgIHRpdGxlOiBcIk15IEFwcFwiLFxuICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiWWFyblwiLFxuICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgdW5pdGVWZXJzaW9uOiBcIjAuMC4wXCIsXG4gICAgICAgICAgICBzb3VyY2VFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHZpZXdFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHN0eWxlRXh0ZW5zaW9uOiBcIlwiLFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRpcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZVdpdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJ1aWxkQ29uZmlndXJhdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBsYXRmb3JtczogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImluaXRpYWxpc2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gbm9kZSB2ZXJzaW9uIGlzIHRvbyBsb3dcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKHByb2Nlc3MsIFwidmVyc2lvblwiKS52YWx1ZShcInY3LjAuMFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiaGlnaGVyIGlzIHJlcXVpcmVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gbm9kZSB2ZXJzaW9uIGlzIDggb3IgaGlnaGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1Yihwcm9jZXNzLCBcInZlcnNpb25cIikudmFsdWUoXCJ2OC4wLjBcIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gbWlzc2luZyBwYWNrYWdlIGRlcGVuZGVuY2llc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbkVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImRlcGVuZGVuY2llcyBmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJ2ZXJzaW9uXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCBiZWZvcmUgcGFja2FnZSBkZXBlbmRlbmNpZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoudmVyc2lvbigpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChcInVua25vd25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBwYWNrYWdlIGRlcGVuZGVuY2llcyBsb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gb2JqLnZlcnNpb24oKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KC8oXFxkKilcXC4oXFxkKilcXC4oXFxkKikvLnRlc3QocmVzKSkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjb21tYW5kXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gY2FsbCBjb21tYW5kIGFzIGNvbmZpZ3VyZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29tbWFuZDxJQ29uZmlndXJlQ29tbWFuZFBhcmFtcz4oXCJjb25maWd1cmVcIiwge1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJNeSBBcHBcIixcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwic2hvdWxkIHByb2JhYmx5XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBjYWxsIGFzIGNsaWVudFBhY2thZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInt9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29tbWFuZDxJQ2xpZW50UGFja2FnZUNvbW1hbmRQYXJhbXM+KFwiY2xpZW50UGFja2FnZVwiLCB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU291cmNlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZU1vZHVsZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTdHJpcEV4dDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCBhcyBwbGF0Zm9ybVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29tbWFuZDxJUGxhdGZvcm1Db21tYW5kUGFyYW1zPihcInBsYXRmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBcIndlYlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCBhcyBidWlsZENvbmZpZ3VyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEVuZ2luZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1Yik7XG4gICAgICAgICAgICBhd2FpdCBvYmouaW5pdGlhbGlzZSgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmNvbW1hbmQ8SUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXM+KFwiYnVpbGRDb25maWd1cmF0aW9uXCIsIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbk5hbWU6IFwiYm9iXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWluaWZ5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlbWFwczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHB3YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCB3aXRoIGVtcHR5IG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb21tYW5kPElQbGF0Zm9ybUNvbW1hbmRQYXJhbXM+KFwicGxhdGZvcm1cIiwge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IFwid2ViXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY2FsbCB3aXRoIHd3dyBvdXRwdXREaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInt9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgRW5naW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai5pbml0aWFsaXNlKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouY29tbWFuZDxJUGxhdGZvcm1Db21tYW5kUGFyYW1zPihcInBsYXRmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm1OYW1lOiBcIndlYlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wL3d3d1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNhbGwgd2l0aCB3d3cvc3JjIG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb21tYW5kPElQbGF0Zm9ybUNvbW1hbmRQYXJhbXM+KFwicGxhdGZvcm1cIiwge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybU5hbWU6IFwid2ViXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyY1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNhbGwgYXMgdW5rbm93blwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBFbmdpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIpO1xuICAgICAgICAgICAgYXdhaXQgb2JqLmluaXRpYWxpc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5jb21tYW5kPGFueT4oXCJ1bmtub3duXCIsIHt9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiRXJyb3IgbG9hZGluZyBjb21tYW5kIG1vZHVsZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
