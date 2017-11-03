/**
 * Tests for Jest.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { JestConfiguration } from "../../../../../src/configuration/models/jest/jestConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Jest } from "../../../../../src/pipelineSteps/unitTestRunner/jest";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Jest", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.unitTestRunner = "Jest";
        uniteConfigurationStub.unitTestEngine = "JSDom";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.moduleType = "CommonJS";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Jest();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Jest();
            uniteConfigurationStub.unitTestRunner = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Jest();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
        it("can fail when exception is thrown on config", async () => {
            fileSystemMock.fileExists = sandbox.stub().throws("error");
            const obj = new Jest();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("Jest")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when not using jsdom", async () => {
            uniteConfigurationStub.unitTestEngine = "Karma";
            const obj = new Jest();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("Jest")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("can only use JSDom");
        });

        it("can fail when not using commonjs", async () => {
            uniteConfigurationStub.moduleType = "AMD";
            const obj = new Jest();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("Jest")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("can only use CommonJS");
        });

        it("can fail when not using jasmine", async () => {
            uniteConfigurationStub.unitTestFramework = "MochaChai";
            const obj = new Jest();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("Jest")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("can only use Jasmine");
        });

        it("can setup the engine configuration when mainCondition is not set", async () => {
            const obj = new Jest();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("Jest")).to.be.equal(undefined);
        });

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ coverageReporters: ["bob"] });
            const obj = new Jest();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<JestConfiguration>("Jest").coverageReporters).to.contain("bob");
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new Jest();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.jest).to.be.equal("1.2.3");
        });

        it("can complete with false mainCondition", async () => {
            const obj = new Jest();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { jest: "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.jest).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can fail writing", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").throws();

            const obj = new Jest();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(1);
        });

        it("can succeed writing", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/test/unit/");

            const obj = new Jest();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/", "jest.config.json");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/", "dummy.mock.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can complete with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/test/unit/");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/", "jest.config.json", "{}");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/test/unit", "dummy.mock.js", "/* Generated by UniteJS */");

            const obj = new Jest();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/", "jest.config.json");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/", "dummy.mock.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
