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
                testingAdditions: "sdfgsd",
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
                testingAdditions: "my-pkg=blah,my-pkg3=foo",
                isPackage: true,
                assets: "**/*.css",
                map: "a=b,c=d",
                loaders: "text=*.html,css=*.css",
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
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.moment.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteJsonWritten.clientPackages.moment.testingAdditions).to.be.deep.equal({ "my-pkg": "blah", "my-pkg3": "foo" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.isPackage).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.assets).to.be.equal("**/*.css");
            Chai.expect(uniteJsonWritten.clientPackages.moment.map).to.be.deep.equal({ a: "b", c: "d" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.loaders).to.be.deep.equal({ text: "*.html", css: "*.css" });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHdGQUFxRjtBQUNyRixzR0FBbUc7QUFFbkcsNkVBQTBFO0FBQzFFLHdEQUFvRDtBQUNwRCx3RUFBb0U7QUFFcEUsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxhQUE2QixDQUFDO0lBQ2xDLElBQUksZ0JBQWdDLENBQUM7SUFDckMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksU0FBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFvQyxDQUFDO0lBQ3pDLElBQUksaUJBQTBCLENBQUM7SUFDL0IsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksbUJBQTRCLENBQUM7SUFDakMsSUFBSSxXQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBdUIsQ0FBQztJQUM1QixJQUFJLGtCQUEyQyxDQUFDO0lBRWhELFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMs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LENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmQuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIEJ1aWxkIENvbmZpZ3VyYXRpb24gQ29tbWFuZC5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0ICogYXMgU2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IENsaWVudFBhY2thZ2VDb21tYW5kIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9jbGllbnRQYWNrYWdlQ29tbWFuZFwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL3BpcGVsaW5lU3RlcHMvcGFja2FnZVV0aWxzXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9maWxlU3lzdGVtLm1vY2tcIjtcbmltcG9ydCB7IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vcmVhZE9ubHlGaWxlU3lzdGVtLm1vY2tcIjtcblxuZGVzY3JpYmUoXCJDbGllbnRQYWNrYWdlQ29tbWFuZFwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbVN0dWI6IElGaWxlU3lzdGVtO1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlckluZm9TcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJXYXJuaW5nU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyQmFubmVyU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgdW5pdGVKc29uOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHVuaXRlSnNvbldyaXR0ZW46IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgcGFja2FnZUpzb25FcnJvcnM6IGJvb2xlYW47XG4gICAgbGV0IHNwZHhFcnJvcnM6IGJvb2xlYW47XG4gICAgbGV0IGZpbGVXcml0ZUpzb25FcnJvcnM6IGJvb2xlYW47XG4gICAgbGV0IHBhY2thZ2VJbmZvOiBzdHJpbmc7XG4gICAgbGV0IGZhaWxQYWNrYWdlQWRkOiBib29sZWFuO1xuICAgIGxldCBlbmdpbmVQZWVyUGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmd9O1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCk7XG5cbiAgICAgICAgbG9nZ2VyRXJyb3JTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImVycm9yXCIpO1xuICAgICAgICBsb2dnZXJJbmZvU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJpbmZvXCIpO1xuICAgICAgICBsb2dnZXJXYXJuaW5nU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJ3YXJuaW5nXCIpO1xuICAgICAgICBsb2dnZXJCYW5uZXJTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImJhbm5lclwiKTtcblxuICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHBhY2thZ2VKc29uRXJyb3JzID0gZmFsc2U7XG4gICAgICAgIHNwZHhFcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgZmlsZVdyaXRlSnNvbkVycm9ycyA9IGZhbHNlO1xuICAgICAgICBwYWNrYWdlSW5mbyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdW5pdGVKc29uV3JpdHRlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgZmFpbFBhY2thZ2VBZGQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVFeGlzdHMgPSBmaWxlU3lzdGVtU3R1Yi5maWxlRXhpc3RzO1xuICAgICAgICBjb25zdCBzdHViRXhpc3RzID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIik7XG4gICAgICAgIHN0dWJFeGlzdHMuY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVSZWFkSnNvbiA9IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjtcbiAgICAgICAgY29uc3Qgc3R1YnJlYWRKc29uID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKTtcbiAgICAgICAgc3R1YnJlYWRKc29uLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bml0ZUpzb24gPT09IG51bGwgPyBQcm9taXNlLnJlamVjdChcImVyclwiKSA6IFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlUmVhZEpzb24oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVXcml0ZUpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVKc29uO1xuICAgICAgICBjb25zdCBzdHViV3JpdGVKc29uID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVXcml0ZUpzb25cIik7XG4gICAgICAgIHN0dWJXcml0ZUpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lLCBvYmopID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlV3JpdGVKc29uRXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdGVKc29uV3JpdHRlbiA9IG9iajtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVXcml0ZUpzb24oZm9sZGVyLCBmaWxlbmFtZSwgb2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGV4ZWNTdHViID0gc2FuZGJveC5zdHViKFBhY2thZ2VVdGlscywgXCJleGVjXCIpO1xuICAgICAgICBleGVjU3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgYXJnczogc3RyaW5nW10pID0+IHtcbiAgICAgICAgICAgIGlmIChhcmdzWzBdID09PSBcInZpZXdcIikge1xuICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlSW5mbyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJwYWNrYWdlIGluZm9ybWF0aW9uXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocGFja2FnZUluZm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhaWxQYWNrYWdlQWRkID8gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB1bml0ZUpzb24gPSB7XG4gICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICB0aXRsZTogXCJNeSBBcHBcIixcbiAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIllhcm5cIixcbiAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgIGlkZXM6IFtdLFxuICAgICAgICAgICAgdW5pdGVWZXJzaW9uOiBcIjAuMC4wXCIsXG4gICAgICAgICAgICBzb3VyY2VFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHZpZXdFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHN0eWxlRXh0ZW5zaW9uOiBcIlwiLFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRpcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZVdpdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJ1aWxkQ29uZmlndXJhdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBsYXRmb3JtczogdW5kZWZpbmVkXG4gICAgICAgIH07XG5cbiAgICAgICAgZW5naW5lUGVlclBhY2thZ2VzID0gYXdhaXQgZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRKc29uPHsgW2lkOiBzdHJpbmcgXTogc3RyaW5nfT4oZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL2Fzc2V0cy9cIiksIFwicGVlclBhY2thZ2VzLmpzb25cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjbGllbnRQYWNrYWdlIGFkZFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggbm8gdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwibm8gdW5pdGUuanNvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgb3BlcmF0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJvcGVyYXRpb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VOYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wYWNrYWdlTWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VNYW5hZ2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIGludmFsaWQgaW5jbHVkZU1vZGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBtb21lbnQ6IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogPGFueT5cImZvb1wiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiaW5jbHVkZU1vZGVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgaW52YWxpZCBzY3JpcHRJbmNsdWRlTW9kZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IG1vbWVudDogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IDxhbnk+XCJmb29cIixcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJzY3JpcHRJbmNsdWRlTW9kZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBtYWluIGFuZCBub1NjcmlwdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IG1vbWVudDogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJtYWluIGFuZCBub1NjcmlwdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBtYWluTWluaWZpZWQgYW5kIG5vU2NyaXB0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgbW9tZW50OiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbk1pbmlmaWVkLmpzXCIsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwibWFpbk1pbmlmaWVkIGFuZCBub1NjcmlwdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBwYWNrYWdlIGFscmVhZHkgZXhpc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgbW9tZW50OiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImFscmVhZHlcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGFja2FnZU1hbmFnZXIgZ2V0cyBpbmZvIGVycm9yc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJQYWNrYWdlIEluZm9ybWF0aW9uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIHBpcGVsaW5lIHN0ZXAgZmFpbHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBmaWxlV3JpdGVKc29uRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbk1pbmlmaWVkLmpzXCIsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBiYWRseSBmb3JtZWQgdGVzdEFkZGl0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiBcInNkZmdzZFwiLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsdXJlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGFja2FnZSBhZGQgZmFpbHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBmYWlsUGFja2FnZUFkZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBqdXN0IHByb2ZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IFwiMS4yLjNcIiB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcImJsdWViaXJkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLmJsdWViaXJkLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5tYWluKS50by5iZS5lcXVhbChcIi9qcy9icm93c2VyL2JsdWViaXJkLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwiL2pzL2Jyb3dzZXIvYmx1ZWJpcmQubWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJib3RoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJib3RoXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggbm8gcGFja2FnZU1hbmFnZXIgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwie31cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMC4wLjFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwiYm90aFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG5vU2NyaXB0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbikudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIHBhY2thZ2VNYW5hZ2VyIGluZm9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50Lm1haW4pLnRvLmJlLmVxdWFsKFwiaW5kZXguanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBvdmVycmlkZSB2ZXJzaW9uIHBhY2thZ2VNYW5hZ2VyIGluZm9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjQuNS42XCIsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC52ZXJzaW9uKS50by5iZS5lcXVhbChcIjQuNS42XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbikudG8uYmUuZXF1YWwoXCJpbmRleC5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImFwcFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG92ZXJyaWRlIG1haW4gcGFja2FnZU1hbmFnZXIgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwidGVzdFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtYWluOiBcIm1haW4uanNcIixcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbChcIm1haW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJ0ZXN0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggb3ZlcnJpZGUgbWFpbiBhbmQgdmVyc2lvbiBwYWNrYWdlTWFuYWdlciBpbmZvXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogXCI0LjUuNlwiLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC52ZXJzaW9uKS50by5iZS5lcXVhbChcIjQuNS42XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbikudG8uYmUuZXF1YWwoXCJtYWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwidGVzdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG92ZXJyaWRlIG1haW5NaW5pZmllZCBhbmQgdmVyc2lvbiBwYWNrYWdlTWFuYWdlciBpbmZvXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluTWluaWZpZWQuanNcIixcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbChcImluZGV4LmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQubWFpbk1pbmlmaWVkKS50by5iZS5lcXVhbChcIm1haW5NaW5pZmllZC5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImJvdGhcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBhbGwgcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm1vbWVudFwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IFwiNy44LjlcIixcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFpbjogXCIxLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIjIuanNcIixcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiBcIm15LXBrZz1ibGFoLG15LXBrZzM9Zm9vXCIsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFzc2V0czogXCIqKi8qLmNzc1wiLFxuICAgICAgICAgICAgICAgIG1hcDogXCJhPWIsYz1kXCIsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogXCJ0ZXh0PSouaHRtbCxjc3M9Ki5jc3NcIixcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiNy44LjlcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5wcmVsb2FkKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImJvdGhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluKS50by5iZS5lcXVhbChcIjEuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwiMi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LnNjcmlwdEluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcIm5vbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLm1vbWVudC50ZXN0aW5nQWRkaXRpb25zKS50by5iZS5kZWVwLmVxdWFsKHsgXCJteS1wa2dcIjogXCJibGFoXCIsIFwibXktcGtnM1wiOiBcImZvb1wiIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5tb21lbnQuaXNQYWNrYWdlKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmFzc2V0cykudG8uYmUuZXF1YWwoXCIqKi8qLmNzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50Lm1hcCkudG8uYmUuZGVlcC5lcXVhbCh7IGE6IFwiYlwiLCBjOiBcImRcIiB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMubW9tZW50LmxvYWRlcnMpLnRvLmJlLmRlZXAuZXF1YWwoeyB0ZXh0OiBcIiouaHRtbFwiLCBjc3M6IFwiKi5jc3NcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNsaWVudFBhY2thZ2UgcmVtb3ZlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBubyB1bml0ZS5qc29uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJubyB1bml0ZS5qc29uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBvcGVyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlQWxpYXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVNyYzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZVRyYW5zZm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm9wZXJhdGlvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgcGFja2FnZU5hbWVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTmFtZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgcGFja2FnZU1hbmFnZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLnBhY2thZ2VNYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU1hbmFnZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGFja2FnZSBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJub3QgYmVlblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBwaXBlbGluZSBzdGVwIGZhaWxzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBtb21lbnQ6IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKSB9O1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJtb21lbnRcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUFsaWFzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVTcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVUcmFuc2Zvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgaWYgYWxsIG9rXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgbW9tZW50OiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibW9tZW50XCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0cmFuc3BpbGVBbGlhczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRyYW5zcGlsZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlU3JjOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdHJhbnNwaWxlVHJhbnNmb3JtczogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
