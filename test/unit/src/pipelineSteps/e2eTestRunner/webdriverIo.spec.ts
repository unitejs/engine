/**
 * Tests for WebdriverIo.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../../../../dist/configuration/models/eslint/esLintConfiguration";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { WebdriverIo } from "../../../../../dist/pipelineSteps/e2eTestRunner/webdriverIo";
import { FileSystemMock } from "../../fileSystem.mock";

describe("WebdriverIo", () => {
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
        uniteConfigurationStub.e2eTestRunner = "WebdriverIO";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new WebdriverIo();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can not setup the engine configuration if not WebdriverIo", async () => {
            uniteConfigurationStub.e2eTestRunner = "None";
            const obj = new WebdriverIo();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("WebdriverIO")).to.be.equal(undefined);
        });

        it("can setup the engine configuration", async () => {
            const obj = new WebdriverIo();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("WebdriverIO")).not.to.be.equal(undefined);
        });
    });

    describe("process", () => {
        it("can fail if an exception is thrown", async () => {
            sandbox.stub(fileSystemMock, "fileWriteLines").throws("error");
            const obj = new WebdriverIo();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can skip if file has no generated marker", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteLines("./test/unit/temp/www/", "wdio.conf.js", []);

            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contains("Skipping");
        });

        it("can skip if not protracotr", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileExists").returns(false);
            uniteConfigurationStub.e2eTestRunner = "None";
            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.called).to.be.equal(true);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.webdriverio).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-spec-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-allure-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["selenium-standalone"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["allure-commandline"]).to.be.equal(undefined);
        });

        it("can set lint configuration if JavaScript", async () => {
            engineVariablesStub.setConfiguration("ESLint", { plugins: [], env: {} });
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).contains("webdriverio");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env["webdriverio/wdio"]).to.be.equal(true);
        });

        it("can set lint configuration if JavaScript", async () => {
            uniteConfigurationStub.linter = "ESLint";
            engineVariablesStub.setConfiguration("ESLint", { plugins: [], env: {} });
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).contains("webdriverio");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env["webdriverio/wdio"]).to.be.equal(true);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["eslint-plugin-webdriverio"]).to.be.equal("1.2.3");
        });

        it("can set configuration if TypeScript", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies["eslint-plugin-webdriverio"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/webdriverio"]).to.be.equal("1.2.3");
        });

        it("can write if file has a generated marker", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteLines("./test/unit/temp/www/", "wdio.conf.js", ["Generated by UniteJS"]);

            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contains("Generating");

            const lines = await fileSystemMock.fileReadLines("./test/unit/temp/www/", "wdio.conf.js");
            Chai.expect(lines.length).to.be.equal(25);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.webdriverio).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["wdio-spec-reporter"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["wdio-allure-reporter"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["selenium-standalone"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["allure-commandline"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["eslint-plugin-webdriverio"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/webdriverio"]).to.be.equal(undefined);
        });

        it("can write file with plugins", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            const plugins = engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins");
            plugins.push("plugin1");
            plugins.push("plugin2");

            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contains("Generating");

            const lines = await fileSystemMock.fileReadLines("./test/unit/temp/www/", "wdio.conf.js");
            Chai.expect(lines.length).to.be.equal(27);
        });
    });
});
