/**
 * Tests for JsDom.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../../../../src/configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { JsDom } from "../../../../../src/pipelineSteps/unitTestEngine/jsDom";
import { FileSystemMock } from "../../fileSystem.mock";

describe("JsDom", () => {
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
        uniteConfigurationStub.unitTestEngine = "JsDom";
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
        const obj = new JsDom();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new JsDom();
            uniteConfigurationStub.unitTestEngine = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new JsDom();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can be called with no configurations", async () => {
            const obj = new JsDom();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-jsdom-launcher"]).to.be.equal("1.2.3");
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("Karma", { browsers: [], files: [ { pattern: "aaa" } ] });

            const obj = new JsDom();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-jsdom-launcher"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).contains("jsdom");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files.length).to.be.equal(1);
        });

        it("can be called with no configurations with false mainCondition", async () => {
            const obj = new JsDom();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "karma-jsdom-launcher": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-jsdom-launcher"]).to.be.equal(undefined);
        });

        it("can be called with configurations with false mainCondition", async () => {
            engineVariablesStub.setConfiguration("Karma", { browsers: [ "jsdom" ], files: [ { pattern: "aaa" } ] });

            const obj = new JsDom();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "karma-JsDom-launcher": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-jsdomlauncher"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).not.contains("jsdom");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files.length).to.be.equal(1);
        });
    });
});
