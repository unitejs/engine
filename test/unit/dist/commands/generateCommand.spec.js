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
 * Tests for Generate Command.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const generateCommand_1 = require("../../../../dist/commands/generateCommand");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("GenerateCommand", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerErrorSpy;
    let loggerInfoSpy;
    let loggerWarningSpy;
    let loggerBannerSpy;
    let uniteJson;
    let enginePackageConfiguration;
    let generateTemplates;
    let sharedGenerateTemplates;
    let generateTemplatesExist;
    let sharedGenerateTemplatesExist;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
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
        generateTemplates = undefined;
        sharedGenerateTemplates = undefined;
        generateTemplatesExist = true;
        sharedGenerateTemplatesExist = true;
        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            }
            else if (filename === "doesnotexist.ts") {
                return Promise.resolve(false);
            }
            else if (filename === "already-exists.component.ts") {
                return Promise.resolve(true);
            }
            else if (filename === "generate-templates.json") {
                if (folder.indexOf("shared") > 0) {
                    return Promise.resolve(sharedGenerateTemplatesExist);
                }
                else {
                    return Promise.resolve(generateTemplatesExist);
                }
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
            else if (filename === "generate-templates.json") {
                if (folder.indexOf("shared") > 0) {
                    return sharedGenerateTemplates ? sharedGenerateTemplates : originalFileReadJson(folder, filename);
                }
                else {
                    return generateTemplates ? generateTemplates : originalFileReadJson(folder, filename);
                }
            }
            else {
                return originalFileReadJson(folder, filename);
            }
        }));
        uniteJson = {
            packageName: undefined,
            title: undefined,
            license: undefined,
            sourceLanguage: "TypeScript",
            moduleType: undefined,
            bundler: undefined,
            unitTestRunner: "Karma",
            unitTestFramework: "Jasmine",
            unitTestEngine: undefined,
            e2eTestRunner: undefined,
            e2eTestFramework: undefined,
            cssPre: undefined,
            cssPost: undefined,
            linter: undefined,
            packageManager: undefined,
            taskManager: undefined,
            server: undefined,
            applicationFramework: "Angular",
            ides: undefined,
            uniteVersion: undefined,
            sourceExtensions: ["ts"],
            viewExtensions: ["html"],
            styleExtension: "scss",
            clientPackages: undefined,
            dirs: {
                wwwRoot: "./www/",
                packagedRoot: undefined,
                www: {
                    src: "./src/",
                    dist: undefined,
                    unitTest: undefined,
                    unitTestSrc: "./test/unit/src/",
                    unitTestDist: undefined,
                    cssSrc: undefined,
                    cssDist: undefined,
                    e2eTest: undefined,
                    e2eTestSrc: undefined,
                    e2eTestDist: undefined,
                    reports: undefined,
                    package: undefined,
                    build: undefined,
                    assets: undefined,
                    assetsSrc: undefined
                }
            },
            srcDistReplace: undefined,
            srcDistReplaceWith: undefined,
            buildConfigurations: undefined,
            platforms: undefined
        };
        enginePackageConfiguration = yield fileSystemStub.fileReadJson(fileSystemStub.pathCombine(__dirname, "../../../../"), "package.json");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const obj = new fileSystem_mock_1.FileSystemMock();
        yield obj.directoryDelete("./test/unit/temp");
    }));
    describe("run", () => {
        it("can fail when calling with no unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: undefined,
                type: undefined,
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        }));
        it("can fail when calling with undefined name", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: undefined,
                type: undefined,
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("name");
        }));
        it("can fail when calling with undefined type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: undefined,
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("type");
        }));
        it("can fail when no generate-templates for framework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.applicationFramework = "Aurelia";
            generateTemplatesExist = false;
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "component",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no generate-templates for applicationFramework");
        }));
        it("can fail when no type for framework", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "blah",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not find a type of");
        }));
        it("can fail when throws and exception", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.applicationFramework = undefined;
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "blah",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("There was an error loading generate-templates");
        }));
        it("can fail when shared template and shared not exists", () => __awaiter(this, void 0, void 0, function* () {
            sharedGenerateTemplatesExist = false;
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no shared generate-templates");
        }));
        it("can fail when shared template and shared base not exists", () => __awaiter(this, void 0, void 0, function* () {
            sharedGenerateTemplates = {};
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not find a type of");
        }));
        it("can fail when pipeline throws an error", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemStub.directoryGetFiles = sandbox.stub().throws();
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
        }));
        it("can succeed with shared template", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with name and type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with name and type and subfolder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: "blah",
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with name and type and empty subfolder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: "",
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when generate-templates has no files", () => __awaiter(this, void 0, void 0, function* () {
            generateTemplates = { component: {} };
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when not in source folder", () => __awaiter(this, void 0, void 0, function* () {
            const wwwFolder = fileSystemStub.pathAbsolute(fileSystemStub.pathCombine("./test/unit/temp", uniteJson.dirs.wwwRoot));
            const srcFolder = fileSystemStub.pathAbsolute(fileSystemStub.pathCombine(wwwFolder, uniteJson.dirs.www.src));
            const originalPathAbsolute = fileSystemStub.pathAbsolute;
            const stub = sandbox.stub(fileSystemStub, "pathAbsolute");
            stub.callsFake((dir) => {
                if (dir === "./") {
                    return fileSystemStub.pathAbsolute(fileSystemStub.pathCombine(srcFolder, "blah"));
                }
                return originalPathAbsolute(dir);
            });
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when path to web is not ./", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemStub, "pathToWeb");
            stub.callsFake((dir) => dir);
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail when dest file exists", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "AlreadyExists",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Destination file exists");
        }));
        it("can fail when source files does not exist", () => __awaiter(this, void 0, void 0, function* () {
            generateTemplates = { component: {
                    sourceFiles: ["doesnotexist.ts"]
                } };
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not find a source for");
        }));
        it("can fail when source file is not supported", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileReadText").resolves("!Message");
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Message");
        }));
        it("can fail when source files throws an exception", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileReadText").throws();
            const obj = new generateCommand_1.GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("generating from the template");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvZ2VuZXJhdGVDb21tYW5kLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQiw4RUFBMkU7QUFJM0Usd0RBQW9EO0FBQ3BELHdFQUFvRTtBQUVwRSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBQ2hDLElBQUksY0FBOEIsQ0FBQztJQUNuQyxJQUFJLGFBQTZCLENBQUM7SUFDbEMsSUFBSSxnQkFBZ0MsQ0FBQztJQUNyQyxJQUFJLGVBQStCLENBQUM7SUFDcEMsSUFBSSxTQUE2QixDQUFDO0lBQ2xDLElBQUksMEJBQWdELENBQUM7SUFDckQsSUFBSSxpQkFBMEMsQ0FBQztJQUMvQyxJQUFJLHVCQUFnRCxDQUFDO0lBQ3JELElBQUksc0JBQStCLENBQUM7SUFDcEMsSUFBSSw0QkFBcUMsQ0FBQztJQUUxQyxVQUFVLENBQUMsR0FBUyxFQUFFO1FBQ2xCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0IsY0FBYyxHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FBQztRQUU5QyxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcs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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFTLEVBQUU7WUFDNUQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFdEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDMUgsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUN0QixJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsV0FBVztnQkFDakIsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLGVBQWUsRUFBRSxrQkFBa0I7YUFDdEMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29tbWFuZHMvZ2VuZXJhdGVDb21tYW5kLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBHZW5lcmF0ZSBDb21tYW5kLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgR2VuZXJhdGVDb21tYW5kIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmF0ZUNvbW1hbmRcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVVuaXRlR2VuZXJhdGVUZW1wbGF0ZXMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL0lVbml0ZUdlbmVyYXRlVGVtcGxhdGVzXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5pbXBvcnQgeyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL3JlYWRPbmx5RmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiR2VuZXJhdGVDb21tYW5kXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtU3R1YjogSUZpbGVTeXN0ZW07XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VySW5mb1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlcldhcm5pbmdTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJCYW5uZXJTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCB1bml0ZUpzb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb246IFBhY2thZ2VDb25maWd1cmF0aW9uO1xuICAgIGxldCBnZW5lcmF0ZVRlbXBsYXRlczogSVVuaXRlR2VuZXJhdGVUZW1wbGF0ZXM7XG4gICAgbGV0IHNoYXJlZEdlbmVyYXRlVGVtcGxhdGVzOiBJVW5pdGVHZW5lcmF0ZVRlbXBsYXRlcztcbiAgICBsZXQgZ2VuZXJhdGVUZW1wbGF0ZXNFeGlzdDogYm9vbGVhbjtcbiAgICBsZXQgc2hhcmVkR2VuZXJhdGVUZW1wbGF0ZXNFeGlzdDogYm9vbGVhbjtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmJhbm5lciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLndhcm5pbmcgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcbiAgICAgICAgbG9nZ2VySW5mb1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiaW5mb1wiKTtcbiAgICAgICAgbG9nZ2VyV2FybmluZ1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwid2FybmluZ1wiKTtcbiAgICAgICAgbG9nZ2VyQmFubmVyU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJiYW5uZXJcIik7XG5cbiAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgc2hhcmVkR2VuZXJhdGVUZW1wbGF0ZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGVzRXhpc3QgPSB0cnVlO1xuICAgICAgICBzaGFyZWRHZW5lcmF0ZVRlbXBsYXRlc0V4aXN0ID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVFeGlzdHMgPSBmaWxlU3lzdGVtU3R1Yi5maWxlRXhpc3RzO1xuICAgICAgICBjb25zdCBzdHViRXhpc3RzID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIik7XG4gICAgICAgIHN0dWJFeGlzdHMuY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcImRvZXNub3RleGlzdC50c1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcImFscmVhZHktZXhpc3RzLmNvbXBvbmVudC50c1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwiZ2VuZXJhdGUtdGVtcGxhdGVzLmpzb25cIikge1xuICAgICAgICAgICAgICAgIGlmIChmb2xkZXIuaW5kZXhPZihcInNoYXJlZFwiKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzaGFyZWRHZW5lcmF0ZVRlbXBsYXRlc0V4aXN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGdlbmVyYXRlVGVtcGxhdGVzRXhpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVJlYWRKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRKc29uO1xuICAgICAgICBjb25zdCBzdHVicmVhZEpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpO1xuICAgICAgICBzdHVicmVhZEpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRlSnNvbiA9PT0gbnVsbCA/IFByb21pc2UucmVqZWN0KFwiZXJyXCIpIDogUHJvbWlzZS5yZXNvbHZlKHVuaXRlSnNvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcImdlbmVyYXRlLXRlbXBsYXRlcy5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9sZGVyLmluZGV4T2YoXCJzaGFyZWRcIikgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaGFyZWRHZW5lcmF0ZVRlbXBsYXRlcyA/IHNoYXJlZEdlbmVyYXRlVGVtcGxhdGVzIDogb3JpZ2luYWxGaWxlUmVhZEpzb24oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlVGVtcGxhdGVzID8gZ2VuZXJhdGVUZW1wbGF0ZXMgOiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdW5pdGVKc29uID0ge1xuICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJUeXBlU2NyaXB0XCIsXG4gICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiQW5ndWxhclwiLFxuICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5pdGVWZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzb3VyY2VFeHRlbnNpb25zOiBbXCJ0c1wiXSxcbiAgICAgICAgICAgIHZpZXdFeHRlbnNpb25zOiBbXCJodG1sXCJdLFxuICAgICAgICAgICAgc3R5bGVFeHRlbnNpb246IFwic2Nzc1wiLFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRpcnM6IHtcbiAgICAgICAgICAgICAgICB3d3dSb290OiBcIi4vd3d3L1wiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VkUm9vdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHd3dzoge1xuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3RTcmM6IFwiLi90ZXN0L3VuaXQvc3JjL1wiLFxuICAgICAgICAgICAgICAgICAgICB1bml0VGVzdERpc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgY3NzU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGNzc0Rpc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgZTJlVGVzdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBlMmVUZXN0U3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGUyZVRlc3REaXN0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBidWlsZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRzU3JjOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlV2l0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYnVpbGRDb25maWd1cmF0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGxhdGZvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbiA9IGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4oZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJydW5cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIG5vIHVuaXRlLmpzb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzdWJGb2xkZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm5vIHVuaXRlLmpzb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIG5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzdWJGb2xkZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHR5cGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJmcmVkXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ0eXBlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gbm8gZ2VuZXJhdGUtdGVtcGxhdGVzIGZvciBmcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gXCJBdXJlbGlhXCI7XG4gICAgICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlc0V4aXN0ID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR2VuZXJhdGVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImZyZWRcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJubyBnZW5lcmF0ZS10ZW1wbGF0ZXMgZm9yIGFwcGxpY2F0aW9uRnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gbm8gdHlwZSBmb3IgZnJhbWV3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBHZW5lcmF0ZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiZnJlZFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiYmxhaFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJDYW4gbm90IGZpbmQgYSB0eXBlIG9mXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gdGhyb3dzIGFuZCBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJmcmVkXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJibGFoXCIsXG4gICAgICAgICAgICAgICAgc3ViRm9sZGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlRoZXJlIHdhcyBhbiBlcnJvciBsb2FkaW5nIGdlbmVyYXRlLXRlbXBsYXRlc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHNoYXJlZCB0ZW1wbGF0ZSBhbmQgc2hhcmVkIG5vdCBleGlzdHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2hhcmVkR2VuZXJhdGVUZW1wbGF0ZXNFeGlzdCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJmcmVkXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjbGFzc1wiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJubyBzaGFyZWQgZ2VuZXJhdGUtdGVtcGxhdGVzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gc2hhcmVkIHRlbXBsYXRlIGFuZCBzaGFyZWQgYmFzZSBub3QgZXhpc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNoYXJlZEdlbmVyYXRlVGVtcGxhdGVzID0ge307XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR2VuZXJhdGVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImZyZWRcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNsYXNzXCIsXG4gICAgICAgICAgICAgICAgc3ViRm9sZGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIkNhbiBub3QgZmluZCBhIHR5cGUgb2ZcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwaXBlbGluZSB0aHJvd3MgYW4gZXJyb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZmlsZVN5c3RlbVN0dWIuZGlyZWN0b3J5R2V0RmlsZXMgPSBzYW5kYm94LnN0dWIoKS50aHJvd3MoKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJmcmVkXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjbGFzc1wiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIHNoYXJlZCB0ZW1wbGF0ZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR2VuZXJhdGVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImZyZWRcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNsYXNzXCIsXG4gICAgICAgICAgICAgICAgc3ViRm9sZGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGluZyB3aXRoIG5hbWUgYW5kIHR5cGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJCb2JcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCBuYW1lIGFuZCB0eXBlIGFuZCBzdWJmb2xkZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJCb2JcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogXCJibGFoXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGluZyB3aXRoIG5hbWUgYW5kIHR5cGUgYW5kIGVtcHR5IHN1YmZvbGRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR2VuZXJhdGVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkJvYlwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgc3ViRm9sZGVyOiBcIlwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGdlbmVyYXRlLXRlbXBsYXRlcyBoYXMgbm8gZmlsZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZ2VuZXJhdGVUZW1wbGF0ZXMgPSB7IGNvbXBvbmVudDoge319O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJCb2JcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIG5vdCBpbiBzb3VyY2UgZm9sZGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHd3d0ZvbGRlciA9IGZpbGVTeXN0ZW1TdHViLnBhdGhBYnNvbHV0ZShmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShcIi4vdGVzdC91bml0L3RlbXBcIiwgdW5pdGVKc29uLmRpcnMud3d3Um9vdCkpO1xuICAgICAgICAgICAgY29uc3Qgc3JjRm9sZGVyID0gZmlsZVN5c3RlbVN0dWIucGF0aEFic29sdXRlKGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKHd3d0ZvbGRlciwgdW5pdGVKc29uLmRpcnMud3d3LnNyYykpO1xuXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbFBhdGhBYnNvbHV0ZSA9IGZpbGVTeXN0ZW1TdHViLnBhdGhBYnNvbHV0ZTtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwicGF0aEFic29sdXRlXCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoKGRpcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkaXIgPT09IFwiLi9cIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0dWIucGF0aEFic29sdXRlKGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKHNyY0ZvbGRlciwgXCJibGFoXCIpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxQYXRoQWJzb2x1dGUoZGlyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR2VuZXJhdGVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkJvYlwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgc3ViRm9sZGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gcGF0aCB0byB3ZWIgaXMgbm90IC4vXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwicGF0aFRvV2ViXCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoKGRpcikgPT4gZGlyKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJCb2JcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGRlc3QgZmlsZSBleGlzdHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJBbHJlYWR5RXhpc3RzXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICBzdWJGb2xkZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IFwiLi90ZXN0L3VuaXQvdGVtcFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiRGVzdGluYXRpb24gZmlsZSBleGlzdHNcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBzb3VyY2UgZmlsZXMgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZ2VuZXJhdGVUZW1wbGF0ZXMgPSB7IGNvbXBvbmVudDoge1xuICAgICAgICAgICAgICAgIHNvdXJjZUZpbGVzOiBbXCJkb2Vzbm90ZXhpc3QudHNcIl1cbiAgICAgICAgICAgIH19O1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgR2VuZXJhdGVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkJvYlwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgc3ViRm9sZGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIkNhbiBub3QgZmluZCBhIHNvdXJjZSBmb3JcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBzb3VyY2UgZmlsZSBpcyBub3Qgc3VwcG9ydGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZFRleHRcIikucmVzb2x2ZXMoXCIhTWVzc2FnZVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJCb2JcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJNZXNzYWdlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gc291cmNlIGZpbGVzIHRocm93cyBhbiBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkVGV4dFwiKS50aHJvd3MoKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IEdlbmVyYXRlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJCb2JcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgIHN1YkZvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJnZW5lcmF0aW5nIGZyb20gdGhlIHRlbXBsYXRlXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
