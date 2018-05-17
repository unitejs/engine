/**
 * Tests for Build Configuration.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteBuildConfiguration } from "../../../../../src/configuration/models/unite/uniteBuildConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { BuildConfiguration } from "../../../../../src/pipelineSteps/content/buildConfiguration";
import { FileSystemMock } from "../../fileSystem.mock";

describe("BuildConfiguration", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();

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
        const obj = new BuildConfiguration();
        Chai.should().exist(obj);
    });

    describe("finalise", () => {
        it("can fail when folder create fails", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate").rejects();

            const obj = new BuildConfiguration();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when file exists fails", async () => {
            sandbox.stub(fileSystemMock, "fileExists").rejects();

            const obj = new BuildConfiguration();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when file create fails", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").rejects();

            const obj = new BuildConfiguration();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can succeed when already exists", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/configuration/");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/configuration/", "common.json", "{}");

            const obj = new BuildConfiguration();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/configuration/");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/configuration", "common.json");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can succeed with no build configurations", async () => {
            uniteConfigurationStub.buildConfigurations = undefined;
            const obj = new BuildConfiguration();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/configuration/");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/configuration", "common.json");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can succeed with configurations", async () => {
            uniteConfigurationStub.buildConfigurations = { test: new UniteBuildConfiguration()};
            const obj = new BuildConfiguration();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/configuration/");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/configuration", "common.json");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/configuration", "test.json");
            Chai.expect(exists).to.be.equal(true);
        });
    });
});
