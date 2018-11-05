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
    let loggerBannerSpy;
    let uniteJson;
    let uniteJsonWritten;
    let fileWriteJsonErrors;
    let packageInfo;
    let failPackageAdd;
    let enginePeerPackages;
    let profiles;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.createSandbox();
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
        packageInfo = undefined;
        uniteJsonWritten = undefined;
        failPackageAdd = false;
        profiles = undefined;
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
            else if (filename === "clientPackage.json") {
                return profiles ? Promise.resolve(profiles) : originalFileReadJson(folder, filename);
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
            cssLinter: "None",
            documenter: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "Vanilla",
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
        enginePeerPackages = yield fileSystemStub.fileReadJson(fileSystemStub.pathCombine(__dirname, "../../../../node_modules/unitejs-packages/assets/"), "peerPackages.json");
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail if invalid includeMode", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: "foo",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("includeMode");
        }));
        it("can fail if invalid scriptIncludeMode", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: "foo",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("scriptIncludeMode");
        }));
        it("can fail if main and noScript", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: "main.js",
                mainMinified: undefined,
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("main and noScript");
        }));
        it("can fail if mainMinified and noScript", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("mainMinified and noScript");
        }));
        it("can fail if package already exists", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
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
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
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
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                mainLib: undefined,
                testingAdditions: ["sdfgsd"],
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: "bluebird",
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.main).to.be.equal("/js/browser/bluebird.js");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.mainMinified).to.be.equal("/js/browser/bluebird.min.js");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.scriptIncludeMode).to.be.equal("both");
        }));
        it("can fail with unknown profile", () => __awaiter(this, void 0, void 0, function* () {
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: "blah",
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("does not exist");
        }));
        it("can succeed with no packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("^0.0.1");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("*");
        }));
        it("can succeed with noScript", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: "app",
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal(undefined);
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("app");
        }));
        it("can succeed with packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: "app",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("app");
        }));
        it("can succeed with override version packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: "4.5.6",
                preload: undefined,
                includeMode: "app",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("app");
        }));
        it("can succeed with override main packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: "test",
                scriptIncludeMode: "none",
                main: "main.js",
                mainMinified: undefined,
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("test");
        }));
        it("can succeed with override main and version packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: "4.5.6",
                preload: undefined,
                includeMode: "test",
                scriptIncludeMode: "none",
                main: "main.js",
                mainMinified: undefined,
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("test");
        }));
        it("can succeed with override mainMinified and version packageManager info", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainMinified).to.be.equal("mainMinified.js");
        }));
        it("can succeed with all parameters", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "add",
                packageName: "package",
                version: "7.8.9",
                preload: true,
                includeMode: "both",
                scriptIncludeMode: "none",
                main: "1.js",
                mainMinified: "2.js",
                mainLib: ["a/**/*.js", "b/**/*.js"],
                testingAdditions: ["my-pkg=blah", "my-pkg3=foo"],
                isPackage: true,
                assets: ["**/*.css", "**/*.otf"],
                map: ["a=b", "c=d"],
                loaders: ["text=*.html", "css=*.css"],
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.package.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainLib).to.be.deep.equal(["a/**/*.js", "b/**/*.js"]);
            Chai.expect(uniteJsonWritten.clientPackages.package.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteJsonWritten.clientPackages.package.testingAdditions).to.be.deep.equal({ "my-pkg": "blah", "my-pkg3": "foo" });
            Chai.expect(uniteJsonWritten.clientPackages.package.isPackage).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.package.assets).to.be.deep.equal(["**/*.css", "**/*.otf"]);
            Chai.expect(uniteJsonWritten.clientPackages.package.map).to.be.deep.equal({ a: "b", c: "d" });
            Chai.expect(uniteJsonWritten.clientPackages.package.loaders).to.be.deep.equal({ text: "*.html", css: "*.css" });
        }));
        it("can succeed with all existing profile parameters", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            profiles = {};
            profiles.testProfile = {
                name: "package",
                version: "7.8.9",
                preload: true,
                includeMode: "both",
                scriptIncludeMode: "none",
                main: "1.js",
                mainMinified: "2.js",
                mainLib: ["a/**/*.js", "b/**/*.js"],
                testingAdditions: { "my-pkg": "blah", "my-pkg3": "foo" },
                isPackage: true,
                assets: ["**/*.css", "**/*.otf"],
                map: { a: "b", c: "d" },
                loaders: { text: "*.html", css: "*.css" },
                noScript: undefined
            };
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                packageManager: undefined,
                profile: "testProfile",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.package.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainLib).to.be.deep.equal(["a/**/*.js", "b/**/*.js"]);
            Chai.expect(uniteJsonWritten.clientPackages.package.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteJsonWritten.clientPackages.package.testingAdditions).to.be.deep.equal({ "my-pkg": "blah", "my-pkg3": "foo" });
            Chai.expect(uniteJsonWritten.clientPackages.package.isPackage).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.package.assets).to.be.deep.equal(["**/*.css", "**/*.otf"]);
            Chai.expect(uniteJsonWritten.clientPackages.package.map).to.be.deep.equal({ a: "b", c: "d" });
            Chai.expect(uniteJsonWritten.clientPackages.package.loaders).to.be.deep.equal({ text: "*.html", css: "*.css" });
        }));
        it("can succeed with all existing profile parameters empty transpile options", () => __awaiter(this, void 0, void 0, function* () {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            profiles = {};
            profiles.testProfile = {
                name: "package",
                version: "7.8.9",
                preload: true,
                includeMode: "both",
                scriptIncludeMode: "none",
                main: "1.js",
                mainMinified: "2.js",
                mainLib: ["a/**/*.js", "b/**/*.js"],
                testingAdditions: { "my-pkg": "blah", "my-pkg3": "foo" },
                isPackage: true,
                assets: ["**/*.css", "**/*.otf"],
                map: { a: "b", c: "d" },
                loaders: { text: "*.html", css: "*.css" },
                noScript: undefined
            };
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                packageManager: undefined,
                profile: "testProfile",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.package.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.package.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.package.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.package.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.package.mainLib).to.be.deep.equal(["a/**/*.js", "b/**/*.js"]);
            Chai.expect(uniteJsonWritten.clientPackages.package.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteJsonWritten.clientPackages.package.testingAdditions).to.be.deep.equal({ "my-pkg": "blah", "my-pkg3": "foo" });
            Chai.expect(uniteJsonWritten.clientPackages.package.isPackage).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.package.assets).to.be.deep.equal(["**/*.css", "**/*.otf"]);
            Chai.expect(uniteJsonWritten.clientPackages.package.map).to.be.deep.equal({ a: "b", c: "d" });
            Chai.expect(uniteJsonWritten.clientPackages.package.loaders).to.be.deep.equal({ text: "*.html", css: "*.css" });
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                mainLib: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
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
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail if package does not exist", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not been");
        }));
        it("can fail if pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            fileWriteJsonErrors = true;
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        }));
        it("can succeed if all ok", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.clientPackages = { package: new uniteClientPackage_1.UniteClientPackage() };
            const obj = new clientPackageCommand_1.ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                operation: "remove",
                packageName: "package",
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
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHdGQUFxRjtBQUNyRixzR0FBbUc7QUFFbkcsNkVBQTBFO0FBQzFFLHdEQUFvRDtBQUNwRCx3RUFBb0U7QUFFcEUsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxVQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBMkIsQ0FBQztJQUNoQyxJQUFJLGNBQThCLENBQUM7SUFDbkMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksU0FBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFvQyxDQUFDO0lBQ3pDLElBQUksbUJBQTRCLENBQUM7SUFDakMsSUFBSSxXQUFtQixDQUFDO0lBQ3hCLElBQUksY0FBdUIsQ0FBQztJQUM1QixJQUFJLGtCQUEyQyxDQUFDO0lBQ2hELElBQUksUUFBNkMsQ0FBQztJQUVsRCxVQUFVLENBQUMsR0FBUyxFQUFFO1FBQ2xCLE9BQU8sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDaEMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQixjQUFjLEdBQUcsSUFBSSxnREFBc0IsRUFBRSxDQUFDO1FBRTlDLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFD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QUUsU0FBUztnQkFDekIsZUFBZSxFQUFFLFNBQVM7YUFDN0IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbW1hbmRzL2NsaWVudFBhY2thZ2VDb21tYW5kLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBCdWlsZCBDb25maWd1cmF0aW9uIENvbW1hbmQuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBDbGllbnRQYWNrYWdlQ29tbWFuZCB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY2xpZW50UGFja2FnZUNvbW1hbmRcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDbGllbnRQYWNrYWdlXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlsc1wiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5pbXBvcnQgeyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL3JlYWRPbmx5RmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiQ2xpZW50UGFja2FnZUNvbW1hbmRcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJCYW5uZXJTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCB1bml0ZUpzb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgdW5pdGVKc29uV3JpdHRlbjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCBmaWxlV3JpdGVKc29uRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBwYWNrYWdlSW5mbzogc3RyaW5nO1xuICAgIGxldCBmYWlsUGFja2FnZUFkZDogYm9vbGVhbjtcbiAgICBsZXQgZW5naW5lUGVlclBhY2thZ2VzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nfTtcbiAgICBsZXQgcHJvZmlsZXM6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2V9O1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5jcmVhdGVTYW5kYm94KCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5iYW5uZXIgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi53YXJuaW5nID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGZpbGVTeXN0ZW1TdHViID0gbmV3IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2soKTtcblxuICAgICAgICBsb2dnZXJFcnJvclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiZXJyb3JcIik7XG4gICAgICAgIGxvZ2dlckJhbm5lclNweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiYmFubmVyXCIpO1xuXG4gICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgZmlsZVdyaXRlSnNvbkVycm9ycyA9IGZhbHNlO1xuICAgICAgICBwYWNrYWdlSW5mbyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdW5pdGVKc29uV3JpdHRlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgZmFpbFBhY2thZ2VBZGQgPSBmYWxzZTtcbiAgICAgICAgcHJvZmlsZXMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXhpc3RzID0gZmlsZVN5c3RlbVN0dWIuZmlsZUV4aXN0cztcbiAgICAgICAgY29uc3Qgc3R1YkV4aXN0cyA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpO1xuICAgICAgICBzdHViRXhpc3RzLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlUmVhZEpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb247XG4gICAgICAgIGNvbnN0IHN0dWJyZWFkSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIik7XG4gICAgICAgIHN0dWJyZWFkSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pdGVKc29uID09PSBudWxsID8gUHJvbWlzZS5yZWplY3QoXCJlcnJcIikgOiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwiY2xpZW50UGFja2FnZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvZmlsZXMgPyBQcm9taXNlLnJlc29sdmUocHJvZmlsZXMpIDogb3JpZ2luYWxGaWxlUmVhZEpzb24oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVdyaXRlSnNvbiA9IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZUpzb247XG4gICAgICAgIGNvbnN0IHN0dWJXcml0ZUpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVdyaXRlSnNvblwiKTtcbiAgICAgICAgc3R1YldyaXRlSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUsIG9iaikgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVXcml0ZUpzb25FcnJvcnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgICAgICB1bml0ZUpzb25Xcml0dGVuID0gb2JqO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVdyaXRlSnNvbihmb2xkZXIsIGZpbGVuYW1lLCBvYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZXhlY1N0dWIgPSBzYW5kYm94LnN0dWIoUGFja2FnZVV0aWxzLCBcImV4ZWNcIik7XG4gICAgICAgIGV4ZWNTdHViLmNhbGxzRmFrZShhc3luYyAobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcGFja2FnZU5hbWU6IHN0cmluZywgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFyZ3NbMF0gPT09IFwidmlld1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhY2thZ2VJbmZvID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcInBhY2thZ2UgaW5mb3JtYXRpb25cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYWNrYWdlSW5mbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFpbFBhY2thZ2VBZGQgPyBQcm9taXNlLnJlamVjdChcImVycm9yXCIpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVuaXRlSnNvbiA9IHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgIHRpdGxlOiBcIk15IEFwcFwiLFxuICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgIGRvY3VtZW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiWWFyblwiLFxuICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJWYW5pbGxhXCIsXG4gICAgICAgICAgICBpZGVzOiBbXSxcbiAgICAgICAgICAgIHVuaXRlVmVyc2lvbjogXCIwLjAuMFwiLFxuICAgICAgICAgICAgc291cmNlRXh0ZW5zaW9uczogW10sXG4gICAgICAgICAgICB2aWV3RXh0ZW5zaW9uczogW10sXG4gICAgICAgICAgICBzdHlsZUV4dGVuc2lvbjogXCJcIixcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2VzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkaXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2VXaXRoOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBidWlsZENvbmZpZ3VyYXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwbGF0Zm9ybXM6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuXG4gICAgICAgIGVuZ2luZVBlZXJQYWNrYWdlcyA9IGF3YWl0IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjx7IFtpZDogc3RyaW5nIF06IHN0cmluZ30+KFxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy91bml0ZWpzLXBhY2thZ2VzL2Fzc2V0cy9cIiksIFwicGVlclBhY2thZ2VzLmpzb25cIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IEZpbGVTeXN0ZW1Nb2NrKCk7XG4gICAgICAgIGF3YWl0IG9iai5kaXJlY3RvcnlEZWxldGUoXCIuL3Rlc3QvdW5pdC90ZW1wXCIpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjbGllbnRQYWNrYWdlIGFkZFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggbm8gdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJubyB1bml0ZS5qc29uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBvcGVyYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwib3BlcmF0aW9uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBwYWNrYWdlTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5wYWNrYWdlTWFuYWdlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VNYW5hZ2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIGludmFsaWQgaW5jbHVkZU1vZGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBwYWNrYWdlOiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiA8YW55PlwiZm9vXCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImluY2x1ZGVNb2RlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIGludmFsaWQgc2NyaXB0SW5jbHVkZU1vZGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBwYWNrYWdlOiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IDxhbnk+XCJmb29cIixcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNjcmlwdEluY2x1ZGVNb2RlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIGlmIG1haW4gYW5kIG5vU2NyaXB0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgcGFja2FnZTogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJtYWluIGFuZCBub1NjcmlwdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBtYWluTWluaWZpZWQgYW5kIG5vU2NyaXB0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5jbGllbnRQYWNrYWdlcyA9IHsgcGFja2FnZTogbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCJtYWluTWluaWZpZWQuanNcIixcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm1haW5NaW5pZmllZCBhbmQgbm9TY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGFja2FnZSBhbHJlYWR5IGV4aXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IHBhY2thZ2U6IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiYWxyZWFkeVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBwYWNrYWdlTWFuYWdlciBnZXRzIGluZm8gZXJyb3JzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlBhY2thZ2UgSW5mb3JtYXRpb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGlwZWxpbmUgc3RlcCBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IFwibWFpbk1pbmlmaWVkLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImZhaWxlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIGJhZGx5IGZvcm1lZCB0ZXN0QWRkaXRpb25zXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogW1wic2RmZ3NkXCJdLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbHVyZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBhY2thZ2UgYWRkIGZhaWxzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgZmFpbFBhY2thZ2VBZGQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGgganVzdCBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjEuMi4zXCIgfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiYmx1ZWJpcmRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLmJsdWViaXJkLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5tYWluKS50by5iZS5lcXVhbChcIi9qcy9icm93c2VyL2JsdWViaXJkLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwiL2pzL2Jyb3dzZXIvYmx1ZWJpcmQubWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5ibHVlYmlyZC5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJib3RoXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggdW5rbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiBcIjEuMi4zXCIgfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiYmxhaFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJkb2VzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG5vIHBhY2thZ2VNYW5hZ2VyIGluZm9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInt9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4wLjAuMVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIipcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBub1NjcmlwdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImFwcFwiLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCJeMS4yLjNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBwYWNrYWdlTWFuYWdlciBpbmZvXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiXjEuMi4zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwiaW5kZXguanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwiYXBwXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggb3ZlcnJpZGUgdmVyc2lvbiBwYWNrYWdlTWFuYWdlciBpbmZvXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IFwiNC41LjZcIixcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiNC41LjZcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwoXCJpbmRleC5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJhcHBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBvdmVycmlkZSBtYWluIHBhY2thZ2VNYW5hZ2VyIGluZm9cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcGFja2FnZUluZm8gPSBcInsgXFxcInZlcnNpb25cXFwiOiBcXFwiMS4yLjNcXFwiLCBcXFwibWFpblxcXCI6IFxcXCJpbmRleC5qc1xcXCJ9XCI7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJhZGRcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1haW46IFwibWFpbi5qc1wiLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIm1haW4uanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwidGVzdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG92ZXJyaWRlIG1haW4gYW5kIHZlcnNpb24gcGFja2FnZU1hbmFnZXIgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjQuNS42XCIsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcInRlc3RcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFpbjogXCJtYWluLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiNC41LjZcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwoXCJtYWluLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcInRlc3RcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBvdmVycmlkZSBtYWluTWluaWZpZWQgYW5kIHZlcnNpb24gcGFja2FnZU1hbmFnZXIgaW5mb1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIm1haW5NaW5pZmllZC5qc1wiLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIl4xLjIuM1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcImluZGV4LmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCJtYWluTWluaWZpZWQuanNcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBhbGwgcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjcuOC45XCIsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJib3RoXCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1haW46IFwiMS5qc1wiLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCIyLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogW1wiYS8qKi8qLmpzXCIsIFwiYi8qKi8qLmpzXCJdLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IFtcIm15LXBrZz1ibGFoXCIsIFwibXktcGtnMz1mb29cIl0sXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIiwgXCIqKi8qLm90ZlwiXSxcbiAgICAgICAgICAgICAgICBtYXA6IFtcImE9YlwiLCBcImM9ZFwiXSxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiBbXCJ0ZXh0PSouaHRtbFwiLCBcImNzcz0qLmNzc1wiXSxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudmVyc2lvbikudG8uYmUuZXF1YWwoXCI3LjguOVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5wcmVsb2FkKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5pbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJib3RoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW4pLnRvLmJlLmVxdWFsKFwiMS5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluTWluaWZpZWQpLnRvLmJlLmVxdWFsKFwiMi5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluTGliKS50by5iZS5kZWVwLmVxdWFsKFtcImEvKiovKi5qc1wiLCBcImIvKiovKi5qc1wiXSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwibm9uZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS50ZXN0aW5nQWRkaXRpb25zKS50by5iZS5kZWVwLmVxdWFsKHsgXCJteS1wa2dcIjogXCJibGFoXCIsIFwibXktcGtnM1wiOiBcImZvb1wiIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmlzUGFja2FnZSkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuYXNzZXRzKS50by5iZS5kZWVwLmVxdWFsKFtcIioqLyouY3NzXCIsIFwiKiovKi5vdGZcIl0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1hcCkudG8uYmUuZGVlcC5lcXVhbCh7IGE6IFwiYlwiLCBjOiBcImRcIiB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5sb2FkZXJzKS50by5iZS5kZWVwLmVxdWFsKHsgdGV4dDogXCIqLmh0bWxcIiwgY3NzOiBcIiouY3NzXCIgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBhbGwgZXhpc3RpbmcgcHJvZmlsZSBwYXJhbWV0ZXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvID0gXCJ7IFxcXCJ2ZXJzaW9uXFxcIjogXFxcIjEuMi4zXFxcIiwgXFxcIm1haW5cXFwiOiBcXFwiaW5kZXguanNcXFwifVwiO1xuICAgICAgICAgICAgcHJvZmlsZXMgPSB7fTtcbiAgICAgICAgICAgIHByb2ZpbGVzLnRlc3RQcm9maWxlID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IFwiNy44LjlcIixcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFpbjogXCIxLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBcIjIuanNcIixcbiAgICAgICAgICAgICAgICBtYWluTGliOiBbXCJhLyoqLyouanNcIiwgXCJiLyoqLyouanNcIl0sXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczoge1wibXktcGtnXCI6IFwiYmxhaFwiLCBcIm15LXBrZzNcIjogXCJmb29cIn0sXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFzc2V0czogW1wiKiovKi5jc3NcIiwgXCIqKi8qLm90ZlwiXSxcbiAgICAgICAgICAgICAgICBtYXA6IHthOiBcImJcIiwgYzogXCJkXCJ9LFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHt0ZXh0OiBcIiouaHRtbFwiLCBjc3M6IFwiKi5jc3NcIn0sXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwidGVzdFByb2ZpbGVcIixcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnZlcnNpb24pLnRvLmJlLmVxdWFsKFwiNy44LjlcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UucHJlbG9hZCkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuaW5jbHVkZU1vZGUpLnRvLmJlLmVxdWFsKFwiYm90aFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYWluKS50by5iZS5lcXVhbChcIjEuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbk1pbmlmaWVkKS50by5iZS5lcXVhbChcIjIuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbkxpYikudG8uYmUuZGVlcC5lcXVhbChbXCJhLyoqLyouanNcIiwgXCJiLyoqLyouanNcIl0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnNjcmlwdEluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcIm5vbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UudGVzdGluZ0FkZGl0aW9ucykudG8uYmUuZGVlcC5lcXVhbCh7IFwibXktcGtnXCI6IFwiYmxhaFwiLCBcIm15LXBrZzNcIjogXCJmb29cIiB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5pc1BhY2thZ2UpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmFzc2V0cykudG8uYmUuZGVlcC5lcXVhbChbXCIqKi8qLmNzc1wiLCBcIioqLyoub3RmXCJdKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5tYXApLnRvLmJlLmRlZXAuZXF1YWwoeyBhOiBcImJcIiwgYzogXCJkXCIgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubG9hZGVycykudG8uYmUuZGVlcC5lcXVhbCh7IHRleHQ6IFwiKi5odG1sXCIsIGNzczogXCIqLmNzc1wiIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggYWxsIGV4aXN0aW5nIHByb2ZpbGUgcGFyYW1ldGVycyBlbXB0eSB0cmFuc3BpbGUgb3B0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbyA9IFwieyBcXFwidmVyc2lvblxcXCI6IFxcXCIxLjIuM1xcXCIsIFxcXCJtYWluXFxcIjogXFxcImluZGV4LmpzXFxcIn1cIjtcbiAgICAgICAgICAgIHByb2ZpbGVzID0ge307XG4gICAgICAgICAgICBwcm9maWxlcy50ZXN0UHJvZmlsZSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjcuOC45XCIsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogXCJib3RoXCIsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1haW46IFwiMS5qc1wiLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogXCIyLmpzXCIsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogW1wiYS8qKi8qLmpzXCIsIFwiYi8qKi8qLmpzXCJdLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHtcIm15LXBrZ1wiOiBcImJsYWhcIiwgXCJteS1wa2czXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhc3NldHM6IFtcIioqLyouY3NzXCIsIFwiKiovKi5vdGZcIl0sXG4gICAgICAgICAgICAgICAgbWFwOiB7YTogXCJiXCIsIGM6IFwiZFwifSxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB7dGV4dDogXCIqLmh0bWxcIiwgY3NzOiBcIiouY3NzXCJ9LFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImFkZFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcInRlc3RQcm9maWxlXCIsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS52ZXJzaW9uKS50by5iZS5lcXVhbChcIjcuOC45XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnByZWxvYWQpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmluY2x1ZGVNb2RlKS50by5iZS5lcXVhbChcImJvdGhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFpbikudG8uYmUuZXF1YWwoXCIxLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5NaW5pZmllZCkudG8uYmUuZXF1YWwoXCIyLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLm1haW5MaWIpLnRvLmJlLmRlZXAuZXF1YWwoW1wiYS8qKi8qLmpzXCIsIFwiYi8qKi8qLmpzXCJdKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSkudG8uYmUuZXF1YWwoXCJub25lXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMpLnRvLmJlLmRlZXAuZXF1YWwoeyBcIm15LXBrZ1wiOiBcImJsYWhcIiwgXCJteS1wa2czXCI6IFwiZm9vXCIgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UuaXNQYWNrYWdlKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvbldyaXR0ZW4uY2xpZW50UGFja2FnZXMucGFja2FnZS5hc3NldHMpLnRvLmJlLmRlZXAuZXF1YWwoW1wiKiovKi5jc3NcIiwgXCIqKi8qLm90ZlwiXSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmNsaWVudFBhY2thZ2VzLnBhY2thZ2UubWFwKS50by5iZS5kZWVwLmVxdWFsKHsgYTogXCJiXCIsIGM6IFwiZFwiIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5jbGllbnRQYWNrYWdlcy5wYWNrYWdlLmxvYWRlcnMpLnRvLmJlLmRlZXAuZXF1YWwoeyB0ZXh0OiBcIiouaHRtbFwiLCBjc3M6IFwiKi5jc3NcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNsaWVudFBhY2thZ2UgcmVtb3ZlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBubyB1bml0ZS5qc29uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2NyaXB0SW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbkxpYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhc3NldHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsb2FkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9TY3JpcHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm5vIHVuaXRlLmpzb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIG9wZXJhdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJvcGVyYXRpb25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VOYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDbGllbnRQYWNrYWdlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTmFtZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgcGFja2FnZU1hbmFnZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLnBhY2thZ2VNYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU1hbmFnZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgaWYgcGFja2FnZSBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJub3QgYmVlblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBpZiBwaXBlbGluZSBzdGVwIGZhaWxzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGZpbGVXcml0ZUpzb25FcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgdW5pdGVKc29uLmNsaWVudFBhY2thZ2VzID0geyBwYWNrYWdlOiBuZXcgVW5pdGVDbGllbnRQYWNrYWdlKCkgfTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENsaWVudFBhY2thZ2VDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwicGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTWluaWZpZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtYWluTGliOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzUGFja2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFzc2V0czogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvYWRlcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub1NjcmlwdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIGlmIGFsbCBva1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uY2xpZW50UGFja2FnZXMgPSB7IHBhY2thZ2U6IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKSB9O1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ2xpZW50UGFja2FnZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJwYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByZWxvYWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpbmNsdWRlTW9kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1haW5MaWI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0ZXN0aW5nQWRkaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNQYWNrYWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXNzZXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWFwOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9hZGVyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vU2NyaXB0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
