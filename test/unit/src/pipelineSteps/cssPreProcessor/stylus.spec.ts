/**
 * Tests for Stylus.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Stylus } from "../../../../../dist/pipelineSteps/cssPreProcessor/stylus";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Stylus", () => {
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
        uniteConfigurationStub.cssPre = "Stylus";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Stylus();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can not setup the engine configuration if not Stylus", async () => {
            const obj = new Stylus();
            uniteConfigurationStub.cssPre = "Sass";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.styleLanguageExt).to.be.equal(undefined);
        });

        it("can setup the engine configuration", async () => {
            const obj = new Stylus();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.styleLanguageExt).to.be.equal("styl");
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "pathCombine").throws("error");
            const obj = new Stylus();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can skip not Stylus", async () => {
            const obj = new Stylus();
            uniteConfigurationStub.cssPre = "Sass";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/stylus");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/css");
            Chai.expect(exists).to.be.equal(false);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.stylus).to.be.equal(undefined);
        });

        it("can create dirs if Stylus", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new Stylus();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/stylus");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/css");
            Chai.expect(exists).to.be.equal(true);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.stylus).to.be.equal("1.2.3");
        });
    });
});
