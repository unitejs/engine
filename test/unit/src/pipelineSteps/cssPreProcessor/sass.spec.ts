/**
 * Tests for Sass.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Sass } from "../../../../../dist/pipelineSteps/cssPreProcessor/sass";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Sass", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariabSasstub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.cssPre = "Sass";

        engineVariabSasstub = new EngineVariables();
        engineVariabSasstub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariabSasstub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Sass();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can not setup the engine configuration if not Sass", async () => {
            const obj = new Sass();
            uniteConfigurationStub.cssPre = "Less";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariabSasstub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariabSasstub.styleLanguageExt).to.be.equal(undefined);
        });

        it("can setup the engine configuration", async () => {
            const obj = new Sass();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariabSasstub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariabSasstub.styleLanguageExt).to.be.equal("scss");
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "pathCombine").throws("error");
            const obj = new Sass();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariabSasstub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can skip not Sass", async () => {
            const obj = new Sass();
            uniteConfigurationStub.cssPre = "Less";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariabSasstub);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/sass");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/css");
            Chai.expect(exists).to.be.equal(false);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariabSasstub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["node-sass"]).to.be.equal(undefined);
        });

        it("can create dirs if Sass", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new Sass();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariabSasstub);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/sass");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/css");
            Chai.expect(exists).to.be.equal(true);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariabSasstub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["node-sass"]).to.be.equal("1.2.3");
        });
    });
});
