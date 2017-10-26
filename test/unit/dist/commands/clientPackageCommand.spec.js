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
 * Tests for Build Configuration Command.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const clientPackageCommand_1 = require("../../../../dist/commands/clientPackageCommand");
const uniteClientPackage_1 = require("../../../../dist/configuration/models/unite/uniteClientPackage");
const packageUtils_1 = require("../../../../dist/pipelineSteps/packageUtils");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("ClientPackageCommand", () => {
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
            ides: [],
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
    describe("clientPackage add", () => {
        it("can fail when calling with no unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                packageName: undefined,
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        }));
        it("can fail when calling with undefined operation", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                packageName: undefined,
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        }));
        it("can fail when calling with undefined packageName", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: undefined,
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when calling with undefined packageManager", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.packageManager = undefined;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail if invalid includeMode", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "foo",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("includeMode");
        }));
        it("can fail if invalid scriptIncludeMode", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: "foo",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("scriptIncludeMode");
        }));
        it("can fail if main and noScript", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: "main.js",
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("main and noScript");
        }));
        it("can fail if mainMinified and noScript", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("mainMinified and noScript");
        }));
        it("can fail if package already exists", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("already");
        }));
        it("can fail if packageManager gets info errors", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = null;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Package Information");
        }));
        it("can fail if pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            fileWriteJsonErrors = true;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can fail with badly formed testAdditions", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: ["sdfgsd"],
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failure");
        }));
        it("can fail when package add fails", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            failPackageAdd = true;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can succeed with just profile", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = JSON.stringify({ version: "1.2.3" });
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: undefined,
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
                profile: "bluebird",
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.main).to.be.equal("/js/browser/bluebird.js");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.mainMinified).to.be.equal("/js/browser/bluebird.min.js");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.scriptIncludeMode).to.be.equal("both");
        }));
        it("can succeed with no packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^0.0.1");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal(undefined);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
        }));
        it("can succeed with noScript", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "app",
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal(undefined);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        }));
        it("can succeed with packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "app",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        }));
        it("can succeed with override version packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: "4.5.6",
                preload: undefined,
                includeMode: "app",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        }));
        it("can succeed with override main packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "test",
                scriptIncludeMode: "none",
                main: "main.js",
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("test");
        }));
        it("can succeed with override main and version packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: "4.5.6",
                preload: undefined,
                includeMode: "test",
                scriptIncludeMode: "none",
                main: "main.js",
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("test");
        }));
        it("can succeed with override mainMinified and version packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("mainMinified.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
        }));
        it("can succeed with all parameters", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "moment",
                version: "7.8.9",
                preload: true,
                includeMode: "both",
                scriptIncludeMode: "none",
                main: "1.js",
                mainMinified: "2.js",
                testingAdditions: ["my-pkg=blah", "my-pkg3=foo"],
                isPackage: true,
                assets: ["**/*.css", "**/*.otf"],
                map: ["a=b", "c=d"],
                loaders: ["text=*.html", "css=*.css"],
                noScript: undefined,
                profile: undefined,
                transpileAlias: "TAlias",
                transpileLanguage: "JavaScript",
                transpileSrc: ["src/**/*.js"],
                transpileTransforms: ["a", "b"],
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.moment.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteJsonWritten.clientPackages.moment.testingAdditions).to.be.deep.equal({ "my-pkg": "blah", "my-pkg3": "foo" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.isPackage).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.assets).to.be.deep.equal(["**/*.css", "**/*.otf"]);
            Chai.expect(uniteJsonWritten.clientPackages.moment.map).to.be.deep.equal({ a: "b", c: "d" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.loaders).to.be.deep.equal({ text: "*.html", css: "*.css" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.transpileAlias).to.be.equal("TAlias");
            Chai.expect(uniteJsonWritten.clientPackages.moment.transpileLanguage).to.be.equal("JavaScript");
            Chai.expect(uniteJsonWritten.clientPackages.moment.transpileSrc).to.be.deep.equal(["src/**/*.js"]);
            Chai.expect(uniteJsonWritten.clientPackages.moment.transpileTransforms).to.be.deep.equal({ a: "b" });
        }));
    });
    describe("clientPackage remove", () => {
        it("can fail when calling with no unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                packageName: undefined,
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        }));
        it("can fail when calling with undefined operation", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: undefined,
                packageName: undefined,
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        }));
        it("can fail when calling with undefined packageName", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                packageName: undefined,
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when calling with undefined packageManager", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.packageManager = undefined;
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail if package does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not been");
        }));
        it("can fail if pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            fileWriteJsonErrors = true;
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can succeed if all ok", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { moment: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
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
                outputDirectory: undefined,
                transpileAlias: undefined,
                transpileLanguage: undefined,
                transpileSrc: undefined,
                transpileTransforms: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHdGQUFxRjtBQUNyRixzR0FBbUc7QUFFbkcsNkVBQTBFO0FBQzFFLHdEQUFvRDtBQUNwRCx3RUFBb0U7QUFFcEUsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxhQUE2QixDQUFDO0lBQ2xDLElBQUksZ0JBQWdDLENBQUM7SUFDckMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksU0FBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFvQyxDQUFDO0lBQ3pDLElBQUksaUJBQTBCLENBQUM7SUFDL0IsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksbUJBQTRCLENBQUM7SUFDakMsSUFBSSxXQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBdUIsQ0FBQztJQUM1QixJQUFJLGtCQUEyQyxDQUFDO0lBRWhELFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMs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WyIvKipcbiAqIFRlc3RzIGZvciBCdWlsZCBDb25maWd1cmF0aW9uIENvbW1hbmQuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBDbGllbnRQYWNrYWdlQ29tbWFuZCB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmRcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlsc1wiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5pbXBvcnQgeyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL3JlYWRPbmx5RmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiQ2xpZW50UGFja2FnZUNvbW1hbmRcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJJbmZvU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyV2FybmluZ1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlckJhbm5lclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IHVuaXRlSnNvbjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCB1bml0ZUpzb25Xcml0dGVuOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHBhY2thZ2VKc29uRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBzcGR4RXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBmaWxlV3JpdGVKc29uRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBwYWNrYWdlSW5mbzogc3RyaW5nO1xuICAgIGxldCBmYWlsUGFja2FnZUFkZDogYm9vbGVhbjtcbiAgICBsZXQgZW5naW5lUGVlclBhY2thZ2VzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nfTtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmJhbm5lciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLndhcm5pbmcgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcbiAgICAgICAgbG9nZ2VySW5mb1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiaW5mb1wiKTtcbiAgICAgICAgbG9nZ2VyV2FybmluZ1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwid2FybmluZ1wiKTtcbiAgICAgICAgbG9nZ2VyQmFubmVyU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJiYW5uZXJcIik7XG5cbiAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICBwYWNrYWdlSnNvbkVycm9ycyA9IGZhbHNlO1xuICAgICAgICBzcGR4RXJyb3JzID0gZmFsc2U7XG4gICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgcGFja2FnZUluZm8gPSB1bmRlZmluZWQ7XG4gICAgICAgIHVuaXRlSnNvbldyaXR0ZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIGZhaWxQYWNrYWdlQWRkID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXhpc3RzID0gZmlsZVN5c3RlbVN0dWIuZmlsZUV4aXN0cztcbiAgICAgICAgY29uc3Qgc3R1YkV4aXN0cyA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpO1xuICAgICAgICBzdHViRXhpc3RzLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlUmVhZEpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb247XG4gICAgICAgIGNvbnN0IHN0dWJyZWFkSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIik7XG4gICAgICAgIHN0dWJyZWFkSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pdGVKc29uID09PSBudWxsID8gUHJvbWlzZS5yZWplY3QoXCJlcnJcIikgOiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVJlYWRKc29uKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlV3JpdGVKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlSnNvbjtcbiAgICAgICAgY29uc3Qgc3R1YldyaXRlSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlV3JpdGVKc29uXCIpO1xuICAgICAgICBzdHViV3JpdGVKc29uLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSwgb2JqKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZVdyaXRlSnNvbkVycm9ycykge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRlSnNvbldyaXR0ZW4gPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlV3JpdGVKc29uKGZvbGRlciwgZmlsZW5hbWUsIG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBleGVjU3R1YiA9IHNhbmRib3guc3R1YihQYWNrYWdlVXRpbHMsIFwiZXhlY1wiKTtcbiAgICAgICAgZXhlY1N0dWIuY2FsbHNGYWtlKGFzeW5jIChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXJnc1swXSA9PT0gXCJ2aWV3XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFja2FnZUluZm8gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwicGFja2FnZSBpbmZvcm1hdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhY2thZ2VJbmZvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWlsUGFja2FnZUFkZCA/IFByb21pc2UucmVqZWN0KFwiZXJyb3JcIikgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdW5pdGVKc29uID0ge1xuICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgdGl0bGU6IFwiTXkgQXBwXCIsXG4gICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJZYXJuXCIsXG4gICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICBpZGVzOiBbXSxcbiAgICAgICAgICAgIHVuaXRlVmVyc2lvbjogXCIwLjAuMFwiLFxuICAgICAgICAgICAgc291cmNlRXh0ZW5zaW9uczogW10sXG4gICAgICAgICAgICB2aWV3RXh0ZW5zaW9uczogW10sXG4gICAgICAgICAgICBzdHlsZUV4dGVuc2lvbjogXCJcIixcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2VzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkaXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2VXaXRoOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBidWlsZENvbmZpZ3VyYXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwbGF0Zm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuXG4gICAgICAgIGVuZ2luZVBlZXJQYWNrYWdlcyA9IGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjx7IFtpZDogc3RyaW5nIF06IHN0cmluZ30+KGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9hc3NldHMvXCIpLCBcInBlZXJQYWNrYWdlcy5qc29uXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiY2xpZW50UGFja2FnZSBhZGRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIG5vIHVuaXRlLmpzb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm5vIHVuaXRlLmpzb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIG9wZXJhdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwib3BlcmF0aW9uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBwYWNrYWdlTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VOYW1lXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBwYWNrYWdlTWFuYWdlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24ucGFja2FnZU1hbmFnZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTWFuYWdlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBpbnZhbGlkIGluY2x1ZGVNb2RlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgbW9tZW50OiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IDxhbnk+XCJmb29cIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImluY2x1ZGVNb2RlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIGludmFsaWQgc2NyaXB0SW5jbHVkZU1vZGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBtb21lbnQ6IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiA8YW55PlwiZm9vXCIsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwic2NyaXB0SW5jbHVkZU1vZGVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgbWFpbiBhbmQgbm9TY3JpcHRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBtb21lbnQ6IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwibWFpbiBhbmQgbm9TY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgbWFpbk1pbmlmaWVkIGFuZCBub1NjcmlwdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IG1vbWVudDogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW5NaW5pZmllZC5qc1wiLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm1haW5NaW5pZmllZCBhbmQgbm9TY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGFja2FnZSBhbHJlYWR5IGV4aXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IG1vbWVudDogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJhbHJlYWR5XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIHBhY2thZ2VNYW5hZ2VyIGdldHMgaW5mbyBlcnJvcnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBudWxsO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiUGFja2FnZSBJbmZvcm1hdGlvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBwaXBlbGluZSBzdGVwIGZhaWxzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgZmlsZVdyaXRlSnNvbkVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW5NaW5pZmllZC5qc1wiLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggYmFkbHkgZm9ybWVkIHRlc3RBZGRpdGlvbnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogW1wic2RmZ3NkXCJdLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsdXJlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGFja2FnZSBhZGQgZmFpbHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBmYWlsUGFja2FnZUFkZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBqdXN0IHByb2ZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMS4yLjNcIiB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcImJsdWViaXJkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLmJsdWViaXJkLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5tYWluKS50by5iZS5lcXVhbChcIi9qcy9icm93c2VyL2JsdWViaXJkLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwiL2pzL2Jyb3dzZXIvYmx1ZWJpcmQubWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJib3RoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJib3RoXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggbm8gcGFja2FnZU1hbmFnZXIgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMC4wLjFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwiYm90aFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG5vU2NyaXB0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbikudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIHBhY2thZ2VNYW5hZ2VyIGluZm9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50Lm1haW4pLnRvLmJlLmVxdWFsKFwiaW5kZXguanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBvdmVycmlkZSB2ZXJzaW9uIHBhY2thZ2VNYW5hZ2VyIGluZm9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjQuNS42XCIsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC52ZXJzaW9uKS50by5iZS5lcXVhbChcIjQuNS42XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbikudG8uYmUuZXF1YWwoXCJpbmRleC5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG92ZXJyaWRlIG1haW4gcGFja2FnZU1hbmFnZXIgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwidGVzdFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbChcIm1haW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJ0ZXN0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggb3ZlcnJpZGUgbWFpbiBhbmQgdmVyc2lvbiBwYWNrYWdlTWFuYWdlciBpbmZvXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogXCI0LjUuNlwiLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC52ZXJzaW9uKS50by5iZS5lcXVhbChcIjQuNS42XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbikudG8uYmUuZXF1YWwoXCJtYWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwidGVzdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG92ZXJyaWRlIG1haW5NaW5pZmllZCBhbmQgdmVyc2lvbiBwYWNrYWdlTWFuYWdlciBpbmZvXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluTWluaWZpZWQuanNcIixcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbChcImluZGV4LmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbk1pbmlmaWVkKS50by5iZS5lcXVhbChcIm1haW5NaW5pZmllZC5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImJvdGhcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBhbGwgcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IFwiNy44LjlcIixcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFpbjogXCIxLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIjIuanNcIixcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiBbXCJteS1wa2c9YmxhaFwiLCBcIm15LXBrZzM9Zm9vXCJdLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhc3NldHM6IFtcIioqLyouY3NzXCIsIFwiKiovKi5vdGZcIl0sXG4gICAgICAgICAgICAgICAgbWFwOiBbXCJhPWJcIiwgXCJjPWRcIl0sXG4gICAgICAgICAgICAgICAgbG9hZGVyczogW1widGV4dD0qLmh0bWxcIiwgXCJjc3M9Ki5jc3NcIl0sXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IFwiVEFsaWFzXCIsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogW1wic3JjLyoqLyouanNcIl0sXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogW1wiYVwiLCBcImJcIl0sXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCI3LjguOVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnByZWxvYWQpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwiYm90aFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50Lm1haW4pLnRvLmJlLmVxdWFsKFwiMS5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50Lm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCIyLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuc2NyaXB0SW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwibm9uZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnRlc3RpbmdBZGRpdGlvbnMpLnRvLmJlLmRlZXAuZXF1YWwoeyBcIm15LXBrZ1wiOiBcImJsYWhcIiwgXCJteS1wa2czXCI6IFwiZm9vXCIgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5pc1BhY2thZ2UpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuYXNzZXRzKS50by5iZS5kZWVwLmVxdWFsKFtcIioqLyouY3NzXCIsIFwiKiovKi5vdGZcIl0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFwKS50by5iZS5kZWVwLmVxdWFsKHsgYTogXCJiXCIsIGM6IFwiZFwiIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubG9hZGVycykudG8uYmUuZGVlcC5lcXVhbCh7IHRleHQ6IFwiKi5odG1sXCIsIGNzczogXCIqLmNzc1wiIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudHJhbnNwaWxlQWxpYXMpLnRvLmJlLmVxdWFsKFwiVEFsaWFzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudHJhbnNwaWxlTGFuZ3VhZ2UpLnRvLmJlLmVxdWFsKFwiSmF2YVNjcmlwdFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnRyYW5zcGlsZVNyYykudG8uYmUuZGVlcC5lcXVhbChbXCJzcmMvKiovKi5qc1wiXSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC50cmFuc3BpbGVUcmFuc2Zvcm1zKS50by5iZS5kZWVwLmVxdWFsKHsgYTogXCJiXCIgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjbGllbnRQYWNrYWdlIHJlbW92ZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggbm8gdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwibm8gdW5pdGUuanNvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgb3BlcmF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJvcGVyYXRpb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VOYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wYWNrYWdlTWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VNYW5hZ2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIHBhY2thZ2UgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwibm90IGJlZW5cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGlwZWxpbmUgc3RlcCBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlV3JpdGVKc29uRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgbW9tZW50OiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIGlmIGFsbCBva1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IG1vbWVudDogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl19
