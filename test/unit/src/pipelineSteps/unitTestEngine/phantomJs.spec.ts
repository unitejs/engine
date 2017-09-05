/**
 * Tests for PhantomJs.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../../../../dist/configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { PhantomJs } from "../../../../../dist/pipelineSteps/unitTestEngine/phantomJs";
import { FileSystemMock } from "../../fileSystem.mock";

describe("PhantomJs", () => {
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
        uniteConfigurationStub.unitTestEngine = "PhantomJS";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new PhantomJs();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new PhantomJs();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(3);
        });
    });

    describe("process", () => {
        it("can be called with undefined test engine", async () => {
            uniteConfigurationStub.unitTestEngine = undefined;
            uniteConfigurationStub.unitTestRunner = undefined;
            const obj = new PhantomJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies.bluebird).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
        });

        it("can be called with unit engine defined but no karma config", async () => {
            uniteConfigurationStub.unitTestRunner = "Karma";

            const obj = new PhantomJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.bluebird).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma")).to.be.equal(undefined);
        });

        it("can be called with unit engine defined", async () => {
            uniteConfigurationStub.unitTestRunner = "Karma";

            engineVariablesStub.setConfiguration("Karma", { browsers: [], files: [] });

            const obj = new PhantomJs();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies.bluebird).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).contains("PhantomJS");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files.length).to.be.equal(1);
        });
    });
});
