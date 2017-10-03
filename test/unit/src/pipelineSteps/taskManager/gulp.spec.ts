/**
 * Tests for Gulp.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Gulp } from "../../../../../src/pipelineSteps/taskManager/gulp";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Gulp", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.taskManager = "Gulp";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.bundler = "RequireJS";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "PostCss";
        uniteConfigurationStub.server = "BrowserSync";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Gulp();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Gulp();
            uniteConfigurationStub.taskManager = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Gulp();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
        it("can succeed", async () => {
            const obj = new Gulp();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new Gulp();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.gulp).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.del).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["gulp-util"]).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new Gulp();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {
                gulp: "1.2.3",
                del: "1.2.3",
                "browser-sync": "1.2.3",
                "gulp-util": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.gulp).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["gulp-util"]).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can be called with so that files are deleted", async () => {
            uniteConfigurationStub.unitTestRunner = "None";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with failing file operations", async () => {
            sandbox.stub(fileSystemMock, "fileWriteText").rejects();
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can be called", async () => {
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/build/tasks");
            await fileSystemMock.fileWriteText("./test/unit/temp/build/tasks", "build.js", "Generated by UniteJS");

            const obj = new Gulp();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/tasks", "build.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
