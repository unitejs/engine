/**
 * Tests for E2eTestScaffold.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { E2eTestScaffold } from "../../../../../src/pipelineSteps/scaffold/e2eTestScaffold";
import { FileSystemMock } from "../../fileSystem.mock";

describe("E2eTestScaffold", () => {
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

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new E2eTestScaffold();
            uniteConfigurationStub.e2eTestRunner = "None";
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new E2eTestScaffold();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("finalise", () => {
        it("can be called", async () => {
            const obj = new E2eTestScaffold();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.directoryExists("./test/unit/temp/www/test/e2e");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/test/e2e");

            const obj = new E2eTestScaffold();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.directoryExists("./test/unit/temp/www/test/e2e");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
