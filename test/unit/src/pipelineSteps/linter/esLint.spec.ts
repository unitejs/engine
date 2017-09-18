/**
 * Tests for EsLint.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { EsLint } from "../../../../../dist/pipelineSteps/linter/esLint";
import { EsLintConfiguration } from "../../../../../src/configuration/models/eslint/esLintConfiguration";
import { FileSystemMock } from "../../fileSystem.mock";

describe("EsLint", () => {
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
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.sourceLanguage = "JavaScript";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new EsLint();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new EsLint();
            uniteConfigurationStub.linter = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new EsLint();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
        it("can be called with mismatched linter", async () => {
            uniteConfigurationStub.linter = "TSLint";
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("ESLint")).to.be.equal(undefined);
        });

        it("can be called with mismatched language", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("ESLint")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("JavaScript");
        });

        it("can fail when exception is thrown on config", async () => {
            fileSystemMock.fileExists = sandbox.stub().throws("error");
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("ESLint")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when exception is thrown on ignore", async () => {
            fileSystemMock.fileExists = sandbox.stub().onSecondCall().throws("error");
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("ESLint")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can succeed when config file does not exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().resolves(false);
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parserOptions.ecmaVersion).to.be.equal(6);
        });

        it("can succeed when config file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ parserOptions: { ecmaVersion: 7 } });
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parserOptions.ecmaVersion).to.be.equal(7);
        });

        it("can succeed when config file does exist but forced", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ parserOptions: { ecmaVersion: 7 } });
            engineVariablesStub.force = true;
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").parserOptions.ecmaVersion).to.be.equal(6);
        });

        it("can succeed when ignore file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onSecondCall().resolves(true);
            fileSystemMock.fileReadLines = sandbox.stub().resolves(["dist", "# Generated by UniteJS", ""]);
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("ESLint.Ignore").length).to.be.equal(5);
        });
    });

    describe("install", () => {
        it("can be called with mismatched linter", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["# Generated by UniteJS"]);
            const stub = sandbox.stub(fileSystemMock, "fileDelete").resolves(0);
            uniteConfigurationStub.linter = "TSLint";
            const obj = new EsLint();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.callCount).to.be.equal(2);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.eslint).to.be.equal(undefined);
        });

        it("can be called with mismatched linter and not existing", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["# Generated by UniteJS"]);
            const stub = sandbox.stub(fileSystemMock, "fileDelete").rejects("error");
            uniteConfigurationStub.linter = "TSLint";
            const obj = new EsLint();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(stub.callCount).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.eslint).to.be.equal(undefined);
        });

        it("can fail writing config", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").rejects("error");
            const obj = new EsLint();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.eslint).to.be.equal("1.2.3");
        });

        it("can fail writing ignore", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["# Generated by UniteJS"]);
            sandbox.stub(fileSystemMock, "fileWriteLines").rejects("error");
            const obj = new EsLint();
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.eslint).to.be.equal("1.2.3");
        });

        it("can skip writing ignore", async () => {
            sandbox.stub(fileSystemMock, "fileExists").onThirdCall().resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves([]);
            sandbox.stub(fileSystemMock, "fileWriteJson").resolves();
            sandbox.stub(fileSystemMock, "fileWriteLines").resolves();
            const obj = new EsLint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[loggerInfoSpy.args.length - 1][0]).contains("Skipping");
        });

        it("can write ignore", async() => {
            sandbox.stub(fileSystemMock, "fileExists").onThirdCall().resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["# Generated by UniteJS"]);
            sandbox.stub(fileSystemMock, "fileWriteJson").resolves();
            sandbox.stub(fileSystemMock, "fileWriteLines").resolves();
            const obj = new EsLint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.install(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[loggerInfoSpy.args.length - 1][0]).contains("Generating");

        });
    });
});
