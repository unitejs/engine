/**
 * Tests for Amd.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../dist/configuration/models/babel/babelConfiguration";
import { TypeScriptConfiguration } from "../../../../../dist/configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Amd } from "../../../../../dist/pipelineSteps/moduleType/amd";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Amd", () => {
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
        uniteConfigurationStub.moduleType = "AMD";
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
        const obj = new Amd();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Amd();
            uniteConfigurationStub.moduleType = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Amd();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can be called with no configurations", async () => {
            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations already set", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {} });
            engineVariablesStub.setConfiguration("Babel", { presets: [ ["env", { modules: "blah" }] ] });

            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal("amd");
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("amd");
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {} });
            engineVariablesStub.setConfiguration("Babel", { presets: [] });

            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal("amd");
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("amd");
        });

        it("can be called with no configurations with false mainCondition", async () => {
            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with configurations but no presets with false mainCondition", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: { module: "amd"} });
            engineVariablesStub.setConfiguration("Babel", { presets: [ ["es2016", { modules: "blah" }] ] });

            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("blah");
        });

        it("can be called with configurations with false mainCondition", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: { module: "amd"} });
            engineVariablesStub.setConfiguration("Babel", { presets: [ ["env", { modules: "amd" }] ] });

            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal(undefined);
        });
    });
});
