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
        const obj = new PhantomJs();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new PhantomJs();
            uniteConfigurationStub.unitTestEngine = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new PhantomJs();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("install", () => {
        it("can be called with no configurations", async () => {
            const obj = new PhantomJs();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal("1.2.3");
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("Karma", { browsers: [], files: [ { pattern: "aaa" } ] });

            const obj = new PhantomJs();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal("1.2.3");

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).contains("PhantomJS");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files.length).to.be.equal(2);
        });
    });

    describe("uninstall", () => {
        it("can be called with no configurations", async () => {
            const obj = new PhantomJs();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "karma-phantomjs-launcher": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal(undefined);
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("Karma", { browsers: [ "PhantomJS" ], files: [ { pattern: "aaa" }, { pattern: "./node_modules/bluebird/js/browser/bluebird.js"} ] });

            const obj = new PhantomJs();
            const res = await obj.uninstall(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "karma-phantomjs-launcher": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["karma-phantomjs-launcher"]).to.be.equal(undefined);

            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").browsers).not.contains("PhantomJS");
            Chai.expect(engineVariablesStub.getConfiguration<KarmaConfiguration>("Karma").files.length).to.be.equal(1);
        });
    });
});
