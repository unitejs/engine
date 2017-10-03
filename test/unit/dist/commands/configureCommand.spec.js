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
    let loggerInfoSpy;
    let loggerWarningSpy;
    let loggerBannerSpy;
    let uniteJson;
    let uniteJsonWritten;
    let spdxErrors;
    let packageInfo;
    let profileErrors;
    let profileExists;
    let enginePackageConfiguration;
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
        spdxErrors = false;
        packageInfo = undefined;
        uniteJsonWritten = undefined;
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
            if (filename === "spdx-full.json") {
                return spdxErrors ? Promise.reject("Does not exist") : Promise.resolve({
                    MIT: {
                        name: "MIT License",
                        url: "http://www.opensource.org/licenses/MIT",
                        osiApproved: true,
                        licenseText: "MIT"
                    }
                });
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
            if (filename === "unite.json") {
                uniteJsonWritten = obj;
                return Promise.resolve();
            }
            else {
                return originalFileWriteJson(folder, filename, obj);
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
        enginePackageConfiguration = yield fileSystemStub.fileReadJson(fileSystemStub.pathCombine(__dirname, "../../../../"), "package.json");
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
        it("can fail when calling with undefined title", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
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
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("title");
        }));
        it("can fail when calling with missing spdx-full.json", () => __awaiter(this, void 0, void 0, function* () {
            spdxErrors = true;
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("spdx-full.json");
        }));
        it("can fail when calling with undefined license", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("license");
        }));
        it("can fail when calling with undefined sourceLanguage", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
        it("can fail when calling with undefined server", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed to load");
        }));
        it("can succeed when calling with none linter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with undefined outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
                force: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with www outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
                force: undefined,
                outputDirectory: "./test/unit/temp/www"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with defined outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
                force: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed with existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail with invalid unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = null;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
                ides: undefined,
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
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
        it("can succeed when called with known profile", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "My Package",
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
            Chai.expect(uniteJsonWritten.title).to.be.equal("My Package");
            Chai.expect(uniteJsonWritten.applicationFramework).to.be.equal("Aurelia");
            Chai.expect(uniteJsonWritten.sourceLanguage).to.be.equal("TypeScript");
        }));
        it("can succeed when called with known and override parameters", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "My Package",
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
            Chai.expect(uniteJsonWritten.title).to.be.equal("My Package");
            Chai.expect(uniteJsonWritten.applicationFramework).to.be.equal("Angular");
            Chai.expect(uniteJsonWritten.sourceLanguage).to.be.equal("TypeScript");
        }));
        it("can succeed with force and existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
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
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsZ0ZBQTZFO0FBRTdFLGdIQUE2RztBQUU3Ryx3REFBb0Q7QUFDcEQsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksYUFBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFnQyxDQUFDO0lBQ3JDLElBQUksZUFBK0IsQ0FBQztJQUNwQyxJQUFJLFNBQTZCLENBQUM7SUFDbEMsSUFBSSxnQkFBb0MsQ0FBQztJQUN6QyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxXQUFtQixDQUFDO0lBQ3hCLElBQUksYUFBc0IsQ0FBQztJQUMzQixJQUFJLGFBQXNCLENBQUM7SUFDM0IsSUFBSSwwQkFBZ0QsQ0FBQztJQUVyRCxVQUFVLENBQUMsR0FBUyxFQUFFO1FBQ2xCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLFVBQVUsR0FBWSxFQUFFLENBQUM7UUFDekIsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsVUFBVSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0IsY0FBYyxHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FB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QVU7Z0JBQ2hDLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxlQUFlLEVBQUUsa0JBQWtCO2FBQ3RDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjb21tYW5kcy9jb25maWd1cmVDb21tYW5kLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBCdWlsZCBDb25maWd1cmF0aW9uIENvbW1hbmQuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBDb25maWd1cmVDb21tYW5kIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWd1cmVDb21tYW5kXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQnVpbGRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL2ZpbGVTeXN0ZW0ubW9ja1wiO1xuaW1wb3J0IHsgUmVhZE9ubHlGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9yZWFkT25seUZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5kZXNjcmliZShcIkNvbmZpZ3VyZUNvbW1hbmRcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJJbmZvU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyV2FybmluZ1NweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IGxvZ2dlckJhbm5lclNweTogU2lub24uU2lub25TcHk7XG4gICAgbGV0IHVuaXRlSnNvbjogVW5pdGVDb25maWd1cmF0aW9uO1xuICAgIGxldCB1bml0ZUpzb25Xcml0dGVuOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHNwZHhFcnJvcnM6IGJvb2xlYW47XG4gICAgbGV0IHBhY2thZ2VJbmZvOiBzdHJpbmc7XG4gICAgbGV0IHByb2ZpbGVFcnJvcnM6IGJvb2xlYW47XG4gICAgbGV0IHByb2ZpbGVFeGlzdHM6IGJvb2xlYW47XG4gICAgbGV0IGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uOiBQYWNrYWdlQ29uZmlndXJhdGlvbjtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmJhbm5lciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLndhcm5pbmcgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcbiAgICAgICAgbG9nZ2VySW5mb1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwiaW5mb1wiKTtcbiAgICAgICAgbG9nZ2VyV2FybmluZ1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwid2FybmluZ1wiKTtcbiAgICAgICAgbG9nZ2VyQmFubmVyU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJiYW5uZXJcIik7XG5cbiAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICBzcGR4RXJyb3JzID0gZmFsc2U7XG4gICAgICAgIHBhY2thZ2VJbmZvID0gdW5kZWZpbmVkO1xuICAgICAgICB1bml0ZUpzb25Xcml0dGVuID0gdW5kZWZpbmVkO1xuICAgICAgICBwcm9maWxlRXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgcHJvZmlsZUVycm9ycyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZUV4aXN0cyA9IGZpbGVTeXN0ZW1TdHViLmZpbGVFeGlzdHM7XG4gICAgICAgIGNvbnN0IHN0dWJFeGlzdHMgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKTtcbiAgICAgICAgc3R1YkV4aXN0cy5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuaXRlSnNvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwiY29uZmlndXJlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIGlmICghcHJvZmlsZUV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9maWxlRXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IChuZXcgRXJyb3IoXCJmYWlsXCIpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZUV4aXN0cyhmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVJlYWRKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVJlYWRKc29uO1xuICAgICAgICBjb25zdCBzdHVicmVhZEpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpO1xuICAgICAgICBzdHVicmVhZEpzb24uY2FsbHNGYWtlKGFzeW5jIChmb2xkZXIsIGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwic3BkeC1mdWxsLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzcGR4RXJyb3JzID8gUHJvbWlzZS5yZWplY3QoXCJEb2VzIG5vdCBleGlzdFwiKSA6IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIE1JVDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJNSVQgTGljZW5zZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvc2lBcHByb3ZlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpY2Vuc2VUZXh0OiBcIk1JVFwiXG4gICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRlSnNvbiA9PT0gbnVsbCA/IFByb21pc2UucmVqZWN0KFwiZXJyXCIpIDogUHJvbWlzZS5yZXNvbHZlKHVuaXRlSnNvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVSZWFkSnNvbihmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRmlsZVdyaXRlSnNvbiA9IGZpbGVTeXN0ZW1TdHViLmZpbGVXcml0ZUpzb247XG4gICAgICAgIGNvbnN0IHN0dWJXcml0ZUpzb24gPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVdyaXRlSnNvblwiKTtcbiAgICAgICAgc3R1YldyaXRlSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUsIG9iaikgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHVuaXRlSnNvbldyaXR0ZW4gPSBvYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlV3JpdGVKc29uKGZvbGRlciwgZmlsZW5hbWUsIG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVuaXRlSnNvbiA9IHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgIHRpdGxlOiBcIk15IEFwcFwiLFxuICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiWWFyblwiLFxuICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgdW5pdGVWZXJzaW9uOiBcIjAuMC4wXCIsXG4gICAgICAgICAgICBzb3VyY2VFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHZpZXdFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgICAgIHN0eWxlRXh0ZW5zaW9uOiBcIlwiLFxuICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRpcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzcmNEaXN0UmVwbGFjZVdpdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJ1aWxkQ29uZmlndXJhdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBsYXRmb3JtczogdW5kZWZpbmVkXG4gICAgICAgIH07XG5cbiAgICAgICAgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb248UGFja2FnZUNvbmZpZ3VyYXRpb24+KGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwicGFja2FnZS5qc29uXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNvbmZpZ3VyZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VOYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTmFtZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgdGl0bGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwidGl0bGVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggbWlzc2luZyBzcGR4LWZ1bGwuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzcGR4RXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNwZHgtZnVsbC5qc29uXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBsaWNlbnNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJsaWNlbnNlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBzb3VyY2VMYW5ndWFnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNvdXJjZUxhbmd1YWdlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBtb2R1bGVUeXBlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJtb2R1bGVUeXBlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBidW5kbGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiYnVuZGxlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgdW5pdFRlc3RSdW5uZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwidW5pdFRlc3RSdW5uZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5pdFRlc3RSdW5uZXIgTm9uZSBhbmQgdW5pdFRlc3RGcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImlzIG5vdCB2YWxpZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bml0VGVzdFJ1bm5lciBOb25lIGFuZCB1bml0VGVzdEVuZ2luZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJpcyBub3QgdmFsaWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5pdFRlc3RSdW5uZXIgS2FybWEgYW5kIG1pc3NpbmcgdW5pdFRlc3RGcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwidW5pdFRlc3RGcmFtZXdvcmtcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHVuaXRUZXN0RW5naW5lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwidW5pdFRlc3RFbmdpbmVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGUyZVRlc3RSdW5uZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZTJlVGVzdFJ1bm5lclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBlMmVUZXN0UnVubmVyIE5vbmUgYW5kIGUyZVRlc3RGcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiaXMgbm90IHZhbGlkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIGUyZVRlc3RSdW5uZXIgUHJvdHJhY3RvciBhbmQgbWlzc2luZyBlMmVUZXN0RnJhbWV3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZTJlVGVzdEZyYW1ld29ya1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgbGludGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJsaW50ZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGNzc1ByZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiY3NzUHJlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBjc3NQb3N0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNzc1Bvc3RcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHNlcnZlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiUG9zdENzc1wiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNlcnZlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgdGFza01hbmFnZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIlBvc3RDc3NcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ0YXNrTWFuYWdlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBpbnZhbGlkIHBhY2thZ2VNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJibGFoXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VNYW5hZ2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBhcHBsaWNhdGlvbkZyYW1ld29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGlwZWxpbmUgc3RlcCBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJUU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlRTTGludFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBpcGVsaW5lIG1vZHVsZSBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gZmlsZVN5c3RlbVN0dWIuZGlyZWN0b3J5R2V0RmlsZXMgPSBzYW5kYm94LnN0dWIoKTtcbiAgICAgICAgICAgIHN0dWIuY2FsbHNGYWtlKGFzeW5jIChkaXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGlyLmluZGV4T2YoXCJsaW50ZXJcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWFkT25seUZpbGVTeXN0ZW1Nb2NrKCkuZGlyZWN0b3J5R2V0RmlsZXMoZGlyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpLmRpcmVjdG9yeUdldEZpbGVzKGRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJjb3VsZCBub3QgYmUgbG9jYXRlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIHBpcGVsaW5lIG1vZHVsZSB0aHJvd3MgZXJyb3Igd2l0aCBsYWJlbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBmaWxlU3lzdGVtU3R1Yi5kaXJlY3RvcnlHZXRGaWxlcyA9IHNhbmRib3guc3R1YigpLnJlamVjdHMoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkIHRvIGxvYWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwaXBlbGluZSBtb2R1bGUgdGhyb3dzIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCkub25TZWNvbmRDYWxsKCkucmVqZWN0cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJmYWlsZWQgdG8gbG9hZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCBub25lIGxpbnRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiUGxhaW5BcHBcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwic2hvdWxkIHByb2JhYmx5XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBvdXRwdXREaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNob3VsZCBwcm9iYWJseVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCB3d3cgb3V0cHV0RGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibXktYXBwXCIsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJQbGFpbkFwcFwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wL3d3d1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJXYXJuaW5nU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJzaG91bGQgcHJvYmFibHlcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsaW5nIHdpdGggZGVmaW5lZCBvdXRwdXREaXJlY3RvcnlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwic2hvdWxkIHByb2JhYmx5XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggZXhpc3RpbmcgdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHsgZGV2OiBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwic2hvdWxkIHByb2JhYmx5XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggaW52YWxpZCB1bml0ZS5qc29uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZXhpc3RpbmcgdW5pdGUuanNvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCB3aXRoIGp1c3QgdW5rbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogXCJhYWFhYVwiLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJkb2VzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCB3aGVuIHByb2ZpbGUgZmlsZXMgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcHJvZmlsZUV4aXN0cyA9IGZhbHNlO1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcIkF1cmVsaWFUeXBlU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VOYW1lXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIHdoZW4gcHJvZmlsZSBmaWxlIHRocm93cyBleGNlcHRpb25cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcHJvZmlsZUVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicHJvZmlsZSBmaWxlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIHdpdGgganVzdCBrbm93biBwcm9maWxlIGFuZCBubyBwYWNrYWdlTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicGFja2FnZU5hbWVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsZWQgd2l0aCBrbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBlbmdpbmVQYWNrYWdlQ29uZmlndXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiTXkgUGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnBhY2thZ2VOYW1lKS50by5iZS5lcXVhbChcIm15LXBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnRpdGxlKS50by5iZS5lcXVhbChcIk15IFBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmFwcGxpY2F0aW9uRnJhbWV3b3JrKS50by5iZS5lcXVhbChcIkF1cmVsaWFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnNvdXJjZUxhbmd1YWdlKS50by5iZS5lcXVhbChcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsZWQgd2l0aCBrbm93biBhbmQgb3ZlcnJpZGUgcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgZW5naW5lUGFja2FnZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIk15IFBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiQW5ndWxhclwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnBhY2thZ2VOYW1lKS50by5iZS5lcXVhbChcIm15LXBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnRpdGxlKS50by5iZS5lcXVhbChcIk15IFBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmFwcGxpY2F0aW9uRnJhbWV3b3JrKS50by5iZS5lcXVhbChcIkFuZ3VsYXJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnNvdXJjZUxhbmd1YWdlKS50by5iZS5lcXVhbChcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBmb3JjZSBhbmQgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHsgZGV2OiBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIGVuZ2luZVBhY2thZ2VDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJteS1hcHBcIixcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlBsYWluQXBwXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInNob3VsZCBwcm9iYWJseVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIl19
