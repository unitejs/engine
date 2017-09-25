/**
 * Tests for Generate Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { GenerateCommand } from "../../../../dist/commands/generateCommand";
import { PackageConfiguration } from "../../../../dist/configuration/models/packages/packageConfiguration";
import { IUniteGenerateTemplates } from "../../../../dist/configuration/models/unite/IUniteGenerateTemplates";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("GenerateCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let uniteJsonWritten: UniteConfiguration;
    let packageJsonErrors: boolean;
    let spdxErrors: boolean;
    let fileWriteJsonErrors: boolean;
    let packageInfo: string;
    let failPackageAdd: boolean;
    let enginePackageConfiguration: PackageConfiguration;
    let generateTemplates: IUniteGenerateTemplates;

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
        packageJsonErrors = false;
        spdxErrors = false;
        fileWriteJsonErrors = false;
        packageInfo = undefined;
        uniteJsonWritten = undefined;
        failPackageAdd = false;
        generateTemplates = undefined;

        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            } else if (filename === "doesnotexist.ts") {
                return Promise.resolve(false);
            } else {
                return originalFileExists(folder, filename);
            }
        });
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            } else if (filename === "generate-templates.json") {
                return generateTemplates ? generateTemplates : originalFileReadJson(folder, filename);
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
            styleExtension: "sass",
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

        enginePackageConfiguration = await fileSystemStub.fileReadJson<PackageConfiguration>(fileSystemStub.pathCombine(__dirname, "../../../../"), "package.json");
    });

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystemMock();
        await obj.directoryDelete("./test/unit/temp");
    });

    describe("run", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: undefined,
                type: undefined,
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined name", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: undefined,
                type: undefined,
                subFolder: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("name");
        });

        it("can fail when calling with undefined type", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "fred",
                type: undefined,
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("type");
        });

        it("can fail when no generate-templates for framework", async () => {
            uniteJson.applicationFramework = "Aurelia";
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "fred",
                type: "component",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no generate-templates for applicationFramework");
        });

        it("can fail when no type for framework", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "fred",
                type: "blah",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not find a type of");
        });

        it("can fail when throws and exception", async () => {
            uniteJson.applicationFramework = undefined;
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "fred",
                type: "blah",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("There was an error loading generate-templates");
        });

        it("can succeed when calling with name and type", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when calling with name and type and subfolder", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: "blah",
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when calling with name and type and empty subfolder", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: "",
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when generate-templates has no files", async () => {
            generateTemplates = { component: {}};
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can fail when source files does not exist", async () => {
            generateTemplates = { component: {
                sourceFiles: ["filenotexist.ts"]
            }};

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not find a source for");
        });

        it("can fail when source file is not supported", async () => {
            sandbox.stub(fileSystemStub, "fileReadText").resolves("!Message");

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Message");
        });

        it("can fail when source files throws an exception", async () => {
            sandbox.stub(fileSystemStub, "fileReadText").throws();

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("generating from the template");
        });
    });
});
