/**
 * Tests for Cordova.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../../../../src/configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { IPackageManager } from "../../../../../src/interfaces/IPackageManager";
import { Cordova } from "../../../../../src/pipelineSteps/platform/cordova";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Cordova", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.platforms = { Cordova: {}};
        uniteConfigurationStub.taskManager = "Gulp";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");

        const packageManagerStub: IPackageManager = <IPackageManager>{};
        packageManagerStub.getInstallCommand = sandbox.stub();
        engineVariablesStub.packageManager = packageManagerStub;
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Cordova();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Cordova();
            uniteConfigurationStub.platforms = {};
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Cordova();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new Cordova();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.xml2js).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition and cordova", async () => {
            engineVariablesStub.setConfiguration("UniteTheme", { cordova: {}});

            const obj = new Cordova();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {
                xml2js: "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.xml2js).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova).to.be.equal(undefined);
        });

        it("can be called with true mainCondition and empty cordova", async () => {
            engineVariablesStub.setConfiguration("UniteTheme", { });

            const obj = new Cordova();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.xml2js).to.be.equal("1.2.3");
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.headers.length).to.be.equal(3);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.scriptInclude.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.scriptStart.length).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.scriptEnd.length).to.be.equal(1);
        });

        it("can be called with true mainCondition and existing cordova", async () => {
            engineVariablesStub.setConfiguration("UniteTheme", { cordova: {
                headers: [1, 2, 3],
                scriptInclude: [4, 5, 6],
                scriptStart: [7, 8],
                scriptEnd: [9, 10]
            }});

            const obj = new Cordova();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.xml2js).to.be.equal("1.2.3");
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.headers).to.be.deep.equal([1, 2, 3]);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.scriptInclude).to.be.deep.equal([4, 5, 6]);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.scriptStart).to.be.deep.equal([7, 8]);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").cordova.scriptEnd).to.be.deep.equal([9, 10]);
        });
    });

    describe("finalise", () => {
        it("can do nothing if not gulp", async () => {
            uniteConfigurationStub.taskManager = undefined;
            const stub = sandbox.stub(fileSystemMock, "pathCombine");
            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.callCount).to.be.equal(2);
        });

        it("can fail creating platform folder", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate").rejects();
            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can fail copying asset file", async () => {
            sandbox.stub(fileSystemMock, "fileReadText").rejects();
            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can fail copying second asset file", async () => {
            sandbox.stub(fileSystemMock, "fileReadText").onSecondCall().rejects();
            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can succeed", async () => {
            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/tasks/", "platform-cordova.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/assets/platform/cordova/", "cordova.jsproj");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can fail if delete file erros with false mainCondition", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["Generated by UniteJS"]);
            sandbox.stub(fileSystemMock, "fileDelete").rejects();

            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(1);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/build/tasks/");
            await fileSystemMock.directoryCreate("./test/unit/temp/www/build/tasks/assets/platform/cordova");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/build/tasks/", "platform-cordova.js", "Generated by UniteJS");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/build/tasks/assets/platform/cordova", "cordova.jsproj", "Generated by UniteJS");

            const obj = new Cordova();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/tasks/", "platform-cordova.js");
            Chai.expect(exists).to.be.equal(false);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/assets/platform/cordova/", "cordova.jsproj");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
