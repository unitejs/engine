/**
 * Tests for ChromeHeadless.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../../../../src/configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { ChromeHeadless } from "../../../../../src/pipelineSteps/unitTestEngine/chromeHeadless";
import { FileSystemMock } from "../../fileSystem.mock";

describe("ChromeHeadless", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.unitTestEngine = "ChromeHeadless";
        uniteConfigurationStub.unitTestRunner = "Karma";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new ChromeHeadless();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new ChromeHeadless();
            uniteConfigurationStub.unitTestEngine = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new ChromeHeadless();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can be called with no configurations", async () => {
            const obj = new ChromeHeadless();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-chrome-launcher"]).to.be.equal("1.2.3");
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("Karma", { browsers: [] });

            const obj = new ChromeHeadless();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-chrome-launcher"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).contains("ChromeHeadless");
        });

        it("can be called with no configurations with false mainCondition", async () => {
            const obj = new ChromeHeadless();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "karma-chrome-launcher": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-chrome-launcher"]).to.be.equal(undefined);
        });

        it("can be called with configuration with false mainConditions", async () => {
            engineVariablesStub.setConfiguration("Karma", { browsers: [ "ChromeHeadless" ] });

            const obj = new ChromeHeadless();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "karma-chrome-launcher": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-chrome-launcher"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).not.contains("ChromeHeadless");
        });
    });
});
