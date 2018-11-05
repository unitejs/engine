/**
 * Tests for Amd.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../../../../src/configuration/models/babel/babelConfiguration";
import { TypeScriptConfiguration } from "../../../../../src/configuration/models/typeScript/typeScriptConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Amd } from "../../../../../src/pipelineSteps/moduleType/amd";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Amd", () => {
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

    describe("initialise", () => {
        it("can be called with not matching condition", async () => {
            engineVariablesStub.moduleId = "foo";
            const obj = new Amd();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.moduleId).to.be.equal("foo");
        });

        it("can be called with matching condition", async () => {
            const obj = new Amd();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.moduleId).to.be.equal("module.id.toString()");
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
            engineVariablesStub.setConfiguration("Babel", { presets: [ ["@babel/preset-env", { modules: "blah" }] ] });

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
            engineVariablesStub.setConfiguration("Babel", { presets: [ ["@babel/preset-env", { modules: "amd" }] ] });

            const obj = new Amd();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal(undefined);
        });
    });
});
