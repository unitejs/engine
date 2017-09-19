/**
 * Tests for UniteConfigurationJson.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../../../../../dist/configuration/models/packages/packageConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { UniteConfigurationJson } from "../../../../../dist/pipelineSteps/unite/uniteConfigurationJson";
import { FileSystemMock } from "../../fileSystem.mock";

describe("UniteConfigurationJson", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(async () => {
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
        await fileSystemMock.directoryCreate("./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new UniteConfigurationJson();
        Chai.should().exist(obj);
    });

    describe("finalise", () => {
        it("can succeed", async () => {
            const obj = new UniteConfigurationJson();
            engineVariablesStub.enginePackageJson = new PackageConfiguration();
            engineVariablesStub.enginePackageJson.version = "1.2.3";
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const json = await fileSystemMock.fileReadJson<UniteConfiguration>("./test/unit/temp/", "unite.json");
            Chai.expect(json.uniteVersion).to.be.equal("1.2.3");
        });
    });
});
