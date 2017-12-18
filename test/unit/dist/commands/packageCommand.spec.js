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
 * Tests for Package Command.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const packageCommand_1 = require("../../../../dist/commands/packageCommand");
const unitePackageClientConfiguration_1 = require("../../../../dist/configuration/models/unitePackages/unitePackageClientConfiguration");
const packageHelper_1 = require("../../../../dist/helpers/packageHelper");
const packageUtils_1 = require("../../../../dist/pipelineSteps/packageUtils");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("PackageCommand", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerErrorSpy;
    let loggerBannerSpy;
    let uniteJson;
    let unitePackageJson;
    let enginePeerPackages;
    let appFrameworkDirExists;
    let examplesDirExists;
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
        appFrameworkDirExists = true;
        examplesDirExists = true;
        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            }
            else if (filename === "unite-package.json") {
                return Promise.resolve(unitePackageJson === undefined ? false : true);
            }
            else {
                return originalFileExists(folder, filename);
            }
        }));
        const originalDirExists = fileSystemStub.directoryExists;
        const stubDirExists = sandbox.stub(fileSystemStub, "directoryExists");
        stubDirExists.callsFake((folder) => __awaiter(this, void 0, void 0, function* () {
            if (folder.toLowerCase().endsWith(uniteJson.applicationFramework.toLowerCase())) {
                return Promise.resolve(appFrameworkDirExists);
            }
            else if (folder.endsWith("examples")) {
                return Promise.resolve(examplesDirExists);
            }
            else {
                return originalDirExists(folder);
            }
        }));
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            }
            else if (filename === "unite-package.json") {
                return unitePackageJson === null ? Promise.reject("err") : Promise.resolve(unitePackageJson);
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
            moduleType: "amd",
            bundler: undefined,
            unitTestRunner: "Karma",
            unitTestFramework: "Jasmine",
            unitTestEngine: undefined,
            e2eTestRunner: undefined,
            e2eTestFramework: undefined,
            cssPre: undefined,
            cssPost: undefined,
            cssLinter: undefined,
            documenter: undefined,
            linter: undefined,
            packageManager: "Yarn",
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
                platformRoot: undefined,
                docsRoot: undefined,
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
                    assetsSrc: undefined,
                    configuration: undefined
                }
            },
            srcDistReplace: undefined,
            srcDistReplaceWith: undefined,
            buildConfigurations: undefined,
            platforms: undefined
        };
        unitePackageJson = {
            name: "moment",
            version: "0.0.1",
            clientPackages: {},
            routes: {}
        };
        enginePeerPackages = yield fileSystemStub.fileReadJson(fileSystemStub.pathCombine(__dirname, "../../../../node_modules/unitejs-packages/assets/"), "peerPackages.json");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const obj = new fileSystem_mock_1.FileSystemMock();
        yield obj.directoryDelete("./test/unit/temp");
    }));
    describe("run", () => {
        it("can fail when calling with no unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new packageCommand_1.PackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        }));
        it("can fail when calling with undefined application framework", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            uniteJson.applicationFramework = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("applicationFramework");
        }));
        it("can fail when calling with undefined module type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            uniteJson.moduleType = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("moduleType");
        }));
        it("can fail when calling with undefined package manager", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            uniteJson.packageManager = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail when calling with undefined package name", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when calling with file system exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson = null;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("err");
        }));
        it("can fail when unitejs-packages does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            sandbox.stub(packageHelper_1.PackageHelper, "locate").resolves(null);
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
        }));
        it("can fail when package folder does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson = null;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "blah",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not exist");
        }));
        it("can fail when package folder exists but unite-package does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not exist");
        }));
        it("can fail when calling with file system exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson = null;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("err");
        }));
        it("can complete when application framework dir does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            appFrameworkDirExists = false;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail when there is no matching dest folder", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            sandbox.stub(fileSystemStub, "directoryGetFolders").resolves(["blah"]);
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("destination folder");
        }));
        it("can fail if directory create fails", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            sandbox.stub(fileSystemStub, "directoryCreate").rejects(new Error("err"));
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("creating folder");
        }));
        it("can fail if file copy fails", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            sandbox.stub(fileSystemStub, "fileWriteText").rejects(new Error("err"));
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("copying file");
        }));
        it("can complete when directory does not exist already exists", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            examplesDirExists = false;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with no routes", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.routes = {};
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with routes", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.routes = {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                },
                "their/root": {
                    modulePath: "./their/root",
                    moduleType: "TheirRoot"
                }
            };
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args.join()).to.contain("Success");
        }));
        it("can complete with no client packages", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with client packages using profiles", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail with client packages condition missing property", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: undefined,
                    value: "TypeScript"
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("property");
        }));
        it("can fail with client packages condition missing value", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: "sourceLanguage",
                    value: undefined
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("value");
        }));
        it("can complete with client packages matching conditions", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: "sourceLanguage",
                    value: "TypeScript"
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with client packages failing conditions", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: "sourceLanguage",
                    value: "JavaScript"
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with client packages negated conditions", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: "sourceLanguage",
                    value: "JavaScript",
                    negate: true
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with global conditions error", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.conditions = [{
                    property: "sourceLanguage",
                    value: undefined
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not match");
        }));
        it("can complete with failing global conditions", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.conditions = [{
                    property: "sourceLanguage",
                    value: "JavaScript"
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("can not be added");
        }));
        it("can complete with failing negated global conditions", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.conditions = [{
                    property: "sourceLanguage",
                    value: "TypeScript",
                    negate: true
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("can not be added");
        }));
        it("can complete with client packages unknown property", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: "blah",
                    value: "JavaScript"
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with client packages undefined property value", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            unitePackageJson.clientPackages.moment.conditions = [{
                    property: "bundler",
                    value: "Webpack"
                }];
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail with client packages using unknown profiles", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "dfgkjhdfgkjhdfkgjdf";
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("exist");
        }));
        it("can fail with client packages can not lookup package info", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            sandbox.stub(packageUtils_1.PackageUtils, "exec").throws(new Error("err"));
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can complete with client packages without profiles", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.name = "moment";
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with client packages when they are a dev dependency", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(packageUtils_1.PackageUtils, "exec").resolves("{}");
            const obj = new packageCommand_1.PackageCommand();
            unitePackageJson.clientPackages.moment = new unitePackageClientConfiguration_1.UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.name = "moment";
            unitePackageJson.clientPackages.moment.isDevDependency = true;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can complete with nothing else to do", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new packageCommand_1.PackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvcGFja2FnZUNvbW1hbmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLDRFQUF5RTtBQUV6RSx3SUFBcUk7QUFFckkseUVBQXNFO0FBQ3RFLDZFQUEwRTtBQUMxRSx3REFBb0Q7QUFDcEQsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDNUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksZUFBK0IsQ0FBQztJQUNwQyxJQUFJLFNBQTZCLENBQUM7SUFDbEMsSUFBSSxnQkFBMkMsQ0FBQztJQUNoRCxJQUFJLGtCQUEyQyxDQUFDO0lBQ2hELElBQUkscUJBQThCLENBQUM7SUFDbkMsSUFBSSxpQkFBMEIsQ0FBQztJQUUvQixVQUFVLENBQUMsR0FBUyxFQUFFO1FBQ2xCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0IsY0FBYyxHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FBQztRQUU5QyxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7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LENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29tbWFuZHMvcGFja2FnZUNvbW1hbmQuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFBhY2thZ2UgQ29tbWFuZC5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb21tYW5kIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9wYWNrYWdlQ29tbWFuZFwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlUGFja2FnZUNsaWVudENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlUGFja2FnZXMvdW5pdGVQYWNrYWdlQ2xpZW50Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVQYWNrYWdlcy91bml0ZVBhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQYWNrYWdlSGVscGVyIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9oZWxwZXJzL3BhY2thZ2VIZWxwZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VVdGlscyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvcGlwZWxpbmVTdGVwcy9wYWNrYWdlVXRpbHNcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL2ZpbGVTeXN0ZW0ubW9ja1wiO1xuaW1wb3J0IHsgUmVhZE9ubHlGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9yZWFkT25seUZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5kZXNjcmliZShcIlBhY2thZ2VDb21tYW5kXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtU3R1YjogSUZpbGVTeXN0ZW07XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyQmFubmVyU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgdW5pdGVKc29uOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHVuaXRlUGFja2FnZUpzb246IFVuaXRlUGFja2FnZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IGVuZ2luZVBlZXJQYWNrYWdlczogeyBbaWQ6IHN0cmluZ106IHN0cmluZ307XG4gICAgbGV0IGFwcEZyYW1ld29ya0RpckV4aXN0czogYm9vbGVhbjtcbiAgICBsZXQgZXhhbXBsZXNEaXJFeGlzdHM6IGJvb2xlYW47XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveCA9IFNpbm9uLnNhbmRib3guY3JlYXRlKCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5iYW5uZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi53YXJuaW5nID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGZpbGVTeXN0ZW1TdHViID0gbmV3IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2soKTtcblxuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG4gICAgICAgIGxvZ2dlckJhbm5lclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiYmFubmVyXCIpO1xuXG4gICAgICAgIGFwcEZyYW1ld29ya0RpckV4aXN0cyA9IHRydWU7XG4gICAgICAgIGV4YW1wbGVzRGlyRXhpc3RzID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVFeGlzdHMgPSBmaWxlU3lzdGVtU3R1Yi5maWxlRXhpc3RzO1xuICAgICAgICBjb25zdCBzdHViRXhpc3RzID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIik7XG4gICAgICAgIHN0dWJFeGlzdHMuY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLXBhY2thZ2UuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bml0ZVBhY2thZ2VKc29uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxEaXJFeGlzdHMgPSBmaWxlU3lzdGVtU3R1Yi5kaXJlY3RvcnlFeGlzdHM7XG4gICAgICAgIGNvbnN0IHN0dWJEaXJFeGlzdHMgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZGlyZWN0b3J5RXhpc3RzXCIpO1xuICAgICAgICBzdHViRGlyRXhpc3RzLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZm9sZGVyLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgodW5pdGVKc29uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcHBGcmFtZXdvcmtEaXJFeGlzdHMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb2xkZXIuZW5kc1dpdGgoXCJleGFtcGxlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXhhbXBsZXNEaXJFeGlzdHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxEaXJFeGlzdHMoZm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVJlYWRKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRKc29uO1xuICAgICAgICBjb25zdCBzdHVicmVhZEpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpO1xuICAgICAgICBzdHVicmVhZEpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRlSnNvbiA9PT0gbnVsbCA/IFByb21pc2UucmVqZWN0KFwiZXJyXCIpIDogUHJvbWlzZS5yZXNvbHZlKHVuaXRlSnNvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLXBhY2thZ2UuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRlUGFja2FnZUpzb24gPT09IG51bGwgPyBQcm9taXNlLnJlamVjdChcImVyclwiKSA6IFByb21pc2UucmVzb2x2ZSh1bml0ZVBhY2thZ2VKc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVJlYWRKc29uKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB1bml0ZUpzb24gPSB7XG4gICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIlR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiYW1kXCIsXG4gICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIllhcm5cIixcbiAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIkFuZ3VsYXJcIixcbiAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuaXRlVmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc291cmNlRXh0ZW5zaW9uczogW1widHNcIl0sXG4gICAgICAgICAgICB2aWV3RXh0ZW5zaW9uczogW1wiaHRtbFwiXSxcbiAgICAgICAgICAgIHN0eWxlRXh0ZW5zaW9uOiBcInNjc3NcIixcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2VzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkaXJzOiB7XG4gICAgICAgICAgICAgICAgd3d3Um9vdDogXCIuL3d3dy9cIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlZFJvb3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybVJvb3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2NzUm9vdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHd3dzoge1xuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3RTcmM6IFwiLi90ZXN0L3VuaXQvc3JjL1wiLFxuICAgICAgICAgICAgICAgICAgICB1bml0VGVzdERpc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgY3NzU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGNzc0Rpc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgZTJlVGVzdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBlMmVUZXN0U3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGUyZVRlc3REaXN0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBidWlsZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRzU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2VXaXRoOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBidWlsZENvbmZpZ3VyYXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwbGF0Zm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuXG4gICAgICAgIHVuaXRlUGFja2FnZUpzb24gPSB7XG4gICAgICAgICAgICBuYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiLFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHt9LFxuICAgICAgICAgICAgcm91dGVzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGVuZ2luZVBlZXJQYWNrYWdlcyA9IGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjx7IFtpZDogc3RyaW5nIF06IHN0cmluZ30+KFxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy91bml0ZWpzLXBhY2thZ2VzL2Fzc2V0cy9cIiksIFwicGVlclBhY2thZ2VzLmpzb25cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJydW5cIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIG5vIHVuaXRlLmpzb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwibm8gdW5pdGUuanNvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgYXBwbGljYXRpb24gZnJhbWV3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVKc29uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBtb2R1bGUgdHlwZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5tb2R1bGVUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm1vZHVsZVR5cGVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2UgbWFuYWdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wYWNrYWdlTWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTWFuYWdlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgcGFja2FnZSBuYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VOYW1lXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIGZpbGUgc3lzdGVtIGV4Y2VwdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24gPSBudWxsO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJlcnJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiB1bml0ZWpzLXBhY2thZ2VzIGRvZXMgbm90IGV4aXN0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKFBhY2thZ2VIZWxwZXIsIFwibG9jYXRlXCIpLnJlc29sdmVzKG51bGwpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBhY2thZ2UgZm9sZGVyIGRvZXMgbm90IGV4aXN0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbiA9IG51bGw7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJibGFoXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJub3QgZXhpc3RcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwYWNrYWdlIGZvbGRlciBleGlzdHMgYnV0IHVuaXRlLXBhY2thZ2UgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJub3QgZXhpc3RcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggZmlsZSBzeXN0ZW0gZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbiA9IG51bGw7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImVyclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY29tcGxldGUgd2hlbiBhcHBsaWNhdGlvbiBmcmFtZXdvcmsgZGlyIGRvZXMgbm90IGV4aXN0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgYXBwRnJhbWV3b3JrRGlyRXhpc3RzID0gZmFsc2U7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiB0aGVyZSBpcyBubyBtYXRjaGluZyBkZXN0IGZvbGRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcblxuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImRpcmVjdG9yeUdldEZvbGRlcnNcIikucmVzb2x2ZXMoW1wiYmxhaFwiXSk7XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJkZXN0aW5hdGlvbiBmb2xkZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgZGlyZWN0b3J5IGNyZWF0ZSBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcblxuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImRpcmVjdG9yeUNyZWF0ZVwiKS5yZWplY3RzKG5ldyBFcnJvcihcImVyclwiKSk7XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJjcmVhdGluZyBmb2xkZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgZmlsZSBjb3B5IGZhaWxzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuXG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVdyaXRlVGV4dFwiKS5yZWplY3RzKG5ldyBFcnJvcihcImVyclwiKSk7XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJjb3B5aW5nIGZpbGVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdoZW4gZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0IGFscmVhZHkgZXhpc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuXG4gICAgICAgICAgICBleGFtcGxlc0RpckV4aXN0cyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdpdGggbm8gcm91dGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5yb3V0ZXMgPSB7fTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdpdGggcm91dGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5yb3V0ZXMgPSB7XG4gICAgICAgICAgICAgICAgXCJteS9yb3V0ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVBhdGg6IFwiLi9leGFtcGxlcy9teS1yb3V0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIk15Um91dGVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBcInRoZWlyL3Jvb3RcIjoge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVQYXRoOiBcIi4vdGhlaXIvcm9vdFwiLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIlRoZWlyUm9vdFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJncy5qb2luKCkpLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBjb21wbGV0ZSB3aXRoIG5vIGNsaWVudCBwYWNrYWdlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBjb21wbGV0ZSB3aXRoIGNsaWVudCBwYWNrYWdlcyB1c2luZyBwcm9maWxlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcm9maWxlID0gXCJtb21lbnRcIjtcblxuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIGNsaWVudCBwYWNrYWdlcyBjb25kaXRpb24gbWlzc2luZyBwcm9wZXJ0eVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcm9maWxlID0gXCJtb21lbnRcIjtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50LmNvbmRpdGlvbnMgPSBbIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIlR5cGVTY3JpcHRcIlxuICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicHJvcGVydHlcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBjbGllbnQgcGFja2FnZXMgY29uZGl0aW9uIG1pc3NpbmcgdmFsdWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlc29sdmVzKFwie31cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQgPSBuZXcgVW5pdGVQYWNrYWdlQ2xpZW50Q29uZmlndXJhdGlvbigpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQucHJvZmlsZSA9IFwibW9tZW50XCI7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5jb25kaXRpb25zID0gWyB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IFwic291cmNlTGFuZ3VhZ2VcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9XTtcblxuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ2YWx1ZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY29tcGxldGUgd2l0aCBjbGllbnQgcGFja2FnZXMgbWF0Y2hpbmcgY29uZGl0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcm9maWxlID0gXCJtb21lbnRcIjtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50LmNvbmRpdGlvbnMgPSBbIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogXCJzb3VyY2VMYW5ndWFnZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIlR5cGVTY3JpcHRcIlxuICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdpdGggY2xpZW50IHBhY2thZ2VzIGZhaWxpbmcgY29uZGl0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcm9maWxlID0gXCJtb21lbnRcIjtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50LmNvbmRpdGlvbnMgPSBbIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogXCJzb3VyY2VMYW5ndWFnZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIkphdmFTY3JpcHRcIlxuICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdpdGggY2xpZW50IHBhY2thZ2VzIG5lZ2F0ZWQgY29uZGl0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcm9maWxlID0gXCJtb21lbnRcIjtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50LmNvbmRpdGlvbnMgPSBbIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogXCJzb3VyY2VMYW5ndWFnZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBuZWdhdGU6IHRydWVcbiAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBjb21wbGV0ZSB3aXRoIGdsb2JhbCBjb25kaXRpb25zIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKS5yZXNvbHZlcyhcInt9XCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY29uZGl0aW9ucyA9IFsge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5OiBcInNvdXJjZUxhbmd1YWdlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiQ2FuIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY29tcGxldGUgd2l0aCBmYWlsaW5nIGdsb2JhbCBjb25kaXRpb25zXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKS5yZXNvbHZlcyhcInt9XCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY29uZGl0aW9ucyA9IFsge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5OiBcInNvdXJjZUxhbmd1YWdlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IFwiSmF2YVNjcmlwdFwiXG4gICAgICAgICAgICB9XTtcblxuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJjYW4gbm90IGJlIGFkZGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBjb21wbGV0ZSB3aXRoIGZhaWxpbmcgbmVnYXRlZCBnbG9iYWwgY29uZGl0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNvbmRpdGlvbnMgPSBbIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogXCJzb3VyY2VMYW5ndWFnZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIlR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBuZWdhdGU6IHRydWVcbiAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNhbiBub3QgYmUgYWRkZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdpdGggY2xpZW50IHBhY2thZ2VzIHVua25vd24gcHJvcGVydHlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnJlc29sdmVzKFwie31cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQgPSBuZXcgVW5pdGVQYWNrYWdlQ2xpZW50Q29uZmlndXJhdGlvbigpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQucHJvZmlsZSA9IFwibW9tZW50XCI7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5jb25kaXRpb25zID0gWyB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IFwiYmxhaFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIkphdmFTY3JpcHRcIlxuICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGNvbXBsZXRlIHdpdGggY2xpZW50IHBhY2thZ2VzIHVuZGVmaW5lZCBwcm9wZXJ0eSB2YWx1ZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcm9maWxlID0gXCJtb21lbnRcIjtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50LmNvbmRpdGlvbnMgPSBbIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogXCJidW5kbGVyXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IFwiV2VicGFja1wiXG4gICAgICAgICAgICB9XTtcblxuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIGNsaWVudCBwYWNrYWdlcyB1c2luZyB1bmtub3duIHByb2ZpbGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQgPSBuZXcgVW5pdGVQYWNrYWdlQ2xpZW50Q29uZmlndXJhdGlvbigpO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQucHJvZmlsZSA9IFwiZGZna2poZGZna2poZGZrZ2pkZlwiO1xuXG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImV4aXN0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggY2xpZW50IHBhY2thZ2VzIGNhbiBub3QgbG9va3VwIHBhY2thZ2UgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50ID0gbmV3IFVuaXRlUGFja2FnZUNsaWVudENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50LnByb2ZpbGUgPSBcIm1vbWVudFwiO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpLnRocm93cyhuZXcgRXJyb3IoXCJlcnJcIikpO1xuXG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY29tcGxldGUgd2l0aCBjbGllbnQgcGFja2FnZXMgd2l0aG91dCBwcm9maWxlc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIikucmVzb2x2ZXMoXCJ7fVwiKTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudCA9IG5ldyBVbml0ZVBhY2thZ2VDbGllbnRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICB1bml0ZVBhY2thZ2VKc29uLmNsaWVudFBhY2thZ2VzLm1vbWVudC5uYW1lID0gXCJtb21lbnRcIjtcblxuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY29tcGxldGUgd2l0aCBjbGllbnQgcGFja2FnZXMgd2hlbiB0aGV5IGFyZSBhIGRldiBkZXBlbmRlbmN5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKS5yZXNvbHZlcyhcInt9XCIpO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50ID0gbmV3IFVuaXRlUGFja2FnZUNsaWVudENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgICAgIHVuaXRlUGFja2FnZUpzb24uY2xpZW50UGFja2FnZXMubW9tZW50Lm5hbWUgPSBcIm1vbWVudFwiO1xuICAgICAgICAgICAgdW5pdGVQYWNrYWdlSnNvbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaXNEZXZEZXBlbmRlbmN5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gY29tcGxldGUgd2l0aCBub3RoaW5nIGVsc2UgdG8gZG9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
