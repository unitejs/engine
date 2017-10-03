/**
 * Tests for WebdriverIo.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../../../../src/configuration/models/eslint/esLintConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { WebdriverIo } from "../../../../../src/pipelineSteps/e2eTestRunner/webdriverIo";
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
        uniteConfigurationStub.sourceLanguage = "TypeScript";
        uniteConfigurationStub.linter = "ESLint";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new WebdriverIo();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new WebdriverIo();
            uniteConfigurationStub.e2eTestRunner = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new WebdriverIo();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("initialise", () => {
        it("can setup the engine configuration", async () => {
            const obj = new WebdriverIo();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("WebdriverIO")).not.to.be.equal(undefined);
        });
    });

    describe("configure", () => {
        it("can be called with no configurations", async () => {
            const obj = new WebdriverIo();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.webdriverio).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["wdio-spec-reporter"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["wdio-allure-reporter"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["selenium-standalone"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["allure-commandline"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["@types/webdriverio"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["eslint-plugin-webdriverio"]).to.be.equal("1.2.3");
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("ESLint", { plugins: [], env: {} });

            const obj = new WebdriverIo();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).contains("webdriverio");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env["webdriverio/wdio"]).to.be.equal(true);
        });

        it("can be called with no configurations with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/", "wdio.conf.js", "Generated by UniteJS");

            const obj = new WebdriverIo();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {
                webdriverio: "1.2.3",
                "wdio-spec-reporter": "1.2.3",
                "wdio-allure-reporter": "1.2.3",
                "browser-sync": "1.2.3",
                "selenium-standalone": "1.2.3",
                "allure-commandline": "1.2.3",
                "@types/webdriverio": "1.2.3",
                "eslint-plugin-webdriverio": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.webdriverio).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-spec-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["wdio-allure-reporter"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["browser-sync"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["selenium-standalone"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["allure-commandline"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["@types/webdriverio"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["eslint-plugin-webdriverio"]).to.be.equal(undefined);
        });

        it("can be called with configurations", async () => {
            engineVariablesStub.setConfiguration("ESLint", { plugins: ["webdriverio"], env: { "webdriverio/wdio": true } });

            const obj = new WebdriverIo();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").plugins).not.contains("webdriverio");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").env["webdriverio/wdio"]).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can succeed writing", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new WebdriverIo();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").push("foo");

            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", "wdio.conf.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called with no configurations with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/", "wdio.conf.js", "Generated by UniteJS");

            const obj = new WebdriverIo();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/", "wdio.conf.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
