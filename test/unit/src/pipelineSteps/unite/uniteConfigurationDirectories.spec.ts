/**
 * Tests for UniteConfigurationDirectories.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { UniteConfigurationDirectories } from "../../../../../dist/pipelineSteps/unite/uniteConfigurationDirectories";
import { FileSystemMock } from "../../fileSystem.mock";

describe("UniteConfigurationDirectories", () => {
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
        uniteConfigurationStub.unitTestRunner = "None";
        uniteConfigurationStub.e2eTestRunner = "None";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new UniteConfigurationDirectories();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new UniteConfigurationDirectories();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(1);
        });
    });

    describe("process", () => {
        it("can throw an exception", async () => {
            sandbox.stub(fileSystemMock, "pathToWeb").throws("error");
            const obj = new UniteConfigurationDirectories();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contain("failed");
        });

        it("can setup folders with no unit test runner", async () => {
            const obj = new UniteConfigurationDirectories();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.dirs.www.src).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.dist).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.unitTest).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.unitTestSrc).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.unitTestDist).to.be.equal(undefined);
        });

        it("can setup folders with no e2e test runner", async () => {
            const obj = new UniteConfigurationDirectories();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.dirs.www.src).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.dist).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.e2eTest).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.e2eTestSrc).to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.e2eTestDist).to.be.equal(undefined);
        });

        it("can succeed", async () => {
            uniteConfigurationStub.unitTestRunner = "Karma";
            uniteConfigurationStub.e2eTestRunner = "Protractor";
            const obj = new UniteConfigurationDirectories();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.dirs.www.src).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.dist).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.unitTest).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.unitTestSrc).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.unitTestDist).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.e2eTest).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.e2eTestSrc).not.to.be.equal(undefined);
            Chai.expect(uniteConfigurationStub.dirs.www.e2eTestDist).not.to.be.equal(undefined);
        });
    });
});
