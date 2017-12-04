/**
 * Tests for Package Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageCommand } from "../../../../src/commands/packageCommand";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { UnitePackageClientConfiguration } from "../../../../src/configuration/models/unitePackages/unitePackageClientConfiguration";
import { UnitePackageConfiguration } from "../../../../src/configuration/models/unitePackages/unitePackageConfiguration";
import { PackageUtils } from "../../../../src/pipelineSteps/packageUtils";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("PackageCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let unitePackageJson: UnitePackageConfiguration;
    let enginePeerPackages: { [id: string]: string};
    let appFrameworkDirExists: boolean;
    let examplesDirExists: boolean;

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

        appFrameworkDirExists = true;
        examplesDirExists = true;

        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            } else if (filename === "unite-package.json") {
                return Promise.resolve(unitePackageJson === undefined ? false : true);
            } else {
                return originalFileExists(folder, filename);
            }
        });
        const originalDirExists = fileSystemStub.directoryExists;
        const stubDirExists = sandbox.stub(fileSystemStub, "directoryExists");
        stubDirExists.callsFake(async (folder) => {
            if (folder.toLowerCase().endsWith(uniteJson.applicationFramework.toLowerCase())) {
                return Promise.resolve(appFrameworkDirExists);
            } else if (folder.endsWith("examples")) {
                return Promise.resolve(examplesDirExists);
            } else {
                return originalDirExists(folder);
            }
        });
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            } else if (filename === "unite-package.json") {
                return unitePackageJson === null ? Promise.reject("err") : Promise.resolve(unitePackageJson);
            } else {
                return originalFileReadJson(folder, filename);
            }
        });

        uniteJson = {
            packageName: undefined,
            title: undefined,
            license: undefined,
            sourceLanguage: "TypeScript",
            moduleType: "amd",
            bundler: undefined,
            unitTestRunner: "Karma",
            unitTestFramework: "Jasmine",
            unitTestEngine: undefined,
            e2eTestRunner: undefined,
            e2eTestFramework: undefined,
            cssPre: undefined,
            cssPost: undefined,
            cssLinter: undefined,
            documenter: undefined,
            linter: undefined,
            packageManager: "Yarn",
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
                docsRoot: undefined,
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

        unitePackageJson = {
            name: "moment",
            version: "0.0.1",
            clientPackages: {},
            routes: {}
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
            const obj = new PackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined application framework", async () => {
            const obj = new PackageCommand();
            uniteJson.applicationFramework = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("applicationFramework");
        });

        it("can fail when calling with undefined module type", async () => {
            const obj = new PackageCommand();
            uniteJson.moduleType = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("moduleType");
        });

        it("can fail when calling with undefined package manager", async () => {
            const obj = new PackageCommand();
            uniteJson.packageManager = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        });

        it("can fail when calling with undefined package name", async () => {
            const obj = new PackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        });

        it("can fail when calling with file system exception", async () => {
            const obj = new PackageCommand();
            unitePackageJson = null;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("err");
        });

        it("can fail when package folder does not exist", async () => {
            const obj = new PackageCommand();
            unitePackageJson = null;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "blah",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not exist");
        });

        it("can fail when package folder exists but unite-package does not exist", async () => {
            const obj = new PackageCommand();
            unitePackageJson = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not exist");
        });

        it("can fail when calling with file system exception", async () => {
            const obj = new PackageCommand();
            unitePackageJson = null;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("err");
        });

        it("can complete when application framework dir does not exist", async () => {
            const obj = new PackageCommand();
            appFrameworkDirExists = false;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);

            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can fail when there is no matching dest folder", async () => {
            const obj = new PackageCommand();

            sandbox.stub(fileSystemStub, "directoryGetFolders").resolves(["blah"]);

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);

            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("destination folder");
        });

        it("can fail if directory create fails", async () => {
            const obj = new PackageCommand();

            sandbox.stub(fileSystemStub, "directoryCreate").rejects(new Error("err"));

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);

            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("creating folder");
        });

        it("can fail if file copy fails", async () => {
            const obj = new PackageCommand();

            sandbox.stub(fileSystemStub, "fileWriteText").rejects(new Error("err"));

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);

            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("copying file");
        });

        it("can complete when directory does not exist already exists", async () => {
            const obj = new PackageCommand();

            examplesDirExists = false;

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);

            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can complete with no routes", async () => {
            const obj = new PackageCommand();
            unitePackageJson.routes = {};
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can complete with routes", async () => {
            const obj = new PackageCommand();
            unitePackageJson.routes = {
                "my/route": {
                    modulePath: "./examples/my-route",
                    moduleType: "MyRoute"
                },
               "their/root": {
                    modulePath: "./their/root",
                    moduleType: "TheirRoot"
                }
            };
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args.join()).to.contain("Success");
        });

        it("can complete with no client packages", async () => {
            const obj = new PackageCommand();
            unitePackageJson.clientPackages = undefined;
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can complete with client packages using profiles", async () => {
            sandbox.stub(PackageUtils, "exec").resolves("{}");

            const obj = new PackageCommand();
            unitePackageJson.clientPackages.moment = new UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can fail with client packages using unknown profiles", async () => {
            const obj = new PackageCommand();
            unitePackageJson.clientPackages.moment = new UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "dfgkjhdfgkjhdfkgjdf";

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("exist");
        });

        it("can fail with client packages can not lookup package info", async () => {
            const obj = new PackageCommand();
            unitePackageJson.clientPackages.moment = new UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.profile = "moment";
            sandbox.stub(PackageUtils, "exec").throws(new Error("err"));

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can complete with client packages without profiles", async () => {
            sandbox.stub(PackageUtils, "exec").resolves("{}");

            const obj = new PackageCommand();
            unitePackageJson.clientPackages.moment = new UnitePackageClientConfiguration();
            unitePackageJson.clientPackages.moment.name = "moment";

            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can complete with nothing else to do", async () => {
            const obj = new PackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                packageName: "moment",
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });
    });
});
