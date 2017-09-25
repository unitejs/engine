/**
 * Tests for Build Configuration Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { ConfigureCommand } from "../../../../dist/commands/configureCommand";
import { PackageConfiguration } from "../../../../dist/configuration/models/packages/packageConfiguration";
import { UniteBuildConfiguration } from "../../../../dist/configuration/models/unite/uniteBuildConfiguration";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("ConfigureCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let uniteJsonWritten: UniteConfiguration;
    let spdxErrors: boolean;
    let packageInfo: string;
    let profileErrors: boolean;
    let profileExists: boolean;
    let enginePackageConfiguration: PackageConfiguration;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();

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
        stubExists.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            } else if (filename === "configure.json") {
                if (!profileExists) {
                    return false;
                } else if (profileErrors) {
                    throw (new Error("fail"));
                } else {
                    return originalFileExists(folder, filename);
                }
            } else {
                return originalFileExists(folder, filename);
            }
        });
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake(async (folder, filename) => {
            if (filename === "spdx-full.json") {
                return spdxErrors ? Promise.reject("Does not exist") : Promise.resolve({
                    MIT: {
                        name: "MIT License",
                        url: "http://www.opensource.org/licenses/MIT",
                        osiApproved: true,
                        licenseText: "MIT"
                    }});
            } else if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            } else {
                return originalFileReadJson(folder, filename);
            }
        });
        const originalFileWriteJson = fileSystemStub.fileWriteJson;
        const stubWriteJson = sandbox.stub(fileSystemStub, "fileWriteJson");
        stubWriteJson.callsFake(async (folder, filename, obj) => {
            if (filename === "unite.json") {
                uniteJsonWritten = obj;
                return Promise.resolve();
            } else {
                return originalFileWriteJson(folder, filename, obj);
            }
        });

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

        enginePackageConfiguration = await fileSystemStub.fileReadJson<PackageConfiguration>(fileSystemStub.pathCombine(__dirname, "../../../../"), "package.json");
    });

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystemMock();
        await obj.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new ConfigureCommand();
        Chai.should().exist(obj);
    });

    describe("configure", () => {
        it("can fail when calling with undefined packageName", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined title", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with missing spdx-full.json", async () => {
            spdxErrors = true;
            uniteJson = undefined;

            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined license", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined sourceLanguage", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined moduleType", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined bundler", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined unitTestRunner", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with unitTestRunner None and unitTestFramework", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with unitTestRunner None and unitTestEngine", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with unitTestRunner Karma and missing unitTestFramework", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined unitTestEngine", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined e2eTestRunner", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with e2eTestRunner None and e2eTestFramework", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with e2eTestRunner Protractor and missing e2eTestFramework", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined linter", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined cssPre", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined cssPost", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined server", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined taskManager", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with invalid packageManager", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when calling with undefined applicationFramework", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when pipeline step fails", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when pipeline module does not exist", async () => {
            uniteJson = undefined;
            let counter = 0;
            const stub = fileSystemStub.directoryGetFiles = sandbox.stub();
            stub.callsFake(async (dir) => {
                if (dir.indexOf("linter") >= 0) {
                    if (counter > 0) {
                        return Promise.resolve([]);
                    } else {
                        counter++;
                        return new ReadOnlyFileSystemMock().directoryGetFiles(dir);
                    }
                } else {
                    return new ReadOnlyFileSystemMock().directoryGetFiles(dir);
                }
            });
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when pipeline module throws error with label", async () => {
            uniteJson = undefined;
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("error");
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when pipeline module throws error", async () => {
            uniteJson = undefined;
            fileSystemStub.directoryGetFiles = sandbox.stub().onSecondCall().rejects("error");
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed when calling with none linter", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed when calling with undefined outputDirectory", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed when calling with www outputDirectory", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed when calling with defined outputDirectory", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed with existing unite.json", async () => {
            uniteJson.buildConfigurations = { dev: new UniteBuildConfiguration() };
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail with invalid unite.json", async () => {
            uniteJson = null;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when called with just unknown profile", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when called when profile files does not exist", async () => {
            profileExists = false;
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when called when profile file throws exception", async () => {
            profileErrors = true;
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can fail when called with just known profile and no packageName", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed when called with known profile", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed when called with known and override parameters", async () => {
            uniteJson = undefined;
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });

        it("can succeed with force and existing unite.json", async () => {
            uniteJson.buildConfigurations = { dev: new UniteBuildConfiguration() };
            const obj = new ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
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
        });
    });

});
