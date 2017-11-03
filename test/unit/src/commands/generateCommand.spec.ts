/**
 * Tests for Generate Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { GenerateCommand } from "../../../../src/commands/generateCommand";
import { IUniteGenerateTemplates } from "../../../../src/configuration/models/unite/IUniteGenerateTemplates";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("GenerateCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let enginePeerPackages: { [id: string]: string};
    let generateTemplates: IUniteGenerateTemplates;
    let sharedGenerateTemplates: IUniteGenerateTemplates;
    let generateTemplatesExist: boolean;
    let sharedGenerateTemplatesExist: boolean;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();

        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");

        uniteJson = undefined;
        generateTemplates = undefined;
        sharedGenerateTemplates = undefined;
        generateTemplatesExist = true;
        sharedGenerateTemplatesExist = true;

        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            } else if (filename === "doesnotexist.ts") {
                return Promise.resolve(false);
            } else if (filename === "already-exists.component.ts") {
                return Promise.resolve(true);
            } else if (filename === "generate-templates.json") {
                if (folder.indexOf("shared") > 0) {
                    return Promise.resolve(sharedGenerateTemplatesExist);
                } else {
                    return Promise.resolve(generateTemplatesExist);
                }
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
                if (folder.indexOf("shared") > 0) {
                    return sharedGenerateTemplates ? sharedGenerateTemplates : originalFileReadJson(folder, filename);
                } else {
                    return generateTemplates ? generateTemplates : originalFileReadJson(folder, filename);
                }
            } else {
                return originalFileReadJson(folder, filename);
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
            styleExtension: "scss",
            clientPackages: undefined,
            dirs: {
                wwwRoot: "./www/",
                packagedRoot: undefined,
                platformRoot: undefined,
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

        enginePeerPackages = await fileSystemStub.fileReadJson<{ [id: string ]: string}>(fileSystemStub.pathCombine(__dirname, "../../../../assets/"), "peerPackages.json");
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            generateTemplatesExist = false;
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "fred",
                type: "blah",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("There was an error loading generate-templates");
        });

        it("can fail when shared template and shared not exists", async () => {
            sharedGenerateTemplatesExist = false;
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no shared generate-templates");
        });

        it("can fail when shared template and shared base not exists", async () => {
            sharedGenerateTemplates = {};
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Can not find a type of");
        });

        it("can fail when pipeline throws an error", async () => {
            fileSystemStub.directoryGetFiles = sandbox.stub().throws();

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(1);
        });

        it("can succeed with shared template", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "fred",
                type: "class",
                subFolder: undefined,
                outputDirectory: undefined

            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when calling with name and type", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when not in source folder", async () => {
            const wwwFolder = fileSystemStub.pathAbsolute(fileSystemStub.pathCombine("./test/unit/temp", uniteJson.dirs.wwwRoot));
            const srcFolder = fileSystemStub.pathAbsolute(fileSystemStub.pathCombine(wwwFolder, uniteJson.dirs.www.src));

            const originalPathAbsolute = fileSystemStub.pathAbsolute;
            const stub = sandbox.stub(fileSystemStub, "pathAbsolute");
            stub.callsFake((dir) => {
                if (dir === "./") {
                    return fileSystemStub.pathAbsolute(fileSystemStub.pathCombine(srcFolder, "blah"));
                }

                return originalPathAbsolute(dir);
            });

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when path to web is not ./", async () => {
            const stub = sandbox.stub(fileSystemStub, "pathToWeb");
            stub.callsFake((dir) => dir);

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "Bob",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can fail when dest file exists", async () => {
            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                name: "AlreadyExists",
                type: "component",
                subFolder: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Destination file exists");
        });

        it("can fail when source files does not exist", async () => {
            generateTemplates = { component: {
                sourceFiles: ["doesnotexist.ts"]
            }};

            const obj = new GenerateCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
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
