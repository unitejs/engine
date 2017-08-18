/**
 * Tests for SystemJsBuilder.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { SystemJsBuilder } from "../../../../../dist/pipelineSteps/bundler/systemJsBuilder";
import { FileSystemMock } from "../../fileSystem.mock";

describe("SystemJsBuilder", () => {
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
        uniteConfigurationStub.bundler = "SystemJSBuilder";
        uniteConfigurationStub.moduleType = "SystemJS";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", async () => {
        const obj = new SystemJsBuilder();
        Chai.should().exist(obj);
    });

    describe("preProcess", () => {
        it("can be called with bundler not matching", async () => {
            const obj = new SystemJsBuilder();
            uniteConfigurationStub.bundler = "Webpack";
            const res = await obj.preProcess(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with bundler matching but failing moduleType", async () => {
            const obj = new SystemJsBuilder();
            uniteConfigurationStub.moduleType = "CommonJS";
            const res = await obj.preProcess(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("can only use");
        });

        it("can be called with bundler matching and working moduleType", async () => {
            const obj = new SystemJsBuilder();
            const res = await obj.preProcess(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("process", () => {
        it("can be called with non matching bundler", async () => {
            const obj = new SystemJsBuilder();
            uniteConfigurationStub.bundler = "Webpack";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["systemjs-builder"]).to.be.equal(undefined);
        });

        it("can be called with matching bundler", async () => {
            const obj = new SystemJsBuilder();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["systemjs-builder"]).to.be.equal("1.2.3");
        });
    });
});
