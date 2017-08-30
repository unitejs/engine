/**
 * Tests for Css.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Css } from "../../../../../dist/pipelineSteps/cssPre/css";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Css", () => {
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
        uniteConfigurationStub.cssPre = "Css";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Css();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can not setup the engine configuration if not Css", async () => {
            const obj = new Css();
            uniteConfigurationStub.cssPre = "Sass";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.styleLanguageExt).to.be.equal(undefined);
        });

        it("can setup the engine configuration", async () => {
            const obj = new Css();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.styleLanguageExt).to.be.equal("css");
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate").throws("error");
            const obj = new Css();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can skip not css", async () => {
            const obj = new Css();
            uniteConfigurationStub.cssPre = "Sass";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/cssSrc");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/css");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can create dirs if css", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new Css();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/cssSrc");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/css");
            Chai.expect(exists).to.be.equal(true);
        });
    });
});
