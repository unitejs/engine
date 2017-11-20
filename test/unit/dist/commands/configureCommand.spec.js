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
const configureCommand_1 = require("../../../../dist/commands/configureCommand");
const uniteBuildConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteBuildConfiguration");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("ConfigureCommand", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerErrorSpy;
    let loggerWarningSpy;
    let loggerBannerSpy;
    let uniteJson;
    let uniteJsonWritten;
    let uniteJsonThemeWritten;
    let profileErrors;
    let profileExists;
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
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");
        uniteJson = undefined;
        uniteJsonWritten = undefined;
        uniteJsonThemeWritten = undefined;
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
            if (filename === "unite.json") {
                uniteJsonWritten = obj;
                return Promise.resolve();
            }
            else if (filename === "unite-theme.json") {
                uniteJsonThemeWritten = obj;
                return Promise.resolve();
            }
            else {
                return originalFileWriteJson(folder, filename, obj);
            }
        }));
        uniteJson = {
            packageName: "my-package",
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
            documentor: "None",
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
    it("can be created", () => {
        const obj = new configureCommand_1.ConfigureCommand();
        Chai.should().exist(obj);
    });
    describe("configure", () => {
        it("can fail when calling with undefined packageName", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when calling with undefined sourceLanguage", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("sourceLanguage");
        }));
        it("can fail when calling with undefined moduleType", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("moduleType");
        }));
        it("can fail when calling with undefined bundler", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("bundler");
        }));
        it("can fail when calling with undefined unitTestRunner", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestRunner");
        }));
        it("can fail when calling with unitTestRunner None and unitTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                unitTestRunner: "None",
                unitTestFramework: "Jasmine",
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        }));
        it("can fail when calling with unitTestRunner None and unitTestEngine", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                unitTestRunner: "None",
                unitTestFramework: undefined,
                unitTestEngine: "PhantomJS",
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        }));
        it("can fail when calling with unitTestRunner Karma and missing unitTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestFramework");
        }));
        it("can fail when calling with undefined unitTestEngine", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestEngine");
        }));
        it("can fail when calling with undefined e2eTestRunner", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("e2eTestRunner");
        }));
        it("can fail when calling with e2eTestRunner None and e2eTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                e2eTestRunner: "None",
                e2eTestFramework: "MochaChai",
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        }));
        it("can fail when calling with e2eTestRunner Protractor and missing e2eTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("e2eTestFramework");
        }));
        it("can fail when calling with undefined linter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                unitTestRunner: "None",
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: "None",
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("linter");
        }));
        it("can fail when calling with undefined cssPre", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssPre");
        }));
        it("can fail when calling with undefined cssPost", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                taskManager: undefined,
                server: undefined,
                ides: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssPost");
        }));
        it("can fail when calling with undefined cssLinter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "aaa",
                documentor: undefined,
                taskManager: undefined,
                server: undefined,
                ides: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssLinter");
        }));
        it("can fail when calling with undefined server", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssPost: "PostCss",
                cssLinter: "StyleLint",
                documentor: "None",
                ides: ["VSCode"],
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("server");
        }));
        it("can fail when calling with undefined taskManager", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssPost: "PostCss",
                cssLinter: undefined,
                documentor: undefined,
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("taskManager");
        }));
        it("can fail when calling with invalid packageManager", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "blah",
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail when calling with undefined applicationFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("applicationFramework");
        }));
        it("can fail when pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                linter: "TSLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("TSLint");
        }));
        it("can fail when pipeline module does not exist", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            let counter = 0;
            const stub = fileSystemStub.directoryGetFiles = sandbox.stub();
            stub.callsFake((dir) => __awaiter(this, void 0, void 0, function* () {
                if (dir.indexOf("linter") >= 0) {
                    if (counter > 0) {
                        return Promise.resolve([]);
                    }
                    else {
                        counter++;
                        return new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock().directoryGetFiles(dir);
                    }
                }
                else {
                    return new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock().directoryGetFiles(dir);
                }
            }));
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                linter: "None",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("could not be located");
        }));
        it("can fail when pipeline module throws error with label", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("error");
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed to load");
        }));
        it("can fail when pipeline module throws error", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            fileSystemStub.directoryGetFiles = sandbox.stub().onSecondCall().rejects("error");
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed to load");
        }));
        it("can succeed when calling with none linter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with undefined outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with www outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "None",
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: "./test/unit/temp/www"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with defined outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "PlainApp",
                profile: undefined,
                force: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed with existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: "My App",
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail with invalid unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = null;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("existing unite.json");
        }));
        it("can fail when called with just unknown profile", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                ides: undefined,
                documentor: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "aaaaa",
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("does not exist");
        }));
        it("can fail when called when profile files does not exist", () => __awaiter(this, void 0, void 0, function* () {
            profileExists = false;
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when called when profile file throws exception", () => __awaiter(this, void 0, void 0, function* () {
            profileErrors = true;
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("profile file");
        }));
        it("can fail when called with just known profile and no packageName", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                ides: undefined,
                documentor: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can succeed when called with known profile", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: "My Package",
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteJsonWritten.packageName).to.be.equal("my-package");
            Chai.expect(uniteJsonWritten.applicationFramework).to.be.equal("Aurelia");
            Chai.expect(uniteJsonWritten.sourceLanguage).to.be.equal("TypeScript");
        }));
        it("can succeed when called with known and override parameters", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: "My Package",
                shortName: undefined,
                keywords: undefined,
                description: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documentor: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: "Angular",
                profile: "AureliaTypeScript",
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteJsonWritten.packageName).to.be.equal("my-package");
            Chai.expect(uniteJsonWritten.applicationFramework).to.be.equal("Angular");
            Chai.expect(uniteJsonWritten.sourceLanguage).to.be.equal("TypeScript");
        }));
        it("can succeed with force and existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
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
                cssLinter: "None",
                documentor: "None",
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
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed with force and existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
                shortName: "short",
                description: "desc",
                keywords: ["a", "b"],
                organization: "org",
                copyright: "copy",
                webSite: "web",
                namespace: "ns",
                author: "auth",
                authorEmail: "authE",
                authorWebSite: "authW",
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
                cssLinter: "None",
                documentor: "None",
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
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonThemeWritten.title).to.be.equal("my-app");
            Chai.expect(uniteJsonThemeWritten.shortName).to.be.equal("short");
            Chai.expect(uniteJsonThemeWritten.metaDescription).to.be.equal("desc");
            Chai.expect(uniteJsonThemeWritten.metaKeywords).to.be.deep.equal(["a", "b"]);
            Chai.expect(uniteJsonThemeWritten.organization).to.be.equal("org");
            Chai.expect(uniteJsonThemeWritten.copyright).to.be.equal("copy");
            Chai.expect(uniteJsonThemeWritten.webSite).to.be.equal("web");
            Chai.expect(uniteJsonThemeWritten.namespace).to.be.equal("ns");
            Chai.expect(uniteJsonThemeWritten.metaAuthor).to.be.equal("auth");
            Chai.expect(uniteJsonThemeWritten.metaAuthorEmail).to.be.equal("authE");
            Chai.expect(uniteJsonThemeWritten.metaAuthorWebSite).to.be.equal("authW");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsZ0ZBQTZFO0FBQzdFLGdIQUE2RztBQUc3Ryx3REFBb0Q7QUFDcEQsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksZ0JBQWdDLENBQUM7SUFDckMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksU0FBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFvQyxDQUFDO0lBQ3pDLElBQUkscUJBQThDLENBQUM7SUFDbkQsSUFBSSxhQUFzQixDQUFDO0lBQzNCLElBQUksYUFBc0IsQ0FBQztJQUMzQixJQUFJLGtCQUEyQyxDQUFDO0lBRWhELFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQixjQUFjLEdBQUcsSUFBSSxnREFBc0IsRUFBRSxDQUFDO1FBRTlDLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUs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IFRlc3RzIGZvciBCdWlsZCBDb25maWd1cmF0aW9uIENvbW1hbmQuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBDb25maWd1cmVDb21tYW5kIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWd1cmVDb21tYW5kXCI7XG5pbXBvcnQgeyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdWlsZENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRmlsZVN5c3RlbU1vY2sgfSBmcm9tIFwiLi4vZmlsZVN5c3RlbS5tb2NrXCI7XG5pbXBvcnQgeyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL3JlYWRPbmx5RmlsZVN5c3RlbS5tb2NrXCI7XG5cbmRlc2NyaWJlKFwiQ29uZmlndXJlQ29tbWFuZFwiLCAoKSA9PiB7XG4gICAgbGV0IHNhbmRib3g6IFNpbm9uLlNpbm9uU2FuZGJveDtcbiAgICBsZXQgbG9nZ2VyU3R1YjogSUxvZ2dlcjtcbiAgICBsZXQgZmlsZVN5c3RlbVN0dWI6IElGaWxlU3lzdGVtO1xuICAgIGxldCBsb2dnZXJFcnJvclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlcldhcm5pbmdTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJCYW5uZXJTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCB1bml0ZUpzb246IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgdW5pdGVKc29uV3JpdHRlbjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCB1bml0ZUpzb25UaGVtZVdyaXR0ZW46IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uO1xuICAgIGxldCBwcm9maWxlRXJyb3JzOiBib29sZWFuO1xuICAgIGxldCBwcm9maWxlRXhpc3RzOiBib29sZWFuO1xuICAgIGxldCBlbmdpbmVQZWVyUGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmd9O1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuYmFubmVyID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmluZm8gPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIuZXJyb3IgPSAoKSA9PiB7IH07XG4gICAgICAgIGxvZ2dlclN0dWIud2FybmluZyA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCk7XG5cbiAgICAgICAgbG9nZ2VyRXJyb3JTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImVycm9yXCIpO1xuICAgICAgICBsb2dnZXJXYXJuaW5nU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJ3YXJuaW5nXCIpO1xuICAgICAgICBsb2dnZXJCYW5uZXJTcHkgPSBzYW5kYm94LnNweShsb2dnZXJTdHViLCBcImJhbm5lclwiKTtcblxuICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIHVuaXRlSnNvbldyaXR0ZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHVuaXRlSnNvblRoZW1lV3JpdHRlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgcHJvZmlsZUV4aXN0cyA9IHRydWU7XG4gICAgICAgIHByb2ZpbGVFcnJvcnMgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVFeGlzdHMgPSBmaWxlU3lzdGVtU3R1Yi5maWxlRXhpc3RzO1xuICAgICAgICBjb25zdCBzdHViRXhpc3RzID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIik7XG4gICAgICAgIHN0dWJFeGlzdHMuY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcImNvbmZpZ3VyZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXByb2ZpbGVFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZmlsZUVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAobmV3IEVycm9yKFwiZmFpbFwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVSZWFkSnNvbiA9IGZpbGVTeXN0ZW1TdHViLmZpbGVSZWFkSnNvbjtcbiAgICAgICAgY29uc3Qgc3R1YnJlYWRKc29uID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKTtcbiAgICAgICAgc3R1YnJlYWRKc29uLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bml0ZUpzb24gPT09IG51bGwgPyBQcm9taXNlLnJlamVjdChcImVyclwiKSA6IFByb21pc2UucmVzb2x2ZSh1bml0ZUpzb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlUmVhZEpzb24oZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGVXcml0ZUpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlV3JpdGVKc29uO1xuICAgICAgICBjb25zdCBzdHViV3JpdGVKc29uID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVXcml0ZUpzb25cIik7XG4gICAgICAgIHN0dWJXcml0ZUpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lLCBvYmopID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICB1bml0ZUpzb25Xcml0dGVuID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUtdGhlbWUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgdW5pdGVKc29uVGhlbWVXcml0dGVuID0gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVdyaXRlSnNvbihmb2xkZXIsIGZpbGVuYW1lLCBvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB1bml0ZUpzb24gPSB7XG4gICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgZG9jdW1lbnRvcjogXCJOb25lXCIsXG4gICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJZYXJuXCIsXG4gICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICB1bml0ZVZlcnNpb246IFwiMC4wLjBcIixcbiAgICAgICAgICAgIHNvdXJjZUV4dGVuc2lvbnM6IFtdLFxuICAgICAgICAgICAgdmlld0V4dGVuc2lvbnM6IFtdLFxuICAgICAgICAgICAgc3R5bGVFeHRlbnNpb246IFwiXCIsXG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGlyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlV2l0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYnVpbGRDb25maWd1cmF0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGxhdGZvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICBlbmdpbmVQZWVyUGFja2FnZXMgPSBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZyBdOiBzdHJpbmd9PihmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vYXNzZXRzL1wiKSwgXCJwZWVyUGFja2FnZXMuanNvblwiKTtcbiAgICB9KTtcblxuICAgIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3gucmVzdG9yZSgpO1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgRmlsZVN5c3RlbU1vY2soKTtcbiAgICAgICAgYXdhaXQgb2JqLmRpcmVjdG9yeURlbGV0ZShcIi4vdGVzdC91bml0L3RlbXBcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgQ2hhaS5zaG91bGQoKS5leGlzdChvYmopO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjb25maWd1cmVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBwYWNrYWdlTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHNvdXJjZUxhbmd1YWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJzb3VyY2VMYW5ndWFnZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgbW9kdWxlVHlwZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJtb2R1bGVUeXBlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBidW5kbGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJidW5kbGVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCB1bml0VGVzdFJ1bm5lclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInVuaXRUZXN0UnVubmVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuaXRUZXN0UnVubmVyIE5vbmUgYW5kIHVuaXRUZXN0RnJhbWV3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImlzIG5vdCB2YWxpZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bml0VGVzdFJ1bm5lciBOb25lIGFuZCB1bml0VGVzdEVuZ2luZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImlzIG5vdCB2YWxpZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bml0VGVzdFJ1bm5lciBLYXJtYSBhbmQgbWlzc2luZyB1bml0VGVzdEZyYW1ld29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInVuaXRUZXN0RnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCB1bml0VGVzdEVuZ2luZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwidW5pdFRlc3RFbmdpbmVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGUyZVRlc3RSdW5uZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJlMmVUZXN0UnVubmVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIGUyZVRlc3RSdW5uZXIgTm9uZSBhbmQgZTJlVGVzdEZyYW1ld29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImlzIG5vdCB2YWxpZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBlMmVUZXN0UnVubmVyIFByb3RyYWN0b3IgYW5kIG1pc3NpbmcgZTJlVGVzdEZyYW1ld29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZTJlVGVzdEZyYW1ld29ya1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgbGludGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImxpbnRlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgY3NzUHJlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNzc1ByZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgY3NzUG9zdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNzc1Bvc3RcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGNzc0xpbnRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiYWFhXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNzc0xpbnRlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgc2VydmVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiUG9zdENzc1wiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJTdHlsZUxpbnRcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJzZXJ2ZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHRhc2tNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiUG9zdENzc1wiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ0YXNrTWFuYWdlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBpbnZhbGlkIHBhY2thZ2VNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJibGFoXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VNYW5hZ2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGlwZWxpbmUgc3RlcCBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiVFNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlRTTGludFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBpcGVsaW5lIG1vZHVsZSBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gZmlsZVN5c3RlbVN0dWIuZGlyZWN0b3J5R2V0RmlsZXMgPSBzYW5kYm94LnN0dWIoKTtcbiAgICAgICAgICAgIHN0dWIuY2FsbHNGYWtlKGFzeW5jIChkaXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGlyLmluZGV4T2YoXCJsaW50ZXJcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCkuZGlyZWN0b3J5R2V0RmlsZXMoZGlyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpLmRpcmVjdG9yeUdldEZpbGVzKGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJjb3VsZCBub3QgYmUgbG9jYXRlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBpcGVsaW5lIG1vZHVsZSB0aHJvd3MgZXJyb3Igd2l0aCBsYWJlbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBmaWxlU3lzdGVtU3R1Yi5kaXJlY3RvcnlHZXRGaWxlcyA9IHNhbmRib3guc3R1YigpLnJlamVjdHMoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkIHRvIGxvYWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwaXBlbGluZSBtb2R1bGUgdGhyb3dzIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCkub25TZWNvbmRDYWxsKCkucmVqZWN0cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsZWQgdG8gbG9hZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCBub25lIGxpbnRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwieW91IHNob3VsZCB1cGRhdGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwieW91IHNob3VsZCB1cGRhdGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsaW5nIHdpdGggd3d3IG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXAvd3d3XCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInlvdSBzaG91bGQgdXBkYXRlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGluZyB3aXRoIGRlZmluZWQgb3V0cHV0RGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInlvdSBzaG91bGQgdXBkYXRlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggZXhpc3RpbmcgdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHsgZGV2OiBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiTXkgQXBwXCIsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInlvdSBzaG91bGQgdXBkYXRlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggaW52YWxpZCB1bml0ZS5qc29uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZXhpc3RpbmcgdW5pdGUuanNvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCB3aXRoIGp1c3QgdW5rbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogXCJhYWFhYVwiLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJkb2VzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCB3aGVuIHByb2ZpbGUgZmlsZXMgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcHJvZmlsZUV4aXN0cyA9IGZhbHNlO1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcIkF1cmVsaWFUeXBlU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VOYW1lXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIHdoZW4gcHJvZmlsZSBmaWxlIHRocm93cyBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcHJvZmlsZUVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicHJvZmlsZSBmaWxlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIHdpdGgganVzdCBrbm93biBwcm9maWxlIGFuZCBubyBwYWNrYWdlTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsZWQgd2l0aCBrbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiTXkgUGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnBhY2thZ2VOYW1lKS50by5iZS5lcXVhbChcIm15LXBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmFwcGxpY2F0aW9uRnJhbWV3b3JrKS50by5iZS5lcXVhbChcIkF1cmVsaWFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnNvdXJjZUxhbmd1YWdlKS50by5iZS5lcXVhbChcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsZWQgd2l0aCBrbm93biBhbmQgb3ZlcnJpZGUgcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIk15IFBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiQW5ndWxhclwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnBhY2thZ2VOYW1lKS50by5iZS5lcXVhbChcIm15LXBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmFwcGxpY2F0aW9uRnJhbWV3b3JrKS50by5iZS5lcXVhbChcIkFuZ3VsYXJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnNvdXJjZUxhbmd1YWdlKS50by5iZS5lcXVhbChcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBmb3JjZSBhbmQgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHsgZGV2OiBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInlvdSBzaG91bGQgdXBkYXRlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggZm9yY2UgYW5kIGV4aXN0aW5nIHVuaXRlLmpzb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uLmJ1aWxkQ29uZmlndXJhdGlvbnMgPSB7IGRldjogbmV3IFVuaXRlQnVpbGRDb25maWd1cmF0aW9uKCkgfTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiBcInNob3J0XCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiZGVzY1wiLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiBbXCJhXCIsIFwiYlwiXSxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IFwib3JnXCIsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiBcImNvcHlcIixcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiBcIndlYlwiLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogXCJuc1wiLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogXCJhdXRoXCIsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IFwiYXV0aEVcIixcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiBcImF1dGhXXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudG9yOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInlvdSBzaG91bGQgdXBkYXRlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuXG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4udGl0bGUpLnRvLmJlLmVxdWFsKFwibXktYXBwXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uVGhlbWVXcml0dGVuLnNob3J0TmFtZSkudG8uYmUuZXF1YWwoXCJzaG9ydFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi5tZXRhRGVzY3JpcHRpb24pLnRvLmJlLmVxdWFsKFwiZGVzY1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi5tZXRhS2V5d29yZHMpLnRvLmJlLmRlZXAuZXF1YWwoW1wiYVwiLCBcImJcIl0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uVGhlbWVXcml0dGVuLm9yZ2FuaXphdGlvbikudG8uYmUuZXF1YWwoXCJvcmdcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4uY29weXJpZ2h0KS50by5iZS5lcXVhbChcImNvcHlcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4ud2ViU2l0ZSkudG8uYmUuZXF1YWwoXCJ3ZWJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4ubmFtZXNwYWNlKS50by5iZS5lcXVhbChcIm5zXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uVGhlbWVXcml0dGVuLm1ldGFBdXRob3IpLnRvLmJlLmVxdWFsKFwiYXV0aFwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi5tZXRhQXV0aG9yRW1haWwpLnRvLmJlLmVxdWFsKFwiYXV0aEVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4ubWV0YUF1dGhvcldlYlNpdGUpLnRvLmJlLmVxdWFsKFwiYXV0aFdcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTtcbiJdfQ==
