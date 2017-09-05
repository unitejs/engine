/**
 * Tests for E2eTestScaffold.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { E2eTestScaffold } from "../../../../../dist/pipelineSteps/scaffold/e2eTestScaffold";
import { FileSystemMock } from "../../fileSystem.mock";

describe("E2eTestScaffold", () => {
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
        uniteConfigurationStub.e2eTestRunner = "Protractor";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new E2eTestScaffold();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new E2eTestScaffold();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(1);
        });
    });

    describe("process", () => {
        it("can throw an exception", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate").rejects("error");
            const obj = new E2eTestScaffold();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contain("failed");
        });

        it("can not create if non matching runner", async () => {
            uniteConfigurationStub.e2eTestRunner = "None";
            const stub = sandbox.stub(fileSystemMock, "directoryCreate").resolves();
            const obj = new E2eTestScaffold();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.called).to.be.equal(false);
        });

        it("can succeed", async () => {
            const stub = sandbox.stub(fileSystemMock, "directoryCreate").resolves();
            const obj = new E2eTestScaffold();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contain("Creating");
            Chai.expect(stub.called).to.be.equal(true);
        });
    });
});
