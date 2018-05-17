/**
 * Tests for UniteThemeConfigurationJson.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../../../../src/configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { EngineVariablesMeta } from "../../../../../src/engine/engineVariablesMeta";
import { UniteThemeConfigurationJson } from "../../../../../src/pipelineSteps/unite/uniteThemeConfigurationJson";
import { FileSystemMock } from "../../fileSystem.mock";

describe("UniteThemeConfigurationJson", () => {
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

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ title: "This Is My Title", themeColor: "#112211" });
            const obj = new UniteThemeConfigurationJson();
            engineVariablesStub.meta = new EngineVariablesMeta();

            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").themeColor).to.be.equal("#112211");
            Chai.expect(engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme").title).to.be.equal("This Is My Title");
        });
    });

    describe("configure", () => {
        it("can succeed with metadata", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(false);
            const obj = new UniteThemeConfigurationJson();
            engineVariablesStub.meta = new EngineVariablesMeta();
            engineVariablesStub.meta.title = "This Is My Title";
            engineVariablesStub.meta.shortName = "MyTitle";
            engineVariablesStub.meta.description = "My application";
            engineVariablesStub.meta.keywords = ["a", "b", "c"];
            engineVariablesStub.meta.author = "Martyn Janes";
            engineVariablesStub.meta.authorEmail = "fake@unitejs.com";
            engineVariablesStub.meta.authorWebSite = "http://author.unitejs.com";
            engineVariablesStub.meta.webSite = "http://unitejs.com";
            engineVariablesStub.meta.namespace = "unitejs.com";
            engineVariablesStub.meta.organization = "UniteJS";
            engineVariablesStub.meta.copyright = "(C) 2017 UniteJS";

            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const ut = engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme");
            Chai.expect(ut.title).to.be.equal("This Is My Title");
            Chai.expect(ut.shortName).to.be.equal("MyTitle");
            Chai.expect(ut.metaDescription).to.be.equal("My application");
            Chai.expect(ut.metaAuthor).to.be.equal("Martyn Janes");
            Chai.expect(ut.metaAuthorEmail).to.be.equal("fake@unitejs.com");
            Chai.expect(ut.metaAuthorWebSite).to.be.equal("http://author.unitejs.com");
            Chai.expect(ut.metaKeywords).to.be.deep.equal(["a", "b", "c"]);
            Chai.expect(ut.webSite).to.be.equal("http://unitejs.com");
            Chai.expect(ut.namespace).to.be.equal("unitejs.com");
            Chai.expect(ut.organization).to.be.equal("UniteJS");
            Chai.expect(ut.copyright).to.be.equal("(C) 2017 UniteJS");
        });

        it("can succeed with no metadata", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(false);
            const obj = new UniteThemeConfigurationJson();

            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const ut = engineVariablesStub.getConfiguration<UniteThemeConfiguration>("UniteTheme");
            Chai.expect(ut.title).to.be.equal("");
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
