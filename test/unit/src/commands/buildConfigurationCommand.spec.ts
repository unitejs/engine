/**
 * Tests for Build Configuration Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BuildConfigurationCommand } from "../../../../dist/commands/buildConfigurationCommand";
import { PackageConfiguration } from "../../../../dist/configuration/models/packages/packageConfiguration";
import { UniteBuildConfiguration } from "../../../../dist/configuration/models/unite/uniteBuildConfiguration";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("BuildConfigurationCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let uniteJsonWritten: UniteConfiguration;
    let fileWriteJsonErrors: boolean;
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
        uniteJsonWritten = undefined;
        fileWriteJsonErrors = false;

        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            } else {
                return originalFileExists(folder, filename);
            }
        });
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
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
                if (filename === "unite.json") {
                    uniteJsonWritten = obj;
                    return Promise.resolve();
                } else {
                    return originalFileWriteJson(folder, filename, obj);
                }
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
            ide: "",
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

    describe("buildConfiguration add", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined configurationName", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("configurationName");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;

            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed when calling with configurationName", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.bundle).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.minify).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.sourcemaps).to.be.equal(true);
        });

        it("can succeed when calling all params", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                configurationName: "myconfig",
                bundle: true,
                minify: true,
                sourcemaps: false,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.bundle).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.minify).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.sourcemaps).to.be.equal(false);
        });
    });

    describe("buildConfiguration remove", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined configurationName", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("configurationName");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;
            uniteJson.buildConfigurations = { myconfig: new UniteBuildConfiguration() };

            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can fail when configurationName does not exist", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("has not");
        });

        it("can succeed when calling with configurationName", async () => {
            uniteJson.buildConfigurations = { myconfig: new UniteBuildConfiguration() };
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig).to.be.equal(undefined);
        });

        it("can succeed when calling all params", async () => {
            uniteJson.buildConfigurations = { myconfig: new UniteBuildConfiguration() };
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig).to.be.equal(undefined);
        });
    });
});
