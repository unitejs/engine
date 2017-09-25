/**
 * Tests for UniteThemeConfigurationJson.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../../../../dist/configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { UniteThemeConfigurationJson } from "../../../../../dist/pipelineSteps/unite/uniteThemeConfigurationJson";
import { FileSystemMock } from "../../fileSystem.mock";

describe("UniteThemeConfigurationJson", () => {
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
        uniteConfigurationStub.title = "This Is My Title";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new UniteThemeConfigurationJson();
        Chai.should().exist(obj);
    });

    describe("intitialise", () => {
        it("can fail when exception is thrown", async () => {
            fileSystemMock.fileExists = sandbox.stub().throws("error");
            const obj = new UniteThemeConfigurationJson();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("UniteTheme")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can succeed when file does not exist and empty title", async () => {
            fileSystemMock.fileExists = sandbox.stub().resolves(false);
            uniteConfigurationStub.title = undefined;
            const obj = new UniteThemeConfigurationJson();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").themeColor).to.be.equal("#339933");
        });

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ themeColor: "#112211" });
            const obj = new UniteThemeConfigurationJson();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").themeColor).to.be.equal("#112211");
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").metaDescription).to.be.equal("This Is My Title");
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").metaKeywords).to.be.deep.equal(["This", "Is", "My", "Title"]);
        });
    });

    describe("finalise", () => {
        it("can fail writing", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").rejects("error");
            const obj = new UniteThemeConfigurationJson();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can succeed writing", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileWriteJson").resolves();
            const obj = new UniteThemeConfigurationJson();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(stub.called).to.be.equal(true);
        });
    });
});
