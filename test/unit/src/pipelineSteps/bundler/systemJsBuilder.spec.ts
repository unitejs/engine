/**
 * Tests for SystemJsBuilder.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { SystemJsBuilder } from "../../../../../src/pipelineSteps/bundler/systemJsBuilder";
import { FileSystemMock } from "../../fileSystem.mock";

describe("SystemJsBuilder", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.bundler = "SystemJSBuilder";
        uniteConfigurationStub.moduleType = "SystemJS";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new SystemJsBuilder();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new SystemJsBuilder();
            uniteConfigurationStub.bundler = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new SystemJsBuilder();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("initialise", () => {
        it("can be called with bundler not matching", async () => {
            const obj = new SystemJsBuilder();
            uniteConfigurationStub.bundler = "Webpack";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with bundler matching and working moduleType", async () => {
            const obj = new SystemJsBuilder();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new SystemJsBuilder();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["systemjs-builder"]).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new SystemJsBuilder();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "systemjs-builder": "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["systemjs-builder"]).to.be.equal(undefined);
        });
    });
});
