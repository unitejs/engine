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

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new Amd();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(5);
        });
    });

    describe("process", () => {
        it("can be called with mismatched module type", async () => {
            uniteConfigurationStub.moduleType = "CommonJS";
            const obj = new Amd();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.requirejs).to.be.equal(undefined);
        });

        it("can be called with matching module type and no engine configuration", async () => {
            const obj = new Amd();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.srcDistReplaceWith).to.be.equal("../dist/");
        });

        it("can throw exception", async () => {
            engineVariablesStub.setConfiguration("Babel", {});
            const obj = new Amd();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can be called with matching module type and engine configuration", async () => {
            engineVariablesStub.setConfiguration("TypeScript", { compilerOptions: {}});
            engineVariablesStub.setConfiguration("Babel", { presets: []});

            const obj = new Amd();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<TypeScriptConfiguration>("TypeScript").compilerOptions.module).to.be.equal("amd");
            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("amd");
        });

        it("can be called with matching module type and engine configuration, existing babel", async () => {
            engineVariablesStub.setConfiguration("Babel", { presets: [["es2015", { modules: "commonjs" }]]});

            const obj = new Amd();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<BabelConfiguration>("Babel").presets[0][1].modules).to.be.equal("amd");
        });
    });
});
