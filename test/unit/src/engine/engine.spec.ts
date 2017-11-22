/**
 * Tests for Engine.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { Engine } from "../../../../src/engine/engine";
import { IBuildConfigurationCommandParams } from "../../../../src/interfaces/IBuildConfigurationCommandParams";
import { IClientPackageCommandParams } from "../../../../src/interfaces/IClientPackageCommandParams";
import { IConfigureCommandParams } from "../../../../src/interfaces/IConfigureCommandParams";
import { IPlatformCommandParams } from "../../../../src/interfaces/IPlatformCommandParams";
import { PackageUtils } from "../../../../src/pipelineSteps/packageUtils";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("Engine", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let packageJsonErrors: boolean;
    let spdxErrors: boolean;
    let fileWriteJsonErrors: boolean;
    let packageInfo: string;
    let failPackageAdd: boolean;
    let profileErrors: boolean;
    let profileExists: boolean;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();

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
            if (filename === "package.json") {
                return packageJsonErrors ? Promise.reject("Does not exist") : originalFileReadJson(folder, filename);
            } else if (filename === "spdx-full.json") {
                return spdxErrors ? Promise.reject("Does not exist") : originalFileReadJson(folder, filename);
            } else if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            } else {
                return originalFileReadJson(folder, filename);
            }
        });
        const originalFileWriteJson = fileSystemStub.fileWriteJson;
        const stubWriteJson = sandbox.stub(fileSystemStub, "fileWriteJson");
        stubWriteJson.callsFake(async (folder, filename, obj) => {
            if (fileWriteJsonErrors) {
                return Promise.reject("error");

            } else {
                return originalFileWriteJson(folder, filename, obj);
            }
        });

        const execStub = sandbox.stub(PackageUtils, "exec");
        execStub.callsFake(async (logger: ILogger, fileSystem: IFileSystem, packageName: string, workingDirectory: string, args: string[]) => {
            if (args[0] === "view") {
                if (packageInfo === null) {
                    return Promise.reject("package information");
                } else {
                    return Promise.resolve(packageInfo);
                }
            } else {
                return failPackageAdd ? Promise.reject("error") : Promise.resolve();
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
            cssLinter: "None",
            documenter: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "Vanilla",
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

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystemMock();
        await obj.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Engine(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can fail when node version is too low", async () => {
            sandbox.stub(process, "version").value("v7.0.0");
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.initialise();
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("higher is required");
        });

        it("can succeed when node version is 8 or higher", async () => {
            sandbox.stub(process, "version").value("v8.0.0");
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.initialise();
            Chai.expect(res).to.be.equal(0);
        });

        it("can fail when missing package dependencies", async () => {
            uniteJson = undefined;
            packageJsonErrors = true;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.initialise();
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies failed");
        });
    });

    describe("version", () => {
        it("can fail when called before package dependencies", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = obj.version();
            Chai.expect(res).to.be.equal("unknown");
        });

        it("can succeed when package dependencies loaded", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = obj.version();
            Chai.expect(/(\d*)\.(\d*)\.(\d*)/.test(res)).to.be.equal(true);
        });
    });

    describe("command", () => {
        it("can call command as configure", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IConfigureCommandParams>("configure", {
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
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: true,
                noCreateSource: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can call as clientPackage", async () => {
            packageInfo = "{}";
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IClientPackageCommandParams>("clientPackage", {
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
        });

        it("can call as platform", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IPlatformCommandParams>("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can call as buildConfiguration", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IBuildConfigurationCommandParams>("buildConfiguration", {
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
        });

        it("can call with empty outputDirectory", async () => {
            packageInfo = "{}";
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IPlatformCommandParams>("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can call with www outputDirectory", async () => {
            packageInfo = "{}";
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IPlatformCommandParams>("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: "./test/unit/temp/www"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can call with www/src outputDirectory", async () => {
            uniteJson = undefined;
            packageInfo = "{}";
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<IPlatformCommandParams>("platform", {
                operation: "add",
                platformName: "web",
                outputDirectory: "./test/unit/temp/www/src"
            });
            Chai.expect(res).to.be.equal(1);
        });

        it("can call as unknown", async () => {
            packageInfo = "{}";
            const obj = new Engine(loggerStub, fileSystemStub);
            await obj.initialise();
            const res = await obj.command<any>("unknown", {});
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Error loading command module");
        });
    });
});
